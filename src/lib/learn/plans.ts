/**
 * Which plan tier unlocks each premium area. Enforced only when the admin
 * feature flag `plan_gating` is on (so nothing is locked before payments
 * are live). AI request limits per plan are always enforced.
 */
export const FEATURE_TIER = {
  study: 1,
  exams: 1,
  jobs: 2,
  interview: 2,
  projects: 2,
  founder: 3,
} as const;

export type GatedFeature = keyof typeof FEATURE_TIER;

export function hasAccess(planTier: number | null | undefined, feature: GatedFeature, gatingOn: boolean) {
  if (!gatingOn) return true;
  return (planTier ?? 0) >= FEATURE_TIER[feature];
}
