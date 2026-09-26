"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLearner } from "@/lib/learn/server";

const planId = z.string().regex(/^[a-z0-9_-]{2,40}$/);
const currency = z.string().regex(/^[A-Z]{3}$/);

export async function startTrial(plan: string, cur: string) {
  const learner = await getLearner();
  if (!learner || !planId.safeParse(plan).success || !currency.safeParse(cur).success) return { ok: false, message: "Please sign in again." };
  const { error } = await learner.supabase.rpc("learn_start_trial", { p_plan: plan, p_currency: cur });
  if (error) return { ok: false, message: error.message.includes("already used") ? "You've already used your free trial." : "Couldn't start the trial." };
  revalidatePath("/app", "layout");
  return { ok: true, message: "Your trial has started. Enjoy!" };
}

export async function requestPlan(plan: string, interval: "month" | "year", cur: string, coupon?: string) {
  const learner = await getLearner();
  if (!learner || !planId.safeParse(plan).success || !currency.safeParse(cur).success || !["month", "year"].includes(interval)) return { ok: false, message: "Please sign in again." };
  const code = (coupon ?? "").trim().toUpperCase().slice(0, 40);
  const { error } = await learner.supabase.rpc("learn_request_plan", { p_plan: plan, p_interval: interval, p_currency: cur, p_coupon: code || undefined });
  if (error) return { ok: false, message: "Couldn't submit your request." };
  revalidatePath("/app/billing");
  return { ok: true, message: "Request received. Our team will send payment details to your email and activate your plan once payment is confirmed." };
}

export async function checkCoupon(code: string) {
  const learner = await getLearner();
  const c = code.trim().toUpperCase().slice(0, 40);
  if (!learner || !c) return { ok: false as const };
  const { data } = await learner.supabase.rpc("learn_check_coupon", { p_code: c });
  return data ? { ok: true as const, percentOff: data } : { ok: false as const };
}

export async function cancelSubscription(id: string) {
  const learner = await getLearner();
  if (!learner || !z.string().uuid().safeParse(id).success) return;
  await learner.supabase.rpc("learn_cancel_subscription", { p_id: id });
  revalidatePath("/app", "layout");
}
