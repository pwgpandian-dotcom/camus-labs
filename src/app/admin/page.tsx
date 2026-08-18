import { createClient } from "@/lib/supabase/server";
import { StatTile } from "@/components/admin/StatTile";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    { count: leadsCount },
    { count: requestsCount },
    { count: clientsCount },
    { count: projectsCount },
    { data: recentRequests },
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase
      .from("project_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "received"),
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .not("status", "in", "(launched,on_hold)"),
    supabase
      .from("project_requests")
      .select("id, reference_number, build_type, contact_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Pipeline health across leads, requests, clients and active projects."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="New leads" value={leadsCount ?? 0} />
        <StatTile label="Requests to triage" value={requestsCount ?? 0} />
        <StatTile label="Clients" value={clientsCount ?? 0} />
        <StatTile label="Active projects" value={projectsCount ?? 0} />
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-sm font-medium text-ink">
          Recent project requests
        </h2>
        {recentRequests && recentRequests.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-mist text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Reference</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Build type</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRequests.map((r) => (
                  <tr key={r.id}>
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">
                      {r.reference_number}
                    </td>
                    <td className="px-5 py-3">{r.contact_name}</td>
                    <td className="px-5 py-3 text-slate-500">{r.build_type}</td>
                    <td className="px-5 py-3 capitalize text-slate-500">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No project requests yet"
            description="Submissions from the Start Your Project flow will appear here once that page is live and someone submits it."
          />
        )}
      </div>
    </div>
  );
}
