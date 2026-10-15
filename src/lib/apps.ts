/**
 * Camus app catalog — the single source of truth for the Products menu,
 * the All apps page, app detail pages, industry hubs and the homepage.
 *
 * status is shown to visitors as a pill, so keep it honest:
 *   live     — running for real customers today
 *   ready    — built on shared Camus modules, can be set up now
 *   request  — designed, built when a customer signs up
 *
 * icon: two SVG path strings drawn in a 24×24 box — [main stroke, accent stroke].
 */

export type AppStatus = "live" | "ready" | "request";

export type GoalSlug =
  | "bill-and-get-paid"
  | "know-my-stock"
  | "get-more-customers"
  | "sell-online"
  | "manage-my-staff"
  | "serve-customers"
  | "run-many-branches"
  | "build-something-unique";

export interface CamusApp {
  slug: string;
  name: string;
  category: string;
  line: string;
  status: AppStatus;
  icon: [string, string];
  goals?: GoalSlug[];
  features?: string[];
  /** Existing dedicated page (legacy product page with live plans, or Camus Learn). */
  href?: string;
}

export interface AppCategory {
  name: string;
  line: string;
}

export const categories: AppCategory[] = [
  { name: "Sales", line: "Find, win and keep customers." },
  { name: "Marketing", line: "Be found and stay remembered." },
  { name: "Commerce & POS", line: "Sell at the counter and online." },
  { name: "Customer service", line: "Look after customers after the sale." },
  { name: "Finance", line: "Invoices, payments, expenses and salaries." },
  { name: "Operations & ERP", line: "Stock, purchase, production and logistics." },
  { name: "HR & People", line: "Your team, from hiring to payslip." },
  { name: "Collaboration", line: "Work together, approve faster." },
  { name: "Analytics", line: "Numbers that matter, every day." },
  { name: "Industry apps", line: "Purpose-built for your business type." },
  { name: "AI", line: "AI that works inside your business data." },
  { name: "Platform", line: "Extend Camus to fit any process." },
];

