"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Landing page for the password-reset email link. Supabase signs the user in
 * with a short-lived recovery session; here they choose a new password.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    (async () => {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) setError("This reset link is invalid or has expired. Request a new one from the sign-in page.");
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) setReady(true);
      else if (!code) setError("This reset link is invalid or has expired. Request a new one from the sign-in page.");
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The passwords don't match.");
    setLoading(true);
    const { error } = await createClient().auth.updateUser({ password });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/app");
    router.refresh();
  }

  const field = "mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-base md:text-sm outline-none focus:border-ink";

  return (
    <main id="main" className="flex min-h-dvh items-center justify-center bg-mist px-4 py-10">
      <Container className="max-w-[420px]">
        <div className="rounded-2xl border border-slate-200 bg-paper p-8">
          <h1 className="text-2xl font-medium tracking-tight text-ink">Choose a new password</h1>
          {!ready && !error && <p className="mt-3 text-sm text-slate-500">Checking your reset link…</p>}
          {ready && (
            <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
              <label className="text-sm font-medium text-ink" htmlFor="password">
                New password
                <input id="password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
              </label>
              <label className="text-sm font-medium text-ink" htmlFor="confirm">
                Confirm new password
                <input id="confirm" type="password" autoComplete="new-password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} />
              </label>
              <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Save password"}</Button>
            </form>
          )}
          {error && <p className="mt-4 rounded-lg bg-[#fbeae7] px-3.5 py-2.5 text-sm text-danger">{error}</p>}
          <Link href="/login" className="mt-5 inline-block text-sm text-slate-500 hover:text-ink">Back to sign in</Link>
        </div>
      </Container>
    </main>
  );
}
