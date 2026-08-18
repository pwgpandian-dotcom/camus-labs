import Link from "next/link";
import { ImageOff, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const placeholderFields = [
  { label: "Industry", value: "—" },
  { label: "Problem", value: "What the client was facing" },
  { label: "Solution", value: "What CAMUS Labs built" },
  { label: "Results", value: "Measured outcome, once shipped" },
];

export async function FeaturedProjects() {
  const supabase = await createClient();
  const { data: caseStudies } = await supabase
    .from("case_studies")
    .select("slug, project_name, industry, problem, technology")
    .eq("is_published", true)
    .order("updated_at", { ascending: false })
    .limit(3);

  const hasReal = caseStudies && caseStudies.length > 0;

  return (
    <Section
      eyebrow="Featured projects"
      heading={hasReal ? "Real work, shipped by CAMUS Labs." : "Our case studies are just getting started."}
      subheading={
        hasReal
          ? "A sample of what we've built recently — the problem, the solution, and the technology behind it."
          : "Every CAMUS Labs project — yours included — gets documented the same rigorous way: the problem, the solution, the technology, and the real, measured results. Here's the format. The first case studies go live as projects launch."
      }
    >
      {hasReal ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {caseStudies!.map((c) => (
            <Link key={c.slug} href={`/projects/${c.slug}`}>
              <Card className="flex h-full flex-col justify-between">
                <div>
                  {c.industry && <Badge tone="signal">{c.industry}</Badge>}
                  <h3 className="mt-4 text-base font-medium text-ink">{c.project_name}</h3>
                  {c.problem && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
                      {c.problem}
                    </p>
                  )}
                </div>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-signal">
                  View case study <ArrowUpRight size={14} strokeWidth={2} />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-dashed" hover={false}>
              <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-50">
                <ImageOff size={22} strokeWidth={1.5} className="text-slate-300" />
              </div>
              <Badge tone="neutral" className="mt-5">Case study format</Badge>
              <h3 className="mt-4 text-base font-medium text-slate-300">
                Project name appears here
              </h3>
              <dl className="mt-5 flex flex-col gap-3">
                {placeholderFields.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs font-mono uppercase tracking-[0.08em] text-slate-400">
                      {f.label}
                    </dt>
                    <dd className="mt-0.5 text-sm text-slate-300">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-mist p-8 md:flex-row md:items-center md:justify-between">
        <p className="max-w-md text-sm leading-relaxed text-slate-600">
          Want your project to be one of our first published case studies?
        </p>
        <Button href="/start-project" variant="primary" size="md">
          Start Your Project
        </Button>
      </div>
    </Section>
  );
}
