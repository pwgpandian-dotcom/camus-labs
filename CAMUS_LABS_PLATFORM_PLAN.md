# CAMUS Labs — Platform Plan
### Technology for Every Idea

Prepared: 17 August 2026
Status: Phase 1 (Brand + Design System + Website Architecture)

---

## 1. Executive Summary

CAMUS Labs is being positioned as a global technology partner and product-building platform — not a web agency. The platform has three surfaces that will be built in phases:

1. **Public website** — marketing, credibility, lead generation, project onboarding
2. **Client portal** — authenticated dashboard for clients to track projects, milestones, payments, documents, and messages
3. **Admin platform** — internal operations console for leads, projects, clients, content, and payments

This document is the output of the "first task": analyze the vision, define the architecture, and identify risks — before writing code. Phase 1 (this session) delivers the brand foundation, the design system, and the coded homepage. Everything else follows the phased roadmap in Section 8.

**Known gap, called out honestly:** CAMUS Labs has no real completed projects, brand assets, or client results yet. Per your instruction, no fabricated case studies, testimonials, statistics, or client logos are included anywhere. The Featured Projects section and any "global clients" section are built as structurally complete, clearly-labeled placeholders ready to receive real content the moment it exists. This is a decision worth revisiting once you have 1–2 real projects to showcase — a "Sample Work" framing reads better to enterprise buyers than empty placeholders, and is what's used here.

---

## 2. Information Architecture

### 2.1 Public Website

| Route | Purpose |
|---|---|
| `/` | Home — hero, what we build, solutions, industries, how it works, featured projects, AI layer, why CAMUS, CTA |
| `/solutions` | Solutions overview (7 categories) |
| `/solutions/[slug]` | Individual solution detail (e.g. `/solutions/ai-agents`) |
| `/industries` | Industries overview (12 industries) |
| `/industries/[slug]` | Individual industry detail |
| `/projects` | Case studies index |
| `/projects/[slug]` | Individual case study |
| `/ai-agents` | AI Agent layer — what agents CAMUS Labs builds and how they work |
| `/about` | Company, mission, vision, engineering approach |
| `/contact` | General inquiry, project inquiry, consultation booking entry points |
| `/start-project` | 7-step project onboarding flow |
| `/start-project/confirmation` | Reference number + next steps |
| `/legal/privacy`, `/legal/terms` | Standard legal pages (needed before any lead form goes live) |

### 2.2 Client Portal (authenticated, role: `client`)

| Route | Purpose |
|---|---|
| `/portal` | Dashboard — active projects, status, milestones, meetings, documents, payments, messages |
| `/portal/projects/[id]` | Project detail — overview, requirements, milestones, timeline, tasks, files, discussions, dev updates, testing, deployment, launch status |
| `/portal/consultations` | Book a consultation — type, date/time, requirements, confirm |
| `/portal/documents` | Document library |
| `/portal/payments` | Invoices and payment history |
| `/portal/messages` | Threaded messaging with the CAMUS team |
| `/portal/settings` | Account, notification preferences |

### 2.3 Admin Platform (authenticated, roles: `admin`, `operator`, `sales`)

| Route | Purpose |
|---|---|
| `/admin` | Overview — pipeline health, active projects, upcoming consultations |
| `/admin/leads` | Lead inbox from general/project inquiries |
| `/admin/requests` | Start-Your-Project submissions, triage → convert to project |
| `/admin/clients` | Client directory |
| `/admin/projects` | Project list, status, health |
| `/admin/projects/[id]` | Manage milestones, tasks, files, discussions |
| `/admin/consultations` | Calendar of booked consultations |
| `/admin/documents` | Document management |
| `/admin/payments` | Invoices, payment status |
| `/admin/messages` | All client threads |
| `/admin/case-studies` | Publish/edit case studies (feeds `/projects`) |
| `/admin/content` | Website content (solutions, industries copy, homepage sections) |
| `/admin/team` | Role-based access management |

---

## 3. User Journeys

**Primary journey:** Discover → Explore → Choose → Start Project → Consultation → Proposal → Build → Launch

