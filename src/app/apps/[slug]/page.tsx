import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { PublicChrome } from "@/components/PublicChrome";
import { Container } from "@/components/ui/Container";
import { AppIcon, StatusPill } from "@/components/brand/AppIcon";
import { FinalCTA } from "@/components/home/HomeSections";
import { apps, appHref, getApp } from "@/lib/apps";
import { hubs } from "@/lib/hubs";
import { demoBookingLink } from "@/lib/site-config";
import { demo as demoInfo, formatINR } from "@/lib/pricing";

export function generateStaticParams() {
  return apps.filter((a) => !a.href).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/apps/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) return { title: "Apps — Camus Labs" };
  return { title: `Camus ${app.name} — ${app.line} | Camus Labs`, description: app.line, alternates: { canonical: `/apps/${app.slug}` } };
}

const setup = [
  { title: "Set up for you", body: "We configure the app for your workflow and enter your data." },
  { title: "Connected", body: "Shares one login and one data layer with every other Camus app." },
  { title: "Trained and supported", body: "Your team is trained, and our team stays on call after go-live." },
];

export default async function AppPage({ params }: PageProps<"/apps/[slug]">) {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) notFound();
  if (app.href) redirect(app.href);

  const related = apps.filter((a) => a.category === app.category && a.slug !== app.slug).slice(0, 3);
  const usedIn = hubs.filter((h) => h.apps.includes(app.slug));
  const demo = demoBookingLink(`Hi Camus Labs, I'd like to book the ${formatINR(demoInfo.fee)} guided demo of Camus ${app.name}.`);
  const isStudio = app.slug === "studio";

  return (
    <PublicChrome>
      <section className="bg-cloud">
        <Container className="py-16 md:py-24">
          <p className="text-[15px] font-semibold text-slate-600"><Link href="/products" className="hover:text-signal-dark">All apps</Link> / {app.category}</p>
          <div className="mt-6 flex items-center gap-5">
            <AppIcon app={app} className="h-16 w-16 md:h-20 md:w-20" />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Camus</p>
              <h1 className="text-[40px] font-semibold leading-none tracking-tight text-ink md:text-[56px]">{app.name}</h1>
            </div>
          </div>
          <p className="mt-6 max-w-[760px] text-xl leading-relaxed text-slate-700 md:text-[22px]">{app.line}</p>
          <div className="mt-5"><StatusPill status={app.status} /></div>
          {app.status === "request" && (
            <p className="mt-3 max-w-[680px] text-base text-slate-600">This app is designed and built when a customer signs up — tell us your needs and we&apos;ll share the scope, timeline and price.</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-full bg-signal px-7 py-4 text-base font-semibold text-white hover:bg-signal-dark">{isStudio ? "Share your requirement" : "Talk to our solutions team"}</Link>
            <a href={demo} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-ink hover:border-signal">Request a demo · {formatINR(demoInfo.fee)}</a>
          </div>
        </Container>
      </section>

      {app.features && (
        <Container className="py-16 md:py-20">
          <h2 className="text-[30px] font-semibold tracking-tight text-ink md:text-[38px]">What you get</h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {app.features.map((f) => (
              <li key={f} className="flex gap-3 rounded-2xl border border-slate-200 p-5 text-[17px] font-medium text-slate-800"><Check size={22} className="shrink-0 text-signal" />{f}</li>
            ))}
          </ul>
        </Container>
      )}

      <Container className={app.features ? "pb-16 md:pb-20" : "py-16 md:py-20"}>
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {setup.map((s) => (
            <li key={s.title} className="border-l-[3px] border-brand pl-5">
              <p className="text-xl font-semibold text-ink">{s.title}</p>
              <p className="mt-2 text-[17px] leading-relaxed text-slate-700">{s.body}</p>
            </li>
          ))}
        </ul>
      </Container>

      {usedIn.length > 0 && (
        <section className="bg-cloud">
          <Container className="py-16">
            <h2 className="text-[26px] font-semibold tracking-tight text-ink">Part of these solutions</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {usedIn.map((h) => (
                <li key={h.slug}><Link href={`/for/${h.slug}`} className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-[15px] font-semibold text-slate-800 hover:border-signal hover:text-signal-dark">Camus for {h.name} <ArrowRight size={15} /></Link></li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {related.length > 0 && (
        <Container className="py-16">
          <h2 className="text-[26px] font-semibold tracking-tight text-ink">More {app.category.toLowerCase()} apps</h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {related.map((a) => (
              <li key={a.slug}>
                <Link href={appHref(a)} className="flex h-full gap-4 rounded-2xl border border-slate-200 p-5 hover:border-signal">
                  <AppIcon app={a} className="h-11 w-11" />
                  <span><span className="block text-lg font-semibold text-ink">{a.name}</span><span className="mt-0.5 block text-[15px] text-slate-600">{a.line}</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      )}
      <FinalCTA />
    </PublicChrome>
  );
}
