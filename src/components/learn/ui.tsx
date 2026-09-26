/**
 * Camus Learn UI kit — form controls, feedback and layout primitives that
 * sit on top of the existing brand primitives (Button, Badge, Card).
 * Server-component safe: nothing here uses state or effects.
 */
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const control =
  "w-full rounded-xl border border-slate-200 bg-paper px-3.5 py-2.5 text-base md:text-[15px] text-ink placeholder:text-slate-400 shadow-xs transition-colors focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20 disabled:bg-slate-50 disabled:text-slate-400 aria-[invalid=true]:border-danger";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, "min-h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, "min-h-28 resize-y leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(control, "min-h-11 appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10", className)} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b6b70' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }} {...props}>
      {children}
    </select>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-[13px] text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[13px] text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function Panel({ className, children, as: Tag = "div" }: { className?: string; children: ReactNode; as?: "div" | "section" | "article" }) {
  return <Tag className={cn("rounded-2xl border border-slate-200 bg-paper p-5 md:p-6", className)}>{children}</Tag>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">{eyebrow}</p>}
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-ink md:text-[28px]">{title}</h1>
        {description && <p className="mt-2 text-[15px] leading-relaxed text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Progress({ value, label, className }: { value: number; label?: string; className?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={cn("w-full", className)}>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className="h-full rounded-full bg-signal transition-[width] duration-500 ease-out" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} aria-hidden />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-mist px-6 py-12 text-center">
      {icon && <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-paper text-slate-500 shadow-xs">{icon}</div>}
      <p className="text-[15px] font-medium text-ink">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Notice({ tone = "neutral", children, className }: { tone?: "neutral" | "warning" | "danger" | "success" | "signal"; children: ReactNode; className?: string }) {
  const tones = {
    neutral: "border-slate-200 bg-mist text-slate-600",
    warning: "border-[#f1dfb0] bg-[#fdf8ec] text-[#7a5a00]",
    danger: "border-[#f3cdc6] bg-[#fdf3f1] text-danger",
    success: "border-[#c5e8d8] bg-[#f0faf5] text-success",
    signal: "border-[#d5dcff] bg-signal-50 text-signal-dark",
  } as const;
  return <div className={cn("rounded-xl border px-4 py-3 text-sm leading-relaxed", tones[tone], className)}>{children}</div>;
}

export function Chip({ children, active, className }: { children: ReactNode; active?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[13px]",
        active ? "border-ink bg-ink text-paper" : "border-slate-200 bg-paper text-slate-600",
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-paper p-4 md:p-5">
      <p className="text-[13px] text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

/** A tappable row with an arrow — the default "next action" affordance. */
export function ActionRow({
  href,
  icon,
  title,
  description,
  badge,
}: {
  href: string;
  icon?: ReactNode;
  title: string;
  description?: string;
  badge?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-16 items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50 active:bg-slate-100"
    >
      {icon && <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-ink ring-1 ring-slate-200 group-hover:bg-paper">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-[15px] font-medium text-ink">
          <span className="truncate">{title}</span>
          {badge}
        </span>
        {description && <span className="mt-0.5 block truncate text-[13px] text-slate-500">{description}</span>}
      </span>
      <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m9 6 6 6-6 6" />
      </svg>
    </Link>
  );
}
