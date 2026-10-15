import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { Check, MessageCircle, Smartphone } from "lucide-react";
import { PublicChrome } from "@/components/PublicChrome";
import { Container } from "@/components/ui/Container";
import { AppIcon } from "@/components/brand/AppIcon";
import { demo, formatINR } from "@/lib/pricing";
import { getApp } from "@/lib/apps";
import { siteConfig, upiLink, whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Book a guided demo — ${formatINR(demo.fee)} | Camus Labs`,
  description: "A 60-minute guided demo of Camus with your own products and customers, plus a written proposal. Pay by UPI.",
  alternates: { canonical: "/demo" },
};

const steps = [
  { title: "Pay by UPI", body: `Scan the QR or tap “Pay with UPI app” to pay ${formatINR(demo.fee)}.` },
  { title: "Send the screenshot", body: "Share your payment screenshot and business details on WhatsApp." },
  { title: "Pick your slot", body: "We confirm a 60-minute slot and prepare the demo with your data." },
];

export default async function DemoPage({ searchParams }: PageProps<"/demo">) {
  const sp = await searchParams;
  const app = typeof sp.app === "string" ? getApp(sp.app) : undefined;
  const subject = app ? `Camus ${app.name}` : "Camus";
  const hasUpi = Boolean(siteConfig.upiId);
  const upi = hasUpi ? upiLink(demo.fee, app ? `${demo.payNote} - ${app.name}` : demo.payNote) : "";
  const qr = hasUpi ? await QRCode.toDataURL(upi, { margin: 1, width: 560, color: { dark: "#1E2B38", light: "#FFFFFF" } }) : "";
  const confirm = whatsappLink(
    hasUpi
      ? `Hi Camus Labs, I have paid ${formatINR(demo.fee)} for the guided demo of ${subject}. Sending the payment screenshot.\n\nName:\nBusiness name:\nBusiness type:\nCity:\nPreferred date/time:`
      : `Hi Camus Labs, I'd like to book the ${formatINR(demo.fee)} guided demo of ${subject}.\n\nName:\nBusiness name:\nBusiness type:\nCity:\nPreferred date/time:`,
  );

  return (
    <PublicChrome>
      <section className="bg-cloud">
        <Container className="grid grid-cols-1 items-start gap-12 py-16 md:py-20 lg:grid-cols-[1fr_440px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-signal">Request a demo</p>
            <h1 className="mt-3 text-balance text-[38px] font-semibold leading-[1.1] tracking-tight text-ink md:text-[52px]">
              See {subject} working for your business.
            </h1>
            {app && (
              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <AppIcon app={app} className="h-10 w-10" />
                <span className="text-base font-semibold text-ink">{app.line}</span>
              </div>
            )}
            <p className="mt-6 max-w-[620px] text-lg leading-relaxed text-slate-700 md:text-xl">
              A {demo.duration.toLowerCase()} with our solutions team, using your own products, customers and bills — followed by a written proposal.
            </p>
            <ul className="mt-7 grid gap-3">
              {demo.points.map((p) => (
                <li key={p} className="flex gap-3 text-[17px] font-medium text-slate-800"><Check size={22} className="shrink-0 text-signal" />{p}</li>
              ))}
            </ul>
            <ol className="mt-10 grid gap-5 sm:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-signal text-base font-bold text-white">{i + 1}</span>
                  <p className="mt-3 text-lg font-semibold text-ink">{s.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-slate-700">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-md md:p-8">
            <p className="text-[15px] font-semibold text-slate-600">Guided demo fee</p>
            <p className="mt-1 text-[44px] font-semibold leading-none tracking-tight text-ink">{formatINR(demo.fee)}</p>
            <p className="mt-2 text-[15px] text-slate-600">Adjusted against your setup if you go ahead.</p>

            {hasUpi ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt={`UPI QR code to pay ${formatINR(demo.fee)} to ${siteConfig.upiPayeeName}`} width={280} height={280} className="mx-auto mt-6 h-[280px] w-[280px] rounded-2xl border border-slate-200" />
                <p className="mt-3 text-center text-[15px] font-medium text-slate-700">Scan with GPay, PhonePe, Paytm or any UPI app</p>
                <p className="mt-1 text-center text-sm text-slate-600">UPI ID: <span className="font-semibold text-ink">{siteConfig.upiId}</span></p>
                <a href={upi} className="mt-5 flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-4 text-base font-semibold text-white hover:bg-signal-dark lg:hidden">
                  <Smartphone size={18} /> Pay with UPI app
                </a>
                <a href={confirm} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-4 text-base font-semibold text-ink hover:border-signal">
                  <MessageCircle size={18} /> I&apos;ve paid — send screenshot
                </a>
              </>
            ) : (
              <a href={confirm} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-4 text-base font-semibold text-white hover:bg-signal-dark">
                <MessageCircle size={18} /> Book on WhatsApp
              </a>
            )}
            <p className="mt-5 border-t border-slate-200 pt-4 text-sm leading-relaxed text-slate-600">
              Just want to talk first? <Link href="/contact" className="font-semibold text-signal-dark">Contact sales</Link> — the first call is free.
            </p>
          </div>
        </Container>
      </section>
    </PublicChrome>
  );
}
