import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PublicChrome } from "@/components/PublicChrome";
import { Container } from "@/components/ui/Container";
import { AppIcon, StatusDot } from "@/components/brand/AppIcon";
import { NetworkMark } from "@/components/brand/Logo";
import { FinalCTA } from "@/components/home/HomeSections";
import { APP_COUNT, appHref, getApp, appsByCategory, appsForGoal, goals, statusLabel, type CamusApp, type GoalSlug } from "@/lib/apps";
import { cn } from "@/lib/cn";
import { ScreenFrame } from "@/components/product/ScreenFrame";
import { appDetails } from "@/lib/app-details";

const featured = ["pos", "billing", "inventory", "crm", "restaurant-pos", "clinic"];

export const metadata: Metadata = {
  title: `All apps — ${APP_COUNT} business apps on one platform | Camus Labs`,
  description: "CRM, billing, POS, inventory, ERP, HR, payroll, AI and industry apps for clinics, retail, restaurants, PG, gold loan and more — on one platform, set up for you.",
  alternates: { canonical: "/products" },
};

function AppCard({ app }: { app: CamusApp }) {
  return (
    <Link href={appHref(app)} className="group flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-signal hover:shadow-md">
      <div className="flex items-center gap-3.5">
        <AppIcon app={app} className="h-11 w-11" />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Camus</p>
          <p className="text-xl font-semibold leading-tight text-ink">{app.name}</p>
        </div>
      </div>
      <p className="text-base leading-relaxed text-slate-700">{app.line}</p>
      <span className="mt-auto flex items-center justify-between pt-1">
        <span className="inline-flex items-center gap-1 text-[15px] font-semibold text-signal-dark">Learn more <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600"><StatusDot status={app.status} />{statusLabel[app.status]}</span>
      </span>
    </Link>
  );
}

export default async function AllAppsPage({ searchParams }: PageProps<"/products">) {
  const sp = await searchParams;
  const goalParam = typeof sp.goal === "string" ? sp.goal : undefined;
  const goal = goals.find((g) => g.slug === goalParam);
  const groups = appsByCategory();

  return (
    <PublicChrome>
      <section className="relative overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,#3D85B8_0%,#2C6E9E_45%,#1C4A6E_100%)] text-white">
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-[0.12]" preserveAspectRatio="none">
          <defs><pattern id="net-all" width="56" height="48" patternUnits="userSpaceOnUse"><path d="M0 48 28 0l28 48" fill="none" stroke="white" strokeWidth="1" /><circle cx="28" cy="0" r="2" fill="white" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#net-all)" />
        </svg>
        <Container className="relative py-16 text-center md:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#A9D4F5]">All apps</p>
          <h1 className="mx-auto mt-4 max-w-[980px] text-balance text-[40px] font-semibold leading-[1.08] tracking-tight md:text-[64px]"><span className="text-[#CFE6F8]">Every app your business needs.</span> One platform. Set up for you.</h1>
          <p className="mx-auto mt-6 max-w-[780px] text-lg leading-relaxed text-slate-100 md:text-[21px]">{APP_COUNT} apps that share one login and one data layer. Start with the apps you need — our team sets them up, moves your data and trains your staff.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-5 text-[15px] font-medium text-slate-100">
            {(["live", "ready", "request"] as const).map((s) => <span key={s} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20"><StatusDot status={s} />{statusLabel[s]}</span>)}
          </div>
          <p className="mt-10 text-[15px] font-semibold text-slate-200">What do you want to do?</p>
          <div className="mx-auto mt-3 flex max-w-[1000px] flex-wrap justify-center gap-2">
            <Link href="/products" className={cn("rounded-full px-4 py-2.5 text-[15px] font-semibold", !goal ? "bg-white text-[#1C4A6E]" : "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20")}>All apps</Link>
            {goals.map((g) => (
              <Link key={g.slug} href={`/products?goal=${g.slug}`} className={cn("rounded-full px-4 py-2.5 text-[15px] font-semibold", goal?.slug === g.slug ? "bg-white text-[#1C4A6E]" : "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20")}>{g.label}</Link>
            ))}
          </div>
        </Container>
      </section>

      {!goal && (
        <section className="bg-cloud">
          <Container className="py-16 md:py-20">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-signal">Featured apps</p>
              <h2 className="mt-3 text-balance text-[32px] font-semibold tracking-tight text-ink md:text-[44px]">The apps businesses start with</h2>
            </div>
            <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((slug) => {
                const a = getApp(slug)!; const d = appDetails[slug];
                return (
                  <li key={slug}>
                    <Link href={appHref(a)} className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-signal hover:shadow-[0_30px_60px_-30px_rgba(44,110,158,0.55)]">
                      <div className="bg-[linear-gradient(160deg,#2C6E9E,#1C4A6E)] px-6 pt-6"><ScreenFrame id={d.screen} className="rounded-b-none border-b-0 shadow-none" /></div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center gap-3"><AppIcon app={a} className="h-11 w-11" /><div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Camus</p><p className="text-xl font-semibold leading-tight text-ink">{a.name}</p></div><span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600"><StatusDot status={a.status} />{statusLabel[a.status]}</span></div>
                        <p className="mt-4 flex-1 text-[17px] font-medium leading-snug text-slate-800">{d.headline}</p>
                        <span className="mt-5 inline-flex items-center gap-1 text-[15px] font-semibold text-signal-dark">Explore Camus {a.name} <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" /></span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      )}

      <Container className="py-14 md:py-16">
        <div className="flex flex-col gap-6 rounded-3xl bg-navy p-7 text-white md:flex-row md:items-center md:p-9">
          <NetworkMark className="h-16 w-16 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9CC3E0]">All-in-one suite</p>
            <p className="mt-1 text-2xl font-semibold md:text-[28px]">Camus One — every app, one subscription</p>
            <p className="mt-1 text-[17px] text-slate-200">One login, shared data across all apps, one monthly bill, one support team.</p>
          </div>
          <Link href="/pricing" className="shrink-0 self-start rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-white hover:bg-signal md:self-auto">See Camus One plans</Link>
        </div>

        {goal ? (
          <div className="mt-14">
            <h2 className="text-[28px] font-semibold tracking-tight text-ink">{goal.label}</h2>
            <p className="mt-1 text-lg text-slate-600">{goal.line}</p>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {appsForGoal(goal.slug as GoalSlug).map((a) => <li key={a.slug}><AppCard app={a} /></li>)}
            </ul>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-14 lg:flex-row">
            <nav aria-label="Categories" className="lg:sticky lg:top-24 lg:h-fit lg:w-56 lg:shrink-0">
              <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
                {groups.map((g) => (
                  <li key={g.name} className="shrink-0"><a href={`#${g.name.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="block whitespace-nowrap rounded-lg px-3 py-2 text-[15px] font-semibold text-slate-700 hover:bg-cloud hover:text-signal-dark">{g.name}</a></li>
                ))}
              </ul>
            </nav>
            <div className="flex min-w-0 flex-1 flex-col gap-14">
              {groups.map((g) => (
                <section key={g.name} id={g.name.toLowerCase().replace(/[^a-z]+/g, "-")} className="scroll-mt-28">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h2 className="text-[26px] font-semibold tracking-tight text-ink">{g.name}</h2>
                    <p className="text-[17px] text-slate-600">{g.line}</p>
                  </div>
                  <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {g.apps.map((a) => <li key={a.slug}><AppCard app={a} /></li>)}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        )}
      </Container>
      <FinalCTA title="Not sure which apps you need?" />
    </PublicChrome>
  );
}
