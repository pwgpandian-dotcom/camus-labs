import { AlignmentType, BorderStyle, Document, HeadingLevel, Paragraph, TextRun } from "docx";
import type { ResumeData } from "./schemas";

function heading(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "C3C3C7", space: 2 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 20, font: "Calibri" })],
  });
}
const line = (runs: TextRun[], opts: { bullet?: boolean } = {}) =>
  new Paragraph({ children: runs, spacing: { after: 40 }, ...(opts.bullet ? { bullet: { level: 0 } } : {}) });
const t = (text: string, o: { bold?: boolean; color?: string; size?: number } = {}) => new TextRun({ text, font: "Calibri", size: o.size ?? 21, bold: o.bold, color: o.color });

export function buildDocx(d: ResumeData) {
  const b = d.basics;
  const children: Paragraph[] = [
    new Paragraph({ alignment: AlignmentType.CENTER, children: [t(b.name || "Your name", { bold: true, size: 36 })] }),
  ];
  if (b.headline) children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [t(b.headline, { color: "4D4D52" })] }));
  const contact = [b.email, b.phone, b.location, ...b.links].filter(Boolean).join("  ·  ");
  if (contact) children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [t(contact, { size: 18, color: "6B6B70" })] }));
  if (b.summary) children.push(heading("Summary"), line([t(b.summary)]));
  if (d.experience.length) {
    children.push(heading("Experience"));
    for (const e of d.experience) {
      children.push(line([t(e.title, { bold: true }), t(e.company ? ` — ${e.company}` : ""), t([e.start, e.end || (e.start ? "Present" : "")].filter(Boolean).join(" – ") ? `   ${[e.start, e.end || (e.start ? "Present" : "")].filter(Boolean).join(" – ")}` : "", { color: "6B6B70", size: 18 })]));
      for (const x of e.bullets.filter(Boolean)) children.push(line([t(x)], { bullet: true }));
    }
  }
  if (d.projects.length) {
    children.push(heading("Projects"));
    for (const p of d.projects) {
      children.push(line([t(p.name, { bold: true }), t(p.link ? ` — ${p.link}` : "", { color: "6B6B70" })]));
      for (const x of p.bullets.filter(Boolean)) children.push(line([t(x)], { bullet: true }));
    }
  }
  if (d.education.length) {
    children.push(heading("Education"));
    for (const e of d.education)
      children.push(line([t(e.qualification, { bold: true }), t(` — ${e.institution}`), t(e.details ? ` · ${e.details}` : ""), t([e.start, e.end].filter(Boolean).length ? `   ${[e.start, e.end].filter(Boolean).join(" – ")}` : "", { color: "6B6B70", size: 18 })]));
  }
  if (d.skills.length) children.push(heading("Skills"), line([t(d.skills.join(", "))]));
  if (d.certifications.length) {
    children.push(heading("Certifications"));
    for (const c of d.certifications) children.push(line([t(c.name), t(c.issuer ? ` — ${c.issuer}` : ""), t(c.year ? ` (${c.year})` : "")]));
  }
  return new Document({ creator: "Camus Learn", title: b.name ? `${b.name} — Resume` : "Resume", sections: [{ properties: { page: { margin: { top: 720, bottom: 720, left: 800, right: 800 } } }, children }] });
}

