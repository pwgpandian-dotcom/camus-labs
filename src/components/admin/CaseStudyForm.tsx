"use client";

import { useActionState } from "react";
import { upsertCaseStudy } from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";

const initialState: { success: boolean; error?: string } = { success: false };

type CaseStudy = {
  id: string;
  slug: string;
  project_name: string;
  industry: string | null;
  problem: string | null;
  solution: string | null;
  results: string | null;
  live_demo_url: string | null;
  features: unknown;
  technology: unknown;
  is_published: boolean;
};

export function CaseStudyForm({ existing }: { existing?: CaseStudy }) {
  const [state, formAction, pending] = useActionState(upsertCaseStudy, initialState);

  const featuresText = Array.isArray(existing?.features)
    ? (existing!.features as string[]).join("\n")
    : "";
  const technologyText = Array.isArray(existing?.technology)
    ? (existing!.technology as string[]).join(", ")
    : "";

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-paper p-6">
      {existing && <input type="hidden" name="id" value={existing.id} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-slate-500">Project name</label>
          <input
            name="project_name"
            required
            defaultValue={existing?.project_name}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Slug (URL)</label>
          <input
            name="slug"
            required
            pattern="[a-z0-9-]+"
            defaultValue={existing?.slug}
            placeholder="e.g. acme-booking-platform"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Industry</label>
          <input
            name="industry"
            defaultValue={existing?.industry ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Live demo URL</label>
          <input
            name="live_demo_url"
            type="url"
            defaultValue={existing?.live_demo_url ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">Problem</label>
        <textarea
          name="problem"
          rows={2}
          defaultValue={existing?.problem ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">Solution</label>
        <textarea
          name="solution"
          rows={2}
          defaultValue={existing?.solution ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">Results</label>
        <textarea
          name="results"
          rows={2}
          defaultValue={existing?.results ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-slate-500">Features (one per line)</label>
          <textarea
            name="features"
            rows={4}
            defaultValue={featuresText}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500">Technology (comma separated)</label>
          <textarea
            name="technology"
            rows={4}
            defaultValue={technologyText}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" name="is_published" defaultChecked={existing?.is_published} />
        Published (visible on the public /projects page)
      </label>

      {state.error && (
        <p className="rounded-lg bg-[#fbeae7] px-3.5 py-2.5 text-sm text-danger">{state.error}</p>
      )}
      {state.success && <p className="text-sm text-success">Saved.</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : existing ? "Save changes" : "Create case study"}
      </Button>
    </form>
  );
}
