import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("case_studies")
    .select("project_name, problem")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!data) return { title: "Project — CAMUS Labs" };
  return {
    title: `${data.project_name} — CAMUS Labs`,
    description: data.problem || undefined,
  };
}

export default async function ProjectDetailPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: c } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!c) notFound();

  return (
    <PublicChrome>
      <Section align="left" eyebrow={c.industry || "Case study"} heading={c.project_name}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="flex flex-col gap-8 lg:col-span-2">
            {c.problem && (
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.1em] text-slate-400">
                  The problem
                </p>
                <p className="mt-2 text-base leading-relaxed text-slate-600">{c.problem}</p>
              </div>
            )}
            {c.solution && (
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.1em] text-slate-400">
                  The solution
                </p>
                <p className="mt-2 text-base leading-relaxed text-slate-600">{c.solution}</p>
              </div>
            )}
            {c.results && (
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.1em] text-slate-400">
                  Results
                </p>
                <p className="mt-2 text-base leading-relaxed text-slate-600">{c.results}</p>
              </div>
            )}
            {Array.isArray(c.features) && c.features.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.1em] text-slate-400">
                  Key features
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {(c.features as string[]).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-signal" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-mist p-6">
            {Array.isArray(c.technology) && c.technology.length > 0 && (
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.1em] text-slate-400">
                  Technology
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(c.technology as string[]).map((t) => (
                    <Badge key={t} tone="neutral">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {c.live_demo_url && (
              <Button href={c.live_demo_url} variant="secondary" size="sm">
                View live
              </Button>
            )}
            <Button href="/start-project" size="sm">
              Start something similar
            </Button>
          </aside>
        </div>
      </Section>
    </PublicChrome>
  );
}
