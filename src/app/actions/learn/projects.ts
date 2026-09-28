"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLearner, learnerContext } from "@/lib/learn/server";
import { projectSpecSchema } from "@/lib/learn/schemas";
import { assertQuota, completeJSON } from "@/lib/learn/ai/service";
import { AIError } from "@/lib/learn/ai/types";

const genSchema = z.object({
  goal: z.string().trim().min(3, "Tell us what you want to become or learn").max(300),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  idea: z.string().trim().max(600).optional().default(""),
});

export async function generateProject(_: { error: string | null } | null, fd: FormData) {
  const learner = await getLearner();
  if (!learner) return { error: "Please sign in again." };
  const p = genSchema.safeParse({ goal: fd.get("goal"), level: fd.get("level"), idea: fd.get("idea") ?? "" });
  if (!p.success) return { error: p.error.issues[0].message };
  const { supabase, user, profile, plan } = learner;

  let spec;
  try {
    await assertQuota(supabase, plan?.ai_messages_per_day ?? 15);
    spec = await completeJSON({
      supabase,
      userId: user.id,
      usageLabel: "project",
      schema: projectSpecSchema,
      instructions: `Design ONE realistic ${p.data.level} portfolio project that proves skills for the learner's goal. It must be finishable by one person (beginner ≈ 1–2 weeks, intermediate ≈ 3–4 weeks, advanced ≈ 6–8 weeks part-time).
Return JSON: {"title","problem","objective","features": string[],"architecture","techStack": string[],"database","apis": string[],
"milestones":[{"title","tasks": string[]}] (3–5 milestones, concrete tasks),"testing","deployment","documentation","portfolioDescription"}.
portfolioDescription describes the PLANNED project (future tense is fine) — it will only be used on a resume after the learner completes it.`,
      messages: [{ role: "user", content: `Goal: ${p.data.goal}\nLevel: ${p.data.level}\n${p.data.idea ? `Their own idea: ${p.data.idea}\n` : ""}\nLearner:\n${learnerContext(profile)}` }],
    });
  } catch (e) {
    return { error: e instanceof AIError ? e.message : "Couldn't generate a project right now." };
  }

  const { data: project, error } = await supabase
    .from("learn_projects")
    .insert({ user_id: user.id, title: spec.title, level: p.data.level, target_role: p.data.goal, spec })
    .select("id")
    .single();
  if (error || !project) return { error: "Couldn't save the project." };

  const tasks = spec.milestones.flatMap((m, mi) => m.tasks.map((t, ti) => ({ project_id: project.id, user_id: user.id, milestone: m.title, title: t, sort: mi * 100 + ti })));
  if (tasks.length) await supabase.from("learn_project_tasks").insert(tasks);
  await supabase.from("learn_activity").insert({ user_id: user.id, kind: "project" });
  redirect(`/app/projects/${project.id}`);
}

export async function toggleTask(taskId: string, projectId: string, done: boolean) {
  const learner = await getLearner();
  if (!learner || !z.string().uuid().safeParse(taskId).success || !z.string().uuid().safeParse(projectId).success) return { ok: false };
  const { supabase, user } = learner;
  await supabase.from("learn_project_tasks").update({ is_done: done }).eq("id", taskId);
  // Move a planned project to in-progress on first completed task (never auto-complete it).
  if (done) {
    await supabase.from("learn_projects").update({ status: "in_progress" }).eq("id", projectId).eq("status", "planned");
    await supabase.from("learn_activity").insert({ user_id: user.id, kind: "project_task" });
  }
  revalidatePath(`/app/projects/${projectId}`);
  return { ok: true };
}

const completeSchema = z.object({
  repo_url: z.string().trim().url("Enter a valid repository URL").max(300).optional().or(z.literal("")),
  live_url: z.string().trim().url("Enter a valid live URL").max(300).optional().or(z.literal("")),
  confirm: z.literal("on", { message: "Please confirm you built this project yourself" }),
});

/** The learner explicitly marks a project complete — we never do this automatically. */
export async function completeProject(projectId: string, _: { error: string | null } | null, fd: FormData) {
  const learner = await getLearner();
  if (!learner || !z.string().uuid().safeParse(projectId).success) return { error: "Please sign in again." };
  const p = completeSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0].message };
  const { error } = await learner.supabase
    .from("learn_projects")
    .update({ status: "completed", completed_at: new Date().toISOString(), repo_url: p.data.repo_url || null, live_url: p.data.live_url || null })
    .eq("id", projectId);
  if (error) return { error: "Couldn't update the project." };
  await learner.supabase.from("learn_activity").insert({ user_id: learner.user.id, kind: "project_complete" });
  revalidatePath(`/app/projects/${projectId}`);
  return { error: null };
}

export async function reopenProject(projectId: string) {
  const learner = await getLearner();
  if (!learner || !z.string().uuid().safeParse(projectId).success) return;
  await learner.supabase.from("learn_projects").update({ status: "in_progress", completed_at: null }).eq("id", projectId);
  revalidatePath(`/app/projects/${projectId}`);
}

export async function deleteProject(projectId: string) {
  const learner = await getLearner();
  if (!learner || !z.string().uuid().safeParse(projectId).success) return;
  await learner.supabase.from("learn_projects").delete().eq("id", projectId);
  revalidatePath("/app/projects");
  redirect("/app/projects");
}
