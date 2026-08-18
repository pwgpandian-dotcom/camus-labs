import { Section } from "@/components/ui/Section";

const steps = [
  { n: "01", title: "Discover", desc: "You tell us what you're building, in your words." },
  { n: "02", title: "Consultation", desc: "We scope the idea together and align on approach." },
  { n: "03", title: "Proposal", desc: "You receive a clear plan, timeline and estimate." },
  { n: "04", title: "Build", desc: "We build in transparent milestones, visible in your portal." },
  { n: "05", title: "Launch", desc: "We deploy, support, and help you grow from there." },
];

export function HowItWorks() {
  return (
    <Section
      eyebrow="How it works"
      heading="From idea to launch, without the guesswork."
    >
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
        {steps.map((step) => (
          <div key={step.n} className="relative">
            <p className="font-mono text-sm text-slate-300">{step.n}</p>
            <h3 className="mt-3 text-base font-medium text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
