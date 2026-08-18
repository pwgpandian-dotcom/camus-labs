import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Badge } from "@/components/ui/Badge";

const statusTone = {
  new: "signal",
  contacted: "warning",
  qualified: "success",
  archived: "neutral",
} as const;

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, name, email, company, message, status, source, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Leads"
        description="General inquiries submitted from the website contact form."
      />

      {error && (
        <EmptyState title="Couldn't load leads" description={error.message} />
      )}

      {!error && (!leads || leads.length === 0) && (
        <EmptyState
          title="No leads yet"
          description="Once the public Contact page is live, general inquiries will land here for triage."
        />
      )}

      {leads && leads.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Source</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-5 py-3 font-medium text-ink">{lead.name}</td>
                  <td className="px-5 py-3 text-slate-500">{lead.email}</td>
                  <td className="px-5 py-3 text-slate-500">{lead.company || "—"}</td>
                  <td className="px-5 py-3 text-slate-500">{lead.source || "—"}</td>
                  <td className="px-5 py-3">
                    <Badge tone={statusTone[lead.status]}>{lead.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
