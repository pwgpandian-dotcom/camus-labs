// Single source of truth for CAMUS Labs contact details.
// Update here and every page/component that shows contact info stays in sync.
export const siteConfig = {
  founderName: "Pandian",
  founderTitle: "Founder, CAMUS Labs",
  phoneDisplay: "+91 63804 29824",
  phoneE164: "+916380429824",
  whatsappNumber: "916380429824", // wa.me format: country code + number, no +/spaces
  email: "pwgpandian@gmail.com",
  // No LinkedIn link yet — add here once available and it'll appear
  // automatically in the Footer and Contact page.
  linkedinUrl: "",
  // UPI ID that receives the paid guided-demo fee (e.g. "camuslabs@okicici").
  // Empty = the /demo page asks visitors to book on WhatsApp instead.
  upiId: process.env.NEXT_PUBLIC_UPI_ID || "",
  upiPayeeName: process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || "Camus Labs",
};

export function whatsappLink(prefilledMessage?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return prefilledMessage
    ? `${base}?text=${encodeURIComponent(prefilledMessage)}`
    : base;
}

/** Where "Book a demo" goes: the /demo page (UPI payment + WhatsApp confirmation). */
export function demoBookingLink(app?: string) {
  return app ? `/demo?app=${encodeURIComponent(app)}` : "/demo";
}

/** Standard UPI deep link — opens GPay / PhonePe / Paytm / BHIM on phones. */
export function upiLink(amount: number, note: string) {
  const q = new URLSearchParams({ pa: siteConfig.upiId, pn: siteConfig.upiPayeeName, am: amount.toFixed(2), cu: "INR", tn: note });
  return `upi://pay?${q.toString()}`;
}
