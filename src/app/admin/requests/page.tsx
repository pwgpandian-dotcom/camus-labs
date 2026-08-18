import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Badge } from "@/components/ui/Badge";

const statusTone = {
  received: "signal",
  reviewing: "warning",
  proposal_sent: "warning",
  accepted: "success",
  declined: "danger",
} as const;

export default async function AdminRequestsPage() {
  const supabase = await createClient();
  const { data: requests, error } = await supabase
    .from("project_requests")
    .select(
      "id, reference_number, build_type, idea_description, industry, timeline, budget_range, contact_name, contact_email, status, created_at"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Project Requests"
        description="Submissions from the Start Your Project onboarding flow, ready to triage."
      />

      {error && (
        <EmptyState title="Couldn't load project requests" description={error.message} />
      )}

      {!error && (!requests || requests.length === 0) && (
        <EmptyState
          title="No project requests yet"
          description="Once the Start Your Project flow is built and someone submits it, requests will appear here with a reference number for tracking."
        />
      )}

      {requests && requests.length > 0 && (
        <div className="flex flex-col gap-4">
          {requests.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-paper p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-slate-400">{r.reference_number}</p>
                  <h3 className="mt-1 text-base font-medium text-ink">
                    {r.contact_name} — {r.build_type}
                  </h3>
                </div>
                <Badge tone={statusTone[r.status]}>{r.status.replace("_", " ")}</Badge>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {r.idea_description}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
                <span>Industry: {r.industry || "—"}</span>
                <span>Timeline: {r.timeline || "—"}</span>
                <span>Budget: {r.budget_range || "—"}</span>
                <span>{r.contact_email}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
