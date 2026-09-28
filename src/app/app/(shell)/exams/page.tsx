import Link from "next/link";
import { requireLearner } from "@/lib/learn/server";
import { Page } from "@/components/learn/Page";
import { EmptyState, PageHeader } from "@/components/learn/ui";
import { GraduationCap } from "lucide-react";

export const metadata = { title: "Exam preparation" };

export default async function ExamsPage() {
  const { supabase, profile } = await requireLearner();
  const [{ data: exams }, { data: countries }] = await Promise.all([
    supabase.from("learn_exams").select("slug, name, country_code, description, subjects").eq("is_active", true).order("name"),
    supabase.from("learn_countries").select("code, name"),
  ]);
  const cname = (c: string | null) => (c ? countries?.find((x) => x.code === c)?.name ?? c : "International");
  const goals = new Set((profile?.exam_goals ?? []).map((g) => g.toLowerCase()));
  const all = exams ?? [];
  const mine = all.filter((e) => goals.has(e.name.toLowerCase()));
  // Group: your country, international, other countries.
  const groups = [
    { title: "Your goals", items: mine },
    { title: profile?.country_code ? `${cname(profile.country_code)}` : "Your country", items: all.filter((e) => e.country_code && e.country_code === profile?.country_code && !mine.includes(e)) },
    { title: "International", items: all.filter((e) => !e.country_code && !mine.includes(e)) },
    { title: "Other countries", items: all.filter((e) => e.country_code && e.country_code !== profile?.country_code && !mine.includes(e)) },
  ].filter((g) => g.items.length);

  return (
    <Page>
      <PageHeader eyebrow="Exam preparation" title="Prepare for your exams" description="Country → exam → subject → topic → questions → mock test → analytics. Timed practice with explanations for every answer." />
      {groups.length === 0 ? (
        <EmptyState icon={<GraduationCap size={20} />} title="No exams configured yet" description="An administrator can add exams for your country from the admin panel." />
      ) : (
        groups.map((g) => (
          <section key={g.title} className="mb-8">
            <h2 className="mb-3 text-[13px] font-medium text-slate-500">{g.title}</h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((e) => (
                <li key={e.slug}>
                  <Link href={`/app/exams/${e.slug}`} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-paper p-5 hover:border-slate-400">
                    <p className="text-xs text-slate-400">{cname(e.country_code)}</p>
                    <h3 className="mt-1 text-[15px] font-semibold text-ink">{e.name}</h3>
                    <p className="mt-1 flex-1 text-[13px] text-slate-500">{e.description}</p>
                    <p className="mt-3 text-xs text-slate-400">{e.subjects.join(" · ")}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
      <p className="text-xs text-slate-400">Camus is an independent practice tool and is not affiliated with any exam body. Always check official syllabi and dates with the organising authority.</p>
    </Page>
  );
}
