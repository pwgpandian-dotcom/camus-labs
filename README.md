# CAMUS Labs — Technology for Every Idea

This build now includes: brand foundation + coded design system, the public
homepage, a real Supabase backend (schema + RLS + Storage), auth (sign in/up),
and a **fully functional Admin Dashboard** — all 12 sections read and write
live data, not placeholders. It also includes a public `/projects` page that
publishes real case studies the moment an admin marks one published, icon/
visual identity across every homepage section, a working Contact page
(WhatsApp, phone, email, and a general-inquiry form), and two Canva design
drafts (logo + social banner) saved to your connected Canva account. See
`CAMUS_LABS_PLATFORM_PLAN.md` for the full information architecture, user
journeys, database schema, technical architecture, roadmap, and open risks.

## Stack

- Next.js 16 (App Router) + TypeScript + React 19
- Tailwind CSS v4 (CSS-first config — design tokens live in `src/app/globals.css`)
- Supabase (Postgres + Auth + Row Level Security + Storage) via `@supabase/ssr`

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `.env.local` is already filled in with a
live, dedicated Supabase project ("CAMUS Labs", `ltiitmdnyymqimnjnzfl`,
`ap-south-1`, free tier) — no setup needed to run it locally.

## Becoming an admin (first-time setup)

The database starts empty on purpose — no fabricated accounts. To get into
`/admin`:

1. Run the app, go to `/login`, click **Sign up**, and create an account with
   your real email and a password you choose. (If email confirmation is
   enabled on the project, confirm via the email Supabase sends before
   signing in — ask me to check/adjust that setting if it gets in the way.)
2. Tell me the email you signed up with. I'll run one SQL statement
   (`update profiles set role = 'admin' where email = '...'`) to promote your
   profile — I never see or set your password, only the role.
3. Sign in again and `/admin` will be unlocked.

## Project structure

```
src/
  app/
    layout.tsx, page.tsx, globals.css   Root layout, homepage, design tokens
    login/                               Sign in / sign up
    portal/                              Client portal stub (Phase 5 builds this out)
    projects/, projects/[slug]/          Public case studies, fed by the admin CMS
    admin/                               Admin dashboard — 12 sections, all real
    actions/auth.ts, leads.ts, admin.ts  Server actions (sign out, lead capture, all admin CRUD)
  components/
    ui/                                  Design system primitives
    sections/                            Homepage sections
    admin/                               Admin-only building blocks (forms, selects, tables)
    contact/                             Contact page form
    Navbar.tsx, Footer.tsx
  lib/
    supabase/client.ts                   Browser Supabase client
    supabase/server.ts                   Server Component / Server Action Supabase client
    supabase/types.ts                    Generated DB types (regenerate after schema changes)
  proxy.ts                               Session refresh + role-gating for /portal and /admin
                                          (Next.js 16 renamed middleware.ts → proxy.ts)
supabase/migrations/                     Versioned SQL — schema, RLS, hardening, storage
```

## Admin Dashboard — what each section actually does

| Section | Real functionality |
|---|---|
| Overview | Live counts + recent requests |
| Leads | Read general-inquiry submissions |
| Project Requests | Read Start-a-Project submissions with reference numbers |
| Clients | Read client directory |
| Projects | Read active projects |
| **Consultations** | Update status (requested → confirmed → completed/cancelled) |
| **Documents** | Upload files to a private Supabase Storage bucket, list them, open via a short-lived signed URL |
| **Payments** | Record invoices against a client + project, mark paid/overdue/refunded — no payment gateway wired up, this tracks status manually (Razorpay/Stripe integration is Phase 6) |
| **Messages** | Threaded conversations grouped by `thread_id`, staff can reply |
| **Case Studies** | Create/edit/publish — publishing one makes it appear on the public `/projects` page and the homepage's Featured Projects section automatically |
| **Website Content** | Small JSON-based CMS (`site_content` table) — storage layer is real, no public pages read from it yet |
| **Team & Roles** | View every account; admins (only) can change a user's role, enforced both by RLS and a database trigger |

## What's still a placeholder

The client portal (`/portal`) is a one-screen stub — the real project-tracking
dashboard for clients is Phase 5. The rest of the public marketing site
(Solutions, Industries, About) and the Start Your Project 7-step onboarding
flow are Phase 2–3. Payments has no real payment gateway — it's an honest
manual invoice tracker until Razorpay/Stripe keys exist (Phase 6).

## Notes on decisions made building this

- **Fonts:** this sandbox had no outbound access to Google Fonts, so the
  design system ships with a system-font stack instead of `next/font/google`.
  Swap it in on the hosting build (which has full internet access) for pixel-exact brand
  typography — a one-line change in `layout.tsx` + the `--font-*` variables in
  `globals.css`.
- **No fabricated content:** no fake clients, projects, testimonials, or
  stats anywhere, including in the admin dashboard — empty states are real
  empty states, not seeded demo data.
- **Separate Supabase project:** your other Supabase project
  (`pwgpandian-dotcom's Project`) already holds an unrelated e-commerce
  marketplace schema, so CAMUS Labs got its own dedicated project rather than
  risking table-name collisions (both had `profiles` and `payments`) or a
  shared `auth.users` table between two unrelated products.
- **Role-escalation fix (migration `0003`):** the original `profiles` RLS
  policy let a signed-in client update their own row — including the `role`
  column, with no column-level restriction. That meant a client could have
  self-promoted to `admin` via a normal API call. A database trigger now
  blocks any role change unless the caller is already an admin, regardless of
  which RLS policy allowed the write — defense in depth, not just app-layer
  UI hiding.
