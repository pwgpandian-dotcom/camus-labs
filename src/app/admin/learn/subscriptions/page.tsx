import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { formatMoney } from "@/lib/learn/currency";
import { activateSubscription, setSubscriptionStatus } from "@/app/actions/learn/admin";
import { AdminForm, inputCls } from "../AdminForm";

export const metadata = { title: "Subscriptions · Camus Learn Admin" };

export default async function SubscriptionsAdmin() {
  const supabase = await createClient();
  const [{ data: subs }, { data: prices }, { data: currencies }, { data: payments }] = await Promise.all([
    supabase.from("learn_subscriptions").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("learn_plan_prices").select("*"),
    supabase.from("learn_currencies").select("code, minor_units"),
    supabase.from("learn_payments").select("*").order("created_at", { ascending: false }).limit(50),
  ]);
  const ids = [...new Set((subs ?? []).map((s) => s.user_id))];
  const { data: people } = ids.length ? await supabase.from("profiles").select("id, email, full_name").in("id", ids) : { data: [] };
  const who = (id: string) => people?.find((p) => p.id === id);
  const minor = (c: string) => currencies?.find((x) => x.code === c)?.minor_units ?? 2;
  const listPrice = (plan: string, cur: string, int: string) => prices?.find((p) => p.plan_id === plan && p.currency_code === cur && p.billing_interval === int)?.amount_minor;
  const pending = (subs ?? []).filter((s) => s.status === "pending");
  const others = (subs ?? []).filter((s) => s.status !== "pending");

  return (
    <div>
      <PageHeader title="Subscriptions" description="Confirm payments for upgrade requests, and manage active plans. Every change is written to the audit log." />
      <h2 className="mb-3 text-sm font-medium text-ink">Pending upgrade requests ({pending.length})</h2>
      {pending.length === 0 ? (
        <p className="mb-10 text-sm text-slate-500">No pending requests.</p>
      ) : (
        <ul className="mb-10 flex flex-col gap-4">
          {pending.map((s) => {
            const lp = listPrice(s.plan_id, s.currency_code, s.billing_interval);
            return (
              <li key={s.id} className="rounded-2xl border border-slate-200 bg-paper p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-ink"><span className="font-medium">{who(s.user_id)?.full_name || who(s.user_id)?.email || s.user_id}</span> · {who(s.user_id)?.email}</p>
                  <p className="text-sm capitalize text-slate-500">{s.plan_id} · {s.billing_interval}ly · {s.currency_code}{s.coupon_code ? ` · coupon ${s.coupon_code}` : ""}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">List price: {lp !== undefined ? formatMoney(lp, s.currency_code, minor(s.currency_code)) : "not set for this currency"} · requested {new Date(s.created_at).toLocaleString()}</p>
                <AdminForm action={activateSubscription} submitLabel="Record payment & activate" className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <input type="hidden" name="id" value={s.id} />
                  <label className="text-xs text-slate-500">Amount received ({s.currency_code})<input name="amount" type="number" step="0.01" min="0" required defaultValue={lp !== undefined ? lp / 10 ** minor(s.currency_code) : undefined} className={inputCls} /></label>
                  <label className="text-xs text-slate-500">Method<input name="method" required placeholder="UPI / bank / card" className={inputCls} /></label>
                  <label className="text-xs text-slate-500">Reference<input name="reference" placeholder="Transaction ID" className={inputCls} /></label>
                </AdminForm>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="mb-3 text-sm font-medium text-ink">All subscriptions</h2>
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-mist text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-4 py-3 font-medium">Learner</th><th className="px-4 py-3 font-medium">Plan</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Period end</th><th className="px-4 py-3 font-medium" /></tr></thead>
          <tbody>
            {others.map((s) => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{who(s.user_id)?.email ?? s.user_id.slice(0, 8)}</td>
                <td className="px-4 py-3 capitalize">{s.plan_id} · {s.billing_interval}</td>
                <td className="px-4 py-3 capitalize">{s.status}</td>
                <td className="px-4 py-3">{s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-3 text-right">
                  {["active", "trialing"].includes(s.status) && (
                    <form action={setSubscriptionStatus.bind(null, s.id, "cancelled")}><button className="text-[13px] text-danger hover:underline">Cancel</button></form>
                  )}
                </td>
              </tr>
            ))}
            {others.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">No subscriptions yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 mt-10 text-sm font-medium text-ink">Recent payments</h2>
      <ul className="flex flex-col gap-1 text-sm">
        {(payments ?? []).map((p) => (
          <li key={p.id} className="flex justify-between rounded-lg px-2 py-1.5 hover:bg-mist"><span>{new Date(p.created_at).toLocaleDateString()} · {who(p.user_id)?.email ?? p.user_id.slice(0, 8)}</span><span className="tabular-nums">{formatMoney(p.amount_minor, p.currency_code, minor(p.currency_code))} · {p.provider}</span></li>
        ))}
        {(payments ?? []).length === 0 && <li className="text-slate-500">No payments recorded.</li>}
      </ul>
    </div>
  );
}
