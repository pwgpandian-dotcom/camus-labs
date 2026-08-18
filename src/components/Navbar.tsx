"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";

const links = [
  { href: "/solutions", label: "Solutions" },
  { href: "/industries", label: "Industries" },
  { href: "/projects", label: "Projects" },
  { href: "/ai-agents", label: "AI Agents" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-paper/85 backdrop-blur-md">
      <Container className="flex h-18 items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-paper text-sm font-semibold">
            C
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            CAMUS Labs
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-600 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button href="/contact" variant="ghost" size="sm">
            Book a Consultation
          </Button>
          <Button href="/start-project" variant="primary" size="sm">
            Start Your Project
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200"
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span className="h-px w-4 bg-ink" />
            <span className="h-px w-4 bg-ink" />
          </div>
        </button>
      </Container>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-paper">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 px-3">
              <Button href="/contact" variant="secondary" size="sm">
                Book a Consultation
              </Button>
              <Button href="/start-project" variant="primary" size="sm">
                Start Your Project
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
