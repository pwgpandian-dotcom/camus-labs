import type { Metadata } from "next";
import Link from "next/link";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy — CAMUS Labs",
  description: "How CAMUS Labs collects, uses and protects information submitted through this website.",
};

export default function PrivacyPolicyPage() {
  return (
    <PublicChrome>
      <Section eyebrow="Legal" heading="Privacy Policy" subheading="Last updated 18 August 2026." align="center" />

      <Section>
        <div className="mx-auto flex max-w-[720px] flex-col gap-8 text-sm leading-relaxed text-slate-600">
          <div>
            <h2 className="text-lg font-medium text-ink">Who we are</h2>
            <p className="mt-3">
              CAMUS Labs (&ldquo;CAMUS Labs&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a founder-led technology
              studio. This policy explains what information this website collects when you use it, and how we handle
              it.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-ink">What we collect</h2>
            <p className="mt-3">We only collect information you choose to give us, through:</p>
            <ul className="mt-3 flex flex-col gap-2 list-disc pl-5">
              <li>The <strong className="text-ink">Start Your Project</strong> form — what you&rsquo;re building, a
                description of your idea, industry, timeline and budget range (optional fields), and your name,
                email and phone number.</li>
              <li>The <strong className="text-ink">Contact</strong> form or a direct email/call — your name, contact
                details and whatever you tell us about your inquiry.</li>
            </ul>
            <p className="mt-3">
              We don&rsquo;t use advertising or analytics cookies, and we don&rsquo;t collect information about you
              from third parties.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-ink">How we use it</h2>
            <p className="mt-3">
              Submitted information is used to respond to your inquiry, evaluate whether a project is a good fit, and
              follow up about a consultation or proposal. Project requests are also logged internally as leads so our
              team can track and respond to them — this is operational, not a marketing list.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-ink">Where it&rsquo;s stored</h2>
            <p className="mt-3">
              Form submissions are stored in a Postgres database (Supabase), access to which is restricted to CAMUS
              Labs. We do not sell your information, and we do not share it with third parties for their own
              marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-ink">WhatsApp</h2>
            <p className="mt-3">
              If you message us via the WhatsApp button on this site, that conversation happens on WhatsApp and is
              subject to WhatsApp&rsquo;s (Meta&rsquo;s) own privacy policy, not this one.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-ink">Your rights</h2>
            <p className="mt-3">
              You can ask us what information we hold about you, ask us to correct it, or ask us to delete it, at any
              time — email{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-signal hover:text-signal-dark">
                {siteConfig.email}
              </a>{" "}
              and we&rsquo;ll act on it promptly.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-ink">Changes to this policy</h2>
            <p className="mt-3">
              If this policy changes in a meaningful way, we&rsquo;ll update the date at the top of this page.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-ink">Contact</h2>
            <p className="mt-3">
              Questions about this policy: {" "}
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
