"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { answerQuestion, finishInterview } from "@/app/actions/learn/interview";
import type { Turn } from "@/lib/learn/interview";
import { Notice, Progress, Textarea } from "@/components/learn/ui";
import { CamusMark } from "@/components/learn/Brand";

export function InterviewSession({ id, initialTranscript, total }: { id: string; initialTranscript: Turn[]; total: number }) {
  const router = useRouter();
  const [transcript, setTranscript] = useState(initialTranscript);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [finishing, startFinish] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);

  const asked = transcript.filter((t) => t.role === "interviewer").length;
  const answered = transcript.filter((t) => t.role === "candidate").length;
  const complete = answered >= total;

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), [transcript.length]);

  function submit() {
    setError(null);
    const text = answer;
    start(async () => {
      const r = await answerQuestion(id, text);
      if (!r.ok) return setError(r.error);
      setTranscript(r.transcript);
      setAnswer("");
    });
  }

  function finish() {
    setError(null);
    startFinish(async () => {
      const r = await finishInterview(id);
      if (!r.ok) setError(r.error);
      else router.refresh();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between text-[13px] text-slate-500">
        <span>Question {Math.min(asked, total)} of {total}</span>
        <span>{answered} answered</span>
      </div>
      <Progress value={(answered / total) * 100} className="mt-2" label="Interview progress" />

      <ol className="mt-6 flex flex-col gap-5" aria-live="polite">
        {transcript.map((t, i) =>
          t.role === "interviewer" ? (
            <li key={i} className="flex gap-3">
              <CamusMark size={28} className="mt-0.5" />
              <p className="flex-1 whitespace-pre-line rounded-2xl rounded-tl-md bg-mist px-4 py-3 text-[15px] leading-relaxed text-ink">{t.content}</p>
            </li>
          ) : (
            <li key={i} className="flex justify-end">
              <p className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-br-md border border-slate-200 bg-paper px-4 py-3 text-[15px] leading-relaxed text-slate-700">{t.content}</p>
            </li>
          )
        )}
      </ol>
      <div ref={endRef} />

      {error && <Notice tone="danger" className="mt-4">{error}</Notice>}

      {!complete ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="mt-6"
        >
          <label htmlFor="answer" className="sr-only">Your answer</label>
          <Textarea id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} maxLength={6000} placeholder="Answer as you would in the room. Take your time." className="!min-h-36" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={finish} disabled={finishing || answered === 0} className="min-h-11 rounded-full px-4 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40">
              {finishing ? "Preparing feedback…" : "End early & get feedback"}
            </button>
            <button type="submit" disabled={pending || answer.trim().length < 2} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper disabled:opacity-50">
              {pending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Submit answer
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-paper p-5 text-center">
          <p className="text-[15px] font-medium text-ink">That&apos;s the interview. Nicely done.</p>
          <p className="mt-1 text-sm text-slate-500">Get detailed feedback on each answer.</p>
          <button onClick={finish} disabled={finishing} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper disabled:opacity-60">
            {finishing && <Loader2 size={16} className="animate-spin" />} {finishing ? "Analysing your answers…" : "Get feedback"}
          </button>
        </div>
      )}
    </div>
  );
}
