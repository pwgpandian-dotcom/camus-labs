import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  hover = true,
}: {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-paper p-7",
        hover && "transition-colors duration-150 hover:border-slate-400",
        className
      )}
    >
      {children}
    </div>
  );
}
