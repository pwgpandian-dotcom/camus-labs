/**
 * Camus One plans. Prices are intentionally null until finalised —
 * a null price renders as "Contact sales". Fill monthly/yearly in INR.
 */
export interface Plan {
  id: string;
  name: string;
  for: string;
  monthly: number | null;
  yearly: number | null;
  popular?: boolean;
  limits: string[];
}

export const plans: Plan[] = [
  { id: "starter", name: "Starter", for: "One shop or outlet getting started.", monthly: null, yearly: null, limits: ["Up to 3 apps", "1 branch", "Up to 3 users", "WhatsApp support"] },
  { id: "growth", name: "Growth", for: "Growing business with a team.", monthly: null, yearly: null, popular: true, limits: ["Up to 8 apps", "Up to 3 branches", "Up to 15 users", "Owner dashboard", "WhatsApp and phone support"] },
  { id: "business", name: "Business", for: "Multiple branches, full operations.", monthly: null, yearly: null, limits: ["All Camus apps (Camus One)", "Up to 10 branches", "Up to 50 users", "Small customisations", "Priority support"] },
  { id: "enterprise", name: "Enterprise", for: "Large organisations and government.", monthly: null, yearly: null, limits: ["All apps + Camus Studio", "Unlimited branches", "Custom user count", "Dedicated solution architect", "Written support terms"] },
];

export const compare: { feature: string; values: [string, string, string, string] }[] = [
  { feature: "Apps included", values: ["Up to 3", "Up to 8", "All", "All + custom"] },
  { feature: "Branches", values: ["1", "Up to 3", "Up to 10", "Unlimited"] },
  { feature: "Users", values: ["Up to 3", "Up to 15", "Up to 50", "Custom"] },
  { feature: "Setup and data migration by our team", values: ["✓", "✓", "✓", "✓"] },
  { feature: "Staff training", values: ["✓", "✓", "✓", "✓"] },
  { feature: "Owner dashboard", values: ["—", "✓", "✓", "✓"] },
  { feature: "Customisations", values: ["—", "—", "Small changes", "Camus Studio"] },
  { feature: "Support", values: ["WhatsApp", "WhatsApp + phone", "Priority", "Dedicated team"] },
];

export const pricingFaq = [
  { q: "What do I pay for?", a: "Two things: a one-time setup fee to configure the apps for your business, move your data and train your team — and a monthly or yearly subscription." },
  { q: "Can I start small and add apps later?", a: "Yes. Start with the apps you need and move to a bigger plan anytime. Your data stays in place." },
  { q: "Do I sign an agreement?", a: "Yes. Scope, price and timeline are written down before we start, so both sides are clear." },
  { q: "What happens to my data if I stop?", a: "You can export all your data. It is yours." },
  { q: "How are custom features priced?", a: "Custom work with Camus Studio is quoted after a free requirement study, with a fixed price in writing." },
];

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}
