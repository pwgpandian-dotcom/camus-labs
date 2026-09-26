"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLearner } from "@/lib/learn/server";
import { getCareer } from "@/lib/learn/catalog/careers";

export async function setTargetRole(slug: string) {
  const learner = await getLearner();
  const career = getCareer(slug);
  if (!learner || !career) return;
  await learner.supabase.from("learn_profiles").update({ target_role: career.title }).eq("user_id", learner.user.id);
  revalidatePath("/app", "layout");
  redirect(`/app/roadmaps/${slug}`);
}

const STATUSES = ["not_started", "in_progress", "done"] as const;

export async function setStepStatus(slug: string, stepKey: string, status: (typeof STATUSES)[number]) {
  const learner = await getLearner();
  const career = getCareer(slug);
  if (!learner || !career || !STATUSES.includes(status) || !career.roadmap.some((s) => s.key === stepKey)) return { ok: false };
  const { error } = await learner.supabase
    .from("learn_skill_progress")
    .upsert({ user_id: learner.user.id, roadmap_slug: slug, step_key: stepKey, status });
  if (!error && status === "done") await learner.supabase.from("learn_activity").insert({ user_id: learner.user.id, kind: "roadmap" });
  revalidatePath(`/app/roadmaps/${slug}`);
  revalidatePath("/app");
  return { ok: !error };
}
