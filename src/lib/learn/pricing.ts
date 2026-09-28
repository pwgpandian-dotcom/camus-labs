import "server-only";
import { headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { currencyForCountry, FALLBACK_CURRENCY } from "./currency";

type DB = SupabaseClient<Database>;

/** Loads active plans, their prices and currencies in one go. */
export async function loadPricing(supabase: DB) {
  const [plans, prices, currencies, countries] = await Promise.all([
    supabase.from("learn_plans").select("*").eq("is_active", true).order("sort"),
    supabase.from("learn_plan_prices").select("*"),
    supabase.from("learn_currencies").select("code, symbol, minor_units, name").eq("is_active", true),
    supabase.from("learn_countries").select("code, currency_code").eq("is_active", true),
  ]);
  const error = plans.error || prices.error || currencies.error;
  return {
    error: error ? "Pricing is temporarily unavailable." : null,
    plans: plans.data ?? [],
    prices: prices.data ?? [],
    currencies: currencies.data ?? [],
    countries: countries.data ?? [],
  };
}

/**
 * Viewer currency: explicit ?currency=, then the learner's country, then the
 * visitor's country from the hosting platform's geo header, then USD.
 */
export async function resolveViewerCurrency(opts: {
  requested?: string | null;
  profileCountry?: string | null;
  currencies: { code: string }[];
  countries: { code: string; currency_code: string }[];
}) {
  const valid = (c?: string | null) => !!c && opts.currencies.some((x) => x.code === c);
  if (valid(opts.requested)) return opts.requested!;
  if (opts.profileCountry) return currencyForCountry(opts.profileCountry, opts.countries);
  const h = await headers();
  const geo = h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry");
  const c = currencyForCountry(geo, opts.countries);
  return valid(c) ? c : FALLBACK_CURRENCY;
}
