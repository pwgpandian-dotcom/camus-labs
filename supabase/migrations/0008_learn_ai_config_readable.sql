-- Model/provider choice and prompt text are not secrets; signed-in learners'
-- server requests need to read them to route AI calls. Writes stay staff-only.
create policy learn_ai_config_auth_read on public.learn_ai_config for select to authenticated using (true);
create policy learn_prompts_auth_read on public.learn_prompts for select to authenticated using (true);

-- Coupons are NOT listable by learners (that would leak every code).
-- A learner can only check one code they already know.
create or replace function public.learn_check_coupon(p_code text)
returns smallint language sql stable security definer set search_path = public as $$
  select percent_off from public.learn_coupons
  where code = upper(p_code) and is_active
    and (valid_until is null or valid_until > now())
    and (max_redemptions is null or redeemed_count < max_redemptions);
$$;
revoke execute on function public.learn_check_coupon(text) from public, anon;
grant execute on function public.learn_check_coupon(text) to authenticated;
