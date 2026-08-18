import type { Metadata } from "next";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Projects — CAMUS Labs",
  description: "Real case studies from CAMUS Labs — the problem, the solution, and the results.",
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: caseStudies } = await supabase
    .from("case_studies")
    .select("slug, project_name, industry, problem, technology")
    .eq("is_published", true)
    .order("updated_at", { ascending: false });

  return (
    <PublicChrome>
      <Section
        eyebrow="Projects"
        heading="Real work, published as it ships."
        subheading="No placeholder logos, no invented results — every case study here is a project CAMUS Labs actually built."
        align="center"
      >
        {(!caseStudies || caseStudies.length === 0) && (
          <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 px-8 py-16 text-center">
            <ImageOff size={22} strokeWidth={1.5} className="text-slate-300" />
            <p className="text-base font-medium text-ink">Nothing published yet</p>
            <p className="text-sm leading-relaxed text-slate-500">
              The first case studies go live the moment a project ships. Want to be one of them?
            </p>
            <Button href="/start-project" size="sm">
              Start Your Project
            </Button>
          </div>
        )}

        {caseStudies && caseStudies.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((c) => (
              <Link key={c.slug} href={`/projects/${c.slug}`}>
                <Card className="h-full">
                  {c.industry && <Badge tone="signal">{c.industry}</Badge>}
                  <h3 className="mt-4 text-lg font-medium text-ink">{c.project_name}</h3>
                  {c.problem && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
                      {c.problem}
                    </p>
                  )}
                  {Array.isArray(c.technology) && c.technology.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {(c.technology as string[]).slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </PublicChrome>
  );
}
