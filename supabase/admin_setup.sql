-- 미소브릿지 관리자 페이지용 추가 설정
-- Supabase SQL Editor에서 한 번 실행하세요.

alter table if exists public.partner_applications
  add column if not exists status text not null default 'pending';

-- 관리자 이메일 판별 함수
create or replace function public.is_miso_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'psw3077@gmail.com';
$$;

-- 관리자: 신규 거래 신청 조회/수정
alter table public.partner_applications enable row level security;

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

-- 사업자등록증 파일: 관리자만 조회
-- 기존 익명 업로드 정책은 유지합니다.
drop policy if exists "miso admin read business licenses" on storage.objects;
create policy "miso admin read business licenses"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'business-licenses'
  and public.is_miso_admin()
);

-- 관리자 페이지가 회원가입 없이 동작하지는 않습니다.
-- 홈페이지 회원가입에서 psw3077@gmail.com 계정을 만든 뒤 이메일 인증을 완료하세요.
