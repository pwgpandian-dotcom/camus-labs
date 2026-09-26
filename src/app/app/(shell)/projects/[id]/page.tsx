import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, Trash2 } from "lucide-react";
import { requireLearner } from "@/lib/learn/server";
import { projectSpecSchema } from "@/lib/learn/schemas";
import { Page } from "@/components/learn/Page";
import { Chip, PageHeader, Panel, Progress } from "@/components/learn/ui";
import { deleteProject, reopenProject } from "@/app/actions/learn/projects";
import { TaskList } from "./TaskList";
import { CompleteForm } from "./CompleteForm";

export const metadata = { title: "Project" };

export default async function ProjectPage({ params }: PageProps<"/app/projects/[id]">) {
  const { id } = await params;
  const { supabase } = await requireLearner();
  const [{ data: project }, { data: tasks }] = await Promise.all([
    supabase.from("learn_projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("learn_project_tasks").select("id, milestone, title, is_done, sort").eq("project_id", id).order("sort"),
  ]);
  if (!project) notFound();
  const specParsed = projectSpecSchema.safeParse(project.spec);
  const spec = specParsed.success ? specParsed.data : null;
  const done = (tasks ?? []).filter((t) => t.is_done).length;
  const total = (tasks ?? []).length;

  return (
    <Page>
      <Link href="/app/projects" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-ink">
        <ArrowLeft size={14} /> Projects
      </Link>
      <PageHeader eyebrow={`${project.level} project`} title={project.title} description={spec?.objective} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Panel>
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-ink">Milestones & tasks</h2>
              <span className="text-sm tabular-nums text-slate-500">{done}/{total}</span>
            </div>
            <Progress value={total ? (done / total) * 100 : 0} className="mt-3" label="Task progress" />
            <TaskList projectId={project.id} tasks={(tasks ?? []).map((t) => ({ id: t.id, milestone: t.milestone ?? "", title: t.title, done: t.is_done }))} />
          </Panel>
          {spec && (
            <>
              <Panel>
                <h2 className="text-[15px] font-semibold text-ink">Problem</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{spec.problem}</p>
                <h2 className="mt-6 text-[15px] font-semibold text-ink">Features</h2>
                <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm text-slate-700">{spec.features.map((f) => <li key={f}>{f}</li>)}</ul>
              </Panel>
              <Panel>
                <h2 className="text-[15px] font-semibold text-ink">Architecture</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">{spec.architecture}</p>
                <h3 className="mt-5 text-[13px] font-medium text-slate-500">Database</h3>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{spec.database}</p>
                {spec.apis.length > 0 && (
                  <>
                    <h3 className="mt-5 text-[13px] font-medium text-slate-500">APIs</h3>
                    <ul className="mt-1 flex flex-col gap-1 font-mono text-[13px] text-slate-700">{spec.apis.map((a) => <li key={a}>{a}</li>)}</ul>
                  </>
                )}
              </Panel>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Panel><h2 className="text-[15px] font-semibold text-ink">Testing</h2><p className="mt-2 text-sm text-slate-700">{spec.testing}</p></Panel>
                <Panel><h2 className="text-[15px] font-semibold text-ink">Deployment</h2><p className="mt-2 text-sm text-slate-700">{spec.deployment}</p></Panel>
                <Panel><h2 className="text-[15px] font-semibold text-ink">Documentation</h2><p className="mt-2 text-sm text-slate-700">{spec.documentation}</p></Panel>
              </div>
            </>
          )}
        </div>
        <aside className="flex flex-col gap-6">
          {spec && (
            <Panel>
              <h2 className="text-[15px] font-semibold text-ink">Tech stack</h2>
              <div className="mt-3 flex flex-wrap gap-2">{spec.techStack.map((t) => <Chip key={t}>{t}</Chip>)}</div>
            </Panel>
          )}
          <Panel>
            <h2 className="text-[15px] font-semibold text-ink">Status</h2>
            {project.status === "completed" ? (
              <>
                <p className="mt-2 text-sm text-success">Completed {project.completed_at ? new Date(project.completed_at).toLocaleDateString() : ""}</p>
                {project.repo_url && <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="mt-2 block truncate text-sm text-signal-dark hover:underline">{project.repo_url}</a>}
                {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-sm text-signal-dark hover:underline">{project.live_url}</a>}
                {spec && <p className="mt-4 rounded-xl bg-mist p-3 text-[13px] text-slate-600">{spec.portfolioDescription}</p>}
                <p className="mt-3 text-xs text-slate-400">New resumes will now include this project.</p>
                <form action={reopenProject.bind(null, project.id)}>
                  <button type="submit" className="mt-3 text-[13px] text-slate-500 hover:text-ink">Reopen project</button>
                </form>
              </>
            ) : (
              <CompleteForm projectId={project.id} allTasksDone={total > 0 && done === total} />
            )}
          </Panel>
          <Panel>
            <Link href={`/app/assistant?mode=project&q=${encodeURIComponent(`I'm building "${project.title}". I'm stuck on: `)}`} className="inline-flex items-center gap-2 text-sm text-signal-dark hover:underline">
              <Sparkles size={14} /> Get help from the assistant
            </Link>
          </Panel>
          <form action={deleteProject.bind(null, project.id)}>
            <button type="submit" className="inline-flex items-center gap-1.5 text-sm text-danger hover:underline"><Trash2 size={14} /> Delete project</button>
          </form>
        </aside>
      </div>
    </Page>
  );
}
