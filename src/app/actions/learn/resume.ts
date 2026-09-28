"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getLearner } from "@/lib/learn/server";
import { resumeDataSchema, type ResumeData } from "@/lib/learn/schemas";
import { assertQuota, completeJSON } from "@/lib/learn/ai/service";
import { AIError } from "@/lib/learn/ai/types";

const uuid = z.string().uuid();
const TEMPLATES = ["classic", "modern", "compact"] as const;

/** Builds a starting resume purely from facts already in the Career Twin. */
export async function createResume() {
  const learner = await getLearner();
  if (!learner) redirect("/login?redirect=/app/resume");
  const { supabase, user, profile } = learner;
  const [edu, exp, certs, projects] = await Promise.all([
    supabase.from("learn_education").select("*").eq("user_id", user.id).order("end_year", { ascending: false, nullsFirst: true }),
    supabase.from("learn_experience").select("*").eq("user_id", user.id).order("start_date", { ascending: false }),
    supabase.from("learn_certifications").select("*").eq("user_id", user.id),
    supabase.from("learn_projects").select("title, spec, repo_url, live_url, status").eq("user_id", user.id).eq("status", "completed"),
  ]);

  const data: ResumeData = resumeDataSchema.parse({
    basics: {
      name: profile?.display_name ?? "",
      headline: profile?.target_role ?? "",
      email: user.email ?? "",
      phone: "",
      location: "",
      links: [],
      summary: "",
    },
    education: (edu.data ?? []).map((e) => ({
      institution: e.institution,
      qualification: [e.qualification, e.field].filter(Boolean).join(", "),
      start: e.start_year ? String(e.start_year) : "",
      end: e.end_year ? String(e.end_year) : "",
      details: e.grade ?? "",
    })),
    experience: (exp.data ?? []).map((e) => ({
      company: e.company,
      title: e.title,
      location: "",
      start: e.start_date?.slice(0, 7) ?? "",
      end: e.end_date?.slice(0, 7) ?? "",
      bullets: (e.description ?? "").split(/\n+/).map((l) => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean).slice(0, 6),
    })),
    // Only projects the learner actually marked complete.
    projects: (projects.data ?? []).map((p) => ({
      name: p.title,
      link: p.live_url || p.repo_url || "",
      bullets: [((p.spec as { portfolioDescription?: string })?.portfolioDescription ?? "").slice(0, 400)].filter(Boolean),
    })),
    skills: profile?.skills ?? [],
    certifications: (certs.data ?? []).map((c) => ({ name: c.name, issuer: c.issuer ?? "", year: c.issued_on?.slice(0, 4) ?? "" })),
  });

  const { data: created, error } = await supabase
    .from("learn_resumes")
    .insert({ user_id: user.id, title: profile?.target_role ? `${profile.target_role} resume` : "My resume", data })
    .select("id")
    .single();
  if (error || !created) redirect("/app/resume?error=create");
  await supabase.from("learn_activity").insert({ user_id: user.id, kind: "resume" });
  redirect(`/app/resume/${created.id}`);
}

export async function saveResume(id: string, payload: { title: string; template: string; data: unknown; snapshotNote?: string | null }) {
  const learner = await getLearner();
  if (!learner || !uuid.safeParse(id).success) return { ok: false, error: "Please sign in again." };
  const parsed = resumeDataSchema.safeParse(payload.data);
  if (!parsed.success) return { ok: false, error: `Check your resume: ${parsed.error.issues[0].path.join(" › ")} — ${parsed.error.issues[0].message}` };
  const template = TEMPLATES.includes(payload.template as (typeof TEMPLATES)[number]) ? payload.template : "classic";
  const title = payload.title.trim().slice(0, 120) || "My resume";
  const { supabase, user } = learner;
  const { error } = await supabase.from("learn_resumes").update({ title, template, data: parsed.data }).eq("id", id);
  if (error) return { ok: false, error: "Couldn't save. Try again." };
  if (payload.snapshotNote !== undefined) {
    await supabase.from("learn_resume_versions").insert({ resume_id: id, user_id: user.id, data: parsed.data, note: payload.snapshotNote?.slice(0, 120) || null });
  }
  revalidatePath(`/app/resume/${id}`);
  return { ok: true };
}

