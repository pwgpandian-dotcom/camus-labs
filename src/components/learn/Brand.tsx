import { cn } from "@/lib/cn";

/**
 * Camus Learn mark: an open "C" (the journey) with a single point of light
 * where it opens (the next step). Same geometry as the PWA app icon.
 */
export function CamusMark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={cn("shrink-0", className)} aria-hidden>
      <rect width="64" height="64" rx="15" fill="#0A0A0B" />
      <path d="M44.5 21.5A16 16 0 1 0 44.5 42.5" fill="none" stroke="#fff" strokeWidth="6.5" strokeLinecap="round" />
      <circle cx="46.5" cy="32" r="4.25" fill="#3B5BFF" />
    </svg>
  );
}

export function CamusWordmark({ className, product = "Learn" }: { className?: string; product?: string | null }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <CamusMark size={26} />
      <span className="text-[15px] font-semibold tracking-tight text-ink">
        Camus{product ? <span className="font-normal text-slate-500"> {product}</span> : null}
      </span>
    </span>
  );
}
