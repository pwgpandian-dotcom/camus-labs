"use client";

import { useOptimistic, useTransition } from "react";
import { cn } from "@/lib/cn";
import { toggleTask } from "@/app/actions/learn/projects";

interface Task {
  id: string;
  milestone: string;
  title: string;
  done: boolean;
}

export function TaskList({ projectId, tasks }: { projectId: string; tasks: Task[] }) {
  const [items, setOptimistic] = useOptimistic(tasks, (s, u: { id: string; done: boolean }) => s.map((t) => (t.id === u.id ? { ...t, done: u.done } : t)));
  const [, start] = useTransition();
  const milestones = [...new Set(items.map((t) => t.milestone))];

  return (
    <div className="mt-5 flex flex-col gap-6">
      {milestones.map((m, mi) => {
        const group = items.filter((t) => t.milestone === m);
        const complete = group.every((t) => t.done);
        return (
          <section key={m}>
            <h3 className="flex items-center gap-2 text-sm font-medium text-ink">
              <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold", complete ? "bg-success text-paper" : "bg-slate-100 text-slate-600")}>{mi + 1}</span>
              {m}
            </h3>
            <ul className="mt-2 flex flex-col">
              {group.map((t) => (
                <li key={t.id}>
                  <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={(e) => {
                        const done = e.target.checked;
                        start(async () => {
                          setOptimistic({ id: t.id, done });
                          await toggleTask(t.id, projectId, done);
                        });
                      }}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-ink)]"
                    />
                    <span className={cn("text-sm", t.done ? "text-slate-400 line-through" : "text-slate-700")}>{t.title}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
