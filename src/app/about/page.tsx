import type { Metadata } from "next";
import { Layers, ShieldCheck, Sparkles, Users } from "lucide-react";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { CTA } from "@/components/sections/CTA";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About — CAMUS Labs",
  description:
    "CAMUS Labs is a technology partner that designs, builds and launches AI-powered software platforms for businesses, startups, creators and ambitious ideas.",
};

const principles = [
  {
    icon: Layers,
    title: "One team, start to finish",
    desc: "The same team that scopes your project designs, builds and launches it — no handoffs between a sales team and a delivery team you never meet.",
  },
  {
    icon: Sparkles,
    title: "AI where it earns its place",
    desc: "We reach for AI when it genuinely improves the product or the workflow, not because every pitch needs an AI slide.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing fabricated",
    desc: "No placeholder client logos, invented testimonials or made-up statistics anywhere on this site — what you see here is real, published the moment it ships.",
  },
  {
    icon: Users,
    title: "Built to be handed off",
    desc: "Every platform we build ships with clear ownership and documentation, so it's never held hostage by needing us to keep running it.",
  },
];

export default function AboutPage() {
  return (
    <PublicChrome>
      <Section
        eyebrow="About"
        heading="Technology for Every Idea."
        subheading="CAMUS Labs is a technology partner for businesses, startups, creators and ambitious ideas — we design, build and launch AI-powered software platforms end to end, from the first conversation through to launch and support."
        align="center"
      />

      <Section eyebrow="Mission &amp; approach" heading="Software that's actually finished.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <p className="text-xs font-mono uppercase tracking-[0.1em] text-slate-400">Mission</p>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              To give businesses, startups, creators and ambitious ideas access to the kind of
              engineering that used to require an in-house team — real architecture, real AI
              capability, and real ownership of the outcome, not just the build.
            </p>
          </Card>
          <Card>
            <p className="text-xs font-mono uppercase tracking-[0.1em] text-slate-400">Vision</p>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              A world where a good idea doesn&apos;t stall for lack of technical execution — where
              the gap between &quot;we have a plan&quot; and &quot;it&apos;s live and working&quot; is measured in weeks
              of focused building, not months of miscommunication.
            </p>
          </Card>
        </div>
      </Section>

      <Section eyebrow="How we work" heading="Principles we hold ourselves to." className="bg-mist">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="border-t border-slate-200 pt-5">
              <p.icon size={22} strokeWidth={1.75} className="text-signal" />
              <h3 className="mt-3 text-lg font-medium text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Leadership">
        <Card className="max-w-xl">
          <p className="text-xs font-mono uppercase tracking-[0.1em] text-slate-400">
            Founder-led
          </p>
          <h3 className="mt-3 text-lg font-medium text-ink">{siteConfig.founderName}</h3>
          <p className="text-sm text-slate-400">{siteConfig.founderTitle}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            CAMUS Labs is founder-led — {siteConfig.founderName} works directly with every
            client, from the first conversation through scoping, delivery and launch. As the
            team grows, that same directness stays the standard.
          </p>
        </Card>
      </Section>

      <CTA />
    </PublicChrome>
  );
}
