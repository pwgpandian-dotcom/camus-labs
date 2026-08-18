import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusSelect } from "@/components/admin/StatusSelect";
import { updateConsultationStatus } from "@/app/actions/admin";

const statusOptions = ["requested", "confirmed", "completed", "cancelled"] as const;

export default async function ConsultationsPage() {
  const supabase = await createClient();
  const { data: consultations, error } = await supabase
    .from("consultations")
    .select(
      "id, type, scheduled_at, duration_minutes, status, notes, clients(company_name), leads(name, email)"
    )
    .order("scheduled_at", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Consultations"
        description="Discovery calls, technical reviews and proposal walkthroughs — booked by clients or leads."
      />

      {error && <EmptyState title="Couldn't load consultations" description={error.message} />}

      {!error && (!consultations || consultations.length === 0) && (
        <EmptyState
          title="No consultations booked yet"
          description="Consultations booked via WhatsApp today aren't tracked here yet — that needs the Phase 4 booking flow. Once it ships, bookings will appear in this list automatically."
        />
      )}

      {consultations && consultations.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Who</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Scheduled</th>
                <th className="px-5 py-3 font-medium">Duration</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {consultations.map((c) => (
                <tr key={c.id}>
                  <td className="px-5 py-3 font-medium text-ink">
                    {c.clients?.company_name || c.leads?.name || c.leads?.email || "—"}
                  </td>
                  <td className="px-5 py-3 text-slate-500 capitalize">{c.type}</td>
                  <td className="px-5 py-3 text-slate-500">
                    {new Date(c.scheduled_at).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-slate-400">{c.duration_minutes} min</td>
                  <td className="px-5 py-3">
                    <StatusSelect
                      id={c.id}
                      currentValue={c.status}
                      options={statusOptions}
                      action={updateConsultationStatus}
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
