import Link from "next/link";
import { requireLearner } from "@/lib/learn/server";
import { aiAvailable } from "@/lib/learn/ai/service";
import { Page } from "@/components/learn/Page";
import { Notice, PageHeader, Panel } from "@/components/learn/ui";
import { JobForm } from "./JobForm";

export const metadata = { title: "Job match" };

export default async function JobsPage() {
  const { supabase, user } = await requireLearner();
  const [{ data: analyses }, { data: resumes }] = await Promise.all([
    supabase.from("learn_job_analyses").select("id, title, company, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30),
    supabase.from("learn_resumes").select("id, title").eq("user_id", user.id).order("updated_at", { ascending: false }),
  ]);

  return (
    <Page>
      <PageHeader
        eyebrow="Job description analyzer"
        title="Match yourself to a job"
        description="Paste a real job post. You'll get the required skills, what you already match, honest gaps, resume improvements and what to prepare for the interview."
      />
      {!aiAvailable() && <Notice tone="warning" className="mb-6">AI isn&apos;t configured yet, so analysis is unavailable until an administrator adds a provider key.</Notice>}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <JobForm resumes={resumes ?? []} />
        </Panel>
        <aside>
          <Panel>
            <h2 className="text-[15px] font-semibold text-ink">Previous analyses</h2>
            {(analyses ?? []).length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">Your job alignment reports will appear here.</p>
            ) : (
              <ul className="mt-3 flex flex-col">
                {analyses!.map((a) => (
                  <li key={a.id}>
                    <Link href={`/app/jobs/${a.id}`} className="block rounded-lg px-2 py-2 hover:bg-slate-50">
                      <span className="block truncate text-sm text-ink">{a.title || "Untitled role"}{a.company ? ` · ${a.company}` : ""}</span>
                      <span className="text-xs text-slate-400">{new Date(a.created_at).toLocaleDateString("en", { day: "numeric", month: "short" })}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <p className="mt-4 px-1 text-xs leading-relaxed text-slate-400">
            No tool can guarantee an ATS result or a job offer. This report shows alignment and preparation — the decisions are made by people and each employer&apos;s own systems.
          </p>
        </aside>
      </div>
    </Page>
  );
}
