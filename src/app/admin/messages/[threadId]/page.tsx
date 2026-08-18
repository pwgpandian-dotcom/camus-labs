import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { ReplyForm } from "@/components/admin/ReplyForm";

export default async function ThreadPage({ params }: PageProps<"/admin/messages/[threadId]">) {
  const { threadId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: thread, error } = await supabase
    .from("messages")
    .select(
      "id, body, created_at, project_id, sender_id, recipient_id, sender:profiles!messages_sender_id_fkey(full_name, email), recipient:profiles!messages_recipient_id_fkey(full_name, email)"
    )
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  const last = thread?.[thread.length - 1];
  // Whoever isn't the signed-in staff member is the person to reply to.
  const otherPartyId =
    last && last.sender_id !== user?.id ? last.sender_id : last?.recipient_id ?? null;

  return (
    <div>
      <Link href="/admin/messages" className="text-sm text-slate-500 hover:text-ink">
        ← All conversations
      </Link>
      <div className="mt-4">
        <PageHeader title="Conversation" />
      </div>

      {error && <EmptyState title="Couldn't load this thread" description={error.message} />}

      {!error && (!thread || thread.length === 0) && (
        <EmptyState title="Thread not found" description="This conversation may have been removed." />
      )}

      {thread && thread.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {thread.map((m) => (
              <div
                key={m.id}
                className={`max-w-lg rounded-2xl border border-slate-200 p-4 ${
                  m.sender_id === user?.id ? "self-end bg-ink text-paper" : "self-start bg-paper"
                }`}
              >
                <p
                  className={`text-xs ${
                    m.sender_id === user?.id ? "text-slate-400" : "text-slate-400"
                  }`}
                >
                  {m.sender?.full_name || m.sender?.email} ·{" "}
                  {new Date(m.created_at).toLocaleString()}
                </p>
                <p className="mt-1 text-sm leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>

          <ReplyForm
            threadId={threadId}
            recipientId={otherPartyId}
            projectId={last?.project_id ?? null}
          />
        </div>
      )}
    </div>
  );
}
