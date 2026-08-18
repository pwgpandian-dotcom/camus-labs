import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "./FloatingWhatsApp";

/**
 * Shared chrome for every public marketing page (Navbar + Footer + the
 * WhatsApp button) — use this instead of assembling Navbar/Footer by hand
 * so every new public page (Solutions, Industries, etc.) stays consistent.
 * Not used by /admin or /portal, which have their own authenticated shells.
 */
export function PublicChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
