"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Result = { ok: boolean; error?: string } | null;

export function SubmitButton({ children, className, variant = "primary" }: { children: React.ReactNode; className?: string; variant?: "primary" | "secondary" | "danger" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors disabled:opacity-60",
        variant === "primary" && "bg-ink text-paper hover:bg-slate-800",
        variant === "secondary" && "border border-slate-300 text-ink hover:border-ink",
        variant === "danger" && "bg-danger text-paper hover:opacity-90",
        className
      )}
    >
      {pending && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

/** A form wired to a server action with inline error + success message and auto-reset. */
export function ActionForm({
  action,
  children,
  className,
  successMessage = "Saved",
  resetOnSuccess = true,
}: {
  action: (prev: Result, fd: FormData) => Promise<{ ok: boolean; error?: string }>;
  children: React.ReactNode;
  className?: string;
  successMessage?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);
  return (
    <form ref={ref} action={formAction} className={className}>
      {children}
      <div aria-live="polite" className="min-h-5">
        {state?.error && <p className="mt-2 text-[13px] text-danger">{state.error}</p>}
        {state?.ok && <p className="mt-2 text-[13px] text-success">{successMessage}</p>}
      </div>
    </form>
  );
}
