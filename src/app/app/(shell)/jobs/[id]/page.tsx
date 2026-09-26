import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, CircleDashed, Trash2 } from "lucide-react";
import { requireLearner } from "@/lib/learn/server";
import { jobReportSchema } from "@/lib/learn/schemas";
import { Page } from "@/components/learn/Page";
import { Chip, PageHeader, Panel, Progress } from "@/components/learn/ui";
import { Button } from "@/components/ui/Button";
import { deleteAnalysis } from "@/app/actions/learn/jobs";

export const metadata = { title: "Job alignment report" };

export default async function JobReportPage({ params }: PageProps<"/app/jobs/[id]">) {
  const { id } = await params;
  const { supabase } = await requireLearner();
  const { data: a } = await supabase.from("learn_job_analyses").select("*").eq("id", id).maybeSingle();
  if (!a) notFound();
  const parsed = jobReportSchema.safeParse(a.report);
  if (!parsed.success) notFound();
  const r = parsed.data;
  const required = r.requiredSkills.length;
  const matchedRequired = r.requiredSkills.filter((s) => r.matchingSkills.some((m) => m.toLowerCase() === s.toLowerCase())).length;

  return (
    <Page>
      <Link href="/app/jobs" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-ink">
        <ArrowLeft size={14} /> Job match
      </Link>
      <PageHeader
        eyebrow="Job alignment report"
        title={a.title || "Job description"}
        description={a.company ?? undefined}
        actions={
          <>
            <Button href="/app/resume" size="sm">Improve resume</Button>
            <Button href={`/app/interview?role=${encodeURIComponent(a.title ?? "")}`} variant="secondary" size="sm">Practice interview</Button>
          </>
        }
      />

      <Panel>
        <p className="text-[15px] leading-relaxed text-slate-700">{r.roleSummary}</p>
        {required > 0 && (
          <div className="mt-5 max-w-md">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Required skills with evidence in your profile</span>
              <span className="tabular-nums text-ink">{matchedRequired}/{required}</span>
            </div>
            <Progress value={(matchedRequired / required) * 100} className="mt-2" label="Required skills matched" />
          </div>
        )}
        <div className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <p><span className="text-slate-500">Experience: </span><span className="text-ink">{r.experience || "Not specified"}</span></p>
          <p><span className="text-slate-500">Education: </span><span className="text-ink">{r.education || "Not specified"}</span></p>
        </div>
      </Panel>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Panel>
          <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink"><CheckCircle2 size={16} className="text-success" /> Matching skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">{r.matchingSkills.length ? r.matchingSkills.map((s) => <Chip key={s} className="border-[#c5e8d8] bg-[#f0faf5] text-success">{s}</Chip>) : <p className="text-sm text-slate-500">No clear matches found yet.</p>}</div>
        </Panel>
        <Panel>
          <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink"><CircleDashed size={16} className="text-warning" /> Missing skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">{r.missingSkills.length ? r.missingSkills.map((s) => <Chip key={s}>{s}</Chip>) : <p className="text-sm text-slate-500">No obvious gaps.</p>}</div>
        </Panel>
        <ListPanel title="Relevant experience" items={r.relevantExperience} empty="Nothing directly relevant listed yet — projects can fill this gap." />
        <ListPanel title="Relevant projects" items={r.relevantProjects} empty="Build a project that uses the missing skills." />
        <ListPanel title="Resume improvements" items={r.resumeImprovements} />
        <ListPanel title="Interview topics" items={r.interviewTopics} />
        <ListPanel title="Learning recommendations" items={r.learningRecommendations} />
        <Panel>
          <h2 className="text-[15px] font-semibold text-ink">Keywords in this job post</h2>
          <div className="mt-3 flex flex-wrap gap-1.5">{r.keywords.map((k) => <span key={k} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">{k}</span>)}</div>
          <p className="mt-3 text-xs text-slate-400">Use these only where they truthfully describe your work.</p>
        </Panel>
        <ListPanel title="Required skills" items={r.requiredSkills} />
        <ListPanel title="Preferred skills" items={r.preferredSkills} />
        <ListPanel title="Responsibilities" items={r.responsibilities} />
      </div>

      <details className="mt-6 rounded-2xl border border-slate-200 bg-paper p-5">
        <summary className="cursor-pointer text-sm font-medium text-ink">Original job description</summary>
        <p className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed text-slate-600">{a.jd_text}</p>
      </details>
      <form action={deleteAnalysis.bind(null, a.id)} className="mt-6">
        <button type="submit" className="inline-flex items-center gap-1.5 text-sm text-danger hover:underline"><Trash2 size={14} /> Delete report</button>
      </form>
      <p className="mt-6 text-xs text-slate-400">This report measures alignment and preparation. It is not an ATS score and cannot predict hiring decisions.</p>
    </Page>
  );
}

function ListPanel({ title, items, empty }: { title: string; items: string[]; empty?: string }) {
  return (
    <Panel>
      <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
      {items.length ? (
        <ul className="mt-3 flex flex-col gap-2">
          {items.map((i, k) => (
            <li key={k} className="flex gap-2 text-sm leading-relaxed text-slate-700">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" /> {i}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-500">{empty ?? "—"}</p>
      )}
    </Panel>
  );
}
