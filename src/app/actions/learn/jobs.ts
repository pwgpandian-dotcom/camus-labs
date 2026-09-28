"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLearner, learnerContext } from "@/lib/learn/server";
import { jobAnalysisRequestSchema, jobReportSchema } from "@/lib/learn/schemas";
import { assertQuota, completeJSON } from "@/lib/learn/ai/service";
import { AIError } from "@/lib/learn/ai/types";

export type JobState = { error: string | null } | null;

export async function analyzeJob(_: JobState, fd: FormData): Promise<JobState> {
  const learner = await getLearner();
  if (!learner) return { error: "Please sign in again." };
  const parsed = jobAnalysisRequestSchema.safeParse({
    title: fd.get("title") ?? "",
    company: fd.get("company") ?? "",
    jdText: fd.get("jdText") ?? "",
    resumeId: fd.get("resumeId") || null,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { title, company, jdText, resumeId } = parsed.data;
  const { supabase, user, profile, plan } = learner;

  const [edu, exp, projects, resume] = await Promise.all([
    supabase.from("learn_education").select("institution, qualification, field, end_year").eq("user_id", user.id),
    supabase.from("learn_experience").select("company, title, start_date, end_date, description").eq("user_id", user.id),
    supabase.from("learn_projects").select("title, status, spec").eq("user_id", user.id).limit(10),
    resumeId ? supabase.from("learn_resumes").select("data").eq("id", resumeId).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  const candidate = [
    "CAREER TWIN:",
    learnerContext(profile),
    `Education: ${JSON.stringify(edu.data ?? [])}`,
    `Experience: ${JSON.stringify(exp.data ?? [])}`,
    `Projects: ${JSON.stringify((projects.data ?? []).map((p) => ({ title: p.title, status: p.status })))}`,
    resume.data ? `RESUME: ${JSON.stringify(resume.data.data)}` : "",
  ].join("\n");

  let report;
  try {
    await assertQuota(supabase, plan?.ai_messages_per_day ?? 15);
    report = await completeJSON({
      supabase,
      userId: user.id,
      usageLabel: "ats",
      schema: jobReportSchema,
      instructions: `Analyse a job description and compare it with the candidate. Return JSON with keys:
roleSummary (string), requiredSkills, preferredSkills, responsibilities, keywords (the terms an applicant-tracking system would likely scan for), experience (string), education (string),
matchingSkills (skills the candidate evidently has), missingSkills (required/preferred skills with no evidence), relevantExperience, relevantProjects,
resumeImprovements (specific, truthful edits — e.g. "Move your React project above education" — never suggest claiming skills or experience the candidate lacks),
interviewTopics, learningRecommendations (concrete next steps for missing skills).
Only mark a skill as matching if the candidate data shows it. Do NOT produce any numeric ATS score or predict selection.`,
      messages: [{ role: "user", content: `JOB DESCRIPTION${title ? ` (${title}${company ? ` at ${company}` : ""})` : ""}:\n${jdText}\n\n${candidate}` }],
    });
  } catch (e) {
    return { error: e instanceof AIError ? e.message : "Couldn't analyse this job right now. Please try again." };
  }

  const { data: saved, error } = await supabase
    .from("learn_job_analyses")
    .insert({ user_id: user.id, title: title || null, company: company || null, jd_text: jdText, report })
    .select("id")
    .single();
  if (error || !saved) return { error: "Couldn't save the analysis." };
  await supabase.from("learn_activity").insert({ user_id: user.id, kind: "job_analysis" });
  redirect(`/app/jobs/${saved.id}`);
}

export async function deleteAnalysis(id: string) {
  const learner = await getLearner();
  if (!learner || !z.string().uuid().safeParse(id).success) return;
  await learner.supabase.from("learn_job_analyses").delete().eq("id", id);
  revalidatePath("/app/jobs");
  redirect("/app/jobs");
}
