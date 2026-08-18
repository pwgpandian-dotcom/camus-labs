import {
  Sparkles,
  Bot,
  Globe,
  Smartphone,
  Layers,
  ShoppingCart,
  Landmark,
  UtensilsCrossed,
  CalendarCheck,
  GraduationCap,
  Building2,
  Store,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";

const items = [
  { icon: Sparkles, title: "AI Applications", desc: "Intelligent products built around real workflows, not novelty features." },
  { icon: Bot, title: "AI Agents & Automation", desc: "Specialized agents that handle support, sales, research and operations." },
  { icon: Globe, title: "Web Applications", desc: "Fast, scalable web platforms built for growth from day one." },
  { icon: Smartphone, title: "Mobile Applications", desc: "Native-quality iOS and Android experiences for your customers." },
  { icon: Layers, title: "SaaS Platforms", desc: "Multi-tenant products with billing, auth and admin built in." },
  { icon: ShoppingCart, title: "E-commerce Platforms", desc: "Storefronts, checkout and operations that convert and scale." },
  { icon: Landmark, title: "FinTech & Banking Tech", desc: "Secure, compliant financial software built with rigor." },
  { icon: UtensilsCrossed, title: "Food & Restaurant Platforms", desc: "Ordering, delivery and restaurant operations software." },
  { icon: CalendarCheck, title: "Booking & Reservation Systems", desc: "Scheduling and reservation platforms for any industry." },
  { icon: GraduationCap, title: "Education Platforms", desc: "Learning management and course delivery products." },
  { icon: Building2, title: "Real Estate Platforms", desc: "Listings, discovery and transaction software for property." },
  { icon: Store, title: "Retail & POS Systems", desc: "Point-of-sale and inventory systems for physical businesses." },
];

export function WhatWeBuild() {
  return (
    <Section
      eyebrow="What we build"
      heading="One technology partner, every kind of product."
      subheading="From a single AI agent to a complete platform, CAMUS Labs builds the software your idea actually needs — not a template stretched to fit."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-50 text-signal-dark">
              <item.icon size={20} strokeWidth={1.75} />
            </div>
            <h3 className="mt-4 text-base font-medium text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.desc}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
