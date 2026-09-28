"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Hammer, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { generateProject } from "@/app/actions/learn/projects";
import { Field, Input, Textarea } from "@/components/learn/ui";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper disabled:opacity-60">
      {pending ? <Loader2 size={16} className="animate-spin" /> : <Hammer size={16} />} {pending ? "Designing your project…" : "Generate project"}
    </button>
  );
}

export function ProjectGenerator({ defaultGoal }: { defaultGoal: string }) {
  const [state, action] = useActionState(generateProject, null);
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="What do you want to become or learn?" htmlFor="goal">
        <Input id="goal" name="goal" defaultValue={defaultGoal} required minLength={3} maxLength={300} placeholder="e.g. I want to become a frontend developer" />
      </Field>
      <fieldset>
        <legend className="text-sm font-medium text-ink">Level</legend>
        <input type="hidden" name="level" value={level} />
        <div className="mt-2 inline-flex rounded-full border border-slate-200 p-0.5">
          {(["beginner", "intermediate", "advanced"] as const).map((l) => (
            <button type="button" key={l} aria-pressed={level === l} onClick={() => setLevel(l)} className={cn("min-h-10 rounded-full px-4 text-sm capitalize", level === l ? "bg-ink text-paper" : "text-slate-600")}>
              {l}
            </button>
          ))}
        </div>
      </fieldset>
      <Field label="Have your own idea? (optional)" htmlFor="idea" hint="We'll shape it into a scoped, buildable plan.">
        <Textarea id="idea" name="idea" maxLength={600} className="!min-h-20" placeholder="e.g. An app to split hostel mess bills" />
      </Field>
      {state?.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
      <div><Submit /></div>
    </form>
  );
}
