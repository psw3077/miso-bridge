-- Keep card analytics restricted to explicitly assigned administrators.
-- MFA is challenged only after the administrator has enrolled a verified factor.
drop policy if exists "card events admin read" on public.miso_card_events;
create policy "card events admin read" on public.miso_card_events for select to authenticated
using (
  coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false) = false
  and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

drop policy if exists "card share links admin read" on public.miso_card_share_links;
create policy "card share links admin read" on public.miso_card_share_links for select to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "card share links admin create" on public.miso_card_share_links;
create policy "card share links admin create" on public.miso_card_share_links for insert to authenticated
with check (
  (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and created_by = (select auth.uid())
);

drop policy if exists "card share links admin revoke" on public.miso_card_share_links;
create policy "card share links admin revoke" on public.miso_card_share_links for update to authenticated
using (
  (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and created_by = (select auth.uid())
)
with check (
  (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  and created_by = (select auth.uid())
);
