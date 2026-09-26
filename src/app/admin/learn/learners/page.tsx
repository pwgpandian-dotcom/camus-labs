import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";

export const metadata = { title: "Learners · Camus Learn Admin" };

/**
 * Directory of learners with minimal fields. Conversation content, resumes and
 * interview answers are intentionally not shown here.
 */
export default async function LearnersAdmin({ searchParams }: PageProps<"/admin/learn/learners">) {
  const sp = await searchParams;
  const page = Math.max(0, Number(sp.page ?? 0) || 0);
  const size = 50;
  const supabase = await createClient();
  const { data: learners, count } = await supabase
    .from("learn_profiles")
    .select("user_id, display_name, stage, age_band, country_code, target_role, onboarding_completed_at, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * size, page * size + size - 1);
  const ids = (learners ?? []).map((l) => l.user_id);
  const [{ data: people }, { data: subs }] = await Promise.all([
    ids.length ? supabase.from("profiles").select("id, email").in("id", ids) : Promise.resolve({ data: [] as { id: string; email: string | null }[] }),
    ids.length ? supabase.from("learn_subscriptions").select("user_id, plan_id, status").in("user_id", ids).in("status", ["active", "trialing"]) : Promise.resolve({ data: [] as { user_id: string; plan_id: string; status: string }[] }),
  ]);

  return (
    <div>
      <PageHeader title="Learners" description={`${count ?? 0} learners. Minors' emails are hidden; personal learning content is never shown to staff here.`} />
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-mist text-xs uppercase tracking-wide text-slate-400">
            <tr><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Email</th><th className="px-4 py-3 font-medium">Stage</th><th className="px-4 py-3 font-medium">Country</th><th className="px-4 py-3 font-medium">Plan</th><th className="px-4 py-3 font-medium">Joined</th></tr>
          </thead>
          <tbody>
            {(learners ?? []).map((l) => {
              const minor = l.age_band === "under_13" || l.age_band === "13_17";
              const sub = subs?.find((s) => s.user_id === l.user_id);
              return (
                <tr key={l.user_id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{l.display_name ?? "—"}{!l.onboarding_completed_at && <span className="ml-2 text-xs text-warning">onboarding</span>}</td>
                  <td className="px-4 py-3 text-slate-600">{minor ? <span className="text-xs text-slate-400">hidden (minor)</span> : people?.find((p) => p.id === l.user_id)?.email ?? "—"}</td>
                  <td className="px-4 py-3 capitalize text-slate-600">{l.stage?.replace(/_/g, " ") ?? "—"}</td>
                  <td className="px-4 py-3">{l.country_code ?? "—"}</td>
                  <td className="px-4 py-3 capitalize">{sub ? `${sub.plan_id} (${sub.status})` : "free"}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(l.created_at).toLocaleDateString()}</td>
                </tr>
              );
            })}
            {(learners ?? []).length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No learners yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between text-sm">
        {page > 0 ? <a href={`?page=${page - 1}`} className="text-signal-dark">← Previous</a> : <span />}
        {(count ?? 0) > (page + 1) * size && <a href={`?page=${page + 1}`} className="text-signal-dark">Next →</a>}
      </div>
    </div>
  );
}
