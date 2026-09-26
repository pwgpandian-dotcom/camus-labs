import { requireLearner } from "@/lib/learn/server";
import { aiAvailable } from "@/lib/learn/ai/service";
import { ASSISTANT_MODES, type AssistantMode } from "@/lib/learn/ai/prompts";
import { Chat } from "./Chat";

export const metadata = { title: "Assistant" };

export default async function AssistantPage({ searchParams }: PageProps<"/app/assistant">) {
  const sp = await searchParams;
  const { supabase, user, profile, plan } = await requireLearner();

  const c = typeof sp.c === "string" ? sp.c : null;
  const modeParam = typeof sp.mode === "string" ? sp.mode : null;
  const prefill = typeof sp.q === "string" ? sp.q.slice(0, 2000) : "";

  const [{ data: conversations }, selected] = await Promise.all([
    supabase.from("learn_conversations").select("id, title, mode, is_saved, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(50),
    c
      ? Promise.all([
          supabase.from("learn_conversations").select("id, title, mode, is_saved").eq("id", c).maybeSingle(),
          supabase.from("learn_messages").select("id, role, content, feedback").eq("conversation_id", c).order("created_at").limit(200),
        ])
      : Promise.resolve(null),
  ]);

  const convo = selected?.[0].data ?? null;
  const messages = selected?.[1].data ?? [];
  const mode: AssistantMode = (convo?.mode as AssistantMode) ?? (ASSISTANT_MODES.includes(modeParam as AssistantMode) ? (modeParam as AssistantMode) : "general");
  const minor = profile?.age_band === "under_13" || profile?.age_band === "13_17";

  return (
    <Chat
      key={convo?.id ?? "new"}
      aiReady={aiAvailable()}
      initialConversation={convo ? { id: convo.id, title: convo.title, isSaved: convo.is_saved } : null}
      initialMessages={messages.map((m) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content, feedback: m.feedback as -1 | 1 | null }))}
      initialMode={mode}
      prefill={prefill}
      conversations={(conversations ?? []).map((x) => ({ id: x.id, title: x.title, mode: x.mode, isSaved: x.is_saved }))}
      dailyLimit={plan?.ai_messages_per_day ?? 15}
      hideModes={minor ? ["founder"] : []}
    />
  );
}
