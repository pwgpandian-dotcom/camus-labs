"use client";

import { useOptimistic, useTransition } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { markLessonDone } from "@/app/actions/learn/academy";

export function LessonDone({ course, lesson, initialDone }: { course: string; lesson: string; initialDone: boolean }) {
  const [done, setDone] = useOptimistic(initialDone);
  const [, start] = useTransition();
  return (
    <button
      type="button"
      aria-pressed={done}
      onClick={() =>
        start(async () => {
          setDone(!done);
          await markLessonDone(course, lesson, !done);
        })
      }
      className={cn("mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm", done ? "border-success bg-[#f0faf5] text-success" : "border-slate-300 text-ink hover:border-ink")}
    >
      <Check size={15} /> {done ? "Completed" : "Mark as complete"}
    </button>
  );
}
