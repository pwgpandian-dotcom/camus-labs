import { cn } from "@/lib/cn";

/**
 * Official Camus Labs wordmark: steel-blue chevron, charcoal CAMUS,
 * light grey LABS with the network-triangle "A".
 * Recreated from the brand logo — replace with the master SVG when available.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-[0.35em] leading-none select-none", className)} aria-label="Camus Labs">
      <svg viewBox="0 0 26 44" width="13" height="22" className="h-[1.05em] w-auto shrink-0" aria-hidden="true">
        <path d="M25 0 L6 22 L25 44 L15 44 L0 22 L15 0 Z" fill="#3D85B8" />
      </svg>
      <span aria-hidden="true" className="font-semibold tracking-[0.16em] text-[#333333]">CAMUS</span>
      {!compact && (
        <span aria-hidden="true" className="ml-[0.3em] inline-flex items-center font-light tracking-[0.16em] text-[#8C8C8C]">
          L
          <svg viewBox="0 0 40 40" width="20" height="20" className="mx-[0.06em] h-[0.92em] w-auto" aria-hidden="true">
            <g fill="none" stroke="#7296AE" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
              <path d="M20 3 L37 36 L3 36 Z" />
              <path d="M11.5 20 L28.5 20 M20 3 L20 36 M11.5 20 L20 36 L28.5 20" />
            </g>
            <g fill="#3D85B8">
              <circle cx="20" cy="3.5" r="2.8" />
              <circle cx="11.5" cy="20" r="2.6" />
              <circle cx="28.5" cy="20" r="2.6" />
              <circle cx="20" cy="36" r="2.6" />
            </g>
          </svg>
          BS
        </span>
      )}
    </span>
  );
}

/** The network-triangle mark on its own — used for Camus One. */
export function NetworkMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="#2C6E9E" />
      <g fill="none" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
        <path d="M20 8 L31 30 L9 30 Z" />
        <path d="M14.5 19 L25.5 19 M14.5 19 L20 30 L25.5 19 M20 8 L20 30" />
      </g>
      <g fill="#BFD9EC">
        <circle cx="20" cy="8.5" r="2.2" />
        <circle cx="14.5" cy="19" r="2" />
        <circle cx="25.5" cy="19" r="2" />
        <circle cx="20" cy="30" r="2" />
      </g>
    </svg>
  );
}
