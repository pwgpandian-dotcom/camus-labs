-- =====================================================================
-- Camus Learn — AI education & career platform
-- All tables are prefixed `learn_` so they live safely beside the agency
-- tables (profiles, leads, …) and the Camus Core `cml_*` products.
--
-- Access model
--   * Learner-owned rows: user_id = auth.uid()  (RLS)
--   * Catalog/config rows (plans, prices, currencies, countries, exams,
--     feature flags, AI config): readable by everyone, writable by staff
--     via the existing public.is_staff() helper.
--   * Minors: we store an age *band*, never a date of birth.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Reference data
-- ---------------------------------------------------------------------
create table public.learn_currencies (
  code text primary key check (code ~ '^[A-Z]{3}$'),
  name text not null,
  symbol text not null,
  minor_units smallint not null default 2 check (minor_units between 0 and 3),
  is_active boolean not null default true
);

create table public.learn_countries (
  code text primary key check (code ~ '^[A-Z]{2}$'),
  name text not null,
  currency_code text not null references public.learn_currencies (code),
  default_locale text not null default 'en',
  is_active boolean not null default true
);

create table public.learn_feature_flags (
  key text primary key,
  enabled boolean not null default false,
  description text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Pricing (configurable from admin — the frontend never hardcodes prices)
-- ---------------------------------------------------------------------
create table public.learn_plans (
  id text primary key,
  name text not null,
  tagline text,
  features jsonb not null default '[]'::jsonb,
  tier smallint not null default 0,          -- 0 = free
  ai_messages_per_day integer not null default 20,
  trial_days smallint not null default 0,
  sort integer not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.learn_plan_prices (
  plan_id text not null references public.learn_plans (id) on delete cascade,
  currency_code text not null references public.learn_currencies (code),
  billing_interval text not null check (billing_interval in ('month', 'year')),
  amount_minor bigint not null check (amount_minor >= 0),
  primary key (plan_id, currency_code, billing_interval)
);

create table public.learn_coupons (
  code text primary key check (code = upper(code)),
  percent_off smallint not null check (percent_off between 1 and 100),
  valid_until timestamptz,
  max_redemptions integer,
  redeemed_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.learn_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id text not null references public.learn_plans (id),
  billing_interval text not null default 'month' check (billing_interval in ('month', 'year')),
  currency_code text not null references public.learn_currencies (code),
  status text not null default 'pending'
    check (status in ('pending', 'trialing', 'active', 'past_due', 'cancelled', 'expired')),
  coupon_code text references public.learn_coupons (code),
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index learn_subscriptions_user_idx on public.learn_subscriptions (user_id, created_at desc);

create table public.learn_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subscription_id uuid references public.learn_subscriptions (id) on delete set null,
  amount_minor bigint not null check (amount_minor >= 0),
  currency_code text not null references public.learn_currencies (code),
  provider text not null default 'manual',
  provider_ref text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz not null default now()
);
create index learn_payments_user_idx on public.learn_payments (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- Career Twin — one structured profile per learner
-- ---------------------------------------------------------------------
create table public.learn_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  stage text check (stage in (
    'school_primary', 'school_10', 'school_12', 'college', 'graduate',
    'job_seeker', 'career_switcher', 'professional', 'entrepreneur', 'lifelong_learner')),
  age_band text check (age_band in ('under_13', '13_17', '18_plus')),
  country_code text references public.learn_countries (code),
  current_education text check (char_length(current_education) <= 200),
  subjects text[] not null default '{}',
  interests text[] not null default '{}',
  skills text[] not null default '{}',
  career_goals text check (char_length(career_goals) <= 1000),
  target_role text check (char_length(target_role) <= 120),
  target_country text references public.learn_countries (code),
  learning_prefs jsonb not null default '{}'::jsonb,
  exam_goals text[] not null default '{}',
  generated_profile jsonb,
  locale text not null default 'en',
  timezone text,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.learn_education (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  institution text not null,
  qualification text not null,
  field text,
  start_year smallint,
  end_year smallint,
  grade text,
  created_at timestamptz not null default now()
);
create index learn_education_user_idx on public.learn_education (user_id);

create table public.learn_experience (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company text not null,
  title text not null,
  start_date date,
  end_date date,
  description text,
  created_at timestamptz not null default now()
);
create index learn_experience_user_idx on public.learn_experience (user_id);

create table public.learn_certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  issuer text,
  issued_on date,
  url text,
  created_at timestamptz not null default now()
);
create index learn_certifications_user_idx on public.learn_certifications (user_id);

-- ---------------------------------------------------------------------
-- AI: config, prompts, conversations, usage
-- ---------------------------------------------------------------------
create table public.learn_ai_config (
  feature text primary key,                 -- 'assistant', 'ats', 'interview', …
  provider text not null check (provider in ('anthropic', 'openai', 'google')),
  model text not null,
  temperature numeric(3, 2) not null default 0.4 check (temperature between 0 and 2),
  max_output_tokens integer not null default 1500 check (max_output_tokens between 64 and 16000),
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.learn_prompts (
  key text primary key,
  system_prompt text not null,
  version integer not null default 1,
  updated_at timestamptz not null default now()
);

create table public.learn_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  mode text not null default 'general'
    check (mode in ('general', 'study', 'career', 'resume', 'interview', 'project', 'founder')),
  title text not null default 'New conversation',
  is_saved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index learn_conversations_user_idx on public.learn_conversations (user_id, updated_at desc);

create table public.learn_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.learn_conversations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) <= 60000),
  feedback smallint check (feedback in (-1, 1)),
  model text,
  created_at timestamptz not null default now()
);
create index learn_messages_conversation_idx on public.learn_messages (conversation_id, created_at);

