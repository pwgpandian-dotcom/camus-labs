"use server";

import { revalidatePath } from "next/cache";
import { getLearner } from "@/lib/learn/server";
import { getCourse } from "@/lib/learn/catalog/academy";

export async function markLessonDone(courseSlug: string, lessonSlug: string, done: boolean) {
  const learner = await getLearner();
  const course = getCourse(courseSlug);
  if (!learner || !course || !course.lessons.some((l) => l.slug === lessonSlug)) return { ok: false };
  const { error } = await learner.supabase
    .from("learn_skill_progress")
    .upsert({ user_id: learner.user.id, roadmap_slug: `academy:${courseSlug}`, step_key: lessonSlug, status: done ? "done" : "not_started" });
  if (!error && done) await learner.supabase.from("learn_activity").insert({ user_id: learner.user.id, kind: "lesson" });
  revalidatePath(`/app/academy/${courseSlug}`);
  revalidatePath("/app/academy");
  return { ok: !error };
}
