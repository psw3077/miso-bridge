-- Restrict MISO CARD analytics and settings administration to the designated admin.
-- Public event collection remains unchanged; this migration does not insert or update data.

drop policy if exists "authenticated can read card events" on public.miso_card_events;
drop policy if exists "miso admin can read card events" on public.miso_card_events;

create policy "miso admin can read card events"
on public.miso_card_events
for select
to authenticated
using (((select auth.jwt()) ->> 'email') = 'psw3077@gmail.com');

drop policy if exists "authenticated can update card settings" on public.miso_card_settings;
drop policy if exists "miso admin can update card settings" on public.miso_card_settings;

create policy "miso admin can update card settings"
on public.miso_card_settings
for update
to authenticated
using (((select auth.jwt()) ->> 'email') = 'psw3077@gmail.com')
with check (((select auth.jwt()) ->> 'email') = 'psw3077@gmail.com');