create table public.learn_ai_usage (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  feature text not null,
  provider text not null,
  model text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  created_at timestamptz not null default now()
);
create index learn_ai_usage_user_time_idx on public.learn_ai_usage (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- Resume, job analysis, interviews
-- ---------------------------------------------------------------------
create table public.learn_resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'My resume',
  template text not null default 'classic' check (template in ('classic', 'modern', 'compact')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index learn_resumes_user_idx on public.learn_resumes (user_id, updated_at desc);

create table public.learn_resume_versions (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.learn_resumes (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  data jsonb not null,
  note text,
  created_at timestamptz not null default now()
);
create index learn_resume_versions_resume_idx on public.learn_resume_versions (resume_id, created_at desc);

create table public.learn_job_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  company text,
  jd_text text not null check (char_length(jd_text) between 50 and 30000),
  report jsonb,
  created_at timestamptz not null default now()
);
create index learn_job_analyses_user_idx on public.learn_job_analyses (user_id, created_at desc);

create table public.learn_interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  mode text not null check (mode in ('hr', 'technical', 'behavioral', 'system_design', 'coding', 'case_study', 'role_specific')),
  target_role text,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  transcript jsonb not null default '[]'::jsonb,
  feedback jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index learn_interviews_user_idx on public.learn_interviews (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- Learning: roadmaps, quizzes, projects, exams
-- ---------------------------------------------------------------------
create table public.learn_skill_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  roadmap_slug text not null,
  step_key text not null,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'done')),
  updated_at timestamptz not null default now(),
  primary key (user_id, roadmap_slug, step_key)
);

create table public.learn_quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject text not null,
  topic text not null,
  exam_slug text,
  questions jsonb not null,
  answers jsonb not null default '[]'::jsonb,
  score integer,
  total integer not null check (total > 0),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index learn_quiz_attempts_user_idx on public.learn_quiz_attempts (user_id, created_at desc);
create index learn_quiz_attempts_topic_idx on public.learn_quiz_attempts (user_id, subject, topic);

create table public.learn_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  target_role text,
  spec jsonb not null default '{}'::jsonb,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed')),
  repo_url text,
  live_url text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index learn_projects_user_idx on public.learn_projects (user_id, updated_at desc);

create table public.learn_project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.learn_projects (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  milestone text,
  title text not null,
  is_done boolean not null default false,
  sort integer not null default 0
);
create index learn_project_tasks_project_idx on public.learn_project_tasks (project_id, sort);

