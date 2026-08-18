import type { Metadata } from "next";
import { Phone, Mail, MessageCircle, Rocket, CalendarClock, MessageSquare } from "lucide-react";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GeneralInquiryForm } from "@/components/contact/GeneralInquiryForm";
import { siteConfig, whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact — CAMUS Labs",
  description: "Get in touch with CAMUS Labs for a project inquiry, consultation, or general question.",
};

const paths = [
  {
    icon: Rocket,
    title: "Project inquiry",
    desc: "Have a build in mind? Start the project intake and get a reference number.",
    action: <Button href="/start-project" size="sm">Start Your Project</Button>,
  },
  {
    icon: CalendarClock,
    title: "Book a consultation",
    desc: "Talk it through first. Pick a slot and we'll confirm by email — or message us on WhatsApp.",
    action: (
      <Button href="/consultations" size="sm" variant="secondary">
        Book a consultation
      </Button>
    ),
  },
  {
    icon: MessageSquare,
    title: "General inquiry",
    desc: "Just have a question? Use the form below, or reach out directly.",
    action: (
      <Button href="#general-inquiry" size="sm" variant="ghost">
        Go to form ↓
      </Button>
    ),
  },
];

export default function ContactPage() {
  return (
    <PublicChrome>
      <Section
        eyebrow="Contact"
        heading="Let's talk about what you're building."
        subheading="Three ways to reach CAMUS Labs — pick whichever fits, all of them reach a real person."
        align="center"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {paths.map((p) => (
            <Card key={p.title} className="flex flex-col items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-50 text-signal-dark">
                <p.icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-base font-medium text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{p.desc}</p>
              <div className="mt-5">{p.action}</div>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-mist">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-200 bg-paper p-8 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="text-sm text-slate-400">Direct contact</p>
            <p className="mt-1 text-lg font-medium text-ink">{siteConfig.founderName}</p>
            <p className="text-sm text-slate-500">{siteConfig.founderTitle}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={`tel:${siteConfig.phoneE164}`}
              className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-ink"
            >
              <Phone size={16} strokeWidth={1.75} />
              {siteConfig.phoneDisplay}
            </a>
            <a
              href={whatsappLink("Hi CAMUS Labs, I'd like to get in touch.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-ink"
            >
              <MessageCircle size={16} strokeWidth={1.75} />
              WhatsApp
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-ink"
            >
              <Mail size={16} strokeWidth={1.75} />
              {siteConfig.email}
            </a>
          </div>
        </div>
      </Section>

      <Section
        id="general-inquiry"
        eyebrow="General inquiry"
        heading="Or send a message directly."
      >
        <div className="mx-auto max-w-[560px]">
          <GeneralInquiryForm />
        </div>
      </Section>
    </PublicChrome>
  );
}
