"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { FOUNDER_STAGES } from "@/lib/learn/catalog/founder";
import { coachStage, saveStage } from "@/app/actions/learn/founder";
import { Markdown } from "@/components/learn/Markdown";
import { Textarea } from "@/components/learn/ui";

export function FounderWorkspace({ id, initial, aiReady }: { id: string; initial: Record<string, string>; aiReady: boolean }) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [active, setActive] = useState<string>(FOUNDER_STAGES.find((s) => !(initial[s.key] ?? "").trim())?.key ?? "idea");
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [coach, setCoach] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [coaching, startCoach] = useTransition();
  const stage = FOUNDER_STAGES.find((s) => s.key === active)!;
  const idx = FOUNDER_STAGES.findIndex((s) => s.key === active);

  function save(key: string) {
    start(async () => {
      const r = await saveStage(id, key, values[key] ?? "");
      setSaved((s) => ({ ...s, [key]: r.ok }));
      if (!r.ok) setError("Couldn't save. Try again.");
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
      <nav aria-label="Stages" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
        {FOUNDER_STAGES.map((s, i) => {
          const filled = (values[s.key] ?? "").trim().length > 0;
          return (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              aria-current={active === s.key ? "step" : undefined}
              className={cn("flex min-h-10 shrink-0 items-center gap-2.5 rounded-full border px-3 text-left text-sm lg:rounded-lg lg:border-0", active === s.key ? "border-ink bg-ink text-paper lg:bg-slate-100 lg:text-ink lg:font-medium" : "border-slate-200 text-slate-600 hover:bg-slate-50")}
            >
              <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[10px]", filled ? "bg-success text-paper" : "bg-slate-100 text-slate-500")}>{filled ? <Check size={11} /> : i + 1}</span>
              {s.title}
            </button>
          );
        })}
      </nav>

      <section className="rounded-2xl border border-slate-200 bg-paper p-5 md:p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">Stage {idx + 1} of {FOUNDER_STAGES.length}</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">{stage.title}</h2>
        <p className="mt-1 text-sm text-slate-500">{stage.prompt}</p>
        <label htmlFor={`stage-${stage.key}`} className="sr-only">{stage.title}</label>
        <Textarea
          id={`stage-${stage.key}`}
          value={values[stage.key] ?? ""}
          onChange={(e) => {
            setValues((v) => ({ ...v, [stage.key]: e.target.value }));
            setSaved((s) => ({ ...s, [stage.key]: false }));
          }}
          onBlur={() => save(stage.key)}
          maxLength={6000}
          className="mt-4 !min-h-48"
          placeholder="Write your thinking here. Evidence beats opinions."
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={() => save(stage.key)} disabled={pending} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-paper disabled:opacity-60">
            {pending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} {saved[stage.key] ? "Saved" : "Save"}
          </button>
          <button
            disabled={!aiReady || coaching}
            onClick={() =>
              startCoach(async () => {
                setError(null);
                await saveStage(id, stage.key, values[stage.key] ?? "");
                const r = await coachStage(id, stage.key);
                if (r.ok) setCoach((c) => ({ ...c, [stage.key]: r.text }));
                else setError(r.error);
              })
            }
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-slate-300 px-4 text-sm text-ink hover:border-ink disabled:opacity-50"
          >
            {coaching ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Coach me on this
          </button>
          {idx < FOUNDER_STAGES.length - 1 && (
            <button onClick={() => { save(stage.key); setActive(FOUNDER_STAGES[idx + 1].key); }} className="ml-auto min-h-10 rounded-full px-4 text-sm text-slate-600 hover:bg-slate-50">
              Next stage →
            </button>
          )}
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
        {coach[stage.key] && (
          <div className="fade-in mt-5 rounded-xl border border-[#d5dcff] bg-signal-50/60 p-4">
            <Markdown content={coach[stage.key]} />
            <button
              onClick={() => {
                const merged = `${values[stage.key] ? values[stage.key] + "\n\n" : ""}${coach[stage.key]}`;
                setValues((v) => ({ ...v, [stage.key]: merged.slice(0, 6000) }));
                start(async () => void (await saveStage(id, stage.key, merged)));
              }}
              className="mt-3 min-h-9 rounded-full bg-ink px-4 text-[13px] text-paper"
            >
              Add to my notes
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
