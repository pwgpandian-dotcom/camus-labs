"use client";

import { useActionState } from "react";
import { submitGeneralInquiry, type LeadFormState } from "@/app/actions/leads";
import { Button } from "@/components/ui/Button";

const initialState: LeadFormState = { success: false };

export function GeneralInquiryForm() {
  const [state, formAction, pending] = useActionState(submitGeneralInquiry, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-paper p-8 text-center">
        <p className="text-lg font-medium text-ink">Message received.</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          Thanks for reaching out — we&apos;ll get back to you by email soon. For anything
          urgent, WhatsApp or call is faster.
        </p>
      </div>
    );
  }

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
      </div>

      <div>
        <label className="text-sm font-medium text-ink" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
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
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
