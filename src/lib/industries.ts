import type { LucideIcon } from "lucide-react";
import {
  Landmark,
  Building2,
  ShoppingBag,
  UtensilsCrossed,
  GraduationCap,
  Home,
  Shirt,
  Video,
  Store,
  Plane,
  Briefcase,
  Rocket,
} from "lucide-react";

export type Industry = {
  slug: string;
  icon: LucideIcon;
  name: string;
  /** Longer intro paragraph for the detail page. */
  overview: string;
  /** Domain-specific concerns we design and build around. */
  focusAreas: string[];
  /** Solution slugs most relevant to this industry. */
  relatedSolutions: string[];
};

export const industries: Industry[] = [
  {
    slug: "fintech",
    icon: Landmark,
    name: "FinTech",
    overview:
      "FinTech products carry a different weight than most software — money, identity and trust all sit on top of the same data model. We build with compliance, auditability and security as constraints from day one, not a checklist added before launch.",
    focusAreas: [
      "KYC/AML-aware onboarding and identity verification flows",
      "Audit trails and immutable records for every financial transaction",
      "Integration with payment rails, banking APIs and card networks",
      "Data security and access control appropriate to financial data",
    ],
    relatedSolutions: ["ai-agents", "software-platforms", "saas-products", "digital-transformation"],
  },
  {
    slug: "banking",
    icon: Building2,
    name: "Banking",
    overview:
      "Banking rarely means building from a blank slate — it means integrating with core banking systems, legacy infrastructure and regulatory reporting requirements that can't be broken. We design around what already exists, not against it.",
    focusAreas: [
      "Integration with core banking and legacy financial infrastructure",
      "Regulatory reporting and compliance-driven data structures",
      "High-availability requirements where downtime has real consequences",
      "Staff-facing operational tooling alongside customer-facing products",
    ],
    relatedSolutions: ["software-platforms", "digital-transformation", "business-automation"],
  },
  {
    slug: "shopping-e-commerce",
    icon: ShoppingBag,
    name: "Shopping & E-commerce",
    overview:
      "E-commerce complexity scales with catalog size, not traffic. We build catalog and inventory systems that hold up as SKU count grows, and checkout flows tuned to reduce the specific points where shoppers drop off.",
    focusAreas: [
      "Catalog structure that stays manageable past a few hundred products",
      "Real-time inventory sync across storefront, warehouse and any other channel",
      "Checkout flows designed around conversion, not just function",
      "Personalization and recommendation logic grounded in real behavior data",
    ],
    relatedSolutions: ["e-commerce", "web-mobile-apps", "business-automation"],
  },
  {
    slug: "food-restaurants",
    icon: UtensilsCrossed,
    name: "Food & Restaurants",
    overview:
      "Food ordering lives or dies on speed and accuracy under real-time pressure — a slow order status update or a POS that doesn't match the app is a lost customer. We build for that operational reality, not just the storefront.",
    focusAreas: [
      "Ordering systems with real-time order status, not polling-and-hoping",
      "POS integration so online and in-store operations don't drift apart",
      "Delivery logistics and rider/driver coordination where relevant",
      "Menu and inventory management that reflects what's actually available",
    ],
    relatedSolutions: ["web-mobile-apps", "business-automation", "ai-agents"],
  },
  {
    slug: "education",
    icon: GraduationCap,
    name: "Education",
    overview:
      "Education platforms serve very different users at once — learners, instructors, and administrators — each needing a different view of the same content and progress data. We design the data model around that from the start.",
    focusAreas: [
      "Content delivery and structured course/curriculum management",
      "Progress tracking and reporting across learners, cohorts and instructors",
      "Accessibility for a genuinely diverse range of learners and devices",
      "Assessment, grading and feedback workflows that don't rely on spreadsheets",
    ],
    relatedSolutions: ["web-mobile-apps", "ai-agents", "saas-products"],
  },
  {
    slug: "real-estate",
    icon: Home,
    name: "Real Estate",
    overview:
      "Real estate software is document-heavy and search-heavy at the same time — listings need fast, filterable search, while contracts and disclosures need careful, auditable handling. We build for both without compromising either.",
    focusAreas: [
      "Property search and filtering that stays fast as listing volume grows",
      "Document-heavy workflows — contracts, disclosures, agreements — handled with care",
      "CRM and pipeline tooling built around how agents actually work leads",
      "Media-heavy listings (photos, floor plans, virtual tours) without page-load penalties",
    ],
    relatedSolutions: ["software-platforms", "business-automation", "digital-transformation"],
  },
  {
    slug: "fashion",
    icon: Shirt,
    name: "Fashion",
    overview:
      "Fashion catalogs carry more variation than most — size, color, fit and season all multiply the same base product. We build catalog and merchandising systems that represent that complexity accurately instead of flattening it.",
    focusAreas: [
      "Variant-heavy catalog structures (size, color, fit) without data duplication",
      "Visual merchandising and lookbook-style browsing experiences",
      "Seasonal inventory cycles and markdown/clearance workflows",
      "Returns and exchanges handled as a first-class flow, not an edge case",
    ],
    relatedSolutions: ["e-commerce", "web-mobile-apps"],
  },
  {
    slug: "creators-influencers",
    icon: Video,
    name: "Creators & Influencers",
    overview:
      "Creators need tooling that scales with an audience, not a company — content and community platforms, and the monetization layer underneath, built for one person or a small team to run without an ops department.",
    focusAreas: [
      "Content and community platforms built for a single creator or small team to run",
      "Monetization tooling — memberships, digital products, paid content",
      "Audience analytics that surface what actually matters, not vanity metrics",
      "Lightweight admin tooling that doesn't require technical staff to operate",
    ],
    relatedSolutions: ["web-mobile-apps", "saas-products", "ai-agents"],
  },
  {
    slug: "retail",
    icon: Store,
    name: "Retail",
    overview:
      "Retail increasingly means omni-channel by default — a sale can start online and finish in-store, or the reverse. We build inventory and POS integration so both channels reflect the same source of truth.",
    focusAreas: [
      "Omni-channel inventory that stays accurate across online and physical stores",
      "POS integration so in-store and online sales reconcile automatically",
      "Loyalty and repeat-purchase programs built into the core data model",
      "Reporting that gives a single view across every sales channel",
    ],
    relatedSolutions: ["e-commerce", "digital-transformation", "business-automation"],
  },
  {
    slug: "travel-booking",
    icon: Plane,
    name: "Travel & Booking",
    overview:
      "Booking systems are a real-time inventory problem before they're anything else — availability, pricing and scheduling all have to agree at the moment someone clicks confirm. We treat that as the hard part, because it is.",
    focusAreas: [
      "Real-time availability and inventory systems that avoid double-booking",
      "Dynamic pricing and calendar logic across dates, rooms, seats or slots",
      "Booking flow UX designed to reduce abandonment at the payment step",
      "Confirmation, reminder and change-management notifications that are actually reliable",
    ],
    relatedSolutions: ["web-mobile-apps", "business-automation", "ai-agents"],
  },
  {
    slug: "professional-services",
    icon: Briefcase,
    name: "Professional Services",
    overview:
      "Firms selling expertise and time need software that makes that time visible — client portals, engagement tracking and billing that reflect the actual work, instead of a shared inbox and a spreadsheet.",
    focusAreas: [
      "Client portals with real project and engagement visibility",
      "Time, billing and invoicing workflows tied to actual project status",
      "Document-heavy collaboration — contracts, deliverables, reports",
      "Internal capacity and resourcing views across active engagements",
    ],
    relatedSolutions: ["software-platforms", "business-automation", "ai-agents"],
  },
  {
    slug: "startups",
    icon: Rocket,
    name: "Startups",
    overview:
      "Early-stage teams need speed to a real MVP without architecture that traps them later. We build lean, cost-conscious systems that are still structured well enough to scale once the product finds traction.",
    focusAreas: [
      "Fast path to a real MVP, not a throwaway prototype that gets rebuilt later",
      "Architecture decisions that don't lock the product into an early, cheap choice",
      "Cost-conscious infrastructure sized for pre-revenue and early-revenue stages",
      "Room to scale the same codebase past the first hundred users",
    ],
    relatedSolutions: ["saas-products", "ai-agents", "web-mobile-apps"],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
