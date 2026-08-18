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
};

export function whatsappLink(prefilledMessage?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return prefilledMessage
    ? `${base}?text=${encodeURIComponent(prefilledMessage)}`
    : base;
}
