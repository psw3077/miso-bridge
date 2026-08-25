-- Shared analytics for the four public digital cards.
-- Extends the legacy event_type/staff_name schema without rewriting existing rows.
create extension if not exists pgcrypto;

alter table public.miso_card_events
  add column if not exists event_name text,
  add column if not exists visitor_id uuid,
  add column if not exists session_id uuid,
  add column if not exists entry_source text,
  add column if not exists device_type text,
  add column if not exists is_first_visit boolean,
  add column if not exists share_token_hash text,
  add column if not exists source_staff text,
  add column if not exists source_card text,
  add column if not exists account_id uuid,
  add column if not exists consent_granted boolean not null default false,
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists expires_at timestamptz;

create table if not exists public.miso_card_share_links (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  card_id text not null check (card_id in ('hyundai_park_taewan','plb_park_sangmin','dream_realestate','miso_park_sangwook')),
  source_staff text not null check (length(source_staff) between 1 and 80),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  check (expires_at > created_at and expires_at <= created_at + interval '90 days')
);

alter table public.miso_card_events enable row level security;
alter table public.miso_card_share_links enable row level security;

revoke all on table public.miso_card_events from anon, authenticated;
grant insert on table public.miso_card_events to anon, authenticated;
grant select on table public.miso_card_events to authenticated;
revoke all on table public.miso_card_share_links from anon, authenticated;
grant select, insert, update on table public.miso_card_share_links to authenticated;

drop policy if exists "public can insert card events" on public.miso_card_events;
drop policy if exists "card events anonymous insert" on public.miso_card_events;
create policy "card events validated insert" on public.miso_card_events for insert to anon, authenticated
with check (
  card_id in ('hyundai_park_taewan','plb_park_sangmin','dream_realestate','miso_park_sangwook')
  and event_name in ('card_view','phone_click','sms_click','kakao_click','consult_click','quote_click','website_click','blog_click','contact_save','share_click','qr_entry','verified_view')
  and event_type = event_name
  and visitor_id is not null and session_id is not null
  and entry_source in ('kakao','profile','blog','qr','sms','direct','website','other')
  and device_type in ('mobile','tablet','desktop')
  and octet_length(metadata::text) <= 4096
  and (share_token_hash is null or share_token_hash ~ '^[0-9a-f]{64}$')
  and (account_id is null or (consent_granted and account_id = (select auth.uid())))
);

drop policy if exists "miso admin can read card events" on public.miso_card_events;
drop policy if exists "card events admin read" on public.miso_card_events;
create policy "card events admin read" on public.miso_card_events for select to authenticated
using (
  coalesce((select auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  and (
    (select auth.jwt() ->> 'email') = 'psw3077@gmail.com'
    or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
);

drop policy if exists "card share links admin read" on public.miso_card_share_links;
create policy "card share links admin read" on public.miso_card_share_links for select to authenticated
using ((select auth.jwt() ->> 'email') = 'psw3077@gmail.com' or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "card share links admin create" on public.miso_card_share_links;
create policy "card share links admin create" on public.miso_card_share_links for insert to authenticated
with check (((select auth.jwt() ->> 'email') = 'psw3077@gmail.com' or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') and created_by = (select auth.uid()));
drop policy if exists "card share links admin revoke" on public.miso_card_share_links;
create policy "card share links admin revoke" on public.miso_card_share_links for update to authenticated
using (((select auth.jwt() ->> 'email') = 'psw3077@gmail.com' or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') and created_by = (select auth.uid()))
with check (((select auth.jwt() ->> 'email') = 'psw3077@gmail.com' or (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') and created_by = (select auth.uid()));

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.secure_card_event()
returns trigger language plpgsql security definer
set search_path = pg_catalog, public, private
as $$
declare link public.miso_card_share_links%rowtype; recent_count integer;
begin
  select count(*) into recent_count from public.miso_card_events
  where session_id = new.session_id and created_at > now() - interval '1 minute';
  if recent_count >= 60 then raise exception 'Too many analytics events' using errcode = 'P0001'; end if;
  new.created_at := now();
  new.expires_at := now() + interval '13 months';
  new.event_type := new.event_name;
  new.source_card := new.card_id;
  new.source_staff := null;
  new.referrer := null;
  new.user_agent := null;
  new.target := left(coalesce(new.target, ''), 160);
  new.metadata := new.metadata - array['name','email','phone','recipient','ip','user_agent','account_id'];
  if new.share_token_hash is not null then
    select * into link from public.miso_card_share_links
    where token_hash = new.share_token_hash and revoked_at is null and expires_at > now() and card_id = new.card_id;
    if found then new.source_staff := link.source_staff; else new.share_token_hash := null; end if;
  end if;
  return new;
end;
$$;
revoke all on function private.secure_card_event() from public, anon, authenticated;
drop trigger if exists secure_miso_card_event on public.miso_card_events;
create trigger secure_miso_card_event before insert on public.miso_card_events
for each row execute function private.secure_card_event();

create index if not exists miso_card_events_created_at_idx on public.miso_card_events(created_at desc);
create index if not exists miso_card_events_card_created_idx on public.miso_card_events(card_id, created_at desc);
create index if not exists miso_card_events_visitor_idx on public.miso_card_events(visitor_id, created_at desc) where visitor_id is not null;
create index if not exists miso_card_events_share_hash_idx on public.miso_card_events(share_token_hash, created_at desc) where share_token_hash is not null;
create index if not exists miso_card_events_source_staff_idx on public.miso_card_events(source_staff, created_at desc) where source_staff is not null;

update public.miso_card_events set expires_at = created_at + interval '13 months' where expires_at is null;
comment on column public.miso_card_events.visitor_id is 'Random browser-local UUID; not an identity assertion.';
comment on column public.miso_card_events.share_token_hash is 'SHA-256 digest only; raw invite tokens are never stored.';
comment on column public.miso_card_events.account_id is 'Linked only after explicit consent and must equal auth.uid().';

