import { requireLearner } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { Field, Notice, PageHeader, Panel, Select, Input } from "@/components/learn/ui";
import { ActionForm, SubmitButton } from "@/components/learn/Forms";
import { deleteLearnData, updatePreferences } from "@/app/actions/learn/profile";
import { LOCALES, isTranslated } from "@/lib/learn/i18n";
import { InstallPrompt } from "@/components/learn/InstallPrompt";

export const metadata = { title: "Settings" };

const PREFS = [
  { name: "study_reminders", label: "Study reminders", hint: "A nudge when you haven't studied for a while." },
  { name: "streaks", label: "Learning streaks", hint: "Milestones and streak-at-risk alerts." },
  { name: "interview_reminders", label: "Interview reminders", hint: "Reminders for practice sessions you plan." },
  { name: "project_milestones", label: "Project milestones", hint: "When you complete or approach a milestone." },
  { name: "billing", label: "Subscription & account", hint: "Important billing and account events." },
] as const;

export default async function SettingsPage() {
  const { supabase, user, profile } = await requireLearner();
  const { data: prefs } = await supabase.from("learn_notification_prefs").select("*").eq("user_id", user.id).maybeSingle();

  return (
    <Page width="narrow">
      <PageHeader title="Settings" description="Language, notifications, app install and your data." />
      <div className="flex flex-col gap-6">
        <Panel>
          <ActionForm action={updatePreferences} resetOnSuccess={false} successMessage="Settings saved">
            <h2 className="text-[15px] font-semibold text-ink">Language</h2>
            <Field label="Interface language" htmlFor="locale" hint="Languages without a full translation yet fall back to English." className="mt-4">
              <Select id="locale" name="locale" defaultValue={profile?.locale ?? "en"}>
                {LOCALES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                    {isTranslated(l.code) ? "" : " (coming soon)"}
                  </option>
                ))}
              </Select>
            </Field>

            <h2 className="mt-8 text-[15px] font-semibold text-ink">Notifications</h2>
            <p className="mt-1 text-[13px] text-slate-500">Choose what we may notify you about. Push notifications also need permission on this device.</p>
            <ul className="mt-4 flex flex-col divide-y divide-slate-100">
              {PREFS.map((p) => (
                <li key={p.name}>
                  <label className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-2">
                    <span>
                      <span className="block text-sm text-ink">{p.label}</span>
                      <span className="block text-[13px] text-slate-500">{p.hint}</span>
                    </span>
                    <input type="checkbox" name={p.name} defaultChecked={prefs ? Boolean(prefs[p.name]) : true} className="h-5 w-5 shrink-0 accent-[var(--color-ink)]" />
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <SubmitButton>Save settings</SubmitButton>
            </div>
          </ActionForm>
        </Panel>

        <InstallPrompt variant="inline" />

        <Panel>
          <h2 className="text-[15px] font-semibold text-ink">Account</h2>
          <p className="mt-1 text-sm text-slate-500">Signed in as {user.email}</p>
        </Panel>

        <Panel className="border-[#f3cdc6]">
          <h2 className="text-[15px] font-semibold text-danger">Delete my Camus Learn data</h2>
          <Notice tone="danger" className="mt-3">
            This permanently deletes your Career Twin, conversations, resumes, analyses, interviews, projects and progress. It can&apos;t be undone.
          </Notice>
          <form action={deleteLearnData} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <Field label='Type "DELETE" to confirm' htmlFor="confirm" className="flex-1">
              <Input id="confirm" name="confirm" autoComplete="off" required pattern="[Dd][Ee][Ll][Ee][Tt][Ee]" />
            </Field>
            <SubmitButton variant="danger">Delete data</SubmitButton>
          </form>
        </Panel>
      </div>
    </Page>
  );
}