- **Visitor (cold):** lands on `/` from search/referral → understands what CAMUS builds within 5 seconds via hero + "what we build" grid → browses `/solutions` or `/industries` relevant to them → reads a case study on `/projects` → clicks **Start Your Project**.
- **Visitor (warm/referred):** goes straight to `/start-project` or `/contact` → books a consultation.
- **Lead → Client:** submits the 7-step onboarding form → receives confirmation + reference number → CAMUS team reviews in `/admin/requests` → books a consultation call → proposal sent → on acceptance, lead is converted to a client account and a project is created → client receives portal access.
- **Client (active project):** logs into `/portal` → checks milestone status → reviews files/updates → messages the team → pays invoices → books follow-up consultations as needed.
- **Admin/Operator:** triages new leads daily → manages active project milestones and tasks → uploads documents/updates → responds to client messages → publishes finished work as a case study.

---

## 4. Design System

### 4.1 Principles
Premium, minimal, elegant, high-trust, spacious, strong typographic hierarchy. No AI-gradient clichés, no glassmorphism overload, no stock photography. Trust is built through restraint, precision spacing, and real content — not decoration.

### 4.2 Color System
A near-black/near-white neutral base (like Linear/Vercel) with a single confident accent, used sparingly.

- **Ink** `#0A0A0B` — primary text, dark surfaces
- **Paper** `#FFFFFF` / **Mist** `#FAFAFA` — light surfaces
- **Slate scale** `#F5F5F6 → #6B6B70 → #1C1C1F` — borders, secondary text, muted UI
- **Signal (accent)** `#3B5BFF` (indigo-blue) — primary CTAs, links, focus states, active nav — used deliberately, never as decoration
- **Success** `#1F9D6C`, **Warning** `#B98900`, **Danger** `#D6432F` — status only (project health, badges)

### 4.3 Typography
- **Display / Headings:** "Geist" (or "Inter Tight" fallback) — geometric, confident, tightened tracking on large sizes
- **Body:** "Inter" — optimized for long-form and UI text
- **Mono (for reference numbers, code, technical labels):** "Geist Mono" / "JetBrains Mono"
- Type scale: 12 / 14 / 16 / 18 / 20 / 24 / 32 / 40 / 56 / 72px, with a 1.5 body line-height and tightened (1.05–1.15) display line-height.

### 4.4 Spacing & Layout
- 8px base unit. Section vertical rhythm: 96–160px desktop, 56–80px mobile.
- Max content width 1280px, with a 720px column for long-form text.
- Grid: 12-column desktop, 4-column mobile.

### 4.5 Components (built in Phase 1)
Button (primary/secondary/ghost, 3 sizes), Badge/status pill, Card (project, solution, industry variants), Container, Section wrapper with eyebrow/heading/subheading pattern, Navbar (with mega-menu-ready structure), Footer, Stat tile, Logo mark.

Deferred to later phases (defined here, built when the relevant page ships): Input, Select, Textarea, Modal, Table, Tabs, Stepper (for the 7-step flow), Toast, Avatar, File dropzone, Chat/message bubble, Calendar/date picker.

### 4.6 Figma
The Figma MCP connection was still initializing during this session. Once available, the next step is to run the design-system generation flow against these tokens (colors, type scale, spacing, and the component list above) to produce a synced Figma library, then design the desktop/tablet/mobile homepage from those components. This is queued as a Phase 1 follow-up rather than blocking the coded homepage.

---

## 5. Database Architecture (Supabase / Postgres)

No existing Supabase project was connected to inspect, so this is a fresh schema proposal — to be validated against a real `list_tables` inspection before the first migration is applied.

```
profiles              id (uuid, fk auth.users), full_name, email, phone, role (enum: visitor|client|admin|operator|sales), company, created_at

leads                 id, name, email, phone, company, message, source, status (new|contacted|qualified|archived), created_at

project_requests      id, reference_number (unique, e.g. CML-2026-0001), lead_id (fk), build_type, idea_description,
                       industry, timeline, budget_range, contact_name, contact_email, contact_phone,
                       wants_consultation (bool), status (received|reviewing|proposal_sent|accepted|declined), created_at

clients                id, profile_id (fk profiles), company_name, billing_address, created_at

projects               id, client_id (fk), name, slug, status (discovery|design|development|testing|deployed|launched|on_hold),
                       summary, current_milestone_id, next_milestone_id, start_date, target_launch_date, created_at

milestones             id, project_id (fk), title, description, status (pending|in_progress|completed|blocked),
                       due_date, completed_at, sort_order

tasks                  id, project_id (fk), milestone_id (fk, nullable), title, status (todo|in_progress|review|done),
                       assignee_id, due_date, created_at

documents               id, project_id (fk, nullable), client_id (fk, nullable), title, file_url (Cloudinary/Supabase Storage),
                       category (contract|requirement|design|report|other), uploaded_by, created_at

payments               id, project_id (fk), client_id (fk), invoice_number, amount, currency, status (pending|paid|overdue|refunded),
                       due_date, paid_at, created_at

messages               id, project_id (fk, nullable), sender_id (fk profiles), recipient_id (fk profiles, nullable),
                       thread_id, body, read_at, created_at

consultations          id, client_id (fk, nullable), lead_id (fk, nullable), type (discovery|technical|proposal|support),
                       scheduled_at, duration_minutes, status (requested|confirmed|completed|cancelled), notes, created_at

case_studies            id, slug, project_name, industry, problem, solution, features (jsonb), technology (jsonb),
                        screenshots (jsonb array of URLs), results, live_demo_url, is_published, created_at

site_content            id, section_key (unique, e.g. "home.hero"), content (jsonb), updated_by, updated_at
```

