"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { completeOnboarding } from "@/app/actions/learn/onboarding";
import { AGE_BANDS, INTERESTS, LEARNING_STYLES, SKILL_SUGGESTIONS, STAGES, isSchoolStage } from "@/lib/learn/catalog/onboarding";
import { subjects as SUBJECTS } from "@/lib/learn/catalog/subjects";
import { careers } from "@/lib/learn/catalog/careers";
import { CamusWordmark } from "@/components/learn/Brand";
import { Field, Input, Notice, Select, Textarea } from "@/components/learn/ui";
import { TagInput } from "@/components/learn/TagInput";

interface FormState {
  displayName: string;
  stage: string;
  ageBand: string;
  country: string;
  currentEducation: string;
  subjects: string[];
  interests: string[];
  skills: string[];
  careerGoals: string;
  targetRole: string;
  targetCountry: string;
  learningStyle: string;
  hoursPerWeek: number;
  examGoals: string[];
}

type StepId = "about" | "place" | "education" | "interests" | "skills" | "goals" | "learning" | "exams";

export function OnboardingWizard({
  countries,
  exams,
  initial,
  isEditing,
}: {
  countries: { code: string; name: string }[];
  exams: { slug: string; name: string; country_code: string | null }[];
  initial: FormState;
  isEditing: boolean;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const school = isSchoolStage(form.stage);
  const child = form.ageBand === "under_13";

  // Progressive disclosure: only show steps that apply to this learner.
  const steps: { id: StepId; title: string; subtitle: string }[] = useMemo(
    () =>
      [
        { id: "about" as const, title: "Let's get to know you", subtitle: "This shapes everything — lessons, careers and advice." },
        { id: "place" as const, title: "Where are you learning from?", subtitle: "We use this for your education system, exams and pricing." },
        { id: "education" as const, title: "What are you studying?", subtitle: "Pick the subjects you're working on now." },
        { id: "interests" as const, title: "What are you curious about?", subtitle: "Choose anything that genuinely interests you." },
        { id: "skills" as const, title: "What can you already do?", subtitle: "Even basics count. Be honest — this is just for you." },
        { id: "goals" as const, title: "Where do you want to go?", subtitle: "It's fine to be unsure. You can change this any time." },
        { id: "learning" as const, title: "How do you like to learn?", subtitle: "We'll match explanations and plans to you." },
        { id: "exams" as const, title: "Any exams coming up?", subtitle: "Optional — we'll build a preparation plan." },
      ].filter((s) => !(s.id === "skills" && form.stage === "school_primary")),
    [form.stage]
  );
  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const isLast = stepIndex >= steps.length - 1;
  const progress = ((stepIndex + 1) / steps.length) * 100;

  function validateStep(): string | null {
    if (step.id === "about") {
      if (!form.displayName.trim()) return "Please tell us what to call you.";
      if (!form.stage) return "Choose the option that best describes you.";
      if (!form.ageBand) return "Please choose your age range.";
    }
    if (step.id === "place" && !form.country) return "Choose your country.";
    return null;
  }

  function next() {
    const msg = validateStep();
    if (msg) {
      setError(msg);
      return;
    }
    setError(null);
    if (!isLast) {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    startTransition(async () => {
      const res = await completeOnboarding({
        ...form,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      if (res?.error) {
        setError(res.error);
        setFieldErrors(res.fieldErrors ?? {});
      }
    });
  }

  const relevantExams = exams.filter((e) => !e.country_code || e.country_code === form.country);
  const stageOption = STAGES.find((s) => s.value === form.stage);

  return (
    <div className="flex min-h-dvh flex-col bg-mist pt-safe pb-safe">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <CamusWordmark />
          {isEditing ? (
            <Link href="/app/profile" className="text-sm text-slate-500 hover:text-ink">Cancel</Link>
          ) : (
            <span className="text-[13px] tabular-nums text-slate-500">
              {stepIndex + 1} / {steps.length}
            </span>
          )}
        </div>
        <div className="h-0.5 bg-slate-100">
          <div className="h-full bg-signal transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8 md:py-14">
        <div key={step.id} className="fade-in">
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-ink md:text-3xl">{step.title}</h1>
          <p className="mt-2 text-[15px] text-slate-500">{step.subtitle}</p>

          <div className="mt-8 flex flex-col gap-6">
            {step.id === "about" && (
              <>
                <Field label="What should we call you?" htmlFor="displayName" error={fieldErrors.displayName}>
                  <Input id="displayName" autoComplete="given-name" value={form.displayName} maxLength={80} onChange={(e) => set("displayName", e.target.value)} placeholder="First name or nickname" />
                </Field>
                <fieldset>
                  <legend className="text-sm font-medium text-ink">Which best describes you right now?</legend>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {STAGES.map((s) => (
                      <button
                        type="button"
                        key={s.value}
                        aria-pressed={form.stage === s.value}
                        onClick={() => {
                          set("stage", s.value);
                          if (s.ageBand) set("ageBand", s.ageBand);
                        }}
                        className={cn(
                          "min-h-12 rounded-xl border px-4 py-3 text-left text-[15px] transition-colors",
                          form.stage === s.value ? "border-ink bg-paper text-ink ring-1 ring-ink" : "border-slate-200 bg-paper text-slate-700 hover:border-slate-400"
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
                {form.stage && !stageOption?.ageBand && (
                  <fieldset className="fade-in">
                    <legend className="text-sm font-medium text-ink">Your age range</legend>
                    <p className="mt-1 text-[13px] text-slate-500">We only store a range, never your date of birth.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {AGE_BANDS.map((a) => (
                        <button
                          type="button"
                          key={a.value}
                          aria-pressed={form.ageBand === a.value}
                          onClick={() => set("ageBand", a.value)}
                          className={cn(
                            "min-h-11 rounded-full border px-4 text-sm",
                            form.ageBand === a.value ? "border-ink bg-ink text-paper" : "border-slate-200 bg-paper text-slate-700 hover:border-slate-400"
                          )}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}
                {(form.ageBand === "under_13" || form.ageBand === "13_17") && (
                  <Notice tone="signal">
                    Because you&apos;re under 18, we keep your profile minimal and private, and the AI keeps content age-appropriate. It&apos;s a good idea to use Camus with a parent or guardian&apos;s knowledge.
                  </Notice>
                )}
              </>
            )}

            {step.id === "place" && (
              <>
                <Field label="Country you live in" htmlFor="country" error={fieldErrors.country}>
                  <Select id="country" value={form.country} onChange={(e) => set("country", e.target.value)}>
                    <option value="">Select a country</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </Select>
                </Field>
                {!child && !school && (
                  <Field label="Country you'd like to work or study in (optional)" htmlFor="targetCountry">
                    <Select id="targetCountry" value={form.targetCountry} onChange={(e) => set("targetCountry", e.target.value)}>
                      <option value="">Same as above / not sure</option>
                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </Select>
                  </Field>
                )}
              </>
            )}

            {step.id === "education" && (
              <>
                <Field
                  label={school ? "Your class, grade or board (optional)" : "Your current course, degree or field (optional)"}
                  htmlFor="currentEducation"
                >
                  <Input
                    id="currentEducation"
                    value={form.currentEducation}
                    maxLength={200}
                    onChange={(e) => set("currentEducation", e.target.value)}
                    placeholder={school ? "e.g. Class 11, Science stream" : "e.g. B.Tech Computer Science, 3rd year"}
                  />
                </Field>
                <div>
                  <p className="mb-3 text-sm font-medium text-ink">Subjects</p>
                  <TagInput label="Subjects" value={form.subjects} onChange={(v) => set("subjects", v)} suggestions={SUBJECTS.map((s) => s.name)} placeholder="Add another subject" />
                </div>
              </>
            )}

            {step.id === "interests" && (
              <TagInput label="Interests" value={form.interests} onChange={(v) => set("interests", v)} suggestions={INTERESTS} placeholder="Add your own" />
            )}

            {step.id === "skills" && (
              <TagInput label="Skills" value={form.skills} onChange={(v) => set("skills", v)} suggestions={SKILL_SUGGESTIONS} placeholder="e.g. Python, Excel, public speaking" />
            )}

            {step.id === "goals" && (
              <>
                <Field label="A role you're aiming for (optional)" htmlFor="targetRole" hint="Pick one or type your own. Not sure yet? Leave it blank and explore careers later.">
                  <Input id="targetRole" list="career-options" value={form.targetRole} maxLength={120} onChange={(e) => set("targetRole", e.target.value)} placeholder="e.g. Frontend Developer" />
                  <datalist id="career-options">
                    {careers.map((c) => (
                      <option key={c.slug} value={c.title} />
                    ))}
                  </datalist>
                </Field>
                {!child && (
                  <Field label="In your own words, what do you want to achieve?" htmlFor="careerGoals" hint="Optional. One or two sentences is plenty.">
                    <Textarea id="careerGoals" value={form.careerGoals} maxLength={1000} onChange={(e) => set("careerGoals", e.target.value)} placeholder="e.g. Get my first software job within a year and build real projects along the way." />
                  </Field>
                )}
              </>
            )}

            {step.id === "learning" && (
              <>
                <fieldset>
                  <legend className="text-sm font-medium text-ink">Explanations that work best for you</legend>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {LEARNING_STYLES.map((s) => (
                      <button
                        type="button"
                        key={s.value}
                        aria-pressed={form.learningStyle === s.value}
                        onClick={() => set("learningStyle", s.value)}
                        className={cn(
                          "min-h-12 rounded-xl border px-4 py-3 text-left text-[15px]",
                          form.learningStyle === s.value ? "border-ink ring-1 ring-ink bg-paper" : "border-slate-200 bg-paper text-slate-700 hover:border-slate-400"
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <Field label={`Time you can give each week: ${form.hoursPerWeek} hour${form.hoursPerWeek === 1 ? "" : "s"}`} htmlFor="hours">
                  <input id="hours" type="range" min={1} max={30} value={form.hoursPerWeek} onChange={(e) => set("hoursPerWeek", Number(e.target.value))} className="w-full accent-[var(--color-signal)]" />
                </Field>
              </>
            )}

            {step.id === "exams" && (
              <div className="flex flex-wrap gap-2">
                {relevantExams.length === 0 && <p className="text-sm text-slate-500">No exams configured for your country yet — you can skip this.</p>}
                {relevantExams.map((e) => {
                  const active = form.examGoals.includes(e.name);
                  return (
                    <button
                      type="button"
                      key={e.slug}
                      aria-pressed={active}
                      onClick={() => set("examGoals", active ? form.examGoals.filter((x) => x !== e.name) : [...form.examGoals, e.name])}
                      className={cn(
                        "min-h-11 rounded-full border px-4 text-sm",
                        active ? "border-ink bg-ink text-paper" : "border-slate-200 bg-paper text-slate-700 hover:border-slate-400"
                      )}
                    >
                      {e.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {error && (
            <p role="alert" className="mt-6 text-sm text-danger">
              {error}
            </p>
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-slate-200 bg-paper/95 backdrop-blur-md pb-safe">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setStepIndex((i) => Math.max(0, i - 1));
            }}
            disabled={stepIndex === 0 || pending}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm text-slate-600 hover:bg-slate-50 disabled:invisible"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={pending}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper hover:bg-slate-800 disabled:opacity-70"
          >
            {pending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Building your profile…
              </>
            ) : isLast ? (
              <>
                <Sparkles size={16} /> Create my profile
              </>
            ) : (
              <>
                Continue <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
