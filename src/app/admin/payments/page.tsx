import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { NewPaymentForm } from "@/components/admin/NewPaymentForm";
import { updatePaymentStatus } from "@/app/actions/admin";

const statusOptions = ["pending", "paid", "overdue", "refunded"] as const;

export default async function PaymentsPage() {
  const supabase = await createClient();

  const [{ data: payments, error }, { data: clients }, { data: projects }] = await Promise.all([
    supabase
      .from("payments")
      .select("id, invoice_number, amount, currency, status, due_date, paid_at, clients(company_name), projects(name)")
      .order("created_at", { ascending: false }),
    supabase.from("clients").select("id, company_name").order("company_name"),
    supabase.from("projects").select("id, name").order("name"),
  ]);

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Invoices recorded against client projects. No payment gateway is wired up yet — this tracks status manually."
      />

      <NewPaymentForm
        clients={(clients || []).map((c) => ({ id: c.id, label: c.company_name }))}
        projects={(projects || []).map((p) => ({ id: p.id, label: p.name }))}
      />

      {error && <EmptyState title="Couldn't load payments" description={error.message} />}

      {!error && (!payments || payments.length === 0) && (
        <div className="mt-6">
          <EmptyState
            title="No invoices yet"
            description="Record your first invoice above once a client and project exist."
          />
        </div>
      )}

      {payments && payments.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Invoice</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Project</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Due</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-3 font-mono text-xs text-ink">{p.invoice_number}</td>
                  <td className="px-5 py-3 text-slate-500">{p.clients?.company_name || "—"}</td>
                  <td className="px-5 py-3 text-slate-500">{p.projects?.name || "—"}</td>
                  <td className="px-5 py-3 font-medium text-ink">
                    {p.currency} {Number(p.amount).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {p.due_date ? new Date(p.due_date).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <StatusSelect
                      id={p.id}
                      currentValue={p.status}
                      options={statusOptions}
                      action={updatePaymentStatus}
                    />
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
