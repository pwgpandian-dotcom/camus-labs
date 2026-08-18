"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const primaryNav = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/requests", label: "Project Requests" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/consultations", label: "Consultations" },
];

const secondaryNav = [
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/case-studies", label: "Case Studies" },
  { href: "/admin/content", label: "Website Content" },
  { href: "/admin/team", label: "Team & Roles" },
];

function NavLink({ href, label, exact }: { href: string; label: string; exact?: boolean }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-ink text-paper"
          : "text-slate-600 hover:bg-slate-100 hover:text-ink"
      )}
    >
      {label}
    </Link>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-6 border-r border-slate-200 bg-mist px-4 py-6 md:flex">
      <Link href="/admin" className="flex items-center gap-2 px-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-paper text-sm font-semibold">
          C
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-ink">
          CAMUS Admin
        </span>
      </Link>

      <nav className="flex flex-col gap-1">
        {primaryNav.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>

      <div>
        <p className="px-3 text-xs font-mono uppercase tracking-[0.1em] text-slate-400">
          Operations
        </p>
        <nav className="mt-2 flex flex-col gap-1">
          {secondaryNav.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}
