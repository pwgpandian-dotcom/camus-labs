"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: boolean; error?: string };

/** Every admin action re-checks the caller's role; RLS (is_staff) is the second lock. */
async function staff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!p || !["admin", "operator", "sales"].includes(p.role)) return null;
  return { supabase, user, isAdmin: p.role === "admin" };
}

async function audit(s: NonNullable<Awaited<ReturnType<typeof staff>>>, action: string, entity: string, entityId: string | null, meta?: Record<string, unknown>) {
  await s.supabase.from("learn_audit_log").insert({ actor_id: s.user.id, action, entity, entity_id: entityId, meta: (meta ?? null) as never });
}

const fail = (error: string): Result => ({ ok: false, error });

/* ------------------------------- Subscriptions ------------------------------- */
export async function activateSubscription(_: Result | null, fd: FormData): Promise<Result> {
  const s = await staff();
  if (!s) return fail("Not authorised.");
  const p = z
    .object({
      id: z.string().uuid(),
      amount: z.coerce.number().min(0).max(10_000_000),
      method: z.string().trim().min(2).max(40),
      reference: z.string().trim().max(120).optional(),
    })
    .safeParse(Object.fromEntries(fd));
  if (!p.success) return fail(p.error.issues[0].message);
  const { data: sub } = await s.supabase.from("learn_subscriptions").select("*").eq("id", p.data.id).maybeSingle();
  if (!sub) return fail("Subscription not found.");
  const { data: cur } = await s.supabase.from("learn_currencies").select("minor_units").eq("code", sub.currency_code).maybeSingle();
  const minor = Math.round(p.data.amount * 10 ** (cur?.minor_units ?? 2));
  const end = new Date();
  if (sub.billing_interval === "year") end.setFullYear(end.getFullYear() + 1);
  else end.setMonth(end.getMonth() + 1);

  const { error } = await s.supabase.from("learn_subscriptions").update({ status: "active", current_period_end: end.toISOString() }).eq("id", sub.id);
  if (error) return fail("Couldn't activate.");
  await s.supabase.from("learn_payments").insert({
    user_id: sub.user_id,
    subscription_id: sub.id,
    amount_minor: minor,
    currency_code: sub.currency_code,
    provider: p.data.method.toLowerCase(),
    provider_ref: p.data.reference || null,
    status: "paid",
  });
  if (sub.coupon_code) {
    const { data: c } = await s.supabase.from("learn_coupons").select("redeemed_count").eq("code", sub.coupon_code).maybeSingle();
    if (c) await s.supabase.from("learn_coupons").update({ redeemed_count: c.redeemed_count + 1 }).eq("code", sub.coupon_code);
  }
  await s.supabase.from("learn_notifications").insert({ user_id: sub.user_id, kind: "billing", title: "Your plan is active", body: "Thanks for your payment — your upgrade is now live.", href: "/app/billing" });
  await audit(s, "activate", "learn_subscriptions", sub.id, { amount_minor: minor, method: p.data.method });
  revalidatePath("/admin/learn/subscriptions");
  return { ok: true };
}

export async function setSubscriptionStatus(id: string, status: "cancelled" | "expired" | "past_due") {
  const s = await staff();
  if (!s || !z.string().uuid().safeParse(id).success) return;
  await s.supabase.from("learn_subscriptions").update({ status }).eq("id", id);
  await audit(s, status, "learn_subscriptions", id);
  revalidatePath("/admin/learn/subscriptions");
}

/* ------------------------------- Pricing ------------------------------- */
export async function savePlan(_: Result | null, fd: FormData): Promise<Result> {
  const s = await staff();
  if (!s) return fail("Not authorised.");
  const p = z
    .object({
      id: z.string().regex(/^[a-z0-9_-]{2,40}$/, "Plan id: lowercase letters, numbers, - or _"),
      name: z.string().trim().min(1).max(60),
      tagline: z.string().trim().max(160).optional(),
      features: z.string().max(4000),
      tier: z.coerce.number().int().min(0).max(9),
      ai_messages_per_day: z.coerce.number().int().min(0).max(100000),
      trial_days: z.coerce.number().int().min(0).max(90),
      sort: z.coerce.number().int().min(0).max(999),
      is_active: z.string().optional(),
    })
    .safeParse(Object.fromEntries(fd));
  if (!p.success) return fail(p.error.issues[0].message);
  const features = p.data.features.split("\n").map((f) => f.trim()).filter(Boolean).slice(0, 20);
  const { error } = await s.supabase.from("learn_plans").upsert({ ...p.data, tagline: p.data.tagline || null, features, is_active: p.data.is_active === "on" });
  if (error) return fail("Couldn't save plan.");
  await audit(s, "upsert", "learn_plans", p.data.id);
  revalidatePath("/admin/learn/pricing");
  revalidatePath("/learn");
  return { ok: true };
}

