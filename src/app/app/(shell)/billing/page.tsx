import { requireLearner } from "@/lib/learn/server";
import { loadPricing, resolveViewerCurrency } from "@/lib/learn/pricing";
import { formatMoney } from "@/lib/learn/currency";
import { Page } from "@/components/learn/Page";
import { Notice, PageHeader, Panel } from "@/components/learn/ui";
import { cancelSubscription } from "@/app/actions/learn/billing";
import { BillingPlans } from "./BillingPlans";

export const metadata = { title: "Plan & billing" };

export default async function BillingPage({ searchParams }: PageProps<"/app/billing">) {
  const sp = await searchParams;
  const { supabase, user, profile, plan, subscription } = await requireLearner();
  const pricing = await loadPricing(supabase);
  const currency = await resolveViewerCurrency({
    requested: typeof sp.currency === "string" ? sp.currency : null,
    profileCountry: profile?.country_code,
    currencies: pricing.currencies,
    countries: pricing.countries,
  });
  const [{ data: history }, { data: payments }, { data: usage }] = await Promise.all([
    supabase.from("learn_subscriptions").select("id, plan_id, status, billing_interval, currency_code, trial_ends_at, current_period_end, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
    supabase.from("learn_payments").select("id, amount_minor, currency_code, status, provider, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
    supabase.rpc("learn_ai_calls_today"),
  ]);
  const pending = (history ?? []).find((h) => h.status === "pending");
  const trialUsed = (history ?? []).some((h) => h.trial_ends_at);
  const minorUnits = (c: string) => pricing.currencies.find((x) => x.code === c)?.minor_units ?? 2;

  return (
    <Page>
      <PageHeader eyebrow="Plan & billing" title={`You're on ${plan?.name ?? "Free"}`} description={subscription?.current_period_end ? `${subscription.status === "trialing" ? "Trial ends" : "Renews"} ${new Date(subscription.current_period_end).toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" })}` : "Upgrade any time. Cancel any time."} />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Panel>
          <p className="text-[13px] text-slate-500">AI requests today</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">
            {usage ?? 0}
            <span className="text-base text-slate-400"> / {plan?.ai_messages_per_day ?? 15}</span>
          </p>
        </Panel>
        {subscription && (
          <Panel className="sm:col-span-2">
            <p className="text-[13px] text-slate-500">Subscription</p>
            <p className="mt-1 text-sm capitalize text-ink">{subscription.status} · {subscription.billing_interval}ly · {subscription.currency_code}</p>
            <form action={cancelSubscription.bind(null, subscription.id)} className="mt-3">
              <button type="submit" className="text-[13px] text-danger hover:underline">Cancel subscription</button>
            </form>
          </Panel>
        )}
      </div>

      {pending && (
        <Notice tone="signal" className="mb-6">
          Your request for the <strong>{pricing.plans.find((p) => p.id === pending.plan_id)?.name}</strong> plan ({pending.billing_interval}ly) is pending. We&apos;ll email payment details and activate it as soon as payment is confirmed.
        </Notice>
      )}

      {pricing.error ? (
        <Notice tone="danger">{pricing.error}</Notice>
      ) : (
        <BillingPlans plans={pricing.plans} prices={pricing.prices} currencies={pricing.currencies} currency={currency} currentPlanId={plan?.id ?? "free"} trialUsed={trialUsed} />
      )}

      <Panel className="mt-10">
        <h2 className="text-[15px] font-semibold text-ink">Billing history</h2>
        {(payments ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No payments yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="text-[13px] text-slate-500">
                <tr><th className="py-2 font-normal">Date</th><th className="py-2 font-normal">Amount</th><th className="py-2 font-normal">Method</th><th className="py-2 font-normal">Status</th></tr>
              </thead>
              <tbody>
                {payments!.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="py-2.5">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="py-2.5 tabular-nums">{formatMoney(p.amount_minor, p.currency_code, minorUnits(p.currency_code))}</td>
                    <td className="py-2.5 capitalize">{p.provider}</td>
                    <td className="py-2.5 capitalize">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </Page>
  );
}
