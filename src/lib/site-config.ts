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

/** "Request a demo" opens WhatsApp with a ready-to-fill message to the founder. */
export function demoBookingLink(appName?: string) {
  const subject = appName ? `Camus ${appName}` : "Camus";
  return whatsappLink(
    `Hi Camus Labs, I'd like to request a demo of ${subject}.\n\nName:\nBusiness name:\nBusiness type:\nCity:\nPreferred date/time:`,
  );
}
