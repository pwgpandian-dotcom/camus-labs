"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { QuizRunner } from "@/components/learn/QuizRunner";
import { Field, Input, Panel } from "@/components/learn/ui";

export function ExamPractice({ examSlug, examName, subjects }: { examSlug: string; examName: string; subjects: string[] }) {
  const [subject, setSubject] = useState(subjects[0] ?? "");
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<"practice" | "mock">("practice");
  const [runKey, setRunKey] = useState(0);

  return (
    <Panel>
      <div role="tablist" className="flex gap-1 rounded-full bg-slate-100 p-1">
        {(
          [
            ["practice", "Topic practice"],
            ["mock", "Timed mock test"],
          ] as const
        ).map(([m, label]) => (
          <button key={m} role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setRunKey((k) => k + 1); }} className={cn("min-h-10 flex-1 rounded-full text-sm", mode === m ? "bg-paper font-medium text-ink shadow-xs" : "text-slate-500")}>
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <fieldset>
          <legend className="text-sm font-medium text-ink">Subject</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {subjects.map((s) => (
              <button key={s} onClick={() => { setSubject(s); setRunKey((k) => k + 1); }} aria-pressed={subject === s} className={cn("min-h-9 rounded-full border px-3.5 text-[13px]", subject === s ? "border-ink bg-ink text-paper" : "border-slate-200 text-slate-600 hover:border-slate-400")}>
                {s}
              </button>
            ))}
          </div>
        </fieldset>
        {mode === "practice" && (
          <Field label="Topic (optional)" htmlFor="topic" hint="Leave blank for a mixed set.">
            <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={120} placeholder="e.g. Thermodynamics" />
          </Field>
        )}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-6">
        <QuizRunner
          key={`${mode}-${subject}-${runKey}`}
          subject={subject}
          topic={mode === "mock" ? `${examName} mixed mock` : topic || `${examName} mixed practice`}
          examSlug={examSlug}
          count={mode === "mock" ? 10 : 5}
          timed={mode === "mock"}
          label={mode === "mock" ? "Start 10-question timed mock" : "Start practice set"}
        />
      </div>
    </Panel>
  );
}
