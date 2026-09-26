"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatMoney, pickPrice, yearlySavingsPercent, type PriceRow } from "@/lib/learn/currency";

export interface PlanRow {
  id: string;
  name: string;
  tagline: string | null;
  features: unknown;
  tier: number;
  trial_days: number;
  ai_messages_per_day: number;
}

/**
 * Renders plans from the database in the viewer's currency. Every price is
 * a stored price — nothing is converted on the fly.
 */
export function PricingTable({
  plans,
  prices,
  currencies,
  currency: initialCurrency,
  currentPlanId,
  renderAction,
}: {
  plans: PlanRow[];
  prices: PriceRow[];
  currencies: { code: string; minor_units: number; name: string }[];
  currency: string;
  currentPlanId?: string | null;
  renderAction: (plan: PlanRow, interval: "month" | "year", currency: string) => React.ReactNode;
}) {
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [currency, setCurrency] = useState(initialCurrency);
  const withPrices = currencies.filter((c) => prices.some((p) => p.currency_code === c.code));
  const minor = (code: string) => currencies.find((c) => c.code === code)?.minor_units ?? 2;
  const maxSavings = Math.max(
    0,
    ...plans.map((p) => {
      const m = pickPrice(prices, p.id, currency, "month");
      const y = pickPrice(prices, p.id, currency, "year");
      return m && y ? yearlySavingsPercent(m.price.amount_minor, y.price.amount_minor) : 0;
    })
  );

  return (
    <div>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <div role="group" aria-label="Billing interval" className="inline-flex rounded-full border border-slate-200 bg-paper p-1">
          {(["month", "year"] as const).map((i) => (
            <button key={i} onClick={() => setInterval(i)} aria-pressed={interval === i} className={cn("min-h-9 rounded-full px-4 text-sm", interval === i ? "bg-ink text-paper" : "text-slate-600")}>
              {i === "month" ? "Monthly" : "Yearly"}
              {i === "year" && maxSavings > 0 && <span className={cn("ml-1.5 text-xs", interval === i ? "text-slate-300" : "text-success")}>save up to {maxSavings}%</span>}
            </button>
          ))}
        </div>
        {withPrices.length > 1 && (
          <label className="flex items-center gap-2 text-sm text-slate-500">
            <span className="sr-only">Currency</span>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="min-h-9 rounded-full border border-slate-200 bg-paper px-3 text-sm text-ink">
              {withPrices.map((c) => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const picked = plan.tier === 0 ? pickPrice(prices, plan.id, currency, "month") : pickPrice(prices, plan.id, currency, interval);
          const features = Array.isArray(plan.features) ? (plan.features as string[]) : [];
          const featured = plan.id === "career";
          const current = currentPlanId === plan.id;
          return (
            <li key={plan.id} className={cn("flex flex-col rounded-2xl border bg-paper p-6", featured ? "border-ink ring-1 ring-ink" : "border-slate-200")}>
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-ink">{plan.name}</h3>
                {featured && <span className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-medium text-paper">Popular</span>}
                {current && <span className="rounded-full bg-signal-50 px-2.5 py-0.5 text-[11px] font-medium text-signal-dark">Current</span>}
              </div>
              <p className="mt-1 text-[13px] text-slate-500">{plan.tagline}</p>
              <p className="mt-5">
                {picked ? (
                  <>
                    <span className="text-3xl font-semibold tracking-tight text-ink tabular-nums">{formatMoney(picked.price.amount_minor, picked.price.currency_code, minor(picked.price.currency_code))}</span>
                    {plan.tier > 0 && <span className="text-sm text-slate-500"> / {interval === "month" ? "month" : "year"}</span>}
                    {picked.isFallback && <span className="mt-1 block text-xs text-slate-400">Shown in {picked.price.currency_code} — local pricing coming soon</span>}
                  </>
                ) : (
                  <span className="text-sm text-slate-500">{interval === "year" ? "Monthly billing only" : "Price not set"}</span>
                )}
              </p>
              {plan.trial_days > 0 && <p className="mt-1 text-xs text-success">{plan.trial_days}-day free trial</p>}
              <ul className="mt-5 flex flex-1 flex-col gap-2">
                {features.map((f) => (
                  <li key={f} className="flex gap-2 text-[13px] leading-relaxed text-slate-700">
                    <Check size={15} className="mt-0.5 shrink-0 text-signal" /> {f}
                  </li>
                ))}
                <li className="flex gap-2 text-[13px] leading-relaxed text-slate-500">
                  <Check size={15} className="mt-0.5 shrink-0 text-slate-300" /> Up to {plan.ai_messages_per_day} AI requests/day
                </li>
              </ul>
              <div className="mt-6">{renderAction(plan, interval, picked?.price.currency_code ?? currency)}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
