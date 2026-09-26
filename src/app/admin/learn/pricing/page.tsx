import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { formatMoney } from "@/lib/learn/currency";
import { deletePrice, saveCoupon, savePlan, savePrice, toggleCoupon } from "@/app/actions/learn/admin";
import { AdminForm, inputCls } from "../AdminForm";

export const metadata = { title: "Pricing · Camus Learn Admin" };

export default async function PricingAdmin() {
  const supabase = await createClient();
  const [{ data: plans }, { data: prices }, { data: currencies }, { data: coupons }] = await Promise.all([
    supabase.from("learn_plans").select("*").order("sort"),
    supabase.from("learn_plan_prices").select("*").order("currency_code"),
    supabase.from("learn_currencies").select("*").order("code"),
    supabase.from("learn_coupons").select("*").order("created_at", { ascending: false }),
  ]);
  const minor = (c: string) => currencies?.find((x) => x.code === c)?.minor_units ?? 2;

  return (
    <div>
      <PageHeader title="Pricing & coupons" description="Everything here drives the public pricing and in-app billing — nothing is hardcoded in the frontend. Enter amounts in major units (e.g. 499 for ₹499)." />

      <div className="flex flex-col gap-6">
        {(plans ?? []).map((p) => (
          <section key={p.id} className="rounded-2xl border border-slate-200 bg-paper p-5">
            <AdminForm action={savePlan} className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <input type="hidden" name="id" value={p.id} />
              <label className="text-xs text-slate-500">Name<input name="name" defaultValue={p.name} required className={inputCls} /></label>
              <label className="text-xs text-slate-500 md:col-span-2">Tagline<input name="tagline" defaultValue={p.tagline ?? ""} className={inputCls} /></label>
              <label className="text-xs text-slate-500">Tier (0 = free)<input name="tier" type="number" min={0} max={9} defaultValue={p.tier} className={inputCls} /></label>
              <label className="text-xs text-slate-500">AI requests / day<input name="ai_messages_per_day" type="number" min={0} defaultValue={p.ai_messages_per_day} className={inputCls} /></label>
              <label className="text-xs text-slate-500">Trial days<input name="trial_days" type="number" min={0} max={90} defaultValue={p.trial_days} className={inputCls} /></label>
              <label className="text-xs text-slate-500">Sort<input name="sort" type="number" min={0} defaultValue={p.sort} className={inputCls} /></label>
              <label className="flex items-center gap-2 self-end text-sm text-slate-700"><input type="checkbox" name="is_active" defaultChecked={p.is_active} className="h-4 w-4" /> Active</label>
              <label className="text-xs text-slate-500 md:col-span-4">Features (one per line)<textarea name="features" rows={4} defaultValue={(p.features as string[]).join("\n")} className={`${inputCls} py-2`} /></label>
            </AdminForm>
            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Prices</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {(prices ?? []).filter((x) => x.plan_id === p.id).map((x) => (
                  <li key={`${x.currency_code}-${x.billing_interval}`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-[13px]">
                    {formatMoney(x.amount_minor, x.currency_code, minor(x.currency_code))} / {x.billing_interval}
                    <form action={deletePrice.bind(null, p.id, x.currency_code, x.billing_interval)}><button aria-label="Remove price" className="text-slate-400 hover:text-danger">×</button></form>
                  </li>
                ))}
              </ul>
              <AdminForm action={savePrice} submitLabel="Set price" className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                <input type="hidden" name="plan_id" value={p.id} />
                <label className="text-xs text-slate-500">Currency<select name="currency_code" className={inputCls}>{(currencies ?? []).map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}</select></label>
                <label className="text-xs text-slate-500">Interval<select name="billing_interval" className={inputCls}><option value="month">Monthly</option><option value="year">Yearly</option></select></label>
                <label className="text-xs text-slate-500">Amount<input name="amount" type="number" step="0.01" min="0" required className={inputCls} /></label>
              </AdminForm>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-paper p-5">
        <h2 className="text-sm font-medium text-ink">Add a plan</h2>
        <p className="text-xs text-slate-500">New plans start hidden — add prices and features, then tick Active.</p>
        <AdminForm action={savePlan} submitLabel="Create plan" reset className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
          <label className="text-xs text-slate-500">Plan id<input name="id" required placeholder="e.g. school" className={inputCls} /></label>
          <label className="text-xs text-slate-500">Name<input name="name" required className={inputCls} /></label>
          <label className="text-xs text-slate-500">Tier<input name="tier" type="number" min={0} max={9} defaultValue={1} className={inputCls} /></label>
          <label className="text-xs text-slate-500">AI requests / day<input name="ai_messages_per_day" type="number" defaultValue={50} className={inputCls} /></label>
          <input type="hidden" name="trial_days" value="0" /><input type="hidden" name="sort" value="10" /><input type="hidden" name="features" value="" /><input type="hidden" name="is_active" value="" />
        </AdminForm>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-paper p-5">
        <h2 className="text-sm font-medium text-ink">Coupons</h2>
        <AdminForm action={saveCoupon} submitLabel="Save coupon" reset className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          <label className="text-xs text-slate-500">Code<input name="code" required className={`${inputCls} uppercase`} /></label>
          <label className="text-xs text-slate-500">% off<input name="percent_off" type="number" min={1} max={100} required className={inputCls} /></label>
          <label className="text-xs text-slate-500">Valid until<input name="valid_until" type="date" className={inputCls} /></label>
          <label className="text-xs text-slate-500">Max uses<input name="max_redemptions" type="number" min={1} className={inputCls} /></label>
        </AdminForm>
        <ul className="mt-5 flex flex-col gap-1 text-sm">
          {(coupons ?? []).map((c) => (
            <li key={c.code} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-mist">
              <span className="font-mono">{c.code} · {c.percent_off}% · used {c.redeemed_count}{c.max_redemptions ? `/${c.max_redemptions}` : ""}{c.valid_until ? ` · until ${new Date(c.valid_until).toLocaleDateString()}` : ""}</span>
              <form action={toggleCoupon.bind(null, c.code, !c.is_active)}><button className={c.is_active ? "text-[13px] text-danger" : "text-[13px] text-success"}>{c.is_active ? "Disable" : "Enable"}</button></form>
            </li>
          ))}
          {(coupons ?? []).length === 0 && <li className="text-slate-500">No coupons yet.</li>}
        </ul>
      </section>
    </div>
  );
}
