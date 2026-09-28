import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Check } from "lucide-react";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { products, getProduct } from "@/lib/products";
import { createPublicClient } from "@/lib/supabase/public";
import { formatMoney } from "@/lib/learn/currency";
import { whatsappLink } from "@/lib/site-config";

export function generateStaticParams() {
  return products.filter((p) => !p.href).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Products — CAMUS Labs" };
  return { title: `${p.name} — ${p.tagline} | CAMUS Labs`, description: p.summary, alternates: { canonical: `/products/${p.slug}` } };
}

export const revalidate = 3600;

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  if (product.href) redirect(product.href);

  let plans: { id: string; name: string; tagline: string | null; monthly_paise: number; annual_paise: number; features: unknown }[] = [];
  let pricingError = false;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("cml_plans").select("id, name, tagline, monthly_paise, annual_paise, features").eq("product", product.planKey).eq("is_active", true).order("sort");
    if (error) pricingError = true;
    plans = data ?? [];
  } catch {
    pricingError = true;
  }

  const demo = whatsappLink(`Hi CAMUS Labs, I'd like a demo of ${product.name}.`);

  return (
    <PublicChrome>
      <Section eyebrow={product.audience} heading={<span className="inline-flex items-center gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-paper"><product.icon size={24} strokeWidth={1.75} /></span>{product.name}</span>} subheading={product.summary}>
        <div className="flex flex-wrap gap-3">
          <Button href={demo} size="lg" target="_blank" rel="noopener noreferrer">Request a demo</Button>
          <Button href="/contact" variant="secondary" size="lg">Talk to us</Button>
        </div>
        <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {product.highlights.map((h) => (
            <li key={h.title} className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-[15px] font-medium text-ink">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{h.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="pricing" eyebrow="Pricing" heading="Simple monthly plans" subheading="Try a demo first. Subscribe when it fits — access is activated after payment." className="border-t border-slate-200 bg-mist">
        {pricingError || plans.length === 0 ? (
          <p className="text-sm text-slate-500">Pricing is being finalised — request a demo and we&apos;ll share plans that fit your business.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {plans.map((p) => (
              <li key={p.id} className="flex flex-col rounded-2xl border border-slate-200 bg-paper p-6">
                <h3 className="text-lg font-medium text-ink">{p.name}</h3>
                <p className="text-sm text-slate-500">{p.tagline}</p>
                <p className="mt-5">
                  <span className="text-3xl font-semibold tracking-tight text-ink tabular-nums">{formatMoney(p.monthly_paise, "INR")}</span>
                  <span className="text-sm text-slate-500"> / month</span>
                </p>
                <p className="text-xs text-slate-400">or {formatMoney(p.annual_paise, "INR")} / year</p>
                <ul className="mt-5 flex flex-1 flex-col gap-2">
                  {(Array.isArray(p.features) ? (p.features as string[]) : []).map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-slate-700"><Check size={16} className="mt-0.5 shrink-0 text-signal" /> {f}</li>
                  ))}
                </ul>
                <Button href={whatsappLink(`Hi CAMUS Labs, I'm interested in ${product.name} — ${p.name} plan.`)} variant="secondary" className="mt-6" target="_blank" rel="noopener noreferrer">Get started</Button>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </PublicChrome>
  );
}
