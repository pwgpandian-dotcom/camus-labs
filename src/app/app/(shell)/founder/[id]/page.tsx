import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { requireLearner, isMinor } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { PageHeader } from "@/components/learn/ui";
import { aiAvailable } from "@/lib/learn/ai/service";
import { deleteWorkspace } from "@/app/actions/learn/founder";
import { FounderWorkspace } from "./FounderWorkspace";

export const metadata = { title: "Founder workspace" };

export default async function WorkspacePage({ params }: PageProps<"/app/founder/[id]">) {
  const { id } = await params;
  const { supabase, profile } = await requireLearner();
  if (isMinor(profile)) redirect("/app/founder");
  const { data: ws } = await supabase.from("learn_founder_workspaces").select("*").eq("id", id).maybeSingle();
  if (!ws) notFound();

  return (
    <Page>
      <Link href="/app/founder" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-ink">
        <ArrowLeft size={14} /> Founder mode
      </Link>
      <PageHeader eyebrow="Founder workspace" title={ws.title} />
      <FounderWorkspace id={ws.id} initial={(ws.stages as Record<string, string>) ?? {}} aiReady={aiAvailable()} />
      <form action={deleteWorkspace.bind(null, ws.id)} className="mt-8">
        <button type="submit" className="inline-flex items-center gap-1.5 text-sm text-danger hover:underline"><Trash2 size={14} /> Delete workspace</button>
      </form>
    </Page>
  );
}
