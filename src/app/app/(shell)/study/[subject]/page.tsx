import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireLearner } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { PageHeader } from "@/components/learn/ui";
import { getSubject, topicExists } from "@/lib/learn/catalog/subjects";
import { TopicWorkspace } from "./TopicWorkspace";

export async function generateMetadata({ params }: PageProps<"/app/study/[subject]">) {
  const { subject } = await params;
  return { title: getSubject(subject)?.name ?? "Study" };
}

export default async function SubjectPage({ params, searchParams }: PageProps<"/app/study/[subject]">) {
  const { subject: slug } = await params;
  const sp = await searchParams;
  const subject = getSubject(slug);
  if (!subject) notFound();
  const topic = typeof sp.topic === "string" && topicExists(subject, sp.topic) ? sp.topic : null;

  const { supabase, user } = await requireLearner();
  const { data: attempts } = await supabase
    .from("learn_quiz_attempts")
    .select("topic, score, total, completed_at")
    .eq("user_id", user.id)
    .eq("subject", subject.name)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(100);
  const best = new Map<string, number>();
  for (const a of attempts ?? []) if (!best.has(a.topic)) best.set(a.topic, Math.round(((a.score ?? 0) / a.total) * 100));

  if (topic) {
    return (
      <Page width="narrow">
        <Link href={`/app/study/${slug}`} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-ink">
          <ArrowLeft size={14} /> {subject.name}
        </Link>
        <PageHeader eyebrow={subject.name} title={topic} />
        <TopicWorkspace subject={subject.name} topic={topic} lastScore={best.get(topic) ?? null} />
      </Page>
    );
  }

  return (
    <Page>
      <Link href="/app/study" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-ink">
        <ArrowLeft size={14} /> All subjects
      </Link>
      <PageHeader eyebrow="Subject" title={subject.name} description={subject.blurb} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {subject.groups.map((g) => (
          <section key={g.name} className="rounded-2xl border border-slate-200 bg-paper p-2">
            <h2 className="px-3 pb-1 pt-3 text-[13px] font-medium text-slate-500">{g.name}</h2>
            <ul>
              {g.topics.map((t) => {
                const pct = best.get(t);
                return (
                  <li key={t}>
                    <Link href={`/app/study/${slug}?topic=${encodeURIComponent(t)}`} className="flex min-h-12 items-center justify-between gap-3 rounded-xl px-3 py-2 hover:bg-slate-50">
                      <span className="text-[15px] text-ink">{t}</span>
                      {pct !== undefined ? (
                        <span className={pct >= 80 ? "text-xs tabular-nums text-success" : pct >= 60 ? "text-xs tabular-nums text-slate-500" : "text-xs tabular-nums text-warning"}>{pct}%</span>
                      ) : (
                        <span className="text-xs text-slate-300">New</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </Page>
  );
}
