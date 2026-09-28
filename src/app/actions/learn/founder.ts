"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLearner, learnerContext, isMinor } from "@/lib/learn/server";
import { FOUNDER_STAGES } from "@/lib/learn/catalog/founder";
import { assertQuota, completeText } from "@/lib/learn/ai/service";
import { AIError } from "@/lib/learn/ai/types";

const stageKeys = FOUNDER_STAGES.map((s) => s.key) as [string, ...string[]];

export async function createWorkspace(_: { error: string | null } | null, fd: FormData) {
  const learner = await getLearner();
  if (!learner) return { error: "Please sign in again." };
  const title = String(fd.get("title") ?? "").trim().slice(0, 120);
  const idea = String(fd.get("idea") ?? "").trim().slice(0, 2000);
  if (title.length < 2) return { error: "Give your idea a short name." };
  const { data, error } = await learner.supabase
    .from("learn_founder_workspaces")
    .insert({ user_id: learner.user.id, title, stages: { idea } })
    .select("id")
    .single();
  if (error || !data) return { error: "Couldn't create the workspace." };
  redirect(`/app/founder/${data.id}`);
}

export async function saveStage(id: string, key: string, value: string) {
  const learner = await getLearner();
  if (!learner || !z.string().uuid().safeParse(id).success || !z.enum(stageKeys).safeParse(key).success) return { ok: false };
  const { data: ws } = await learner.supabase.from("learn_founder_workspaces").select("stages").eq("id", id).maybeSingle();
  if (!ws) return { ok: false };
  const stages = { ...(ws.stages as Record<string, string>), [key]: value.slice(0, 6000) };
  const { error } = await learner.supabase.from("learn_founder_workspaces").update({ stages }).eq("id", id);
  return { ok: !error };
}

/** AI coaching for one stage, grounded in everything written so far. */
export async function coachStage(id: string, key: string): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const learner = await getLearner();
  if (!learner || !z.string().uuid().safeParse(id).success || !z.enum(stageKeys).safeParse(key).success) return { ok: false, error: "Please sign in again." };
  if (isMinor(learner.profile)) return { ok: false, error: "Founder Mode is available for learners aged 18+." };
  const { data: ws } = await learner.supabase.from("learn_founder_workspaces").select("title, stages").eq("id", id).maybeSingle();
  if (!ws) return { ok: false, error: "Workspace not found." };
  const stage = FOUNDER_STAGES.find((s) => s.key === key)!;
  const filled = FOUNDER_STAGES.map((s) => `## ${s.title}\n${(ws.stages as Record<string, string>)[s.key] || "(empty)"}`).join("\n\n");
  try {
    await assertQuota(learner.supabase, learner.plan?.ai_messages_per_day ?? 15);
    const text = await completeText({
      supabase: learner.supabase,
      userId: learner.user.id,
      feature: "assistant",
      usageLabel: "founder",
      system: `You are a pragmatic startup coach. Help the founder complete the "${stage.title}" section of their plan (${stage.prompt}).
Write a concrete draft they can edit (Markdown, concise), then 2–3 pointed questions or experiments to validate it with real customers. Never invent market sizes, statistics or competitor facts — label anything uncertain as an assumption to verify.`,
      messages: [{ role: "user", content: `Founder background:\n${learnerContext(learner.profile)}\n\nWorkspace "${ws.title}":\n${filled}\n\nDraft the "${stage.title}" section.` }],
    });
    return { ok: true, text };
  } catch (e) {
    return { ok: false, error: e instanceof AIError ? e.message : "Couldn't get coaching right now." };
  }
}

export async function deleteWorkspace(id: string) {
  const learner = await getLearner();
  if (!learner || !z.string().uuid().safeParse(id).success) return;
  await learner.supabase.from("learn_founder_workspaces").delete().eq("id", id);
  revalidatePath("/app/founder");
  redirect("/app/founder");
}
