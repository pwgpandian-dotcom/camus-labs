import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { signOut } from "@/app/actions/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .single();

  const staffRoles = ["admin", "operator", "sales"];
  if (!profile || !staffRoles.includes(profile.role)) {
    redirect("/portal");
  }

  return (
    <div className="flex min-h-screen bg-mist">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-paper px-6 py-4 md:px-8">
          <p className="text-sm text-slate-500">
            Signed in as{" "}
            <span className="font-medium text-ink">
              {profile.full_name || profile.email}
            </span>{" "}
            · <span className="capitalize">{profile.role}</span>
          </p>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-slate-500 transition-colors hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </header>
        <main className="flex-1 px-6 py-8 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
