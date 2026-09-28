import { PlanGate } from "@/components/learn/PlanGate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PlanGate feature="projects">{children}</PlanGate>;
}
