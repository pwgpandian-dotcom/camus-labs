import { isSchoolStage } from "./catalog/onboarding";

export interface LearnerSnapshot {
  stage: string | null;
  ageBand: string | null;
  roadmapSlug: string | null;
  roadmapDone: number;
  roadmapTotal: number;
  resumes: number;
  jobAnalyses: number;
  interviews: number;
  quizzes: number;
  weakTopic: { subject: string; topic: string } | null;
  projectsActive: number;
  examGoals: string[];
}

export interface NextAction {
  title: string;
  description: string;
  href: string;
  cta: string;
}

/**
 * The single most useful next step for this learner — every dashboard visit
 * answers "what should I do next?" with one clear call to action.
 */
export function nextAction(s: LearnerSnapshot): NextAction {
  const minor = s.ageBand === "under_13" || s.ageBand === "13_17";

  if (s.weakTopic) {
    return {
      title: `Revisit ${s.weakTopic.topic}`,
      description: `Your last ${s.weakTopic.subject} quiz on this topic had room to improve. A short review now locks it in.`,
      href: `/app/study/${encodeURIComponent(slugify(s.weakTopic.subject))}?topic=${encodeURIComponent(s.weakTopic.topic)}`,
      cta: "Start practice",
    };
  }
  if (isSchoolStage(s.stage) || s.examGoals.length > 0) {
    if (s.quizzes === 0) {
      return {
        title: s.examGoals.length ? `Start preparing for ${s.examGoals[0]}` : "Take your first practice quiz",
        description: "Five quick questions show us where you're strong and where to focus next.",
        href: s.examGoals.length ? "/app/exams" : "/app/study",
        cta: "Start practice",
      };
    }
    return { title: "Continue learning", description: "Pick up a new topic with a short lesson and quiz.", href: "/app/study", cta: "Continue learning" };
  }
  if (s.roadmapSlug && s.roadmapTotal > 0 && s.roadmapDone < s.roadmapTotal) {
    return {
      title: "Continue your skill roadmap",
      description: `${s.roadmapDone} of ${s.roadmapTotal} steps complete. Keep the momentum going.`,
      href: `/app/roadmaps/${s.roadmapSlug}`,
      cta: "Continue learning",
    };
  }
  if (!s.roadmapSlug) {
    return { title: "Choose a direction", description: "Compare careers against your interests and pick a roadmap to follow.", href: "/app/careers", cta: "Explore careers" };
  }
  if (!minor && s.resumes === 0) {
    return { title: "Create your resume", description: "Start from your Career Twin — your education, skills and projects are already filled in.", href: "/app/resume", cta: "Improve resume" };
  }
  if (s.projectsActive === 0) {
    return { title: "Build a portfolio project", description: "Real projects prove skills better than any certificate.", href: "/app/projects", cta: "Build project" };
  }
  if (!minor && s.jobAnalyses === 0) {
    return { title: "Check a job description", description: "Paste a real job post to see matching skills, gaps and what to prepare.", href: "/app/jobs", cta: "Analyse a job" };
  }
  if (!minor && s.interviews < 3) {
    return { title: "Practise an interview", description: "A 10-minute mock interview with feedback on structure and relevance.", href: "/app/interview", cta: "Practice interview" };
  }
  return { title: "Complete today's goal", description: "A short study session keeps your streak and skills growing.", href: "/app/study", cta: "Complete today's goal" };
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
