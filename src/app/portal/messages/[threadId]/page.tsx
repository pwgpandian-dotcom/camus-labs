import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/admin/EmptyState";
import { PortalReplyForm } from "@/components/portal/PortalReplyForm";

export default async function PortalThreadPage({ params }: PageProps<"/portal/messages/[threadId]">) {
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
  const otherPartyId =
    last && last.sender_id !== user?.id ? last.sender_id : last?.recipient_id ?? null;

  return (
    <div>
      <Link href="/portal/messages" className="text-sm text-slate-500 hover:text-ink">
        ← All conversations
      </Link>

      {error && (
        <div className="mt-4">
          <EmptyState title="Couldn't load this thread" description={error.message} />
        </div>
      )}

      {!error && (!thread || thread.length === 0) && (
        <div className="mt-4">
          <EmptyState title="Thread not found" description="This conversation may have been removed." />
        </div>
      )}

      {thread && thread.length > 0 && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {thread.map((m) => (
              <div
                key={m.id}
                className={`max-w-lg rounded-2xl border border-slate-200 p-4 ${
                  m.sender_id === user?.id ? "self-end bg-ink text-paper" : "self-start bg-paper"
                }`}
              >
                <p className="text-xs text-slate-400">
                  {m.sender?.full_name || m.sender?.email} ·{" "}
                  {new Date(m.created_at).toLocaleString()}
                </p>
                <p className="mt-1 text-sm leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>

          <PortalReplyForm
            threadId={threadId}
            recipientId={otherPartyId}
            projectId={last?.project_id ?? null}
          />
        </div>
      )}
    </div>
  );
}
