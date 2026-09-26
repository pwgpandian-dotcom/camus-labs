import type { Metadata } from "next";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { createPublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = {
  title: "Exam preparation — practice questions & timed mock tests | Camus Learn",
  description: "Prepare for NEET, JEE, CAT, GATE, UPSC, SAT, GRE, GMAT, IELTS, TOEFL and more with topic practice, timed mock tests and performance analytics.",
  alternates: { canonical: "/learn/exams" },
};

export const revalidate = 3600;

export default async function PublicExamsPage() {
  const { data: exams, error } = await createPublicClient().from("learn_exams").select("slug, name, description, subjects").eq("is_active", true).order("name");
  return (
    <PublicChrome>
      <Section eyebrow="Exam preparation" heading="Prepare for your exam" subheading="Topic practice, timed mock tests and subject-by-subject analytics. Camus is independent and not affiliated with any exam body.">
        {error || !exams?.length ? (
          <p className="text-slate-500">Exam list is temporarily unavailable.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((e) => (
              <li key={e.slug} className="rounded-2xl border border-slate-200 p-6">
                <h2 className="text-lg font-medium tracking-tight text-ink">{e.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{e.description}</p>
                <p className="mt-4 text-xs text-slate-400">{e.subjects.join(" · ")}</p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-10"><Button href="/login?redirect=/app&mode=sign-up" size="lg">Start preparing free</Button></div>
      </Section>
    </PublicChrome>
  );
}
