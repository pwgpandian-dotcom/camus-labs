/**
 * Currency abstraction. Prices are stored per-currency in the database
 * (learn_plan_prices) — we never convert with a hardcoded FX rate. When a
 * plan has no price in the viewer's currency we fall back to USD, and say so.
 */

export interface PriceRow {
  plan_id: string;
  currency_code: string;
  billing_interval: string;
  amount_minor: number;
}

export interface CurrencyRow {
  code: string;
  symbol: string;
  minor_units: number;
}

export const FALLBACK_CURRENCY = "USD";

export function formatMoney(amountMinor: number, currency: string, minorUnits = 2, locale = "en") {
  const major = amountMinor / 10 ** minorUnits;
  const whole = Number.isInteger(major);
  try {
    return new Intl.NumberFormat(locale === "en" && currency === "INR" ? "en-IN" : locale, {
      style: "currency",
      currency,
      minimumFractionDigits: whole ? 0 : minorUnits,
      maximumFractionDigits: minorUnits,
    }).format(major);
  } catch {
    return `${currency} ${major.toFixed(whole ? 0 : minorUnits)}`;
  }
}

/**
 * Pick the price for a plan in the preferred currency, falling back to USD.
 * Returns null when the plan has no price for this interval at all.
 */
export function pickPrice(
  prices: PriceRow[],
  planId: string,
  currency: string,
  interval: "month" | "year"
): { price: PriceRow; isFallback: boolean } | null {
  const forPlan = prices.filter((p) => p.plan_id === planId && p.billing_interval === interval);
  const exact = forPlan.find((p) => p.currency_code === currency);
  if (exact) return { price: exact, isFallback: false };
  const fb = forPlan.find((p) => p.currency_code === FALLBACK_CURRENCY);
  return fb ? { price: fb, isFallback: currency !== FALLBACK_CURRENCY } : null;
}

/** Percentage saved by paying yearly vs 12 × monthly, rounded down. */
export function yearlySavingsPercent(monthlyMinor: number, yearlyMinor: number) {
  if (monthlyMinor <= 0 || yearlyMinor <= 0) return 0;
  const full = monthlyMinor * 12;
  return Math.max(0, Math.floor(((full - yearlyMinor) / full) * 100));
}

/** Map a country (e.g. from Vercel's geo header) to its currency. */
export function currencyForCountry(
  countryCode: string | null | undefined,
  countries: Array<{ code: string; currency_code: string }>
) {
  if (!countryCode) return FALLBACK_CURRENCY;
  return countries.find((c) => c.code === countryCode.toUpperCase())?.currency_code ?? FALLBACK_CURRENCY;
}

export function applyPercentOff(amountMinor: number, percentOff: number) {
  return Math.round(amountMinor * (1 - Math.min(100, Math.max(0, percentOff)) / 100));
}
