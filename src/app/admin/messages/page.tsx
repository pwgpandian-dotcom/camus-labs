import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: messages, error } = await supabase
    .from("messages")
    .select(
      "id, thread_id, body, created_at, sender:profiles!messages_sender_id_fkey(full_name, email), recipient:profiles!messages_recipient_id_fkey(full_name, email)"
    )
    .order("created_at", { ascending: false });

  const messageList = messages || [];
  const threads = new Map<string, (typeof messageList)[number]>();
  for (const m of messageList) {
    if (!threads.has(m.thread_id)) threads.set(m.thread_id, m);
  }
  const threadList = Array.from(threads.values());

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Every client conversation, grouped by thread. Reply from a thread's detail page."
      />

      {error && <EmptyState title="Couldn't load messages" description={error.message} />}

      {!error && threadList.length === 0 && (
        <EmptyState
          title="No conversations yet"
          description="Threads appear here once a client sends a message from their portal — that surface is still Phase 5."
        />
      )}

      {threadList.length > 0 && (
        <div className="flex flex-col gap-3">
          {threadList.map((m) => (
            <Link
              key={m.thread_id}
              href={`/admin/messages/${m.thread_id}`}
              className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-paper p-5 transition-colors hover:border-slate-400"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-ink">
                  {m.sender?.full_name || m.sender?.email} → {m.recipient?.full_name || m.recipient?.email || "unassigned"}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
              <p className="truncate text-sm text-slate-500">{m.body}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
