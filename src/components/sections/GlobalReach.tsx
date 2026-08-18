import { Building2, Rocket, Globe2, UserRound } from "lucide-react";
import { Section } from "@/components/ui/Section";

const audiences = [
  { icon: Building2, title: "Indian Enterprises", desc: "Established businesses modernizing operations with custom software." },
  { icon: Rocket, title: "Indian Startups", desc: "Founders building their first product with an engineering partner they can trust." },
  { icon: Globe2, title: "International Founders", desc: "Global founders who need a serious technology team without the overhead." },
  { icon: UserRound, title: "Creators & Professionals", desc: "Individuals building a platform, brand or product around their work." },
];

export function GlobalReach() {
  return (
    <Section
      eyebrow="Who we build for"
      heading="Credible to a small founder today. Ready for an enterprise tomorrow."
      subheading="CAMUS Labs is built to work the same way for a solo creator's first platform and an enterprise's next major system."
      className="bg-mist"
    >
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        {audiences.map((a) => (
          <div key={a.title} className="bg-paper p-7">
            <a.icon size={22} strokeWidth={1.75} className="text-signal" />
            <h3 className="mt-4 text-base font-medium text-ink">{a.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{a.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
