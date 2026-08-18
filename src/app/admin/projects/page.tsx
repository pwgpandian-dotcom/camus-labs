import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
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

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, slug, status, summary, target_launch_date, clients(company_name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Every project currently in build, from discovery through launch."
      />

      {error && (
        <EmptyState title="Couldn't load projects" description={error.message} />
      )}

      {!error && (!projects || projects.length === 0) && (
        <EmptyState
          title="No projects yet"
          description="Projects are created once a project request is accepted and a client account exists."
        />
      )}

      {projects && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <div key={p.id} className="rounded-2xl border border-slate-200 bg-paper p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">{p.clients?.company_name}</p>
                  <h3 className="mt-1 text-base font-medium text-ink">{p.name}</h3>
                </div>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
