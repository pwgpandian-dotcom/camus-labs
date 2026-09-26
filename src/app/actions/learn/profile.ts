"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getLearner } from "@/lib/learn/server";
import { isLocale } from "@/lib/learn/i18n";

const year = z.coerce.number().int().min(1950).max(2100).optional().or(z.literal("").transform(() => undefined));
const dateStr = z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/).optional().or(z.literal("").transform(() => undefined));

const educationSchema = z.object({
  institution: z.string().trim().min(1, "Institution is required").max(160),
  qualification: z.string().trim().min(1, "Qualification is required").max(160),
  field: z.string().trim().max(160).optional(),
  start_year: year,
  end_year: year,
  grade: z.string().trim().max(40).optional(),
});

const experienceSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(160),
  title: z.string().trim().min(1, "Title is required").max(160),
  start_date: dateStr,
  end_date: dateStr,
  description: z.string().trim().max(2000).optional(),
});

const certSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  issuer: z.string().trim().max(160).optional(),
  issued_on: dateStr,
  url: z.string().trim().url().max(300).optional().or(z.literal("").transform(() => undefined)),
});

export type FormResult = { ok: boolean; error?: string };

function toMonthDate(v?: string) {
  return v && /^\d{4}-\d{2}$/.test(v) ? `${v}-01` : v ?? null;
}

export async function addEducation(_: FormResult | null, fd: FormData): Promise<FormResult> {
  const learner = await getLearner();
  if (!learner) return { ok: false, error: "Please sign in again." };
  const p = educationSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  const { error } = await learner.supabase.from("learn_education").insert({ ...p.data, user_id: learner.user.id });
  revalidatePath("/app/profile");
  return error ? { ok: false, error: "Couldn't save. Try again." } : { ok: true };
}

export async function addExperience(_: FormResult | null, fd: FormData): Promise<FormResult> {
  const learner = await getLearner();
  if (!learner) return { ok: false, error: "Please sign in again." };
  const p = experienceSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  const { error } = await learner.supabase.from("learn_experience").insert({
    ...p.data,
    start_date: toMonthDate(p.data.start_date),
    end_date: toMonthDate(p.data.end_date),
    user_id: learner.user.id,
  });
  revalidatePath("/app/profile");
  return error ? { ok: false, error: "Couldn't save. Try again." } : { ok: true };
}

export async function addCertification(_: FormResult | null, fd: FormData): Promise<FormResult> {
  const learner = await getLearner();
  if (!learner) return { ok: false, error: "Please sign in again." };
  const p = certSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { ok: false, error: p.error.issues[0].message };
  const { error } = await learner.supabase.from("learn_certifications").insert({ ...p.data, issued_on: toMonthDate(p.data.issued_on), user_id: learner.user.id });
  revalidatePath("/app/profile");
  return error ? { ok: false, error: "Couldn't save. Try again." } : { ok: true };
}

const tables = { education: "learn_education", experience: "learn_experience", certification: "learn_certifications" } as const;

export async function deleteTwinItem(kind: keyof typeof tables, id: string) {
  const learner = await getLearner();
  if (!learner || !z.string().uuid().safeParse(id).success || !(kind in tables)) return;
  await learner.supabase.from(tables[kind]).delete().eq("id", id);
  revalidatePath("/app/profile");
}

export async function updatePreferences(_: FormResult | null, fd: FormData): Promise<FormResult> {
  const learner = await getLearner();
  if (!learner) return { ok: false, error: "Please sign in again." };
  const locale = String(fd.get("locale") ?? "en");
  if (!isLocale(locale)) return { ok: false, error: "Unsupported language." };
  const prefs = {
    study_reminders: fd.get("study_reminders") === "on",
    streaks: fd.get("streaks") === "on",
    interview_reminders: fd.get("interview_reminders") === "on",
    project_milestones: fd.get("project_milestones") === "on",
    billing: fd.get("billing") === "on",
  };
  const [a, b] = await Promise.all([
    learner.supabase.from("learn_profiles").update({ locale }).eq("user_id", learner.user.id),
    learner.supabase.from("learn_notification_prefs").upsert({ user_id: learner.user.id, ...prefs }),
  ]);
  revalidatePath("/app", "layout");
  return a.error || b.error ? { ok: false, error: "Couldn't save settings." } : { ok: true };
}

/** Deletes all Camus Learn data for this learner (keeps the account for other Camus products). */
export async function deleteLearnData(fd: FormData) {
  const learner = await getLearner();
  if (!learner) return;
  if (String(fd.get("confirm") ?? "").trim().toUpperCase() !== "DELETE") return;
  // learn_profiles cascade isn't linked to other learn_* rows (they reference auth.users),
  // so delete each owned table explicitly. RLS limits every delete to this user.
  const owned = [
    "learn_messages", "learn_conversations", "learn_resume_versions", "learn_resumes", "learn_job_analyses",
    "learn_interviews", "learn_skill_progress", "learn_quiz_attempts", "learn_project_tasks", "learn_projects",
    "learn_founder_workspaces", "learn_activity", "learn_notifications", "learn_push_subscriptions",
    "learn_education", "learn_experience", "learn_certifications", "learn_notification_prefs", "learn_profiles",
  ] as const;
  for (const t of owned) await learner.supabase.from(t).delete().eq("user_id", learner.user.id);
  redirect("/learn?deleted=1");
}