export async function duplicateResume(id: string) {
  const learner = await getLearner();
  if (!learner || !uuid.safeParse(id).success) return;
  const { data: src } = await learner.supabase.from("learn_resumes").select("title, template, data").eq("id", id).maybeSingle();
  if (!src) return;
  const { data: copy } = await learner.supabase
    .from("learn_resumes")
    .insert({ user_id: learner.user.id, title: `${src.title} (copy)`.slice(0, 120), template: src.template, data: src.data })
    .select("id")
    .single();
  revalidatePath("/app/resume");
  if (copy) redirect(`/app/resume/${copy.id}`);
}

export async function deleteResume(id: string) {
  const learner = await getLearner();
  if (!learner || !uuid.safeParse(id).success) return;
  await learner.supabase.from("learn_resumes").delete().eq("id", id);
  revalidatePath("/app/resume");
  redirect("/app/resume");
}

export async function restoreVersion(resumeId: string, versionId: string) {
  const learner = await getLearner();
  if (!learner || !uuid.safeParse(resumeId).success || !uuid.safeParse(versionId).success) return { ok: false };
  const { data: v } = await learner.supabase.from("learn_resume_versions").select("data").eq("id", versionId).eq("resume_id", resumeId).maybeSingle();
  if (!v) return { ok: false };
  await learner.supabase.from("learn_resumes").update({ data: v.data }).eq("id", resumeId);
  revalidatePath(`/app/resume/${resumeId}`);
  return { ok: true, data: v.data as ResumeData };
}

const rewriteSchema = z.object({
  suggestion: z.string().max(500),
  note: z.string().max(300),
  needsNumbers: z.boolean(),
});

/**
 * Rewrites ONE bullet for clarity and impact without adding facts. If the
 * original lacks a measurable result, the model asks for one instead of
 * inventing a number.
 */
export async function improveBullet(text: string, context: { role?: string; targetRole?: string }) {
  const learner = await getLearner();
  if (!learner) return { ok: false as const, error: "Please sign in again." };
  const t = text.trim().slice(0, 500);
  if (t.length < 3) return { ok: false as const, error: "Write a bullet first." };
  try {
    await assertQuota(learner.supabase, learner.plan?.ai_messages_per_day ?? 15);
    const r = await completeJSON({
      supabase: learner.supabase,
      userId: learner.user.id,
      usageLabel: "resume:bullet",
      schema: rewriteSchema,
      instructions: `Rewrite a single resume bullet to be clear, specific and action-led (strong verb, what, how, result).
STRICT: use only facts present in the original. Never add numbers, percentages, tools, employers, team sizes or outcomes that are not in the original.
If there is no measurable result, keep it qualitative and set needsNumbers=true with a note asking the learner what real result they could add.
Return JSON: {"suggestion": string, "note": string, "needsNumbers": boolean}.`,
      messages: [{ role: "user", content: `Role: ${context.role ?? "n/a"}\nTarget role: ${context.targetRole ?? "n/a"}\nOriginal bullet: ${t}` }],
    });
    return { ok: true as const, ...r };
  } catch (e) {
    return { ok: false as const, error: e instanceof AIError ? e.message : "Couldn't improve this bullet right now." };
  }
}

const summarySchema = z.object({ summary: z.string().max(700) });

export async function draftSummary(resume: unknown) {
  const learner = await getLearner();
  if (!learner) return { ok: false as const, error: "Please sign in again." };
  const parsed = resumeDataSchema.safeParse(resume);
  if (!parsed.success) return { ok: false as const, error: "Save your resume first." };
  try {
    await assertQuota(learner.supabase, learner.plan?.ai_messages_per_day ?? 15);
    const r = await completeJSON({
      supabase: learner.supabase,
      userId: learner.user.id,
      usageLabel: "resume:summary",
      schema: summarySchema,
      instructions: `Write a 2–3 sentence professional summary using ONLY the facts in this resume JSON. No invented years of experience, metrics, employers or credentials. Plain, confident, specific. Return {"summary": string}.`,
      messages: [{ role: "user", content: JSON.stringify({ ...parsed.data, basics: { ...parsed.data.basics, email: "", phone: "" } }) }],
    });
    return { ok: true as const, summary: r.summary };
  } catch (e) {
    return { ok: false as const, error: e instanceof AIError ? e.message : "Couldn't draft a summary right now." };
  }
}
