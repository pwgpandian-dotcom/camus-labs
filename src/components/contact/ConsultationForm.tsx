"use client";

import { useActionState } from "react";
import { submitConsultation, type ConsultationFormState } from "@/app/actions/consultation";
import { Button } from "@/components/ui/Button";

const initialState: ConsultationFormState = { success: false };

const consultationTypes = [
  { value: "discovery", label: "Discovery — exploring an idea" },
  { value: "technical", label: "Technical — scoping a build" },
  { value: "proposal", label: "Proposal — reviewing a quote" },
  { value: "support", label: "Support — existing project" },
];

export function ConsultationForm() {
  const [state, formAction, pending] = useActionState(submitConsultation, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-paper p-8 text-center">
        <p className="text-lg font-medium text-ink">Consultation requested.</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Thanks — we&apos;ll confirm your slot by email shortly. For anything urgent, WhatsApp
          or call is faster.
        </p>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-paper p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="phone">
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="company">
            Company (optional)
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="type">
            What&apos;s this about?
          </label>
          <select
            id="type"
            name="type"
            defaultValue="discovery"
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          >
            {consultationTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div />
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="preferred_date">
            Preferred date
          </label>
          <input
            id="preferred_date"
            name="preferred_date"
            type="date"
            required
            min={today}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="preferred_time">
            Preferred time
          </label>
          <input
            id="preferred_time"
            name="preferred_time"
            type="time"
            required
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink" htmlFor="notes">
          Anything we should know beforehand? (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-[#fbeae7] px-3.5 py-2.5 text-sm text-danger">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="mt-1 self-start">
        {pending ? "Requesting…" : "Request consultation"}
      </Button>
    </form>
  );
}
