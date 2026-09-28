import { notFound } from "next/navigation";
import { requireLearner } from "@/lib/learn/server";
import { resumeDataSchema } from "@/lib/learn/schemas";
import { aiAvailable } from "@/lib/learn/ai/service";
import { ResumeEditor } from "./ResumeEditor";

export const metadata = { title: "Edit resume" };

export default async function ResumeEditPage({ params }: PageProps<"/app/resume/[id]">) {
  const { id } = await params;
  const { supabase, profile } = await requireLearner();
  const [{ data: resume }, { data: versions }, { data: analyses }] = await Promise.all([
    supabase.from("learn_resumes").select("*").eq("id", id).maybeSingle(),
    supabase.from("learn_resume_versions").select("id, note, created_at").eq("resume_id", id).order("created_at", { ascending: false }).limit(20),
    supabase.from("learn_job_analyses").select("id, title, company, report").not("report", "is", null).order("created_at", { ascending: false }).limit(10),
  ]);
  if (!resume) notFound();
  const data = resumeDataSchema.parse(resume.data ?? {});

  return (
    <ResumeEditor
      id={resume.id}
      initialTitle={resume.title}
      initialTemplate={resume.template}
      initialData={data}
      versions={(versions ?? []).map((v) => ({ id: v.id, note: v.note, createdAt: v.created_at }))}
      analyses={(analyses ?? []).map((a) => ({
        id: a.id,
        label: [a.title, a.company].filter(Boolean).join(" · ") || "Job description",
        improvements: ((a.report as { resumeImprovements?: string[] })?.resumeImprovements ?? []).slice(0, 8),
        missing: ((a.report as { missingSkills?: string[] })?.missingSkills ?? []).slice(0, 12),
        keywords: ((a.report as { keywords?: string[] })?.keywords ?? []).slice(0, 20),
      }))}
      targetRole={profile?.target_role ?? ""}
      aiReady={aiAvailable()}
    />
  );
}
