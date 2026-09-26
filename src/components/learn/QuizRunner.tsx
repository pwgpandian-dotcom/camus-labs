"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Check, Clock, Loader2, RotateCcw, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { generateQuiz, submitQuiz, type PublicQuestion, type QuizResult } from "@/app/actions/learn/quiz";
import { Markdown } from "./Markdown";
import { Notice, Progress } from "./ui";

/**
 * Generate → answer → submit → review. Scoring happens on the server; the
 * correct answers never reach the browser before submission.
 */
export function QuizRunner({
  subject,
  topic,
  examSlug,
  count = 5,
  timed = false,
  label = "Start quiz",
}: {
  subject: string;
  topic: string;
  examSlug?: string;
  count?: number;
  timed?: boolean;
  label?: string;
}) {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [quiz, setQuiz] = useState<{ id: string; questions: PublicQuestion[]; source: string } | null>(null);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<Extract<QuizResult, { ok: true }> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [pending, start] = useTransition();

  function begin() {
    setError(null);
    setResult(null);
    start(async () => {
      const res = await generateQuiz({ subject, topic, examSlug, count, difficulty });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setQuiz({ id: res.attemptId, questions: res.questions, source: res.source });
      setAnswers(res.questions.map(() => null));
      setIndex(0);
      if (timed) setSecondsLeft(res.questions.length * 72);
    });
  }

  function finish() {
    if (!quiz) return;
    start(async () => {
      const res = await submitQuiz(quiz.id, answers);
      if (!res.ok) setError(res.error);
      else {
        setResult(res);
        setSecondsLeft(null);
      }
    });
  }

  // Timer for mock tests
  useEffect(() => {
    if (secondsLeft === null || result) return;
    if (secondsLeft <= 0) {
      finish();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => (s === null ? s : s - 1)), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, result]);

  if (!quiz) {
    return (
      <div className="flex flex-col items-start gap-4">
        <div role="group" aria-label="Difficulty" className="inline-flex rounded-full border border-slate-200 p-0.5">
          {(["easy", "medium", "hard"] as const).map((d) => (
            <button key={d} onClick={() => setDifficulty(d)} aria-pressed={difficulty === d} className={cn("min-h-9 rounded-full px-4 text-[13px] capitalize", difficulty === d ? "bg-ink text-paper" : "text-slate-600")}>
              {d}
            </button>
          ))}
        </div>
        <button onClick={begin} disabled={pending} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper hover:bg-slate-800 disabled:opacity-60">
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {pending ? "Preparing questions…" : label}
        </button>
        {error && <Notice tone="danger">{error}</Notice>}
      </div>
    );
  }

  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <div className="fade-in">
        <div className="flex flex-col gap-4 rounded-2xl bg-mist p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Your score</p>
            <p className="text-3xl font-semibold tabular-nums tracking-tight text-ink">
              {result.score}/{result.total} <span className="text-lg text-slate-400">({pct}%)</span>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {pct >= 80 ? "Strong understanding — move on or try a harder set." : pct >= 60 ? "Good progress. Review the explanations below, then try again." : "This topic needs another pass. Review the lesson and explanations, then retry."}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={begin} disabled={pending} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper disabled:opacity-60">
              {pending ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />} New set
            </button>
          </div>
        </div>
        <ol className="mt-6 flex flex-col gap-4">
          {quiz.questions.map((q, i) => {
            const r = result.review[i];
            return (
              <li key={i} className="rounded-2xl border border-slate-200 p-4 md:p-5">
                <div className="flex items-start gap-2">
                  <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full", r.correct ? "bg-success text-paper" : "bg-danger text-paper")} aria-label={r.correct ? "Correct" : "Incorrect"}>
                    {r.correct ? <Check size={13} /> : <X size={13} />}
                  </span>
                  <Markdown content={q.prompt} className="flex-1" />
                </div>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {q.options.map((o, oi) => (
                    <li
                      key={oi}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm",
                        oi === r.answerIndex ? "border-success bg-[#f0faf5]" : oi === r.chosen ? "border-danger bg-[#fdf3f1]" : "border-slate-100 text-slate-500"
                      )}
                    >
                      <Markdown content={o} />
                    </li>
                  ))}
                </ul>
                {r.explanation && (
                  <div className="mt-3 rounded-lg bg-mist p-3 text-sm">
                    <Markdown content={r.explanation} />
                  </div>
                )}
                {!r.correct && (
                  <Link
                    href={`/app/assistant?mode=study&q=${encodeURIComponent(`I got this ${subject} question wrong. Help me understand why.\n\n${q.prompt}\n\nOptions: ${q.options.join(" | ")}`)}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-signal-dark hover:underline"
                  >
                    <Sparkles size={13} /> Explain this to me
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  const q = quiz.questions[index];
  const answered = answers.filter((a) => a !== null).length;
  return (
    <div className="fade-in">
      <div className="flex items-center justify-between gap-4 text-[13px] text-slate-500">
        <span>
          Question {index + 1} of {quiz.questions.length}
          {quiz.source === "bank" && " · from question bank"}
        </span>
        {secondsLeft !== null && (
          <span className={cn("inline-flex items-center gap-1 tabular-nums", secondsLeft < 60 && "text-danger")} aria-live="off">
            <Clock size={14} /> {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
          </span>
        )}
      </div>
      <Progress value={(answered / quiz.questions.length) * 100} className="mt-2" label="Answered" />
      <fieldset className="mt-5">
        <legend className="w-full">
          <Markdown content={q.prompt} className="text-base" />
        </legend>
        <div className="mt-4 flex flex-col gap-2">
          {q.options.map((o, oi) => (
            <button
              key={oi}
              type="button"
              aria-pressed={answers[index] === oi}
              onClick={() => setAnswers((xs) => xs.map((x, xi) => (xi === index ? oi : x)))}
              className={cn(
                "flex min-h-12 items-start gap-3 rounded-xl border px-4 py-3 text-left text-[15px] transition-colors",
                answers[index] === oi ? "border-ink bg-paper ring-1 ring-ink" : "border-slate-200 hover:border-slate-400"
              )}
            >
              <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold", answers[index] === oi ? "border-ink bg-ink text-paper" : "border-slate-300 text-slate-500")}>
                {String.fromCharCode(65 + oi)}
              </span>
              <Markdown inline content={o} className="flex-1" />
            </button>
          ))}
        </div>
      </fieldset>
      {error && <Notice tone="danger" className="mt-4">{error}</Notice>}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} className="min-h-11 rounded-full px-4 text-sm text-slate-600 hover:bg-slate-50 disabled:invisible">
          Previous
        </button>
        {index < quiz.questions.length - 1 ? (
          <button onClick={() => setIndex((i) => i + 1)} className="min-h-11 rounded-full bg-ink px-6 text-sm font-medium text-paper">
            Next
          </button>
        ) : (
          <button onClick={finish} disabled={pending || answered === 0} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper disabled:opacity-50">
            {pending && <Loader2 size={16} className="animate-spin" />} Submit ({answered}/{quiz.questions.length})
          </button>
        )}
      </div>
    </div>
  );
}
