"use client";

import { useActionState } from "react";
import { createPayment } from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";

type Option = { id: string; label: string };

const initialState: { success: boolean; error?: string } = { success: false };

export function NewPaymentForm({
  clients,
  projects,
}: {
  clients: Option[];
  projects: Option[];
}) {
  const [state, formAction, pending] = useActionState(createPayment, initialState);

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 gap-4 rounded-2xl border border-dashed border-slate-300 p-6 sm:grid-cols-2 lg:grid-cols-6"
    >
      <div className="lg:col-span-2">
        <label className="text-xs font-medium text-slate-500">Client</label>
        <select
          name="client_id"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-ink"
        >
          <option value="">Select client…</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="lg:col-span-2">
        <label className="text-xs font-medium text-slate-500">Project</label>
        <select
          name="project_id"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-ink"
        >
          <option value="">Select project…</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">Invoice #</label>
        <input
          name="invoice_number"
          required
          placeholder="INV-0001"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-ink"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">Amount</label>
        <input
          name="amount"
          type="number"
          step="0.01"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-ink"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">Currency</label>
        <input
          name="currency"
          defaultValue="INR"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-ink"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">Due date</label>
        <input
          name="due_date"
          type="date"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-ink"
        />
      </div>

      {state.error && (
        <p className="lg:col-span-6 rounded-lg bg-[#fbeae7] px-3.5 py-2.5 text-sm text-danger">
          {state.error}
        </p>
      )}

      <div className="lg:col-span-6">
        <Button type="submit" disabled={pending} size="sm">
          {pending ? "Saving…" : "Record invoice"}
        </Button>
        <p className="mt-2 text-xs text-slate-400">
          This records an invoice in CAMUS Labs — it doesn&apos;t charge a card. Payment
          gateway integration (Razorpay/Stripe) is Phase 6.
        </p>
      </div>
    </form>
  );
}
