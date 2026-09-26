"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Download, FileDown, History, Loader2, Plus, Printer, Sparkles, Target, Trash2, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ResumeData } from "@/lib/learn/schemas";
import { ResumePreview } from "@/components/learn/ResumePreview";
import { Field, Input, Notice, Select, Textarea } from "@/components/learn/ui";
import { TagInput } from "@/components/learn/TagInput";
import { deleteResume, draftSummary, improveBullet, restoreVersion, saveResume } from "@/app/actions/learn/resume";

interface Analysis {
  id: string;
  label: string;
  improvements: string[];
  missing: string[];
  keywords: string[];
}

type SaveState = "saved" | "dirty" | "saving" | "error";

export function ResumeEditor({
  id,
  initialTitle,
  initialTemplate,
  initialData,
  versions: initialVersions,
  analyses,
  targetRole,
  aiReady,
}: {
  id: string;
  initialTitle: string;
  initialTemplate: string;
  initialData: ResumeData;
  versions: { id: string; note: string | null; createdAt: string }[];
  analyses: Analysis[];
  targetRole: string;
  aiReady: boolean;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [template, setTemplate] = useState(initialTemplate);
  const [data, setData] = useState<ResumeData>(initialData);
  const [save, setSave] = useState<SaveState>("saved");
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [panel, setPanel] = useState<"none" | "history" | "tailor">("none");
  const [versions, setVersions] = useState(initialVersions);
  const [, start] = useTransition();
  const first = useRef(true);

  // Debounced autosave
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setSave("dirty");
    const t = setTimeout(async () => {
      setSave("saving");
      const r = await saveResume(id, { title, template, data });
      setSave(r.ok ? "saved" : "error");
      setError(r.ok ? null : r.error ?? "Couldn't save.");
    }, 1200);
    return () => clearTimeout(t);
  }, [id, title, template, data]);

  function saveVersion() {
    const note = window.prompt("Name this version (optional)", "") ;
    if (note === null) return;
    start(async () => {
      setSave("saving");
      const r = await saveResume(id, { title, template, data, snapshotNote: note });
      setSave(r.ok ? "saved" : "error");
      if (r.ok) setVersions((v) => [{ id: `local-${v.length}`, note: note || null, createdAt: new Date().toISOString() }, ...v]);
    });
  }

  const set = <K extends keyof ResumeData>(k: K, v: ResumeData[K]) => setData((d) => ({ ...d, [k]: v }));
  const setBasics = (k: keyof ResumeData["basics"], v: string | string[]) => setData((d) => ({ ...d, basics: { ...d.basics, [k]: v } }));

  const resumeText = useMemo(() => JSON.stringify(data).toLowerCase(), [data]);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Toolbar */}
      <div className="no-print sticky top-0 z-30 border-b border-slate-200 bg-paper/95 backdrop-blur-md pt-safe md:top-0">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-4 py-2.5 md:px-8">
          <Link href="/app/resume" aria-label="All resumes" className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50">
            <ArrowLeft size={18} />
          </Link>
          <label htmlFor="rtitle" className="sr-only">Resume title</label>
          <input id="rtitle" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} className="min-h-10 min-w-0 flex-1 rounded-lg bg-transparent px-2 text-base font-medium text-ink outline-none hover:bg-slate-50 focus:bg-slate-50 md:text-[15px]" />
          <span className="text-xs text-slate-400" aria-live="polite">
            {save === "saving" ? "Saving…" : save === "dirty" ? "Unsaved" : save === "error" ? "Not saved" : "Saved"}
          </span>
          <div className="flex w-full items-center gap-2 overflow-x-auto md:w-auto [scrollbar-width:none]">
            <label htmlFor="template" className="sr-only">Template</label>
            <Select id="template" value={template} onChange={(e) => setTemplate(e.target.value)} className="!min-h-9 w-auto !py-1.5 text-sm">
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="compact">Compact</option>
            </Select>
            <ToolBtn onClick={() => setPanel(panel === "tailor" ? "none" : "tailor")} active={panel === "tailor"}>
              <Target size={14} /> Tailor
            </ToolBtn>
            <ToolBtn onClick={() => setPanel(panel === "history" ? "none" : "history")} active={panel === "history"}>
              <History size={14} /> Versions
            </ToolBtn>
            <ToolBtn onClick={saveVersion}>
              <Check size={14} /> Save version
            </ToolBtn>
            <ToolBtn onClick={() => window.print()}>
              <Printer size={14} /> PDF
            </ToolBtn>
            <a href={`/api/learn/resume/${id}/docx`} className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-[13px] text-slate-700 hover:border-slate-400">
              <FileDown size={14} /> DOCX
            </a>
          </div>
        </div>
        <div role="tablist" className="flex border-t border-slate-100 lg:hidden">
          {(["edit", "preview"] as const).map((v) => (
            <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={cn("min-h-11 flex-1 text-sm capitalize", view === v ? "border-b-2 border-ink font-medium text-ink" : "text-slate-500")}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {error && <Notice tone="danger" className="no-print mx-4 mt-4 md:mx-8">{error}</Notice>}

      <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-6 px-4 py-6 md:px-8 lg:grid-cols-2">
        {/* Editor */}
        <div className={cn("no-print flex flex-col gap-6", view === "preview" && "hidden lg:flex")}>
          {panel !== "none" && (
            <aside className="rounded-2xl border border-slate-200 bg-mist p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-ink">{panel === "history" ? "Version history" : "Tailor to a job"}</h2>
                <button onClick={() => setPanel("none")} aria-label="Close panel" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-200"><X size={16} /></button>
              </div>
              {panel === "history" && (
                <ul className="mt-3 flex flex-col gap-1">
                  {versions.length === 0 && <li className="text-sm text-slate-500">No saved versions yet. Use “Save version” before big changes.</li>}
                  {versions.map((v) => (
                    <li key={v.id} className="flex items-center justify-between gap-3 rounded-lg bg-paper px-3 py-2">
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-ink">{v.note || "Untitled version"}</span>
                        <span className="text-xs text-slate-400">{new Date(v.createdAt).toLocaleString()}</span>
                      </span>
                      {!v.id.startsWith("local-") && (
                        <button
                          onClick={() =>
                            start(async () => {
                              if (!window.confirm("Replace the current resume with this version?")) return;
                              const r = await restoreVersion(id, v.id);
                              if (r.ok && r.data) setData(r.data);
                            })
                          }
                          className="shrink-0 text-[13px] text-signal-dark hover:underline"
                        >
                          Restore
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {panel === "tailor" && (
                <div className="mt-3">
                  {analyses.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      Analyse a job description first, then come back to see its keywords against this resume. <Link href="/app/jobs" className="text-signal-dark hover:underline">Open Job match</Link>
                    </p>
                  ) : (
                    <TailorPanel analyses={analyses} resumeText={resumeText} />
                  )}
                </div>
              )}
            </aside>
          )}

          <Section title="Contact & headline">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="name"><Input id="name" value={data.basics.name} onChange={(e) => setBasics("name", e.target.value)} maxLength={100} autoComplete="name" /></Field>
              <Field label="Headline" htmlFor="headline"><Input id="headline" value={data.basics.headline} onChange={(e) => setBasics("headline", e.target.value)} maxLength={160} placeholder={targetRole || "e.g. Frontend Developer"} /></Field>
              <Field label="Email" htmlFor="email"><Input id="email" type="email" value={data.basics.email} onChange={(e) => setBasics("email", e.target.value)} maxLength={160} autoComplete="email" /></Field>
              <Field label="Phone" htmlFor="phone"><Input id="phone" type="tel" value={data.basics.phone} onChange={(e) => setBasics("phone", e.target.value)} maxLength={40} autoComplete="tel" /></Field>
              <Field label="Location" htmlFor="location"><Input id="location" value={data.basics.location} onChange={(e) => setBasics("location", e.target.value)} maxLength={120} placeholder="City, Country" /></Field>
              <Field label="Links (portfolio, GitHub, LinkedIn)" htmlFor="links" hint="One per line"><Textarea id="links" className="!min-h-20" value={data.basics.links.join("\n")} onChange={(e) => setBasics("links", e.target.value.split("\n").slice(0, 6))} /></Field>
            </div>
          </Section>

          <Section title="Summary">
            <Textarea value={data.basics.summary} onChange={(e) => setBasics("summary", e.target.value)} maxLength={1500} aria-label="Summary" placeholder="2–3 sentences on who you are and what you're looking for." />
            <AIButton
              disabled={!aiReady}
              label="Draft from my resume"
              run={async () => {
                const r = await draftSummary(data);
                if (r.ok) setBasics("summary", r.summary);
                return r.ok ? null : r.error;
              }}
            />
          </Section>

          <Section title="Experience">
            {data.experience.map((e, i) => (
              <Entry key={i} onRemove={() => set("experience", data.experience.filter((_, j) => j !== i))}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input aria-label="Job title" placeholder="Title" value={e.title} onChange={(ev) => set("experience", data.experience.map((x, j) => (j === i ? { ...x, title: ev.target.value } : x)))} />
                  <Input aria-label="Company" placeholder="Company" value={e.company} onChange={(ev) => set("experience", data.experience.map((x, j) => (j === i ? { ...x, company: ev.target.value } : x)))} />
                  <Input aria-label="Start" placeholder="Start (e.g. 2024-06)" value={e.start} onChange={(ev) => set("experience", data.experience.map((x, j) => (j === i ? { ...x, start: ev.target.value } : x)))} />
                  <Input aria-label="End" placeholder="End (blank = present)" value={e.end} onChange={(ev) => set("experience", data.experience.map((x, j) => (j === i ? { ...x, end: ev.target.value } : x)))} />
                </div>
                <Bullets
                  bullets={e.bullets}
                  aiReady={aiReady}
                  context={{ role: e.title, targetRole }}
                  onChange={(b) => set("experience", data.experience.map((x, j) => (j === i ? { ...x, bullets: b } : x)))}
                />
              </Entry>
            ))}
            <AddBtn onClick={() => set("experience", [...data.experience, { company: "", title: "", location: "", start: "", end: "", bullets: [""] }])}>Add experience</AddBtn>
          </Section>

          <Section title="Projects">
            {data.projects.map((p, i) => (
              <Entry key={i} onRemove={() => set("projects", data.projects.filter((_, j) => j !== i))}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input aria-label="Project name" placeholder="Project name" value={p.name} onChange={(ev) => set("projects", data.projects.map((x, j) => (j === i ? { ...x, name: ev.target.value } : x)))} />
                  <Input aria-label="Link" placeholder="Link (optional)" value={p.link} onChange={(ev) => set("projects", data.projects.map((x, j) => (j === i ? { ...x, link: ev.target.value } : x)))} />
                </div>
                <Bullets bullets={p.bullets} aiReady={aiReady} context={{ role: p.name, targetRole }} onChange={(b) => set("projects", data.projects.map((x, j) => (j === i ? { ...x, bullets: b } : x)))} />
              </Entry>
            ))}
            <AddBtn onClick={() => set("projects", [...data.projects, { name: "", link: "", bullets: [""] }])}>Add project</AddBtn>
          </Section>

          <Section title="Education">
            {data.education.map((e, i) => (
              <Entry key={i} onRemove={() => set("education", data.education.filter((_, j) => j !== i))}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input aria-label="Qualification" placeholder="Qualification" value={e.qualification} onChange={(ev) => set("education", data.education.map((x, j) => (j === i ? { ...x, qualification: ev.target.value } : x)))} />
                  <Input aria-label="Institution" placeholder="Institution" value={e.institution} onChange={(ev) => set("education", data.education.map((x, j) => (j === i ? { ...x, institution: ev.target.value } : x)))} />
                  <Input aria-label="Start" placeholder="Start" value={e.start} onChange={(ev) => set("education", data.education.map((x, j) => (j === i ? { ...x, start: ev.target.value } : x)))} />
                  <Input aria-label="End" placeholder="End" value={e.end} onChange={(ev) => set("education", data.education.map((x, j) => (j === i ? { ...x, end: ev.target.value } : x)))} />
                  <Input aria-label="Details" placeholder="Grade / honours (optional)" className="sm:col-span-2" value={e.details} onChange={(ev) => set("education", data.education.map((x, j) => (j === i ? { ...x, details: ev.target.value } : x)))} />
                </div>
              </Entry>
            ))}
            <AddBtn onClick={() => set("education", [...data.education, { institution: "", qualification: "", start: "", end: "", details: "" }])}>Add education</AddBtn>
          </Section>

          <Section title="Skills">
            <TagInput label="Skills" value={data.skills} onChange={(v) => set("skills", v)} max={60} placeholder="Add a skill you can discuss in an interview" />
          </Section>

          <Section title="Certifications">
            {data.certifications.map((c, i) => (
              <Entry key={i} onRemove={() => set("certifications", data.certifications.filter((_, j) => j !== i))}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Input aria-label="Certification" placeholder="Name" value={c.name} onChange={(ev) => set("certifications", data.certifications.map((x, j) => (j === i ? { ...x, name: ev.target.value } : x)))} />
                  <Input aria-label="Issuer" placeholder="Issuer" value={c.issuer} onChange={(ev) => set("certifications", data.certifications.map((x, j) => (j === i ? { ...x, issuer: ev.target.value } : x)))} />
                  <Input aria-label="Year" placeholder="Year" value={c.year} onChange={(ev) => set("certifications", data.certifications.map((x, j) => (j === i ? { ...x, year: ev.target.value } : x)))} />
                </div>
              </Entry>
            ))}
            <AddBtn onClick={() => set("certifications", [...data.certifications, { name: "", issuer: "", year: "" }])}>Add certification</AddBtn>
            <p className="text-xs text-slate-400">Only list certifications you have actually earned.</p>
          </Section>

          <form
            action={deleteResume.bind(null, id)}
            onSubmit={(e) => {
              if (!window.confirm("Delete this resume and its versions?")) e.preventDefault();
            }}
          >
            <button type="submit" className="inline-flex min-h-10 items-center gap-1.5 text-sm text-danger hover:underline">
              <Trash2 size={14} /> Delete resume
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className={cn("lg:sticky lg:top-24 lg:self-start", view === "edit" && "hidden lg:block")}>
          <div className="print-area overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10 print:rounded-none print:border-0 print:p-0 print:shadow-none">
            <ResumePreview data={data} template={template} />
          </div>
          <p className="no-print mt-3 text-center text-xs text-slate-400">
            <Download size={12} className="mr-1 inline" /> PDF uses your browser&apos;s “Save as PDF”. Keep it to one or two pages.
          </p>
        </div>
      </div>
      <style>{`@media print { @page { margin: 14mm; } body * { visibility: hidden; } .print-area, .print-area * { visibility: visible; } .print-area { position: absolute; inset: 0; } }`}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-paper p-4 md:p-5">
      <h2 className="mb-4 text-[15px] font-semibold text-ink">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Entry({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="relative rounded-xl border border-slate-100 bg-mist/60 p-3 pr-12">
      {children}
      <button type="button" onClick={onRemove} aria-label="Remove entry" className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-danger">
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function AddBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex min-h-10 items-center gap-1.5 self-start rounded-full border border-dashed border-slate-300 px-4 text-sm text-slate-600 hover:border-slate-500 hover:text-ink">
      <Plus size={14} /> {children}
    </button>
  );
}

function ToolBtn({ onClick, children, active }: { onClick: () => void; children: React.ReactNode; active?: boolean }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={cn("inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px]", active ? "border-ink bg-ink text-paper" : "border-slate-200 text-slate-700 hover:border-slate-400")}>
      {children}
    </button>
  );
}

function AIButton({ label, run, disabled }: { label: string; run: () => Promise<string | null | undefined>; disabled?: boolean }) {
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  return (
    <div>
      <button
        type="button"
        disabled={pending || disabled}
        title={disabled ? "AI is not configured yet" : undefined}
        onClick={() => start(async () => setErr((await run()) ?? null))}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-[13px] text-slate-700 hover:border-slate-400 disabled:opacity-50"
      >
        {pending ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />} {label}
      </button>
      {err && <p className="mt-1 text-[13px] text-danger">{err}</p>}
    </div>
  );
}

function Bullets({ bullets, onChange, aiReady, context }: { bullets: string[]; onChange: (b: string[]) => void; aiReady: boolean; context: { role?: string; targetRole?: string } }) {
  const [suggest, setSuggest] = useState<Record<number, { text: string; note: string; needsNumbers: boolean } | string>>({});
  const [busy, setBusy] = useState<number | null>(null);

  async function improve(i: number) {
    setBusy(i);
    const r = await improveBullet(bullets[i], context);
    setBusy(null);
    setSuggest((s) => ({ ...s, [i]: r.ok ? { text: r.suggestion, note: r.note, needsNumbers: r.needsNumbers } : r.error }));
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <p className="text-[13px] text-slate-500">What you did and the real result</p>
      {bullets.map((b, i) => {
        const s = suggest[i];
        return (
          <div key={i}>
            <div className="flex items-start gap-2">
              <Textarea
                aria-label={`Bullet ${i + 1}`}
                className="!min-h-16"
                value={b}
                maxLength={400}
                onChange={(e) => onChange(bullets.map((x, j) => (j === i ? e.target.value : x)))}
              />
              <div className="flex flex-col gap-1">
                <button type="button" disabled={!aiReady || busy !== null || b.trim().length < 3} onClick={() => improve(i)} aria-label="Improve wording" title="Improve wording (no new facts)" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-ink disabled:opacity-40">
                  {busy === i ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                </button>
                <button type="button" onClick={() => onChange(bullets.filter((_, j) => j !== i))} aria-label="Remove bullet" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-danger">
                  <X size={15} />
                </button>
              </div>
            </div>
            {typeof s === "string" && <p className="mt-1 text-[13px] text-danger">{s}</p>}
            {s && typeof s === "object" && (
              <div className="fade-in mt-2 rounded-xl border border-[#d5dcff] bg-signal-50 p-3 text-sm">
                <p className="text-ink">{s.text}</p>
                {s.note && <p className="mt-1 text-[13px] text-slate-600">{s.needsNumbers ? "💡 " : ""}{s.note}</p>}
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => { onChange(bullets.map((x, j) => (j === i ? s.text : x))); setSuggest((o) => ({ ...o, [i]: undefined as never })); }} className="min-h-8 rounded-full bg-ink px-3 text-[13px] text-paper">Use this</button>
                  <button type="button" onClick={() => setSuggest((o) => ({ ...o, [i]: undefined as never }))} className="min-h-8 rounded-full px-3 text-[13px] text-slate-600 hover:bg-paper">Dismiss</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      {bullets.length < 10 && (
        <button type="button" onClick={() => onChange([...bullets, ""])} className="self-start text-[13px] text-signal-dark hover:underline">
          + Add bullet
        </button>
      )}
    </div>
  );
}

function TailorPanel({ analyses, resumeText }: { analyses: Analysis[]; resumeText: string }) {
  const [sel, setSel] = useState(analyses[0].id);
  const a = analyses.find((x) => x.id === sel)!;
  const present = a.keywords.filter((k) => resumeText.includes(k.toLowerCase()));
  const absent = a.keywords.filter((k) => !resumeText.includes(k.toLowerCase()));
  return (
    <div className="flex flex-col gap-3">
      <Select value={sel} onChange={(e) => setSel(e.target.value)} aria-label="Job description">
        {analyses.map((x) => (
          <option key={x.id} value={x.id}>{x.label}</option>
        ))}
      </Select>
      <p className="text-[13px] text-slate-600">
        <span className="font-medium text-ink">{present.length}</span> of {a.keywords.length} job keywords appear in this resume.
      </p>
      {absent.length > 0 && (
        <div>
          <p className="text-[13px] font-medium text-slate-500">Not yet in your resume</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {absent.map((k) => (
              <span key={k} className="rounded-full border border-slate-200 bg-paper px-2.5 py-0.5 text-xs text-slate-600">{k}</span>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">Only add a keyword if it&apos;s genuinely true for you — interviewers will ask about it.</p>
        </div>
      )}
      {a.improvements.length > 0 && (
        <div>
          <p className="text-[13px] font-medium text-slate-500">Suggested improvements</p>
          <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-5 text-[13px] text-slate-700">
            {a.improvements.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
