import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AppIcon } from "@/components/brand/AppIcon";
import { NetworkMark } from "@/components/brand/Logo";
import { APP_COUNT, appHref, getApp, goals, type CamusApp } from "@/lib/apps";
import { hubs } from "@/lib/hubs";
import { createClient } from "@/lib/supabase/server";
import { ProductShowcase } from "@/components/product/ScreenFrame";

const pick = (slugs: string[]) => slugs.map(getApp).filter(Boolean) as CamusApp[];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold uppercase tracking-[0.14em] text-signal">{children}</p>;
}

function SectionHead({ eyebrow, title, sub, action }: { eyebrow?: string; title: string; sub?: string; action?: { href: string; label: string } }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-[760px]">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="mt-2 text-balance text-[32px] font-semibold leading-[1.15] tracking-tight text-ink md:text-[42px]">{title}</h2>
        {sub && <p className="mt-3 text-lg leading-relaxed text-slate-600 md:text-xl">{sub}</p>}
      </div>
      {action && (
        <Link href={action.href} className="inline-flex shrink-0 items-center gap-1.5 text-base font-semibold text-signal-dark hover:text-ink">
          {action.label} <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}

export function Hero() {
  return (
    <section className="bg-cloud">
      <Container className="flex flex-col items-center py-20 text-center md:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#D6E3EE] bg-white px-4 py-1.5 text-sm font-semibold text-slate-700">
          <span className="h-2 w-2 rounded-full bg-[#1F9D6C]" /> Made in Bharat · Built for the world
        </span>
        <h1 className="mt-7 max-w-[900px] text-balance text-[40px] font-semibold leading-[1.08] tracking-tight text-ink md:text-[64px]">
          Run your entire business on one platform.
        </h1>
        <p className="mt-6 max-w-[760px] text-lg leading-relaxed text-slate-600 md:text-[21px]">
          {APP_COUNT} connected apps for billing, ERP, CRM, HR and AI — set up for your industry by our team, and supported by the people who built it.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="rounded-full bg-signal px-7 py-4 text-base font-semibold text-white hover:bg-signal-dark">Talk to our solutions team</Link>
          <Link href="/products" className="rounded-full border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-ink hover:border-signal">Explore all apps</Link>
        </div>
        <p className="mt-6 text-base text-slate-600">
          Opening a new business? <Link href="/for/startups" className="font-semibold text-signal-dark hover:text-ink">Get your systems ready from day one →</Link>
        </p>
        <div className="mt-14 w-full max-w-[1120px]">
          <ProductShowcase />
        </div>
      </Container>
    </section>
  );
}

export function Goals() {
  return (
    <section>
      <Container className="pt-16 md:pt-20">
        <div className="rounded-3xl border border-slate-200 p-6 md:p-8">
          <p className="text-xl font-semibold text-ink">What do you want to do?</p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {goals.map((g) => (
              <li key={g.slug}>
                <Link href={`/products?goal=${g.slug}`} className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-2.5 text-[15px] font-semibold text-slate-800 transition-colors hover:border-signal hover:bg-signal-50 hover:text-signal-dark">
                  {g.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export function FeaturedApps() {
  const featured = pick(["crm", "billing", "erp", "pos", "people", "inventory"]);
  return (
    <section>
      <Container className="py-20 md:py-24">
        <SectionHead title="Featured apps" sub="Start with one app. Add more as you grow — they all work together." action={{ href: "/products", label: `Explore all ${APP_COUNT} apps` }} />
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((a) => (
            <li key={a.slug}>
              <Link href={appHref(a)} className="group flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:border-signal hover:shadow-md">
                <div className="flex items-center gap-4">
                  <AppIcon app={a} className="h-12 w-12" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Camus</p>
                    <p className="text-2xl font-semibold tracking-tight text-ink">{a.name}</p>
                  </div>
                </div>
                <p className="text-[17px] leading-relaxed text-slate-700">{a.line}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-[15px] font-semibold text-signal-dark">Learn more <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function PlatformOffers() {
  const studio = getApp("studio")!;
  const ai = getApp("ai-agents")!;
  return (
    <section>
      <Container className="pb-20 md:pb-24">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="flex flex-col gap-4 rounded-3xl bg-navy p-8 text-white">
            <NetworkMark className="h-14 w-14" />
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9CC3E0]">All-in-one suite</p>
            <h3 className="text-[28px] font-semibold leading-tight tracking-tight">Camus One — the operating system for your business</h3>
            <p className="text-[17px] leading-relaxed text-slate-200">All {APP_COUNT} apps on one login and one data layer, with one monthly bill and one support team.</p>
            <Link href="/pricing" className="mt-auto inline-flex items-center gap-1 text-base font-semibold text-white">Explore Camus One <ArrowRight size={17} /></Link>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl bg-signal-50 p-8">
            <AppIcon app={studio} inverted className="h-14 w-14" />
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-signal-dark">Custom solutions</p>
            <h3 className="text-[28px] font-semibold leading-tight tracking-tight text-ink">Camus Studio — built for your process</h3>
            <p className="text-[17px] leading-relaxed text-slate-700">Our team designs and builds the features you need on the platform. Fixed scope and price, in writing.</p>
            <Link href="/apps/studio" className="mt-auto inline-flex items-center gap-1 text-base font-semibold text-signal-dark">Share your requirement <ArrowRight size={17} /></Link>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl bg-cloud p-8">
            <AppIcon app={ai} inverted className="h-14 w-14" />
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-signal-dark">Artificial intelligence</p>
            <h3 className="text-[28px] font-semibold leading-tight tracking-tight text-ink">Camus AI — your digital workforce</h3>
            <p className="text-[17px] leading-relaxed text-slate-700">Agents that answer enquiries, follow up on dues and prepare reports using your own business data.</p>
            <Link href="/apps/ai-agents" className="mt-auto inline-flex items-center gap-1 text-base font-semibold text-signal-dark">See AI agents <ArrowRight size={17} /></Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function IndustryGrid() {
  const list = hubs.filter((h) => h.kind === "industry");
  return (
    <section className="bg-cloud">
      <Container className="py-20 md:py-24">
        <SectionHead eyebrow="Solutions" title="Built for your industry" sub="The same platform, pre-configured with the workflows and reports your industry needs." />
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((h) => (
            <li key={h.slug}>
              <Link href={`/for/${h.slug}`} className="group flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-signal hover:shadow-md">
                <AppIcon app={getApp(h.iconApp)!} className="h-11 w-11" />
                <span>
                  <span className="block text-sm font-semibold text-slate-500">Camus for</span>
                  <span className="block text-lg font-semibold text-ink">{h.name}</span>
                  <span className="mt-1 block text-[15px] leading-snug text-slate-600">{h.line}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function Audiences() {
  const items = [
    { eyebrow: "New businesses", title: "Open with your systems already running.", body: "GST billing, stock, staff and your website ready before opening day — set up by us, so you focus on customers.", points: ["Billing, GST and payments from the first sale", "Website and Google presence", "Add branches and apps anytime"], href: "/for/startups", cta: "Plan my launch setup", tone: "bg-[#EEF7F2]" },
    { eyebrow: "Established & large businesses", title: "Move off spreadsheets and disconnected tools.", body: "We map your current process, migrate your data and connect your existing systems — with a dedicated team and a written plan.", points: ["Multi-branch, multi-user, role-based access", "Migration from Excel, Tally or legacy software", "Integrations with systems you already use"], href: "/for/enterprise", cta: "Talk to our solutions team", tone: "bg-signal-50" },
  ];
  return (
    <section>
      <Container className="grid grid-cols-1 gap-5 py-20 md:py-24 lg:grid-cols-2">
        {items.map((i) => (
          <div key={i.eyebrow} className={`rounded-3xl p-8 md:p-10 ${i.tone}`}>
            <Eyebrow>{i.eyebrow}</Eyebrow>
            <h3 className="mt-3 text-[28px] font-semibold leading-tight tracking-tight text-ink">{i.title}</h3>
            <p className="mt-3 text-[17px] leading-relaxed text-slate-700">{i.body}</p>
            <ul className="mt-5 grid gap-2.5">
              {i.points.map((p) => <li key={p} className="flex gap-2.5 text-base font-medium text-slate-800"><Check size={20} className="mt-0.5 shrink-0 text-signal" />{p}</li>)}
            </ul>
            <Link href={i.href} className="mt-7 inline-flex items-center gap-1 text-base font-semibold text-signal-dark">{i.cta} <ArrowRight size={17} /></Link>
          </div>
        ))}
      </Container>
    </section>
  );
}

export function HowWeWork() {
  const steps = [
    { title: "Consult", body: "Our solutions team studies how your business runs today." },
    { title: "Propose", body: "Fixed scope, timeline and price — in a written agreement." },
    { title: "Configure & migrate", body: "We set up the apps for your workflows and move your data." },
    { title: "Train & support", body: "Your teams are trained, and we stay accountable after go-live." },
  ];
  return (
    <section className="bg-navy text-white">
      <Container className="py-20 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9CC3E0]">How we work</p>
        <h2 className="mt-2 text-[32px] font-semibold tracking-tight md:text-[42px]">From first call to long-term support</h2>
        <ol className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t border-white/20 pt-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-base font-bold">{i + 1}</span>
              <p className="mt-4 text-xl font-semibold">{s.title}</p>
              <p className="mt-2 text-[17px] leading-relaxed text-slate-200">{s.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export function Principles() {
  const items = [
    { title: "Set up for you", body: "We configure the apps, move your data and train your staff." },
    { title: "Commitments in writing", body: "Scope, price and timelines agreed before work begins." },
    { title: "Your data is yours", body: "We never sell your data or run ads on it. Export anytime." },
    { title: "One accountable team", body: "The people who set it up are the people who support it." },
  ];
  return (
    <section>
      <Container className="py-20 md:py-24">
        <SectionHead title="Why businesses choose Camus" />
        <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <li key={i.title} className="border-l-[3px] border-brand pl-5">
              <p className="text-xl font-semibold text-ink">{i.title}</p>
              <p className="mt-2 text-[17px] leading-relaxed text-slate-700">{i.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Renders only when real, published case studies exist. */
export async function CustomerStories() {
  let rows: { slug: string; project_name: string; industry: string | null; problem: string | null }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("case_studies").select("slug, project_name, industry, problem").eq("is_published", true).order("updated_at", { ascending: false }).limit(3);
    rows = data ?? [];
  } catch {
    rows = [];
  }
  if (rows.length === 0) return null;
  return (
    <section className="bg-cloud">
      <Container className="py-20 md:py-24">
        <SectionHead title="Customer stories" sub="Real businesses running on Camus." action={{ href: "/projects", label: "All customer stories" }} />
        <ul className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {rows.map((r) => (
            <li key={r.slug}>
              <Link href={`/projects/${r.slug}`} className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-7 hover:border-signal">
                {r.industry && <span className="self-start rounded-full bg-signal-50 px-3 py-1 text-sm font-semibold text-signal-dark">{r.industry}</span>}
                <p className="text-xl font-semibold text-ink">{r.project_name}</p>
                {r.problem && <p className="line-clamp-3 text-base leading-relaxed text-slate-700">{r.problem}</p>}
                <span className="mt-auto inline-flex items-center gap-1 text-[15px] font-semibold text-signal-dark">Read the story <ArrowRight size={16} /></span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function FinalCTA({ title = "Ready to run your business on one platform?" }: { title?: string }) {
  return (
    <section>
      <Container className="py-20 md:py-24">
        <div className="flex flex-col items-center rounded-[28px] bg-navy px-6 py-14 text-center text-white md:px-16 md:py-16">
          <h2 className="max-w-[760px] text-balance text-[30px] font-semibold leading-tight tracking-tight md:text-[42px]">{title}</h2>
          <p className="mt-4 max-w-[680px] text-lg leading-relaxed text-slate-200">Tell us about your business. Our solutions team will share a clear proposal — scope, timeline and price.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="rounded-full bg-brand px-7 py-4 text-base font-semibold text-white hover:bg-signal">Talk to our solutions team</Link>
            <Link href="/products" className="rounded-full border border-white/30 px-7 py-4 text-base font-semibold text-white hover:border-white">Explore all apps</Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
