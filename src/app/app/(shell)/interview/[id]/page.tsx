import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { requireLearner } from "@/lib/learn/server";
import { interviewFeedbackSchema } from "@/lib/learn/schemas";
import { Page } from "@/components/learn/Page";
import { PageHeader, Panel } from "@/components/learn/ui";
import { Button } from "@/components/ui/Button";
import { deleteInterview } from "@/app/actions/learn/interview";
import { QUESTIONS_PER_SESSION, type Turn } from "@/lib/learn/interview";
import { InterviewSession } from "./InterviewSession";

export const metadata = { title: "Interview" };

export default async function InterviewSessionPage({ params }: PageProps<"/app/interview/[id]">) {
  const { id } = await params;
  const { supabase } = await requireLearner();
  const { data: iv } = await supabase.from("learn_interviews").select("*").eq("id", id).maybeSingle();
  if (!iv) notFound();
  const transcript = iv.transcript as Turn[];
  const fb = iv.feedback ? interviewFeedbackSchema.safeParse(iv.feedback) : null;

  return (
    <Page width="narrow">
      <Link href="/app/interview" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-ink">
        <ArrowLeft size={14} /> Interview coach
      </Link>
      <PageHeader eyebrow={`${iv.mode.replace("_", " ")} interview`} title={iv.target_role ?? "Interview"} />

      {fb?.success ? (
        <div className="flex flex-col gap-6">
          <Panel>
            <h2 className="text-lg font-semibold tracking-tight text-ink">Feedback</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{fb.data.overall}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(
                [
                  ["Answer quality", fb.data.scores.answerQuality],
                  ["Structure", fb.data.scores.structure],
                  ["Relevance", fb.data.scores.relevance],
                  ["Communication", fb.data.scores.communication],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="rounded-xl bg-mist p-3">
                  <dt className="text-xs text-slate-500">{k}</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums text-ink">{v}<span className="text-sm text-slate-400">/5</span></dd>
                </div>
              ))}
            </dl>
          </Panel>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <List title="Strengths" items={fb.data.strengths} />
            <List title="Improvement areas" items={fb.data.improvements} />
            {fb.data.technicalGaps.length > 0 && <List title="Technical gaps" items={fb.data.technicalGaps} />}
          </div>
          {fb.data.improvedAnswers.length > 0 && (
            <Panel>
              <h2 className="text-[15px] font-semibold text-ink">Stronger versions of your answers</h2>
              <ul className="mt-4 flex flex-col gap-5">
                {fb.data.improvedAnswers.map((a, i) => (
                  <li key={i}>
                    <p className="text-sm font-medium text-ink">{a.question}</p>
                    <p className="mt-1.5 whitespace-pre-line rounded-xl bg-mist p-3 text-sm leading-relaxed text-slate-700">{a.suggestion}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
          <details className="rounded-2xl border border-slate-200 bg-paper p-5">
            <summary className="cursor-pointer text-sm font-medium text-ink">Full transcript</summary>
            <ol className="mt-4 flex flex-col gap-3">
              {transcript.map((t, i) => (
                <li key={i} className="text-sm leading-relaxed">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{t.role === "interviewer" ? "Interviewer" : "You"}</span>
                  <p className="whitespace-pre-line text-slate-700">{t.content}</p>
                </li>
              ))}
            </ol>
          </details>
          <div className="flex flex-wrap gap-3">
            <Button href={`/app/interview?role=${encodeURIComponent(iv.target_role ?? "")}`}>Practice again</Button>
            <form action={deleteInterview.bind(null, iv.id)}>
              <button type="submit" className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm text-danger hover:underline"><Trash2 size={14} /> Delete</button>
            </form>
          </div>
        </div>
      ) : (
        <InterviewSession id={iv.id} initialTranscript={transcript} total={QUESTIONS_PER_SESSION} />
      )}
    </Page>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <Panel>
      <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((i, k) => (
          <li key={k} className="flex gap-2 text-sm leading-relaxed text-slate-700">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" /> {i}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
