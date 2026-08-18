import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/admin/EmptyState";
import { Badge } from "@/components/ui/Badge";

const projectStatusTone = {
  discovery: "neutral",
  design: "signal",
  development: "signal",
  testing: "warning",
  deployed: "warning",
  launched: "success",
  on_hold: "danger",
} as const;

const milestoneStatusTone = {
  pending: "neutral",
  in_progress: "signal",
  completed: "success",
  blocked: "danger",
} as const;

export default async function PortalProjectPage({ params }: PageProps<"/portal/projects/[slug]">) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("id, name, slug, status, summary, start_date, target_launch_date")
    .eq("slug", slug)
    .single();

  if (error || !project) {
    notFound();
  }

  const { data: milestones } = await supabase
    .from("milestones")
    .select("id, title, description, status, due_date, completed_at, sort_order")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: true });

  return (
    <div>
      <Link href="/portal" className="text-sm text-slate-500 hover:text-ink">
        ← All projects
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-medium text-ink">{project.name}</h2>
          {project.summary && (
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
              {project.summary}
            </p>
          )}
        </div>
        <Badge tone={projectStatusTone[project.status]}>{project.status.replace("_", " ")}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
        {project.start_date && <span>Started {new Date(project.start_date).toLocaleDateString()}</span>}
        {project.target_launch_date && (
          <span>Target launch {new Date(project.target_launch_date).toLocaleDateString()}</span>
        )}
      </div>

      <h3 className="mt-8 mb-3 text-sm font-medium text-ink">Milestones</h3>

      {(!milestones || milestones.length === 0) && (
        <EmptyState
          title="No milestones yet"
          description="Your project timeline will show up here once it's been scoped."
        />
      )}

      {milestones && milestones.length > 0 && (
        <ol className="flex flex-col gap-3">
          {milestones.map((m) => (
            <li
              key={m.id}
              className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-paper p-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-ink">{m.title}</p>
                {m.description && (
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{m.description}</p>
                )}
                {m.due_date && (
                  <p className="mt-2 text-xs text-slate-400">
                    Due {new Date(m.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Badge tone={milestoneStatusTone[m.status]}>{m.status.replace("_", " ")}</Badge>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
