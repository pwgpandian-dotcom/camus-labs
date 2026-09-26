/**
 * Consecutive-day learning streak from activity timestamps, evaluated in the
 * learner's time zone. A streak stays alive if the learner was active today
 * or yesterday (so it doesn't reset at midnight before they've had a chance).
 */
export function dayKey(date: Date, timeZone = "UTC") {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function computeStreak(timestamps: Array<string | Date>, now = new Date(), timeZone = "UTC") {
  const days = new Set(timestamps.map((t) => dayKey(new Date(t), timeZone)));
  const oneDay = 86_400_000;
  let cursor = now.getTime();
  if (!days.has(dayKey(new Date(cursor), timeZone))) {
    cursor -= oneDay;
    if (!days.has(dayKey(new Date(cursor), timeZone))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(new Date(cursor), timeZone))) {
    streak++;
    cursor -= oneDay;
  }
  return streak;
}

/** Days active in the last 7 days (0–7) — used for the weekly goal ring. */
export function activeDaysThisWeek(timestamps: Array<string | Date>, now = new Date(), timeZone = "UTC") {
  const days = new Set(timestamps.map((t) => dayKey(new Date(t), timeZone)));
  let count = 0;
  for (let i = 0; i < 7; i++) if (days.has(dayKey(new Date(now.getTime() - i * 86_400_000), timeZone))) count++;
  return count;
}

/** ISO timestamp for N days ago (kept out of component bodies for render purity). */
export function daysAgoISO(days: number, from: Date = new Date()) {
  return new Date(from.getTime() - days * 86_400_000).toISOString();
}
