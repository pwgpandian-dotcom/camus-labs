import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { addCountry, toggleCountry, toggleFlag } from "@/app/actions/learn/admin";
import { AdminForm, inputCls } from "../AdminForm";

export const metadata = { title: "Flags & regions · Camus Learn Admin" };

export default async function SettingsAdmin() {
  const supabase = await createClient();
  const [{ data: flags }, { data: countries }, { data: currencies }, { data: auditRows }] = await Promise.all([
    supabase.from("learn_feature_flags").select("*").order("key"),
    supabase.from("learn_countries").select("*").order("name"),
    supabase.from("learn_currencies").select("code, name").order("code"),
    supabase.from("learn_audit_log").select("*").order("created_at", { ascending: false }).limit(30),
  ]);

  return (
    <div>
      <PageHeader title="Flags & regions" description="Feature flags (admin only), countries and the audit trail." />
      <section className="rounded-2xl border border-slate-200 bg-paper p-5">
        <h2 className="text-sm font-medium text-ink">Feature flags</h2>
        <ul className="mt-3 flex flex-col divide-y divide-slate-100">
          {(flags ?? []).map((f) => (
            <li key={f.key} className="flex items-center justify-between gap-4 py-3">
              <span><span className="font-mono text-sm text-ink">{f.key}</span><span className="block text-xs text-slate-500">{f.description}</span></span>
              <form action={toggleFlag.bind(null, f.key, !f.enabled)}>
                <button className={f.enabled ? "min-h-9 rounded-full bg-success px-4 text-[13px] text-paper" : "min-h-9 rounded-full border border-slate-300 px-4 text-[13px] text-slate-600"}>{f.enabled ? "On" : "Off"}</button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-paper p-5">
        <h2 className="text-sm font-medium text-ink">Countries</h2>
        <ul className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {(countries ?? []).map((c) => (
            <li key={c.code} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-mist">
              <span>{c.name} <span className="text-xs text-slate-400">{c.code} · {c.currency_code}</span></span>
              <form action={toggleCountry.bind(null, c.code, !c.is_active)}><button className={c.is_active ? "text-[13px] text-slate-500" : "text-[13px] text-success"}>{c.is_active ? "Disable" : "Enable"}</button></form>
            </li>
          ))}
        </ul>
        <AdminForm action={addCountry} submitLabel="Add country" reset className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <label className="text-xs text-slate-500">ISO code<input name="code" required maxLength={2} className={`${inputCls} uppercase`} /></label>
          <label className="text-xs text-slate-500">Name<input name="name" required className={inputCls} /></label>
          <label className="text-xs text-slate-500">Currency<select name="currency_code" className={inputCls}>{(currencies ?? []).map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}</select></label>
          <label className="text-xs text-slate-500">Default language<input name="default_locale" defaultValue="en" maxLength={2} className={inputCls} /></label>
        </AdminForm>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-ink">Audit log</h2>
        <ul className="mt-3 flex flex-col gap-1 font-mono text-xs text-slate-600">
          {(auditRows ?? []).map((a) => (
            <li key={a.id}>{new Date(a.created_at).toLocaleString()} · {a.action} · {a.entity}{a.entity_id ? `:${a.entity_id}` : ""}</li>
          ))}
          {(auditRows ?? []).length === 0 && <li className="font-sans text-sm text-slate-500">No admin changes yet.</li>}
        </ul>
      </section>
    </div>
  );
}
