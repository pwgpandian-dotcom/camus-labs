"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { PricingTable, type PlanRow } from "@/components/learn/PricingTable";
import type { PriceRow } from "@/lib/learn/currency";
import { checkCoupon, requestPlan, startTrial } from "@/app/actions/learn/billing";
import { Notice } from "@/components/learn/ui";

export function BillingPlans({
  plans,
  prices,
  currencies,
  currency,
  currentPlanId,
  trialUsed,
}: {
  plans: PlanRow[];
  prices: PriceRow[];
  currencies: { code: string; minor_units: number; name: string }[];
  currency: string;
  currentPlanId: string;
  trialUsed: boolean;
}) {
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [coupon, setCoupon] = useState("");
  const [couponState, setCouponState] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [, start] = useTransition();

  const run = (key: string, fn: () => Promise<{ ok: boolean; message: string }>) =>
    start(async () => {
      setBusy(key);
      const r = await fn();
      setBusy(null);
      setMessage({ ok: r.ok, text: r.message });
    });

  return (
    <div>
      {message && <Notice tone={message.ok ? "success" : "danger"} className="mb-6">{message.text}</Notice>}
      <PricingTable
        plans={plans}
        prices={prices}
        currencies={currencies}
        currency={currency}
        currentPlanId={currentPlanId}
        renderAction={(plan, interval, cur) => {
          if (plan.id === currentPlanId) return <p className="text-center text-sm text-slate-500">Your current plan</p>;
          if (plan.tier === 0) return null;
          return (
            <div className="flex flex-col gap-2">
              {!trialUsed && plan.trial_days > 0 && (
                <button onClick={() => run(`trial-${plan.id}`, () => startTrial(plan.id, cur))} disabled={!!busy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-paper disabled:opacity-60">
                  {busy === `trial-${plan.id}` && <Loader2 size={14} className="animate-spin" />} Start free trial
                </button>
              )}
              <button
                onClick={() => run(`req-${plan.id}`, () => requestPlan(plan.id, interval, cur, couponState ? coupon : undefined))}
                disabled={!!busy}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 text-sm text-ink hover:border-ink disabled:opacity-60"
              >
                {busy === `req-${plan.id}` && <Loader2 size={14} className="animate-spin" />} Upgrade to {plan.name}
              </button>
            </div>
          );
        }}
      />
      <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-2 sm:flex-row">
        <label htmlFor="coupon" className="sr-only">Coupon code</label>
        <input id="coupon" value={coupon} onChange={(e) => { setCoupon(e.target.value); setCouponState(null); }} placeholder="Coupon code" className="min-h-11 w-full flex-1 rounded-full border border-slate-200 px-4 text-base uppercase outline-none focus:border-signal md:text-sm" />
        <button
          onClick={() =>
            start(async () => {
              const r = await checkCoupon(coupon);
              setCouponState(r.ok ? `${r.percentOff}% off will be applied to your upgrade request.` : "That code isn't valid.");
            })
          }
          disabled={!coupon.trim()}
          className="min-h-11 rounded-full border border-slate-300 px-5 text-sm text-ink disabled:opacity-50"
        >
          Apply
        </button>
      </div>
      {couponState && <p className="mt-2 text-center text-[13px] text-slate-600" aria-live="polite">{couponState}</p>}
      <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-slate-400">
        Online card/UPI checkout is being set up. Until then, upgrade requests are confirmed by our team by email.
      </p>
    </div>
  );
}
