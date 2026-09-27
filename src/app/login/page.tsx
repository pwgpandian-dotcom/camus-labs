"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect") || "/portal";
  // Only allow same-site relative redirects (prevents open-redirects like //evil.com).
  const redirect = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : "/portal";
  const isLearn = redirect === "/app" || redirect.startsWith("/app/");

  const [mode, setMode] = useState<"sign-in" | "sign-up">(
    searchParams.get("mode") === "sign-up" ? "sign-up" : "sign-in"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const supabase = createClient();

    if (mode === "sign-in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      router.push(redirect);
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}${redirect}`,
        },
      });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      if (data.session) {
        // Email confirmation is off — the user is signed in already.
        router.push(isLearn ? "/app/onboarding" : redirect);
        router.refresh();
        return;
      }
      setNotice(
        "Account created. If email confirmation is enabled on this project, check your inbox before signing in."
      );
      setMode("sign-in");
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-mist px-4 py-10">
      <Container className="max-w-[420px]">
        <div className="rounded-2xl border border-slate-200 bg-paper p-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-paper text-sm font-semibold">
              C
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-ink">
              CAMUS Labs
            </span>
          </Link>

          <h1 className="mt-6 text-2xl font-medium tracking-tight text-ink">
            {mode === "sign-in" ? "Sign in to your account" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isLearn
              ? mode === "sign-in"
                ? "Continue your learning and career journey with Camus Learn."
                : "Free to start. No card required."
              : mode === "sign-in"
                ? "Access your client portal or admin dashboard."
                : "Client portal access is normally provisioned by our team — use this only if you were asked to self-register."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {mode === "sign-up" && (
              <div>
                <label className="text-sm font-medium text-ink" htmlFor="fullName">
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5 w-full min-h-11 rounded-lg border border-slate-300 px-3.5 py-2.5 text-base md:text-sm outline-none focus:border-ink"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-ink" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full min-h-11 rounded-lg border border-slate-300 px-3.5 py-2.5 text-base md:text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full min-h-11 rounded-lg border border-slate-300 px-3.5 py-2.5 text-base md:text-sm outline-none focus:border-ink"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-[#fbeae7] px-3.5 py-2.5 text-sm text-danger">
                {error}
              </p>
            )}
            {notice && (
              <p className="rounded-lg bg-signal-50 px-3.5 py-2.5 text-sm text-signal-dark">
                {notice}
              </p>
            )}

            <Button type="submit" disabled={loading} className="mt-1">
              {loading ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}
            </Button>
          </form>

          {mode === "sign-in" && (
            <button
              type="button"
              onClick={async () => {
                setError(null);
                setNotice(null);
                if (!email) {
                  setError("Enter your email above, then tap “Forgot password?” again.");
                  return;
                }
                setLoading(true);
                const { error } = await createClient().auth.resetPasswordForEmail(email, {
                  redirectTo: `${window.location.origin}/reset-password`,
                });
                setLoading(false);
                if (error) setError(error.message);
                else setNotice("If an account exists for this email, a password reset link is on its way. Check your inbox.");
              }}
              className="mt-4 block text-sm text-signal-dark hover:underline"
            >
              Forgot password?
            </button>
          )}

          <button
            onClick={() => {
              setMode(mode === "sign-in" ? "sign-up" : "sign-in");
              setError(null);
              setNotice(null);
            }}
            className="mt-5 text-sm text-slate-500 hover:text-ink"
          >
            {mode === "sign-in"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </Container>
    </main>
  );
}
