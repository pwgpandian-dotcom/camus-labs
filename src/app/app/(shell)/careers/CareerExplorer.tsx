"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Columns3, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface Item {
  slug: string;
  title: string;
  category: string;
  summary: string;
  entry: "degree" | "skills" | "either";
  skills: string[];
  education: string;
  firstSteps: string[];
}

const ENTRY_LABEL = { degree: "Degree / licence route", skills: "Skills & portfolio route", either: "Degree or skills route" } as const;

function overlap(skills: string[], userSkills: string[]) {
  const u = userSkills.map((s) => s.toLowerCase());
  return skills.filter((s) => u.some((h) => s.toLowerCase().includes(h) || h.includes(s.toLowerCase().split(" (")[0]))).length;
}

export function CareerExplorer({ careers, categories, userSkills, targetRole }: { careers: Item[]; categories: string[]; userSkills: string[]; targetRole: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[]>([]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return careers.filter((c) => (!cat || c.category === cat) && (!needle || `${c.title} ${c.category} ${c.summary} ${c.skills.join(" ")}`.toLowerCase().includes(needle)));
  }, [careers, q, cat]);

  const toggle = (slug: string) => setCompare((xs) => (xs.includes(slug) ? xs.filter((x) => x !== slug) : xs.length >= 3 ? xs : [...xs, slug]));
  const compared = compare.map((s) => careers.find((c) => c.slug === s)!).filter(Boolean);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search careers</span>
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search roles, skills or fields"
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-paper pl-10 pr-3 text-base outline-none focus:border-signal focus:ring-2 focus:ring-signal/20 md:text-[15px]"
          />
        </label>
      </div>
      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
        <button onClick={() => setCat(null)} aria-pressed={!cat} className={cn("min-h-9 shrink-0 rounded-full border px-3.5 text-[13px]", !cat ? "border-ink bg-ink text-paper" : "border-slate-200 bg-paper text-slate-600")}>
          All
        </button>
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c === cat ? null : c)} aria-pressed={cat === c} className={cn("min-h-9 shrink-0 rounded-full border px-3.5 text-[13px]", cat === c ? "border-ink bg-ink text-paper" : "border-slate-200 bg-paper text-slate-600 hover:border-slate-400")}>
            {c}
          </button>
        ))}
      </div>

      {compared.length > 0 && (
        <section aria-label="Compare careers" className="mt-4 rounded-2xl border border-slate-200 bg-paper p-4 md:p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
              <Columns3 size={16} /> Comparing {compared.length}
            </h2>
            <button onClick={() => setCompare([])} className="text-[13px] text-slate-500 hover:text-ink">Clear</button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="w-36 pb-2 font-normal" />
                  {compared.map((c) => (
                    <th key={c.slug} className="pb-2 pr-4 font-medium text-ink">
                      <Link href={`/app/careers/${c.slug}`} className="hover:underline">{c.title}</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="align-top">
                <Tr label="Category" cells={compared.map((c) => c.category)} />
                <Tr label="Entry route" cells={compared.map((c) => ENTRY_LABEL[c.entry])} />
                <Tr label="Education" cells={compared.map((c) => c.education)} />
                <Tr label="Your skill overlap" cells={compared.map((c) => (userSkills.length ? `${overlap(c.skills, userSkills)} of ${c.skills.length} core skills` : "Add skills to your Career Twin"))} />
                <Tr label="First steps" cells={compared.map((c) => c.firstSteps.join(" → "))} />
              </tbody>
            </table>
          </div>
        </section>
      )}

      <p className="mt-4 text-[13px] text-slate-500" aria-live="polite">
        {shown.length} {shown.length === 1 ? "career" : "careers"} · select up to 3 to compare
      </p>
      <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((c) => {
          const selected = compare.includes(c.slug);
          const isTarget = targetRole && c.title.toLowerCase() === targetRole.toLowerCase();
          return (
            <li key={c.slug} className={cn("flex flex-col rounded-2xl border bg-paper p-5 transition-colors", selected ? "border-ink" : "border-slate-200 hover:border-slate-400")}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">{c.category}</p>
                  <h3 className="mt-1 text-[15px] font-semibold text-ink">
                    <Link href={`/app/careers/${c.slug}`} className="hover:underline">{c.title}</Link>
                  </h3>
                </div>
                {isTarget && <span className="shrink-0 rounded-full bg-signal-50 px-2.5 py-0.5 text-[11px] font-medium text-signal-dark">Your target</span>}
              </div>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-500">{c.summary}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400">{ENTRY_LABEL[c.entry]}</span>
                <button
                  onClick={() => toggle(c.slug)}
                  aria-pressed={selected}
                  disabled={!selected && compare.length >= 3}
                  className={cn("inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-[13px] disabled:opacity-40", selected ? "border-ink bg-ink text-paper" : "border-slate-200 text-slate-600 hover:border-slate-400")}
                >
                  {selected ? <Check size={14} /> : null} {selected ? "Comparing" : "Compare"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {shown.length === 0 && (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-sm text-slate-500">No careers match “{q}”.</p>
          <button onClick={() => { setQ(""); setCat(null); }} className="inline-flex items-center gap-1 text-sm text-signal-dark"><X size={14} /> Clear filters</button>
          <Link href={`/app/assistant?mode=career&q=${encodeURIComponent(`Tell me about careers related to ${q}`)}`} className="text-sm text-signal-dark hover:underline">Ask the assistant about “{q}”</Link>
        </div>
      )}
    </div>
  );
}

function Tr({ label, cells }: { label: string; cells: string[] }) {
  return (
    <tr className="border-t border-slate-100">
      <th scope="row" className="py-2.5 pr-4 text-[13px] font-normal text-slate-500">{label}</th>
      {cells.map((c, i) => (
        <td key={i} className="py-2.5 pr-4 text-[13px] leading-relaxed text-slate-700">{c}</td>
      ))}
    </tr>
  );
}
