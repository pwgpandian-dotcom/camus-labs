"use server";

import { redirect } from "next/navigation";
import { getLearner, learnerContext } from "@/lib/learn/server";
import { generatedProfileSchema, onboardingSchema, type GeneratedProfile } from "@/lib/learn/schemas";
import { buildFallbackProfile } from "@/lib/learn/profile-generator";
import { aiAvailable, completeJSON } from "@/lib/learn/ai/service";

export type OnboardingState = { error: string | null; fieldErrors?: Record<string, string> };

export async function completeOnboarding(raw: unknown): Promise<OnboardingState> {
  const learner = await getLearner();
  if (!learner) return { error: "Your session expired. Please sign in again." };

  const parsed = onboardingSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return { error: "Please check the highlighted answers.", fieldErrors };
  }
  const input = parsed.data;
  const { supabase, user } = learner;

  // Data minimisation for children: no target-country or free-text career goals stored for under-13s.
  const isChild = input.ageBand === "under_13";

  const row = {
    user_id: user.id,
    display_name: input.displayName,
    stage: input.stage,
    age_band: input.ageBand,
    country_code: input.country,
    current_education: input.currentEducation || null,
    subjects: input.subjects,
    interests: input.interests,
    skills: input.skills,
    career_goals: isChild ? null : input.careerGoals || null,
    target_role: input.targetRole || null,
    target_country: isChild ? null : input.targetCountry || null,
    learning_prefs: { style: input.learningStyle, hoursPerWeek: input.hoursPerWeek },
    exam_goals: input.examGoals,
    timezone: input.timezone || null,
  };

  const { data: saved, error } = await supabase.from("learn_profiles").upsert(row).select("*").single();
  if (error || !saved) {
    console.error("[onboarding] upsert", error);
    return { error: "We couldn't save your answers. Please try again." };
  }

  let generated: GeneratedProfile & { source: "ai" | "rules" } = { ...buildFallbackProfile(input), source: "rules" };
  if (aiAvailable()) {
    try {
      const ai = await completeJSON({
        supabase,
        userId: user.id,
        usageLabel: "onboarding",
        schema: generatedProfileSchema,
        instructions: `Create a Personal Career & Learning Profile. Return JSON:
{"currentLevel": string, "goals": string[], "strengths": string[], "skillGaps": string[],
 "learningPath": [{"title": string, "why": string}], "projects": [{"title": string, "level": "beginner"|"intermediate"|"advanced", "why": string}],
 "preparation": string[]}
Rules: strengths must come ONLY from what the learner stated (skills, interests, education) — do not invent achievements. Keep items short and concrete. 4–6 learning path steps in order. Suggest 2–3 projects matched to their level. Age-appropriate if the learner is a minor.`,
        messages: [{ role: "user", content: learnerContext(saved) }],
      });
      generated = { ...ai, source: "ai" };
    } catch (e) {
      console.error("[onboarding] ai profile", e);
    }
  }

  await supabase
    .from("learn_profiles")
    .update({ generated_profile: generated, onboarding_completed_at: new Date().toISOString() })
    .eq("user_id", user.id);
  await supabase.from("learn_notification_prefs").upsert({ user_id: user.id });
  await supabase.from("learn_activity").insert({ user_id: user.id, kind: "onboarding" });

  redirect("/app/profile?welcome=1");
}
