/**
 * "Camus for <industry>" hub pages (/for/[slug]).
 * Sections render only when their data is present, so lighter hubs can
 * ship with hero + apps + FAQ and grow later.
 */
import type { AppStatus } from "./apps";
import type { ScreenId } from "@/components/product/ProductScreens";

export interface Hub {
  slug: string;
  name: string;
  kind: "industry" | "size";
  /** Short label used in menus/cards. */
  line: string;
  /** App slug whose icon represents this hub in menus. */
  iconApp: string;
  /** Product screen shown in the hero. */
  screen?: ScreenId;
  hero: { title: string; sub: string };
  apps: string[];
  segments?: { name: string; line: string }[];
  spotlight?: { title: string; body: string; points: string[] };
  needs?: { for: string; title: string; line: string; apps: string[] }[];
  ai?: { title: string; line: string; status: AppStatus }[];
  checklist?: string[];
  integrations?: { name: string; status: "Live" | "Planned" }[];
  faq?: { q: string; a: string }[];
}

const commonFaq = (name: string) => [
  { q: "Can it be customised for my business?", a: "Yes. Our team tailors workflows, reports and integrations. Scope and price are agreed in writing before work starts." },
  { q: "Can you move my data from my current software?", a: "Yes. We migrate your items, customers and opening balances from Excel, Tally or your current system as part of setup." },
  { q: "How do I get started?", a: `Talk to our solutions team. We study how your ${name.toLowerCase()} business runs and share a proposal with the right apps, timeline and price.` },
];

