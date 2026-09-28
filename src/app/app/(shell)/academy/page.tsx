import Link from "next/link";
import { requireLearner } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { PageHeader, Progress } from "@/components/learn/ui";
import { academy } from "@/lib/learn/catalog/academy";

export const metadata = { title: "AI Academy" };

export default async function AcademyPage() {
  const { supabase, user } = await requireLearner();
  const { data: rows } = await supabase.from("learn_skill_progress").select("roadmap_slug, step_key, status").eq("user_id", user.id).like("roadmap_slug", "academy:%");
  const doneFor = (slug: string) => (rows ?? []).filter((r) => r.roadmap_slug === `academy:${slug}` && r.status === "done").length;

  return (
    <Page>
      <PageHeader
        eyebrow="AI Productivity Academy"
        title="Use AI well — for learning, coding and work"
        description="Short, practical lessons on prompting, context, AI-assisted coding, agents and MCP, and responsible use. Tool names such as Claude are referenced as third-party products; Camus is not affiliated with their makers."
      />
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {academy.map((c) => {
          const done = doneFor(c.slug);
          const minutes = c.lessons.reduce((a, l) => a + l.minutes, 0);
          return (
            <li key={c.slug}>
              <Link href={`/app/academy/${c.slug}`} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-paper p-5 hover:border-slate-400">
                <p className="text-xs text-slate-400">{c.level} · {c.lessons.length} lessons · {minutes} min</p>
                <h2 className="mt-1 text-[15px] font-semibold text-ink">{c.title}</h2>
                <p className="mt-1 flex-1 text-[13px] leading-relaxed text-slate-500">{c.summary}</p>
                <Progress value={(done / c.lessons.length) * 100} className="mt-4" label={`${c.title} progress`} />
                <p className="mt-1.5 text-xs text-slate-400">{done}/{c.lessons.length} complete</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </Page>
  );
}
