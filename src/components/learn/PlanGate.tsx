import { Lock } from "lucide-react";
import { getLearner } from "@/lib/learn/server";
import { FEATURE_TIER, hasAccess, type GatedFeature } from "@/lib/learn/plans";
import { Button } from "@/components/ui/Button";

/** Server component: renders children, or an upgrade prompt when the plan doesn't include the feature. */
export async function PlanGate({ feature, children }: { feature: GatedFeature; children: React.ReactNode }) {
  const learner = await getLearner();
  if (!learner) return null;
  const { data: flag } = await learner.supabase.from("learn_feature_flags").select("enabled").eq("key", "plan_gating").maybeSingle();
  if (hasAccess(learner.plan?.tier, feature, !!flag?.enabled)) return <>{children}</>;
  const { data: plan } = await learner.supabase.from("learn_plans").select("name").eq("tier", FEATURE_TIER[feature]).eq("is_active", true).maybeSingle();

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-ink">
        <Lock size={20} />
      </span>
      <h1 className="mt-5 text-xl font-semibold tracking-tight text-ink">Included in the {plan?.name ?? "paid"} plan</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">Upgrade to unlock this. New paid plans start with a free trial, and you can cancel any time.</p>
      <Button href="/app/billing" className="mt-6">See plans</Button>
    </div>
  );
}
