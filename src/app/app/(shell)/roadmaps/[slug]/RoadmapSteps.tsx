"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { Check, Circle, CircleDot, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { setStepStatus } from "@/app/actions/learn/roadmap";
import type { RoadmapStep } from "@/lib/learn/catalog/careers";

type Status = "not_started" | "in_progress" | "done";

export function RoadmapSteps({ slug, steps, initialStatus }: { slug: string; steps: RoadmapStep[]; initialStatus: Record<string, Status> }) {
  const [status, setOptimistic] = useOptimistic(initialStatus, (s, u: { key: string; value: Status }) => ({ ...s, [u.key]: u.value }));
  const [, start] = useTransition();
  const firstOpen = steps.find((s) => status[s.key] !== "done")?.key;

  function update(key: string, value: Status) {
    start(async () => {
      setOptimistic({ key, value });
      await setStepStatus(slug, key, value);
    });
  }

  return (
    <ol className="relative flex flex-col gap-3">
      {steps.map((s, i) => {
        const st = status[s.key] ?? "not_started";
        const current = s.key === firstOpen;
        return (
          <li key={s.key} className={cn("rounded-2xl border bg-paper p-4 md:p-5", current ? "border-ink" : "border-slate-200")}>
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  st === "done" ? "bg-success text-paper" : st === "in_progress" ? "bg-signal text-paper" : "border border-slate-300 text-slate-500"
                )}
                aria-hidden
              >
                {st === "done" ? <Check size={14} /> : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={cn("text-[15px] font-medium", st === "done" ? "text-slate-500" : "text-ink")}>{s.title}</p>
                  {current && <span className="rounded-full bg-signal-50 px-2 py-0.5 text-[11px] font-medium text-signal-dark">Up next</span>}
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{s.detail}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/app/assistant?mode=study&q=${encodeURIComponent(`Teach me "${s.title}" (${s.detail}) step by step, starting from my level, then give me a small exercise.`)}`}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-[13px] text-slate-700 hover:border-slate-400"
                  >
                    <Sparkles size={13} /> Learn with tutor
                  </Link>
                  <div role="group" aria-label={`Status for ${s.title}`} className="inline-flex rounded-full border border-slate-200 p-0.5">
                    {(
                      [
                        ["not_started", "To do", Circle],
                        ["in_progress", "Doing", CircleDot],
                        ["done", "Done", Check],
                      ] as const
                    ).map(([v, label, Icon]) => (
                      <button
                        key={v}
                        onClick={() => update(s.key, v)}
                        aria-pressed={st === v}
                        className={cn("inline-flex min-h-8 items-center gap-1 rounded-full px-2.5 text-[12px]", st === v ? "bg-ink text-paper" : "text-slate-500 hover:text-ink")}
                      >
                        <Icon size={12} /> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