export async function savePrice(_: Result | null, fd: FormData): Promise<Result> {
  const s = await staff();
  if (!s) return fail("Not authorised.");
  const p = z
    .object({
      plan_id: z.string().min(1),
      currency_code: z.string().regex(/^[A-Z]{3}$/),
      billing_interval: z.enum(["month", "year"]),
      amount: z.coerce.number().min(0).max(10_000_000),
    })
    .safeParse(Object.fromEntries(fd));
  if (!p.success) return fail(p.error.issues[0].message);
  const { data: cur } = await s.supabase.from("learn_currencies").select("minor_units").eq("code", p.data.currency_code).maybeSingle();
  if (!cur) return fail("Unknown currency.");
  const { error } = await s.supabase.from("learn_plan_prices").upsert({
    plan_id: p.data.plan_id,
    currency_code: p.data.currency_code,
    billing_interval: p.data.billing_interval,
    amount_minor: Math.round(p.data.amount * 10 ** cur.minor_units),
  });
  if (error) return fail("Couldn't save price.");
  await audit(s, "upsert", "learn_plan_prices", `${p.data.plan_id}:${p.data.currency_code}:${p.data.billing_interval}`);
  revalidatePath("/admin/learn/pricing");
  revalidatePath("/learn");
  return { ok: true };
}

export async function deletePrice(planId: string, currency: string, interval: string) {
  const s = await staff();
  if (!s) return;
  await s.supabase.from("learn_plan_prices").delete().match({ plan_id: planId, currency_code: currency, billing_interval: interval });
  await audit(s, "delete", "learn_plan_prices", `${planId}:${currency}:${interval}`);
  revalidatePath("/admin/learn/pricing");
}

export async function saveCoupon(_: Result | null, fd: FormData): Promise<Result> {
  const s = await staff();
  if (!s) return fail("Not authorised.");
  const p = z
    .object({
      code: z.string().trim().toUpperCase().regex(/^[A-Z0-9_-]{3,40}$/, "Code: 3–40 letters/numbers"),
      percent_off: z.coerce.number().int().min(1).max(100),
      valid_until: z.string().optional(),
      max_redemptions: z.string().optional(),
    })
    .safeParse(Object.fromEntries(fd));
  if (!p.success) return fail(p.error.issues[0].message);
  const { error } = await s.supabase.from("learn_coupons").upsert({
    code: p.data.code,
    percent_off: p.data.percent_off,
    valid_until: p.data.valid_until ? new Date(p.data.valid_until).toISOString() : null,
    max_redemptions: p.data.max_redemptions ? Number(p.data.max_redemptions) : null,
    is_active: true,
  });
  if (error) return fail("Couldn't save coupon.");
  await audit(s, "upsert", "learn_coupons", p.data.code);
  revalidatePath("/admin/learn/pricing");
  return { ok: true };
}

export async function toggleCoupon(code: string, active: boolean) {
  const s = await staff();
  if (!s) return;
  await s.supabase.from("learn_coupons").update({ is_active: active }).eq("code", code);
  revalidatePath("/admin/learn/pricing");
}

/* ------------------------------- AI config ------------------------------- */
export async function saveAIConfig(_: Result | null, fd: FormData): Promise<Result> {
  const s = await staff();
  if (!s || !s.isAdmin) return fail("Only admins can change AI configuration.");
  const p = z
    .object({
      feature: z.enum(["assistant", "structured", "interview"]),
      provider: z.enum(["anthropic", "openai", "google"]),
      model: z.string().trim().min(2).max(100),
      temperature: z.coerce.number().min(0).max(2),
      max_output_tokens: z.coerce.number().int().min(64).max(16000),
    })
    .safeParse(Object.fromEntries(fd));
  if (!p.success) return fail(p.error.issues[0].message);
  const { error } = await s.supabase.from("learn_ai_config").upsert({ ...p.data, is_active: true });
  if (error) return fail("Couldn't save.");
  await audit(s, "upsert", "learn_ai_config", p.data.feature, p.data);
  revalidatePath("/admin/learn/ai");
  return { ok: true };
}

export async function savePrompt(_: Result | null, fd: FormData): Promise<Result> {
  const s = await staff();
  if (!s || !s.isAdmin) return fail("Only admins can change prompts.");
  const key = String(fd.get("key") ?? "");
  const text = String(fd.get("system_prompt") ?? "").trim();
  if (!/^assistant\.(general|study|career|resume|interview|project|founder)$/.test(key)) return fail("Unknown prompt key.");
  if (!text) {
    await s.supabase.from("learn_prompts").delete().eq("key", key);
    await audit(s, "reset", "learn_prompts", key);
  } else {
    const { data: existing } = await s.supabase.from("learn_prompts").select("version").eq("key", key).maybeSingle();
    const { error } = await s.supabase.from("learn_prompts").upsert({ key, system_prompt: text.slice(0, 8000), version: (existing?.version ?? 0) + 1, updated_at: new Date().toISOString() });
    if (error) return fail("Couldn't save.");
    await audit(s, "upsert", "learn_prompts", key);
  }
  revalidatePath("/admin/learn/ai");
  return { ok: true };
}

