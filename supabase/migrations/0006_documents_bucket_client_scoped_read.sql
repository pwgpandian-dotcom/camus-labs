-- Client-scoped read access to the documents bucket, alongside the existing
-- staff-all policy. Uploads are stored under `${client_id}/${filename}`
-- (src/app/actions/admin.ts uploadDocument), so the first path segment is
-- the owning client's id. A signed-in client may only read objects filed
-- under their own client_id folder.
create policy "documents_bucket_client_select" on storage.objects
  for select
  using (
    bucket_id = 'documents'
    and public.current_client_id() is not null
    and (storage.foldername(name))[1] = public.current_client_id()::text
  );
