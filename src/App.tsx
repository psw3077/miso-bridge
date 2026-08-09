import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight, Beer, Building2, CheckCircle2, FileUp, Grape, Menu,
  MessageCircle, Phone, Search, ShieldCheck, Sparkles, Store, Wine, X,
  BadgeHelp, Handshake,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import { categories, products } from "./misoOneData";
import "./product-cards.css";
import "./seo-guides.css";
import "./mobile-qa.css";

type FormKind = "partner" | "consulting" | "franchise" | null;
type Notice = { type: "ok" | "error"; text: string } | null;

function ProductMedia({ id, name }: { id: string; name: string }) {
  const [imageAvailable, setImageAvailable] = useState(true);
  const detailUrl = `${import.meta.env.BASE_URL}products/${id}/`;

  return (
    <a className="product-media" href={detailUrl} aria-label={`${name} 상세 정보 보기`}>
      {imageAvailable ? (
        <img src={`${import.meta.env.BASE_URL}product-images/${id}.webp`} alt={`${name} 제품 이미지`} loading="lazy" onError={() => setImageAvailable(false)} />
      ) : (
        <span className="product-placeholder" aria-label={`${name} 제품 이미지 준비 중`}>
          <Wine aria-hidden="true" /><b>{name}</b><small>제품 이미지 준비 중</small>
        </span>
      )}
      <span className="product-detail-hint">상세 정보 보기 <ArrowRight aria-hidden="true" /></span>
    </a>
  );
}

const links = {
  official: "https://misoliquor.co.kr/",
  kakao: "http://pf.kakao.com/_xnaXJn",
  blog: "https://blog.naver.com/saga9292",
  instagram: "https://www.instagram.com/misojooryu/",
  facebook: "https://www.facebook.com/100069034002808",
};

