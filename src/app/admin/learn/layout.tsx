import { LearnAdminTabs } from "./LearnAdminTabs";

export default function LearnAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">Camus Learn</p>
      <LearnAdminTabs />
      <div className="mt-8">{children}</div>
    </div>
  );
}