create table public.learn_exams (
  slug text primary key,
  name text not null,
  country_code text references public.learn_countries (code),  -- null = international
  description text,
  subjects text[] not null default '{}',
  is_active boolean not null default true
);

create table public.learn_exam_questions (
  id uuid primary key default gen_random_uuid(),
  exam_slug text not null references public.learn_exams (slug) on delete cascade,
  subject text not null,
  topic text not null,
  prompt text not null,
  options jsonb not null,
  answer_index smallint not null,
  explanation text,
  difficulty smallint not null default 2 check (difficulty between 1 and 3),
  created_at timestamptz not null default now()
);
create index learn_exam_questions_idx on public.learn_exam_questions (exam_slug, subject, topic);

create table public.learn_founder_workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  stages jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index learn_founder_workspaces_user_idx on public.learn_founder_workspaces (user_id, updated_at desc);

-- ---------------------------------------------------------------------
-- Engagement: activity (streaks/analytics), notifications, push
-- ---------------------------------------------------------------------
create table public.learn_activity (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,     -- 'lesson', 'quiz', 'chat', 'resume', 'interview', 'project', 'onboarding', …
  created_at timestamptz not null default now()
);
create index learn_activity_user_time_idx on public.learn_activity (user_id, created_at desc);

create table public.learn_notification_prefs (
  user_id uuid primary key references auth.users (id) on delete cascade,
  study_reminders boolean not null default true,
  streaks boolean not null default true,
  interview_reminders boolean not null default true,
  project_milestones boolean not null default true,
  billing boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.learn_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index learn_notifications_user_idx on public.learn_notifications (user_id, created_at desc);

create table public.learn_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null unique,
  keys jsonb not null,
  created_at timestamptz not null default now()
);

create table public.learn_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------
create or replace function public.learn_touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke execute on function public.learn_touch_updated_at() from public, anon, authenticated;

