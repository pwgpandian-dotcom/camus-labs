"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/portal", label: "Overview", exact: true },
  { href: "/portal/documents", label: "Documents" },
  { href: "/portal/messages", label: "Messages" },
];

export function PortalNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-slate-200">
      {navItems.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border-ink text-ink"
                : "border-transparent text-slate-500 hover:text-ink"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
