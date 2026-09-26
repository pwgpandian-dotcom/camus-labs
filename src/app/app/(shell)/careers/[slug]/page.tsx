import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Target } from "lucide-react";
import { requireLearner } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { PageHeader } from "@/components/learn/ui";
import { Button } from "@/components/ui/Button";
import { CareerDetail } from "@/components/learn/CareerDetail";
import { getCareer } from "@/lib/learn/catalog/careers";
import { setTargetRole } from "@/app/actions/learn/roadmap";

export async function generateMetadata({ params }: PageProps<"/app/careers/[slug]">) {
  const { slug } = await params;
  return { title: getCareer(slug)?.title ?? "Career" };
}

export default async function CareerPage({ params }: PageProps<"/app/careers/[slug]">) {
  const { slug } = await params;
  const career = getCareer(slug);
  if (!career) notFound();
  const { profile } = await requireLearner();
  const isTarget = profile?.target_role?.toLowerCase() === career.title.toLowerCase();

  return (
    <Page>
      <Link href="/app/careers" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-ink">
        <ArrowLeft size={14} /> All careers
      </Link>
      <PageHeader
        eyebrow={career.category}
        title={career.title}
        description={career.summary}
        actions={
          <>
            {isTarget ? (
              <Button href={`/app/roadmaps/${career.slug}`} size="sm">
                <Target size={14} /> Open my roadmap
              </Button>
            ) : (
              <form action={setTargetRole.bind(null, career.slug)}>
                <Button type="submit" size="sm">
                  <Target size={14} /> Set as my target
                </Button>
              </form>
            )}
            <Button href={`/app/assistant?mode=career&q=${encodeURIComponent(`Is ${career.title} a good fit for me? Compare it with my profile and tell me the first three things to do.`)}`} variant="secondary" size="sm">
              <Sparkles size={14} /> Is this right for me?
            </Button>
          </>
        }
      />
      <CareerDetail career={career} linkBase="/app/careers" userSkills={profile?.skills ?? []} />
    </Page>
  );
}
