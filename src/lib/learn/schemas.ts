import { z } from "zod";
import { ASSISTANT_MODES } from "./ai/prompts";

const shortText = (max: number) => z.string().trim().max(max);
const tagList = z.array(z.string().trim().min(1).max(60)).max(30);

/* ------------------------------ Onboarding ------------------------------ */
export const onboardingSchema = z.object({
  displayName: shortText(80).min(1, "Please tell us what to call you"),
  stage: z.enum([
    "school_primary", "school_10", "school_12", "college", "graduate",
    "job_seeker", "career_switcher", "professional", "entrepreneur", "lifelong_learner",
  ]),
  ageBand: z.enum(["under_13", "13_17", "18_plus"]),
  country: z.string().regex(/^[A-Z]{2}$/, "Choose your country"),
  currentEducation: shortText(200).optional().default(""),
  subjects: tagList.default([]),
  interests: tagList.default([]),
  skills: tagList.default([]),
  careerGoals: shortText(1000).optional().default(""),
  targetRole: shortText(120).optional().default(""),
  targetCountry: z.union([z.string().regex(/^[A-Z]{2}$/), z.literal("")]).optional().default(""),
  learningStyle: z.enum(["simple", "examples", "practice", "deep"]).default("simple"),
  hoursPerWeek: z.coerce.number().int().min(1).max(60).default(5),
  examGoals: tagList.default([]),
  timezone: z.string().max(64).regex(/^[A-Za-z_+\-/0-9]*$/).optional().default(""),
});
export type OnboardingInput = z.infer<typeof onboardingSchema>;

/** Shape the AI must return when generating the Personal Career & Learning Profile. */
export const generatedProfileSchema = z.object({
  currentLevel: z.string().max(400),
  goals: z.array(z.string().max(200)).max(6),
  strengths: z.array(z.string().max(200)).max(6),
  skillGaps: z.array(z.string().max(200)).max(8),
  learningPath: z.array(z.object({ title: z.string().max(120), why: z.string().max(300) })).max(8),
  projects: z.array(z.object({ title: z.string().max(120), level: z.enum(["beginner", "intermediate", "advanced"]), why: z.string().max(300) })).max(4),
  preparation: z.array(z.string().max(200)).max(6),
});
export type GeneratedProfile = z.infer<typeof generatedProfileSchema>;

/* ------------------------------ Assistant ------------------------------ */
export const chatRequestSchema = z.object({
  conversationId: z.string().uuid().nullable().optional(),
  mode: z.enum(ASSISTANT_MODES).default("general"),
  message: z.string().trim().min(1).max(12000),
  regenerate: z.boolean().optional(),
});

/* ------------------------------ Study tutor ------------------------------ */
export const quizSchema = z.object({
  questions: z
    .array(
      z.object({
        prompt: z.string().min(3).max(800),
        options: z.array(z.string().min(1).max(300)).length(4),
        answerIndex: z.number().int().min(0).max(3),
        explanation: z.string().max(1200),
      })
    )
    .min(3)
    .max(10),
});
export type Quiz = z.infer<typeof quizSchema>;

/* ------------------------------ Resume ------------------------------ */
export const resumeDataSchema = z.object({
  basics: z
    .object({
      name: shortText(100).default(""),
      headline: shortText(160).default(""),
      email: shortText(160).default(""),
      phone: shortText(40).default(""),
      location: shortText(120).default(""),
      links: z.array(shortText(300)).max(6).default([]),
      summary: shortText(1500).default(""),
    })
    .default({ name: "", headline: "", email: "", phone: "", location: "", links: [], summary: "" }),
  experience: z
    .array(
      z.object({
        company: shortText(120),
        title: shortText(120),
        location: shortText(120).default(""),
        start: shortText(20).default(""),
        end: shortText(20).default(""),
        bullets: z.array(shortText(400)).max(10).default([]),
      })
    )
    .max(15)
    .default([]),
  education: z
    .array(
      z.object({
        institution: shortText(160),
        qualification: shortText(160),
        start: shortText(20).default(""),
        end: shortText(20).default(""),
        details: shortText(300).default(""),
      })
    )
    .max(8)
    .default([]),
  projects: z
    .array(z.object({ name: shortText(120), link: shortText(300).default(""), bullets: z.array(shortText(400)).max(6).default([]) }))
    .max(10)
    .default([]),
  skills: z.array(shortText(60)).max(60).default([]),
  certifications: z.array(z.object({ name: shortText(160), issuer: shortText(120).default(""), year: shortText(10).default("") })).max(15).default([]),
});
export type ResumeData = z.infer<typeof resumeDataSchema>;

/* ------------------------------ Job analysis ------------------------------ */
export const jobAnalysisRequestSchema = z.object({
  title: shortText(160).optional().default(""),
  company: shortText(160).optional().default(""),
  jdText: z.string().trim().min(50, "Paste the full job description (at least a few lines)").max(30000),
  resumeId: z.string().uuid().optional().nullable(),
});

export const jobReportSchema = z.object({
  roleSummary: z.string().max(600),
  requiredSkills: z.array(z.string().max(80)).max(30),
  preferredSkills: z.array(z.string().max(80)).max(30),
  responsibilities: z.array(z.string().max(240)).max(15),
  experience: z.string().max(300),
  education: z.string().max(300),
  keywords: z.array(z.string().max(60)).max(40),
  matchingSkills: z.array(z.string().max(80)).max(30),
  missingSkills: z.array(z.string().max(80)).max(30),
  relevantExperience: z.array(z.string().max(300)).max(10),
  relevantProjects: z.array(z.string().max(300)).max(10),
  resumeImprovements: z.array(z.string().max(400)).max(10),
  interviewTopics: z.array(z.string().max(200)).max(12),
  learningRecommendations: z.array(z.string().max(300)).max(10),
});
export type JobReport = z.infer<typeof jobReportSchema>;

/* ------------------------------ Interview ------------------------------ */
export const INTERVIEW_MODES = ["hr", "technical", "behavioral", "system_design", "coding", "case_study", "role_specific"] as const;
export const interviewFeedbackSchema = z.object({
  overall: z.string().max(800),
  strengths: z.array(z.string().max(300)).max(6),
  improvements: z.array(z.string().max(300)).max(6),
  technicalGaps: z.array(z.string().max(300)).max(6),
  scores: z.object({
    answerQuality: z.number().int().min(1).max(5),
    structure: z.number().int().min(1).max(5),
    relevance: z.number().int().min(1).max(5),
    communication: z.number().int().min(1).max(5),
  }),
  improvedAnswers: z.array(z.object({ question: z.string().max(500), suggestion: z.string().max(1500) })).max(6),
});
export type InterviewFeedback = z.infer<typeof interviewFeedbackSchema>;

/* ------------------------------ Projects ------------------------------ */
export const projectSpecSchema = z.object({
  title: z.string().max(120),
  problem: z.string().max(600),
  objective: z.string().max(400),
  features: z.array(z.string().max(200)).max(12),
  architecture: z.string().max(1200),
  techStack: z.array(z.string().max(60)).max(15),
  database: z.string().max(800),
  apis: z.array(z.string().max(200)).max(12),
  milestones: z
    .array(z.object({ title: z.string().max(120), tasks: z.array(z.string().max(200)).min(1).max(8) }))
    .min(2)
    .max(6),
  testing: z.string().max(600),
  deployment: z.string().max(600),
  documentation: z.string().max(600),
  portfolioDescription: z.string().max(600),
});
export type ProjectSpec = z.infer<typeof projectSpecSchema>;
