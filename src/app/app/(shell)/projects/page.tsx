import Link from "next/link";
import { requireLearner } from "@/lib/learn/server";
import { aiAvailable } from "@/lib/learn/ai/service";
import { Page } from "@/components/learn/Page";
import { Notice, PageHeader, Panel, Progress } from "@/components/learn/ui";
import { ProjectGenerator } from "./ProjectGenerator";

export const metadata = { title: "Project builder" };

export default async function ProjectsPage({ searchParams }: PageProps<"/app/projects">) {
  const sp = await searchParams;
  const { supabase, user, profile } = await requireLearner();
  const [{ data: projects }, { data: tasks }] = await Promise.all([
    supabase.from("learn_projects").select("id, title, level, status, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }),
    supabase.from("learn_project_tasks").select("project_id, is_done").eq("user_id", user.id),
  ]);
  const progress = (id: string) => {
    const t = (tasks ?? []).filter((x) => x.project_id === id);
    return t.length ? (t.filter((x) => x.is_done).length / t.length) * 100 : 0;
  };
  const goal = (typeof sp.role === "string" && sp.role) || profile?.target_role || "";

  return (
    <Page>
      <PageHeader eyebrow="Project builder" title="Build real projects" description="Get a scoped project with architecture, milestones and tasks matched to your level. It's only marked complete when you say you've finished it." />
      {!aiAvailable() && <Notice tone="warning" className="mb-6">AI isn&apos;t configured yet, so new projects can&apos;t be generated.</Notice>}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <ProjectGenerator defaultGoal={goal ? `I want to become a ${goal}` : ""} />
        </Panel>
        <Panel>
          <h2 className="text-[15px] font-semibold text-ink">Your projects</h2>
          {(projects ?? []).length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Nothing yet — generate your first project.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-1">
              {projects!.map((p) => (
                <li key={p.id}>
                  <Link href={`/app/projects/${p.id}`} className="block rounded-lg px-2 py-2.5 hover:bg-slate-50">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm text-ink">{p.title}</span>
                      <span className={p.status === "completed" ? "shrink-0 text-xs text-success" : "shrink-0 text-xs capitalize text-slate-400"}>{p.status.replace("_", " ")}</span>
                    </span>
                    <Progress value={progress(p.id)} className="mt-2" label={`${p.title} progress`} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </Page>
  );
}
