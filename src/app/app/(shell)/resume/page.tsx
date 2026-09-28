import Link from "next/link";
import { Copy, FileText, Plus } from "lucide-react";
import { requireLearner } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { EmptyState, Notice, PageHeader } from "@/components/learn/ui";
import { SubmitButton } from "@/components/learn/Forms";
import { createResume, duplicateResume } from "@/app/actions/learn/resume";

export const metadata = { title: "Resume builder" };

export default async function ResumesPage({ searchParams }: PageProps<"/app/resume">) {
  const sp = await searchParams;
  const { supabase, user } = await requireLearner();
  const { data: resumes } = await supabase.from("learn_resumes").select("id, title, template, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false });

  return (
    <Page>
      <PageHeader
        eyebrow="Resume builder"
        title="Your resumes"
        description="ATS-friendly resumes built from your Career Twin. The AI helps you phrase what you've really done — it never invents experience, employers, degrees or results."
        actions={
          <form action={createResume}>
            <SubmitButton>
              <Plus size={16} /> New resume
            </SubmitButton>
          </form>
        }
      />
      {sp.error && <Notice tone="danger" className="mb-4">Couldn&apos;t create the resume. Please try again.</Notice>}
      {(resumes ?? []).length === 0 ? (
        <EmptyState
          icon={<FileText size={20} />}
          title="No resumes yet"
          description="We'll start you off with the education, experience, certifications and completed projects already in your Career Twin."
          action={
            <form action={createResume}>
              <SubmitButton>Create my first resume</SubmitButton>
            </form>
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resumes!.map((r) => (
            <li key={r.id} className="flex flex-col rounded-2xl border border-slate-200 bg-paper p-5">
              <Link href={`/app/resume/${r.id}`} className="text-[15px] font-semibold text-ink hover:underline">{r.title}</Link>
              <p className="mt-1 text-xs capitalize text-slate-400">
                {r.template} template · updated {new Date(r.updated_at).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}
              </p>
              <div className="mt-4 flex gap-2">
                <Link href={`/app/resume/${r.id}`} className="inline-flex min-h-9 items-center rounded-full bg-ink px-4 text-[13px] font-medium text-paper">Edit</Link>
                <form action={duplicateResume.bind(null, r.id)}>
                  <button type="submit" className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-[13px] text-slate-600 hover:border-slate-400">
                    <Copy size={13} /> Duplicate
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}
