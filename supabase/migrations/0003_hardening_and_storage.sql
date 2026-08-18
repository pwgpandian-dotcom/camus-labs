-- CAMUS Labs — hardening + storage
-- 1) Close a real gap: the "profiles_update_own" policy lets a signed-in
--    client update their own profile row, and RLS has no column-level
--    granularity — without this trigger, a client could set their own
--    role to 'admin' via a normal update call. Only an admin may change
--    the `role` column now, regardless of which policy allowed the write.
-- 2) A private Storage bucket for admin-managed project documents.

create function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only an admin can change a user role';
  end if;
  return new;
end;
$$;

create trigger enforce_role_change_by_admin
  before update on public.profiles
  for each row execute procedure public.prevent_role_self_escalation();

-- ---------------------------------------------------------------
-- Storage: private "documents" bucket, staff-managed for now.
-- (Client-scoped read access is deferred to Phase 5, when the real
-- client portal is built and can request signed URLs per project.)
-- ---------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "documents_bucket_staff_all" on storage.objects
  for all using (bucket_id = 'documents' and public.is_staff())
  with check (bucket_id = 'documents' and public.is_staff());
