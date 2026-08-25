-- Require administrator role and MFA assurance level 2 for all card analytics administration.
drop policy if exists "card events admin read" on public.miso_card_events;
create policy "card events admin read" on public.miso_card_events for select to authenticated
using (
  coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.jwt() ->> 'aal') = 'aal2'
);

drop policy if exists "card share links admin read" on public.miso_card_share_links;
create policy "card share links admin read" on public.miso_card_share_links for select to authenticated
using (
  (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.jwt() ->> 'aal') = 'aal2'
);

drop policy if exists "card share links admin create" on public.miso_card_share_links;
create policy "card share links admin create" on public.miso_card_share_links for insert to authenticated
with check (
  (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.jwt() ->> 'aal') = 'aal2'
  and created_by = (select auth.uid())
);

drop policy if exists "card share links admin revoke" on public.miso_card_share_links;
create policy "card share links admin revoke" on public.miso_card_share_links for update to authenticated
using (
  (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.jwt() ->> 'aal') = 'aal2'
  and created_by = (select auth.uid())
)
with check (
  (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and (select auth.jwt() ->> 'aal') = 'aal2'
  and created_by = (select auth.uid())
);

-- Trigger execution does not require clients to execute the trigger function directly.
revoke all on function private.secure_card_event() from public, anon, authenticated;

create or replace function private.purge_expired_card_events()
returns bigint
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $function$
declare deleted_count bigint;
begin
  delete from public.miso_card_events where expires_at < now();
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$function$;
revoke all on function private.purge_expired_card_events() from public, anon, authenticated;

comment on function private.purge_expired_card_events() is
'Deletes analytics rows after their 13-month retention period. Invoke only from a trusted scheduled database job.';
