import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Check, Minus, MessageCircle, ChevronDown } from "lucide-react";
import { PublicChrome } from "@/components/PublicChrome";
import { Container } from "@/components/ui/Container";
import { AppIcon } from "@/components/brand/AppIcon";
import { FinalCTA } from "@/components/home/HomeSections";
import { ScreenFrame } from "@/components/product/ScreenFrame";
import { FeatureExplorer } from "@/components/product/FeatureExplorer";
import type { ScreenId } from "@/components/product/ProductScreens";
import { apps, appHref, getApp, statusLabel, type CamusApp } from "@/lib/apps";
import { appDetails, genericFaq, type AppDetail } from "@/lib/app-details";
import { hubs } from "@/lib/hubs";
import { plans, demo, formatINR } from "@/lib/pricing";
import { demoBookingLink } from "@/lib/site-config";
import { cn } from "@/lib/cn";

/** Screen shown for apps that have no rich detail entry. */
const screenFor: Record<string, ScreenId> = { leads: "crm", campaigns: "crm", quotes: "invoice", "field-sales": "crm", inbox: "crm", commerce: "pos", loyalty: "pos", pay: "invoice", books: "invoice", expense: "invoice", payroll: "people", attendance: "people", recruit: "people", purchase: "inventory", manufacturing: "inventory", analytics: "dashboard", reports: "dashboard", pharmacy: "inventory", "ai-scribe": "clinic", desk: "stay", "chit-savings": "loan" };

export function generateStaticParams() {
  return apps.filter((a) => !a.href).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/apps/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) return { title: "Apps — Camus Labs" };
  const d = appDetails[slug];
  return {
    title: `Camus ${app.name} — ${d ? d.headline : app.line} | Camus Labs`,
    description: d ? d.sub : `${app.line} Part of the Camus Labs business platform, set up for you by our team.`,
    alternates: { canonical: `/apps/${app.slug}` },
  };
}

/** Builds a lighter page model for apps without a rich entry, so every app page has the same polish. */
function fallback(app: CamusApp): AppDetail & { light: true } {
  const usedIn = hubs.filter((h) => h.apps.includes(app.slug));
  const feats = app.features ?? [];
  return {
    light: true,
    headline: app.line,
    sub: `Camus ${app.name} runs on the same login and data as every other Camus app — configured for your business and supported by our team.`,
    screen: screenFor[app.slug] ?? "dashboard",
    helps: [
      ...feats.slice(0, 4).map((f) => ({ title: f, body: `Included in Camus ${app.name} and connected to the rest of your Camus apps.` })),
      ...(feats.length < 3 ? [
        { title: "Set up for you", body: "We configure the app for your workflow and enter your data." },
        { title: "Connected", body: "One login and one data layer shared with every other Camus app." },
        { title: "Trained and supported", body: "Your team is trained, and our team stays on call after go-live." },
      ] : []),
    ].slice(0, 4),
    explore: [], day: [], compare: [],
    groups: feats.length ? [{ name: "What you get", items: feats }] : [],
    forWho: usedIn.map((h) => ({ name: h.name, line: h.line, hub: h.slug })),
    works: [],
    faq: genericFaq,
  };
}

const nav = [["benefits", "How it helps"], ["features", "Features"], ["industries", "Who it's for"], ["pricing", "Pricing"], ["faq", "FAQ"]] as const;

function SectionHead({ eyebrow, title, sub, light }: { eyebrow: string; title: string; sub?: string; light?: boolean }) {
  return (
    <div className="mx-auto max-w-[820px] text-center">
      <p className={cn("text-sm font-bold uppercase tracking-[0.16em]", light ? "text-[#A9D4F5]" : "text-signal")}>{eyebrow}</p>
      <h2 className={cn("mt-3 text-balance text-[32px] font-semibold leading-[1.15] tracking-tight md:text-[44px]", light ? "text-white" : "text-ink")}>{title}</h2>
      {sub && <p className={cn("mx-auto mt-4 max-w-[680px] text-lg leading-relaxed md:text-xl", light ? "text-slate-200" : "text-slate-600")}>{sub}</p>}
    </div>
  );
}