Row Level Security approach: clients can only read rows where `client_id` matches their `profiles.id` (via join); admins/operators bypass via a `role` check in policy; public tables (`case_studies` where `is_published = true`, `site_content`) are readable by `anon`. Every write to `leads` and `project_requests` from the public site goes through a server action / edge function using the service role — never direct anon inserts with elevated trust.

---

## 6. Technical Architecture

- **Frontend:** Next.js (App Router) + TypeScript + React + Tailwind CSS. Server Components by default; client components only where interactivity requires it (forms, stepper, dashboard widgets).
- **Backend:** Supabase (Postgres + Auth + Row Level Security + Storage). Server Actions for mutations (lead capture, project requests, consultation booking); Supabase client for authenticated portal/admin reads.
- **Auth:** Supabase Auth (email/password + magic link). Three roles enforced via RLS policies and route middleware: `client`, `admin`/`operator`, and public/anon.
- **Infrastructure:** Vercel for hosting/CI, Cloudinary for case-study screenshots and marketing media (Supabase Storage for private client documents).
- **AI layer:** Anthropic/OpenAI APIs for the specific agent use cases described on `/ai-agents` (support, lead qualification, document processing, research, scheduling) — built as real backend workflows in a later phase, not a chat widget bolted onto the marketing site.
- **Environment variables:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only), `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` (server-only), `CLOUDINARY_URL`. None are hardcoded; `.env.example` ships with the repo, real values stay out of git.

---

## 7. Risks & Open Questions

1. **No real projects yet.** Case studies and any "trusted by" section must stay clearly placeholder until real work exists — flagged throughout, not just here.
2. **No brand assets.** The color/type system above is a proposal, not a locked identity. Worth a lightweight logo exploration (Canva or Figma) before this goes live publicly, so the wordmark and the coded design system match.
3. **No Supabase project connected yet.** Schema above is a proposal to validate once a real project exists — actual `list_tables` inspection comes first, per your own rule 12.2.
4. **Consultation booking + calendar sync** (Step 7 of onboarding, and `/portal/consultations`) will eventually need a calendar integration (Google Calendar / Cal.com-style availability) — not decided yet, flagged for Phase 4.
5. **Payments**: no payment processor specified (Razorpay makes sense for Indian clients, Stripe for international — likely need both). Flagged for Phase 6.
6. **AI agent layer** scope is broad (11 agent types listed) — Phase 8 should ship 2–3 real, working agent workflows rather than 11 shallow ones.

---

## 8. Roadmap

| Phase | Scope | This session |
|---|---|---|
| 1 | Brand + design system + architecture | **In progress — this document + coded design system + homepage** |
| 2 | Full public website (solutions, industries, projects, about, contact pages) | Next |
| 3 | Start Your Project 7-step onboarding | Next |
| 4 | Consultation booking | Next |
| 5 | Auth + client portal | Next |
| 6 | Project management dashboard + payments | Next |
| 7 | Admin dashboard | Next |
| 8 | AI agent showcase + real agent integrations | Next |
| 9 | Production hardening (a11y, perf, error states) | Next |
| 10 | Deployment + QA | Next |

---

## 9. What Ships in This Session

- This planning document
- Next.js + TypeScript + Tailwind project scaffold (`camus-labs/`)
- Design tokens (colors, type, spacing) wired into Tailwind config
- Core components: Button, Badge, Card, Container, Section, Navbar, Footer
- Fully coded homepage: Hero, What We Build, Solutions, Industries, How It Works, Featured Projects (placeholder, clearly labeled), AI & Agentic Systems, Why CAMUS Labs, Global Client section (placeholder), CTA, Footer
