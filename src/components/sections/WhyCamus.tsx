import { BrainCircuit, Route, Eye, TrendingUp } from "lucide-react";
import { Section } from "@/components/ui/Section";

const reasons = [
  {
    icon: BrainCircuit,
    title: "AI-first engineering",
    desc: "We design with AI as a core capability, not a bolt-on feature added at the end.",
  },
  {
    icon: Route,
    title: "End-to-end delivery",
    desc: "One partner from idea and architecture through build, launch and support.",
  },
  {
    icon: Eye,
    title: "Transparent process",
    desc: "Every milestone, file and update is visible in your own client portal.",
  },
  {
    icon: TrendingUp,
    title: "Built to scale",
    desc: "Architecture decisions made for where your product is going, not just where it starts.",
  },
];

export function WhyCamus() {
  return (
    <Section eyebrow="Why CAMUS Labs" heading="A technology partner, not a vendor.">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
        {reasons.map((r) => (
          <div key={r.title} className="border-t border-slate-200 pt-5">
            <r.icon size={22} strokeWidth={1.75} className="text-signal" />
            <h3 className="mt-3 text-lg font-medium text-ink">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{r.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
