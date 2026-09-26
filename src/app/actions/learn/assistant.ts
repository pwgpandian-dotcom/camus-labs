"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLearner } from "@/lib/learn/server";

const id = z.string().uuid();

export async function setMessageFeedback(messageId: string, value: -1 | 1 | null) {
  const learner = await getLearner();
  if (!learner || !id.safeParse(messageId).success) return { ok: false };
  const { error } = await learner.supabase.from("learn_messages").update({ feedback: value }).eq("id", messageId);
  return { ok: !error };
}

export async function toggleSaveConversation(conversationId: string, saved: boolean) {
  const learner = await getLearner();
  if (!learner || !id.safeParse(conversationId).success) return { ok: false };
  const { error } = await learner.supabase.from("learn_conversations").update({ is_saved: saved }).eq("id", conversationId);
  revalidatePath("/app/assistant");
  return { ok: !error };
}

export async function deleteConversation(conversationId: string) {
  const learner = await getLearner();
  if (!learner || !id.safeParse(conversationId).success) return { ok: false };
  const { error } = await learner.supabase.from("learn_conversations").delete().eq("id", conversationId);
  revalidatePath("/app/assistant");
  return { ok: !error };
}

export async function renameConversation(conversationId: string, title: string) {
  const learner = await getLearner();
  const t = title.trim().slice(0, 80);
  if (!learner || !id.safeParse(conversationId).success || !t) return { ok: false };
  const { error } = await learner.supabase.from("learn_conversations").update({ title: t }).eq("id", conversationId);
  revalidatePath("/app/assistant");
  return { ok: !error };
}

export async function loadConversation(conversationId: string) {
  const learner = await getLearner();
  if (!learner || !id.safeParse(conversationId).success) return null;
  const [{ data: convo }, { data: messages }] = await Promise.all([
    learner.supabase.from("learn_conversations").select("id, title, mode, is_saved").eq("id", conversationId).maybeSingle(),
    learner.supabase.from("learn_messages").select("id, role, content, feedback").eq("conversation_id", conversationId).order("created_at").limit(200),
  ]);
  if (!convo) return null;
  return { convo, messages: messages ?? [] };
}
