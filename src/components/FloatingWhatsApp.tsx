import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site-config";

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink("Hi CAMUS Labs, I'd like to talk about a project.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with CAMUS Labs on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(37,211,102,0.55)] transition-transform hover:scale-105"
    >
      <MessageCircle size={26} strokeWidth={2} />
    </a>
  );
}
