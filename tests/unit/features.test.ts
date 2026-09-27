import { describe, expect, it } from "vitest";
import { nextAction, slugify, type LearnerSnapshot } from "@/lib/learn/next-action";
import { buildFallbackProfile, matchCareer } from "@/lib/learn/profile-generator";
import { hasAccess } from "@/lib/learn/plans";
import { detectPlatform } from "@/components/learn/InstallPrompt";
import { onboardingSchema, resumeDataSchema, generatedProfileSchema } from "@/lib/learn/schemas";
import { buildDocx } from "@/lib/learn/resume-docx";
import { Packer } from "docx";
import { getSubject } from "@/lib/learn/catalog/subjects";

const base: LearnerSnapshot = {
  stage: "graduate", ageBand: "18_plus", roadmapSlug: null, roadmapDone: 0, roadmapTotal: 0,
  resumes: 0, jobAnalyses: 0, interviews: 0, quizzes: 0, weakTopic: null, projectsActive: 0, examGoals: [],
};

describe("nextAction", () => {
  it("prioritises weak topics", () => {
    const a = nextAction({ ...base, weakTopic: { subject: "Computer Science", topic: "Big-O notation" } });
    expect(a.cta).toBe("Start practice");
    expect(a.href).toBe("/app/study/computer-science?topic=Big-O%20notation");
  });
  it("sends school students to practice", () => expect(nextAction({ ...base, stage: "school_10", ageBand: "13_17" }).href).toBe("/app/study"));
  it("sends exam takers to exam prep first", () => expect(nextAction({ ...base, examGoals: ["GRE General"] }).href).toBe("/app/exams"));
  it("asks graduates without a direction to explore careers", () => expect(nextAction(base).href).toBe("/app/careers"));
  it("continues an unfinished roadmap", () => expect(nextAction({ ...base, roadmapSlug: "ai-engineer", roadmapDone: 2, roadmapTotal: 12 }).href).toBe("/app/roadmaps/ai-engineer"));
  it("then suggests a resume, project, job match and interview in order", () => {
    const r = { ...base, roadmapSlug: "ai-engineer", roadmapDone: 12, roadmapTotal: 12 };
    expect(nextAction(r).href).toBe("/app/resume");
    expect(nextAction({ ...r, resumes: 1 }).href).toBe("/app/projects");
    expect(nextAction({ ...r, resumes: 1, projectsActive: 1 }).href).toBe("/app/jobs");
    expect(nextAction({ ...r, resumes: 1, projectsActive: 1, jobAnalyses: 1 }).href).toBe("/app/interview");
  });
  it("never sends minors to resume/job tools", () => {
    const a = nextAction({ ...base, stage: "lifelong_learner", ageBand: "13_17", roadmapSlug: "software-engineer", roadmapDone: 9, roadmapTotal: 9 });
    expect(["/app/resume", "/app/jobs", "/app/interview"]).not.toContain(a.href);
  });
  it("slugifies subject names to catalog slugs", () => expect(getSubject(slugify("Computer Science"))).toBeDefined());
});

describe("profile generator", () => {
  it("matches free-text roles to careers", () => {
    expect(matchCareer("frontend dev")?.slug).toBe("frontend-developer");
    expect(matchCareer("AI engineer")?.slug).toBe("ai-engineer");
    expect(matchCareer("")).toBeUndefined();
  });
  it("only uses stated facts and satisfies the AI schema", () => {
    const input = onboardingSchema.parse({ displayName: "Asha", stage: "graduate", ageBand: "18_plus", country: "IN", skills: ["HTML", "CSS"], interests: ["Design & art"], targetRole: "Frontend Developer" });
    const p = buildFallbackProfile(input);
    expect(generatedProfileSchema.safeParse(p).success).toBe(true);
    expect(p.strengths.join(" ")).toContain("HTML");
    expect(p.skillGaps).not.toContain("HTML semantics".split(" ")[0]);
    expect(p.learningPath.length).toBeGreaterThan(0);
  });
});

describe("plan gating", () => {
  it("allows everything when gating is off", () => expect(hasAccess(0, "founder", false)).toBe(true));
  it("enforces tiers when on", () => {
    expect(hasAccess(0, "study", true)).toBe(false);
    expect(hasAccess(1, "study", true)).toBe(true);
    expect(hasAccess(1, "jobs", true)).toBe(false);
    expect(hasAccess(3, "founder", true)).toBe(true);
  });
});

describe("install platform detection", () => {
  it("detects iPhone", () => expect(detectPlatform("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)")).toBe("ios"));
  it("detects iPadOS pretending to be a Mac", () => expect(detectPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 5)).toBe("ios"));
  it("detects Android", () => expect(detectPlatform("Mozilla/5.0 (Linux; Android 15; Pixel 9)")).toBe("android"));
  it("detects desktop", () => {
    expect(detectPlatform("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("desktop");
    expect(detectPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 0)).toBe("desktop");
  });
});

describe("resume export", () => {
  it("builds a valid .docx from resume data", async () => {
    const data = resumeDataSchema.parse({
      basics: { name: "Asha K", headline: "Frontend Developer", email: "a@example.com", summary: "Builds accessible interfaces." },
      experience: [{ company: "Acme", title: "Intern", start: "2025-06", bullets: ["Built a settings page in React"] }],
      skills: ["React", "TypeScript"],
    });
    const buf = await Packer.toBuffer(buildDocx(data));
    expect(buf.length).toBeGreaterThan(2000);
    expect(buf.subarray(0, 2).toString()).toBe("PK"); // zip container
  });
});
