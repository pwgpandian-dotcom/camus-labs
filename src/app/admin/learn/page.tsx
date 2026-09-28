import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatTile } from "@/components/admin/StatTile";
import { PageHeader } from "@/components/admin/PageHeader";
import { aiAvailable } from "@/lib/learn/ai/service";
import { providers } from "@/lib/learn/ai/providers";
import { daysAgoISO } from "@/lib/learn/streak";

export const metadata = { title: "Camus Learn · Admin" };

export default async function LearnAdminOverview() {
  const supabase = await createClient();
  const d1 = daysAgoISO(1);
  const d7 = daysAgoISO(7);
  const d30 = daysAgoISO(30);

  const [learners, onboarded, active7, pending, activeSubs, usage24, activity30, feedback] = await Promise.all([
    supabase.from("learn_profiles").select("user_id", { count: "exact", head: true }),
    supabase.from("learn_profiles").select("user_id", { count: "exact", head: true }).not("onboarding_completed_at", "is", null),
    supabase.from("learn_activity").select("user_id").gte("created_at", d7).limit(5000),
    supabase.from("learn_subscriptions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("learn_subscriptions").select("plan_id, status").in("status", ["active", "trialing"]),
    supabase.from("learn_ai_usage").select("input_tokens, output_tokens, feature").gte("created_at", d1).limit(10000),
    supabase.from("learn_activity").select("kind").gte("created_at", d30).limit(20000),
    supabase.from("learn_messages").select("feedback").not("feedback", "is", null).gte("created_at", d30).limit(5000),
  ]);

  const active7Count = new Set((active7.data ?? []).map((a) => a.user_id)).size;
  const tokens = (usage24.data ?? []).reduce((a, u) => a + u.input_tokens + u.output_tokens, 0);
  const kinds = new Map<string, number>();
  for (const a of activity30.data ?? []) kinds.set(a.kind, (kinds.get(a.kind) ?? 0) + 1);
  const kindRows = [...kinds.entries()].sort((a, b) => b[1] - a[1]);
  const maxKind = Math.max(1, ...kindRows.map((k) => k[1]));
  const byPlan = new Map<string, number>();
  for (const s of activeSubs.data ?? []) byPlan.set(`${s.plan_id} (${s.status})`, (byPlan.get(`${s.plan_id} (${s.status})`) ?? 0) + 1);
  const up = (feedback.data ?? []).filter((f) => f.feedback === 1).length;
  const down = (feedback.data ?? []).filter((f) => f.feedback === -1).length;
  const completion = learners.count ? Math.round(((onboarded.count ?? 0) / learners.count) * 100) : 0;

  return (
    <div>
      <PageHeader title="Overview" description="Product health for Camus Learn. Metrics are aggregate — no personal content is shown." />
      {!aiAvailable() && (
        <div className="mb-6 rounded-xl border border-[#f1dfb0] bg-[#fdf8ec] px-4 py-3 text-sm text-[#7a5a00]">
          No AI provider key is configured. Add <code>ANTHROPIC_API_KEY</code>, <code>OPENAI_API_KEY</code> or <code>GOOGLE_AI_API_KEY</code> to the deployment environment to switch on AI features.
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Learners" value={learners.count ?? 0} />
        <StatTile label="Onboarding completion" value={`${completion}%`} hint={`${onboarded.count ?? 0} completed`} />
        <StatTile label="Active (7 days)" value={active7Count} />
        <StatTile label="Upgrade requests" value={pending.count ?? 0} hint="awaiting payment confirmation" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="AI calls (24h)" value={(usage24.data ?? []).length} />
        <StatTile label="AI tokens (24h)" value={tokens.toLocaleString()} />
        <StatTile label="Answer feedback (30d)" value={`${up} 👍 · ${down} 👎`} />
        <StatTile label="Paying / trialing" value={(activeSubs.data ?? []).length} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-paper p-6">
          <h2 className="text-sm font-medium text-ink">Feature usage (30 days)</h2>
          {kindRows.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No activity yet.</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {kindRows.map(([k, n]) => (
                <li key={k}>
                  <div className="flex justify-between text-sm"><span className="capitalize text-slate-700">{k.replace(/_/g, " ")}</span><span className="tabular-nums text-slate-500">{n}</span></div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-signal" style={{ width: `${(n / maxKind) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl border border-slate-200 bg-paper p-6">
          <h2 className="text-sm font-medium text-ink">Subscriptions by plan</h2>
          {byPlan.size === 0 ? <p className="mt-3 text-sm text-slate-500">No active subscriptions yet.</p> : (
            <ul className="mt-4 flex flex-col gap-2 text-sm">{[...byPlan.entries()].map(([k, v]) => <li key={k} className="flex justify-between"><span className="capitalize text-slate-700">{k}</span><span className="tabular-nums">{v}</span></li>)}</ul>
          )}
          <h2 className="mt-8 text-sm font-medium text-ink">AI providers</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {Object.values(providers).map((p) => (
              <li key={p.id} className="flex justify-between"><span className="capitalize text-slate-700">{p.id}</span><span className={p.isConfigured() ? "text-success" : "text-slate-400"}>{p.isConfigured() ? "Key configured" : "Not configured"}</span></li>
            ))}
          </ul>
          <Link href="/admin/learn/ai" className="mt-4 inline-block text-sm text-signal-dark hover:underline">Model settings →</Link>
        </section>
      </div>
    </div>
  );
}
