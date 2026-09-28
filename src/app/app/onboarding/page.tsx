import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getLearner } from "@/lib/learn/server";
import { OnboardingWizard } from "./OnboardingWizard";

export const metadata: Metadata = { title: "Set up your profile · Camus Learn", robots: { index: false } };

export default async function OnboardingPage() {
  const learner = await getLearner();
  if (!learner) redirect("/login?redirect=/app/onboarding&mode=sign-up");
  const { supabase, profile, user } = learner;

  const [{ data: countries }, { data: exams }] = await Promise.all([
    supabase.from("learn_countries").select("code, name").eq("is_active", true).order("name"),
    supabase.from("learn_exams").select("slug, name, country_code").eq("is_active", true).order("name"),
  ]);

  return (
    <OnboardingWizard
      countries={countries ?? []}
      exams={exams ?? []}
      initial={{
        displayName: profile?.display_name ?? (user.user_metadata?.full_name as string | undefined) ?? "",
        stage: profile?.stage ?? "",
        ageBand: profile?.age_band ?? "",
        country: profile?.country_code ?? "",
        currentEducation: profile?.current_education ?? "",
        subjects: profile?.subjects ?? [],
        interests: profile?.interests ?? [],
        skills: profile?.skills ?? [],
        careerGoals: profile?.career_goals ?? "",
        targetRole: profile?.target_role ?? "",
        targetCountry: profile?.target_country ?? "",
        learningStyle: ((profile?.learning_prefs as { style?: string } | null)?.style as string) ?? "simple",
        hoursPerWeek: ((profile?.learning_prefs as { hoursPerWeek?: number } | null)?.hoursPerWeek as number) ?? 5,
        examGoals: profile?.exam_goals ?? [],
      }}
      isEditing={!!profile?.onboarding_completed_at}
    />
  );
}
