import type { Metadata } from "next";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { ProjectWizard } from "@/components/start-project/ProjectWizard";

export const metadata: Metadata = {
  title: "Start Your Project — CAMUS Labs",
  description: "Tell CAMUS Labs about your idea and get a reference number in minutes.",
};

export default function StartProjectPage() {
  return (
    <PublicChrome>
      <Section
        eyebrow="Start your project"
        heading="Let's turn your idea into a plan."
        subheading="Seven quick steps — takes about two minutes. You'll get a reference number the moment you submit, and we'll follow up by email."
        align="center"
      >
        <ProjectWizard />
      </Section>
    </PublicChrome>
  );
}
