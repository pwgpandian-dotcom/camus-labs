import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireLearner } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { Chip, PageHeader, Panel, Progress } from "@/components/learn/ui";
import { Button } from "@/components/ui/Button";
import { getCareer } from "@/lib/learn/catalog/careers";
import { RoadmapSteps } from "./RoadmapSteps";

export async function generateMetadata({ params }: PageProps<"/app/roadmaps/[slug]">) {
  const { slug } = await params;
  return { title: `${getCareer(slug)?.title ?? "Roadmap"} roadmap` };
}

export default async function RoadmapPage({ params }: PageProps<"/app/roadmaps/[slug]">) {
  const { slug } = await params;
  const career = getCareer(slug);
  if (!career) notFound();
  const { supabase, user, profile } = await requireLearner();
  const [{ data: rows }, { count: interviews }, { count: projects }] = await Promise.all([
    supabase.from("learn_skill_progress").select("step_key, status").eq("user_id", user.id).eq("roadmap_slug", slug),
    supabase.from("learn_interviews").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "completed"),
    supabase.from("learn_projects").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "completed"),
  ]);
  const status = Object.fromEntries((rows ?? []).map((r) => [r.step_key, r.status])) as Record<string, "not_started" | "in_progress" | "done">;
  const done = career.roadmap.filter((s) => status[s.key] === "done").length;

  const userSkills = (profile?.skills ?? []).map((s) => s.toLowerCase());
  const has = (s: string) => userSkills.some((h) => s.toLowerCase().includes(h) || h.includes(s.toLowerCase().split(" (")[0]));
  const gaps = career.skills.filter((s) => !has(s));
  const strengths = career.skills.filter(has);

  const stages = [
    { label: "Current level", value: strengths.length ? `${strengths.length}/${career.skills.length} core skills` : "Starting out" },
    { label: "Skill gaps", value: `${gaps.length} to build` },
    { label: "Learning path", value: `${done}/${career.roadmap.length} steps` },
    { label: "Projects", value: `${projects ?? 0} completed` },
    { label: "Assessment", value: "Quizzes per step" },
    { label: "Interview prep", value: `${interviews ?? 0} mock interviews` },
  ];

  return (
    <Page>
      <Link href="/app/roadmaps" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-ink">
        <ArrowLeft size={14} /> Roadmaps
      </Link>
      <PageHeader eyebrow="Skill roadmap" title={career.title} description={career.summary} actions={<Button href={`/app/careers/${slug}`} variant="secondary" size="sm">Career guide</Button>} />

      <Panel>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Overall progress</p>
          <p className="text-sm tabular-nums text-slate-500">{Math.round((done / career.roadmap.length) * 100)}%</p>
        </div>
        <Progress value={(done / career.roadmap.length) * 100} className="mt-3" label="Roadmap progress" />
        <ol className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {stages.map((s, i) => (
            <li key={s.label} className="rounded-xl bg-mist p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-1 text-[13px] font-medium text-ink">{s.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{s.value}</p>
            </li>
          ))}
        </ol>
      </Panel>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RoadmapSteps slug={slug} steps={career.roadmap} initialStatus={status} />
        </div>
        <aside className="flex flex-col gap-6">
          <Panel>
            <h2 className="text-[15px] font-semibold text-ink">Skill gaps</h2>
            {gaps.length ? (
              <div className="mt-3 flex flex-wrap gap-2">{gaps.map((g) => <Chip key={g}>{g}</Chip>)}</div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Your listed skills cover the core list. Focus on projects and interview practice.</p>
            )}
            <p className="mt-3 text-xs text-slate-400">Based on the skills in your Career Twin.</p>
          </Panel>
          <Panel>
            <h2 className="text-[15px] font-semibold text-ink">Prove it with a project</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {career.projects.map((p) => (
                <li key={p.title} className="text-sm text-slate-700"><span className="text-xs capitalize text-slate-400">{p.level} · </span>{p.title}</li>
              ))}
            </ul>
            <div className="mt-4"><Button href={`/app/projects?role=${encodeURIComponent(career.title)}`} size="sm">Generate a project</Button></div>
          </Panel>
          <Panel>
            <h2 className="text-[15px] font-semibold text-ink">Interview preparation</h2>
            <p className="mt-1 text-sm text-slate-500">Practise the topics this role is known for.</p>
            <div className="mt-4"><Button href={`/app/interview?role=${encodeURIComponent(career.title)}`} variant="secondary" size="sm">Practice interview</Button></div>
          </Panel>
        </aside>
      </div>
    </Page>
  );
}
