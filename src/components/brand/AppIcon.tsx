import { cn } from "@/lib/cn";
import type { CamusApp, AppStatus } from "@/lib/apps";
import { statusLabel } from "@/lib/apps";

/** Camus app logo: soft blue tile with a two-tone steel-blue glyph. */
export function AppIcon({ app, className, inverted = false }: { app: Pick<CamusApp, "icon" | "name">; className?: string; inverted?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" className={cn("h-10 w-10 shrink-0", className)} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill={inverted ? "#2C6E9E" : "#EAF2F8"} />
      <g transform="translate(9 9) scale(0.9167)" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1">
        <path d={app.icon[0]} stroke={inverted ? "#FFFFFF" : "#2C6E9E"} />
        <path d={app.icon[1]} stroke={inverted ? "#BFD9EC" : "#7AA7C7"} />
      </g>
    </svg>
  );
}

const pill: Record<AppStatus, string> = {
  live: "bg-[#E6F4EE] text-[#146C4B]",
  ready: "bg-[#EAF2F8] text-[#235A82]",
  request: "bg-slate-100 text-slate-700",
};
const dot: Record<AppStatus, string> = {
  live: "bg-[#1F9D6C]",
  ready: "bg-[#2C6E9E]",
  request: "bg-slate-400",
};

export function StatusPill({ status, className }: { status: AppStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold", pill[status], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dot[status])} />
      {statusLabel[status]}
    </span>
  );
}

export function StatusDot({ status }: { status: AppStatus }) {
  return <span className={cn("inline-block h-2 w-2 rounded-full", dot[status])} title={statusLabel[status]} />;
}
