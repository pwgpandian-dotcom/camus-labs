import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicChrome } from "@/components/PublicChrome";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CareerDetail } from "@/components/learn/CareerDetail";
import { careers, getCareer } from "@/lib/learn/catalog/careers";

export function generateStaticParams() {
  return careers.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCareer(slug);
  if (!c) return {};
  const title = `How to become a ${c.title}: skills, roadmap & interview topics | Camus Learn`;
  return { title, description: c.summary, alternates: { canonical: `/learn/careers/${c.slug}` }, openGraph: { title, description: c.summary, type: "article" } };
}

export default async function PublicCareerPage({ params }: PageProps<"/learn/careers/[slug]">) {
  const { slug } = await params;
  const career = getCareer(slug);
  if (!career) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Occupation",
    name: career.title,
    description: career.overview,
    skills: career.skills.join(", "),
    occupationalCategory: career.category,
  };

  return (
    <PublicChrome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="border-b border-slate-200 bg-mist">
        <Container className="py-12 md:py-16">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-signal">{career.category} · Career guide</p>
          <h1 className="mt-3 text-balance text-4xl font-medium tracking-tight text-ink md:text-5xl">{career.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-500">{career.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`/login?redirect=/app&mode=sign-up`} size="lg">Start this roadmap free</Button>
            <Button href="/learn/careers" variant="secondary" size="lg">All careers</Button>
          </div>
        </Container>
      </div>
      <Container className="py-10 md:py-14">
        <CareerDetail career={career} linkBase="/learn/careers" />
      </Container>
    </PublicChrome>
  );
}
