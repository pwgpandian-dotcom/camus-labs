"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PricingTable, type PlanRow } from "../PricingTable";
import { currencyForCountry, FALLBACK_CURRENCY, type PriceRow } from "@/lib/learn/currency";

const TZ_COUNTRY: Record<string, string> = {
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Europe/London": "GB", "Asia/Singapore": "SG", "Asia/Dubai": "AE",
  "Asia/Tokyo": "JP", "Europe/Stockholm": "SE", "Europe/Zurich": "CH", "Europe/Berlin": "DE", "Europe/Paris": "FR",
  "Europe/Madrid": "ES", "Europe/Dublin": "IE", "Europe/Amsterdam": "NL", "America/Toronto": "CA", "America/Vancouver": "CA",
};

/** Best-effort visitor country: time zone first (more reliable), then locale region. */
function browserCountry() {
  try {
    const { timeZone, locale } = Intl.DateTimeFormat().resolvedOptions();
    if (TZ_COUNTRY[timeZone]) return TZ_COUNTRY[timeZone];
    if (timeZone?.startsWith("Australia/")) return "AU";
    return new Intl.Locale(locale || navigator.language).region ?? null;
  } catch {
    return null;
  }
}

export function LandingPricing({
  plans,
  prices,
  currencies,
  countries,
  startHref,
}: {
  plans: PlanRow[];
  prices: PriceRow[];
  currencies: { code: string; minor_units: number; name: string }[];
  countries: { code: string; currency_code: string }[];
  startHref: string;
}) {
  const [currency, setCurrency] = useState(FALLBACK_CURRENCY);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrency(currencyForCountry(browserCountry(), countries));
  }, [countries]);

  return (
    <PricingTable
      key={currency}
      plans={plans}
      prices={prices}
      currencies={currencies}
      currency={currency}
      renderAction={(plan) => (
        <Link
          href={startHref}
          className={
            plan.id === "career"
              ? "flex min-h-11 items-center justify-center rounded-full bg-ink text-sm font-medium text-paper hover:bg-slate-800"
              : "flex min-h-11 items-center justify-center rounded-full border border-slate-300 text-sm text-ink hover:border-ink"
          }
        >
          {plan.tier === 0 ? "Start free" : plan.trial_days > 0 ? "Start free trial" : `Choose ${plan.name}`}
        </Link>
      )}
    />
  );
}
