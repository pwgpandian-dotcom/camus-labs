import { PageHeader } from "@/components/admin/PageHeader";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";

export default function NewCaseStudyPage() {
  return (
    <div>
      <PageHeader title="New case study" />
      <CaseStudyForm />
    </div>
  );
}
