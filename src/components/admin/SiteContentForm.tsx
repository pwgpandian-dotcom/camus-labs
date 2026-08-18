"use client";

import { useActionState } from "react";
import { upsertSiteContent } from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";

const initialState: { success: boolean; error?: string } = { success: false };

export function SiteContentForm({
  sectionKey,
  initialContent,
}: {
  sectionKey?: string;
  initialContent?: string;
}) {
  const [state, formAction, pending] = useActionState(upsertSiteContent, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-paper p-6">
      <div>
        <label className="text-xs font-medium text-slate-500">Section key</label>
        <input
          name="section_key"
          required
          defaultValue={sectionKey}
          readOnly={!!sectionKey}
          placeholder="e.g. home.hero"
          className="mt-1 w-full rounded-lg border border-slate-300 bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-ink read-only:bg-mist"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">Content (JSON)</label>
        <textarea
          name="content"
          required
          rows={6}
          defaultValue={initialContent || "{}"}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 font-mono text-xs outline-none focus:border-ink"
        />
      </div>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state.success && <p className="text-sm text-success">Saved.</p>}
      <Button type="submit" disabled={pending} size="sm" className="self-start">
        {pending ? "Saving…" : "Save section"}
      </Button>
    </form>
  );
}
