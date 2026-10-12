-- Keep the admin check out of the public API (/rest/v1/rpc): move it to a schema PostgREST does
-- not expose. Policies still call it, so anon and authenticated keep EXECUTE on it.

create schema if not exists private;
grant usage on schema private to anon, authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

-- Point every policy at the private function.
alter policy "admins update settings" on public.site_settings
  using ((select private.is_admin())) with check ((select private.is_admin()));

do $$
declare t text;
begin
  foreach t in array array['services', 'packages', 'areas', 'gallery_items', 'reviews', 'faqs'] loop
    execute format('alter policy "public reads visible %1$s" on public.%1$I using (is_visible or (select private.is_admin()))', t);
    execute format('alter policy "admins insert %1$s" on public.%1$I with check ((select private.is_admin()))', t);
    execute format('alter policy "admins update %1$s" on public.%1$I using ((select private.is_admin())) with check ((select private.is_admin()))', t);
    execute format('alter policy "admins delete %1$s" on public.%1$I using ((select private.is_admin()))', t);
  end loop;
end $$;

alter policy "admins upload media" on storage.objects
  with check (bucket_id = 'media' and (select private.is_admin()));
alter policy "admins update media" on storage.objects
  using (bucket_id = 'media' and (select private.is_admin()));
alter policy "admins delete media" on storage.objects
  using (bucket_id = 'media' and (select private.is_admin()));

drop function public.is_admin();
