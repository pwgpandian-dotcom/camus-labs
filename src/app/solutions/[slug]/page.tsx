import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { solutions, getSolution } from "@/lib/solutions";
import { industries } from "@/lib/industries";

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return { title: "Solutions — CAMUS Labs" };
  return {
    title: `${solution.title} — CAMUS Labs`,
    description: solution.summary,
  };
}

export default async function SolutionDetailPage({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  const related = industries.filter((i) => solution.relatedIndustries.includes(i.slug));

  return (
    <PublicChrome>
      <Section
        eyebrow="Solutions"
        heading={
          <span className="inline-flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-paper">
              <solution.icon size={24} strokeWidth={1.75} />
            </span>
            {solution.title}
          </span>
        }
        subheading={solution.overview}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-xs font-mono uppercase tracking-[0.1em] text-slate-400">
              What&apos;s included
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {solution.capabilities.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
                  <CheckCircle2 size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-signal" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <aside className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-mist p-6">
            {related.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.1em] text-slate-400">
                  Common in
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {related.map((i) => (
                    <Link key={i.slug} href={`/industries/${i.slug}`}>
                      <Badge tone="neutral" className="hover:bg-slate-200">
                        {i.name}
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
