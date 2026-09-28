import { careers, type Career } from "./catalog/careers";
import type { GeneratedProfile, OnboardingInput } from "./schemas";
import { isSchoolStage } from "./catalog/onboarding";

/** Best catalog match for a free-text target role (e.g. "frontend dev" → Frontend Developer). */
export function matchCareer(targetRole: string | null | undefined): Career | undefined {
  if (!targetRole) return undefined;
  const q = targetRole.toLowerCase().replace(/[^a-z0-9 ]/g, " ");
  const words = q.split(/\s+/).filter((w) => w.length > 1);
  let best: { c: Career; score: number } | undefined;
  for (const c of careers) {
    const hay = `${c.title} ${c.slug.replace(/-/g, " ")} ${c.category}`.toLowerCase();
    let score = 0;
    for (const w of words) if (hay.includes(w.replace(/s$/, ""))) score += w.length;
    if (hay.includes(q.trim())) score += 20;
    if (score > 0 && (!best || score > best.score)) best = { c, score };
  }
  return best?.c;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#]/g, "");

/**
 * Deterministic profile used when AI is unavailable (and as a sanity floor).
 * It only restates what the learner told us plus catalog guidance — it never
 * invents strengths or achievements.
 */
export function buildFallbackProfile(input: OnboardingInput): GeneratedProfile {
  const career = matchCareer(input.targetRole);
  const have = new Set(input.skills.map(norm));
  const gaps = career ? career.skills.filter((s) => !have.has(norm(s.split(" (")[0]))).slice(0, 6) : [];

  const stageLabel = input.stage.replace(/_/g, " ");
  const currentLevel = [
    `You're at the ${stageLabel} stage`,
    input.currentEducation ? `studying ${input.currentEducation}` : null,
    input.skills.length ? `with starting skills in ${input.skills.slice(0, 5).join(", ")}` : "and just getting started with skills",
  ]
    .filter(Boolean)
    .join(", ") + ".";

  const goals = [
    input.targetRole ? `Work towards a ${input.targetRole} role` : null,
    input.careerGoals ? input.careerGoals.slice(0, 200) : null,
    ...input.examGoals.map((e) => `Prepare for ${e}`),
  ].filter((g): g is string => !!g).slice(0, 6);

  const strengths = [
    ...input.skills.slice(0, 3).map((s) => `Existing foundation in ${s}`),
    ...input.interests.slice(0, 2).map((i) => `Genuine interest in ${i}`),
  ].slice(0, 6);

  const learningPath = career
    ? career.roadmap.slice(0, 6).map((s) => ({ title: s.title, why: s.detail }))
    : isSchoolStage(input.stage)
      ? input.subjects.slice(0, 5).map((s) => ({ title: s, why: "Build strong fundamentals with short daily practice and quizzes." }))
      : [{ title: "Explore careers", why: "Compare a few roles against your interests to choose a direction." }];

  const projects = career ? career.projects.slice(0, 3).map((p) => ({ title: p.title, level: p.level, why: p.brief })) : [];

  const preparation = [
    ...(career ? career.interviewTopics.slice(0, 3).map((t) => `Practise: ${t}`) : []),
    ...input.examGoals.slice(0, 2).map((e) => `Timed practice sets for ${e}`),
  ].slice(0, 6);

  return {
    currentLevel,
    goals: goals.length ? goals : ["Decide on a direction by exploring careers that match your interests"],
    strengths,
    skillGaps: gaps,
    learningPath,
    projects,
    preparation: preparation.length ? preparation : ["Set a weekly study goal and track it"],
  };
}
