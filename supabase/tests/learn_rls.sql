-- Camus Learn RLS / RPC security checks.
-- Runs entirely inside one DO block that always ends by raising, so every
-- change (test users, rows) is rolled back. Expected output (last run):
-- RESULT: 1 own-insert ok; 2 self-grant blocked; 3 pending request+coupon=1; 4 self-activate rows=0;
-- 5 second trial blocked; 6 coupons visible to learner=0; 7 A calls today=1; 8 B sees A profile=0;
-- 9 B updates A rows=0; 10 B blocked from A convo; 11 B sees A messages=0; 12 B calls today=0;
-- 13 anon plans=4; 14 anon profiles=0; 15 anon coupon rpc blocked;
do $$
declare
  a uuid := gen_random_uuid();
  b uuid := gen_random_uuid();
  conv uuid;
  n int;
  out text := '';
begin
  insert into auth.users (id, email, aud, role, instance_id) values (a, 'rls-a-' || a || '@test.invalid', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000');
  insert into auth.users (id, email, aud, role, instance_id) values (b, 'rls-b-' || b || '@test.invalid', 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000');
  insert into learn_coupons (code, percent_off) values ('RLSTEST50', 50);

  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  insert into learn_profiles (user_id, display_name, stage, age_band, country_code) values (a, 'A', 'college', '18_plus', 'IN');
  insert into learn_conversations (user_id, title) values (a, 'A chat') returning id into conv;
  insert into learn_messages (conversation_id, user_id, role, content) values (conv, a, 'user', 'hi');
  out := out || '1 own-insert ok; ';
  begin
    insert into learn_subscriptions (user_id, plan_id, currency_code, status) values (a, 'pro', 'INR', 'active');
    out := out || '2 FAIL self-grant allowed; ';
  exception when others then out := out || '2 self-grant blocked; ';
  end;
  perform learn_request_plan('career', 'month', 'INR', 'rlstest50');
  select count(*) into n from learn_subscriptions where user_id = a and status = 'pending' and coupon_code = 'RLSTEST50';
  out := out || '3 pending request+coupon=' || n || '; ';
  update learn_subscriptions set status = 'active' where user_id = a;
  get diagnostics n = row_count;
  out := out || '4 self-activate rows=' || n || '; ';
  perform learn_start_trial('student', 'INR');
  begin
    perform learn_start_trial('career', 'INR');
    out := out || '5 FAIL second trial; ';
  exception when others then out := out || '5 second trial blocked; ';
  end;
  select count(*) into n from learn_coupons;
  out := out || '6 coupons visible to learner=' || n || '; ';
  insert into learn_ai_usage (user_id, feature, provider, model) values (a, 'chat', 'anthropic', 'x');
  out := out || '7 A calls today=' || learn_ai_calls_today() || '; ';

  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  select count(*) into n from learn_profiles where user_id = a;
  out := out || '8 B sees A profile=' || n || '; ';
  update learn_profiles set display_name = 'hacked' where user_id = a;
  get diagnostics n = row_count;
  out := out || '9 B updates A rows=' || n || '; ';
  begin
    insert into learn_messages (conversation_id, user_id, role, content) values (conv, b, 'user', 'intrude');
    out := out || '10 FAIL B wrote into A convo; ';
  exception when others then out := out || '10 B blocked from A convo; ';
  end;
  select count(*) into n from learn_messages where conversation_id = conv;
  out := out || '11 B sees A messages=' || n || '; ';
  out := out || '12 B calls today=' || learn_ai_calls_today() || '; ';

  perform set_config('role', 'anon', true);
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  select count(*) into n from learn_plans;
  out := out || '13 anon plans=' || n || '; ';
  select count(*) into n from learn_profiles;
  out := out || '14 anon profiles=' || n || '; ';
  begin
    perform learn_check_coupon('RLSTEST50');
    out := out || '15 FAIL anon coupon rpc; ';
  exception when others then out := out || '15 anon coupon rpc blocked; ';
  end;
  raise exception 'RESULT: %', out;
end $$;
