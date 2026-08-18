import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/admin/EmptyState";

export default async function PortalMessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: messages, error } = await supabase
    .from("messages")
    .select(
      "id, thread_id, body, created_at, sender_id, sender:profiles!messages_sender_id_fkey(full_name, email), recipient:profiles!messages_recipient_id_fkey(full_name, email)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return <EmptyState title="Couldn't load your messages" description={error.message} />;
  }

  const messageList = messages || [];
  const threads = new Map<string, (typeof messageList)[number]>();
  for (const m of messageList) {
    if (!threads.has(m.thread_id)) threads.set(m.thread_id, m);
  }
  const threadList = Array.from(threads.values());

  if (threadList.length === 0) {
    return (
      <EmptyState
        title="No conversations yet"
        description="Messages with your CAMUS Labs team will show up here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {threadList.map((m) => {
        const isMine = m.sender_id === user?.id;
        const otherParty = isMine ? m.recipient : m.sender;
        return (
          <Link
            key={m.thread_id}
            href={`/portal/messages/${m.thread_id}`}
            className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-paper p-5 transition-colors hover:border-slate-400"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-ink">
                {otherParty?.full_name || otherParty?.email || "CAMUS Labs team"}
              </p>
              <p className="text-xs text-slate-400">{new Date(m.created_at).toLocaleString()}</p>
            </div>
            <p className="truncate text-sm text-slate-500">{m.body}</p>
          </Link>
        );
      })}
    </div>
  );
}
