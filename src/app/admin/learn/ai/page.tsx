import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { providers } from "@/lib/learn/ai/providers";
import { ASSISTANT_MODES } from "@/lib/learn/ai/prompts";
import { saveAIConfig, savePrompt } from "@/app/actions/learn/admin";
import { daysAgoISO } from "@/lib/learn/streak";
import { AdminForm, inputCls } from "../AdminForm";

export const metadata = { title: "AI · Camus Learn Admin" };

const FEATURES = [
  { key: "assistant", label: "Assistant, tutor & lessons", hint: "Streaming conversational answers" },
  { key: "structured", label: "Structured outputs", hint: "Quizzes, job reports, projects, profiles, resume help" },
  { key: "interview", label: "Interviewer", hint: "Mock interview questions" },
] as const;

export default async function AIAdmin() {
  const supabase = await createClient();
  const [{ data: configs }, { data: prompts }, { data: usage }] = await Promise.all([
    supabase.from("learn_ai_config").select("*"),
    supabase.from("learn_prompts").select("*"),
    supabase.from("learn_ai_usage").select("provider, model, feature, input_tokens, output_tokens").gte("created_at", daysAgoISO(7)).limit(20000),
  ]);
  const byModel = new Map<string, { calls: number; tokens: number }>();
  for (const u of usage ?? []) {
    const k = `${u.provider} · ${u.model}`;
    const cur = byModel.get(k) ?? { calls: 0, tokens: 0 };
    byModel.set(k, { calls: cur.calls + 1, tokens: cur.tokens + u.input_tokens + u.output_tokens });
  }

  return (
    <div>
      <PageHeader title="AI models & prompts" description="Switch providers and models without a deploy. If the chosen provider has no key, the app falls back to any configured provider." />
      <ul className="mb-8 flex flex-wrap gap-2">
        {Object.values(providers).map((p) => (
          <li key={p.id} className={p.isConfigured() ? "rounded-full bg-[#f0faf5] px-3 py-1 text-[13px] text-success" : "rounded-full bg-slate-100 px-3 py-1 text-[13px] text-slate-500"}>
            {p.id}: {p.isConfigured() ? "key set" : "no key"}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {FEATURES.map((f) => {
          const c = configs?.find((x) => x.feature === f.key);
          return (
            <section key={f.key} className="rounded-2xl border border-slate-200 bg-paper p-5">
              <h2 className="text-sm font-medium text-ink">{f.label}</h2>
              <p className="text-xs text-slate-500">{f.hint}</p>
              <AdminForm action={saveAIConfig} className="mt-4 flex flex-col gap-3">
                <input type="hidden" name="feature" value={f.key} />
                <label className="text-xs text-slate-500">Provider<select name="provider" defaultValue={c?.provider ?? "anthropic"} className={inputCls}><option value="anthropic">Anthropic</option><option value="openai">OpenAI</option><option value="google">Google</option></select></label>
                <label className="text-xs text-slate-500">Model id<input name="model" defaultValue={c?.model ?? ""} required className={inputCls} /></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs text-slate-500">Temperature<input name="temperature" type="number" step="0.05" min={0} max={2} defaultValue={c ? Number(c.temperature) : 0.4} className={inputCls} /></label>
                  <label className="text-xs text-slate-500">Max output tokens<input name="max_output_tokens" type="number" min={64} max={16000} defaultValue={c?.max_output_tokens ?? 1500} className={inputCls} /></label>
                </div>
              </AdminForm>
            </section>
          );
        })}
      </div>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-paper p-5">
        <h2 className="text-sm font-medium text-ink">Usage by model (7 days)</h2>
        {byModel.size === 0 ? <p className="mt-2 text-sm text-slate-500">No AI usage yet.</p> : (
          <ul className="mt-3 flex flex-col gap-1 text-sm">{[...byModel.entries()].map(([k, v]) => <li key={k} className="flex justify-between"><span>{k}</span><span className="tabular-nums text-slate-500">{v.calls} calls · {v.tokens.toLocaleString()} tokens</span></li>)}</ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium text-ink">System prompt overrides</h2>
        <p className="mt-1 text-xs text-slate-500">Leave empty to use the built-in prompt (which includes honesty, academic-integrity and child-safety rules). An override replaces the core rules for that mode — keep those rules in your text.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {ASSISTANT_MODES.map((m) => {
            const p = prompts?.find((x) => x.key === `assistant.${m}`);
            return (
              <AdminForm key={m} action={savePrompt} className="rounded-2xl border border-slate-200 bg-paper p-4">
                <input type="hidden" name="key" value={`assistant.${m}`} />
                <label className="text-xs text-slate-500"><span className="capitalize">{m}</span> mode {p ? `· v${p.version}` : "· default"}
                  <textarea name="system_prompt" rows={4} defaultValue={p?.system_prompt ?? ""} className={`${inputCls} py-2 font-mono text-xs`} />
                </label>
              </AdminForm>
            );
          })}
        </div>
      </section>
    </div>
  );
}
