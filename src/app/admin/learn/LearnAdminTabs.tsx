"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/admin/learn", label: "Overview", exact: true },
  { href: "/admin/learn/learners", label: "Learners" },
  { href: "/admin/learn/subscriptions", label: "Subscriptions" },
  { href: "/admin/learn/pricing", label: "Pricing & coupons" },
  { href: "/admin/learn/ai", label: "AI models & prompts" },
  { href: "/admin/learn/exams", label: "Exams & questions" },
  { href: "/admin/learn/settings", label: "Flags & regions" },
];

export function LearnAdminTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Camus Learn admin" className="-mx-6 overflow-x-auto border-b border-slate-200 px-6 [scrollbar-width:none] md:mx-0 md:px-0">
      <ul className="flex gap-1">
        {TABS.map((t) => {
          const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link href={t.href} aria-current={active ? "page" : undefined} className={cn("inline-flex min-h-11 items-center whitespace-nowrap border-b-2 px-3 text-sm", active ? "border-ink font-medium text-ink" : "border-transparent text-slate-500 hover:text-ink")}>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
