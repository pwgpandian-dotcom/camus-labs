"use client";

import { useActionState } from "react";
import { uploadDocument } from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";

type Option = { id: string; label: string };

const initialState: { success: boolean; error?: string } = { success: false };
const categories = ["contract", "requirement", "design", "report", "other"] as const;

export function DocumentUploadForm({ clients }: { clients: Option[] }) {
  const [state, formAction, pending] = useActionState(uploadDocument, initialState);

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 gap-4 rounded-2xl border border-dashed border-slate-300 p-6 sm:grid-cols-2 lg:grid-cols-5"
    >
      <div className="lg:col-span-2">
        <label className="text-xs font-medium text-slate-500">Title</label>
        <input
          name="title"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-ink"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">Category</label>
        <select
          name="category"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-ink"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">Client (optional)</label>
        <select
          name="client_id"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-ink"
        >
          <option value="">General / internal</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">File</label>
        <input
          name="file"
          type="file"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-ink"
        />
      </div>

      {state.error && (
        <p className="lg:col-span-5 rounded-lg bg-[#fbeae7] px-3.5 py-2.5 text-sm text-danger">
          {state.error}
        </p>
      )}

      <div className="lg:col-span-5">
        <Button type="submit" disabled={pending} size="sm">
          {pending ? "Uploading…" : "Upload document"}
        </Button>
        <p className="mt-2 text-xs text-slate-400">
          Files go to a private Supabase Storage bucket — only staff can access them right now.
          Client-scoped access is added when the client portal ships (Phase 5).
        </p>
      </div>
    </form>
  );
}
