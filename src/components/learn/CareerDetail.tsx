import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Career } from "@/lib/learn/catalog/careers";
import { getCareer } from "@/lib/learn/catalog/careers";
import { Chip, Panel } from "./ui";

/** Career guide body shared by the public SEO page and the in-app explorer. */
export function CareerDetail({ career, linkBase, userSkills = [] }: { career: Career; linkBase: string; userSkills?: string[] }) {
  const have = new Set(userSkills.map((s) => s.toLowerCase()));
  const hasSkill = (s: string) => [...have].some((h) => s.toLowerCase().includes(h) || h.includes(s.toLowerCase().split(" (")[0]));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <Panel as="section">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Role overview</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{career.overview}</p>
          <h3 className="mt-6 text-[13px] font-medium text-slate-500">Typical responsibilities</h3>
          <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {career.responsibilities.map((r) => (
              <li key={r} className="flex gap-2 text-sm text-slate-700">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" /> {r}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel as="section">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Beginner roadmap</h2>
          <ol className="mt-4 flex flex-col gap-4">
            {career.roadmap.map((s, i) => (
              <li key={s.key} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xs font-semibold text-ink">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-ink">{s.title}</p>
                  <p className="text-[13px] leading-relaxed text-slate-500">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <h3 className="mt-6 text-[13px] font-medium text-slate-500">Advanced directions</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {career.advanced.map((a) => (
              <Chip key={a}>{a}</Chip>
            ))}
          </div>
        </Panel>

        <Panel as="section">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Project ideas</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {career.projects.map((p) => (
              <li key={p.title} className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs capitalize text-slate-400">{p.level}</p>
                <p className="mt-1 text-sm font-medium text-ink">{p.title}</p>
                <p className="mt-1 text-[13px] text-slate-500">{p.brief}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Panel as="section">
            <h2 className="text-[15px] font-semibold text-ink">Interview topics</h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              {career.interviewTopics.map((t) => (
                <li key={t} className="text-sm text-slate-700">{t}</li>
              ))}
            </ul>
          </Panel>
          <Panel as="section">
            <h2 className="text-[15px] font-semibold text-ink">Resume guidance</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {career.resumeTips.map((t) => (
                <li key={t} className="text-sm leading-relaxed text-slate-700">{t}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <aside className="flex flex-col gap-6">
        <Panel>
          <h2 className="text-[15px] font-semibold text-ink">Education</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {career.education.map((e) => (
              <li key={e} className="text-sm leading-relaxed text-slate-700">{e}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-400">Requirements vary by country — always check the official body where you plan to study or work.</p>
        </Panel>
        <Panel>
          <h2 className="text-[15px] font-semibold text-ink">Skills</h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            {career.skills.map((s) => {
              const ok = userSkills.length > 0 && hasSkill(s);
              return (
                <li key={s} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className={ok ? "h-2 w-2 rounded-full bg-success" : "h-2 w-2 rounded-full bg-slate-300"} aria-hidden />
                  {s}
                  {ok && <span className="sr-only">(you have this)</span>}
                </li>
              );
            })}
          </ul>
          {userSkills.length > 0 && <p className="mt-3 text-xs text-slate-400">Green = matches a skill in your Career Twin.</p>}
          <h2 className="mt-6 text-[15px] font-semibold text-ink">Tools</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {career.tools.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-[15px] font-semibold text-ink">Learning resources</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {career.resources.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-signal-dark hover:underline">
                  {r.title} <ExternalLink size={12} />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-400">External, independent resources — not affiliated with Camus.</p>
        </Panel>
        {career.related.length > 0 && (
          <Panel>
            <h2 className="text-[15px] font-semibold text-ink">Related roles</h2>
            <ul className="mt-3 flex flex-col gap-1">
              {career.related.map((slug) => {
                const r = getCareer(slug);
                return r ? (
                  <li key={slug}>
                    <Link href={`${linkBase}/${slug}`} className="block rounded-lg px-2 py-1.5 text-sm text-ink hover:bg-slate-50">
                      {r.title}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </Panel>
        )}
      </aside>
    </div>
  );
}
