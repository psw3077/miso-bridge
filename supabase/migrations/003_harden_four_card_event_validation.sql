create or replace function private.secure_card_event()
returns trigger language plpgsql security definer
set search_path = pg_catalog, public, private
as $function$
declare link public.miso_card_share_links%rowtype; recent_count integer;
begin
  if new.card_id not in ('hyundai_park_taewan','plb_park_sangmin','dream_realestate','miso_park_sangwook') then
    raise exception 'Invalid analytics card' using errcode='23514';
  end if;
  if new.event_name not in ('card_view','phone_click','sms_click','kakao_click','consult_click','quote_click','website_click','blog_click','contact_save','share_click','qr_entry','verified_view') then
    raise exception 'Invalid analytics event' using errcode='23514';
  end if;
  if coalesce(new.entry_source,'') not in ('kakao','profile','blog','qr','sms','direct','website') then new.entry_source:='direct'; end if;
  if coalesce(new.device_type,'') not in ('mobile','tablet','desktop') then new.device_type:='desktop'; end if;
  if new.visitor_id is null or length(new.visitor_id::text)>64 or new.visitor_id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then raise exception 'Invalid analytics visitor' using errcode='23514'; end if;
  if new.session_id is null or length(new.session_id::text)>64 or new.session_id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then raise exception 'Invalid analytics session' using errcode='23514'; end if;
  new.account_id:=auth.uid();
  if new.event_name='verified_view' and new.account_id is null then raise exception 'Verified analytics event requires authentication' using errcode='42501'; end if;
  select count(*) into recent_count from public.miso_card_events where session_id=new.session_id and created_at>now()-interval '1 minute';
  if recent_count>=60 then raise exception 'Too many analytics events' using errcode='P0001'; end if;
  new.created_at:=now(); new.expires_at:=now()+interval '13 months'; new.event_type:=new.event_name; new.source_card:=new.card_id; new.source_staff:=null; new.referrer:=null; new.user_agent:=null; new.target:=left(coalesce(new.target,''),160); new.is_first_visit:=coalesce(new.is_first_visit,false);
  if jsonb_typeof(coalesce(new.metadata,'{}'::jsonb))<>'object' then new.metadata:='{}'::jsonb;
  else new.metadata:=jsonb_strip_nulls(coalesce(new.metadata,'{}'::jsonb)-array['name','email','phone','recipient','ip','user_agent','account_id']); end if;
  if new.share_token_hash is not null then
    if new.share_token_hash !~ '^[0-9a-f]{64}$' then new.share_token_hash:=null;
    else
      select * into link from public.miso_card_share_links where token_hash=new.share_token_hash and revoked_at is null and expires_at>now() and card_id=new.card_id;
      if found then new.source_staff:=link.source_staff; else new.share_token_hash:=null; end if;
    end if;
  end if;
  return new;
end;
$function$;
grant execute on function private.secure_card_event() to anon, authenticated, service_role;
revoke usage on schema private from anon, authenticated;