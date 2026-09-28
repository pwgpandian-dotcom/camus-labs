import { NextResponse } from "next/server";
import { z } from "zod";
import { getLearner, learnerContext } from "@/lib/learn/server";
import { assertQuota, streamText } from "@/lib/learn/ai/service";
import { AIError } from "@/lib/learn/ai/types";

export const maxDuration = 60;

const schema = z.object({
  subject: z.string().trim().min(1).max(80),
  topic: z.string().trim().min(1).max(120),
  depth: z.enum(["simple", "deep", "examples", "practice"]).default("simple"),
});

const DEPTH: Record<z.infer<typeof schema>["depth"], string> = {
  simple: "Explain simply first: intuition, a real-world analogy, then the core idea in plain words. Keep it short (under ~400 words).",
  deep: "Explain in depth: definitions, derivations or reasoning, edge cases and common misconceptions. Use headings.",
  examples: "Teach through 2–3 worked examples of increasing difficulty, solved step by step.",
  practice: "Give 4 practice problems of increasing difficulty. For each, give a hint, then the full step-by-step solution in a collapsed-style section titled 'Solution'.",
};

export async function POST(req: Request) {
  const learner = await getLearner();
  if (!learner) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { subject, topic, depth } = parsed.data;
  const { supabase, user, profile, plan } = learner;

  try {
    await assertQuota(supabase, plan?.ai_messages_per_day ?? 15);
    const stream = await streamText({
      supabase,
      userId: user.id,
      feature: "assistant",
      usageLabel: `lesson:${depth}`,
      system: `You are Camus, a patient expert tutor. Teach ${subject} — topic: "${topic}". ${DEPTH[depth]}
Match the learner's level and curriculum. Use Markdown and LaTeX for maths ($...$ inline, $$...$$ display). End with one check-your-understanding question (without the answer). Be accurate; if a fact varies by curriculum or country, say so.`,
      messages: [{ role: "user", content: `Learner profile:\n${learnerContext(profile) || "(not provided)"}\n\nPlease teach: ${topic}` }],
      signal: req.signal,
      onFinish: async () => {
        await supabase.from("learn_activity").insert({ user_id: user.id, kind: "lesson" });
      },
    });
    return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
  } catch (e) {
    if (e instanceof AIError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
