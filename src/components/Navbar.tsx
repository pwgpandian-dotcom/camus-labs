"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo, NetworkMark } from "./brand/Logo";
import { AppIcon, StatusDot } from "./brand/AppIcon";
import { apps, appHref, appsForGoal, categories, getApp, goals, APP_COUNT, type CamusApp } from "@/lib/apps";
import { hubs } from "@/lib/hubs";

type Menu = "products" | "solutions" | "resources" | null;
type Tab = "goal" | "apps" | "industry" | "suites" | "ai";

const tabs: { id: Tab; label: string }[] = [
  { id: "goal", label: "By goal" },
  { id: "apps", label: "Apps" },
  { id: "industry", label: "By industry" },
  { id: "suites", label: "Suites" },
  { id: "ai", label: "AI" },
];

const industryHubs = hubs.filter((h) => h.kind === "industry");
const sizeHubs = hubs.filter((h) => h.kind === "size");

function groupsFor(tab: Tab): { title: string; line: string; apps: CamusApp[] }[] {
  if (tab === "goal") return goals.map((g) => ({ title: g.label, line: g.line, apps: appsForGoal(g.slug) }));
  if (tab === "apps") return categories.filter((c) => c.name !== "AI").map((c) => ({ title: c.name, line: c.line, apps: apps.filter((a) => a.category === c.name) }));
  if (tab === "industry") return industryHubs.map((h) => ({ title: h.name, line: h.line, apps: h.apps.map(getApp).filter(Boolean) as CamusApp[] }));
  if (tab === "ai") return [{ title: "Camus AI", line: "AI that works inside your Camus data.", apps: apps.filter((a) => a.category === "AI") }];
  return [{ title: "Suites", line: "Buy the platform the way that fits you.", apps: [getApp("studio")!] }];
}

