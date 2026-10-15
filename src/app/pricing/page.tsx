import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PublicChrome } from "@/components/PublicChrome";
import { Container } from "@/components/ui/Container";
import { NetworkMark } from "@/components/brand/Logo";
import { AppIcon } from "@/components/brand/AppIcon";
import { FinalCTA } from "@/components/home/HomeSections";
import { compare, demo, formatINR, plans, pricingFaq } from "@/lib/pricing";
import { whatsappLink } from "@/lib/site-config";
import { apps } from "@/lib/apps";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Pricing — Camus One and Camus apps | Camus Labs",
  description: "Simple pricing: a one-time setup by our team and a monthly plan. Camus One gives you every app on one login, one data layer and one bill.",
  alternates: { canonical: "/pricing" },
};

const included = ["Setup by our team — your data entered for you", "Staff training", "Works on phone, tablet and computer", "Regular updates at no extra cost", "Backups and data export anytime", "Direct support from the team that built it"];

export default function PricingPage() {
  const withPlans = apps.filter((a) => a.href?.startsWith("/products/"));
  return (
    <PublicChrome>
      <section className="bg-cloud">
        <Container className="flex flex-col items-center py-16 text-center md:py-20">
          <NetworkMark className="h-14 w-14" />
          <h1 className="mt-6 max-w-[860px] text-balance text-[38px] font-semibold leading-[1.1] tracking-tight text-ink md:text-[54px]">Simple pricing. Setup and support included.</h1>
          <p className="mt-5 max-w-[720px] text-lg leading-relaxed text-slate-600 md:text-xl">You pay a one-time setup to fit Camus to your business, and a monthly or yearly plan. No hidden charges — everything is agreed in writing.</p>
        </Container>
      </section>

      <Container className="py-16">
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <li key={p.id} className={cn("flex flex-col gap-4 rounded-3xl border bg-white p-7", p.popular ? "border-signal shadow-md" : "border-slate-200")}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-2xl font-semibold text-ink">{p.name}</p>
                {p.popular && <span className="rounded-full bg-signal-50 px-3 py-1 text-xs font-semibold text-signal-dark">Most chosen</span>}
              </div>
              <p className="min-h-[48px] text-base text-slate-600">{p.for}</p>
              <p>
                {p.monthly != null ? (
                  <><span className="text-[34px] font-semibold tracking-tight text-ink">{formatINR(p.monthly)}</span><span className="text-[15px] text-slate-600"> /month</span></>
                ) : (
                  <span className="text-[26px] font-semibold tracking-tight text-ink">Contact sales</span>
                )}
              </p>
              <p className="text-sm font-medium text-slate-600">{p.monthly != null ? "+ one-time setup by our team" : "+ one-time setup, quoted for your business"}</p>
              <Link href="/contact" className={cn("rounded-full px-5 py-3 text-center text-base font-semibold", p.popular || p.monthly != null ? "bg-signal text-white hover:bg-signal-dark" : "border border-slate-300 text-ink hover:border-signal")}>{p.monthly != null ? "Get started" : "Talk to sales"}</Link>
              <a href="#demo" className="-mt-1 text-center text-[15px] font-semibold text-signal-dark hover:text-ink">Request a demo</a>
              <ul className="mt-1 grid gap-2.5 border-t border-slate-200 pt-5">
                {p.limits.map((l) => <li key={l} className="flex gap-2.5 text-[15px] font-medium text-slate-800"><Check size={19} className="shrink-0 text-signal" />{l}</li>)}
              </ul>
            </li>
          ))}
        </ul>

        <div id="demo" className="mt-10 grid scroll-mt-28 grid-cols-1 items-center gap-8 rounded-3xl bg-navy p-7 text-white md:p-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9CC3E0]">Request a demo</p>
            <p className="mt-2 text-[28px] font-semibold leading-tight tracking-tight md:text-[34px]">See Camus working for your business — {formatINR(demo.fee)}</p>
            <p className="mt-2 text-lg text-slate-200">{demo.duration} with our solutions team.</p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {demo.points.map((x) => <li key={x} className="flex gap-2.5 text-base font-medium text-slate-100"><Check size={20} className="shrink-0 text-[#9CC3E0]" />{x}</li>)}
            </ul>
          </div>
          <a href={whatsappLink(`Hi Camus Labs, I'd like to book the ${formatINR(demo.fee)} guided demo for my business.`)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-brand px-8 py-4 text-center text-base font-semibold text-white hover:bg-signal">Book a demo · {formatINR(demo.fee)}</a>
        </div>

        <div className="mt-10 rounded-3xl bg-signal-50 p-7 md:p-9">
          <p className="text-xl font-semibold text-ink">Included in every plan</p>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((i) => <li key={i} className="flex gap-2.5 text-base font-medium text-slate-800"><Check size={20} className="shrink-0 text-signal" />{i}</li>)}
          </ul>
        </div>
      </Container>

      <Container className="pb-16">
        <h2 className="text-[30px] font-semibold tracking-tight text-ink md:text-[38px]">Compare plans</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[720px] border-collapse text-left text-base">
            <thead className="bg-cloud">
              <tr>
                <th className="px-5 py-4 font-semibold text-ink">Feature</th>
                {plans.map((p) => <th key={p.id} className="px-5 py-4 font-semibold text-ink">{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {compare.map((r) => (
                <tr key={r.feature} className="border-t border-slate-200">
                  <td className="px-5 py-4 font-medium text-slate-700">{r.feature}</td>
                  {r.values.map((v, i) => <td key={i} className="px-5 py-4 font-medium text-ink">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      <section className="bg-cloud">
        <Container className="py-16">
          <h2 className="text-[30px] font-semibold tracking-tight text-ink md:text-[38px]">Industry app plans</h2>
          <p className="mt-2 text-lg text-slate-600">Some industry apps have their own monthly plans.</p>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {withPlans.map((a) => (
              <li key={a.slug}>
                <Link href={`${a.href}#pricing`} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 hover:border-signal">
                  <AppIcon app={a} className="h-11 w-11" />
                  <span className="flex-1"><span className="block text-lg font-semibold text-ink">Camus {a.name}</span><span className="block text-[15px] text-slate-600">{a.line}</span></span>
                  <ArrowRight size={18} className="text-signal" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="py-16">
        <h2 className="text-[30px] font-semibold tracking-tight text-ink md:text-[38px]">Pricing questions</h2>
        <div className="mt-8 grid gap-3">
          {pricingFaq.map((f) => (
            <details key={f.q} className="rounded-2xl border border-slate-200 px-6 py-5 open:bg-cloud">
              <summary className="cursor-pointer list-none text-lg font-semibold text-ink">{f.q}</summary>
              <p className="mt-3 text-[17px] leading-relaxed text-slate-700">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
      <FinalCTA />
    </PublicChrome>
  );
}
