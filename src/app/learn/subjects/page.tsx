import type { Metadata } from "next";
import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { subjects } from "@/lib/learn/catalog/subjects";

export const metadata: Metadata = {
  title: "Learn any subject with an AI tutor | Camus Learn",
  description: "Mathematics, physics, chemistry, biology, computer science, history, geography, economics and English — explained simply, then deeply, with practice and quizzes.",
  alternates: { canonical: "/learn/subjects" },
};

export default function SubjectsPage() {
  return (
    <PublicChrome>
      <Section eyebrow="Subjects" heading="Learn any subject, step by step" subheading="Each topic has a simple explanation, a deep dive, worked examples, practice problems and a quiz that tracks your weak spots.">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <li key={s.slug}>
              <Link href={`/learn/subjects/${s.slug}`} className="block h-full rounded-2xl border border-slate-200 p-6 hover:border-slate-400">
                <h2 className="text-lg font-medium tracking-tight text-ink">{s.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{s.blurb}</p>
                <p className="mt-4 text-xs text-slate-400">{s.groups.reduce((n, g) => n + g.topics.length, 0)} topics</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </PublicChrome>
  );
}
