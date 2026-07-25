# MISO BRIDGE

사장님의 성공을 연결하는 외식업 플랫폼 V1입니다.

## 포함 기능

- 반응형 메인 홈페이지
- 미소주류 신규 거래 신청
- 사업자등록증 업로드
- 픽업 파트너 신청
- 광고·입점 문의
- 카카오채널 및 전화 상담

## 로컬 실행

1. `.env.example`을 `.env.local`로 복사합니다.
2. Supabase의 Project URL과 Publishable Key를 입력합니다.
3. `npm install`
4. `npm run dev`

## Supabase

기존 SQL 설정을 완료했다면 추가 실행은 필요하지 않습니다. 새 프로젝트에 설치할 때는
`supabase/migrations/001_initial_schema.sql`을 SQL Editor에서 실행합니다.

`service_role` 또는 Secret Key는 브라우저 환경변수에 절대 입력하지 않습니다.

## Cloudflare Pages

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `20`
- Production 환경변수:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`

SPA 경로 처리를 위한 `public/_redirects`가 포함되어 있습니다.