- **Documents storage (migration `0003`):** a private `documents` Storage
  bucket, staff-only for now (`is_staff()` policy on `storage.objects`).
  Client-scoped access is deferred to Phase 5, when the real client portal
  can request signed URLs per project.
- **Known security lints (accepted, not bugs):** the Supabase advisor flags
  `is_staff()`, `is_admin()`, and `current_client_id()` as callable by `anon`/
  `authenticated` via RPC. This is required — RLS policies call these
  functions, so the querying role must have execute rights on them, and each
  one only ever returns a boolean/ID about the caller's own session, nothing
  sensitive. `handle_new_user()` and `prevent_role_self_escalation()` (both
  trigger-only functions) had direct-RPC access revoked (migration `0004`)
  since neither is ever meant to be called that way.

## Contact info

`src/lib/site-config.ts` is the single source of truth for phone/WhatsApp/
email — it feeds the Footer, the floating WhatsApp button (every public
page), and the `/contact` page. No LinkedIn link yet; add the URL there
whenever you have it and it'll show up automatically. To change the phone
number or email later, edit that one file — nothing else needs touching.

The general-inquiry form on `/contact` is wired to a real server action
(`src/app/actions/leads.ts`) that inserts into the `leads` table using the
same RLS policy that lets any visitor submit one. I verified the exact insert
shape works against the live database directly; I could not fully click
through the form in a browser from this sandbox because its network egress
allowlist blocked the new Supabase project's hostname (`Host not in
allowlist` — a restriction of this session's environment, not your app).
Test it once locally (`npm run dev` → `/contact` → submit) — it should just
work since your machine doesn't have that restriction; tell me if it doesn't.

## Figma & Canva

**Figma:** your account is still on a "View" seat (checked via `whoami`),
which can't create or edit files — you mentioned upgrading it yourself; tell
me once that's done and I'll sync the coded design system (colors, type
scale, spacing, components) into a real Figma library.

**Canva:** the connector is live, no brand kit set up yet. I generated and
saved two real design drafts into your connected Canva account:
- **Logo concept** — https://www.canva.com/d/pwHfleyy6IYwZZS (edit) /
  https://www.canva.com/d/qMoiMRh2j-H4eFS (view)
- **Social/OG banner concept** — https://www.canva.com/d/7Iyw5H0LWEtvhKD (edit) /
  https://www.canva.com/d/LI6LtpWX6EdiuLy (view)

Honest limitation: this session's sandbox has the same network egress
allowlist that blocks the Supabase hostname (see above) — it also blocks
`export-download.canva.com`, so I could generate and save these designs into
your Canva account, but I could not download the exported PNGs into this
repo myself. Open either link, tweak if you like, then export/download and
send the PNG back to me (or drop it in `public/brand/`) and I'll wire it into
the site header, favicon, and Open Graph metadata immediately.

## Next steps (per the roadmap)

Phase 2 (remaining public pages: Solutions, Industries, About) and Phase 3
(Start Your Project flow) are the natural next steps — the `project_requests`
table and reference-number generation are already built and waiting for that
form to write to them.

---

## Camus Learn — AI learning & career platform

A full product inside this repo (branch `feat/camus-learn`).

| Area | Route |
|---|---|
| Landing page | `/learn` (+ public SEO guides: `/learn/careers`, `/learn/subjects`, `/learn/exams`, `/learn/academy`) |
| Products catalog (Learn + StayOS/FoodOS/CareOS/JewelOS/PawnOS, live `cml_plans` pricing) | `/products`, `/products/[slug]` |
| Learner app (auth required) | `/app` — onboarding, dashboard, assistant, study tutor, exams, careers, roadmaps, resume, job match, interview coach, projects, AI academy, founder mode, Career Twin, billing, settings |
| Admin | `/admin/learn` — overview analytics, learners, subscriptions (confirm payment → activate), pricing & coupons, AI models & prompts, exams & question bank, feature flags & regions, audit log |

**Architecture.** `src/lib/learn/ai/*` is a provider-agnostic AI layer (Anthropic / OpenAI / Gemini via `fetch`, SSE streaming, zod-validated JSON with one repair retry, per-plan daily quotas, usage ledger). Business logic lives in server actions (`src/app/actions/learn/*`) and route handlers (`src/app/api/learn/*`), so a future native/Expo app can reuse the same backend. Database: `supabase/migrations/0007–0009` (all tables prefixed `learn_`, RLS on every table). Security checks: `supabase/tests/learn_rls.sql`.

**Honesty rules baked in:** no fabricated stats or customers; resume/profile AI never invents experience or credentials; no ATS scores or job guarantees; projects are only complete when the learner says so; minors get an age band (never DOB), hidden emails in admin, no founder mode/resume tools.

**Payments.** No card gateway yet: learners can start a one-time free trial or request an upgrade (stored as `pending`, grants nothing). Staff record the payment in `/admin/learn/subscriptions`, which activates the plan. Feature gating by plan is behind the `plan_gating` flag (off by default); AI daily limits are always enforced.

**To go live**
1. Add `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY` / `GOOGLE_AI_API_KEY`) as a server-side secret on the host (Firebase App Hosting: `firebase apphosting:secrets:set`).
2. In Supabase → Auth → URL configuration, set Site URL to `https://camus-learn.web.app` and add `https://camus-learn.web.app/**` to redirect URLs (sign-up confirmation links).
3. `npm run check` (lint + typecheck + unit tests + build).
