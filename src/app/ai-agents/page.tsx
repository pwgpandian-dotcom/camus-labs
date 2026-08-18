import type { Metadata } from "next";
import {
  Headphones,
  TrendingUp,
  Filter,
  FileText,
  Search,
  Workflow,
  BarChart3,
  CalendarClock,
  ShoppingCart,
  Users,
  Settings2,
  CheckCircle2,
} from "lucide-react";
import { PublicChrome } from "@/components/PublicChrome";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { CTA } from "@/components/sections/CTA";
import { getSolution } from "@/lib/solutions";

export const metadata: Metadata = {
  title: "AI Agents — CAMUS Labs",
  description:
    "Specialized AI agents CAMUS Labs builds into products and internal operations — grounded in your own tools and data, not a chat widget bolted onto a homepage.",
};

const agents = [
  {
    label: "Customer Support",
    icon: Headphones,
    desc: "Handles routine questions grounded in your own product docs and policies, and escalates to a human the moment it's unsure.",
  },
  {
    label: "Sales",
    icon: TrendingUp,
    desc: "Answers product questions in real time and moves qualified conversations toward booked time with your team.",
  },
  {
    label: "Lead Qualification",
    icon: Filter,
    desc: "Scores and routes inbound leads against your own qualification criteria, so your team spends time on the ones worth calling.",
  },
  {
    label: "Document Processing",
    icon: FileText,
    desc: "Extracts and structures data out of contracts, forms and reports, instead of someone re-typing it by hand.",
  },
  {
    label: "Research",
    icon: Search,
    desc: "Pulls together grounded answers from your internal documents or the web for reports and decisions, with sources you can check.",
  },
  {
    label: "Internal Automation",
    icon: Workflow,
    desc: "Triggers the next step in a workflow — an approval, a notification, a status update — without someone remembering to do it.",
  },
  {
    label: "Data Analysis",
    icon: BarChart3,
    desc: "Turns raw operational data into a summary someone actually reads, on a schedule that matches how the business runs.",
  },
  {
    label: "Scheduling",
    icon: CalendarClock,
    desc: "Coordinates meetings, availability and reminders across your team and your clients.",
  },
  {
    label: "E-commerce Assistance",
    icon: ShoppingCart,
    desc: "Helps shoppers find products and answers order questions, reducing support load on commerce products.",
  },
  {
    label: "Recruitment",
    icon: Users,
    desc: "Screens resumes and applications against your criteria and moves qualified candidates forward.",
  },
  {
    label: "Operations",
    icon: Settings2,
    desc: "Watches for exceptions in day-to-day operations and flags — or handles — them before they become a bigger problem.",
  },
];

export default function AIAgentsPage() {
  const solution = getSolution("ai-agents");

  return (
    <PublicChrome>
      <Section
        eyebrow="AI & agentic systems"
        heading="AI that works for your business."
        subheading={
          solution?.overview ??
          "Beyond chatbots — CAMUS Labs builds specialized agents that plug into how your business actually runs, handling real tasks end to end."
        }
        align="center"
      />

      <Section eyebrow="What we build" heading="Agent types we build into products and operations." className="bg-mist">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.label}>
              <agent.icon size={22} strokeWidth={1.75} className="text-signal" />
              <h3 className="mt-3 text-lg font-medium text-ink">{agent.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{agent.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {solution && (
        <Section eyebrow="How we build it" heading="Built to be trusted in production.">
          <ul className="flex flex-col gap-3">
            {solution.capabilities.map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
                <CheckCircle2 size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-signal" />
                {c}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CTA />
    </PublicChrome>
  );
}
