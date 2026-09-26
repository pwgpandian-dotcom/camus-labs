import type { Metadata } from "next";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Markdown } from "@/components/learn/Markdown";
import { academy } from "@/lib/learn/catalog/academy";

export const metadata: Metadata = {
  title: "AI Productivity Academy — prompting, AI coding, agents & MCP | Camus Learn",
  description: "Free lessons on using AI responsibly for learning, coding, research and work: prompting, context, AI-assisted coding, agents, MCP concepts and responsible use.",
  alternates: { canonical: "/learn/academy" },
};

export default function PublicAcademyPage() {
  return (
    <PublicChrome>
      <Section eyebrow="AI Productivity Academy" heading="Use AI well" subheading="Short, practical lessons you can read here. Sign in to track progress and practise with the assistant. Named tools are third-party products; Camus is not affiliated with their makers.">
        <div className="flex flex-col gap-12">
          {academy.map((c) => (
            <section key={c.slug} id={c.slug} className="scroll-mt-24">
              <p className="text-xs text-slate-400">{c.level} · {c.lessons.length} lessons</p>
              <h2 className="mt-1 text-2xl font-medium tracking-tight text-ink">{c.title}</h2>
              <p className="mt-1 max-w-2xl text-slate-500">{c.summary}</p>
              <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {c.lessons.map((l) => (
                  <article key={l.slug} className="rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-lg font-medium tracking-tight text-ink">{l.title}</h3>
                    <Markdown content={l.body} className="mt-3" />
                  </article>
                ))}
              </div>
            </section>
          ))}
          <div><Button href="/login?redirect=/app&mode=sign-up" size="lg">Practise with Camus free</Button></div>
        </div>
      </Section>
    </PublicChrome>
  );
}
