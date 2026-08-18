import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { Container } from "./ui/Container";
import { siteConfig, whatsappLink } from "@/lib/site-config";

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Solutions",
    links: [
      { href: "/solutions/ai-agents", label: "AI & AI Agents" },
      { href: "/solutions/software-platforms", label: "Software Platforms" },
      { href: "/solutions/web-mobile-apps", label: "Web & Mobile Apps" },
      { href: "/solutions/e-commerce", label: "E-commerce" },
      { href: "/solutions/saas-products", label: "SaaS Products" },
    ],
  },
  {
    title: "Industries",
    links: [
      { href: "/industries/fintech", label: "FinTech" },
      { href: "/industries/education", label: "Education" },
      { href: "/industries/real-estate", label: "Real Estate" },
      { href: "/industries/food-restaurants", label: "Food & Restaurants" },
      { href: "/industries/startups", label: "Startups" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/projects", label: "Projects" },
      { href: "/ai-agents", label: "AI Agents" },
      { href: "/contact", label: "Contact" },
      { href: "/start-project", label: "Start a Project" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-mist">
      <Container className="py-16 md:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-paper text-sm font-semibold">
                C
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-ink">
                CAMUS Labs
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Technology for Every Idea. We design, build and launch AI-powered
              software platforms for businesses, startups, creators and ambitious
              ideas worldwide.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-mono uppercase tracking-[0.1em] text-slate-400">
                {col.title}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs font-mono uppercase tracking-[0.1em] text-slate-400">
              Talk to us
            </p>
            <p className="mt-4 text-sm text-slate-600">{siteConfig.founderName}</p>
            <p className="text-xs text-slate-400">{siteConfig.founderTitle}</p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={`tel:${siteConfig.phoneE164}`}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-ink"
                >
                  <Phone size={15} strokeWidth={1.75} />
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink("Hi CAMUS Labs, I'd like to talk about a project.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-ink"
                >
                  <MessageCircle size={15} strokeWidth={1.75} />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-ink"
                >
                  <Mail size={15} strokeWidth={1.75} />
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-4 border-t border-slate-200 pt-8 md:flex-row md:items-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} CAMUS Labs. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="text-xs text-slate-500 hover:text-ink">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="text-xs text-slate-500 hover:text-ink">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
