import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { Container } from "./ui/Container";
import { Logo } from "./brand/Logo";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { APP_COUNT } from "@/lib/apps";

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Apps",
    links: [
      { href: "/apps/crm", label: "Camus CRM" },
      { href: "/apps/billing", label: "Camus Billing" },
      { href: "/apps/erp", label: "Camus ERP" },
      { href: "/apps/pos", label: "Camus POS" },
      { href: "/apps/people", label: "Camus People" },
      { href: "/products", label: `All ${APP_COUNT} apps` },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/for/retail", label: "Retail" },
      { href: "/for/healthcare", label: "Healthcare" },
      { href: "/for/hospitality", label: "Hospitality" },
      { href: "/for/finance", label: "Finance & BFSI" },
      { href: "/for/government", label: "Government" },
      { href: "/for/enterprise", label: "Enterprise" },
    ],
  },
  {
    title: "Get started",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/contact", label: "Contact sales" },
      { href: "/apps/studio", label: "Camus Studio" },
      { href: "/start-project", label: "Start a custom project" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/learn", label: "Camus Learn" },
      { href: "/projects", label: "Customer stories" },
      { href: "/ai-agents", label: "AI agents" },
      { href: "/solutions", label: "Services" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Camus Labs" },
      { href: "/contact", label: "Contact" },
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-cloud">
      <Container className="py-16 md:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-7">
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="text-[22px]"><Logo /></Link>
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-slate-600">
              One platform to run your entire business — set up for you, and supported by the people who built it.
            </p>
            <ul className="mt-6 flex flex-col gap-3 text-[15px] font-medium text-slate-700">
              <li><a href={`tel:${siteConfig.phoneE164}`} className="inline-flex items-center gap-2 hover:text-signal-dark"><Phone size={16} />{siteConfig.phoneDisplay}</a></li>
              <li><a href={whatsappLink("Hi Camus Labs, I'd like to talk about my business.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-signal-dark"><MessageCircle size={16} />WhatsApp us</a></li>
              <li><a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2 hover:text-signal-dark"><Mail size={16} />{siteConfig.email}</a></li>
            </ul>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[15px] font-semibold text-ink">{col.title}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}><Link href={link.href} className="text-[15px] text-slate-600 hover:text-signal-dark">{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-slate-200 pt-8 md:flex-row md:items-center">
          <p className="text-sm text-slate-600">© {new Date().getFullYear()} Camus Labs. Made in Bharat, for the world.</p>
          <div className="flex gap-6 text-sm text-slate-600">
            <Link href="/legal/privacy" className="hover:text-ink">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:text-ink">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
