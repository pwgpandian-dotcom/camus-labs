import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Layers,
  MonitorSmartphone,
  ShoppingBag,
  Workflow,
  Cloud,
  RefreshCw,
} from "lucide-react";

export type Solution = {
  slug: string;
  icon: LucideIcon;
  title: string;
  /** Short line used on the homepage grid and index cards. */
  summary: string;
  /** Longer intro paragraph for the detail page. */
  overview: string;
  /** "What's included" bullets on the detail page. */
  capabilities: string[];
  /** Industry slugs this solution shows up for most often. */
  relatedIndustries: string[];
};

export const solutions: Solution[] = [
  {
    slug: "ai-agents",
    icon: Bot,
    title: "AI & AI Agents",
    summary: "Custom agents and AI-powered features embedded into your product or operations.",
    overview:
      "We build AI that does real work inside your product or your team's workflow — not a chat widget bolted onto a homepage. That means agents wired to your actual tools and data, retrieval systems grounded in your own content, and enough evaluation and observability that you can trust what ships to production.",
    capabilities: [
      "Product-embedded AI features — search, summarization, drafting, classification",
      "Autonomous and semi-autonomous agents wired to your internal tools and APIs",
      "Retrieval-augmented systems grounded in your own documents and data",
      "Evaluation, guardrails and observability so behavior stays predictable in production",
      "Human-in-the-loop workflows for the parts of the process that shouldn't be fully automated yet",
    ],
    relatedIndustries: ["professional-services", "startups", "fintech", "education"],
  },
  {
    slug: "software-platforms",
    icon: Layers,
    title: "Software Platforms",
    summary: "Complete internal or customer-facing platforms built for scale.",
    overview:
      "For businesses running critical processes on spreadsheets, email threads, or a patchwork of point tools, we build a real platform — a single system of record with proper roles, permissions, and workflows, designed to be maintained by your own team long after we hand it off.",
    capabilities: [
      "Role-based internal tools with real permission boundaries, not shared logins",
      "Multi-tenant architecture from the first migration, not retrofitted later",
      "Auditable data models — every record has a clear owner and history",
      "API-first design so the platform integrates with what you already run",
      "Documentation and handoff built in, so you're never locked to us to keep it running",
    ],
    relatedIndustries: ["real-estate", "professional-services", "banking"],
  },
  {
    slug: "web-mobile-apps",
    icon: MonitorSmartphone,
    title: "Web & Mobile Apps",
    summary: "Cross-platform experiences for your customers, on any device.",
    overview:
      "Whether it's a customer-facing web app, a native-feeling mobile app, or both sharing one backend, we build for the devices your users actually carry — with performance and accessibility treated as requirements, not afterthoughts.",
    capabilities: [
      "Responsive web apps built with modern frameworks and real performance budgets",
      "Cross-platform mobile apps that feel native, not like a wrapped website",
      "Shared backend and design system across web and mobile so features stay in sync",
      "Offline-first patterns where connectivity can't be assumed",
      "Accessibility (WCAG-aware) built in from the first component, not patched at the end",
    ],
    relatedIndustries: ["food-restaurants", "travel-booking", "fashion", "creators-influencers"],
  },
  {
    slug: "e-commerce",
    icon: ShoppingBag,
    title: "E-commerce",
    summary: "Storefronts, catalogs, checkout and post-purchase operations.",
    overview:
      "E-commerce is won and lost in the details most templates get wrong — catalog structure, checkout friction, and what happens after the sale. We build storefronts and the operational tooling behind them as one connected system.",
    capabilities: [
      "Catalog and inventory architecture that holds up past a few hundred SKUs",
      "Checkout flows integrated with real payment gateways, built to reduce drop-off",
      "Post-purchase operations — order tracking, returns, customer notifications",
      "Headless commerce where a custom storefront experience matters more than a template",
      "Multi-vendor and marketplace models where the business needs more than one seller",
    ],
    relatedIndustries: ["shopping-e-commerce", "fashion", "retail"],
  },
  {
    slug: "business-automation",
    icon: Workflow,
    title: "Business Automation",
    summary: "Automating manual workflows across sales, ops and support.",
    overview:
      "Most operational drag isn't a people problem, it's a missing pipeline — data re-typed between tools, approvals chased over email, reports built by hand every week. We map the actual workflow first, then automate the parts that don't need a human.",
    capabilities: [
      "Workflow mapping to find where manual work is actually costing time",
      "Integrations between the tools you already run — CRM, spreadsheets, email, internal systems",
      "Scheduled and event-driven automations that replace manual data entry",
      "Internal notification and approval systems that don't rely on someone remembering",
      "Rollout in stages, so automation earns trust before it's given more responsibility",
    ],
    relatedIndustries: ["professional-services", "real-estate", "banking"],
  },
  {
    slug: "saas-products",
    icon: Cloud,
    title: "SaaS Products",
    summary: "Multi-tenant products, from MVP to enterprise-ready.",
    overview:
      "We build SaaS products to survive contact with real customers — multi-tenancy, billing, and admin tooling designed in from the MVP, so the architecture doesn't need a rewrite the moment the product finds traction.",
    capabilities: [
      "Multi-tenant architecture with proper data isolation between customers",
      "Billing-ready foundations for seat-based or usage-based pricing",
      "Admin and internal ops tooling shipped alongside the customer-facing product",
      "Security and compliance groundwork addressed early, not bolted on before an audit",
      "Architecture built to scale past the first cohort of customers, not just the demo",
    ],
    relatedIndustries: ["startups", "professional-services", "fintech"],
  },
  {
    slug: "digital-transformation",
    icon: RefreshCw,
    title: "Digital Transformation",
    summary: "Modernizing legacy systems and processes with new technology.",
    overview:
      "Legacy systems usually can't be replaced overnight without real risk to the business. We favor incremental migration plans — modernizing piece by piece, with data integrity checks at every step — over a risky full rewrite.",
    capabilities: [
      "Audits of existing systems and processes to find what's actually load-bearing",
      "Incremental migration plans that keep the business running throughout",
      "Data migration with integrity checks, not a one-shot export/import and hope",
      "Team training and documentation so the new system is actually adopted",
      "Phased rollouts that de-risk the cutover instead of a single high-stakes launch",
    ],
    relatedIndustries: ["banking", "retail", "real-estate"],
  },
];

export function getSolution(slug: string): Solution | undefined {
  return solutions.find((s) => s.slug === slug);
}
