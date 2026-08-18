import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { industries } from "@/lib/industries";

export function Industries() {
  return (
    <Section
      eyebrow="Industries"
      heading="Domain-aware engineering, across every sector."
      subheading="We build for the specific realities of your industry — compliance in FinTech, catalog complexity in retail, latency in booking systems, and everything in between."
    >
      <div className="flex flex-wrap gap-3">
        {industries.map((industry) => (
          <Link
            key={industry.slug}
            href={`/industries/${industry.slug}`}
            className="flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm text-slate-600 transition-colors hover:border-ink hover:text-ink"
          >
            <industry.icon size={16} strokeWidth={1.75} className="text-slate-400" />
            {industry.name}
          </Link>
        ))}
      </div>
    </Section>
  );
}