/* ------------------------------- Exams ------------------------------- */
export async function saveExam(_: Result | null, fd: FormData): Promise<Result> {
  const s = await staff();
  if (!s) return fail("Not authorised.");
  const p = z
    .object({
      slug: z.string().regex(/^[a-z0-9-]{2,40}$/, "Slug: lowercase letters, numbers and dashes"),
      name: z.string().trim().min(2).max(80),
      country_code: z.string().optional(),
      description: z.string().trim().max(400).optional(),
      subjects: z.string().max(600),
    })
    .safeParse(Object.fromEntries(fd));
  if (!p.success) return fail(p.error.issues[0].message);
  const subjects = p.data.subjects.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 12);
  if (!subjects.length) return fail("Add at least one subject.");
  const { error } = await s.supabase.from("learn_exams").upsert({ slug: p.data.slug, name: p.data.name, country_code: p.data.country_code || null, description: p.data.description || null, subjects, is_active: true });
  if (error) return fail("Couldn't save exam.");
  await audit(s, "upsert", "learn_exams", p.data.slug);
  revalidatePath("/admin/learn/exams");
  return { ok: true };
}

export async function toggleExam(slug: string, active: boolean) {
  const s = await staff();
  if (!s) return;
  await s.supabase.from("learn_exams").update({ is_active: active }).eq("slug", slug);
  revalidatePath("/admin/learn/exams");
}

export async function addQuestion(_: Result | null, fd: FormData): Promise<Result> {
  const s = await staff();
  if (!s) return fail("Not authorised.");
  const p = z
    .object({
      exam_slug: z.string().min(1),
      subject: z.string().trim().min(1).max(80),
      topic: z.string().trim().min(1).max(120),
      prompt: z.string().trim().min(5).max(2000),
      a: z.string().trim().min(1).max(400),
      b: z.string().trim().min(1).max(400),
      c: z.string().trim().min(1).max(400),
      d: z.string().trim().min(1).max(400),
      answer: z.enum(["0", "1", "2", "3"]),
      explanation: z.string().trim().max(2000).optional(),
      difficulty: z.enum(["1", "2", "3"]),
    })
    .safeParse(Object.fromEntries(fd));
  if (!p.success) return fail(p.error.issues[0].message);
  const d = p.data;
  const { error } = await s.supabase.from("learn_exam_questions").insert({
    exam_slug: d.exam_slug,
    subject: d.subject,
    topic: d.topic,
    prompt: d.prompt,
    options: [d.a, d.b, d.c, d.d],
    answer_index: Number(d.answer),
    explanation: d.explanation || null,
    difficulty: Number(d.difficulty),
  });
  if (error) return fail("Couldn't save question.");
  await audit(s, "insert", "learn_exam_questions", d.exam_slug);
  revalidatePath("/admin/learn/exams");
  return { ok: true };
}

export async function deleteQuestion(id: string) {
  const s = await staff();
  if (!s || !z.string().uuid().safeParse(id).success) return;
  await s.supabase.from("learn_exam_questions").delete().eq("id", id);
  revalidatePath("/admin/learn/exams");
}

/* ------------------------------- Flags & regions ------------------------------- */
export async function toggleFlag(key: string, enabled: boolean) {
  const s = await staff();
  if (!s || !s.isAdmin) return;
  await s.supabase.from("learn_feature_flags").update({ enabled }).eq("key", key);
  await audit(s, enabled ? "enable" : "disable", "learn_feature_flags", key);
  revalidatePath("/admin/learn/settings");
}

export async function toggleCountry(code: string, active: boolean) {
  const s = await staff();
  if (!s) return;
  await s.supabase.from("learn_countries").update({ is_active: active }).eq("code", code);
  revalidatePath("/admin/learn/settings");
}

export async function addCountry(_: Result | null, fd: FormData): Promise<Result> {
  const s = await staff();
  if (!s) return fail("Not authorised.");
  const p = z
    .object({
      code: z.string().trim().toUpperCase().regex(/^[A-Z]{2}$/, "Use a 2-letter ISO country code"),
      name: z.string().trim().min(2).max(80),
      currency_code: z.string().regex(/^[A-Z]{3}$/),
      default_locale: z.string().regex(/^[a-z]{2}$/).default("en"),
    })
    .safeParse(Object.fromEntries(fd));
  if (!p.success) return fail(p.error.issues[0].message);
  const { error } = await s.supabase.from("learn_countries").upsert({ ...p.data, is_active: true });
  if (error) return fail("Couldn't save country.");
  revalidatePath("/admin/learn/settings");
  return { ok: true };
}
