import { cn } from "@/lib/cn";
import type { ResumeData } from "@/lib/learn/schemas";

/**
 * ATS-friendly resume rendering: single column, real text (no images or
 * tables for layout), standard section headings, left-aligned dates.
 */
function SectionHeading({ children, compact, modern }: { children: React.ReactNode; compact: boolean; modern: boolean }) {
  return (
    <h2
      className={cn(
        "font-semibold uppercase tracking-[0.08em] text-ink",
        compact ? "mt-3 text-[10.5px]" : "mt-5 text-[11.5px]",
        modern ? "border-l-2 border-signal pl-2" : "border-b border-slate-300 pb-1"
      )}
    >
      {children}
    </h2>
  );
}

export function ResumePreview({ data, template = "classic", className }: { data: ResumeData; template?: string; className?: string }) {
  const b = data.basics;
  const compact = template === "compact";
  const modern = template === "modern";
  const range = (s: string, e: string) => [s, e || (s ? "Present" : "")].filter(Boolean).join(" – ");
  const contact = [b.email, b.phone, b.location, ...b.links].filter(Boolean);

  return (
    <article className={cn("bg-white text-slate-800", compact ? "text-[11.5px] leading-snug" : "text-[12.5px] leading-relaxed", className)} style={{ fontFamily: modern ? "var(--font-body)" : "var(--font-body)" }}>
      <header className={cn(modern ? "text-left" : "text-center")}>
        <h1 className={cn("font-semibold tracking-tight text-ink", compact ? "text-xl" : "text-2xl")}>{b.name || "Your name"}</h1>
        {b.headline && <p className="mt-0.5 text-slate-600">{b.headline}</p>}
        {contact.length > 0 && <p className="mt-1 text-[11px] text-slate-500">{contact.join("  ·  ")}</p>}
      </header>

      {b.summary && (
        <>
          <SectionHeading compact={compact} modern={modern}>Summary</SectionHeading>
          <p className="mt-2">{b.summary}</p>
        </>
      )}

      {data.experience.length > 0 && (
        <>
          <SectionHeading compact={compact} modern={modern}>Experience</SectionHeading>
          {data.experience.map((e, i) => (
            <section key={i} className={compact ? "mt-2" : "mt-3"}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <p className="font-semibold text-ink">
                  {e.title}
                  {e.company && <span className="font-normal text-slate-600"> — {e.company}</span>}
                </p>
                <p className="text-[11px] text-slate-500">{[e.location, range(e.start, e.end)].filter(Boolean).join(" · ")}</p>
              </div>
              {e.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc pl-5">
                  {e.bullets.filter(Boolean).map((x, j) => (
                    <li key={j}>{x}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </>
      )}

      {data.projects.length > 0 && (
        <>
          <SectionHeading compact={compact} modern={modern}>Projects</SectionHeading>
          {data.projects.map((p, i) => (
            <section key={i} className={compact ? "mt-2" : "mt-3"}>
              <p className="font-semibold text-ink">
                {p.name}
                {p.link && <span className="font-normal text-slate-500"> — {p.link}</span>}
              </p>
              {p.bullets.filter(Boolean).length > 0 && (
                <ul className="mt-1 list-disc pl-5">
                  {p.bullets.filter(Boolean).map((x, j) => (
                    <li key={j}>{x}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </>
      )}

      {data.education.length > 0 && (
        <>
          <SectionHeading compact={compact} modern={modern}>Education</SectionHeading>
          {data.education.map((e, i) => (
            <section key={i} className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4">
              <p>
                <span className="font-semibold text-ink">{e.qualification}</span>
                <span className="text-slate-600"> — {e.institution}</span>
                {e.details && <span className="text-slate-500"> · {e.details}</span>}
              </p>
              <p className="text-[11px] text-slate-500">{[e.start, e.end].filter(Boolean).join(" – ")}</p>
            </section>
          ))}
        </>
      )}

      {data.skills.length > 0 && (
        <>
          <SectionHeading compact={compact} modern={modern}>Skills</SectionHeading>
          <p className="mt-2">{data.skills.join(", ")}</p>
        </>
      )}

      {data.certifications.length > 0 && (
        <>
          <SectionHeading compact={compact} modern={modern}>Certifications</SectionHeading>
          <ul className="mt-2">
            {data.certifications.map((c, i) => (
              <li key={i}>
                {c.name}
                {c.issuer && <span className="text-slate-600"> — {c.issuer}</span>}
                {c.year && <span className="text-slate-500"> ({c.year})</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}