export default async function AppPage({ params }: PageProps<"/apps/[slug]">) {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) notFound();
  if (app.href) redirect(app.href);

  const d: AppDetail & { light?: boolean } = appDetails[slug] ?? fallback(app);
  const demoLink = demoBookingLink(app.name);
  const related = apps.filter((a) => a.category === app.category && a.slug !== app.slug).slice(0, 3);
  const starter = plans[0];
  const [lead, ...rest] = d.headline.split(/(?<=\.)\s/);

  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: d.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const productLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: `Camus ${app.name}`, applicationCategory: "BusinessApplication", operatingSystem: "Web", description: d.sub, offers: { "@type": "Offer", price: starter.monthly, priceCurrency: "INR" } };

  return (
    <PublicChrome>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([faqLd, productLd]) }} />

      {/* Product bar — like a product's own site, inside the platform */}
      <div className="sticky top-[72px] z-40 border-b border-white/10 bg-[#1C4A6E]/95 backdrop-blur">
        <Container className="flex h-[60px] items-center gap-6">
          <Link href={`/apps/${app.slug}`} className="flex shrink-0 items-center gap-2.5 text-white">
            <AppIcon app={app} inverted className="h-9 w-9 ring-1 ring-white/25 rounded-[11px]" />
            <span className="leading-none"><span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A9D4F5]">Camus</span><span className="block text-[19px] font-semibold">{app.name}</span></span>
          </Link>
          <nav aria-label={`${app.name} sections`} className="ml-auto hidden items-center gap-1 lg:flex">
            {nav.filter(([id]) => (id === "industries" ? d.forWho.length > 0 : true)).map(([id, label]) => (
              <a key={id} href={`#${id}`} className="rounded-full px-4 py-2 text-[15px] font-semibold text-slate-100 hover:bg-white/10 hover:text-white">{label}</a>
            ))}
          </nav>
          <a href={demoLink} target="_blank" rel="noopener noreferrer" className="ml-auto shrink-0 rounded-full bg-white px-5 py-2.5 text-[15px] font-semibold text-[#1C4A6E] hover:bg-[#EAF2F8] lg:ml-2">Request a demo</a>
        </Container>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(120%_80%_at_50%_0%,#3D85B8_0%,#2C6E9E_40%,#1C4A6E_100%)] text-white">
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full opacity-[0.12]" preserveAspectRatio="none">
          <defs><pattern id="net" width="56" height="48" patternUnits="userSpaceOnUse"><path d="M0 48 28 0l28 48" fill="none" stroke="white" strokeWidth="1" /><circle cx="28" cy="0" r="2" fill="white" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#net)" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-[70px] bg-white sm:h-[130px] md:h-[200px] lg:h-[250px]" />
        <Container className="relative pt-14 text-center md:pt-20">
          <p className="text-[15px] font-semibold text-slate-200"><Link href="/products" className="hover:text-white">All apps</Link> <span className="text-slate-400">/</span> {app.category}</p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[14px] font-semibold ring-1 ring-white/25">
            <span className={cn("h-2 w-2 rounded-full", app.status === "live" ? "bg-[#5FD3A0]" : app.status === "ready" ? "bg-[#A9D4F5]" : "bg-slate-300")} />
            Camus {app.name} · {statusLabel[app.status]}
          </span>
          <h1 className="mx-auto mt-6 max-w-[1040px] text-balance text-[40px] font-semibold leading-[1.08] tracking-tight sm:text-[52px] md:text-[64px]">
            <span className="text-[#CFE6F8]">{lead}</span>{rest.length > 0 && <> {rest.join(" ")}</>}
          </h1>
          <p className="mx-auto mt-6 max-w-[780px] text-lg leading-relaxed text-slate-100 md:text-[21px]">{d.sub}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={demoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[17px] font-semibold text-[#1C4A6E] shadow-lg hover:bg-[#EAF2F8]"><MessageCircle size={20} />Request a demo</a>
            <Link href="/contact" className="rounded-full border border-white/50 px-8 py-4 text-[17px] font-semibold text-white hover:border-white hover:bg-white/10">Talk to our solutions team</Link>
          </div>
          <ul className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[15px] font-medium text-slate-100">
            {["Set up by our team", "GST-ready", "English & Tamil", "Data hosted in India"].map((t) => <li key={t} className="flex items-center gap-1.5"><Check size={17} className="text-[#A9D4F5]" strokeWidth={3} />{t}</li>)}
          </ul>
          {app.status === "request" && <p className="mx-auto mt-5 max-w-[680px] rounded-2xl bg-white/10 px-5 py-3 text-[15px] text-slate-100 ring-1 ring-white/20">This app is designed and built when a customer signs up — tell us your needs and we&apos;ll share the scope, timeline and price.</p>}
          <div className="relative mx-auto mt-12 max-w-[1120px] md:mt-14">
            <ScreenFrame id={d.screen} className="shadow-[0_40px_100px_-30px_rgba(10,25,40,0.6)]" />
          </div>
          <p className="relative mt-3 text-sm text-slate-500">Sample data shown for illustration.</p>
        </Container>
      </section>

      {/* How it helps */}
      <section id="benefits" className="scroll-mt-[140px]">
        <Container className="py-20 md:py-24">
          <SectionHead eyebrow="How it helps you" title={`What changes when you run on Camus ${app.name}`} />
          <ul className={cn("mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2", d.helps.length >= 4 && "lg:grid-cols-4", d.helps.length === 3 && "lg:grid-cols-3")}>
            {d.helps.map((h, k) => (
              <li key={h.title} className="group rounded-[22px] border border-slate-200 bg-white p-7 transition hover:-translate-y-0.5 hover:border-signal hover:shadow-[0_20px_50px_-30px_rgba(44,110,158,0.6)]">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-signal-50 text-xl font-bold text-signal">{String(k + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 text-[21px] font-semibold leading-snug text-ink">{h.title}</h3>
                <p className="mt-2.5 text-[16px] leading-relaxed text-slate-600">{h.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Feature explorer */}
      {d.explore.length > 0 && (
        <section id="features" className="scroll-mt-[140px] bg-cloud">
          <Container className="py-20 md:py-24">
            <SectionHead eyebrow="Features" title={`Everything Camus ${app.name} does for you`} sub="Pick a capability to see how it works." />
            <div className="mt-10"><FeatureExplorer items={d.explore} /></div>
          </Container>
        </section>
      )}

      {/* A day with */}
      {d.day.length > 0 && (
        <section className="bg-navy text-white">
          <Container className="py-20 md:py-24">
            <SectionHead light eyebrow="A day with Camus" title={`How Camus ${app.name} fits into your day`} />
            <ol className="relative mt-14 grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-6">
              <span aria-hidden="true" className="absolute left-[19px] top-2 bottom-2 w-px bg-white/15 md:left-0 md:right-0 md:top-[19px] md:bottom-auto md:h-px md:w-auto" />
              {d.day.map((s) => (
                <li key={s.time} className="relative pl-14 md:pl-0 md:pt-14">
                  <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full bg-brand ring-4 ring-navy"><span className="h-2.5 w-2.5 rounded-full bg-white" /></span>
                  <p className="text-[15px] font-bold text-[#A9D4F5]">{s.time}</p>
                  <h3 className="mt-1.5 text-[21px] font-semibold">{s.title}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-slate-300">{s.body}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* Before vs with */}
      {d.compare.length > 0 && (
        <section>
          <Container className="py-20 md:py-24">
            <SectionHead eyebrow="Before and after" title="From registers and guesswork to one clear system" />
            <div className="mx-auto mt-12 max-w-[980px] overflow-hidden rounded-[24px] border border-slate-200">
              <div className="grid grid-cols-2 bg-cloud text-[15px] font-bold uppercase tracking-[0.1em] md:text-base">
                <p className="px-5 py-4 text-slate-500 md:px-8">Without Camus</p>
                <p className="border-l border-slate-200 bg-signal px-5 py-4 text-white md:px-8">With Camus {app.name}</p>
              </div>
              {d.compare.map(([b, a]) => (
                <div key={b} className="grid grid-cols-2 border-t border-slate-200 text-[15px] md:text-[17px]">
                  <p className="flex gap-2.5 px-5 py-5 text-slate-600 md:px-8"><Minus size={20} className="mt-0.5 shrink-0 text-slate-400" />{b}</p>
                  <p className="flex gap-2.5 border-l border-slate-200 bg-signal-50/60 px-5 py-5 font-semibold text-ink md:px-8"><Check size={20} className="mt-0.5 shrink-0 text-signal" strokeWidth={3} />{a}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* All features */}
      {d.groups.length > 0 && (
        <section id={d.explore.length ? "all-features" : "features"} className={cn("scroll-mt-[140px]", d.compare.length ? "bg-cloud" : "")}>
          <Container className="py-20 md:py-24">
            <SectionHead eyebrow={d.explore.length ? "Complete feature list" : "Features"} title={d.explore.length ? "All features at a glance" : `What you get with Camus ${app.name}`} />
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {d.groups.map((g) => (
                <div key={g.name} className="rounded-[22px] border border-slate-200 bg-white p-7">
                  <h3 className="text-[20px] font-semibold text-ink">{g.name}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {g.items.map((it) => <li key={it} className="flex gap-2.5 text-[16px] text-slate-700"><Check size={18} className="mt-0.5 shrink-0 text-signal" strokeWidth={2.6} />{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Who it's for */}
      {d.forWho.length > 0 && (
        <section id="industries" className="scroll-mt-[140px]">
          <Container className="py-20 md:py-24">
            <SectionHead eyebrow="Who it's for" title={`Built for businesses like yours`} />
            <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {d.forWho.map((w) => {
                const inner = (
                  <>
                    <h3 className="text-[20px] font-semibold text-ink">{w.name}</h3>
                    <p className="mt-2 flex-1 text-[16px] leading-relaxed text-slate-600">{w.line}</p>
                    {w.hub && <span className="mt-5 inline-flex items-center gap-1 text-[15px] font-semibold text-signal">Camus for {hubs.find((h) => h.slug === w.hub)?.name} <ArrowRight size={16} /></span>}
                  </>
                );
                const cls = "flex h-full flex-col rounded-[22px] border border-slate-200 bg-gradient-to-br from-white to-cloud p-7";
                return <li key={w.name}>{w.hub ? <Link href={`/for/${w.hub}`} className={cn(cls, "hover:border-signal")}>{inner}</Link> : <div className={cls}>{inner}</div>}</li>;
              })}
            </ul>
          </Container>
        </section>
      )}

      {/* Works with */}
      {d.works.length > 0 && (
        <section className="border-y border-slate-200 bg-cloud">
          <Container className="flex flex-col gap-6 py-12 lg:flex-row lg:items-center">
            <div className="lg:w-[300px]"><h2 className="text-[26px] font-semibold tracking-tight text-ink">Works with</h2><p className="mt-1 text-[16px] text-slate-600">Hardware and services we connect to.</p></div>
            <ul className="flex flex-1 flex-wrap gap-3">
              {d.works.map((w) => (
                <li key={w.name} className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[15px] font-semibold text-slate-800">
                  {w.name}<span className={cn("rounded-full px-2 py-0.5 text-[12px] font-bold", w.status === "Live" ? "bg-[#E6F4EE] text-[#146C4B]" : "bg-slate-100 text-slate-600")}>{w.status}</span>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-[140px]">
        <Container className="py-20 md:py-24">
          <SectionHead eyebrow="Pricing" title="Simple pricing. No surprises." sub="Every plan is set up, trained and supported by our team." />
          <div className="mx-auto mt-12 grid max-w-[980px] grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col rounded-[24px] border-2 border-signal bg-white p-8">
              <p className="text-[15px] font-bold uppercase tracking-[0.12em] text-signal">{starter.name} plan</p>
              <p className="mt-3 flex items-baseline gap-1.5"><span className="text-[48px] font-semibold tracking-tight text-ink">{formatINR(starter.monthly ?? 0)}</span><span className="text-lg font-medium text-slate-600">/month</span></p>
              <p className="mt-1 text-[16px] text-slate-600">{starter.for} Camus {app.name} plus up to two more apps.</p>
              <ul className="mt-6 flex-1 space-y-2.5">{starter.limits.map((l) => <li key={l} className="flex gap-2.5 text-[16px] text-slate-700"><Check size={18} className="mt-0.5 shrink-0 text-signal" strokeWidth={2.6} />{l}</li>)}</ul>
              <Link href="/pricing" className="mt-8 rounded-full bg-signal px-6 py-4 text-center text-base font-semibold text-white hover:bg-signal-dark">See all plans</Link>
            </div>
            <div className="flex flex-col rounded-[24px] bg-navy p-8 text-white">
              <p className="text-[15px] font-bold uppercase tracking-[0.12em] text-[#A9D4F5]">Guided demo</p>
              <p className="mt-3 flex items-baseline gap-1.5"><span className="text-[48px] font-semibold tracking-tight">{formatINR(demo.fee)}</span><span className="text-lg font-medium text-slate-300">one time</span></p>
              <p className="mt-1 text-[16px] text-slate-300">{demo.duration} of Camus {app.name} on your own business.</p>
              <ul className="mt-6 flex-1 space-y-2.5">{demo.points.map((l) => <li key={l} className="flex gap-2.5 text-[16px] text-slate-200"><Check size={18} className="mt-0.5 shrink-0 text-[#A9D4F5]" strokeWidth={2.6} />{l}</li>)}</ul>
              <a href={demoLink} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-semibold text-[#1C4A6E] hover:bg-[#EAF2F8]"><MessageCircle size={19} />Request a demo on WhatsApp</a>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-[140px] bg-cloud">
        <Container className="py-20 md:py-24">
          <SectionHead eyebrow="FAQ" title="Questions, answered" />
          <div className="mx-auto mt-10 max-w-[860px] space-y-3">
            {d.faq.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white px-6 py-5 open:border-signal">
                <summary className="flex cursor-pointer list-none items-center gap-4 text-[18px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  <span className="flex-1">{f.q}</span><ChevronDown size={22} className="shrink-0 text-signal transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-[16px] leading-relaxed text-slate-700">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <Container className="pt-20">
          <h2 className="text-[28px] font-semibold tracking-tight text-ink">Works even better with</h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {related.map((a) => (
              <li key={a.slug}>
                <Link href={appHref(a)} className="flex h-full gap-4 rounded-2xl border border-slate-200 p-5 hover:border-signal">
                  <AppIcon app={a} className="h-12 w-12" />
                  <span><span className="block text-lg font-semibold text-ink">Camus {a.name}</span><span className="mt-0.5 block text-[15px] text-slate-600">{a.line}</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      )}
      <FinalCTA title={`Ready to see Camus ${app.name} on your business?`} />
    </PublicChrome>
  );
}
