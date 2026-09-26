import type { Metadata } from "next";
import { CamusMark } from "@/components/learn/Brand";
import { RetryButton } from "./RetryButton";

export const metadata: Metadata = { title: "You're offline · Camus Learn", robots: { index: false } };
export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center bg-mist px-6 text-center pt-safe pb-safe">
      <CamusMark size={48} />
      <h1 className="mt-6 text-xl font-semibold tracking-tight text-ink">You&apos;re offline</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        Camus Learn needs a connection for AI features and to keep your progress in sync. Check your connection and try again.
      </p>
      <RetryButton />
    </main>
  );
}
