import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, company_name, billing_address, created_at, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Companies and individuals with CAMUS Labs portal access."
      />

      {error && (
        <EmptyState title="Couldn't load clients" description={error.message} />
      )}

      {!error && (!clients || clients.length === 0) && (
        <EmptyState
          title="No clients yet"
          description="Convert an accepted project request into a client to see them here."
        />
      )}

      {clients && clients.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Client since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((c) => (
                <tr key={c.id}>
                  <td className="px-5 py-3 font-medium text-ink">{c.company_name}</td>
                  <td className="px-5 py-3 text-slate-500">
                    {c.profiles?.full_name || c.profiles?.email || "—"}
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {new Date(c.created_at).toLocaleDateString()}
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