function ProductsPanel({ onNavigate }: { onNavigate: () => void }) {
  const [tab, setTab] = useState<Tab>("goal");
  const [group, setGroup] = useState(0);
  const [q, setQ] = useState("");
  const groups = groupsFor(tab);
  const current = groups[Math.min(group, groups.length - 1)];
  const query = q.trim().toLowerCase();
  const results = query ? apps.filter((a) => (a.name + " " + a.line + " " + a.category).toLowerCase().includes(query)) : null;
  const shown = results ?? current.apps;

  return (
    <div className="mx-auto max-w-[1280px] overflow-hidden rounded-b-3xl border border-t-0 border-slate-200 bg-white shadow-md">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-cloud px-6">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => { setTab(t.id); setGroup(0); setQ(""); }}
            className={cn("relative px-4 py-4 text-[15px] font-semibold transition-colors", tab === t.id ? "text-signal-dark after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-signal" : "text-slate-600 hover:text-ink")}>
            {t.label}
          </button>
        ))}
        <Link href="/products" onClick={onNavigate} className="ml-auto inline-flex items-center gap-1 py-4 text-sm font-semibold text-signal-dark hover:text-ink">
          Explore all {APP_COUNT} apps <ArrowRight size={15} />
        </Link>
      </div>
      <div className="grid grid-cols-[260px_1fr_280px]">
        <div className="border-r border-slate-200 p-5">
          <label className="relative block">
            <span className="sr-only">Search apps</span>
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Billing, stock, salary…" className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-[15px] text-ink placeholder:text-slate-400 focus:border-signal focus:outline-none" />
          </label>
          <ul className="mt-4 flex max-h-[380px] flex-col gap-0.5 overflow-y-auto">
            {groups.map((g, i) => (
              <li key={g.title}>
                <button type="button" onClick={() => { setGroup(i); setQ(""); }}
                  className={cn("w-full rounded-lg px-3 py-2 text-left text-[15px] font-medium transition-colors", !results && i === group ? "bg-signal-50 text-signal-dark" : "text-slate-700 hover:bg-slate-50")}>
                  {g.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="max-h-[470px] overflow-y-auto p-7">
          {tab === "suites" && !results ? (
            <div className="grid grid-cols-2 gap-4">
              <Link href="/pricing" onClick={onNavigate} className="rounded-2xl bg-navy p-6 text-white">
                <NetworkMark className="h-11 w-11" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#9CC3E0]">All-in-one suite</p>
                <p className="mt-1 text-xl font-semibold">Camus One</p>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-200">Every app on one login and one data layer, with one bill and one support team.</p>
              </Link>
              <Link href="/apps/studio" onClick={onNavigate} className="rounded-2xl border border-slate-200 p-6 hover:border-signal">
                <AppIcon app={getApp("studio")!} className="h-11 w-11" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-signal-dark">Custom solutions</p>
                <p className="mt-1 text-xl font-semibold text-ink">Camus Studio</p>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">Your own features, built on the platform by our team.</p>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-xl font-semibold text-ink">{results ? `Results for “${q}”` : current.title}</p>
              {!results && <p className="mt-1 text-[15px] text-slate-600">{current.line}</p>}
              <ul className="mt-5 grid grid-cols-2 gap-3">
                {shown.map((a) => (
                  <li key={a.slug}>
                    <Link href={appHref(a)} onClick={onNavigate} className="flex h-full gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-signal hover:bg-cloud">
                      <AppIcon app={a} />
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 text-[16px] font-semibold text-ink">{a.name} <StatusDot status={a.status} /></span>
                        <span className="mt-0.5 block text-sm leading-snug text-slate-600">{a.line}</span>
                      </span>
                    </Link>
                  </li>
                ))}
                {shown.length === 0 && <li className="col-span-2 text-[15px] text-slate-600">No app matches that yet — <Link href="/contact" onClick={onNavigate} className="font-semibold text-signal-dark">tell us what you need</Link>.</li>}
              </ul>
            </>
          )}
        </div>
        <div className="flex flex-col gap-3 border-l border-slate-200 bg-cloud p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Not sure where to start?</p>
          <p className="text-lg font-semibold leading-snug text-ink">Tell us your problem. We&apos;ll recommend the right apps.</p>
          <p className="text-[15px] leading-relaxed text-slate-600">A free call with our solutions team, then a written proposal — scope, timeline and price.</p>
          <Link href="/contact" onClick={onNavigate} className="mt-1 rounded-full bg-signal px-5 py-3 text-center text-[15px] font-semibold text-white hover:bg-signal-dark">Talk to our team</Link>
          <ul className="mt-2 flex flex-col gap-1.5 border-t border-slate-200 pt-4 text-sm font-medium text-slate-700">
            <li>✓ Setup and data migration by us</li>
            <li>✓ Staff training included</li>
            <li>✓ Support from the team that built it</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SolutionsPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="mx-auto grid max-w-[1280px] grid-cols-[1fr_1fr_300px] overflow-hidden rounded-b-3xl border border-t-0 border-slate-200 bg-white shadow-md">
      <div className="p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">By industry</p>
        <ul className="mt-4 grid grid-cols-1 gap-1">
          {industryHubs.map((h) => (
            <li key={h.slug}>
              <Link href={`/for/${h.slug}`} onClick={onNavigate} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-cloud">
                <AppIcon app={getApp(h.iconApp)!} className="h-9 w-9" />
                <span><span className="block text-[15px] font-semibold text-ink">Camus for {h.name}</span><span className="block text-sm text-slate-600">{h.line}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-l border-slate-200 p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">By business size</p>
        <ul className="mt-4 grid gap-1">
          {sizeHubs.map((h) => (
            <li key={h.slug}>
              <Link href={`/for/${h.slug}`} onClick={onNavigate} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-cloud">
                <AppIcon app={getApp(h.iconApp)!} className="h-9 w-9" />
                <span><span className="block text-[15px] font-semibold text-ink">Camus for {h.name}</span><span className="block text-sm text-slate-600">{h.line}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3 bg-navy p-7 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9CC3E0]">Custom solutions</p>
        <p className="text-xl font-semibold">Camus Studio</p>
        <p className="text-[15px] leading-relaxed text-slate-200">No two businesses are the same. Our team builds the features you need on the Camus platform.</p>
        <Link href="/apps/studio" onClick={onNavigate} className="mt-auto inline-flex items-center gap-1 text-[15px] font-semibold text-white">Share your requirement <ArrowRight size={15} /></Link>
      </div>
    </div>
  );
}

const resources = [
  { href: "/learn", label: "Camus Learn", line: "AI learning and career platform" },
  { href: "/projects", label: "Customer stories", line: "Work we've delivered" },
  { href: "/about", label: "About Camus Labs", line: "Who we are and how we work" },
  { href: "/contact", label: "Contact & support", line: "Talk to our team" },
];

export function Navbar() {
  const [menu, setMenu] = useState<Menu>(null);
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const close = () => { setMenu(null); setMobile(false); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setMenu(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, []);

  const trigger = (id: Exclude<Menu, null>, label: string) => (
    <button type="button" aria-expanded={menu === id} onClick={() => setMenu(menu === id ? null : id)}
      className={cn("inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-semibold transition-colors", menu === id ? "text-signal-dark" : "text-slate-700 hover:text-ink")}>
      {label} <ChevronDown size={16} className={cn("transition-transform", menu === id && "rotate-180")} />
    </button>
  );

  return (
    <header ref={ref} className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur pt-safe">
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center gap-6 px-6 md:px-10">
        <Link href="/" onClick={close} className="text-[22px]"><Logo /></Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {trigger("products", "Products")}
          {trigger("solutions", "Solutions")}
          <Link href="/pricing" onClick={close} className="rounded-lg px-3 py-2 text-[15px] font-semibold text-slate-700 hover:text-ink">Pricing</Link>
          <Link href="/projects" onClick={close} className="rounded-lg px-3 py-2 text-[15px] font-semibold text-slate-700 hover:text-ink">Customers</Link>
          <div className="relative">
            {trigger("resources", "Resources")}
            {menu === "resources" && (
              <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-md">
                {resources.map((r) => (
                  <Link key={r.href} href={r.href} onClick={close} className="block rounded-xl px-3 py-2.5 hover:bg-cloud">
                    <span className="block text-[15px] font-semibold text-ink">{r.label}</span>
                    <span className="block text-sm text-slate-600">{r.line}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Link href="/login" className="px-3 py-2 text-[15px] font-semibold text-slate-700 hover:text-ink">Sign in</Link>
          <Link href="/contact" className="rounded-full bg-signal px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-signal-dark">Contact sales</Link>
        </div>
        <button type="button" aria-label={mobile ? "Close menu" : "Open menu"} aria-expanded={mobile} onClick={() => setMobile((v) => !v)}
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 lg:hidden">
          {mobile ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menu === "products" && <div className="absolute inset-x-0 top-full hidden px-6 lg:block"><ProductsPanel onNavigate={close} /></div>}
      {menu === "solutions" && <div className="absolute inset-x-0 top-full hidden px-6 lg:block"><SolutionsPanel onNavigate={close} /></div>}

      {mobile && (
        <div className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-slate-200 bg-white lg:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            <details className="group rounded-xl">
              <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-base font-semibold text-ink">Products <ChevronDown size={18} className="group-open:rotate-180" /></summary>
              <p className="pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">I want to…</p>
              <ul className="grid gap-1 pb-3">
                {goals.map((g) => (
                  <li key={g.slug}><Link href={`/products?goal=${g.slug}`} onClick={close} className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-slate-700 hover:bg-cloud">{g.label}</Link></li>
                ))}
                <li><Link href="/products" onClick={close} className="block rounded-lg px-3 py-2.5 text-[15px] font-semibold text-signal-dark">All {APP_COUNT} apps →</Link></li>
              </ul>
            </details>
            <details className="group rounded-xl">
              <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-base font-semibold text-ink">Solutions <ChevronDown size={18} className="group-open:rotate-180" /></summary>
              <ul className="grid gap-1 pb-3">
                {hubs.map((h) => (
                  <li key={h.slug}><Link href={`/for/${h.slug}`} onClick={close} className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-slate-700 hover:bg-cloud">Camus for {h.name}</Link></li>
                ))}
              </ul>
            </details>
            <Link href="/pricing" onClick={close} className="py-3 text-base font-semibold text-ink">Pricing</Link>
            <Link href="/projects" onClick={close} className="py-3 text-base font-semibold text-ink">Customers</Link>
            <Link href="/learn" onClick={close} className="py-3 text-base font-semibold text-ink">Camus Learn</Link>
            <Link href="/about" onClick={close} className="py-3 text-base font-semibold text-ink">About</Link>
            <div className="mt-3 grid gap-2">
              <Link href="/contact" onClick={close} className="rounded-full bg-signal px-5 py-3 text-center text-base font-semibold text-white">Contact sales</Link>
              <Link href="/login" onClick={close} className="rounded-full border border-slate-300 px-5 py-3 text-center text-base font-semibold text-ink">Sign in</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
