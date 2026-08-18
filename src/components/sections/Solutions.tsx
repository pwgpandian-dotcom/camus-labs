import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { solutions } from "@/lib/solutions";

export function Solutions() {
  return (
    <Section
      eyebrow="Solutions"
      heading="Solutions built around your business, not our template."
      className="bg-mist"
    >
      <div className="grid grid-cols-1 divide-y divide-slate-200 border-y border-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-3">
        {solutions.map((s, i) => (
          <Link
            key={s.slug}
            href={`/solutions/${s.slug}`}
            className={`group flex flex-col justify-between p-8 transition-colors hover:bg-paper ${
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
  );
}
