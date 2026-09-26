import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getSubject, subjects } from "@/lib/learn/catalog/subjects";

export function generateStaticParams() {
  return subjects.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/subjects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getSubject(slug);
  if (!s) return {};
  return {
    title: `${s.name} — topics, lessons & practice with an AI tutor | Camus Learn`,
    description: `${s.blurb} Topics include ${s.groups.flatMap((g) => g.topics).slice(0, 6).join(", ")} and more.`,
    alternates: { canonical: `/learn/subjects/${s.slug}` },
  };
}

export default async function PublicSubjectPage({ params }: PageProps<"/learn/subjects/[slug]">) {
  const { slug } = await params;
  const subject = getSubject(slug);
  if (!subject) notFound();
  return (
    <PublicChrome>
      <Section eyebrow="Subject" heading={subject.name} subheading={subject.blurb}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {subject.groups.map((g) => (
            <section key={g.name}>
              <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-slate-400">{g.name}</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {g.topics.map((t) => (
                  <li key={t} className="text-[15px] text-ink">{t}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="mt-12">
          <Button href="/login?redirect=/app&mode=sign-up" size="lg">Start learning {subject.name} free</Button>
        </div>
      </Section>
    </PublicChrome>
  );
}
