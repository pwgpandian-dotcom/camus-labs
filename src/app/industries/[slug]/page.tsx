import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { industries, getIndustry } from "@/lib/industries";
import { solutions } from "@/lib/solutions";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return { title: "Industries — CAMUS Labs" };
  return {
    title: `${industry.name} — CAMUS Labs`,
    description: industry.overview,
  };
}

export default async function IndustryDetailPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const related = solutions.filter((s) => industry.relatedSolutions.includes(s.slug));

  return (
    <PublicChrome>
      <Section
        eyebrow="Industries"
        heading={
          <span className="inline-flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-paper">
              <industry.icon size={24} strokeWidth={1.75} />
            </span>
            {industry.name}
          </span>
        }
        subheading={industry.overview}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-xs font-mono uppercase tracking-[0.1em] text-slate-400">
              What we design around
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {industry.focusAreas.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
                  <CheckCircle2 size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-signal" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <aside className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-mist p-6">
            {related.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.1em] text-slate-400">
                  Relevant solutions
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {related.map((s) => (
                    <Link key={s.slug} href={`/solutions/${s.slug}`}>
                      <Badge tone="neutral" className="hover:bg-slate-200">
                        {s.title}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Button href="/start-project" size="sm">
                Start Your Project
              </Button>
              <Button href="/contact" variant="secondary" size="sm">
                Book a Consultation
              </Button>
            </div>
          </aside>
        </div>
      </Section>
    </PublicChrome>
  );
}
