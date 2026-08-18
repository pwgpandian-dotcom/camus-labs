import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/admin/EmptyState";
import { Badge } from "@/components/ui/Badge";

const statusTone = {
  discovery: "neutral",
  design: "signal",
  development: "signal",
  testing: "warning",
  deployed: "warning",
  launched: "success",
  on_hold: "danger",
} as const;

export default async function PortalOverviewPage() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, slug, status, summary, target_launch_date")
    .order("created_at", { ascending: false });

  if (error) {
    return <EmptyState title="Couldn't load your projects" description={error.message} />;
  }

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        title="No active projects yet"
        description="Once your project kicks off, it'll appear here with live status and milestones."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {projects.map((p) => (
        <Link
          key={p.id}
          href={`/portal/projects/${p.slug}`}
          className="rounded-2xl border border-slate-200 bg-paper p-6 transition-colors hover:border-slate-400"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-medium text-ink">{p.name}</h3>
            <Badge tone={statusTone[p.status]}>{p.status.replace("_", " ")}</Badge>
          </div>
          {p.summary && (
            <p className="mt-3 text-sm leading-relaxed text-slate-500">{p.summary}</p>
          )}
          {p.target_launch_date && (
            <p className="mt-4 text-xs text-slate-400">
              Target launch: {new Date(p.target_launch_date).toLocaleDateString()}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
