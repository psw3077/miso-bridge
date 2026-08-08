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

## 다음 구현 우선순위
1. GitHub Actions typecheck/build 결과 확인 및 오류 수정
2. 제품 이미지·제품별 상세 SEO 페이지 구조 확장
3. 개인정보처리방침/이용약관 실제 페이지 추가
4. 사이트맵·구조화데이터·검색엔진 최적화 강화
5. 모바일 실기기 전체 QA
6. 무료 호스팅 공개 URL 최종 확인
7. 독립 도메인 연결
8. 마지막 단계에서 아임웹 '주류창업/고객센터' 버튼을 독립 홈페이지 상담 경로로 연결

## 보안 메모
- 이번 상담/신규거래 DB는 RLS와 비공개 사업자등록증 Storage를 적용했다.
- 기존 전자계약 기능의 `miso_contracts` 및 SECURITY DEFINER 함수에는 Supabase Advisor 경고가 별도로 남아 있어 전자계약 보안 점검 단계에서 정리한다.

## 주의
- Lovable 유료 의존을 피한다.
- 기존 아임웹은 독립 사이트 완성 전까지 유지한다.
- Work/Codex에서 변경한 내용은 반드시 GitHub에 커밋/푸시한다.
- 일반 ChatGPT에서 이어갈 때는 이 파일과 최신 저장소 상태를 먼저 확인한다.
