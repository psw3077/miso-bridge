import { FormEvent, useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeHelp,
  Beer,
  Building2,
  CheckCircle2,
  FileUp,
  Grape,
  Handshake,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  Users,
  Wine,
  X,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

type FormKind = "partner" | "consulting" | "franchise" | null;
type Notice = { type: "ok" | "error"; text: string } | null;

const links = {
  imweb: "https://miso73590.imweb.me/",
  kakao: "http://pf.kakao.com/_xnaXJn",
  blog: "https://blog.naver.com/saga9292",
  instagram: "https://www.instagram.com/misojooryu/",
  facebook: "https://www.facebook.com/100069034002808",
};

const consultingLabels: Record<Exclude<FormKind, "partner" | null>, string> = {
  consulting: "창업·자금",
  franchise: "프랜차이즈·업체연결",
};

const newsItems = [
  { type: "공지", title: "주류 가격 변동 안내", text: "주요 품목의 공급가 변동 내용을 확인해 주세요.", date: "2026.08" },
  { type: "신제품", title: "신제품·신규 입고 안내", text: "업장에서 찾는 최신 주류와 신규 입고 소식을 전합니다.", date: "2026.08" },
  { type: "배송안내", title: "배송 일정 및 주문마감 안내", text: "휴무·연휴 기간의 배송 일정을 미리 안내합니다.", date: "상시" },
  { type: "행사안내", title: "프로모션·업장 지원 소식", text: "판매에 도움이 되는 행사와 지원 정보를 모았습니다.", date: "상시" },
];

const articleItems = [
  {
    tag: "신제품",
    tagClass: "",
    title: "봄베이 사파이어 - 진의 클래식, 하이볼의 정석",
    text: "업장 판매용으로 알아두면 좋은 제품 특징과 추천 포인트를 정리합니다.",
    image: "card-pro/assets/miso-liquor-premium-showroom.jpg",
    date: "2026.08.20",
    views: "312",
  },
  {
    tag: "위스키",
    tagClass: "green",
    title: "제임슨 스탠다드 - 부드러움의 대명사",
    text: "하이볼과 온더락으로 활용하기 좋은 대표적인 아이리시 위스키 이야기.",
    image: "card-pro/assets/miso-card-premium-og-v2.jpg",
    date: "2026.08.18",
    views: "286",
  },
  {
    tag: "와인",
    tagClass: "wine",
    title: "가성비 좋은 데일리 와인 추천 5",
    text: "업장 콘셉트와 메뉴에 맞춰 고르기 좋은 데일리 와인 구성 포인트.",
    image: "card-pro/assets/miso-liquor-partnership-v2.jpg",
    date: "2026.08.16",
    views: "254",
  },
  {
    tag: "업장노하우",
    tagClass: "gold",
    title: "여름 성수기, 맥주 판매를 늘리는 3가지 방법",
    text: "회전율과 주문 동선을 점검해 맥주 판매 기회를 높이는 실전 아이디어.",
    image: "card-pro/assets/miso-card-premium-og.jpg",
    date: "2026.08.14",
    views: "198",
  },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formKind, setFormKind] = useState<FormKind>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [submitting, setSubmitting] = useState(false);

  const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, "");
    const params = new URLSearchParams(window.location.search);
    if (path.endsWith("/startup-consulting") || params.get("consulting") === "1") {
      setFormKind("consulting");
      document.body.style.overflow = "hidden";
    } else if (path.endsWith("/new-partner") || params.get("partner") === "1") {
      setFormKind("partner");
      document.body.style.overflow = "hidden";
    }
  }, []);

  const openForm = (kind: Exclude<FormKind, null>) => {
    setMenuOpen(false);
    setFormKind(kind);
    setNotice(null);
    document.body.style.overflow = "hidden";
  };

  const closeForm = () => {
    setFormKind(null);
    setNotice(null);
    document.body.style.overflow = "";
  };

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    if (!supabase || !formKind) {
      setNotice({ type: "error", text: "온라인 접수 DB 연결을 설정 중입니다. 우선 031-336-3077로 연락해 주세요." });
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);

    try {
      if (formKind === "partner") {
        let licensePath: string | null = null;
        const file = data.get("license") as File;
        if (file?.size) {
          if (file.size > 8 * 1024 * 1024) throw new Error("사업자등록증 파일은 8MB 이하만 가능합니다.");
          const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
          if (!allowed.includes(file.type)) throw new Error("사업자등록증은 PDF, JPG, PNG, WEBP만 가능합니다.");
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const path = `${crypto.randomUUID()}/${safeName}`;
          const upload = await supabase.storage.from("business-licenses").upload(path, file);
          if (upload.error) throw upload.error;
          licensePath = path;
        }

        const result = await supabase.from("partner_applications").insert({
          owner_name: data.get("owner_name"),
          phone: data.get("phone"),
          store_name: data.get("store_name"),
          business_type: data.get("business_type"),
          address: data.get("region"),
          inquiry: [
            `담당자: ${data.get("contact_name") || "-"}`,
            `기존 주류회사: ${data.get("current_supplier") || "-"}`,
            `오픈 예정일: ${data.get("opening_date") || "-"}`,
            `예상 월 매입: ${data.get("monthly_purchase") || "-"}`,
            `희망 주류: ${data.get("wanted_products") || "-"}`,
            `문의: ${data.get("inquiry") || "-"}`,
          ].join("\n"),
          license_path: licensePath,
        });
        if (result.error) throw result.error;
        setNotice({ type: "ok", text: "신규 거래 신청이 접수되었습니다. 담당자가 확인 후 빠르게 연락드리겠습니다." });
      } else {
        const result = await supabase.from("consulting_inquiries").insert({
          consulting_type: consultingLabels[formKind],
          name: data.get("name"),
          phone: data.get("phone"),
          region: data.get("region"),
          business_type: data.get("business_type"),
          opening_timing: data.get("opening_timing"),
          budget: data.get("budget"),
          funding_needed: data.get("funding_needed"),
          inquiry: [
            data.get("partner_needs") ? `필요 연결: ${data.get("partner_needs")}` : "",
            String(data.get("inquiry") || ""),
          ].filter(Boolean).join("\n"),
        });
        if (result.error) throw result.error;
        setNotice({ type: "ok", text: `${consultingLabels[formKind]} 상담이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.` });
      }
      form.reset();
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "처리 중 오류가 발생했습니다." });
    } finally {
      setSubmitting(false);
    }
  }

  const closeMenu = () => setMenuOpen(false);
  const scrollTo = (id: string) => {
    closeMenu();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mag-site" id="top">
      <div className="mag-topline">
        <div className="mag-container">대한민국 주류의 모든 것, 미소주류가 함께합니다.</div>
      </div>

      <header className="mag-header">
        <div className="mag-container mag-header-row">
          <a className="mag-logo" href="#top" onClick={closeMenu} aria-label="미소주류 홈">
            <img src={asset("card-pro/assets/miso-liquor-official-logo.png")} alt="미소주류 로고" />
            <span className="mag-logo-copy"><strong>미소주류</strong><small>MISO LIQUOR STORE</small></span>
          </a>

          <nav className={`mag-nav ${menuOpen ? "open" : ""}`} aria-label="주요 메뉴">
            <button type="button" onClick={() => scrollTo("lab")}>술장사 연구소</button>
            <a href={links.imweb} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>신제품</a>
            <a href={links.imweb} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>위스키</a>
            <a href={links.imweb} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>와인</a>
            <a href={links.imweb} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>맥주</a>
            <a href={links.imweb} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>중국술·고량주</a>
            <a href={links.imweb} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>사케·전통주</a>
            <button type="button" onClick={() => scrollTo("lab")}>업장 추천주</button>
            <a href={links.blog} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>주류업계 이야기</a>
            <button type="button" onClick={() => scrollTo("news")}>미소주류 소식</button>
          </nav>

          <div className="mag-header-actions">
            <a className="mag-head-btn primary" href="#top">미소주류 홈페이지</a>
            <button className="mag-head-btn gold" type="button" onClick={() => scrollTo("biz-guide")}>BIZ 발주하기</button>
          </div>

          <button className="mag-menu-toggle" type="button" onClick={() => setMenuOpen((v) => !v)} aria-label="메뉴 열기" aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section className="mag-hero" aria-labelledby="mag-hero-title">
          <img className="mag-hero-bg" src={asset("card-pro/assets/miso-liquor-premium-showroom.jpg")} alt="미소주류 프리미엄 주류 전시 이미지" />
          <div className="mag-container mag-hero-inner">
            <div className="mag-since">SINCE 2019</div>
            <h1 id="mag-hero-title">믿을 수 있는 주류,<em>미소주류가 함께합니다</em></h1>
            <p className="mag-hero-desc">전국 3,600여 거래처와 함께하는 종합주류 도매 전문기업<br />최신 트렌드와 신제품, 업장 운영에 도움이 되는 정보까지 함께 전합니다.</p>
            <div className="mag-hero-proof">
              <div className="mag-proof-chip"><Users /><span><b>3,600+ 거래처</b><small>다양한 업종 공급 경험</small></span></div>
              <div className="mag-proof-chip"><Truck /><span><b>자체 배송 운영</b><small>신속하고 정확한 납품</small></span></div>
              <div className="mag-proof-chip"><ShieldCheck /><span><b>정품 보장</b><small>믿을 수 있는 유통</small></span></div>
            </div>
          </div>
          <div className="mag-hero-dots" aria-hidden="true"><i /><i /><i /><i /></div>
        </section>

        <div className="mag-category-wrap">
          <div className="mag-container mag-category-bar" aria-label="주류 카테고리">
            <a className="mag-category-item" href={links.imweb} target="_blank" rel="noopener noreferrer"><span className="mag-category-icon"><Wine /></span>위스키</a>
            <a className="mag-category-item" href={links.imweb} target="_blank" rel="noopener noreferrer"><span className="mag-category-icon"><Grape /></span>와인</a>
            <a className="mag-category-item" href={links.imweb} target="_blank" rel="noopener noreferrer"><span className="mag-category-icon"><Beer /></span>맥주</a>
            <a className="mag-category-item" href={links.imweb} target="_blank" rel="noopener noreferrer"><span className="mag-category-icon"><Building2 /></span>중국술·고량주</a>
            <a className="mag-category-item" href={links.imweb} target="_blank" rel="noopener noreferrer"><span className="mag-category-icon"><Sparkles /></span>사케·전통주</a>
            <a className="mag-category-item" href={links.imweb} target="_blank" rel="noopener noreferrer"><span className="mag-category-icon"><Store /></span>국산주류</a>
            <a className="mag-category-item" href={links.imweb} target="_blank" rel="noopener noreferrer"><span className="mag-category-icon"><CheckCircle2 /></span>논알콜</a>
            <a className="mag-category-item" href={links.imweb} target="_blank" rel="noopener noreferrer"><span className="mag-category-icon"><Search /></span>기타주류</a>
            <button className="mag-category-item" type="button" onClick={() => scrollTo("biz-guide")}><span className="mag-category-icon"><Handshake /></span>협력사</button>
            <button className="mag-category-item" type="button" onClick={() => scrollTo("news")}><span className="mag-category-icon"><MessageCircle /></span>미소주류 소식</button>
          </div>
        </div>

        <section className="mag-content" id="lab">
          <div className="mag-container mag-content-grid">
            <div>
              <div className="mag-section-head">
                <div className="mag-section-title"><h2>술장사 연구소</h2><p>사장님의 장사에 힘이 되는 주류 이야기</p></div>
                <a className="mag-more" href={links.blog} target="_blank" rel="noopener noreferrer">더보기</a>
              </div>

              <div className="mag-article-grid">
                {articleItems.map((item) => (
                  <a className="mag-article-card" key={item.title} href={links.blog} target="_blank" rel="noopener noreferrer">
                    <div className="mag-article-image">
                      <img src={asset(item.image)} alt="" loading="lazy" />
                      <span className={`mag-card-tag ${item.tagClass}`}>{item.tag}</span>
                    </div>
                    <div className="mag-article-body">
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                      <div className="mag-card-meta"><span>{item.date}</span><span>조회 {item.views}</span></div>
                    </div>
                  </a>
                ))}
              </div>

              <section className="mag-news" id="news">
                <div className="mag-section-head">
                  <div className="mag-section-title"><h2>미소주류 소식</h2><p>가격·입고·배송·행사 정보를 빠르게 확인하세요.</p></div>
                </div>
                <div className="mag-news-grid">
                  {newsItems.map((item, index) => (
                    <a className="mag-news-card" key={item.title} href={links.blog} target="_blank" rel="noopener noreferrer">
                      <span className="mag-news-icon">{index === 2 ? <Truck /> : index === 1 ? <Wine /> : index === 3 ? <Sparkles /> : <Users />}</span>
                      <span><small>{item.type} · {item.date}</small><h3>{item.title}</h3><p>{item.text}</p></span>
                    </a>
                  ))}
                </div>
              </section>

              <section className="mag-service-cta" id="biz-guide">
                <div>
                  <span>MISO BUSINESS SUPPORT</span>
                  <h2>신규 거래·발주·창업 상담을 한 곳에서 연결합니다.</h2>
                  <p>상품 검색과 상품관은 아임웹에서 확인하고, 신규 거래·발주 문의·창업 및 자금 상담은 미소주류가 직접 안내합니다.</p>
                </div>
                <div className="mag-cta-buttons">
                  <button className="mag-cta-btn primary" type="button" onClick={() => openForm("partner")}>신규 거래 문의 <ArrowRight /></button>
                  <button className="mag-cta-btn" type="button" onClick={() => openForm("consulting")}>창업·자금 상담</button>
                </div>
              </section>
            </div>

            <aside className="mag-aside" aria-label="미소주류 안내와 상담">
              <section className="mag-side-card navy">
                <h3>미소주류 안내</h3>
                <ul className="mag-side-list">
                  <li><span><Users /></span>전국 3,600여 거래처 납품<br />업소용 주류 전문 도매</li>
                  <li><span><ShieldCheck /></span>정품·정량을 기본으로 하는<br />믿을 수 있는 유통 시스템</li>
                  <li><span><Handshake /></span>전담 영업사원 배정<br />1:1 맞춤 상담 및 관리</li>
                </ul>
              </section>

              <section className="mag-side-card gold">
                <h3>거래·상담 문의</h3>
                <a className="mag-call" href="tel:0313363077"><Phone />031-336-3077</a>
                <p className="mag-hours">평일 09:00 - 18:00<br />토요일 09:00 - 13:00<br />일요일 휴무</p>
              </section>

              <a className="mag-side-action navy" href={links.imweb} target="_blank" rel="noopener noreferrer"><span>주류 검색·상품관</span><Search /></a>
              <button className="mag-side-action" type="button" onClick={() => openForm("partner")}><span>신규거래 문의하기</span><ArrowRight /></button>
            </aside>
          </div>
        </section>

        <section className="mag-metrics" aria-label="미소주류 주요 지표">
          <div className="mag-container mag-metric-grid">
            <div className="mag-metric"><Users /><span><b>3,600+</b><small>전국 거래처</small></span></div>
            <div className="mag-metric"><Wine /><span><b>종합주류</b><small>국내·수입·중국주류 공급</small></span></div>
            <div className="mag-metric"><Truck /><span><b>8대</b><small>자체 배송 차량</small></span></div>
            <div className="mag-metric"><ShieldCheck /><span><b>정품 100%</b><small>믿을 수 있는 유통</small></span></div>
            <div className="mag-metric"><Sparkles /><span><b>전문 컨설팅</b><small>메뉴 추천 & 매출 전략</small></span></div>
          </div>
        </section>
      </main>

      <footer className="mag-footer">
        <div className="mag-container mag-footer-grid">
          <div><strong>(주)미소주류 · MISO LIQUOR STORE</strong><br />경기도 용인시 처인구 모현읍 곡현로718번길 27, B동<br />대표전화 031-336-3077 · 미소주류 공식 홈페이지</div>
          <div className="mag-footer-links">
            <a href={links.blog} target="_blank" rel="noopener noreferrer">네이버 블로그</a>
            <a href={links.instagram} target="_blank" rel="noopener noreferrer">인스타그램</a>
            <a href={links.kakao} target="_blank" rel="noopener noreferrer">카카오채널</a>
            <a href={asset("privacy.html")}>개인정보처리방침</a>
            <a href={asset("terms.html")}>이용안내</a>
          </div>
        </div>
      </footer>

      <div className="mag-floating" aria-label="빠른 메뉴">
        <a href="tel:0313363077" aria-label="전화 상담"><Phone /></a>
        <a href={links.kakao} target="_blank" rel="noopener noreferrer" aria-label="카카오 상담"><MessageCircle /></a>
        <a href={links.imweb} target="_blank" rel="noopener noreferrer" aria-label="주류 검색"><Search /></a>
        <button type="button" onClick={() => openForm("partner")} aria-label="신규 거래"><Store /></button>
      </div>

      <nav className="mag-mobile-bar" aria-label="모바일 빠른 메뉴">
        <a href="#top"><Store /><span>홈</span></a>
        <a className="featured" href={links.imweb} target="_blank" rel="noopener noreferrer"><Search /><span>주류검색</span></a>
        <button type="button" onClick={() => openForm("consulting")}><Sparkles /><span>창업·자금</span></button>
        <button type="button" onClick={() => openForm("partner")}><Building2 /><span>신규거래</span></button>
        <a href="tel:0313363077"><Phone /><span>전화</span></a>
      </nav>

      {formKind && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && closeForm()}>
          <div className="modal">
            <button className="modal-close" onClick={closeForm}><X /></button>
            <div className="modal-head"><span className="section-kicker">MISO JOORYU</span><h2>{formKind === "partner" ? "신규 거래 신청" : consultingLabels[formKind]}</h2><p>필수 정보를 남겨주시면 담당자가 확인 후 연락드립니다.</p></div>
            {!isSupabaseConfigured && <div className="config-alert">현재 온라인 DB 설정을 확인 중입니다. 전화 031-336-3077 상담은 바로 가능합니다.</div>}
            {notice && <div className={`notice ${notice.type}`}>{notice.text}{notice.type === "ok" && <div className="success-links"><a href={links.kakao} target="_blank" rel="noreferrer">카카오 상담 계속하기</a><a href="tel:0313363077">전화상담 031-336-3077</a></div>}</div>}

            <form onSubmit={submitForm}>
              {formKind === "partner" ? <>
                <Field label="상호명" name="store_name" required />
                <Field label="대표자명" name="owner_name" required />
                <Field label="전화번호" name="phone" type="tel" required />
                <Field label="지역" name="region" required />
                <Field label="업종" name="business_type" required />
                <Field label="담당자명" name="contact_name" />
                <Field label="기존 주류회사" name="current_supplier" />
                <Field label="오픈 예정일" name="opening_date" type="date" />
                <Field label="예상 월 매입금액" name="monthly_purchase" />
                <Field label="취급 희망 주류" name="wanted_products" full />
                <label className="field full"><span>사업자등록증</span><div className="file-input"><FileUp size={19} /><input name="license" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" /></div><small>PDF·JPG·PNG·WEBP, 최대 8MB / 비공개 저장</small></label>
                <label className="field full"><span>문의내용</span><textarea name="inquiry" rows={4} /></label>
              </> : <>
                <Field label="이름" name="name" required />
                <Field label="전화번호" name="phone" type="tel" required />
                <Field label="지역" name="region" required />
                <Field label="희망 업종" name="business_type" required />
                <Field label="창업 예정 시기" name="opening_timing" />
                <Field label="예상 예산" name="budget" />
                {formKind === "franchise" && <Field label="필요한 업체·서비스" name="partner_needs" full />}
                <label className="field"><span>자금상담 필요 여부</span><select name="funding_needed" defaultValue="상담 희망"><option>상담 희망</option><option>필요 없음</option><option>아직 모름</option></select></label>
                <label className="field full"><span>문의내용</span><textarea name="inquiry" rows={5} /></label>
              </>}
              <label className="consent"><input type="checkbox" required /> 개인정보 수집 및 상담 목적 이용에 동의합니다.</label>
              <button className="button primary submit-button" disabled={submitting}>{submitting ? "접수 중..." : "신청하기"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, name, type = "text", required = false, full = false }: { label: string; name: string; type?: string; required?: boolean; full?: boolean }) {
  return <label className={`field ${full ? "full" : ""}`}><span>{label}{required && <b> *</b>}</span><input name={name} type={type} required={required} /></label>;
}
