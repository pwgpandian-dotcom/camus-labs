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
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

const agents = [
  { label: "Customer Support", icon: Headphones },
  { label: "Sales", icon: TrendingUp },
  { label: "Lead Qualification", icon: Filter },
  { label: "Document Processing", icon: FileText },
  { label: "Research", icon: Search },
  { label: "Internal Automation", icon: Workflow },
  { label: "Data Analysis", icon: BarChart3 },
  { label: "Scheduling", icon: CalendarClock },
  { label: "E-commerce Assistance", icon: ShoppingCart },
  { label: "Recruitment", icon: Users },
  { label: "Operations", icon: Settings2 },
];

export function AIAgents() {
  return (
    <Section className="bg-ink text-paper" heading={null}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="mb-3 text-xs font-mono uppercase tracking-[0.14em] text-signal">
            AI & agentic systems
          </p>
          <h2 className="text-balance text-3xl md:text-4xl font-medium tracking-tight leading-[1.1]">
            AI that works for your business.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-400">
            Beyond chatbots — CAMUS Labs builds specialized agents that plug into
            how your business actually runs, handling real tasks end to end.
          </p>
          <div className="mt-8">
            <Button href="/ai-agents" variant="secondary" size="md" className="border-slate-600 text-paper hover:bg-slate-800 hover:border-slate-500">
              Explore AI Agents
            </Button>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {agents.map((agent) => (
              <div
                key={agent.label}
                className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-4"
              >
                <agent.icon size={18} strokeWidth={1.75} className="text-signal" />
                <span className="text-sm text-slate-200">{agent.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
