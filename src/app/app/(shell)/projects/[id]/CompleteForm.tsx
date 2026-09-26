"use client";

import { useActionState } from "react";
import { completeProject } from "@/app/actions/learn/projects";
import { Field, Input } from "@/components/learn/ui";
import { SubmitButton } from "@/components/learn/Forms";

export function CompleteForm({ projectId, allTasksDone }: { projectId: string; allTasksDone: boolean }) {
  const [state, action] = useActionState(completeProject.bind(null, projectId), null);
  return (
    <form action={action} className="mt-3 flex flex-col gap-3">
      <p className="text-sm text-slate-500">{allTasksDone ? "All tasks are ticked. Add links and mark it complete when you're happy with it." : "In progress. Mark it complete only once you've genuinely built it."}</p>
      <Field label="Repository URL" htmlFor="repo_url"><Input id="repo_url" name="repo_url" type="url" inputMode="url" placeholder="https://github.com/…" /></Field>
      <Field label="Live URL" htmlFor="live_url"><Input id="live_url" name="live_url" type="url" inputMode="url" placeholder="https://…" /></Field>
      <label className="flex items-start gap-2 text-[13px] text-slate-600">
        <input type="checkbox" name="confirm" className="mt-0.5 h-4 w-4 accent-[var(--color-ink)]" required /> I built this project myself and it works as described.
      </label>
      {state?.error && <p role="alert" className="text-[13px] text-danger">{state.error}</p>}
      <SubmitButton variant="secondary">Mark as complete</SubmitButton>
    </form>
  );
}
