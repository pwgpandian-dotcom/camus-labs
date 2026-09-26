import Link from "next/link";
import { requireLearner } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { PageHeader, Panel } from "@/components/learn/ui";
import { subjects } from "@/lib/learn/catalog/subjects";
import { slugify } from "@/lib/learn/next-action";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Study tutor" };

export default async function StudyPage() {
  const { supabase, user, profile } = await requireLearner();
  const { data: attempts } = await supabase
    .from("learn_quiz_attempts")
    .select("subject, topic, score, total, completed_at")
    .eq("user_id", user.id)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(60);

  // Weak-topic detection: latest attempt per topic below 60%.
  const latest = new Map<string, { subject: string; topic: string; pct: number }>();
  for (const a of attempts ?? []) {
    const k = `${a.subject}::${a.topic}`;
    if (!latest.has(k)) latest.set(k, { subject: a.subject, topic: a.topic, pct: Math.round(((a.score ?? 0) / a.total) * 100) });
  }
  const weak = [...latest.values()].filter((t) => t.pct < 60).slice(0, 6);
  const strong = [...latest.values()].filter((t) => t.pct >= 80).slice(0, 6);
  const mine = new Set((profile?.subjects ?? []).map((s) => s.toLowerCase()));
  const ordered = [...subjects].sort((a, b) => Number(mine.has(b.name.toLowerCase())) - Number(mine.has(a.name.toLowerCase())));

  return (
    <Page>
      <PageHeader
        eyebrow="Study tutor"
        title="What are we learning today?"
        description="Subject → topic → lesson → practice → quiz → review. The tutor teaches concepts — it won't just hand over answers for assessments."
        actions={<Button href="/app/exams" variant="secondary" size="sm">Exam preparation</Button>}
      />

      {weak.length > 0 && (
        <Panel className="mb-6 border-[#f1dfb0] bg-[#fdf8ec]">
          <h2 className="text-[15px] font-semibold text-ink">Topics to revisit</h2>
          <p className="mt-1 text-[13px] text-slate-600">Based on your most recent quiz on each topic.</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {weak.map((w) => (
              <li key={w.subject + w.topic}>
                <Link href={`/app/study/${slugify(w.subject)}?topic=${encodeURIComponent(w.topic)}`} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#e6d09a] bg-paper px-3.5 text-[13px] text-ink hover:border-warning">
                  {w.topic} <span className="tabular-nums text-warning">{w.pct}%</span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ordered.map((s) => {
          const topics = s.groups.reduce((n, g) => n + g.topics.length, 0);
          const practised = [...latest.values()].filter((t) => t.subject === s.name).length;
          return (
            <li key={s.slug}>
              <Link href={`/app/study/${s.slug}`} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-paper p-5 transition-colors hover:border-slate-400">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-[15px] font-semibold text-ink">{s.name}</h2>
                  {mine.has(s.name.toLowerCase()) && <span className="rounded-full bg-signal-50 px-2 py-0.5 text-[11px] font-medium text-signal-dark">Your subject</span>}
                </div>
                <p className="mt-1 flex-1 text-[13px] text-slate-500">{s.blurb}</p>
                <p className="mt-4 text-xs text-slate-400">
                  {topics} topics{practised ? ` · ${practised} practised` : ""}
                </p>
              </Link>
            </li>
          );
        })}
        <li>
          <Link href="/app/assistant?mode=study" className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-slate-300 bg-mist p-5 hover:border-slate-400">
            <h2 className="text-[15px] font-semibold text-ink">Another subject?</h2>
            <p className="mt-1 text-[13px] text-slate-500">Languages, accounting, music theory — ask the tutor about anything.</p>
          </Link>
        </li>
      </ul>

      {strong.length > 0 && (
        <p className="mt-8 text-[13px] text-slate-500">
          Strong recently: {strong.map((s) => s.topic).join(", ")}.
        </p>
      )}
    </Page>
  );
}
