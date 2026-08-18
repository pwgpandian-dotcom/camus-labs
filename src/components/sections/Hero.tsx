import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroVisual } from "./HeroVisual";

const chips = [
  "AI Applications",
  "AI Agents",
  "SaaS Platforms",
  "Mobile Apps",
  "FinTech",
  "E-commerce",
  "Booking Platforms",
  "Business Systems",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,var(--color-slate-100)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-slate-100)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_10%,transparent_75%)]"
      />

      <Container className="relative flex items-center justify-between gap-12 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-[720px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-paper px-3.5 py-1.5 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            Global technology partner for ambitious ideas
          </div>

          <h1 className="text-balance text-5xl md:text-6xl lg:text-[5rem] font-medium tracking-tight leading-[1.02] text-ink">
            Technology for
            <br />
            Every Idea.
          </h1>

          <p className="mt-7 max-w-[560px] text-lg md:text-xl leading-relaxed text-slate-500">
            We design, build and launch AI-powered software platforms for
            businesses, startups, creators and ambitious ideas worldwide.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="/start-project" size="lg">
              Start Your Project
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Book a Consultation
            </Button>
          </div>

          <div className="mt-14">
            <p className="mb-4 text-xs font-mono uppercase tracking-[0.14em] text-slate-400">
              What we build
            </p>
            <div className="flex flex-wrap gap-2.5">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-slate-200 bg-paper px-3.5 py-1.5 text-sm text-slate-600"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <HeroVisual />
      </Container>
    </section>
  );
}
