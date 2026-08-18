-- CAMUS Labs — core schema
-- Roles: client (portal), operator/sales/admin (internal), anon/public (marketing site + lead capture)

-- ---------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------
create type public.user_role as enum ('client', 'operator', 'sales', 'admin');
create type public.lead_status as enum ('new', 'contacted', 'qualified', 'archived');
create type public.request_status as enum ('received', 'reviewing', 'proposal_sent', 'accepted', 'declined');
create type public.project_status as enum ('discovery', 'design', 'development', 'testing', 'deployed', 'launched', 'on_hold');
create type public.milestone_status as enum ('pending', 'in_progress', 'completed', 'blocked');
create type public.task_status as enum ('todo', 'in_progress', 'review', 'done');
create type public.payment_status as enum ('pending', 'paid', 'overdue', 'refunded');
create type public.consultation_type as enum ('discovery', 'technical', 'proposal', 'support');
create type public.consultation_status as enum ('requested', 'confirmed', 'completed', 'cancelled');
create type public.document_category as enum ('contract', 'requirement', 'design', 'report', 'other');

-- ---------------------------------------------------------------
-- profiles — one row per authenticated user (client or internal staff)
-- ---------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  role public.user_role not null default 'client',
  company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------
-- leads — general inquiry / contact form submissions
-- ---------------------------------------------------------------
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  message text,
  source text default 'website',
  status public.lead_status not null default 'new',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- project_requests — "Start Your Project" onboarding submissions
-- ---------------------------------------------------------------
create sequence public.project_request_seq start 1;

create table public.project_requests (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique
    default ('CML-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.project_request_seq')::text, 4, '0')),
  lead_id uuid references public.leads (id) on delete set null,
  build_type text not null,
  idea_description text not null,
  industry text,
  timeline text,
  budget_range text,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  wants_consultation boolean not null default false,
  status public.request_status not null default 'received',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- clients — a company/individual with portal access
-- ---------------------------------------------------------------
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  company_name text not null,
  billing_address text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null,
  slug text not null unique,
  status public.project_status not null default 'discovery',
  summary text,
  current_milestone_id uuid,
  next_milestone_id uuid,
  start_date date,
  target_launch_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- milestones
-- ---------------------------------------------------------------
create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  description text,
  status public.milestone_status not null default 'pending',
  due_date date,
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.projects
  add constraint projects_current_milestone_fk foreign key (current_milestone_id) references public.milestones (id) on delete set null,
  add constraint projects_next_milestone_fk foreign key (next_milestone_id) references public.milestones (id) on delete set null;

-- ---------------------------------------------------------------
-- tasks
-- ---------------------------------------------------------------
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  milestone_id uuid references public.milestones (id) on delete set null,
  title text not null,
  status public.task_status not null default 'todo',
  assignee_id uuid references public.profiles (id) on delete set null,
  due_date date,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- documents
-- ---------------------------------------------------------------
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  client_id uuid references public.clients (id) on delete cascade,
  title text not null,
  file_url text not null,
  category public.document_category not null default 'other',
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  invoice_number text not null unique,
  amount numeric(12, 2) not null,
  currency text not null default 'INR',
  status public.payment_status not null default 'pending',
  due_date date,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid references public.profiles (id) on delete set null,
  thread_id uuid not null default gen_random_uuid(),
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- consultations
-- ---------------------------------------------------------------
create table public.consultations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete cascade,
  type public.consultation_type not null default 'discovery',
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 30,
  status public.consultation_status not null default 'requested',
  notes text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- case_studies — public "Projects" page content, admin-managed
-- ---------------------------------------------------------------
create table public.case_studies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  project_name text not null,
  industry text,
  problem text,
  solution text,
  features jsonb not null default '[]',
  technology jsonb not null default '[]',
  screenshots jsonb not null default '[]',
  results text,
  live_demo_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- site_content — small CMS for homepage/section copy
-- ---------------------------------------------------------------
create table public.site_content (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  content jsonb not null default '{}',
  updated_by uuid references public.profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------
create index idx_projects_client_id on public.projects (client_id);
create index idx_milestones_project_id on public.milestones (project_id);
create index idx_tasks_project_id on public.tasks (project_id);
create index idx_documents_project_id on public.documents (project_id);
create index idx_payments_project_id on public.payments (project_id);
create index idx_messages_project_id on public.messages (project_id);
create index idx_messages_thread_id on public.messages (thread_id);
create index idx_consultations_client_id on public.consultations (client_id);
create index idx_leads_status on public.leads (status);
create index idx_project_requests_status on public.project_requests (status);
create index idx_case_studies_published on public.case_studies (is_published);
