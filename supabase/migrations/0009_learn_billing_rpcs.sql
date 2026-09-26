-- One free trial per learner, enforced in the database.
create or replace function public.learn_start_trial(p_plan text, p_currency text)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_days smallint;
  v_id uuid;
begin
  if v_uid is null then raise exception 'not signed in'; end if;
  select trial_days into v_days from learn_plans where id = p_plan and is_active and tier > 0;
  if v_days is null or v_days = 0 then raise exception 'plan has no trial'; end if;
  if exists (select 1 from learn_subscriptions where user_id = v_uid and trial_ends_at is not null) then
    raise exception 'trial already used';
  end if;
  if not exists (select 1 from learn_currencies where code = p_currency) then p_currency := 'USD'; end if;
  insert into learn_subscriptions (user_id, plan_id, currency_code, status, trial_ends_at, current_period_end)
  values (v_uid, p_plan, p_currency, 'trialing', now() + make_interval(days => v_days), now() + make_interval(days => v_days))
  returning id into v_id;
  return v_id;
end;
$$;

-- A learner can request a paid plan; it stays 'pending' (grants nothing)
-- until staff confirm payment, or a payment-provider webhook activates it.
create or replace function public.learn_request_plan(p_plan text, p_interval text, p_currency text, p_coupon text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid;
  v_coupon text := null;
begin
  if v_uid is null then raise exception 'not signed in'; end if;
  if p_interval not in ('month', 'year') then raise exception 'bad interval'; end if;
  if not exists (select 1 from learn_plans where id = p_plan and is_active and tier > 0) then raise exception 'bad plan'; end if;
  if not exists (select 1 from learn_currencies where code = p_currency) then p_currency := 'USD'; end if;
  if p_coupon is not null and length(p_coupon) > 0 and learn_check_coupon(p_coupon) is not null then v_coupon := upper(p_coupon); end if;
  delete from learn_subscriptions where user_id = v_uid and status = 'pending';
  insert into learn_subscriptions (user_id, plan_id, billing_interval, currency_code, status, coupon_code)
  values (v_uid, p_plan, p_interval, p_currency, 'pending', v_coupon)
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.learn_cancel_subscription(p_id uuid)
returns void language sql security definer set search_path = public as $$
  update learn_subscriptions set status = 'cancelled'
  where id = p_id and user_id = auth.uid() and status in ('pending', 'trialing', 'active');
$$;

revoke execute on function public.learn_start_trial(text, text) from public, anon;
revoke execute on function public.learn_request_plan(text, text, text, text) from public, anon;
revoke execute on function public.learn_cancel_subscription(uuid) from public, anon;
grant execute on function public.learn_start_trial(text, text) to authenticated;
grant execute on function public.learn_request_plan(text, text, text, text) to authenticated;
grant execute on function public.learn_cancel_subscription(uuid) to authenticated;

insert into public.learn_feature_flags (key, enabled, description) values ('plan_gating', false, 'Restrict premium features to paid plans. Turn on once a payment provider is live.') on conflict do nothing;
