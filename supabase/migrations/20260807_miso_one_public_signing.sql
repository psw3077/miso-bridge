-- MISO ONE 공개 서명 링크용 최소 권한 RPC
-- public_token을 알고 있는 상대방만 계약 조회/서명 가능하도록 직접 select/update 정책을 제거합니다.

drop policy if exists "miso_contracts_select_by_public_token_demo" on public.miso_contracts;
drop policy if exists "miso_contracts_update_demo" on public.miso_contracts;

create or replace function public.get_miso_contract_by_token(p_token uuid)
returns table (
  id uuid,
  contract_type text,
  party_name text,
  phone text,
  address text,
  business_number text,
  notes text,
  document_text text,
  status text,
  signed_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select c.id, c.contract_type, c.party_name, c.phone, c.address,
         c.business_number, c.notes, c.document_text, c.status,
         c.signed_at, c.created_at, c.updated_at
  from public.miso_contracts c
  where c.public_token = p_token
    and c.status <> 'cancelled'
  limit 1;
$$;

create or replace function public.sign_miso_contract_by_token(
  p_token uuid,
  p_signature text
)
returns table (id uuid, status text, signed_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_signature is null or length(p_signature) < 100 then
    raise exception '서명 데이터가 올바르지 않습니다.';
  end if;

  return query
  update public.miso_contracts c
     set signature_data = p_signature,
         status = 'signed',
         signed_at = coalesce(c.signed_at, now()),
         updated_at = now()
   where c.public_token = p_token
     and c.status in ('draft','sent')
  returning c.id, c.status, c.signed_at;
end;
$$;

grant execute on function public.get_miso_contract_by_token(uuid) to anon, authenticated;
grant execute on function public.sign_miso_contract_by_token(uuid, text) to anon, authenticated;
