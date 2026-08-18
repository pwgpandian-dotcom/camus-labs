import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { PortalNav } from "@/components/portal/PortalNav";
import { signOut } from "@/app/actions/auth";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
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
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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

        <PortalNav />

        <div className="mt-6">{children}</div>
      </Container>
    </main>
  );
}
