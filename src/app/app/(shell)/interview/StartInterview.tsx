"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Mic } from "lucide-react";
import { cn } from "@/lib/cn";
import { startInterview } from "@/app/actions/learn/interview";
import { Field, Input } from "@/components/learn/ui";

const MODES = [
  { value: "hr", label: "HR / screening", hint: "Motivation, background, fit" },
  { value: "behavioral", label: "Behavioural", hint: "STAR-style situations" },
  { value: "technical", label: "Technical", hint: "Core knowledge & reasoning" },
  { value: "coding", label: "Coding", hint: "Approach, complexity, edge cases" },
  { value: "system_design", label: "System design", hint: "Architecture & trade-offs" },
  { value: "case_study", label: "Case study", hint: "Structure & recommend" },
  { value: "role_specific", label: "Role-specific", hint: "Day-to-day of the role" },
];

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper disabled:opacity-60">
      {pending ? <Loader2 size={16} className="animate-spin" /> : <Mic size={16} />} {pending ? "Starting…" : "Start interview"}
    </button>
  );
}

export function StartInterview({ defaultRole }: { defaultRole: string }) {
  const [state, action] = useActionState(startInterview, null);
  const [mode, setMode] = useState("behavioral");
  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="Role you're preparing for" htmlFor="role">
        <Input id="role" name="role" defaultValue={defaultRole} required minLength={2} maxLength={120} placeholder="e.g. Data Analyst" />
      </Field>
      <fieldset>
        <legend className="text-sm font-medium text-ink">Interview type</legend>
        <input type="hidden" name="mode" value={mode} />
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {MODES.map((m) => (
            <button type="button" key={m.value} aria-pressed={mode === m.value} onClick={() => setMode(m.value)} className={cn("min-h-14 rounded-xl border px-4 py-2.5 text-left", mode === m.value ? "border-ink ring-1 ring-ink" : "border-slate-200 hover:border-slate-400")}>
              <span className="block text-sm font-medium text-ink">{m.label}</span>
              <span className="block text-xs text-slate-500">{m.hint}</span>
            </button>
          ))}
        </div>
      </fieldset>
      {state?.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
      <div><Submit /></div>
    </form>
  );
}
