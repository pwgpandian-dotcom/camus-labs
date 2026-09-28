import type { Metadata } from "next";
import { AppShell } from "@/components/learn/AppShell";
import { requireLearner } from "@/lib/learn/server";
import { signOut } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: { default: "Camus Learn", template: "%s · Camus Learn" },
  robots: { index: false, follow: false },
};

export default async function LearnAppLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user, profile, plan } = await requireLearner();
  const { data: staff } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

  return (
    <AppShell
      locale={profile?.locale ?? "en"}
      displayName={profile?.display_name || user.email?.split("@")[0] || "Learner"}
      planName={plan?.name ?? "Free"}
      isStaff={!!staff && ["admin", "operator", "sales"].includes(staff.role)}
      signOutAction={signOut}
    >
      {children}
    </AppShell>
  );
}
