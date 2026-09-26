import type { Metadata } from "next";
import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { careersByCategory } from "@/lib/learn/catalog/careers";

export const metadata: Metadata = {
  title: "Career guides — skills, roadmaps & interview topics | Camus Learn",
  description: "Free career guides for software, AI, data, cybersecurity, product, design, finance, healthcare, law, business and more — with skills, roadmaps, projects and interview topics.",
  alternates: { canonical: "/learn/careers" },
};

export default function CareerGuidesPage() {
  return (
    <PublicChrome>
      <Section eyebrow="Career guides" heading="Explore careers" subheading="Honest, country-neutral guides: what the work is, how people get in, the skills to build and how to prepare. No “best career” rankings — just what you need to decide for yourself.">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {careersByCategory().map((g) => (
            <section key={g.category}>
              <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-slate-400">{g.category}</h2>
              <ul className="mt-3 flex flex-col gap-1">
                {g.careers.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/learn/careers/${c.slug}`} className="block rounded-xl px-3 py-2.5 hover:bg-slate-50">
                      <span className="block text-[15px] font-medium text-ink">{c.title}</span>
                      <span className="block text-sm text-slate-500">{c.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>
    </PublicChrome>
  );
}