export const hubs: Hub[] = [
  {
    slug: "healthcare", screen: "clinic", name: "Healthcare", kind: "industry", iconApp: "clinic",
    line: "Clinics, pharmacies and diagnostics",
    hero: { title: "Camus for Healthcare", sub: "Patients, appointments, billing, pharmacy and staff on one secure platform — configured for your clinic or hospital by our team." },
    apps: ["clinic", "bookings", "crm", "billing", "pharmacy", "ai-scribe", "people", "analytics"],
    needs: [
      { for: "Patient experience", title: "Engage every patient", line: "Online booking, reminders and follow-ups across WhatsApp, SMS and email.", apps: ["crm", "bookings"] },
      { for: "Marketing", title: "Grow your practice", line: "Your website, Google presence and health-camp campaigns in one place.", apps: ["sites", "campaigns"] },
      { for: "Collaboration", title: "Coordinate your staff", line: "Shifts, attendance, payroll and tasks for doctors, nurses and front office.", apps: ["people", "payroll"] },
      { for: "Operations", title: "Run the facility", line: "Billing, pharmacy stock, purchases and owner dashboards.", apps: ["billing", "inventory", "analytics"] },
    ],
    checklist: ["Patient registration with visit history", "Appointment calendar for multiple doctors", "Digital prescriptions on your letterhead", "GST-ready billing and UPI collection", "WhatsApp appointment reminders", "Role-based access for doctors and front desk", "Daily collection and visit reports", "English and Tamil interface"],
    integrations: [{ name: "WhatsApp Business", status: "Live" }, { name: "UPI and Razorpay payments", status: "Live" }, { name: "Google Calendar", status: "Planned" }, { name: "ABDM / ABHA health ID", status: "Planned" }, { name: "Lab and HIMS systems (API)", status: "Planned" }],
    faq: commonFaq("Healthcare"),
  },
  {
    slug: "retail", screen: "pos", name: "Retail", kind: "industry", iconApp: "pos",
    line: "Stores, chains and distributors",
    hero: { title: "Camus for Retail", sub: "Point of sale, inventory, retail ERP, payments, loyalty and your online store — connected, and configured for your stores by our team." },
    apps: ["pos", "inventory", "erp", "pay", "crm", "commerce", "loyalty", "reviews"],
    spotlight: { title: "Bring every customer back", body: "One customer profile across all your stores. Reward points on every bill, redeem at any outlet, and send offers on WhatsApp when a customer hasn't visited in a while.", points: ["Points, tiers and birthday offers", "Works across every branch", "WhatsApp and SMS campaigns from the same customer list"] },
    ai: [
      { title: "Smart reorder", line: "Suggests what to reorder and how much, based on your sales pattern and season.", status: "request" },
      { title: "Win-back campaigns", line: "Finds customers who stopped visiting and drafts a WhatsApp offer for them.", status: "request" },
      { title: "Ask your data", line: "Ask \"which store sold the most shirts last week?\" and get the answer in plain language.", status: "request" },
    ],
    segments: [
      { name: "Fashion and apparel", line: "Size and colour variants, seasonal collections, exchanges and loyalty." },
      { name: "Supermarkets and kirana", line: "High-volume billing, weighing scales, perishables and replenishment." },
      { name: "Electronics and mobiles", line: "Serial and IMEI tracking, warranties, service and EMI payments." },
      { name: "Jewellery", line: "Weight and purity stock, making charges, old-gold exchange and schemes." },
      { name: "Wholesale and distribution", line: "Bulk orders, tiered pricing, credit limits and receivables." },
      { name: "D2C brands", line: "Online and offline sales, inventory and fulfilment on one platform." },
    ],
    checklist: ["Barcode billing with thermal printers", "Stock across stores and warehouses", "GST bills, returns and exchanges", "Customer profiles with purchase history", "Role-based access for cashiers and managers", "Daily sales on the owner's phone"],
    integrations: [{ name: "UPI and Razorpay payments", status: "Live" }, { name: "WhatsApp Business", status: "Live" }, { name: "Tally export", status: "Planned" }, { name: "Weighing scales", status: "Planned" }],
    faq: [
      { q: "Is it suitable for a single store as well as a chain?", a: "Yes. Start with one store and add branches, warehouses and franchises on the same platform." },
      { q: "Does it support both online and offline sales?", a: "Yes. In-store bills and online orders share the same stock and customer data." },
      ...commonFaq("Retail"),
    ],
  },
  {
    slug: "hospitality", screen: "pos", name: "Hospitality", kind: "industry", iconApp: "restaurant-pos",
    line: "Restaurants, hotels, PG and co-living",
    hero: { title: "Camus for Hospitality", sub: "Restaurant POS, kitchen display, stock, rooms, rent and resident service — for restaurants, cafés, hotels, PGs and co-living." },
    apps: ["restaurant-pos", "stay", "inventory", "desk", "pay", "bookings", "people", "analytics"],
    segments: [
      { name: "Restaurants and cafés", line: "Tables, KOT, kitchen display, recipes and day-end reports." },
      { name: "Cloud kitchens", line: "Online orders, menu sync and ingredient stock." },
      { name: "PG and hostels", line: "Rooms, beds, residents, rent and dues." },
      { name: "Co-living", line: "Resident app, complaints and community operations." },
    ],
    checklist: ["Table, takeaway and delivery orders", "KOT and kitchen display", "Rooms, beds and occupancy", "Rent and dues on WhatsApp", "Complaints tracked to closure", "Owner dashboard"],
    faq: commonFaq("Hospitality"),
  },
  {
    slug: "finance", screen: "dashboard", name: "Finance & BFSI", kind: "industry", iconApp: "gold-loan",
    line: "Gold loan, chit and lending",
    hero: { title: "Camus for Finance & BFSI", sub: "Gold loans, pawn, chit funds and community lending — with complete audit trails, receipts and statements." },
    apps: ["gold-loan", "chit-savings", "billing", "pay", "crm", "reports", "people", "studio"],
    checklist: ["Pledges, interest and renewals", "Members, draws and contributions", "Printed receipts in Tamil and English", "Complete audit log", "Role-based access", "Daily collection reports"],
    faq: commonFaq("Finance"),
  },
  {
    slug: "education", name: "Education", kind: "industry", iconApp: "school",
    line: "Schools and coaching centres",
    hero: { title: "Camus for Education", sub: "Admissions, fees, attendance, parent communication and AI learning — for schools, colleges and coaching centres." },
    apps: ["school", "learn", "pay", "crm", "people", "bookings"],
    faq: commonFaq("Education"),
  },
  {
    slug: "real-estate", screen: "crm", name: "Real Estate", kind: "industry", iconApp: "property",
    line: "Builders, agents, property managers",
    hero: { title: "Camus for Real Estate", sub: "Leads, site visits, bookings, collections and rentals — for builders, brokers and property managers." },
    apps: ["property", "crm", "field-sales", "pay", "projects", "sites"],
    faq: commonFaq("Real Estate"),
  },
  {
    slug: "manufacturing", screen: "dashboard", name: "Manufacturing", kind: "industry", iconApp: "manufacturing",
    line: "Factories and workshops",
    hero: { title: "Camus for Manufacturing", sub: "Bills of material, production orders, raw-material stock, purchase and dispatch in one system." },
    apps: ["manufacturing", "erp", "inventory", "purchase", "people", "analytics"],
    faq: commonFaq("Manufacturing"),
  },
  {
    slug: "government", name: "Government", kind: "industry", iconApp: "approvals",
    line: "Departments and public programmes",
    hero: { title: "Camus for Government", sub: "Citizen services, grievance management, approvals and department dashboards — built for Digital India programmes, with data hosted in India." },
    apps: ["studio", "desk", "approvals", "analytics", "forms", "integrations"],
    faq: commonFaq("public-sector"),
  },
  {
    slug: "enterprise", screen: "dashboard", name: "Enterprise", kind: "size", iconApp: "erp",
    line: "Large and multi-location organisations",
    hero: { title: "Camus for Enterprise", sub: "Dedicated solution architects, data hosted in India, role-based access, audit trails and integration with the systems you already run." },
    apps: ["erp", "crm", "people", "analytics", "integrations", "studio"],
    checklist: ["Dedicated solution architect and project manager", "Data hosted in India region", "Role-based access and complete audit log", "Integrations with ERP, Tally and portals", "Written scope, timeline and support terms"],
    faq: commonFaq("enterprise"),
  },
  {
    slug: "startups", screen: "pos", name: "Startups & new businesses", kind: "size", iconApp: "sites",
    line: "Open with your systems ready",
    hero: { title: "Camus for New Businesses", sub: "GST billing, stock, staff and your website ready before opening day — set up by us, so you can focus on customers." },
    apps: ["sites", "billing", "pos", "crm", "people", "pay"],
    checklist: ["Billing, GST and payments from the first sale", "Website and Google presence", "Add branches and apps anytime"],
    faq: commonFaq("new"),
  },
  {
    slug: "msme", screen: "dashboard", name: "MSMEs", kind: "size", iconApp: "billing",
    line: "Growing small and medium businesses",
    hero: { title: "Camus for MSMEs", sub: "Move off registers, spreadsheets and disconnected tools. One platform for billing, stock, customers and staff — with our team doing the setup." },
    apps: ["billing", "inventory", "crm", "people", "payroll", "analytics"],
    faq: commonFaq("growing"),
  },
];

export function getHub(slug: string) {
  return hubs.find((h) => h.slug === slug);
}
