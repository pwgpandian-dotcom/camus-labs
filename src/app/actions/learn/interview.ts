"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLearner, learnerContext } from "@/lib/learn/server";
import { INTERVIEW_MODES, interviewFeedbackSchema } from "@/lib/learn/schemas";
import { assertQuota, completeJSON, completeText } from "@/lib/learn/ai/service";
import { AIError, type ChatMessage } from "@/lib/learn/ai/types";
import { QUESTIONS_PER_SESSION, type Turn } from "@/lib/learn/interview";


const MODE_BRIEF: Record<(typeof INTERVIEW_MODES)[number], string> = {
  hr: "an HR / screening interview: motivation, background, expectations, culture fit",
  technical: "a technical interview on the core knowledge for this role (concepts, trade-offs, debugging reasoning)",
  behavioral: "a behavioural interview using situational questions that suit STAR answers",
  system_design: "a system design interview: requirements, high-level design, data, scaling and trade-offs",
  coding: "a coding interview: pose a small problem, ask about approach, complexity and edge cases (the candidate answers in words or pseudocode)",
  case_study: "a case interview: a business problem to structure, estimate and recommend on",
  role_specific: "a role-specific interview covering the day-to-day work of this role",
};

function interviewerSystem(mode: (typeof INTERVIEW_MODES)[number], role: string, ctx: string) {
  return `You are a fair, realistic interviewer conducting ${MODE_BRIEF[mode]} for a "${role}" position.
Ask ONE question at a time. Keep each question concise (1–3 sentences). Adapt difficulty to the candidate's answers and background.
Do not give feedback or model answers during the interview; you may add a brief, natural acknowledgement before the next question.
Never ask for protected or sensitive personal information (age, religion, marital status, health, etc.).
Candidate background:\n${ctx}`;
}

function toMessages(transcript: Turn[]): ChatMessage[] {
  // The model plays the interviewer (assistant); candidate answers are user turns.
  const msgs: ChatMessage[] = [{ role: "user", content: "Please begin the interview with your first question." }];
  for (const t of transcript) msgs.push({ role: t.role === "interviewer" ? "assistant" : "user", content: t.content });
  return msgs;
}

const startSchema = z.object({ mode: z.enum(INTERVIEW_MODES), role: z.string().trim().min(2, "Enter the role you're preparing for").max(120) });

export async function startInterview(_: { error: string | null } | null, fd: FormData) {
  const learner = await getLearner();
  if (!learner) return { error: "Please sign in again." };
  const p = startSchema.safeParse({ mode: fd.get("mode"), role: fd.get("role") });
  if (!p.success) return { error: p.error.issues[0].message };
  const { supabase, user, profile, plan } = learner;
  let first: string;
  try {
    await assertQuota(supabase, plan?.ai_messages_per_day ?? 15);
    first = (
      await completeText({
        supabase,
        userId: user.id,
        feature: "interview",
        usageLabel: `interview:${p.data.mode}`,
        system: interviewerSystem(p.data.mode, p.data.role, learnerContext(profile)),
        messages: [{ role: "user", content: "Please begin the interview with a one-line welcome and your first question." }],
      })
    ).trim();
  } catch (e) {
    return { error: e instanceof AIError ? e.message : "Couldn't start the interview. Please try again." };
  }
  const { data, error } = await supabase
    .from("learn_interviews")
    .insert({ user_id: user.id, mode: p.data.mode, target_role: p.data.role, transcript: [{ role: "interviewer", content: first }] })
    .select("id")
    .single();
  if (error || !data) return { error: "Couldn't save the interview." };
  redirect(`/app/interview/${data.id}`);
}

export async function answerQuestion(id: string, answer: string): Promise<{ ok: true; transcript: Turn[]; done: boolean } | { ok: false; error: string }> {
  const learner = await getLearner();
  if (!learner || !z.string().uuid().safeParse(id).success) return { ok: false, error: "Please sign in again." };
  const text = answer.trim().slice(0, 6000);
  if (text.length < 2) return { ok: false, error: "Type your answer first." };
  const { supabase, user, profile, plan } = learner;
  const { data: iv } = await supabase.from("learn_interviews").select("*").eq("id", id).maybeSingle();
  if (!iv || iv.status !== "in_progress") return { ok: false, error: "This interview has ended." };

  const transcript = [...(iv.transcript as Turn[]), { role: "candidate" as const, content: text }];
  const asked = transcript.filter((t) => t.role === "interviewer").length;
  const done = asked >= QUESTIONS_PER_SESSION;

  if (!done) {
    try {
      await assertQuota(supabase, plan?.ai_messages_per_day ?? 15);
      const next = await completeText({
        supabase,
        userId: user.id,
        feature: "interview",
        usageLabel: `interview:${iv.mode}`,
        system: interviewerSystem(iv.mode as (typeof INTERVIEW_MODES)[number], iv.target_role ?? "the role", learnerContext(profile)),
        messages: toMessages(transcript),
      });
      transcript.push({ role: "interviewer", content: next.trim() });
    } catch (e) {
      return { ok: false, error: e instanceof AIError ? e.message : "The interviewer couldn't respond. Try again." };
    }
  }
  await supabase.from("learn_interviews").update({ transcript }).eq("id", id);
  return { ok: true, transcript, done };
}

export async function finishInterview(id: string) {
  const learner = await getLearner();
  if (!learner || !z.string().uuid().safeParse(id).success) return { ok: false as const, error: "Please sign in again." };
  const { supabase, user, profile } = learner;
  const { data: iv } = await supabase.from("learn_interviews").select("*").eq("id", id).maybeSingle();
  if (!iv) return { ok: false as const, error: "Interview not found." };
  const transcript = iv.transcript as Turn[];
  if (!transcript.some((t) => t.role === "candidate")) return { ok: false as const, error: "Answer at least one question first." };

  try {
    const feedback = await completeJSON({
      supabase,
      userId: user.id,
      usageLabel: "interview:feedback",
      schema: interviewFeedbackSchema,
      instructions: `You are an experienced, kind but honest interview coach. Evaluate the candidate's answers in this ${iv.mode.replace("_", " ")} interview for "${iv.target_role}".
Return JSON: {"overall": string, "strengths": string[], "improvements": string[], "technicalGaps": string[],
"scores": {"answerQuality": 1-5, "structure": 1-5, "relevance": 1-5, "communication": 1-5},
"improvedAnswers": [{"question": string, "suggestion": string}]}.
improvedAnswers: for up to 3 weaker answers, show a stronger answer that uses ONLY facts the candidate mentioned (placeholders like [your real result] where they gave none). Be specific and encouraging.`,
      messages: [{ role: "user", content: `Candidate background:\n${learnerContext(profile)}\n\nTranscript:\n${transcript.map((t) => `${t.role.toUpperCase()}: ${t.content}`).join("\n\n")}` }],
    });
    await supabase.from("learn_interviews").update({ feedback, status: "completed", completed_at: new Date().toISOString() }).eq("id", id);
    await supabase.from("learn_activity").insert({ user_id: user.id, kind: "interview" });
    revalidatePath(`/app/interview/${id}`);
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof AIError ? e.message : "Couldn't generate feedback. Try again." };
  }
}

export async function deleteInterview(id: string) {
  const learner = await getLearner();
  if (!learner || !z.string().uuid().safeParse(id).success) return;
  await learner.supabase.from("learn_interviews").delete().eq("id", id);
  revalidatePath("/app/interview");
  redirect("/app/interview");
}
