import { cn } from "@/lib/cn";

type Tone = "neutral" | "signal" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-600",
  signal: "bg-signal-50 text-signal-dark",
  success: "bg-[#e8f6ef] text-success",
  warning: "bg-[#fbf1dc] text-warning",
  danger: "bg-[#fbeae7] text-danger",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
