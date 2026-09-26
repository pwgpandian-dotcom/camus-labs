import { NextResponse } from "next/server";
import { getLearner, learnerContext } from "@/lib/learn/server";
import { chatRequestSchema } from "@/lib/learn/schemas";
import { assistantSystemPrompt } from "@/lib/learn/ai/prompts";
import { assertQuota, getPromptOverride, streamText } from "@/lib/learn/ai/service";
import { AIError, type ChatMessage } from "@/lib/learn/ai/types";

export const maxDuration = 60;

const HISTORY_LIMIT = 24;

function titleFrom(message: string) {
  const firstLine = message.split("\n").find((l) => l.trim()) ?? "New conversation";
  return firstLine.replace(/\s+/g, " ").trim().slice(0, 80);
}

export async function POST(req: Request) {
  const learner = await getLearner();
  if (!learner) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  const { supabase, user, profile, plan } = learner;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Your message couldn't be sent. Please check it and try again." }, { status: 400 });
  const { mode, message, regenerate } = parsed.data;
  let conversationId = parsed.data.conversationId ?? null;

  try {
    await assertQuota(supabase, plan?.ai_messages_per_day ?? 15);
  } catch (e) {
    if (e instanceof AIError) return NextResponse.json({ error: e.message, code: e.code }, { status: e.status });
    throw e;
  }

  // Create or verify the conversation (RLS guarantees ownership on select).
  if (conversationId) {
    const { data: convo } = await supabase.from("learn_conversations").select("id").eq("id", conversationId).maybeSingle();
    if (!convo) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  } else {
    const { data: created, error } = await supabase
      .from("learn_conversations")
      .insert({ user_id: user.id, mode, title: titleFrom(message) })
      .select("id")
      .single();
    if (error || !created) return NextResponse.json({ error: "Couldn't start a conversation." }, { status: 500 });
    conversationId = created.id;
  }

  if (regenerate) {
    // Drop the most recent assistant reply; the last user message stays.
    const { data: last } = await supabase
      .from("learn_messages")
      .select("id, role")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (last?.role === "assistant") await supabase.from("learn_messages").delete().eq("id", last.id);
  } else {
    const { error } = await supabase.from("learn_messages").insert({ conversation_id: conversationId, user_id: user.id, role: "user", content: message });
    if (error) return NextResponse.json({ error: "Couldn't save your message." }, { status: 500 });
  }

  const { data: historyDesc } = await supabase
    .from("learn_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(HISTORY_LIMIT);
  const history: ChatMessage[] = (historyDesc ?? []).reverse().map((m) => ({ role: m.role as ChatMessage["role"], content: m.content }));
  // Providers require the conversation to start with a user turn.
  while (history.length && history[0].role !== "user") history.shift();
  if (!history.length) return NextResponse.json({ error: "Nothing to reply to." }, { status: 400 });

  const override = await getPromptOverride(supabase, `assistant.${mode}`);
  const system = assistantSystemPrompt(mode, learnerContext(profile), override);

  try {
    const stream = await streamText({
      supabase,
      userId: user.id,
      feature: "assistant",
      usageLabel: `chat:${mode}`,
      system,
      messages: history,
      signal: req.signal,
      onFinish: async (full, cfg) => {
        if (!full.trim()) return;
        await supabase.from("learn_messages").insert({ conversation_id: conversationId!, user_id: user.id, role: "assistant", content: full.slice(0, 60000), model: cfg.model });
        await supabase.from("learn_conversations").update({ mode }).eq("id", conversationId!);
        await supabase.from("learn_activity").insert({ user_id: user.id, kind: "chat" });
      },
    });
    return new Response(stream, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "x-conversation-id": conversationId,
      },
    });
  } catch (e) {
    if (e instanceof AIError) return NextResponse.json({ error: e.message, code: e.code, conversationId }, { status: e.status });
    console.error("[chat]", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
