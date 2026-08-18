import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";
import { DeleteCaseStudyButton } from "@/components/admin/DeleteCaseStudyButton";

export default async function EditCaseStudyPage({
  params,
}: PageProps<"/admin/case-studies/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: caseStudy, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !caseStudy) {
    return <EmptyState title="Case study not found" description={error?.message || ""} />;
  }

  return (
    <div>
      <PageHeader title={caseStudy.project_name} action={<DeleteCaseStudyButton id={caseStudy.id} />} />
      <CaseStudyForm existing={caseStudy} />
    </div>
  );
}
