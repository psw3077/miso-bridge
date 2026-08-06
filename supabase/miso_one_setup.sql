-- MISO ONE CRM / inquiry schema
-- Run once in the Supabase SQL editor for the project connected to this site.

create extension if not exists pgcrypto;

create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  store_name text not null,
  owner_name text not null,
  phone text not null,
  address text,
  business_type text,
  inquiry text,
  license_path text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.partner_applications add column if not exists status text not null default 'pending';
alter table public.partner_applications add column if not exists license_path text;

create table if not exists public.consulting_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  region text,
  business_type text,
  opening_timing text,
  budget text,
  funding_needed text,
  inquiry text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.partner_applications enable row level security;
alter table public.consulting_inquiries enable row level security;

-- Public visitors may submit inquiry forms, but may not read CRM data.
drop policy if exists "public insert partner applications" on public.partner_applications;
create policy "public insert partner applications"
on public.partner_applications for insert
to anon, authenticated
with check (true);

drop policy if exists "public insert consulting inquiries" on public.consulting_inquiries;
create policy "public insert consulting inquiries"
on public.consulting_inquiries for insert
to anon, authenticated
with check (true);

-- Admin CRM access is restricted to the configured representative account.
drop policy if exists "admin read partner applications" on public.partner_applications;
create policy "admin read partner applications"
on public.partner_applications for select
to authenticated
using ((auth.jwt() ->> 'email') = 'psw3077@gmail.com');

drop policy if exists "admin update partner applications" on public.partner_applications;
create policy "admin update partner applications"
on public.partner_applications for update
to authenticated
using ((auth.jwt() ->> 'email') = 'psw3077@gmail.com')
with check ((auth.jwt() ->> 'email') = 'psw3077@gmail.com');

drop policy if exists "admin read consulting inquiries" on public.consulting_inquiries;
create policy "admin read consulting inquiries"
on public.consulting_inquiries for select
to authenticated
using ((auth.jwt() ->> 'email') = 'psw3077@gmail.com');

drop policy if exists "admin update consulting inquiries" on public.consulting_inquiries;
create policy "admin update consulting inquiries"
on public.consulting_inquiries for update
to authenticated
using ((auth.jwt() ->> 'email') = 'psw3077@gmail.com')
with check ((auth.jwt() ->> 'email') = 'psw3077@gmail.com');

insert into storage.buckets (id, name, public)
values ('business-licenses', 'business-licenses', false)
on conflict (id) do nothing;

drop policy if exists "public upload business licenses" on storage.objects;
create policy "public upload business licenses"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'business-licenses');

drop policy if exists "admin read business licenses" on storage.objects;
create policy "admin read business licenses"
on storage.objects for select
to authenticated
using (bucket_id = 'business-licenses' and (auth.jwt() ->> 'email') = 'psw3077@gmail.com');

create index if not exists partner_applications_created_at_idx on public.partner_applications(created_at desc);
create index if not exists consulting_inquiries_created_at_idx on public.consulting_inquiries(created_at desc);
create index if not exists partner_applications_status_idx on public.partner_applications(status);
create index if not exists consulting_inquiries_status_idx on public.consulting_inquiries(status);
