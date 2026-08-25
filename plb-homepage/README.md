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
- 모바일 햄버거 메뉴와 하단 빠른 상담
- 문의 폼 검증·스팸 방지·이메일 대체 접수
- 관리자 권한 분리와 문의 처리 상태 관리

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
2. `supabase/001_initial_schema.sql`부터 `005_admin_security_and_inquiry_email.sql`까지 번호 순서대로 SQL Editor에서 실행합니다.
3. `.env.local`에 아래 값을 입력합니다.

```env
VITE_SUPABASE_URL=프로젝트_URL
VITE_SUPABASE_PUBLISHABLE_KEY=Publishable_Key
```

4. Supabase Authentication에서 관리자 계정을 만든 뒤 `005_admin_security_and_inquiry_email.sql` 맨 아래의 관리자 등록 예시를 실제 관리자 이메일로 바꿔 실행합니다.

## Cloudflare Pages

- Root directory: `plb-homepage`
- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `20`

## 아직 필요한 작업

- Supabase 프로젝트 생성과 환경변수 등록
- SQL 5개 실행 및 관리자 계정 등록
- Cloudflare Pages 또는 Vercel 실제 배포 연결
- 카카오채널·네이버 클립·유튜브 실제 주소 연결
