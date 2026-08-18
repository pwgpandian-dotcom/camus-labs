import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { RoleSelect } from "@/components/admin/RoleSelect";

const roleTone: Record<string, "neutral" | "signal" | "success"> = {
  client: "neutral",
  operator: "signal",
  sales: "signal",
  admin: "success",
};

export default async function TeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id ?? "")
    .single();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .order("created_at", { ascending: true });

  const isAdmin = me?.role === "admin";

  return (
    <div>
      <PageHeader
        title="Team & Roles"
        description="Everyone with an account — clients and internal staff. Only admins can change roles."
      />

      {!isAdmin && (
        <div className="mb-6 rounded-xl bg-signal-50 px-4 py-3 text-sm text-signal-dark">
          You&apos;re signed in as <strong>{me?.role}</strong> — role changes are visible but
          disabled here. Ask an admin to make changes.
        </div>
      )}

      {error && <EmptyState title="Couldn't load team" description={error.message} />}

      {!error && (!profiles || profiles.length === 0) && (
        <EmptyState
          title="No accounts yet"
          description="Accounts appear here as soon as someone signs up via /login."
        />
      )}

      {profiles && profiles.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profiles.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-3 font-medium text-ink">{p.full_name || "—"}</td>
                  <td className="px-5 py-3 text-slate-500">{p.email}</td>
                  <td className="px-5 py-3 text-slate-400">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    {isAdmin ? (
                      <RoleSelect userId={p.id} currentRole={p.role} disabled={p.id === user?.id} />
                    ) : (
                      <Badge tone={roleTone[p.role] ?? "neutral"}>{p.role}</Badge>
                    )}
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
