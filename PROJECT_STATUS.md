# MISO JOORYU 독립 홈페이지 작업 상태

## 공통 원본
- Repository: `psw3077/miso-bridge`
- Branch: `main`
- 운영 원칙: `CHATGPT_SYNC.md` 참고

## 확정 목표
- 신규 업소 등록/문의/거래 전환
- 창업·자금 컨설팅
- 업종변경 상담
- 프랜차이즈/전문업체 연결
- 광고·마케팅용 상담 DB 확보
- 국내/세계 주류 제품 DB와 검색
- 사업자등록증 업로드
- 모바일 최적화
- SEO 강화

## 확정 제외
- 폐업 상담은 홈페이지에서 제외

## 확정 연결
- 대표전화: `031-336-3077`
- 전화 링크: `tel:0313363077`
- 네이버 블로그: `https://blog.naver.com/saga9292`
- 인스타그램: `https://www.instagram.com/misojooryu/`
- 카카오채널: `http://pf.kakao.com/_xnaXJn`
- 페이스북: `https://www.facebook.com/100069034002808`
- 창업·자금 상담 직접 경로: `/startup-consulting`
- 신규 거래 직접 경로: `/new-partner`

## 2026-08-08 반영 완료
- 신규 거래 신청 + 사업자등록증 비공개 업로드 코드
- 사업자등록증 확장자/용량 검증(PDF/JPG/PNG/WEBP, 8MB)
- 기존 주류회사, 오픈 예정일, 월 예상매입, 희망 주류 항목
- 창업·자금 상담 DB 저장
- 업종변경 상담 방향 유지
- 폐업 상담 UI/문구 제거
- 프랜차이즈·전문업체 연결 상담 추가
- 상담 유형(`consulting_type`) CRM 분류
- 관리자 CRM에서 상담 유형 검색/표시
- 국내/세계주류 검색 및 카테고리
- 검색 결과가 없을 때 네이버 블로그 제품명 검색 연결
- 블로그·카카오·인스타그램·페이스북 연결
- 모바일 빠른 메뉴 유지
- 일반 Chat/Work/Codex 공통 GitHub 원본 운영
- Supabase `MISO ONE` 프로젝트 실제 연결 확인
- `partner_applications`, `consulting_inquiries` 실제 테이블 생성
- `business-licenses` 비공개 Storage 버킷 생성
- 신규 거래/상담 공개 INSERT 정책 및 관리자 전용 조회·상태변경 RLS 적용
- 상담 유형(`consulting_type`) DB 컬럼 및 인덱스 적용
- 관리자 RLS 성능 최적화 적용
- GitHub Pages 배포가 예전 `miso-one-contracts` 브랜치를 고정 체크아웃하던 문제 수정
- GitHub Pages가 최신 `main`을 체크아웃하고 typecheck/build 후 배포하도록 변경
- Vite 배포 base 경로를 환경변수(`VITE_BASE_PATH`)로 제어하도록 변경
- GitHub Pages 임시주소 기준 `VITE_BASE_PATH=/miso-bridge/`, `SITE_URL=https://psw3077.github.io/miso-bridge` 적용
- `/startup-consulting` 직접 접속 시 창업·자금 상담창 자동 오픈
- `/new-partner` 직접 접속 시 신규 거래 신청창 자동 오픈
- 개인정보처리방침 `public/privacy.html` 추가
- 홈페이지 이용안내 `public/terms.html` 추가
- 푸터에서 개인정보처리방침·이용안내 연결
- 메인 SEO 제목/설명/키워드 확장
- Organization/LocalBusiness 구조화데이터 추가
- 제품 데이터에서 전체 제품별 정적 SEO 상세페이지를 빌드 시 자동 생성하는 `scripts/generate-product-pages.mjs` 추가
- 제품 상세페이지마다 고유 title/description/canonical/Open Graph/Product 구조화데이터 생성
- 제품별 이미지 경로 규칙 `public/product-images/<제품ID>.webp` 적용, 이미지 없으면 안전한 준비중 표시
- 제품 상세페이지와 메인/전화/블로그 상담 동선 연결
- 빌드 전 제품 SEO 페이지 + `sitemap.xml` + `robots.txt` 자동 생성
- 주류회사/주류업체/주류회사변경/주류제품검색/창업/창업자금/프랜차이즈 관련 핵심 키워드군을 메인 SEO에 반영
- 블로그·SNS용 해시태그와 검색 의도별 키워드 운영 문서 `SEO_KEYWORDS.md` 추가
- 검색 의도별 정적 랜딩페이지 자동 생성기 `scripts/generate-landing-pages.mjs` 추가
- `주류도매회사·주류업체`, `주류회사 변경`, `창업컨설팅·창업자금`, `주류제품검색` 4개 전용 랜딩페이지 생성 구조 적용
- 랜딩페이지별 고유 title/description/keywords/canonical/Open Graph/Service 구조화데이터 적용
- 랜딩페이지 CTA를 신규거래·창업상담·주류검색으로 연결
- 랜딩페이지 URL을 제품 sitemap과 병합하는 `scripts/merge-landing-sitemap.mjs` 추가
- 빌드 전 랜딩페이지 → 제품페이지 → sitemap 병합 순서로 자동 실행하도록 `package.json` 보완
- 메인 제품 카드에 실제 이미지 자동 표시 및 이미지 미등록·로드 실패 시 안전한 플레이스홀더 적용
- 제품 이미지·제품명·강조 CTA에서 제품별 정적 SEO 상세페이지로 바로 진입하도록 연결 강화
- 모바일 제품 카드의 상세 보기·공급 문의·블로그 버튼을 세로형 터치 영역으로 개선
- `npm run typecheck` 및 `npm run build` 기준 검증 완료, 누락되어 있던 Vite 환경 타입 선언 보완
- 메인에 검색 의도별 SEO 가이드 4종의 내부 링크 섹션 추가, 모바일에서는 한 줄형 대형 터치 카드로 제공
- 창업컨설팅과 창업자금 페이지를 하나로 통합하고 기존 `/startup-funding/`은 통합 페이지로 301·canonical 이동 처리
- 모바일 코드 QA에서 헤더와 펼침 메뉴의 68px 기준 위치를 일치시키고 상담창이 하단 고정 메뉴보다 항상 위에 표시되도록 보완

## 다음 구현 우선순위
1. 주요 주류 실제 제품 이미지 파일을 `public/product-images/`에 등록
2. 모바일 실기기 최종 시각 QA
3. 무료 호스팅 공개 URL 최종 확인
4. 독립 도메인 연결 후 `SITE_URL`을 최종 도메인으로 변경
5. 네이버 서치어드바이저/구글 서치콘솔에 sitemap 제출
6. 마지막 단계에서 아임웹 '주류창업/고객센터' 버튼을 독립 홈페이지 상담 경로로 연결

## 보안 메모
- 이번 상담/신규거래 DB는 RLS와 비공개 사업자등록증 Storage를 적용했다.
- 기존 전자계약 기능의 `miso_contracts` 및 SECURITY DEFINER 함수에는 Supabase Advisor 경고가 별도로 남아 있어 전자계약 보안 점검 단계에서 정리한다.

## 주의
- Lovable 유료 의존을 피한다.
- 기존 아임웹은 독립 사이트 완성 전까지 유지한다.
- Work/Codex에서 변경한 내용은 반드시 GitHub에 커밋/푸시한다.
- 일반 ChatGPT에서 이어갈 때는 이 파일과 최신 저장소 상태를 먼저 확인한다.
