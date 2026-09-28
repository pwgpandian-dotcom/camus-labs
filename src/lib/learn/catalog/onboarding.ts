export const STAGES = [
  { value: "school_primary", label: "School (below 10th / Grade 10)", ageBand: "under_13" as const },
  { value: "school_10", label: "10th grade / Grade 10", ageBand: "13_17" as const },
  { value: "school_12", label: "11th–12th grade / Grades 11–12", ageBand: "13_17" as const },
  { value: "college", label: "College / university student", ageBand: null },
  { value: "graduate", label: "Recent graduate", ageBand: "18_plus" as const },
  { value: "job_seeker", label: "Looking for a job", ageBand: "18_plus" as const },
  { value: "career_switcher", label: "Switching careers", ageBand: "18_plus" as const },
  { value: "professional", label: "Working professional", ageBand: "18_plus" as const },
  { value: "entrepreneur", label: "Entrepreneur / founder", ageBand: "18_plus" as const },
  { value: "lifelong_learner", label: "Lifelong learner", ageBand: null },
] as const;

export type StageValue = (typeof STAGES)[number]["value"];

export const AGE_BANDS = [
  { value: "under_13", label: "Under 13" },
  { value: "13_17", label: "13–17" },
  { value: "18_plus", label: "18 or older" },
] as const;

export const INTERESTS = [
  "Technology", "AI", "Science", "Medicine & health", "Business", "Finance", "Design & art", "Writing",
  "Law & policy", "Engineering", "Teaching", "Sports", "Music", "Environment", "Entrepreneurship", "Social impact",
];

export const SKILL_SUGGESTIONS = [
  "Python", "JavaScript", "TypeScript", "React", "SQL", "Excel", "Java", "C++", "Figma", "Public speaking",
  "Writing", "Data analysis", "Machine learning", "Git", "Marketing", "Sales", "Accounting", "Research",
];

export const LEARNING_STYLES = [
  { value: "simple", label: "Simple explanations first" },
  { value: "examples", label: "Lots of real-world examples" },
  { value: "practice", label: "Practice questions" },
  { value: "deep", label: "Deep, detailed theory" },
] as const;

export function isSchoolStage(stage: string | null | undefined) {
  return stage === "school_primary" || stage === "school_10" || stage === "school_12";
}
