import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/admin/EmptyState";
import { signOut } from "@/app/actions/auth";

export default async function PortalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/portal");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-mist">
      <Container className="py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.1em] text-slate-400">
              Client portal
            </p>
            <h1 className="mt-1 text-2xl font-medium tracking-tight text-ink">
              Welcome, {profile?.full_name || profile?.email}
            </h1>
          </div>
          <form action={signOut}>
            <button type="submit" className="text-sm text-slate-500 hover:text-ink">
              Sign out
            </button>
          </form>
        </div>

        <EmptyState
          title="Client dashboard is on the roadmap"
          description="Active projects, milestones, documents, payments and messages will appear here — this is Phase 5 of the CAMUS Labs build."
        />
      </Container>
    </main>
  );
}
