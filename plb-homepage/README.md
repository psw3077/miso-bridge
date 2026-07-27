# PLB Homepage Service V1

주식회사 피엘비의 실제 운영형 홈페이지 첫 개발본입니다.

## 현재 구현

- 반응형 기업 홈페이지
- 회사소개 및 사업분야
- 용도별 도료 찾기
- 전화·견적 문의
- Supabase 문의 저장 준비
- 모바일 최적화

## 실행

```bash
cd plb-homepage
cp .env.example .env.local
npm install
npm run dev
```

## Supabase 연결

1. Supabase 프로젝트를 생성합니다.
2. `supabase/001_initial_schema.sql`을 SQL Editor에서 실행합니다.
3. `.env.local`에 아래 값을 입력합니다.

```env
VITE_SUPABASE_URL=프로젝트_URL
VITE_SUPABASE_PUBLISHABLE_KEY=Publishable_Key
```

## 다음 작업

- 실제 창고·대표·협찬 이미지 등록
- 관리자 로그인
- 문의 관리 대시보드
- 제품·제조사·자료실 관리
- Vercel 또는 Cloudflare Pages 배포
