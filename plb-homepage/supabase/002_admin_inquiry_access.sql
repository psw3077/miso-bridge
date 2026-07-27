-- Supabase Authentication에서 관리자 이메일 계정을 먼저 생성하세요.
-- 이 정책은 로그인한 사용자만 문의 목록을 조회할 수 있도록 허용합니다.

create policy "allow authenticated inquiry reads"
on public.inquiries
for select
to authenticated
using (true);

-- 문의 처리 상태 변경을 관리자 화면에 추가할 때 사용하는 정책입니다.
create policy "allow authenticated inquiry updates"
on public.inquiries
for update
to authenticated
using (true)
with check (true);