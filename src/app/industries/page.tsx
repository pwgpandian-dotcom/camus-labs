import type { Metadata } from "next";
import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { industries } from "@/lib/industries";

export const metadata: Metadata = {
  title: "Industries — CAMUS Labs",
  description:
    "Domain-aware engineering across FinTech, Banking, E-commerce, Food & Restaurants, Education, Real Estate, Fashion, Creators, Retail, Travel, Professional Services and Startups.",
};

export default function IndustriesPage() {
  return (
    <PublicChrome>
      <Section
        eyebrow="Industries"
        heading="Domain-aware engineering, across every sector."
        subheading="We build for the specific realities of your industry — compliance in FinTech, catalog complexity in retail, latency in booking systems, and everything in between."
        align="center"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <Link
              key={industry.slug}
              href={`/industries/${industry.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-slate-200 p-6 transition-colors hover:border-ink hover:bg-mist"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-paper">
                <industry.icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-medium text-ink">{industry.name}</h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
                {industry.overview}
              </p>
              <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-signal opacity-0 transition-opacity group-hover:opacity-100">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </PublicChrome>
  );
}
