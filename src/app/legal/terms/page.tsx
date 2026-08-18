import type { Metadata } from "next";
import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service — CAMUS Labs",
  description: "The terms that govern use of the CAMUS Labs website.",
};

export default function TermsOfServicePage() {
  return (
    <PublicChrome>
      <Section eyebrow="Legal" heading="Terms of Service" subheading="Last updated 18 August 2026." align="center" />

      <Section>
        <div className="mx-auto flex max-w-[720px] flex-col gap-8 text-sm leading-relaxed text-slate-600">
          <div>
            <h2 className="text-lg font-medium text-ink">Scope</h2>
            <p className="mt-3">
              These terms cover your use of this website — browsing it, and submitting the Contact or Start Your
              Project forms. They don&rsquo;t cover the terms of an actual project engagement: if you become a CAMUS
              Labs client, that work is governed by a separate signed proposal or agreement, which takes precedence
              over anything on this site.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-ink">Using this site</h2>
            <p className="mt-3">
              This site is provided for genuine inquiries about CAMUS Labs&rsquo; services. Please don&rsquo;t use the
              Contact or Start Your Project forms to submit spam, or to send content that&rsquo;s unlawful, abusive,
              or infringes someone else&rsquo;s rights.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-ink">Content on this site</h2>
            <p className="mt-3">
              Text, design, and branding on this site belong to CAMUS Labs unless stated otherwise. Descriptions of
              solutions, industries and any published project work are provided to explain what we do — they&rsquo;re
              not a guarantee that a future project will follow the same approach, timeline, or outcome, since every
              engagement is scoped individually.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-ink">Third-party links</h2>
            <p className="mt-3">
              This site links out to WhatsApp and uses standard email/phone contact methods. We&rsquo;re not
              responsible for the content or practices of those third-party services.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-ink">No warranty</h2>
            <p className="mt-3">
              This website and its content are provided &ldquo;as is&rdquo;, without warranties of any kind. We work
              to keep it accurate and available, but don&rsquo;t guarantee it will be error-free or uninterrupted.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-ink">Limitation of liability</h2>
            <p className="mt-3">
              To the extent permitted by law, CAMUS Labs isn&rsquo;t liable for indirect or consequential loss arising
              from your use of this website. This doesn&rsquo;t limit liability that can&rsquo;t be excluded by law.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-ink">Governing law</h2>
            <p className="mt-3">These terms are governed by the laws of India.</p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-ink">Changes to these terms</h2>
            <p className="mt-3">
              If these terms change in a meaningful way, we&rsquo;ll update the date at the top of this page.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-ink">Contact</h2>
            <p className="mt-3">
              Questions about these terms:{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-signal hover:text-signal-dark">
                {siteConfig.email}
              </a>{" "}
              or see the{" "}
              <Link href="/contact" className="text-signal hover:text-signal-dark">
                Contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>
    </PublicChrome>
  );
}
