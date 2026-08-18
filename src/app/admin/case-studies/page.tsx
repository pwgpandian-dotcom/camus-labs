import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default async function CaseStudiesPage() {
  const supabase = await createClient();
  const { data: caseStudies, error } = await supabase
    .from("case_studies")
    .select("id, slug, project_name, industry, is_published, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Case Studies"
        description="Published entries here appear on the public /projects page — nothing shows until it's real and marked published."
        action={
          <Button href="/admin/case-studies/new" size="sm">
            New case study
          </Button>
        }
      />

      {error && <EmptyState title="Couldn't load case studies" description={error.message} />}

      {!error && (!caseStudies || caseStudies.length === 0) && (
        <EmptyState
          title="No case studies yet"
          description="Create your first one once a real project is ready to show — the public page stays empty until then."
        />
      )}

      {caseStudies && caseStudies.length > 0 && (
        <div className="flex flex-col gap-3">
          {caseStudies.map((c) => (
            <Link
              key={c.id}
              href={`/admin/case-studies/${c.id}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-paper p-5 transition-colors hover:border-slate-400"
            >
              <div>
                <p className="text-sm font-medium text-ink">{c.project_name}</p>
                <p className="text-xs text-slate-400">{c.industry || "No industry set"}</p>
              </div>
              <Badge tone={c.is_published ? "success" : "neutral"}>
                {c.is_published ? "Published" : "Draft"}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
