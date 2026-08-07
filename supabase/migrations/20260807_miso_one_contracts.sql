create extension if not exists pgcrypto;

create table if not exists public.miso_contracts (
  id uuid primary key default gen_random_uuid(),
  contract_type text not null check (contract_type in ('trade','employment','special')),
  party_name text not null,
  phone text not null,
  address text,
  business_number text,
  notes text,
  document_text text,
  signature_data text,
  public_token uuid not null unique default gen_random_uuid(),
  status text not null default 'draft' check (status in ('draft','sent','signed','completed','cancelled')),
  signed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists miso_contracts_public_token_idx on public.miso_contracts(public_token);
create index if not exists miso_contracts_status_idx on public.miso_contracts(status);
create index if not exists miso_contracts_phone_idx on public.miso_contracts(phone);

alter table public.miso_contracts enable row level security;

-- 운영 전 Supabase Auth 기반 관리자 정책으로 교체해야 합니다.
-- 현재는 익명 링크 서명 테스트를 위한 최소 정책만 제공합니다.
create policy "miso_contracts_insert_demo"
on public.miso_contracts for insert
to anon, authenticated
with check (true);

create policy "miso_contracts_select_by_public_token_demo"
on public.miso_contracts for select
to anon, authenticated
using (true);

create policy "miso_contracts_update_demo"
on public.miso_contracts for update
to anon, authenticated
using (true)
with check (true);

create or replace function public.set_miso_contract_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  if new.status = 'signed' and old.status is distinct from 'signed' then
    new.signed_at = coalesce(new.signed_at, now());
  end if;
  return new;
end;
$$;

drop trigger if exists trg_miso_contract_updated_at on public.miso_contracts;
create trigger trg_miso_contract_updated_at
before update on public.miso_contracts
for each row execute function public.set_miso_contract_updated_at();
