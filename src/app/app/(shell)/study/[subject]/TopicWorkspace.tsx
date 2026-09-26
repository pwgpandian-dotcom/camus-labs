"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { Markdown } from "@/components/learn/Markdown";
import { QuizRunner } from "@/components/learn/QuizRunner";
import { Notice } from "@/components/learn/ui";

type Tab = "lesson" | "practice" | "quiz";
type Depth = "simple" | "deep" | "examples";

async function streamInto(res: Response, onText: (t: string) => void) {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let acc = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    acc += decoder.decode(value, { stream: true });
    onText(acc);
  }
}

export function TopicWorkspace({ subject, topic, lastScore }: { subject: string; topic: string; lastScore: number | null }) {
  const [tab, setTab] = useState<Tab>("lesson");
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);

  async function load(depth: Depth | "practice") {
    abort.current?.abort();
    const ctrl = new AbortController();
    abort.current = ctrl;
    setError(null);
    setLoading(depth);
    setContent((c) => ({ ...c, [depth]: "" }));
    try {
      const res = await fetch("/api/learn/lesson", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ subject, topic, depth }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) throw new Error((await res.json().catch(() => ({}))).error || "Couldn't load the lesson.");
      await streamInto(res, (t) => setContent((c) => ({ ...c, [depth]: t })));
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setLoading(null);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "lesson", label: "Lesson" },
    { id: "practice", label: "Practice" },
    { id: "quiz", label: "Quiz & review" },
  ];

  return (
    <div>
      {lastScore !== null && (
        <p className="-mt-3 mb-5 text-[13px] text-slate-500">
          Last quiz: <span className={lastScore >= 80 ? "text-success" : lastScore >= 60 ? "text-ink" : "text-warning"}>{lastScore}%</span>
        </p>
      )}
      <div role="tablist" aria-label="Study steps" className="flex gap-1 rounded-full bg-slate-100 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn("min-h-10 flex-1 rounded-full text-sm transition-colors", tab === t.id ? "bg-paper font-medium text-ink shadow-xs" : "text-slate-500 hover:text-ink")}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6" role="tabpanel">
        {error && <Notice tone="danger" className="mb-4">{error}</Notice>}

        {tab === "lesson" && (
          <div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["simple", "Explain simply"],
                  ["deep", "Explain deeply"],
                  ["examples", "Worked examples"],
                ] as const
              ).map(([d, label]) => (
                <button
                  key={d}
                  onClick={() => load(d)}
                  disabled={!!loading}
                  className={cn("inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 text-sm disabled:opacity-60", content[d] !== undefined ? "border-ink bg-ink text-paper" : "border-slate-200 text-slate-700 hover:border-slate-400")}
                >
                  {loading === d ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} {label}
                </button>
              ))}
            </div>
            {(["simple", "deep", "examples"] as const).map((d) =>
              content[d] ? (
                <article key={d} className="mt-6 rounded-2xl border border-slate-200 bg-paper p-5 md:p-6">
                  <Markdown content={content[d]} />
                </article>
              ) : null
            )}
            {!Object.keys(content).some((k) => k !== "practice") && !loading && (
              <p className="mt-6 text-sm text-slate-500">Choose how you&apos;d like this topic explained. You can switch any time.</p>
            )}
            {Object.keys(content).length > 0 && !loading && (
              <div className="mt-6 flex flex-wrap gap-2">
                <button onClick={() => setTab("practice")} className="min-h-11 rounded-full bg-ink px-5 text-sm font-medium text-paper">Start practice</button>
                <Link href={`/app/assistant?mode=study&q=${encodeURIComponent(`I'm studying ${topic} (${subject}). I have a question: `)}`} className="inline-flex min-h-11 items-center rounded-full border border-slate-300 px-5 text-sm text-ink hover:border-ink">
                  Ask a follow-up
                </Link>
              </div>
            )}
          </div>
        )}

        {tab === "practice" && (
          <div>
            <p className="text-sm text-slate-500">Try each problem yourself first. Hints come before full solutions.</p>
            {!content.practice && (
              <button onClick={() => load("practice")} disabled={!!loading} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-paper disabled:opacity-60">
                {loading === "practice" ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Generate practice problems
              </button>
            )}
            {content.practice && (
              <article className="mt-6 rounded-2xl border border-slate-200 bg-paper p-5 md:p-6">
                <Markdown content={content.practice} />
              </article>
            )}
            {content.practice && !loading && (
              <div className="mt-6 flex flex-wrap gap-2">
                <button onClick={() => setTab("quiz")} className="min-h-11 rounded-full bg-ink px-5 text-sm font-medium text-paper">Take the quiz</button>
                <button onClick={() => load("practice")} className="min-h-11 rounded-full border border-slate-300 px-5 text-sm text-ink hover:border-ink">New problems</button>
              </div>
            )}
          </div>
        )}

        {tab === "quiz" && <QuizRunner subject={subject} topic={topic} />}
      </div>
    </div>
  );
}
