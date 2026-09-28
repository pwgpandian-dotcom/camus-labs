"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Sparkles, Upload } from "lucide-react";
import { analyzeJob } from "@/app/actions/learn/jobs";
import { Field, Input, Select, Textarea } from "@/components/learn/ui";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper hover:bg-slate-800 disabled:opacity-60">
      {pending ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
      {pending ? "Analysing… this takes a few seconds" : "Analyse job"}
    </button>
  );
}

export function JobForm({ resumes }: { resumes: { id: string; title: string }[] }) {
  const [state, action] = useActionState(analyzeJob, null);
  const [jd, setJd] = useState("");
  const [fileErr, setFileErr] = useState<string | null>(null);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Job title (optional)" htmlFor="title"><Input id="title" name="title" maxLength={160} placeholder="e.g. Junior Frontend Engineer" /></Field>
        <Field label="Company (optional)" htmlFor="company"><Input id="company" name="company" maxLength={160} /></Field>
      </div>
      <Field label="Job description" htmlFor="jdText" hint={`${jd.length.toLocaleString()} / 30,000 characters`} error={fileErr}>
        <Textarea id="jdText" name="jdText" required minLength={50} maxLength={30000} value={jd} onChange={(e) => setJd(e.target.value)} className="!min-h-64" placeholder="Paste the full job post — responsibilities, requirements and nice-to-haves." />
      </Field>
      <label className="inline-flex min-h-10 w-fit cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 text-[13px] text-slate-600 hover:border-slate-400">
        <Upload size={14} /> Upload .txt instead
        <input
          type="file"
          accept=".txt,text/plain,.md"
          className="sr-only"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            setFileErr(null);
            if (!f) return;
            if (f.size > 500_000) return setFileErr("File too large (max 500 KB).");
            setJd((await f.text()).slice(0, 30000));
          }}
        />
      </label>
      {resumes.length > 0 && (
        <Field label="Compare with resume (optional)" htmlFor="resumeId" hint="Without a resume we compare against your Career Twin.">
          <Select id="resumeId" name="resumeId" defaultValue={resumes[0].id}>
            <option value="">Career Twin only</option>
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </Select>
        </Field>
      )}
      {state?.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
      <div><Submit /></div>
    </form>
  );
}
