-- 미소브릿지 관리자 페이지 및 신청 저장 권한 설정
-- Supabase SQL Editor에서 이 파일 전체를 한 번 실행하세요.

alter table if exists public.partner_applications
  add column if not exists status text not null default 'pending';
alter table if exists public.pickup_partner_applications
  add column if not exists status text not null default 'pending';
alter table if exists public.advertising_inquiries
  add column if not exists status text not null default 'pending';

create or replace function public.is_miso_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'psw3077@gmail.com';
$$;

alter table public.partner_applications enable row level security;
alter table public.pickup_partner_applications enable row level security;
alter table public.advertising_inquiries enable row level security;

drop policy if exists "public insert partner applications" on public.partner_applications;
create policy "public insert partner applications"
on public.partner_applications
for insert
to anon, authenticated
with check (true);

drop policy if exists "public insert pickup applications" on public.pickup_partner_applications;
create policy "public insert pickup applications"
on public.pickup_partner_applications
for insert
to anon, authenticated
with check (true);

drop policy if exists "public insert advertising inquiries" on public.advertising_inquiries;
create policy "public insert advertising inquiries"
on public.advertising_inquiries
for insert
to anon, authenticated
with check (true);

insert into storage.buckets (id, name, public)
values ('business-licenses', 'business-licenses', false)
on conflict (id) do nothing;

drop policy if exists "public upload business licenses" on storage.objects;
create policy "public upload business licenses"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'business-licenses');

-- 관리자: 신규 거래 신청 조회/수정
drop policy if exists "miso admin read partner applications" on public.partner_applications;
create policy "miso admin read partner applications"
on public.partner_applications
for select
to authenticated
using (public.is_miso_admin());

drop policy if exists "miso admin update partner applications" on public.partner_applications;
create policy "miso admin update partner applications"
on public.partner_applications
for update
to authenticated
using (public.is_miso_admin())
with check (public.is_miso_admin());

-- 관리자: 픽업 파트너 신청 조회/수정
drop policy if exists "miso admin read pickup applications" on public.pickup_partner_applications;
create policy "miso admin read pickup applications"
on public.pickup_partner_applications
for select
to authenticated
using (public.is_miso_admin());

drop policy if exists "miso admin update pickup applications" on public.pickup_partner_applications;
create policy "miso admin update pickup applications"
on public.pickup_partner_applications
for update
to authenticated
using (public.is_miso_admin())
with check (public.is_miso_admin());

-- 관리자: 광고 문의 조회/수정
drop policy if exists "miso admin read advertising inquiries" on public.advertising_inquiries;
create policy "miso admin read advertising inquiries"
on public.advertising_inquiries
for select
to authenticated
using (public.is_miso_admin());

drop policy if exists "miso admin update advertising inquiries" on public.advertising_inquiries;
create policy "miso admin update advertising inquiries"
on public.advertising_inquiries
for update
to authenticated
using (public.is_miso_admin())
with check (public.is_miso_admin());

-- 사업자등록증 파일: 관리자만 조회
drop policy if exists "miso admin read business licenses" on storage.objects;
create policy "miso admin read business licenses"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'business-licenses'
  and public.is_miso_admin()
);

-- 관리자 계정은 홈페이지 회원가입에서 psw3077@gmail.com으로 만든 계정을 사용합니다.
