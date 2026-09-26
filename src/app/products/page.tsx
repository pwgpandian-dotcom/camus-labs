import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products — CAMUS Labs",
  description: "Ready-to-use software from CAMUS Labs: Camus Learn for learners and careers, plus StayOS, FoodOS, CareOS, JewelOS and PawnOS for businesses.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  const [learn, ...business] = products;
  return (
    <PublicChrome>
      <Section eyebrow="Products" heading="Software you can start using today" subheading="Alongside custom builds, CAMUS Labs runs its own products — one for learners and careers, and focused operating systems for everyday businesses.">
        <Link href={learn.href!} className="group block overflow-hidden rounded-3xl bg-ink p-8 text-paper md:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-paper/10"><learn.icon size={22} /></span>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">{learn.audience}</p>
              <h2 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">{learn.name}</h2>
              <p className="mt-3 text-lg text-slate-300">{learn.summary}</p>
            </div>
            <span className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-full bg-paper px-6 text-sm font-medium text-ink md:self-auto">
              Explore Camus Learn <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>

        <h2 className="mt-16 text-xs font-mono uppercase tracking-[0.14em] text-slate-400">For businesses</h2>
        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {business.map((p) => (
            <li key={p.slug}>
              <Link href={`/products/${p.slug}`} className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-paper p-6 transition-colors hover:border-slate-400">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-paper"><p.icon size={20} strokeWidth={1.75} /></span>
                <h3 className="mt-5 text-lg font-medium tracking-tight text-ink">{p.name}</h3>
                <p className="mt-1 text-xs text-slate-400">{p.audience}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{p.summary}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-ink">
                  Plans & details <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </PublicChrome>
  );
}
