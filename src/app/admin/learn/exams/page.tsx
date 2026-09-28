import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { addQuestion, deleteQuestion, saveExam, toggleExam } from "@/app/actions/learn/admin";
import { AdminForm, inputCls } from "../AdminForm";

export const metadata = { title: "Exams · Camus Learn Admin" };

export default async function ExamsAdmin() {
  const supabase = await createClient();
  const [{ data: exams }, { data: countries }, { data: questions }] = await Promise.all([
    supabase.from("learn_exams").select("*").order("name"),
    supabase.from("learn_countries").select("code, name").order("name"),
    supabase.from("learn_exam_questions").select("id, exam_slug, subject, topic, prompt, difficulty").order("created_at", { ascending: false }).limit(100),
  ]);
  const counts = new Map<string, number>();
  for (const q of questions ?? []) counts.set(q.exam_slug, (counts.get(q.exam_slug) ?? 0) + 1);

  return (
    <div>
      <PageHeader title="Exams & question bank" description="Country → exam → subject → topic → questions. When an exam subject has enough curated questions, learners get those; otherwise practice is AI-generated." />
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-mist text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-4 py-3 font-medium">Exam</th><th className="px-4 py-3 font-medium">Country</th><th className="px-4 py-3 font-medium">Subjects</th><th className="px-4 py-3 font-medium">Bank</th><th className="px-4 py-3" /></tr></thead>
          <tbody>
            {(exams ?? []).map((e) => (
              <tr key={e.slug} className="border-t border-slate-100">
                <td className="px-4 py-3">{e.name} <span className="text-xs text-slate-400">({e.slug})</span></td>
                <td className="px-4 py-3">{e.country_code ?? "International"}</td>
                <td className="px-4 py-3 text-slate-600">{e.subjects.join(", ")}</td>
                <td className="px-4 py-3 tabular-nums">{counts.get(e.slug) ?? 0}</td>
                <td className="px-4 py-3 text-right"><form action={toggleExam.bind(null, e.slug, !e.is_active)}><button className={e.is_active ? "text-[13px] text-danger" : "text-[13px] text-success"}>{e.is_active ? "Hide" : "Show"}</button></form></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-paper p-5">
          <h2 className="text-sm font-medium text-ink">Add or update an exam</h2>
          <AdminForm action={saveExam} reset className="mt-3 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-slate-500">Slug<input name="slug" required placeholder="e.g. a-levels" className={inputCls} /></label>
              <label className="text-xs text-slate-500">Name<input name="name" required className={inputCls} /></label>
            </div>
            <label className="text-xs text-slate-500">Country<select name="country_code" className={inputCls}><option value="">International</option>{(countries ?? []).map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</select></label>
            <label className="text-xs text-slate-500">Description<input name="description" className={inputCls} /></label>
            <label className="text-xs text-slate-500">Subjects (comma-separated)<input name="subjects" required className={inputCls} /></label>
          </AdminForm>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-paper p-5">
          <h2 className="text-sm font-medium text-ink">Add a question</h2>
          <AdminForm action={addQuestion} reset className="mt-3 flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-3">
              <label className="text-xs text-slate-500">Exam<select name="exam_slug" className={inputCls}>{(exams ?? []).map((e) => <option key={e.slug} value={e.slug}>{e.name}</option>)}</select></label>
              <label className="text-xs text-slate-500">Subject<input name="subject" required className={inputCls} /></label>
              <label className="text-xs text-slate-500">Topic<input name="topic" required className={inputCls} /></label>
            </div>
            <label className="text-xs text-slate-500">Question (Markdown / LaTeX)<textarea name="prompt" required rows={3} className={`${inputCls} py-2`} /></label>
            <div className="grid grid-cols-2 gap-3">
              {(["a", "b", "c", "d"] as const).map((k) => <label key={k} className="text-xs text-slate-500">Option {k.toUpperCase()}<input name={k} required className={inputCls} /></label>)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-slate-500">Correct option<select name="answer" className={inputCls}><option value="0">A</option><option value="1">B</option><option value="2">C</option><option value="3">D</option></select></label>
              <label className="text-xs text-slate-500">Difficulty<select name="difficulty" defaultValue="2" className={inputCls}><option value="1">Easy</option><option value="2">Medium</option><option value="3">Hard</option></select></label>
            </div>
            <label className="text-xs text-slate-500">Explanation<textarea name="explanation" rows={2} className={`${inputCls} py-2`} /></label>
          </AdminForm>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-ink">Recent questions</h2>
        <ul className="mt-3 flex flex-col gap-1 text-sm">
          {(questions ?? []).map((q) => (
            <li key={q.id} className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-mist">
              <span className="truncate"><span className="text-xs text-slate-400">{q.exam_slug} · {q.subject} · {q.topic} — </span>{q.prompt}</span>
              <form action={deleteQuestion.bind(null, q.id)}><button className="text-[13px] text-danger">Delete</button></form>
            </li>
          ))}
          {(questions ?? []).length === 0 && <li className="text-slate-500">No curated questions yet.</li>}
        </ul>
      </section>
    </div>
  );
}
