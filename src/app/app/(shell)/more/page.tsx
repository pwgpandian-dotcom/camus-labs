import { requireLearner } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { ActionRow, Panel } from "@/components/learn/ui";
import { NAV_SECTIONS } from "@/components/learn/nav";
import { getTranslator } from "@/lib/learn/i18n";
import { InstallPrompt } from "@/components/learn/InstallPrompt";
import { signOut } from "@/app/actions/auth";

export const metadata = { title: "More" };

/** Mobile hub for everything that doesn't fit in the bottom tab bar. */
export default async function MorePage() {
  const { profile } = await requireLearner();
  const t = getTranslator(profile?.locale);
  const minor = profile?.age_band === "under_13" || profile?.age_band === "13_17";
  const hiddenForMinors = ["/app/resume", "/app/jobs", "/app/interview", "/app/founder"];

  return (
    <Page width="narrow">
      <h1 className="mb-5 text-2xl font-semibold tracking-tight text-ink">More</h1>
      <div className="flex flex-col gap-4">
        {NAV_SECTIONS.filter((s) => s.titleKey).map((section) => (
          <Panel key={section.titleKey} className="p-2">
            <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">{t(section.titleKey!)}</p>
            {section.items
              .filter((i) => !(minor && hiddenForMinors.includes(i.href)))
              .map((item) => (
                <ActionRow key={item.href} href={item.href} icon={<item.icon size={18} />} title={t(item.labelKey)} />
              ))}
          </Panel>
        ))}
        <InstallPrompt variant="inline" />
        <form action={signOut}>
          <button type="submit" className="min-h-12 w-full rounded-2xl border border-slate-200 bg-paper text-sm font-medium text-danger hover:bg-slate-50">
            {t("nav.signOut")}
          </button>
        </form>
      </div>
    </Page>
  );
}
