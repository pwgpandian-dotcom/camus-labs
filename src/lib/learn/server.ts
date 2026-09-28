import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type LearnProfile = Database["public"]["Tables"]["learn_profiles"]["Row"];
export type LearnPlan = Database["public"]["Tables"]["learn_plans"]["Row"];
export type LearnSubscription = Database["public"]["Tables"]["learn_subscriptions"]["Row"];

const ACTIVE_STATUSES = ["active", "trialing"];

/**
 * Resolves the signed-in learner once per request (React `cache`).
 * Returns null when signed out — callers decide whether to redirect.
 */
export const getLearner = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: subs }] = await Promise.all([
    supabase.from("learn_profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("learn_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .in("status", ACTIVE_STATUSES)
      .or(`current_period_end.is.null,current_period_end.gt.${new Date().toISOString()}`)
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const subscription = subs?.[0] ?? null;
  const planId = subscription?.plan_id ?? "free";
  const { data: plan } = await supabase.from("learn_plans").select("*").eq("id", planId).maybeSingle();

  return { supabase, user, profile: profile ?? null, subscription, plan: plan ?? null };
});

/** For pages inside /app: signed-in AND onboarded, else redirect. */
export async function requireLearner(opts: { allowIncompleteOnboarding?: boolean } = {}) {
  const learner = await getLearner();
  if (!learner) redirect("/login?redirect=/app");
  if (!opts.allowIncompleteOnboarding && !learner.profile?.onboarding_completed_at) redirect("/app/onboarding");
  return learner;
}

/** Plain-text summary of the Career Twin that every AI feature can reuse. */
export function learnerContext(profile: LearnProfile | null): string {
  if (!profile) return "";
  const lines: string[] = [];
  const add = (label: string, v: unknown) => {
    if (v === null || v === undefined) return;
    if (Array.isArray(v) && v.length === 0) return;
    if (typeof v === "string" && !v.trim()) return;
    lines.push(`- ${label}: ${Array.isArray(v) ? v.join(", ") : String(v)}`);
  };
  add("Name", profile.display_name);
  add("Stage", profile.stage?.replace(/_/g, " "));
  add("Age band", profile.age_band === "18_plus" ? "adult" : profile.age_band === "13_17" ? "teenager (13–17)" : profile.age_band ? "child (under 13)" : null);
  add("Country", profile.country_code);
  add("Current education", profile.current_education);
  add("Subjects", profile.subjects);
  add("Interests", profile.interests);
  add("Skills", profile.skills);
  add("Career goals", profile.career_goals);
  add("Target role", profile.target_role);
  add("Target country", profile.target_country);
  add("Exam goals", profile.exam_goals);
  const prefs = profile.learning_prefs as Record<string, unknown> | null;
  if (prefs && typeof prefs === "object") {
    add("Learning style", prefs.style as string);
    add("Weekly time", prefs.hoursPerWeek ? `${prefs.hoursPerWeek} hours/week` : null);
  }
  return lines.join("\n");
}

export function isMinor(profile: LearnProfile | null) {
  return profile?.age_band === "under_13" || profile?.age_band === "13_17";
}

/** Record a lightweight activity event for streaks and product analytics. */
export async function recordActivity(kind: string) {
  const learner = await getLearner();
  if (!learner) return;
  await learner.supabase.from("learn_activity").insert({ user_id: learner.user.id, kind });
}