export const apps: CamusApp[] = [
  // Sales
  { slug: "crm", name: "CRM", category: "Sales", status: "ready", goals: ["get-more-customers"],
    line: "Leads, deals and follow-ups for every sales team.",
    icon: ["M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M2 21v-1a6 6 0 0 1 12 0v1", "M16 3.5a4 4 0 0 1 0 7 M18 14a5 5 0 0 1 4 5v2"],
    features: ["Leads from web, WhatsApp and calls in one list", "Deal pipeline with stages", "Follow-up reminders", "Customer history in one profile", "Reports by salesperson"] },
  { slug: "leads", name: "Leads", category: "Sales", status: "request", goals: ["get-more-customers"],
    line: "Capture enquiries from web, WhatsApp and ads in one inbox.",
    icon: ["M3 4h18l-7 8v6l-4 2v-8L3 4Z", "M19 14l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6Z"] },
  { slug: "quotes", name: "Quotes", category: "Sales", status: "request", goals: ["bill-and-get-paid"],
    line: "Professional quotations that convert to invoices in a click.",
    icon: ["M6 2h9l5 5v15H6z M15 2v5h5", "M9 13h6 M9 17h4"] },
  { slug: "field-sales", name: "Field Sales", category: "Sales", status: "request", goals: ["get-more-customers"],
    line: "Plan visits, log orders and track sales reps on the move.",
    icon: ["M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z", "M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"] },
  // Marketing
  { slug: "campaigns", name: "Campaigns", category: "Marketing", status: "request", goals: ["get-more-customers"],
    line: "WhatsApp, SMS and email campaigns to the right customers.",
    icon: ["M3 10v4l12 5V5L3 10Z", "M18 8a4 4 0 0 1 0 8 M7 15l1 5h3"] },
  { slug: "sites", name: "Sites", category: "Marketing", status: "live", goals: ["get-more-customers"],
    line: "Business websites connected to your enquiries.",
    icon: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M12 2a15 15 0 0 1 0 20 M12 2a15 15 0 0 0 0 20", "M2 12h20"],
    features: ["Fast, mobile-first business website", "Enquiries sent to your WhatsApp", "Google Business profile setup", "Edit content without a developer"] },
  { slug: "forms", name: "Forms", category: "Marketing", status: "request",
    line: "Forms, surveys and registrations that feed your apps.",
    icon: ["M5 3h14v18H5z", "M8 8h1 M11 8h5 M8 12h1 M11 12h5 M8 16h1 M11 16h5"] },
  { slug: "reviews", name: "Reviews", category: "Marketing", status: "request", goals: ["get-more-customers"],
    line: "Respond to Google reviews and manage your listings.",
    icon: ["M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z", "M12 9v3"] },
  // Commerce & POS
  { slug: "pos", name: "POS", category: "Commerce & POS", status: "ready", goals: ["bill-and-get-paid", "run-many-branches"],
    line: "Fast billing with barcode, printer and day-end close.",
    icon: ["M3 4h18v12H3z M8 20h8 M12 16v4", "M7 8h10 M7 11h6"],
    features: ["Barcode and quick-key billing", "Thermal receipt printing", "GST-ready bills", "Day-end cash and UPI summary", "Works across branches"] },
  { slug: "restaurant-pos", name: "Restaurant POS", category: "Commerce & POS", status: "ready", goals: ["bill-and-get-paid"],
    line: "Tables, KOT, menu and kitchen display for restaurants.",
    icon: ["M7 3v8a2 2 0 0 0 4 0V3 M9 11v10", "M17 3c-2 2-2 6 0 8v10"] },
  { slug: "commerce", name: "Commerce", category: "Commerce & POS", status: "live", goals: ["sell-online"],
    line: "Your own online store with payments and delivery.",
    icon: ["M6 7h12l1 14H5L6 7Z", "M9 7a3 3 0 0 1 6 0"],
    features: ["Product catalogue with variants", "UPI, card and COD payments", "Order tracking for customers", "Multi-seller marketplace option"] },
  { slug: "loyalty", name: "Loyalty", category: "Commerce & POS", status: "request", goals: ["get-more-customers"],
    line: "Points, tiers and rewards across every outlet.",
    icon: ["M3 9h18v4H3z M5 13h14v8H5z M12 9v12", "M12 9c-2-4-6-4-6-1s4 1 6 1c2 0 6 2 6-1s-4-3-6 1"] },
  // Customer service
  { slug: "desk", name: "Desk", category: "Customer service", status: "ready", goals: ["serve-customers"],
    line: "Tickets and complaints tracked until they are solved.",
    icon: ["M4 14v-2a8 8 0 0 1 16 0v2 M4 14h3v6H4z M17 14h3v6h-3z", "M17 20a3 3 0 0 1-3 2h-2"] },
  { slug: "bookings", name: "Bookings", category: "Customer service", status: "ready", goals: ["serve-customers"],
    line: "Appointments and slots with automatic reminders.",
    icon: ["M3 5h18v16H3z M8 3v4 M16 3v4", "M3 10h18 M8 14h3v3H8z"] },
  { slug: "inbox", name: "Inbox", category: "Customer service", status: "request", goals: ["serve-customers"],
    line: "One shared WhatsApp inbox for your whole team.",
    icon: ["M3 5h18v11H7l-4 4V5Z", "M8 10.5h.01 M12 10.5h.01 M16 10.5h.01"] },
  { slug: "field-service", name: "Field Service", category: "Customer service", status: "request", goals: ["serve-customers"],
    line: "Jobs, technicians, parts and on-site invoices.",
    icon: ["M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5 2.5-2.5Z", "M18 18l3 3"] },
  // Finance
  { slug: "billing", name: "Billing", category: "Finance", status: "ready", goals: ["bill-and-get-paid"],
    line: "GST invoices, receivables and payment tracking.",
    icon: ["M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2Z", "M9 8h6 M9 12h6"],
    features: ["GST invoices and credit notes", "Receivables and ageing", "Payment links on WhatsApp", "Tally-friendly export"] },
  { slug: "books", name: "Books", category: "Finance", status: "request",
    line: "Accounting, ledgers and GST returns, Tally-friendly.",
    icon: ["M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2Z", "M9 8h7 M9 11h5"] },
  { slug: "pay", name: "Pay", category: "Finance", status: "ready", goals: ["bill-and-get-paid"],
    line: "UPI links, auto reminders and reconciled collections.",
    icon: ["M3 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3z", "M16 13h2 M3 6l12-3v3"] },
  { slug: "expense", name: "Expense", category: "Finance", status: "request", goals: ["manage-my-staff"],
    line: "Claims, approvals and reimbursements for staff.",
    icon: ["M4 3h16v18H4z", "M12 7v10 M15 9.5c0-1.5-6-1.5-6 .5s6 1.5 6 3.5-6 2-6 .5"] },
  { slug: "payroll", name: "Payroll", category: "Finance", status: "request", goals: ["manage-my-staff"],
    line: "Salary, PF, ESI and payslips every month.",
    icon: ["M3 6h18v12H3z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z M6.5 9v.01 M17.5 15v.01"] },
  // Operations & ERP
  { slug: "inventory", name: "Inventory", category: "Operations & ERP", status: "ready", goals: ["know-my-stock", "run-many-branches"],
    line: "Stock across branches, transfers and reorder alerts.",
    icon: ["M21 8 12 3 3 8v8l9 5 9-5V8Z M12 13v8", "M3 8l9 5 9-5"],
    features: ["Stock by branch and warehouse", "Transfers between locations", "Low-stock and reorder alerts", "Batch and expiry tracking"] },
  { slug: "erp", name: "ERP", category: "Operations & ERP", status: "ready", goals: ["know-my-stock", "run-many-branches"],
    line: "Purchase, inventory, production and accounts together.",
    icon: ["M12 2 2 7l10 5 10-5-10-5Z M2 17l10 5 10-5", "M2 12l10 5 10-5"] },
  { slug: "purchase", name: "Purchase", category: "Operations & ERP", status: "request", goals: ["know-my-stock"],
    line: "Vendors, purchase orders, GRN and bills.",
    icon: ["M3 4h2l2 11h11l2-7H6", "M9 20h.01 M17 20h.01"] },
  { slug: "manufacturing", name: "Manufacturing", category: "Operations & ERP", status: "request", goals: ["know-my-stock"],
    line: "Bills of material, production orders and costing.",
    icon: ["M3 21V10l5 3V10l5 3V5l8 4v12z", "M7 17h2 M12 17h2 M17 17h2"] },
  { slug: "fleet", name: "Fleet", category: "Operations & ERP", status: "request",
    line: "Vehicles, trips, drivers and fuel.",
    icon: ["M2 6h12v10H2z M14 10h4l3 3v3h-7", "M5 19h3 M16 19h3"] },
  // HR & People
  { slug: "people", name: "People", category: "HR & People", status: "live", goals: ["manage-my-staff"],
    line: "Employee records, leave, documents and self-service.",
    icon: ["M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z M4 21a8 8 0 0 1 16 0", "M17 11l2 2 3-3"],
    features: ["Employee profiles and documents", "Leave requests and approvals", "Attendance records", "Employee self-service"] },
  { slug: "recruit", name: "Recruit", category: "HR & People", status: "request", goals: ["manage-my-staff"],
    line: "Job openings, candidates and interviews.",
    icon: ["M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M3 21a7 7 0 0 1 11-5.7", "M18 15v6 M15 18h6"] },
  { slug: "attendance", name: "Attendance", category: "HR & People", status: "request", goals: ["manage-my-staff"],
    line: "Face, GPS or biometric attendance and shifts.",
    icon: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 7v5l3 2"] },
  // Collaboration
  { slug: "projects", name: "Projects", category: "Collaboration", status: "live", goals: ["manage-my-staff"],
    line: "Tasks, milestones and client updates.",
    icon: ["M3 3h18v18H3z", "M8 12l3 3 5-6"] },
  { slug: "docs", name: "Docs", category: "Collaboration", status: "request",
    line: "Documents, SOPs and contracts in one place.",
    icon: ["M6 2h9l5 5v15H6z M15 2v5h5", "M9 12h6 M9 16h6"] },
  { slug: "approvals", name: "Approvals", category: "Collaboration", status: "request", goals: ["run-many-branches"],
    line: "Purchase, discount and leave approvals on mobile.",
    icon: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M8 12l3 3 5-6"] },
  { slug: "connect", name: "Connect", category: "Collaboration", status: "request", goals: ["run-many-branches"],
    line: "Team chat and announcements for every branch.",
    icon: ["M4 4h12v9H8l-4 3V4Z", "M20 8v10l-3-2h-7"] },
  // Analytics
  { slug: "analytics", name: "Analytics", category: "Analytics", status: "ready", goals: ["run-many-branches", "know-my-stock"],
    line: "Owner dashboards across sales, stock and staff.",
    icon: ["M4 20V10 M10 20V4 M16 20v-7 M22 20H2", "M4 9l6-4 6 5 5-4"] },
  { slug: "reports", name: "Reports", category: "Analytics", status: "request", goals: ["run-many-branches"],
    line: "Scheduled reports to WhatsApp and email.",
    icon: ["M12 3v9h9a9 9 0 1 1-9-9Z", "M15 3a6 6 0 0 1 6 6h-6z"] },
  // Industry apps
  { slug: "clinic", name: "Clinic", category: "Industry apps", status: "ready", goals: ["serve-customers"],
    line: "Patients, appointments, prescriptions and billing.",
    icon: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 8v8 M8 12h8"] },
  { slug: "pharmacy", name: "Pharmacy", category: "Industry apps", status: "request",
    line: "Batch and expiry stock with prescription billing.",
    icon: ["M10.5 20.5a5 5 0 0 1-7-7l7-7a5 5 0 0 1 7 7l-7 7Z", "M8.5 8.5l7 7"] },
  { slug: "school", name: "School", category: "Industry apps", status: "request",
    line: "Admissions, fees, attendance and parent app.",
    icon: ["M2 9l10-5 10 5-10 5L2 9Z", "M6 11v5c3 2 9 2 12 0v-5"] },
  { slug: "stay", name: "Stay", category: "Industry apps", status: "live",
    line: "PG, hostel and co-living: rooms, rent and residents.",
    icon: ["M3 18V7 M3 13h18v5 M21 18v-3", "M6 10h4v3H6z"] },
  { slug: "gold-loan", name: "Gold Loan", category: "Industry apps", status: "live",
    line: "Pledges, interest, renewals and auctions.",
    icon: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M9 8h6 M9 11h6 M12 8c3 0 3 6-2 6l4 4"] },
  { slug: "chit-savings", name: "Chit & Savings", category: "Industry apps", status: "live",
    line: "Members, draws, contributions and statements.",
    icon: ["M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M17 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M2 20a5 5 0 0 1 10 0 M12 20a5 5 0 0 1 10 0", "M12 15v-3"] },
  { slug: "property", name: "Property", category: "Industry apps", status: "request",
    line: "Listings, site visits, bookings and rent.",
    icon: ["M3 11l9-8 9 8v10H3z", "M9 21v-6h6v6"] },
  { slug: "jewel", name: "Jewel", category: "Industry apps", status: "ready",
    line: "Weight and purity stock, old-gold exchange, schemes.",
    icon: ["M6 3h12l4 6-10 12L2 9l4-6Z", "M2 9h20 M12 21 8 9l4-6 4 6-4 12"] },
  { slug: "learn", name: "Learn", category: "Industry apps", status: "live", href: "/learn",
    line: "AI learning and career platform for students and professionals.",
    icon: ["M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2Z", "M12 7l1 2 2 .3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1L9 9.3l2-.3 1-2Z"] },
  // AI
  { slug: "ai-agents", name: "AI Agents", category: "AI", status: "request", goals: ["get-more-customers", "serve-customers"],
    line: "Agents that reply, follow up and prepare reports.",
    icon: ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z", "M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z"] },
  { slug: "voice-agent", name: "Voice Agent", category: "AI", status: "request", goals: ["serve-customers"],
    line: "Answers calls and books appointments in Tamil and English.",
    icon: ["M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2", "M15 3a6 6 0 0 1 6 6 M15 7a2 2 0 0 1 2 2"] },
  { slug: "ai-scribe", name: "AI Scribe", category: "AI", status: "request",
    line: "Turns doctor or meeting conversations into notes.",
    icon: ["M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z", "M5 11a7 7 0 0 0 14 0 M12 18v4"] },
  // Platform
  { slug: "studio", name: "Studio", category: "Platform", status: "live", goals: ["build-something-unique"],
    line: "Custom apps built on the platform by our team.",
    icon: ["M8 8l-4 4 4 4 M16 8l4 4-4 4", "M14 5l-4 14"],
    features: ["Free requirement study", "Fixed scope and price in writing", "Built on the same login and data as your apps", "Launched, trained and supported by us"] },
  { slug: "flow", name: "Flow", category: "Platform", status: "request", goals: ["build-something-unique"],
    line: "Automations across apps without code.",
    icon: ["M5 3h4v4H5z M15 17h4v4h-4z M7 7v5h10v5", "M15 3h4v4h-4z"] },
  { slug: "integrations", name: "Integrations", category: "Platform", status: "request", goals: ["build-something-unique"],
    line: "APIs and connectors to Tally, ERPs and portals.",
    icon: ["M9 2v6 M15 2v6 M6 8h12v4a6 6 0 0 1-12 0z", "M12 18v4"] },
];

export const goals: { slug: GoalSlug; label: string; line: string }[] = [
  { slug: "bill-and-get-paid", label: "Bill faster and get paid", line: "Billing, GST and collections without paper." },
  { slug: "know-my-stock", label: "Know my stock", line: "Never run out, never over-order." },
  { slug: "get-more-customers", label: "Get more customers", line: "Be found, follow up, bring them back." },
  { slug: "sell-online", label: "Sell online", line: "Your own store, your own customers." },
  { slug: "manage-my-staff", label: "Manage my staff", line: "Attendance, salary and tasks in one place." },
  { slug: "serve-customers", label: "Serve customers better", line: "Bookings and complaints handled on time." },
  { slug: "run-many-branches", label: "Run many branches", line: "One view of every location." },
  { slug: "build-something-unique", label: "Build something unique", line: "When no app fits your process." },
];

export const statusLabel: Record<AppStatus, string> = {
  live: "In use today",
  ready: "Ready to set up",
  request: "Built on request",
};

export function getApp(slug: string) {
  return apps.find((a) => a.slug === slug);
}

export function appHref(app: CamusApp) {
  return app.href ?? `/apps/${app.slug}`;
}

export function appsByCategory() {
  return categories.map((c) => ({ ...c, apps: apps.filter((a) => a.category === c.name) }));
}

export function appsForGoal(goal: GoalSlug) {
  return apps.filter((a) => a.goals?.includes(goal));
}

export const APP_COUNT = apps.length;
