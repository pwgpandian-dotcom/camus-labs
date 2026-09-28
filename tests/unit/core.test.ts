import { describe, expect, it } from "vitest";
import { extractJSON } from "@/lib/learn/ai/json";
import { parseEvent, readSSE } from "@/lib/learn/ai/sse";
import { applyPercentOff, currencyForCountry, formatMoney, pickPrice, yearlySavingsPercent } from "@/lib/learn/currency";
import { activeDaysThisWeek, computeStreak } from "@/lib/learn/streak";
import { getTranslator, isLocale } from "@/lib/learn/i18n";
import { onboardingSchema, quizSchema, resumeDataSchema, jobAnalysisRequestSchema, chatRequestSchema } from "@/lib/learn/schemas";
import { careers, getCareer, CAREER_CATEGORIES } from "@/lib/learn/catalog/careers";
import { subjects } from "@/lib/learn/catalog/subjects";
import { assistantSystemPrompt } from "@/lib/learn/ai/prompts";

describe("extractJSON", () => {
  it("parses bare JSON", () => expect(extractJSON('{"a":1}')).toEqual({ a: 1 }));
  it("parses fenced JSON", () => expect(extractJSON('Here:\n```json\n{"a":[1,2]}\n```')).toEqual({ a: [1, 2] }));
  it("finds JSON after prose and ignores braces in strings", () =>
    expect(extractJSON('Sure! {"t":"a } b","n":{"x":1}} trailing')).toEqual({ t: "a } b", n: { x: 1 } }));
  it("throws when there is no JSON", () => expect(() => extractJSON("no json here")).toThrow());
});

describe("SSE parsing", () => {
  it("extracts data lines", () => expect(parseEvent("event: x\ndata: {\"a\":1}")).toBe('{"a":1}'));
  it("returns null for comments", () => expect(parseEvent(": ping")).toBeNull());
  it("streams events split across chunks", async () => {
    const enc = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(enc.encode("data: one\n\nda"));
        c.enqueue(enc.encode("ta: two\n\ndata: [DONE]\n\n"));
        c.close();
      },
    });
    const out: string[] = [];
    for await (const d of readSSE(body)) out.push(d);
    expect(out).toEqual(["one", "two", "[DONE]"]);
  });
});

describe("currency", () => {
  const prices = [
    { plan_id: "career", currency_code: "INR", billing_interval: "month", amount_minor: 49900 },
    { plan_id: "career", currency_code: "USD", billing_interval: "month", amount_minor: 999 },
    { plan_id: "career", currency_code: "INR", billing_interval: "year", amount_minor: 499000 },
  ];
  it("picks exact currency", () => expect(pickPrice(prices, "career", "INR", "month")?.price.amount_minor).toBe(49900));
  it("falls back to USD and flags it", () => {
    const r = pickPrice(prices, "career", "EUR", "month");
    expect(r?.price.currency_code).toBe("USD");
    expect(r?.isFallback).toBe(true);
  });
  it("returns null when interval is missing", () => expect(pickPrice(prices, "career", "USD", "year")).toBeNull());
  it("formats INR in Indian style", () => expect(formatMoney(49900, "INR")).toBe("₹499"));
  it("formats JPY with zero minor units", () => expect(formatMoney(1500, "JPY", 0)).toContain("1,500"));
  it("computes yearly savings", () => expect(yearlySavingsPercent(49900, 499000)).toBe(16));
  it("maps country to currency with fallback", () => {
    const countries = [{ code: "IN", currency_code: "INR" }];
    expect(currencyForCountry("in", countries)).toBe("INR");
    expect(currencyForCountry("ZZ", countries)).toBe("USD");
    expect(currencyForCountry(null, countries)).toBe("USD");
  });
  it("applies coupons safely", () => {
    expect(applyPercentOff(10000, 25)).toBe(7500);
    expect(applyPercentOff(10000, 150)).toBe(0);
  });
});

describe("streaks", () => {
  const now = new Date("2026-09-27T10:00:00Z");
  it("counts consecutive days including today", () =>
    expect(computeStreak(["2026-09-27T01:00:00Z", "2026-09-26T12:00:00Z", "2026-09-25T12:00:00Z"], now)).toBe(3));
  it("keeps streak alive if last activity was yesterday", () =>
    expect(computeStreak(["2026-09-26T12:00:00Z", "2026-09-25T12:00:00Z"], now)).toBe(2));
  it("resets after a missed day", () => expect(computeStreak(["2026-09-24T12:00:00Z"], now)).toBe(0));
  it("respects time zones", () =>
    // 20:00 UTC on the 26th is already the 27th in India
    expect(computeStreak(["2026-09-26T20:00:00Z"], now, "Asia/Kolkata")).toBe(1));
  it("counts active days in the last week", () =>
    expect(activeDaysThisWeek(["2026-09-27T01:00:00Z", "2026-09-27T05:00:00Z", "2026-09-22T01:00:00Z", "2026-09-10T01:00:00Z"], now)).toBe(2));
});

describe("i18n", () => {
  it("falls back to English for untranslated locales", () => expect(getTranslator("ta")("nav.home")).toBe("Home"));
  it("validates locales", () => {
    expect(isLocale("ta")).toBe(true);
    expect(isLocale("xx")).toBe(false);
  });
});

describe("schemas", () => {
  it("accepts a minimal valid onboarding", () => {
    const r = onboardingSchema.safeParse({ displayName: "Asha", stage: "college", ageBand: "18_plus", country: "IN" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.hoursPerWeek).toBe(5);
  });
  it("rejects a bad country code", () =>
    expect(onboardingSchema.safeParse({ displayName: "A", stage: "college", ageBand: "18_plus", country: "India" }).success).toBe(false));
  it("requires exactly four quiz options", () =>
    expect(
      quizSchema.safeParse({ questions: [{ prompt: "abc?", options: ["a", "b"], answerIndex: 0, explanation: "" }] }).success
    ).toBe(false));
  it("fills resume defaults", () => {
    const r = resumeDataSchema.parse({});
    expect(r.basics.name).toBe("");
    expect(r.experience).toEqual([]);
  });
  it("rejects too-short job descriptions", () => expect(jobAnalysisRequestSchema.safeParse({ jdText: "short" }).success).toBe(false));
  it("rejects unknown assistant modes", () => expect(chatRequestSchema.safeParse({ mode: "hack", message: "hi" }).success).toBe(false));
});

describe("catalogs", () => {
  it("has unique career slugs whose related links resolve", () => {
    const slugs = new Set(careers.map((c) => c.slug));
    expect(slugs.size).toBe(careers.length);
    for (const c of careers) for (const r of c.related) expect(getCareer(r), `${c.slug} -> ${r}`).toBeDefined();
  });
  it("covers every career category", () => {
    for (const cat of CAREER_CATEGORIES) expect(careers.some((c) => c.category === cat), cat).toBe(true);
  });
  it("has unique roadmap keys per career", () => {
    for (const c of careers) expect(new Set(c.roadmap.map((s) => s.key)).size).toBe(c.roadmap.length);
  });
  it("has subjects with topics", () => {
    for (const s of subjects) expect(s.groups.flatMap((g) => g.topics).length).toBeGreaterThan(3);
  });
});

describe("prompts", () => {
  it("includes mode guidance and learner context", () => {
    const p = assistantSystemPrompt("resume", "- Name: Asha");
    expect(p).toContain("Resume Mode");
    expect(p).toContain("never add experience");
    expect(p).toContain("Asha");
  });
});
