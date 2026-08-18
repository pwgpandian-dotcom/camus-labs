"use client";

import { useActionState, useRef, useEffect } from "react";
import { sendStaffReply } from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";

const initialState: { success: boolean; error?: string } = { success: false };

export function ReplyForm({
  threadId,
  recipientId,
  projectId,
}: {
  threadId: string;
  recipientId: string | null;
  projectId: string | null;
}) {
  const [state, formAction, pending] = useActionState(sendStaffReply, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-paper p-5">
      <input type="hidden" name="thread_id" value={threadId} />
      <input type="hidden" name="recipient_id" value={recipientId || ""} />
      <input type="hidden" name="project_id" value={projectId || ""} />
      <textarea
        name="body"
        required
        rows={3}
        placeholder="Reply to this thread…"
        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
      />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={pending} size="sm" className="self-start">
        {pending ? "Sending…" : "Send reply"}
      </Button>
    </form>
  );
}
