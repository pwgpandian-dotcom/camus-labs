import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireLearner } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { PageHeader, Panel, Progress } from "@/components/learn/ui";
import { ExamPractice } from "./ExamPractice";

export async function generateMetadata({ params }: PageProps<"/app/exams/[slug]">) {
  const { slug } = await params;
  return { title: slug.toUpperCase() };
}

export default async function ExamPage({ params }: PageProps<"/app/exams/[slug]">) {
  const { slug } = await params;
  const { supabase, user } = await requireLearner();
  const [{ data: exam }, { data: attempts }] = await Promise.all([
    supabase.from("learn_exams").select("*").eq("slug", slug).maybeSingle(),
    supabase.from("learn_quiz_attempts").select("subject, topic, score, total, completed_at").eq("user_id", user.id).eq("exam_slug", slug).not("completed_at", "is", null).order("completed_at", { ascending: false }).limit(200),
  ]);
  if (!exam) notFound();

  const bySubject = exam.subjects.map((s) => {
    const rows = (attempts ?? []).filter((a) => a.subject === s);
    const correct = rows.reduce((n, r) => n + (r.score ?? 0), 0);
    const total = rows.reduce((n, r) => n + r.total, 0);
    return { subject: s, attempts: rows.length, pct: total ? Math.round((correct / total) * 100) : null };
  });
  const weakest = bySubject.filter((b) => b.pct !== null).sort((a, b) => a.pct! - b.pct!)[0];

  return (
    <Page>
      <Link href="/app/exams" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-ink">
        <ArrowLeft size={14} /> All exams
      </Link>
      <PageHeader eyebrow="Exam preparation" title={exam.name} description={exam.description ?? undefined} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ExamPractice examSlug={exam.slug} examName={exam.name} subjects={exam.subjects} />
        </div>
        <aside className="flex flex-col gap-6">
          <Panel>
            <h2 className="text-[15px] font-semibold text-ink">Performance by subject</h2>
            <ul className="mt-4 flex flex-col gap-4">
              {bySubject.map((b) => (
                <li key={b.subject}>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink">{b.subject}</span>
                    <span className="tabular-nums text-slate-500">{b.pct === null ? "—" : `${b.pct}%`}</span>
                  </div>
                  <Progress value={b.pct ?? 0} className="mt-1.5" label={`${b.subject} accuracy`} />
                  <p className="mt-1 text-xs text-slate-400">{b.attempts} {b.attempts === 1 ? "set" : "sets"} completed</p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <h2 className="text-[15px] font-semibold text-ink">Revision recommendation</h2>
            <p className="mt-2 text-sm text-slate-600">
              {weakest ? `Focus next on ${weakest.subject} — it's currently your lowest-scoring area at ${weakest.pct}%.` : "Complete a practice set in each subject to get a personalised revision plan."}
            </p>
            <Link href={`/app/assistant?mode=study&q=${encodeURIComponent(`Build me a 4-week ${exam.name} study plan based on my profile${weakest ? `, prioritising ${weakest.subject}` : ""}. Include daily tasks and weekly mock tests.`)}`} className="mt-4 inline-flex min-h-10 items-center rounded-full border border-slate-300 px-4 text-sm text-ink hover:border-ink">
              Build my study plan
            </Link>
          </Panel>
        </aside>
      </div>
    </Page>
  );
}
