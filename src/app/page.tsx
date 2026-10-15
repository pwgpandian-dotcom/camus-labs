import type { Metadata } from "next";
import { PublicChrome } from "@/components/PublicChrome";
import { Hero, Goals, FeaturedApps, PlatformOffers, IndustryGrid, Audiences, HowWeWork, Principles, CustomerStories, FinalCTA } from "@/components/home/HomeSections";
import { APP_COUNT } from "@/lib/apps";

export const metadata: Metadata = {
  title: "Camus Labs — One platform to run your entire business",
  description: `${APP_COUNT} connected apps for billing, ERP, CRM, HR and AI — set up for your industry by our team and supported by the people who built it. Made in Bharat.`,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <PublicChrome>
      <Hero />
      <Goals />
      <FeaturedApps />
      <PlatformOffers />
      <IndustryGrid />
      <Audiences />
      <HowWeWork />
      <Principles />
      <CustomerStories />
      <FinalCTA />
    </PublicChrome>
  );
}
