-- Browser/API privileges required in addition to RLS policies.
-- Public visitors can submit inquiries and read active products/resources.
-- Authenticated admins can manage records, while RLS still limits access.

grant usage on schema public to anon, authenticated;

grant insert on table public.inquiries to anon;
grant insert, select, update on table public.inquiries to authenticated;
grant usage, select on sequence public.inquiries_id_seq to anon, authenticated;

grant select on table public.products to anon;
grant select, insert, update, delete on table public.products to authenticated;
grant usage, select on sequence public.products_id_seq to authenticated;

grant select on table public.resources to anon;
grant select, insert, update, delete on table public.resources to authenticated;
grant usage, select on sequence public.resources_id_seq to authenticated;

grant execute on function public.is_plb_admin() to authenticated;
