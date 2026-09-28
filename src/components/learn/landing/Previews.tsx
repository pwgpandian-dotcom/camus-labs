/**
 * Illustrative product UI for the landing page, drawn with the same design
 * tokens as the real app. These show how screens look — they contain no
 * usage statistics, customers or outcomes.
 */
import { ArrowUp, Check, CircleDashed, Flame, Mic, Sparkles } from "lucide-react";
import { CamusMark } from "../Brand";

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <figure aria-label={label} className="overflow-hidden rounded-2xl border border-slate-200 bg-paper shadow-md">
      <div className="flex h-8 items-center gap-1.5 border-b border-slate-100 bg-mist px-3" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
      </div>
      <div className="p-4 md:p-5">{children}</div>
    </figure>
  );
}

export function DashboardPreview() {
  return (
    <Frame label="Camus Learn home screen preview">
      <p className="text-xs text-slate-500">Good evening,</p>
      <p className="text-lg font-semibold tracking-tight text-ink">Aarav</p>
      <div className="mt-3 rounded-xl bg-ink p-4 text-paper">
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400">Your next step</p>
        <p className="mt-1 text-sm font-semibold">Continue your skill roadmap</p>
        <p className="mt-0.5 text-xs text-slate-300">Next up: Data fetching & state</p>
        <span className="mt-3 inline-flex rounded-full bg-paper px-3 py-1 text-[11px] font-medium text-ink">Continue learning</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["Streak", <span key="s" className="inline-flex items-center gap-1">Day 4 <Flame size={12} className="text-warning" /></span>],
          ["This week", "Active"],
          ["Roadmap", "Step 6"],
        ].map(([k, v], i) => (
          <div key={i} className="rounded-lg border border-slate-200 p-2">
            <p className="text-[10px] text-slate-500">{k}</p>
            <p className="text-xs font-semibold text-ink">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-slate-200 p-3">
        <div className="flex justify-between text-[11px]"><span className="text-ink">Frontend Developer roadmap</span><span className="text-slate-400">Step 6 of 9</span></div>
        <div className="mt-2 h-1.5 rounded-full bg-slate-100"><div className="h-full w-[62%] rounded-full bg-signal" /></div>
      </div>
    </Frame>
  );
}

export function TutorPreview() {
  return (
    <Frame label="AI tutor preview">
      <div className="flex justify-end">
        <p className="max-w-[80%] rounded-2xl rounded-br-md bg-slate-100 px-3 py-2 text-xs text-ink">Solve x² − 5x + 6 = 0 and explain each step</p>
      </div>
      <div className="mt-3 flex gap-2">
        <CamusMark size={20} />
        <div className="text-xs leading-relaxed text-slate-700">
          <p><span className="font-semibold text-ink">Step 1 — factorise.</span> Find two numbers that multiply to 6 and add to −5: that&apos;s −2 and −3.</p>
          <p className="mt-1.5 rounded-lg bg-mist px-2 py-1 font-mono text-[11px] text-ink">(x − 2)(x − 3) = 0</p>
          <p className="mt-1.5"><span className="font-semibold text-ink">Step 2 — solve.</span> x = 2 or x = 3.</p>
          <p className="mt-1.5 text-slate-500">Check yourself: what do the roots add up to?</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 pl-3">
        <span className="flex-1 text-[11px] text-slate-400">Message Camus · Study mode</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-ink text-paper"><ArrowUp size={12} /></span>
      </div>
    </Frame>
  );
}

export function CareerPreview() {
  const rows = [
    ["Entry route", "Skills & portfolio", "Degree or skills"],
    ["First steps", "HTML → CSS → JS", "Python → Git → APIs"],
    ["Your skill overlap", "3 of 7", "2 of 9"],
  ];
  return (
    <Frame label="Career comparison preview">
      <p className="text-xs font-semibold text-ink">Comparing 2 careers</p>
      <table className="mt-2 w-full text-left text-[11px]">
        <thead>
          <tr className="text-ink"><th className="pb-1.5 font-normal text-slate-400" /><th className="pb-1.5 font-medium">Frontend Developer</th><th className="pb-1.5 font-medium">AI Engineer</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-slate-100">
              <th scope="row" className="py-1.5 pr-2 font-normal text-slate-500">{r[0]}</th>
              <td className="py-1.5 pr-2 text-slate-700">{r[1]}</td>
              <td className="py-1.5 text-slate-700">{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-[10px] text-slate-400">No “best career” rankings — just an honest fit against your goals.</p>
    </Frame>
  );
}

export function ResumePreviewCard() {
  return (
    <Frame label="Resume builder preview">
      <div className="rounded-lg border border-slate-100 p-3 text-[10px] leading-relaxed text-slate-700">
        <p className="text-center text-sm font-semibold text-ink">Priya Raman</p>
        <p className="text-center text-slate-500">Frontend Developer</p>
        <p className="mt-2 border-b border-slate-200 pb-0.5 text-[9px] font-semibold uppercase tracking-wider text-ink">Projects</p>
        <p className="mt-1 font-semibold text-ink">Recipe finder</p>
        <p>• Built search and filters with React and a public recipes API</p>
      </div>
      <div className="mt-3 rounded-lg border border-[#d5dcff] bg-signal-50 p-2.5 text-[11px]">
        <p className="flex items-center gap-1 font-medium text-signal-dark"><Sparkles size={11} /> Suggested wording</p>
        <p className="mt-1 text-ink">Built a responsive recipe search with React, adding filters and loading states.</p>
        <p className="mt-1 text-slate-500">Did it improve anything measurable? Add a real result if you have one.</p>
      </div>
    </Frame>
  );
}

export function InterviewPreview() {
  return (
    <Frame label="Interview coach preview">
      <div className="flex items-center justify-between text-[10px] text-slate-500"><span className="inline-flex items-center gap-1"><Mic size={11} /> Behavioural interview</span><span>Question 3 of 5</span></div>
      <p className="mt-2 rounded-xl bg-mist px-3 py-2 text-xs text-ink">Tell me about a time you had to learn something quickly to finish a project.</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        {[
          ["Structure", "4/5"],
          ["Relevance", "4/5"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-mist p-2"><p className="text-slate-500">{k}</p><p className="font-semibold text-ink">{v}</p></div>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-slate-500">Feedback arrives after the session, with stronger versions of your own answers.</p>
    </Frame>
  );
}

export function ProjectPreview() {
  const tasks = [
    ["Set up repo & CI", true],
    ["Search API integration", true],
    ["Filters & empty states", false],
    ["Deploy & write README", false],
  ] as const;
  return (
    <Frame label="Project builder preview">
      <p className="text-[10px] uppercase tracking-wider text-slate-400">Beginner project</p>
      <p className="text-sm font-semibold text-ink">Recipe finder</p>
      <ul className="mt-2 flex flex-col gap-1.5">
        {tasks.map(([t, done]) => (
          <li key={t} className="flex items-center gap-2 text-[11px]">
            {done ? <Check size={13} className="text-success" /> : <CircleDashed size={13} className="text-slate-300" />}
            <span className={done ? "text-slate-400 line-through" : "text-slate-700"}>{t}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] text-slate-400">Marked complete only when you say you&apos;ve built it.</p>
    </Frame>
  );
}
