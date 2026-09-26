"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/cn";
import { getTranslator } from "@/lib/learn/i18n";
import { BOTTOM_NAV, NAV_SECTIONS, isActive } from "./nav";
import { CamusWordmark, CamusMark } from "./Brand";
import { InstallPrompt } from "./InstallPrompt";

interface ShellProps {
  children: React.ReactNode;
  locale: string;
  displayName: string;
  planName: string;
  isStaff: boolean;
  signOutAction: () => Promise<void>;
}

/**
 * Responsive app shell:
 *  - ≥1024px: full sidebar with labels
 *  - 768–1023px: icon rail (keeps content width for iPad split-screen)
 *  - <768px: top bar + native-style bottom tab bar with safe-area insets
 */
export function AppShell({ children, locale, displayName, planName, isStaff, signOutAction }: ShellProps) {
  const pathname = usePathname();
  const t = getTranslator(locale);
  const isChat = pathname.startsWith("/app/assistant");

  return (
    <div className="flex min-h-dvh bg-mist">
      {/* Sidebar / rail */}
      <aside className="no-print sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-slate-200 bg-paper md:flex md:w-[72px] lg:w-64 pl-safe">
        <div className="flex h-16 items-center px-4 lg:px-5">
          <Link href="/app" aria-label="Camus Learn home" className="hidden lg:block">
            <CamusWordmark />
          </Link>
          <Link href="/app" aria-label="Camus Learn home" className="mx-auto lg:hidden">
            <CamusMark />
          </Link>
        </div>
        <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 pb-4">
          {NAV_SECTIONS.map((section, i) => (
            <div key={i} className={cn(i > 0 && "mt-5")}>
              {section.titleKey && (
                <p className="mb-1.5 hidden px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400 lg:block">{t(section.titleKey)}</p>
              )}
              {i > 0 && <div className="mx-auto mb-3 h-px w-8 bg-slate-200 lg:hidden" />}
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const active = isActive(pathname, item);
                  const label = t(item.labelKey);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        title={label}
                        className={cn(
                          "flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors md:justify-center lg:justify-start",
                          active ? "bg-slate-100 font-medium text-ink" : "text-slate-600 hover:bg-slate-50 hover:text-ink"
                        )}
                      >
                        <item.icon size={18} strokeWidth={1.75} className={cn(active ? "text-signal" : "text-slate-500")} aria-hidden />
                        <span className="md:sr-only lg:not-sr-only">{label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {isStaff && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <Link
                href="/admin/learn"
                title={t("nav.admin")}
                className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-ink md:justify-center lg:justify-start"
              >
                <Shield size={18} strokeWidth={1.75} className="text-slate-500" aria-hidden />
                <span className="md:sr-only lg:not-sr-only">{t("nav.admin")}</span>
              </Link>
            </div>
          )}
        </nav>
        <div className="border-t border-slate-100 p-3">
          <div className="hidden items-center gap-3 rounded-lg px-2 py-2 lg:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[13px] font-semibold text-ink">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-ink">{displayName}</span>
              <span className="block text-xs text-slate-500">{planName} plan</span>
            </span>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              title={t("nav.signOut")}
              className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-slate-500 hover:bg-slate-50 hover:text-ink md:justify-center lg:justify-start"
            >
              <LogOut size={18} strokeWidth={1.75} aria-hidden />
              <span className="md:sr-only lg:not-sr-only">{t("nav.signOut")}</span>
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        {!isChat && (
          <header className="no-print sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-paper/90 px-4 backdrop-blur-md pt-safe md:hidden">
            <div className="flex h-14 items-center">
              <Link href="/app" aria-label="Camus Learn home">
                <CamusWordmark />
              </Link>
            </div>
            <Link href="/app/profile" aria-label="Your Career Twin" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[13px] font-semibold text-ink">
              {displayName.slice(0, 1).toUpperCase()}
            </Link>
          </header>
        )}

        <main id="main" className={cn("flex-1", !isChat && "pb-bottom-nav")}>
          {children}
        </main>
        <InstallPrompt variant="banner" />
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Primary"
        className={cn(
          "no-print fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-paper/95 backdrop-blur-md pb-safe md:hidden",
          isChat && "hidden"
        )}
      >
        <ul className="mx-auto flex h-[var(--bottom-nav-h)] max-w-md items-stretch justify-around px-2">
          {BOTTOM_NAV.map((item) => {
            const active =
              item.href === "/app/more"
                ? pathname === "/app/more" || ["/app/profile", "/app/billing", "/app/settings", "/app/projects", "/app/founder", "/app/academy", "/app/resume", "/app/jobs", "/app/interview"].some((p) => pathname.startsWith(p))
                : item.href === "/app/study"
                  ? pathname.startsWith("/app/study") || pathname.startsWith("/app/exams")
                  : item.href === "/app/careers"
                    ? pathname.startsWith("/app/careers") || pathname.startsWith("/app/roadmaps")
                    : isActive(pathname, item);
            return (
              <li key={item.href} className="flex flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium active:bg-slate-50"
                >
                  <item.icon size={22} strokeWidth={active ? 2 : 1.6} className={active ? "text-ink" : "text-slate-400"} aria-hidden />
                  <span className={active ? "text-ink" : "text-slate-500"}>{t(item.labelKey)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