const consultingLabels: Record<Exclude<FormKind, "partner" | null>, string> = {
  consulting: "창업·자금",
  franchise: "프랜차이즈·업체연결",
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formKind, setFormKind] = useState<FormKind>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [submitting, setSubmitting] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("전체");

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

  const results = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return products.filter((product) => {
      const categoryMatch = category === "전체" || product.category === category;
      const text = [product.name, product.category, product.origin, product.description, ...product.tags]
        .join(" ")
        .toLowerCase();
      return categoryMatch && (!q || text.includes(q));
    });
  }, [keyword, category]);

  const openForm = (kind: Exclude<FormKind, null>) => {
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

  const chooseKeyword = (value: string) => {
    setKeyword(value);
    document.getElementById("liquor-search")?.scrollIntoView({ behavior: "smooth" });
  };

  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="header miso-header">
        <a className="brand" href="#top" aria-label="미소주류 홈" onClick={closeMobileMenu}>
          <span className="brand-mark">M</span>
          <span><b>MISO ONE</b><small>(주)미소주류</small></span>
        </a>
        <nav className={menuOpen ? "nav open" : "nav"}>
          <a href="#about" onClick={closeMobileMenu}>회사소개</a>
          <a href="#liquor-search" onClick={closeMobileMenu}>주류검색</a>
          <a href="#categories" onClick={closeMobileMenu}>전세계주류</a>
          <a href="#growth-services" onClick={closeMobileMenu}>창업·성장지원</a>
          <a href="#partner" onClick={closeMobileMenu}>신규 거래</a>
          <a href={links.official}>공식 홈페이지</a>
          <a href={links.blog} target="_blank" rel="noreferrer">블로그</a>
        </nav>
        <a className="header-phone" href="tel:0313363077"><Phone size={17}/> 031-336-3077</a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="메뉴" aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main id="top">
        <section className="miso-hero">
          <div className="hero-copy">
            <div className="eyebrow"><ShieldCheck size={17}/> 주류 공급부터 창업·성장까지 ONE STOP</div>
            <h1>술보다<br/><em>장사를 먼저 생각합니다.</em></h1>
            <p>국내주류·수입주류·중국주류·생맥주 공급부터 신규거래, 창업자금, 업종변경, 프랜차이즈·전문업체 연결까지.<br/>미소주류는 업소의 매출과 성장을 함께 만드는 비즈니스 파트너입니다.</p>
            <div className="hero-actions">
              <button className="button primary" onClick={() => openForm("partner")}>신규 거래 신청 <ArrowRight size={18}/></button>
              <button className="button secondary" onClick={() => document.getElementById("liquor-search")?.scrollIntoView({ behavior: "smooth" })}><Search size={18}/> AI 주류검색</button>
              <button className="button secondary" onClick={() => openForm("consulting")}><Sparkles size={18}/> 창업·자금 상담</button>
            </div>
          </div>
          <div className="hero-proof" aria-label="미소주류 핵심 강점">
            <div><b>3,600+</b><span>거래처 경험</span></div>
            <div><b>WORLD</b><span>국내·세계 주류</span></div>
            <div><b>ONE STOP</b><span>주류·창업·상담</span></div>
            <div><b>DIRECT</b><span>대표 직접 상담</span></div>
          </div>
        </section>

        <section className="miso-proof-strip">
          <span><CheckCircle2/> 국내·수입·중국주류 전문</span>
          <span><CheckCircle2/> 생맥주 시스템 지원</span>
          <span><CheckCircle2/> 창업·자금·업종변경 상담</span>
          <span><CheckCircle2/> 프랜차이즈·전문업체 연결</span>
        </section>

        <nav className="seo-guides" aria-labelledby="seo-guides-title">
          <div className="seo-guides-heading">
            <span className="section-kicker">MISO BUSINESS GUIDE</span>
            <h2 id="seo-guides-title">필요한 상담 정보를 먼저 확인하세요.</h2>
            <p>주류 공급부터 거래처 변경과 창업 준비까지, 목적에 맞는 안내 페이지로 바로 이동할 수 있습니다.</p>
          </div>
          <div className="seo-guide-grid">
            <a href={`${import.meta.env.BASE_URL}liquor-wholesale-company/`}><Building2/><span><b>주류도매회사·주류업체</b><small>공급 지역과 거래 절차 안내</small></span><ArrowRight/></a>
            <a href={`${import.meta.env.BASE_URL}change-liquor-company/`}><Handshake/><span><b>주류회사 변경</b><small>거래 조건 비교와 변경 상담</small></span><ArrowRight/></a>
            <a href={`${import.meta.env.BASE_URL}startup-consulting-guide/`}><Sparkles/><span><b>창업컨설팅·창업자금</b><small>예산·업종·일정·주류 공급 통합상담</small></span><ArrowRight/></a>
            <a href={`${import.meta.env.BASE_URL}liquor-product-search/`}><Search/><span><b>주류제품검색</b><small>제품 정보와 공급 문의 안내</small></span><ArrowRight/></a>
          </div>
        </nav>

        <section className="search-section" id="liquor-search">
          <div className="section-heading compact">
            <span className="section-kicker">MISO LIQUOR SEARCH</span>
            <h2>주류 이름만 검색해도 미소주류로.</h2>
            <p>제품명·주종·원산지로 검색하고 기본 정보 확인부터 업소용 공급·견적 상담까지 바로 연결하세요.</p>
          </div>

          <div className="search-panel">
            <div className="search-input-wrap"><Search/><input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="예: 연태고량주, 카스, 우량예, 사케"/><button onClick={() => setKeyword(keyword.trim())}>검색</button></div>
            <div className="popular-keywords">
              {['연태고량주','칭따오','카스','테라','참이슬','처음처럼','새로','골든블루','조니워커','우량예','하얼빈','사케','와인','생맥주'].map((item) => <button key={item} onClick={() => chooseKeyword(item)}>{item}</button>)}
            </div>
            <div className="category-filter">
              {categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
          </div>

          <div className="product-grid">
            {results.map((product) => (
              <article className="product-card" key={product.id}>
                <ProductMedia id={product.id} name={product.name} />
                <span className="product-category">{product.category}</span>
                <h3><a href={`${import.meta.env.BASE_URL}products/${product.id}/`}>{product.name}</a></h3>
                <p>{product.description}</p>
                <dl>
                  <div><dt>원산지</dt><dd>{product.origin}</dd></div>
                  {product.alcohol && <div><dt>도수</dt><dd>{product.alcohol}</dd></div>}
                  {product.volume && <div><dt>용량</dt><dd>{product.volume}</dd></div>}
                </dl>
                <div className="product-actions">
                  <a className="product-detail-link" href={`${import.meta.env.BASE_URL}products/${product.id}/`}>제품 상세 보기 <ArrowRight aria-hidden="true" /></a>
                  <button onClick={() => openForm("partner")}>공급·견적 문의</button>
                  <a className="product-blog-link" href={`${links.blog}/PostSearchList.naver?SearchText=${encodeURIComponent(product.name)}`} target="_blank" rel="noreferrer">블로그에서 더 보기</a>
                </div>
              </article>
            ))}
          </div>

          {results.length === 0 && (
            <div className="empty-search">
              <Search size={34}/>
              <h3>등록 준비 중인 제품입니다.</h3>
              <p>미소주류 블로그 또는 전화 상담으로 재고·공급 여부를 확인해 주세요.</p>
              <div><a className="button secondary" href={`${links.blog}/PostSearchList.naver?SearchText=${encodeURIComponent(keyword)}`} target="_blank" rel="noreferrer">블로그에서 검색</a><a className="button primary" href="tel:0313363077">전화 031-336-3077</a></div>
            </div>
          )}
        </section>

        <section className="section" id="categories">
          <div className="section-heading"><span className="section-kicker">WORLD LIQUOR COLLECTION</span><h2>국내주류부터 전세계주류까지.</h2><p>업종과 상권에 맞는 주류 구성을 한곳에서 찾아보세요.</p></div>
          <div className="miso-category-grid">
            <Category icon={<Store/>} title="국산주류" text="소주·맥주 등 외식업 기본 주류" onClick={() => { setCategory("국산주류"); setKeyword(""); }}/>
            <Category icon={<Beer/>} title="수입맥주" text="칭따오·하얼빈 등 다양한 수입맥주" onClick={() => { setCategory("수입맥주"); setKeyword(""); }}/>
            <Category icon={<Building2/>} title="중국주류" text="연태·우량예·서봉주 등 중국술 전문" onClick={() => { setCategory("중국주류"); setKeyword(""); }}/>
            <Category icon={<Wine/>} title="위스키" text="업종과 가격대에 맞는 위스키" onClick={() => { setCategory("위스키"); setKeyword(""); }}/>
            <Category icon={<Sparkles/>} title="사케" text="준마이·긴죠·다이긴죠 등" onClick={() => { setCategory("사케"); setKeyword(""); }}/>
            <Category icon={<Grape/>} title="와인" text="레드·화이트·스파클링" onClick={() => { setCategory("와인"); setKeyword(""); }}/>
            <Category icon={<Beer/>} title="생맥주" text="케그 공급과 생맥주 시스템 상담" onClick={() => { setCategory("생맥주"); setKeyword(""); }}/>
            <Category icon={<Store/>} title="전통주" text="업장 콘셉트에 맞는 전통주 제안" onClick={() => chooseKeyword("전통주")}/>
          </div>
        </section>

        <section className="process-section" id="business">
          <div><span className="section-kicker light">MISO BUSINESS</span><h2>상담부터 첫 납품까지<br/>빠르고 명확하게.</h2><p className="process-copy">신규 거래 문의를 남기면 담당자가 업종과 지역, 희망 품목을 확인한 뒤 상담을 진행합니다.</p></div>
          <ol className="steps">
            <li><b>01</b><span><strong>상담 접수</strong>온라인 또는 전화로 문의</span></li>
            <li><b>02</b><span><strong>담당자 확인</strong>지역·업종·희망 품목 검토</span></li>
            <li><b>03</b><span><strong>맞춤 제안</strong>주류 구성·생맥주·운영 상담</span></li>
            <li><b>04</b><span><strong>첫 납품</strong>거래 확정 후 공급 시작</span></li>
          </ol>
        </section>

        <section className="dual-cta" id="partner">
          <div className="cta-card dark"><span>NEW PARTNER</span><h2>신규 거래 상담</h2><p>상호·지역·업종·희망 주류와 사업자등록증을 남겨주시면 확인 후 빠르게 연락드립니다.</p><button className="button gold-button" onClick={() => openForm("partner")}>신규 거래 신청 <ArrowRight/></button></div>
          <div className="cta-card" id="consulting"><span>STARTUP CONSULTING</span><h2>창업·자금 컨설팅</h2><p>창업 예정 시기, 예산, 업종과 자금상담 필요 여부를 바탕으로 상담합니다.</p><button className="button primary" onClick={() => openForm("consulting")}>무료 상담 신청 <ArrowRight/></button></div>
        </section>

        <section className="section growth-services" id="growth-services">
          <div className="section-heading"><span className="section-kicker">MISO BUSINESS CONNECT</span><h2>가게의 시작과 성장을 함께 연결합니다.</h2><p>미소주류가 직접 처리하지 않는 분야는 필요한 전문업체와 연결하고, 최종적으로 매장 운영과 주류 거래까지 이어지도록 돕습니다.</p></div>
          <div className="growth-grid">
            <article><span><Sparkles/></span><h3>창업·자금 상담</h3><p>신규창업, 업종선택, 예상예산, 정책자금·금융상담 방향을 함께 점검합니다.</p><button onClick={() => openForm("consulting")}>상담 신청</button></article>
            <article><span><Handshake/></span><h3>프랜차이즈·업체연결</h3><p>인테리어, 주방설비, 세무·노무, 마케팅, 메뉴·밀키트 등 필요한 파트너를 연결합니다.</p><button onClick={() => openForm("franchise")}>업체 연결 상담</button></article>
            <article><span><BadgeHelp/></span><h3>주류회사 변경 상담</h3><p>기존 거래 조건과 필요한 주류 구성을 확인하고 신규 거래 가능 여부를 상담합니다.</p><button onClick={() => openForm("partner")}>거래 변경 상담</button></article>
          </div>
        </section>

        <section className="section about" id="about">
          <div className="about-copy"><span className="section-kicker">ABOUT MISO</span><h2>좋은 공급이<br/>좋은 사업을 만듭니다.</h2><p>미소주류는 단순히 술을 공급하는 회사가 아니라 거래처의 성장을 함께 고민하는 파트너를 지향합니다. 국내·수입·중국주류와 생맥주 공급, 신규 거래, 창업·자금 상담, 업종변경과 전문업체 연결을 하나로 이어갑니다.</p></div>
          <div className="quote-card"><div className="quote-mark">“</div><p>술 파는 회사를 넘어<br/>장사 잘되게 만드는 회사로.</p><span>(주)미소주류 · MISO ONE</span></div>
        </section>

        <section className="cta-section"><div><span>지금 바로 상담하세요</span><h2>신규 거래와 창업 상담을<br/>빠르게 연결합니다.</h2></div><div className="cta-buttons"><a className="button gold-button" href={links.kakao} target="_blank" rel="noreferrer"><MessageCircle/> 카카오 상담</a><a className="phone-link" href="tel:0313363077"><Phone/> 031-336-3077</a></div></section>
      </main>

      <div className="floating-actions" aria-label="빠른 메뉴">
        <a href="tel:0313363077"><Phone/><span>전화 상담</span></a>
        <a href={links.kakao} target="_blank" rel="noreferrer"><MessageCircle/><span>카카오 상담</span></a>
        <button onClick={() => document.getElementById("liquor-search")?.scrollIntoView({ behavior: "smooth" })}><Search/><span>주류검색</span></button>
        <button onClick={() => openForm("partner")}><Store/><span>신규 거래</span></button>
      </div>

      <nav className="mobile-actions" aria-label="모바일 빠른 메뉴">
        <a href="#top"><Store/><span>홈</span></a>
        <a href="#liquor-search"><Search/><span>주류검색</span></a>
        <button onClick={() => openForm("consulting")}><Sparkles/><span>창업·자금</span></button>
        <button onClick={() => openForm("partner")}><Building2/><span>신규거래</span></button>
        <a href="tel:0313363077"><Phone/><span>전화</span></a>
      </nav>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">M</span><span><b>MISO ONE</b><small>(주)미소주류</small></span></div>
        <div>경기도 용인시 처인구 모현읍 곡현로718번길 27, B동<br/>전화 031-336-3077 · 이메일 6miso3077@gmail.com<br/><a href={links.official}>미소주류 공식 홈페이지</a> · <a href={links.blog} target="_blank" rel="noreferrer">네이버 블로그</a> · <a href={links.instagram} target="_blank" rel="noreferrer">인스타그램</a> · <a href={links.facebook} target="_blank" rel="noreferrer">페이스북</a> · <a href={links.kakao} target="_blank" rel="noreferrer">카카오채널</a><br/><a href="./privacy.html">개인정보처리방침</a> · <a href="./terms.html">홈페이지 이용안내</a></div>
        <div className="copyright">© MISO JOORYU. All rights reserved.</div>
      </footer>

      {formKind && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && closeForm()}>
          <div className="modal">
            <button className="modal-close" onClick={closeForm}><X/></button>
            <div className="modal-head"><span className="section-kicker">MISO ONE</span><h2>{formKind === "partner" ? "신규 거래 신청" : consultingLabels[formKind]}</h2><p>필수 정보를 남겨주시면 담당자가 확인 후 연락드립니다.</p></div>
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
                <label className="field full"><span>사업자등록증</span><div className="file-input"><FileUp size={19}/><input name="license" type="file" accept="image/jpeg,image/png,image/webp,application/pdf"/></div><small>PDF·JPG·PNG·WEBP, 최대 8MB / 비공개 저장</small></label>
                <label className="field full"><span>문의내용</span><textarea name="inquiry" rows={4}/></label>
              </> : <>
                <Field label="이름" name="name" required />
                <Field label="전화번호" name="phone" type="tel" required />
                <Field label="지역" name="region" required />
                <Field label="희망 업종" name="business_type" required />
                <Field label="창업 예정 시기" name="opening_timing" />
                <Field label="예상 예산" name="budget" />
                {formKind === "franchise" && <Field label="필요한 업체·서비스" name="partner_needs" full />}
                <label className="field"><span>자금상담 필요 여부</span><select name="funding_needed" defaultValue="상담 희망"><option>상담 희망</option><option>필요 없음</option><option>아직 모름</option></select></label>
                <label className="field full"><span>문의내용</span><textarea name="inquiry" rows={5}/></label>
              </>}
              <label className="consent"><input type="checkbox" required/> 개인정보 수집 및 상담 목적 이용에 동의합니다.</label>
              <button className="button primary submit-button" disabled={submitting}>{submitting ? "접수 중..." : "신청하기"}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Category({ icon, title, text, onClick }: { icon: React.ReactNode; title: string; text: string; onClick: () => void }) {
  return <button className="miso-category-card" onClick={() => { onClick(); document.getElementById("liquor-search")?.scrollIntoView({ behavior: "smooth" }); }}><span>{icon}</span><h3>{title}</h3><p>{text}</p><b>제품 보기 →</b></button>;
}

function Field({ label, name, type = "text", required = false, full = false }: { label: string; name: string; type?: string; required?: boolean; full?: boolean }) {
  return <label className={`field ${full ? "full" : ""}`}><span>{label}{required && <b> *</b>}</span><input name={name} type={type} required={required}/></label>;
}
