import Link from "next/link";
import { requireLearner } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { EmptyState, PageHeader, Panel, Progress } from "@/components/learn/ui";
import { Button } from "@/components/ui/Button";
import { careers, getCareer } from "@/lib/learn/catalog/careers";
import { matchCareer } from "@/lib/learn/profile-generator";
import { Target } from "lucide-react";

export const metadata = { title: "Skill roadmaps" };

export default async function RoadmapsPage() {
  const { supabase, user, profile } = await requireLearner();
  const { data: rows } = await supabase.from("learn_skill_progress").select("roadmap_slug, status").eq("user_id", user.id);
  const target = matchCareer(profile?.target_role);
  const started = new Set((rows ?? []).map((r) => r.roadmap_slug));
  if (target) started.add(target.slug);
  const mine = [...started].map((s) => getCareer(s)).filter((c): c is NonNullable<typeof c> => !!c);

  return (
    <Page>
      <PageHeader eyebrow="Skill roadmaps" title="Your roadmaps" description="Current level → skill gaps → learning path → projects → assessment → interview preparation. Mark steps as you genuinely complete them." />
      {mine.length === 0 ? (
        <EmptyState icon={<Target size={20} />} title="No roadmap yet" description="Choose a target role and we'll lay out the path step by step." action={<Button href="/app/careers" size="sm">Explore careers</Button>} />
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {mine.map((c) => {
            const done = (rows ?? []).filter((r) => r.roadmap_slug === c.slug && r.status === "done").length;
            return (
              <li key={c.slug}>
                <Link href={`/app/roadmaps/${c.slug}`} className="block rounded-2xl border border-slate-200 bg-paper p-5 hover:border-slate-400">
                  <div className="flex items-center justify-between">
                    <p className="text-[15px] font-semibold text-ink">{c.title}</p>
                    {target?.slug === c.slug && <span className="rounded-full bg-signal-50 px-2.5 py-0.5 text-[11px] font-medium text-signal-dark">Target</span>}
                  </div>
                  <Progress value={(done / c.roadmap.length) * 100} className="mt-4" label={`${c.title} progress`} />
                  <p className="mt-2 text-[13px] text-slate-500">{done} of {c.roadmap.length} steps done</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <Panel className="mt-8">
        <h2 className="text-[15px] font-semibold text-ink">All roadmaps</h2>
        <ul className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {careers.map((c) => (
            <li key={c.slug}>
              <Link href={`/app/roadmaps/${c.slug}`} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-slate-50">
                <span className="text-ink">{c.title}</span>
                <span className="text-xs text-slate-400">{c.roadmap.length} steps</span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </Page>
  );
}
