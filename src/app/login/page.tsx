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
  const redirect = searchParams.get("redirect") || "/portal";

  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setNotice(
        "Account created. If email confirmation is enabled on this project, check your inbox before signing in."
      );
      setMode("sign-in");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-mist">
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
            {mode === "sign-in"
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
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
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
