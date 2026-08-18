-- Allow anonymous leads to book a consultation without an existing client
-- record, mirroring the leads_public_insert / project_requests_public_insert
-- pattern from migration 0002. A row must be tied to a lead (not a client)
-- to use this path — client_id stays null until staff convert the lead.
create policy "consultations_public_insert" on public.consultations
  for insert
  with check (client_id is null and lead_id is not null);
