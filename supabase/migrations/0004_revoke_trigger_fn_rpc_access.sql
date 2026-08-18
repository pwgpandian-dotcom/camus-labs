-- prevent_role_self_escalation is a trigger function only — never meant to
-- be called directly via PostgREST RPC, unlike is_staff/is_admin/
-- current_client_id which RLS policies genuinely need callable by
-- anon/authenticated.
revoke execute on function public.prevent_role_self_escalation() from anon, authenticated;
