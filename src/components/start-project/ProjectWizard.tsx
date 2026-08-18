"use client";

import { useState, useTransition } from "react";
import {
  Sparkles,
  Bot,
  Globe,
  Smartphone,
  Layers,
  ShoppingCart,
  Workflow,
  MoreHorizontal,
  CheckCircle2,
} from "lucide-react";
import { submitProjectRequest, type ProjectRequestState } from "@/app/actions/project-request";
import { Button } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/site-config";

const buildTypes = [
  { value: "AI Application", icon: Sparkles },
  { value: "AI Agent", icon: Bot },
  { value: "Web Application", icon: Globe },
  { value: "Mobile App", icon: Smartphone },
  { value: "SaaS Platform", icon: Layers },
  { value: "E-commerce Platform", icon: ShoppingCart },
  { value: "Business Automation", icon: Workflow },
  { value: "Something else", icon: MoreHorizontal },
];

const industries = [
  "FinTech", "Banking", "E-commerce", "Food & Restaurants", "Education",
  "Real Estate", "Fashion", "Creators & Influencers", "Retail",
  "Travel & Booking", "Professional Services", "Startups", "Other",
];

const timelines = ["ASAP", "1–3 months", "3–6 months", "Flexible / not sure yet"];

const budgets = [
  "Under ₹5L", "₹5L – ₹15L", "₹15L – ₹50L", "₹50L+", "Not sure yet",
];

type FormState = {
  build_type: string;
  idea_description: string;
  industry: string;
  timeline: string;
  budget_range: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  wants_consultation: boolean;
};

const initialForm: FormState = {
  build_type: "",
  idea_description: "",
  industry: "",
  timeline: "",
  budget_range: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  wants_consultation: true,
};

const STEP_COUNT = 7;

export function ProjectWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ProjectRequestState>({ success: false });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function canAdvance() {
    if (step === 0) return !!form.build_type;
    if (step === 1) return form.idea_description.trim().length >= 10;
    if (step === 5) return !!form.contact_name.trim() && !!form.contact_email.trim();
    return true;
  }

  function handleSubmit() {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "wants_consultation") {
        if (v) fd.set(k, "on");
      } else {
        fd.set(k, String(v));
      }
    });
    startTransition(async () => {
      const res = await submitProjectRequest({ success: false }, fd);
      setResult(res);
    });
  }

  if (result.success) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-paper p-10 text-center">
        <CheckCircle2 size={36} strokeWidth={1.5} className="mx-auto text-success" />
        <h2 className="mt-5 text-2xl font-medium tracking-tight text-ink">Request received.</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Your reference number is
        </p>
        <p className="mt-1 font-mono text-lg text-signal">{result.referenceNumber}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-500">
          We&apos;ll review this and reach out at the email you gave us.
          {form.wants_consultation && " You said you'd like a consultation call — "}
          {form.wants_consultation && (
            <>
              feel free to{" "}
              <a
                href={whatsappLink(
                  `Hi CAMUS Labs, I just submitted a project request (${result.referenceNumber}) and would like to book a consultation.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal hover:text-signal-dark"
              >
                message us on WhatsApp
              </a>{" "}
              to set a time now.
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      <div className="mb-10 flex items-center gap-1.5">
        {Array.from({ length: STEP_COUNT }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-signal" : "bg-slate-200"}`}
          />
        ))}
      </div>
      <p className="mb-2 text-xs font-mono uppercase tracking-[0.1em] text-slate-400">
        Step {step + 1} of {STEP_COUNT}
      </p>

      <div className="rounded-2xl border border-slate-200 bg-paper p-8">
        {step === 0 && (
          <div>
            <h2 className="text-xl font-medium text-ink">What are you building?</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {buildTypes.map((bt) => (
                <button
                  key={bt.value}
                  type="button"
                  onClick={() => update("build_type", bt.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors ${
                    form.build_type === bt.value
                      ? "border-ink bg-mist"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <bt.icon size={20} strokeWidth={1.75} className="text-signal" />
                  <span className="text-xs text-slate-600">{bt.value}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-medium text-ink">Tell us about your idea.</h2>
            <p className="mt-1 text-sm text-slate-500">
              What problem does it solve, who&apos;s it for — whatever you&apos;ve got.
            </p>
            <textarea
              rows={6}
              value={form.idea_description}
              onChange={(e) => update("idea_description", e.target.value)}
              className="mt-5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              placeholder="Describe your idea…"
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-medium text-ink">Which industry? (optional)</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {industries.map((ind) => (
                <button
                  key={ind}
                  type="button"
                  onClick={() => update("industry", form.industry === ind ? "" : ind)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    form.industry === ind
                      ? "border-ink bg-ink text-paper"
                      : "border-slate-200 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-medium text-ink">What&apos;s your timeline? (optional)</h2>
            <div className="mt-6 flex flex-col gap-2">
              {timelines.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => update("timeline", form.timeline === t ? "" : t)}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    form.timeline === t
                      ? "border-ink bg-mist"
                      : "border-slate-200 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-medium text-ink">What&apos;s your budget range? (optional)</h2>
            <div className="mt-6 flex flex-col gap-2">
              {budgets.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => update("budget_range", form.budget_range === b ? "" : b)}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    form.budget_range === b
                      ? "border-ink bg-mist"
                      : "border-slate-200 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-xl font-medium text-ink">How do we reach you?</h2>
            <div className="mt-6 flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-ink">Name</label>
                <input
                  value={form.contact_name}
                  onChange={(e) => update("contact_name", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink">Email</label>
                <input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => update("contact_email", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink">Phone (optional)</label>
                <input
                  type="tel"
                  value={form.contact_phone}
                  onChange={(e) => update("contact_phone", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h2 className="text-xl font-medium text-ink">Review &amp; submit</h2>
            <dl className="mt-6 flex flex-col gap-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-400">Building</dt>
                <dd className="text-ink">{form.build_type}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-400">Industry</dt>
                <dd className="text-ink">{form.industry || "—"}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-400">Timeline</dt>
                <dd className="text-ink">{form.timeline || "—"}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-400">Budget</dt>
                <dd className="text-ink">{form.budget_range || "—"}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-400">Contact</dt>
                <dd className="text-ink">
                  {form.contact_name} · {form.contact_email}
                </dd>
              </div>
            </dl>
            <label className="mt-5 flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={form.wants_consultation}
                onChange={(e) => update("wants_consultation", e.target.checked)}
              />
              I&apos;d like to book a consultation call
            </label>
            {result.error && (
              <p className="mt-4 rounded-lg bg-[#fbeae7] px-3.5 py-2.5 text-sm text-danger">
                {result.error}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={step === 0 ? "invisible" : ""}
        >
          Back
        </Button>
        {step < STEP_COUNT - 1 ? (
          <Button
            size="sm"
            disabled={!canAdvance()}
            onClick={() => setStep((s) => Math.min(STEP_COUNT - 1, s + 1))}
          >
            Continue
          </Button>
        ) : (
          <Button size="sm" disabled={pending} onClick={handleSubmit}>
            {pending ? "Submitting…" : "Submit request"}
          </Button>
        )}
      </div>
    </div>
  );
}
