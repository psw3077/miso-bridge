-- MISO ONE growth-service extension
-- Adds inquiry type classification so startup, funding, closure, franchise,
-- and partner-network leads can share the same secure consulting CRM.

alter table public.consulting_inquiries
add column if not exists consulting_type text not null default '창업·자금';

create index if not exists consulting_inquiries_type_idx
on public.consulting_inquiries(consulting_type);

comment on column public.consulting_inquiries.consulting_type is
'창업·자금, 폐업·업종변경, 프랜차이즈·업체연결 등 상담 유형';
