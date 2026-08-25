alter table public.inquiries
add column if not exists email text;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_plb_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_plb_admin() from public;
grant execute on function public.is_plb_admin() to authenticated;

drop policy if exists "allow authenticated inquiry reads" on public.inquiries;
drop policy if exists "allow authenticated inquiry updates" on public.inquiries;
drop policy if exists "allow authenticated product writes" on public.products;
drop policy if exists "allow authenticated resource inserts" on public.resources;
drop policy if exists "allow authenticated resource updates" on public.resources;
drop policy if exists "allow authenticated resource deletes" on public.resources;

create policy "allow PLB admin inquiry reads"
on public.inquiries for select to authenticated
using (public.is_plb_admin());

create policy "allow PLB admin inquiry updates"
on public.inquiries for update to authenticated
using (public.is_plb_admin())
with check (public.is_plb_admin());

create policy "allow PLB admin product writes"
on public.products for all to authenticated
using (public.is_plb_admin())
with check (public.is_plb_admin());

create policy "allow PLB admin resource writes"
on public.resources for all to authenticated
using (public.is_plb_admin())
with check (public.is_plb_admin());

-- Supabase Authentication에서 관리자 계정을 만든 뒤 아래 쿼리를 한 번 실행하세요.
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = '관리자이메일@example.com'
-- on conflict (user_id) do nothing;
