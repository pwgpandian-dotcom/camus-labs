import { BookOpen, BedDouble, UtensilsCrossed, Stethoscope, Gem, Landmark, type LucideIcon } from "lucide-react";

/**
 * Camus product catalog shown on the website. Pricing is NOT stored here —
 * product pages read live plans from the database (cml_plans / learn_plans).
 */
export interface Product {
  slug: string;
  name: string;
  planKey: string; // cml_plans.product, or "learn"
  audience: string;
  tagline: string;
  summary: string;
  icon: LucideIcon;
  highlights: { title: string; body: string }[];
  href?: string; // dedicated marketing page, if any
}

export const products: Product[] = [
  {
    slug: "learn",
    name: "Camus Learn",
    planKey: "learn",
    audience: "Students, graduates, job seekers & professionals",
    tagline: "Learn. Build. Prepare. Grow.",
    summary: "An AI learning and career platform — study any subject, discover careers, build projects, prepare for exams and interviews, and create truthful, job-ready resumes.",
    icon: BookOpen,
    href: "/learn",
    highlights: [
      { title: "AI tutor & assistant", body: "Study, career, resume, interview, project and founder modes that remember your goals." },
      { title: "Career & skill roadmaps", body: "Compare careers against your own skills and follow step-by-step roadmaps." },
      { title: "Resume, job match & interviews", body: "ATS-friendly resumes, job-description alignment reports and mock interviews with feedback." },
    ],
  },
  {
    slug: "stayos",
    name: "StayOS",
    planKey: "stayos",
    audience: "PGs, hostels & co-living operators",
    tagline: "Run every bed, bill and complaint from one place.",
    summary: "Rooms and beds, resident onboarding, rent and dues tracking, and complaints — built for paying-guest and co-living businesses.",
    icon: BedDouble,
    highlights: [
      { title: "Rooms, beds & residents", body: "See occupancy at a glance and onboard residents in minutes." },
      { title: "Rent & dues", body: "Track who has paid, who is due and what is overdue." },
      { title: "Complaints", body: "Log and resolve resident issues with a clear status trail." },
    ],
  },
  {
    slug: "foodos",
    name: "FoodOS",
    planKey: "foodos",
    audience: "Restaurants, cafés & cloud kitchens",
    tagline: "Menu to kitchen to accounts, without the chaos.",
    summary: "Menu and order management, a kitchen display, expense tracking and sales reports for food businesses.",
    icon: UtensilsCrossed,
    highlights: [
      { title: "Menu & orders", body: "Keep your menu current and move orders cleanly to the kitchen." },
      { title: "Kitchen display", body: "A live queue so the kitchen always knows what's next." },
      { title: "Expenses & reports", body: "Understand daily sales and costs without spreadsheets." },
    ],
  },
  {
    slug: "careos",
    name: "CareOS",
    planKey: "careos",
    audience: "Clinics & polyclinics",
    tagline: "Calmer front desks and organised patient flow.",
    summary: "Patient registration, appointments and token queues, doctor schedules and daily reports for clinics.",
    icon: Stethoscope,
    highlights: [
      { title: "Registration", body: "Register patients once and find them instantly on return visits." },
      { title: "Appointments & tokens", body: "Book appointments and manage the waiting-room queue." },
      { title: "Daily reports", body: "See each day's visits and workload per doctor." },
    ],
  },
  {
    slug: "jewelos",
    name: "JewelOS",
    planKey: "jewelos",
    audience: "Jewellers & showrooms",
    tagline: "Stock by weight and purity, sales with GST.",
    summary: "Inventory by weight and purity, daily gold rates, GST-ready sales and stock-value reports for jewellery businesses.",
    icon: Gem,
    highlights: [
      { title: "Stock by weight & purity", body: "Every piece tracked with its weight, purity and status." },
      { title: "Daily gold rate", body: "Set the day's rate once and price sales consistently." },
      { title: "Sales & stock value", body: "GST-ready sales records and up-to-date stock valuation." },
    ],
  },
  {
    slug: "pawnos",
    name: "PawnOS",
    planKey: "pawnos",
    audience: "Pawn brokers & gold-loan lenders",
    tagline: "Pledges, interest and receipts — accurate every time.",
    summary: "Customer KYC, pledge records, interest calculation, receipts, overdue tracking and collection reports for pledge lenders.",
    icon: Landmark,
    highlights: [
      { title: "Customers & KYC", body: "Keep customer identity records organised and searchable." },
      { title: "Pledges & interest", body: "Record pledges and compute interest consistently." },
      { title: "Receipts & overdues", body: "Issue receipts and follow up on overdue pledges." },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
