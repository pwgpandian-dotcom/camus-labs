import { PublicChrome } from "@/components/PublicChrome";
import { Hero } from "@/components/sections/Hero";
import { WhatWeBuild } from "@/components/sections/WhatWeBuild";
import { Solutions } from "@/components/sections/Solutions";
import { Industries } from "@/components/sections/Industries";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { AIAgents } from "@/components/sections/AIAgents";
import { WhyCamus } from "@/components/sections/WhyCamus";
import { GlobalReach } from "@/components/sections/GlobalReach";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <PublicChrome>
      <Hero />
      <WhatWeBuild />
      <Solutions />
      <Industries />
      <HowItWorks />
      <FeaturedProjects />
      <AIAgents />
      <WhyCamus />
      <GlobalReach />
      <CTA />
    </PublicChrome>
  );
}
