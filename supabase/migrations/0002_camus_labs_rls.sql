-- CAMUS Labs — Row Level Security
-- Three trust levels: anon (public site), client (portal), staff (operator/sales/admin)

-- ---------------------------------------------------------------
-- Helper functions (security definer to avoid recursive RLS lookups)
-- ---------------------------------------------------------------
create function public.is_staff()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'operator', 'sales')
  );
$$;

create function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create function public.current_client_id()
returns uuid
language sql
security definer set search_path = public
stable
as $$
  select id from public.clients where profile_id = auth.uid() limit 1;
$$;

-- ---------------------------------------------------------------
-- Enable RLS everywhere
-- ---------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.project_requests enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.milestones enable row level security;
alter table public.tasks enable row level security;
alter table public.documents enable row level security;
alter table public.payments enable row level security;
alter table public.messages enable row level security;
alter table public.consultations enable row level security;
alter table public.case_studies enable row level security;
alter table public.site_content enable row level security;

-- ---------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------
create policy "profiles_select_own_or_staff" on public.profiles
  for select using (id = auth.uid() or public.is_staff());

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "profiles_staff_manage" on public.profiles
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------
-- leads — anyone can submit a general inquiry, only staff can read/manage
-- ---------------------------------------------------------------
create policy "leads_public_insert" on public.leads
  for insert with check (true);

create policy "leads_staff_select" on public.leads
  for select using (public.is_staff());

create policy "leads_staff_update" on public.leads
  for update using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------
-- project_requests — anyone can submit; only staff can read/manage
-- ---------------------------------------------------------------
create policy "project_requests_public_insert" on public.project_requests
  for insert with check (true);

create policy "project_requests_staff_select" on public.project_requests
  for select using (public.is_staff());

create policy "project_requests_staff_update" on public.project_requests
  for update using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------
-- clients — a client can see their own record; staff see all
-- ---------------------------------------------------------------
create policy "clients_select_own_or_staff" on public.clients
  for select using (profile_id = auth.uid() or public.is_staff());

create policy "clients_staff_manage" on public.clients
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------
-- projects — client sees only their own projects; staff see all
-- ---------------------------------------------------------------
create policy "projects_select_own_or_staff" on public.projects
  for select using (client_id = public.current_client_id() or public.is_staff());

create policy "projects_staff_manage" on public.projects
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------
-- milestones / tasks — scoped through project ownership
-- ---------------------------------------------------------------
create policy "milestones_select_own_or_staff" on public.milestones
  for select using (
    public.is_staff()
    or exists (select 1 from public.projects p where p.id = project_id and p.client_id = public.current_client_id())
  );

create policy "milestones_staff_manage" on public.milestones
  for all using (public.is_staff()) with check (public.is_staff());

create policy "tasks_select_own_or_staff" on public.tasks
  for select using (
    public.is_staff()
    or exists (select 1 from public.projects p where p.id = project_id and p.client_id = public.current_client_id())
  );

create policy "tasks_staff_manage" on public.tasks
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------
-- documents
-- ---------------------------------------------------------------
create policy "documents_select_own_or_staff" on public.documents
  for select using (client_id = public.current_client_id() or public.is_staff());

create policy "documents_staff_manage" on public.documents
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------
create policy "payments_select_own_or_staff" on public.payments
  for select using (client_id = public.current_client_id() or public.is_staff());

create policy "payments_staff_manage" on public.payments
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------
-- messages — participants (sender or recipient) or staff
-- ---------------------------------------------------------------
create policy "messages_select_participant_or_staff" on public.messages
  for select using (sender_id = auth.uid() or recipient_id = auth.uid() or public.is_staff());

create policy "messages_insert_authenticated" on public.messages
  for insert with check (sender_id = auth.uid());

create policy "messages_staff_manage" on public.messages
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------
-- consultations
-- ---------------------------------------------------------------
create policy "consultations_select_own_or_staff" on public.consultations
  for select using (client_id = public.current_client_id() or public.is_staff());

create policy "consultations_client_insert" on public.consultations
  for insert with check (client_id = public.current_client_id());

create policy "consultations_staff_manage" on public.consultations
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------
-- case_studies — public can read published ones; staff manage all
-- ---------------------------------------------------------------
create policy "case_studies_public_select_published" on public.case_studies
  for select using (is_published = true or public.is_staff());

create policy "case_studies_staff_manage" on public.case_studies
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------
-- site_content — public can read; staff manage
-- ---------------------------------------------------------------
create policy "site_content_public_select" on public.site_content
  for select using (true);

create policy "site_content_staff_manage" on public.site_content
  for all using (public.is_staff()) with check (public.is_staff());
