import { requireLearner } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { PageHeader } from "@/components/learn/ui";
import { careers, CAREER_CATEGORIES } from "@/lib/learn/catalog/careers";
import { CareerExplorer } from "./CareerExplorer";

export const metadata = { title: "Career explorer" };

export default async function CareersPage() {
  const { profile } = await requireLearner();
  return (
    <Page>
      <PageHeader
        eyebrow="Career discovery"
        title="Explore careers"
        description="There's no single “best” career — only the one that fits your goals. Compare roles side by side against your own skills and interests."
      />
      <CareerExplorer
        careers={careers.map((c) => ({ slug: c.slug, title: c.title, category: c.category, summary: c.summary, entry: c.entry, skills: c.skills, education: c.education[0], firstSteps: c.roadmap.slice(0, 3).map((s) => s.title) }))}
        categories={[...CAREER_CATEGORIES]}
        userSkills={profile?.skills ?? []}
        targetRole={profile?.target_role ?? ""}
      />
    </Page>
  );
}
