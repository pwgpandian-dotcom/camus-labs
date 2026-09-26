"use server";

import { z } from "zod";
import { getLearner, learnerContext } from "@/lib/learn/server";
import { quizSchema, type Quiz } from "@/lib/learn/schemas";
import { completeJSON, assertQuota } from "@/lib/learn/ai/service";
import { AIError } from "@/lib/learn/ai/types";

export interface PublicQuestion {
  prompt: string;
  options: string[];
}
export type GenerateQuizResult = { ok: true; attemptId: string; questions: PublicQuestion[]; source: "bank" | "ai" } | { ok: false; error: string };

const genSchema = z.object({
  subject: z.string().trim().min(1).max(80),
  topic: z.string().trim().min(1).max(120),
  examSlug: z.string().trim().max(40).optional().nullable(),
  count: z.number().int().min(3).max(10).default(5),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

/**
 * Creates a quiz attempt. Uses the admin-curated exam question bank when it
 * has enough questions for this topic, otherwise generates with AI. Answers
 * stay on the server until the learner submits.
 */
export async function generateQuiz(input: z.input<typeof genSchema>): Promise<GenerateQuizResult> {
  const learner = await getLearner();
  if (!learner) return { ok: false, error: "Please sign in again." };
  const p = genSchema.safeParse(input);
  if (!p.success) return { ok: false, error: "Invalid quiz request." };
  const { subject, topic, examSlug, count, difficulty } = p.data;
  const { supabase, user, profile, plan } = learner;

  let quiz: Quiz | null = null;
  let source: "bank" | "ai" = "ai";

  if (examSlug) {
    const { data: bank } = await supabase
      .from("learn_exam_questions")
      .select("prompt, options, answer_index, explanation")
      .eq("exam_slug", examSlug)
      .eq("subject", subject)
      .limit(50);
    if (bank && bank.length >= count) {
      const picked = [...bank].sort(() => Math.random() - 0.5).slice(0, count);
      quiz = {
        questions: picked.map((q) => ({ prompt: q.prompt, options: q.options as string[], answerIndex: q.answer_index, explanation: q.explanation ?? "" })),
      };
      source = "bank";
    }
  }

  if (!quiz) {
    try {
      await assertQuota(supabase, plan?.ai_messages_per_day ?? 15);
      quiz = await completeJSON({
        supabase,
        userId: user.id,
        usageLabel: examSlug ? `quiz:${examSlug}` : "quiz",
        schema: quizSchema,
        instructions: `Write a ${count}-question multiple-choice quiz. Return JSON: {"questions":[{"prompt": string, "options": [4 strings], "answerIndex": 0-3, "explanation": string}]}.
Rules: exactly 4 options each, one unambiguously correct answer, plausible distractors, explanations that teach the concept in 1–3 sentences. Use LaTeX ($...$) for maths. Vary answer positions. Difficulty: ${difficulty}. Match the learner's level and ${examSlug ? `the style of the ${examSlug.toUpperCase()} exam` : "their curriculum"}. Never copy questions from copyrighted past papers verbatim.`,
        messages: [{ role: "user", content: `Subject: ${subject}\nTopic: ${topic}\n\nLearner:\n${learnerContext(profile)}` }],
      });
    } catch (e) {
      return { ok: false, error: e instanceof AIError ? e.message : "Couldn't create a quiz right now. Please try again." };
    }
  }

  const { data: attempt, error } = await supabase
    .from("learn_quiz_attempts")
    .insert({ user_id: user.id, subject, topic, exam_slug: examSlug ?? null, questions: quiz.questions, total: quiz.questions.length })
    .select("id")
    .single();
  if (error || !attempt) return { ok: false, error: "Couldn't save the quiz. Please try again." };

  return { ok: true, attemptId: attempt.id, source, questions: quiz.questions.map((q) => ({ prompt: q.prompt, options: q.options })) };
}

export type QuizResult =
  | { ok: true; score: number; total: number; review: { correct: boolean; answerIndex: number; chosen: number | null; explanation: string }[] }
  | { ok: false; error: string };

export async function submitQuiz(attemptId: string, answers: Array<number | null>): Promise<QuizResult> {
  const learner = await getLearner();
  if (!learner || !z.string().uuid().safeParse(attemptId).success) return { ok: false, error: "Please sign in again." };
  const { supabase, user } = learner;
  const { data: attempt } = await supabase.from("learn_quiz_attempts").select("questions, total, completed_at").eq("id", attemptId).maybeSingle();
  if (!attempt) return { ok: false, error: "Quiz not found." };

  const questions = attempt.questions as Quiz["questions"];
  const clean = questions.map((_, i) => {
    const a = answers[i];
    return typeof a === "number" && a >= 0 && a <= 3 ? a : null;
  });
  const review = questions.map((q, i) => ({ correct: clean[i] === q.answerIndex, answerIndex: q.answerIndex, chosen: clean[i], explanation: q.explanation }));
  const score = review.filter((r) => r.correct).length;

  if (!attempt.completed_at) {
    await supabase.from("learn_quiz_attempts").update({ answers: clean, score, completed_at: new Date().toISOString() }).eq("id", attemptId);
    await supabase.from("learn_activity").insert({ user_id: user.id, kind: "quiz" });
  }
  return { ok: true, score, total: attempt.total, review };
}
