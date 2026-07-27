# PLB 운영형 홈페이지

산업용 도료 전문기업 주식회사 피엘비의 운영형 홈페이지 프로젝트입니다.

## 현재 구현

- 실제 창고 사진 중심의 메인 화면 구조
- 박상민 대표 소개 영역
- 이미지형 PLB 사업분야
- 안정적인 재고·신속한 납품 프로세스
- 도료 찾기 기능
- 제조사 공식자료 연결
- 드라마 협찬 영역
- Supabase 문의 저장 준비
- PC·모바일 반응형 디자인

## 실제 이미지 파일명

아래 파일을 `plb-homepage/public/` 폴더에 넣으면 홈페이지에 바로 표시됩니다.

- `plb-warehouse-main.png` — 메인 창고 사진
- `plb-warehouse-sub.png` — 두 번째 창고 사진
- `plb-ceo.jpg` — 박상민 대표 사진
- `plb-sponsor.png` — 드라마 협찬 이미지

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

## Cloudflare Pages

- Root directory: `plb-homepage`
- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `20`

## 다음 작업

- 실제 이미지 4개를 `public/`에 등록
- 관리자 로그인
- 문의 관리 대시보드
- 제품·제조사·자료실 관리
- 실제 배포 연결
