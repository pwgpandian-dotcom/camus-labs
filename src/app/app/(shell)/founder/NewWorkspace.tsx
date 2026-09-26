"use client";

import { useActionState } from "react";
import { createWorkspace } from "@/app/actions/learn/founder";
import { Field, Input, Textarea } from "@/components/learn/ui";
import { SubmitButton } from "@/components/learn/Forms";

export function NewWorkspace() {
  const [state, action] = useActionState(createWorkspace, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <h2 className="text-[15px] font-semibold text-ink">Start a new idea</h2>
      <Field label="Working name" htmlFor="title"><Input id="title" name="title" required minLength={2} maxLength={120} placeholder="e.g. MessMate" /></Field>
      <Field label="The idea in a sentence or two" htmlFor="idea"><Textarea id="idea" name="idea" maxLength={2000} className="!min-h-24" placeholder="e.g. An app that helps hostel students split mess bills and track dues." /></Field>
      {state?.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
      <div><SubmitButton>Create workspace</SubmitButton></div>
    </form>
  );
}
