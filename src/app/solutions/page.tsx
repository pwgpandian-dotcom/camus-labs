import type { Metadata } from "next";
import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { solutions } from "@/lib/solutions";

export const metadata: Metadata = {
  title: "Solutions — CAMUS Labs",
  description:
    "What CAMUS Labs builds — AI agents, software platforms, web & mobile apps, e-commerce, business automation, SaaS products and digital transformation.",
};

export default function SolutionsPage() {
  return (
    <PublicChrome>
      <Section
        eyebrow="Solutions"
        heading="Solutions built around your business, not our template."
        subheading="Seven ways CAMUS Labs turns an idea or an operational gap into working software — pick the one closest to what you need, or start a project and we'll figure out the shape together."
        align="center"
      >
        <div className="grid grid-cols-1 divide-y divide-slate-200 border-y border-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-3">
          {solutions.map((s, i) => (
            <Link
              key={s.slug}
              href={`/solutions/${s.slug}`}
              className={`group flex flex-col justify-between p-8 transition-colors hover:bg-mist ${
                i >= 4 ? "md:border-t md:border-slate-200" : ""
              }`}
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-paper">
                  <s.icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.summary}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-signal opacity-0 transition-opacity group-hover:opacity-100">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </PublicChrome>
  );
}
