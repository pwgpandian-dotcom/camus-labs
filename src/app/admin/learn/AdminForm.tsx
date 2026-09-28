"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

type Result = { ok: boolean; error?: string } | null;

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-paper disabled:opacity-60">
      {pending ? "Saving…" : label}
    </button>
  );
}

export function AdminForm({ action, children, submitLabel = "Save", className, reset = false }: { action: (p: Result, fd: FormData) => Promise<{ ok: boolean; error?: string }>; children: React.ReactNode; submitLabel?: string; className?: string; reset?: boolean }) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && reset) ref.current?.reset();
  }, [state, reset]);
  return (
    <form ref={ref} action={formAction} className={className}>
      {children}
      <div className="mt-3 flex items-center gap-3">
        <Submit label={submitLabel} />
        <span aria-live="polite" className="text-[13px]">
          {state?.error && <span className="text-danger">{state.error}</span>}
          {state?.ok && <span className="text-success">Saved</span>}
        </span>
      </div>
    </form>
  );
}

export const inputCls = "min-h-10 w-full rounded-lg border border-slate-300 bg-paper px-3 text-sm outline-none focus:border-ink";
