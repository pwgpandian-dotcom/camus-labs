import Link from "next/link";
import { requireLearner, isMinor } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { Notice, PageHeader, Panel, Progress } from "@/components/learn/ui";
import { FOUNDER_STAGES } from "@/lib/learn/catalog/founder";
import { NewWorkspace } from "./NewWorkspace";

export const metadata = { title: "Founder mode" };

export default async function FounderPage() {
  const { supabase, user, profile } = await requireLearner();
  if (isMinor(profile)) {
    return (
      <Page width="narrow">
        <PageHeader title="Founder mode" />
        <Notice>Founder Mode is for learners aged 18 and over. You can still explore entrepreneurship careers and ask the assistant about how businesses work.</Notice>
      </Page>
    );
  }
  const { data: workspaces } = await supabase.from("learn_founder_workspaces").select("id, title, stages, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false });

  return (
    <Page>
      <PageHeader eyebrow="Founder mode" title="Turn an idea into a business" description="Idea → problem → customer → research → competitors → value proposition → MVP → architecture → landing page → pricing → launch → marketing → iteration. One workspace per idea, with an AI coach at every step." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <NewWorkspace />
        </Panel>
        <Panel>
          <h2 className="text-[15px] font-semibold text-ink">Your workspaces</h2>
          {(workspaces ?? []).length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No workspaces yet.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-1">
              {workspaces!.map((w) => {
                const filled = FOUNDER_STAGES.filter((s) => ((w.stages as Record<string, string>)[s.key] ?? "").trim().length > 0).length;
                return (
                  <li key={w.id}>
                    <Link href={`/app/founder/${w.id}`} className="block rounded-lg px-2 py-2.5 hover:bg-slate-50">
                      <span className="block truncate text-sm text-ink">{w.title}</span>
                      <Progress value={(filled / FOUNDER_STAGES.length) * 100} className="mt-2" label={`${w.title} completion`} />
                      <span className="mt-1 block text-xs text-slate-400">{filled}/{FOUNDER_STAGES.length} stages</span>
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
