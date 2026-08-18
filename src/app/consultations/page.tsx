import type { Metadata } from "next";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { ConsultationForm } from "@/components/contact/ConsultationForm";

export const metadata: Metadata = {
  title: "Book a Consultation — CAMUS Labs",
  description: "Request a consultation slot with CAMUS Labs — discovery, technical scoping, proposal review, or support.",
};

export default function ConsultationsPage() {
  return (
    <PublicChrome>
      <Section
        eyebrow="Consultations"
        heading="Book a consultation."
        subheading="Tell us what you'd like to talk through and a preferred time — we'll confirm by email. Prefer to talk sooner? WhatsApp reaches us faster."
        align="center"
      >
        <div className="mx-auto max-w-[560px]">
          <ConsultationForm />
        </div>
      </Section>
    </PublicChrome>
  );
}
