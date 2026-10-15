import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { PublicChrome } from "@/components/PublicChrome";
import { Container } from "@/components/ui/Container";
import { AppIcon, StatusPill } from "@/components/brand/AppIcon";
import { FinalCTA } from "@/components/home/HomeSections";
import { appHref, getApp, type CamusApp } from "@/lib/apps";
import { getHub, hubs } from "@/lib/hubs";

export function generateStaticParams() {
  return hubs.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: PageProps<"/for/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const hub = getHub(slug);
  if (!hub) return { title: "Solutions — Camus Labs" };
  return { title: `${hub.hero.title} | Camus Labs`, description: hub.hero.sub, alternates: { canonical: `/for/${hub.slug}` } };
}

const nav = [
  { id: "apps", label: "Apps" },
  { id: "segments", label: "Who it's for" },
  { id: "ai", label: "AI" },
  { id: "faq", label: "FAQ" },
];

export default async function HubPage({ params }: PageProps<"/for/[slug]">) {
  const { slug } = await params;
  const hub = getHub(slug);
  if (!hub) notFound();
  const hubApps = hub.apps.map(getApp).filter(Boolean) as CamusApp[];
  const icon = getApp(hub.iconApp)!;

  const faqLd = hub.faq && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hub.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <PublicChrome>
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <div className="sticky top-[72px] z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <Container className="flex h-14 items-center gap-6 overflow-x-auto">
          <span className="flex shrink-0 items-center gap-2.5">
            <AppIcon app={icon} className="h-8 w-8" />
            <span className="leading-tight"><span className="block text-xs font-semibold text-slate-500">Camus for</span><span className="block text-[15px] font-semibold text-ink">{hub.name}</span></span>
          </span>
          <nav aria-label={`${hub.name} sections`} className="flex shrink-0 gap-5 text-[15px] font-semibold text-slate-700">
            {nav.filter((n) => n.id === "apps" || (n.id === "segments" && hub.segments) || (n.id === "ai" && hub.ai) || (n.id === "faq" && hub.faq)).map((n) => (
              <a key={n.id} href={`#${n.id}`} className="hover:text-signal-dark">{n.label}</a>
            ))}
          </nav>
          <Link href="/contact" className="ml-auto shrink-0 rounded-full bg-signal px-4 py-2 text-sm font-semibold text-white hover:bg-signal-dark">Get in touch</Link>
        </Container>
      </div>

      <section className="bg-cloud">
        <Container className="flex flex-col items-center py-20 text-center md:py-24">
          <AppIcon app={icon} className="h-16 w-16" />
          <h1 className="mt-6 max-w-[880px] text-balance text-[40px] font-semibold leading-[1.08] tracking-tight text-ink md:text-[60px]">{hub.hero.title}</h1>
          <p className="mt-5 max-w-[760px] text-lg leading-relaxed text-slate-600 md:text-[21px]">{hub.hero.sub}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="rounded-full bg-signal px-7 py-4 text-base font-semibold text-white hover:bg-signal-dark">Get in touch</Link>
            <a href="#apps" className="rounded-full border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-ink hover:border-signal">Explore the apps</a>
          </div>
        </Container>
      </section>

      <section id="apps" className="scroll-mt-32">
        <Container className="py-20">
          <h2 className="text-[32px] font-semibold tracking-tight text-ink md:text-[42px]">{hub.name} runs better on Camus</h2>
          <p className="mt-3 text-lg text-slate-600">Start with what you need. Every app shares the same customers, stock and sales data.</p>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {hubApps.map((a) => (
              <li key={a.slug}>
                <Link href={appHref(a)} className="group flex h-full flex-col gap-3 rounded-2xl border border-slate-200 p-6 transition-all hover:border-signal hover:shadow-md">
                  <div className="flex items-start justify-between gap-3"><AppIcon app={a} className="h-11 w-11" /><StatusPill status={a.status} /></div>
                  <p className="text-xl font-semibold text-ink">{a.name}</p>
                  <p className="text-base leading-relaxed text-slate-700">{a.line}</p>
                  <span className="mt-auto inline-flex items-center gap-1 text-[15px] font-semibold text-signal-dark">Learn more <ArrowRight size={15} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {hub.spotlight && (
        <Container className="pb-20">
          <div className="rounded-3xl bg-signal-50 p-8 md:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-signal">Spotlight</p>
            <h2 className="mt-2 text-[30px] font-semibold tracking-tight text-ink md:text-[38px]">{hub.spotlight.title}</h2>
            <p className="mt-4 max-w-[760px] text-lg leading-relaxed text-slate-700">{hub.spotlight.body}</p>
            <ul className="mt-6 grid gap-2.5 md:grid-cols-3">
              {hub.spotlight.points.map((p) => <li key={p} className="flex gap-2.5 text-base font-medium text-slate-800"><Check size={20} className="shrink-0 text-signal" />{p}</li>)}
            </ul>
          </div>
        </Container>
      )}

      {hub.ai && (
        <section id="ai" className="scroll-mt-32 bg-navy text-white">
          <Container className="py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9CC3E0]">Camus AI</p>
            <h2 className="mt-2 text-[32px] font-semibold tracking-tight md:text-[42px]">AI that works on your business data</h2>
            <ul className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              {hub.ai.map((a) => (
                <li key={a.title} className="border-t border-white/20 pt-6">
                  <p className="text-xl font-semibold">{a.title}</p>
                  <p className="mt-2 text-[17px] leading-relaxed text-slate-200">{a.line}</p>
                  <p className="mt-3 text-sm font-semibold text-[#9CC3E0]">{a.status === "request" ? "Built on request" : a.status === "ready" ? "Ready to set up" : "In use today"}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {hub.segments && (
        <section id="segments" className="scroll-mt-32">
          <Container className="py-20">
            <h2 className="text-[32px] font-semibold tracking-tight text-ink md:text-[42px]">{hub.kind === "industry" ? `${hub.name} businesses we serve` : "Who it's for"}</h2>
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hub.segments.map((s) => (
                <li key={s.name} className="rounded-2xl border border-slate-200 p-6">
                  <p className="text-xl font-semibold text-ink">{s.name}</p>
                  <p className="mt-2 text-base leading-relaxed text-slate-700">{s.line}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {hub.needs && (
        <section className="bg-cloud">
          <Container className="py-20">
            <h2 className="text-[32px] font-semibold tracking-tight text-ink md:text-[42px]">A suite for every part of your business</h2>
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {hub.needs.map((n) => (
                <li key={n.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <p className="text-sm font-semibold text-signal-dark">For {n.for.toLowerCase()}</p>
                  <p className="mt-2 text-xl font-semibold text-ink">{n.title}</p>
                  <p className="mt-2 text-base leading-relaxed text-slate-700">{n.line}</p>
                  <p className="mt-4 text-sm font-semibold text-slate-600">Built with: {n.apps.map((s) => `Camus ${getApp(s)?.name}`).join(" · ")}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {(hub.checklist || hub.integrations) && (
        <Container className="grid grid-cols-1 gap-12 py-20 lg:grid-cols-2">
          {hub.checklist && (
            <div>
              <h2 className="text-[28px] font-semibold tracking-tight text-ink md:text-[34px]">Everything you need, day one</h2>
              <ul className="mt-6 grid gap-3">
                {hub.checklist.map((c) => <li key={c} className="flex gap-3 text-[17px] font-medium text-slate-800"><Check size={22} className="shrink-0 text-signal" />{c}</li>)}
              </ul>
            </div>
          )}
          {hub.integrations && (
            <div>
              <h2 className="text-[28px] font-semibold tracking-tight text-ink md:text-[34px]">Integrations</h2>
              <ul className="mt-6 grid gap-2.5">
                {hub.integrations.map((i) => (
                  <li key={i.name} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-5 py-3.5">
                    <span className="text-[17px] font-medium text-slate-800">{i.name}</span>
                    <span className={i.status === "Live" ? "rounded-full bg-[#E6F4EE] px-3 py-1 text-xs font-semibold text-[#146C4B]" : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"}>{i.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      )}

      <section className="bg-cloud">
        <Container className="grid grid-cols-1 gap-10 py-20 lg:grid-cols-2">
          <div>
            <h2 className="text-[28px] font-semibold tracking-tight text-ink md:text-[34px]">Your data is safe</h2>
            <ul className="mt-6 grid gap-3 text-[17px] font-medium text-slate-800">
              {["Role-based access for every team member", "Encrypted connections", "Audit log of important changes", "Regular backups, export anytime", "We never sell your data or run ads on it"].map((x) => <li key={x} className="flex gap-3"><Check size={22} className="shrink-0 text-signal" />{x}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-[28px] font-semibold tracking-tight text-ink md:text-[34px]">Customised for your requirements</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-700">No two businesses are the same. Our solutions team studies how you work, recommends the right combination of Camus apps, and builds the changes you need on the platform with Camus Studio.</p>
            <Link href="/apps/studio" className="mt-5 inline-flex items-center gap-1 text-base font-semibold text-signal-dark">Share your requirement <ArrowRight size={17} /></Link>
          </div>
        </Container>
      </section>

      {hub.faq && (
        <section id="faq" className="scroll-mt-32">
          <Container className="py-20">
            <h2 className="text-[32px] font-semibold tracking-tight text-ink md:text-[42px]">Frequently asked questions</h2>
            <div className="mt-8 grid gap-3">
              {hub.faq.map((f) => (
                <details key={f.q} className="group rounded-2xl border border-slate-200 px-6 py-5 open:bg-cloud">
                  <summary className="cursor-pointer list-none text-lg font-semibold text-ink">{f.q}</summary>
                  <p className="mt-3 text-[17px] leading-relaxed text-slate-700">{f.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>
      )}
      <FinalCTA title={`Run your ${hub.kind === "industry" ? hub.name.toLowerCase() + " business" : "business"} better with Camus.`} />
    </PublicChrome>
  );
}