do $$
declare t text;
begin
  foreach t in array array[
    'learn_profiles', 'learn_conversations', 'learn_resumes', 'learn_projects',
    'learn_subscriptions', 'learn_founder_workspaces', 'learn_plans', 'learn_ai_config',
    'learn_notification_prefs', 'learn_skill_progress', 'learn_feature_flags'
  ] loop
    execute format('create trigger %I before update on public.%I for each row execute function public.learn_touch_updated_at()', t || '_touch', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  -- Learner-owned tables: full CRUD on own rows, staff can read.
  foreach t in array array[
    'learn_profiles', 'learn_education', 'learn_experience', 'learn_certifications',
    'learn_conversations', 'learn_messages', 'learn_resumes', 'learn_resume_versions',
    'learn_job_analyses', 'learn_interviews', 'learn_skill_progress', 'learn_quiz_attempts',
    'learn_projects', 'learn_project_tasks', 'learn_founder_workspaces', 'learn_activity',
    'learn_notification_prefs', 'learn_notifications', 'learn_push_subscriptions'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %I on public.%I for select using (user_id = (select auth.uid()) or public.is_staff())', t || '_select', t);
    execute format('create policy %I on public.%I for insert with check (user_id = (select auth.uid()))', t || '_insert', t);
    execute format('create policy %I on public.%I for update using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))', t || '_update', t);
    execute format('create policy %I on public.%I for delete using (user_id = (select auth.uid()))', t || '_delete', t);
  end loop;

  -- Public catalog/config: anyone reads, staff writes.
  foreach t in array array[
    'learn_currencies', 'learn_countries', 'learn_feature_flags', 'learn_plans',
    'learn_plan_prices', 'learn_exams', 'learn_exam_questions'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %I on public.%I for select using (true)', t || '_public_read', t);
    execute format('create policy %I on public.%I for all using (public.is_staff()) with check (public.is_staff())', t || '_staff_write', t);
  end loop;

  -- Staff-only config/logs.
  foreach t in array array['learn_ai_config', 'learn_prompts', 'learn_coupons', 'learn_audit_log'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %I on public.%I for all using (public.is_staff()) with check (public.is_staff())', t || '_staff_all', t);
  end loop;
end $$;

-- Messages must belong to a conversation the caller owns.
drop policy learn_messages_insert on public.learn_messages;
create policy learn_messages_insert on public.learn_messages for insert with check (
  user_id = (select auth.uid())
  and exists (select 1 from public.learn_conversations c where c.id = conversation_id and c.user_id = (select auth.uid()))
);

-- Project tasks must belong to a project the caller owns.
drop policy learn_project_tasks_insert on public.learn_project_tasks;
create policy learn_project_tasks_insert on public.learn_project_tasks for insert with check (
  user_id = (select auth.uid())
  and exists (select 1 from public.learn_projects p where p.id = project_id and p.user_id = (select auth.uid()))
);

-- Resume versions must belong to a resume the caller owns.
drop policy learn_resume_versions_insert on public.learn_resume_versions;
create policy learn_resume_versions_insert on public.learn_resume_versions for insert with check (
  user_id = (select auth.uid())
  and exists (select 1 from public.learn_resumes r where r.id = resume_id and r.user_id = (select auth.uid()))
);

-- Subscriptions/payments: learners READ their own; only staff (or a trusted
-- server webhook using the service role) can create or change them, so a
-- learner can never grant themselves a paid plan.
alter table public.learn_subscriptions enable row level security;
alter table public.learn_payments enable row level security;
create policy learn_subscriptions_select on public.learn_subscriptions for select using (user_id = (select auth.uid()) or public.is_staff());
create policy learn_subscriptions_staff on public.learn_subscriptions for all using (public.is_staff()) with check (public.is_staff());
create policy learn_payments_select on public.learn_payments for select using (user_id = (select auth.uid()) or public.is_staff());
create policy learn_payments_staff on public.learn_payments for all using (public.is_staff()) with check (public.is_staff());

-- AI usage: learners read own usage; inserts happen from the server as the
-- signed-in user (own rows only). No update/delete — it is a ledger.
alter table public.learn_ai_usage enable row level security;
create policy learn_ai_usage_select on public.learn_ai_usage for select using (user_id = (select auth.uid()) or public.is_staff());
create policy learn_ai_usage_insert on public.learn_ai_usage for insert with check (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------
-- Rate-limit helper: AI calls by the caller in the last 24h.
-- ---------------------------------------------------------------------
create or replace function public.learn_ai_calls_today()
returns integer language sql stable security invoker set search_path = public as $$
  select count(*)::int from public.learn_ai_usage
  where user_id = (select auth.uid()) and created_at > now() - interval '24 hours';
$$;

-- ---------------------------------------------------------------------
-- Seed reference data (configuration, not fake content)
-- ---------------------------------------------------------------------
insert into public.learn_currencies (code, name, symbol, minor_units) values
  ('INR', 'Indian Rupee', '₹', 2), ('USD', 'US Dollar', '$', 2), ('EUR', 'Euro', '€', 2),
  ('GBP', 'British Pound', '£', 2), ('CAD', 'Canadian Dollar', 'CA$', 2), ('AUD', 'Australian Dollar', 'A$', 2),
  ('SGD', 'Singapore Dollar', 'S$', 2), ('AED', 'UAE Dirham', 'AED', 2), ('JPY', 'Japanese Yen', '¥', 0),
  ('SEK', 'Swedish Krona', 'kr', 2), ('CHF', 'Swiss Franc', 'CHF', 2);

insert into public.learn_countries (code, name, currency_code, default_locale) values
  ('IN', 'India', 'INR', 'en'), ('US', 'United States', 'USD', 'en'), ('GB', 'United Kingdom', 'GBP', 'en'),
  ('CA', 'Canada', 'CAD', 'en'), ('AU', 'Australia', 'AUD', 'en'), ('SG', 'Singapore', 'SGD', 'en'),
  ('AE', 'United Arab Emirates', 'AED', 'en'), ('JP', 'Japan', 'JPY', 'ja'), ('SE', 'Sweden', 'SEK', 'en'),
  ('CH', 'Switzerland', 'CHF', 'de'), ('DE', 'Germany', 'EUR', 'de'), ('FR', 'France', 'EUR', 'fr'),
  ('ES', 'Spain', 'EUR', 'es'), ('IE', 'Ireland', 'EUR', 'en'), ('NL', 'Netherlands', 'EUR', 'en');

insert into public.learn_plans (id, name, tagline, features, tier, ai_messages_per_day, trial_days, sort) values
  ('free', 'Free', 'Start learning with AI',
    '["AI assistant (limited daily messages)","Career explorer","Skill roadmaps","1 resume"]', 0, 15, 0, 1),
  ('student', 'Student', 'For school & college learners',
    '["Everything in Free","AI study tutor & quizzes","Exam preparation","Weak-topic detection","Study plans"]', 1, 80, 7, 2),
  ('career', 'Career', 'For graduates & job seekers',
    '["Everything in Student","Unlimited resumes & versions","Job-description analyzer","AI interview practice","Project builder"]', 2, 150, 7, 3),
  ('pro', 'Pro', 'For professionals & founders',
    '["Everything in Career","Founder mode workspaces","Priority AI models","Advanced interview modes"]', 3, 400, 7, 4);

-- INR per the launch price list. Other currencies are admin-configurable;
-- USD is seeded as the international fallback.
insert into public.learn_plan_prices (plan_id, currency_code, billing_interval, amount_minor) values
  ('free', 'INR', 'month', 0), ('free', 'USD', 'month', 0),
  ('student', 'INR', 'month', 24900), ('student', 'INR', 'year', 249000),
  ('career', 'INR', 'month', 49900), ('career', 'INR', 'year', 499000),
  ('pro', 'INR', 'month', 99900), ('pro', 'INR', 'year', 999000),
  ('student', 'USD', 'month', 499), ('student', 'USD', 'year', 4990),
  ('career', 'USD', 'month', 999), ('career', 'USD', 'year', 9990),
  ('pro', 'USD', 'month', 1999), ('pro', 'USD', 'year', 19990);

insert into public.learn_ai_config (feature, provider, model, temperature, max_output_tokens) values
  ('assistant', 'anthropic', 'claude-sonnet-5', 0.4, 2000),
  ('structured', 'anthropic', 'claude-sonnet-5', 0.2, 3000),
  ('interview', 'anthropic', 'claude-sonnet-5', 0.5, 1200);

insert into public.learn_feature_flags (key, enabled, description) values
  ('founder_mode', true, 'Founder Mode workspaces'),
  ('ai_academy', true, 'AI Productivity Academy'),
  ('exam_prep', true, 'Exam preparation module'),
  ('push_notifications', false, 'Web push (requires VAPID keys)');

insert into public.learn_exams (slug, name, country_code, description, subjects) values
  ('neet', 'NEET-UG', 'IN', 'Undergraduate medical entrance examination in India.', '{Physics,Chemistry,Biology}'),
  ('jee-main', 'JEE Main', 'IN', 'Engineering entrance examination in India.', '{Physics,Chemistry,Mathematics}'),
  ('cat', 'CAT', 'IN', 'Common Admission Test for management programmes in India.', '{"Quantitative Ability","Verbal Ability","Data Interpretation & Logical Reasoning"}'),
  ('gate', 'GATE', 'IN', 'Graduate Aptitude Test in Engineering.', '{"Engineering Mathematics","General Aptitude"}'),
  ('upsc-cse', 'UPSC Civil Services', 'IN', 'Civil services examination in India.', '{History,Geography,Polity,Economics,"Current Affairs"}'),
  ('sat', 'SAT', 'US', 'College admission test used mainly in the United States.', '{Mathematics,"Reading and Writing"}'),
  ('gre', 'GRE General', null, 'Graduate admissions test accepted internationally.', '{"Quantitative Reasoning","Verbal Reasoning","Analytical Writing"}'),
  ('gmat', 'GMAT Focus', null, 'Business school admissions test.', '{"Quantitative Reasoning","Verbal Reasoning","Data Insights"}'),
  ('ielts', 'IELTS Academic', null, 'English language proficiency test.', '{Listening,Reading,Writing,Speaking}'),
  ('toefl', 'TOEFL iBT', null, 'English language proficiency test.', '{Reading,Listening,Speaking,Writing}');
