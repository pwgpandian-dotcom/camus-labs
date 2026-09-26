import Link from "next/link";
import { requireLearner } from "@/lib/learn/server";
import { aiAvailable } from "@/lib/learn/ai/service";
import { Page } from "@/components/learn/Page";
import { Notice, PageHeader, Panel } from "@/components/learn/ui";
import { StartInterview } from "./StartInterview";

export const metadata = { title: "Interview coach" };

export default async function InterviewPage({ searchParams }: PageProps<"/app/interview">) {
  const sp = await searchParams;
  const { supabase, user, profile } = await requireLearner();
  const { data: sessions } = await supabase
    .from("learn_interviews")
    .select("id, mode, target_role, status, feedback, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);
  const role = (typeof sp.role === "string" && sp.role) || profile?.target_role || "";

  return (
    <Page>
      <PageHeader eyebrow="Interview coach" title="Practise interviews" description="Five questions, one at a time, like the real thing. Then detailed feedback on quality, structure and relevance — with stronger versions of your own answers." />
      {!aiAvailable() && <Notice tone="warning" className="mb-6">AI isn&apos;t configured yet, so the interviewer is unavailable.</Notice>}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <StartInterview defaultRole={role} />
        </Panel>
        <Panel>
          <h2 className="text-[15px] font-semibold text-ink">History</h2>
          {(sessions ?? []).length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Your practice sessions and feedback will be saved here.</p>
          ) : (
            <ul className="mt-3 flex flex-col">
              {sessions!.map((s) => {
                const scores = (s.feedback as { scores?: Record<string, number> } | null)?.scores;
                const avg = scores ? (Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length).toFixed(1) : null;
                return (
                  <li key={s.id}>
                    <Link href={`/app/interview/${s.id}`} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-ink">{s.target_role}</span>
                        <span className="text-xs capitalize text-slate-400">{s.mode.replace("_", " ")} · {new Date(s.created_at).toLocaleDateString("en", { day: "numeric", month: "short" })}</span>
                      </span>
                      <span className="shrink-0 text-xs tabular-nums text-slate-500">{s.status === "completed" ? (avg ? `${avg}/5` : "Done") : "In progress"}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </Page>
  );
}
