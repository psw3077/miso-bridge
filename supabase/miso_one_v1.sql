-- MISO ONE v1: 창업·자금 컨설팅 접수 테이블
create table if not exists public.consulting_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  region text not null,
  business_type text not null,
  opening_timing text,
  budget text,
  funding_needed text,
  inquiry text,
  status text not null default '접수',
  created_at timestamptz not null default now()
);

alter table public.consulting_inquiries enable row level security;

-- 홈페이지 방문자는 상담을 접수할 수 있습니다.
drop policy if exists "public can insert consulting inquiries" on public.consulting_inquiries;
create policy "public can insert consulting inquiries"
on public.consulting_inquiries
for insert
to anon, authenticated
with check (true);

-- 로그인한 관리자만 목록을 읽을 수 있도록 기본 정책을 둡니다.
drop policy if exists "authenticated can read consulting inquiries" on public.consulting_inquiries;
create policy "authenticated can read consulting inquiries"
on public.consulting_inquiries
for select
to authenticated
using (true);

create index if not exists consulting_inquiries_created_at_idx
on public.consulting_inquiries (created_at desc);
