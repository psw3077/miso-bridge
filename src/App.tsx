import { FormEvent, useState } from "react";
import {
  ArrowRight, BadgeCheck, Building2, CheckCircle2, ChevronRight,
  FileUp, MapPin, Menu, Megaphone, Phone, ShieldCheck, Store, X,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

type FormKind = "partner" | "pickup" | "advertising" | null;
type Notice = { type: "ok" | "error"; text: string } | null;

const kakaoUrl = "http://pf.kakao.com/_xnaXJn";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formKind, setFormKind] = useState<FormKind>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [submitting, setSubmitting] = useState(false);

  const openForm = (kind: Exclude<FormKind, null>) => {
    setNotice(null);
    setFormKind(kind);
    document.body.style.overflow = "hidden";
  };
  const closeForm = () => {
    setFormKind(null);
    document.body.style.overflow = "";
  };

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(null);
    if (!supabase || !formKind) {
      setNotice({ type: "error", text: "Supabase 연결값을 먼저 설정해 주세요." });
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    try {
      if (formKind === "partner") {
        const file = data.get("license") as File;
        if (!file?.size) throw new Error("사업자등록증 파일을 첨부해 주세요.");
        if (file.size > 8 * 1024 * 1024) throw new Error("파일은 8MB 이하만 가능합니다.");
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${crypto.randomUUID()}/${safeName}`;
        const upload = await supabase.storage.from("business-licenses").upload(path, file);
        if (upload.error) throw upload.error;
        const result = await supabase.from("partner_applications").insert({
          owner_name: data.get("owner_name"),
          phone: data.get("phone"),
          store_name: data.get("store_name"),
          business_type: data.get("business_type"),
          address: data.get("address"),
          inquiry: data.get("inquiry"),
          license_path: path,
        });
        if (result.error) throw result.error;
      } else if (formKind === "pickup") {
        const result = await supabase.from("pickup_partner_applications").insert({
          store_name: data.get("store_name"),
          owner_name: data.get("owner_name"),
          phone: data.get("phone"),
          address: data.get("address"),
          pickup_hours: data.get("pickup_hours"),
          benefit_interest: data.get("benefit_interest"),
        });
        if (result.error) throw result.error;
      } else {
        const result = await supabase.from("advertising_inquiries").insert({
          company_name: data.get("company_name"),
          contact_name: data.get("contact_name"),
          phone: data.get("phone"),
          category: data.get("category"),
          budget: data.get("budget"),
          inquiry: data.get("inquiry"),
        });
        if (result.error) throw result.error;
      }
      form.reset();
      setNotice({ type: "ok", text: "신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "접수 중 오류가 발생했습니다.";
      setNotice({ type: "error", text: message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header className="header">
        <a className="brand" href="#top" aria-label="미소브릿지 홈">
          <span className="brand-mark">M</span>
          <span><b>MISO BRIDGE</b><small>미소브릿지</small></span>
        </a>
        <nav className={menuOpen ? "nav open" : "nav"}>
          <a href="#business" onClick={() => setMenuOpen(false)}>사장님 시작하기</a>
          <a href="#pickup" onClick={() => setMenuOpen(false)}>픽업 파트너</a>
          <a href="#advertising" onClick={() => setMenuOpen(false)}>광고·입점</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>미소브릿지 소개</a>
          <a className="nav-cta" href={kakaoUrl} target="_blank" rel="noreferrer">카카오 상담</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="메뉴">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><BadgeCheck size={17}/> 대한민국 외식업 연결 플랫폼</div>
            <h1>사장님의 성공을<br/><em>연결합니다.</em></h1>
            <p>술을 납품하는 것에서 끝나지 않습니다.<br/>거래, 픽업, 홍보를 연결해 매장의 다음 성장을 돕습니다.</p>
            <div className="hero-actions">
              <button className="button primary" onClick={() => openForm("partner")}>사장님 시작하기 <ArrowRight size={18}/></button>
              <button className="button secondary" onClick={() => openForm("pickup")}>픽업 파트너 신청</button>
            </div>
            <div className="trust-row">
              <span><ShieldCheck/> 안전한 사업자 서류 보관</span>
              <span><CheckCircle2/> 관리자 확인 후 승인</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="미소브릿지 연결 구조">
            <div className="bridge-card main-card">
              <span className="mini-label">MISO BRIDGE</span>
              <h3>장사가 잘되는 연결</h3>
              <div className="metric"><b>01</b><span>거래 신청</span></div>
              <div className="metric"><b>02</b><span>픽업 파트너</span></div>
              <div className="metric"><b>03</b><span>매장 홍보</span></div>
            </div>
            <div className="floating-card fc-one"><Store/><span>매장</span></div>
            <div className="floating-card fc-two"><MapPin/><span>픽업</span></div>
          </div>
        </section>

        <section className="quick-strip">
          <span>미소주류 거래 신청</span><i/>
          <span>사업자등록증 등록</span><i/>
          <span>픽업 파트너 참여</span><i/>
          <span>광고·입점 문의</span>
        </section>

        <section className="section" id="business">
          <div className="section-heading">
            <span className="section-kicker">FOR BUSINESS OWNERS</span>
            <h2>사장님은 장사에 집중하세요.<br/>연결은 미소브릿지가 돕겠습니다.</h2>
            <p>신규 거래부터 픽업 파트너 참여까지 한 번에 신청할 수 있습니다.</p>
          </div>
          <div className="cards">
            <article className="service-card dark">
              <div className="icon-box"><Building2/></div>
              <span className="card-number">01</span>
              <h3>미소주류 신규 거래</h3>
              <p>사업자등록증과 매장 정보를 등록하면 담당자가 확인 후 상담을 진행합니다.</p>
              <button onClick={() => openForm("partner")}>거래 신청하기 <ChevronRight/></button>
            </article>
            <article className="service-card" id="pickup">
              <div className="icon-box gold"><MapPin/></div>
              <span className="card-number">02</span>
              <h3>픽업 파트너 신청</h3>
              <p>우리 매장을 고객이 방문하는 픽업 거점으로 연결해 신규 방문 기회를 만듭니다.</p>
              <button onClick={() => openForm("pickup")}>파트너 신청하기 <ChevronRight/></button>
            </article>
            <article className="service-card" id="advertising">
              <div className="icon-box blue"><Megaphone/></div>
              <span className="card-number">03</span>
              <h3>광고·입점 문의</h3>
              <p>제조사, 식자재, 프랜차이즈의 상품과 서비스를 외식업 네트워크에 소개합니다.</p>
              <button onClick={() => openForm("advertising")}>문의 남기기 <ChevronRight/></button>
            </article>
          </div>
        </section>

        <section className="process-section">
          <div>
            <span className="section-kicker light">SIMPLE PROCESS</span>
            <h2>신청은 간단하게,<br/>확인은 꼼꼼하게.</h2>
          </div>
          <ol className="steps">
            <li><b>1</b><span><strong>온라인 신청</strong>매장 기본정보 입력</span></li>
            <li><b>2</b><span><strong>서류 확인</strong>담당자 검토 및 상담</span></li>
            <li><b>3</b><span><strong>파트너 연결</strong>승인 후 서비스 시작</span></li>
          </ol>
        </section>

        <section className="section about" id="about">
          <div className="about-copy">
            <span className="section-kicker">OUR PROMISE</span>
            <h2>술만 납품하는 회사가<br/>아닙니다.</h2>
            <p>미소브릿지는 외식업 사장님과 고객, 제조사와 서비스를 연결합니다. 현장에서 필요한 연결을 하나씩 만들고, 실제 매출에 도움이 되는 기능부터 시작합니다.</p>
          </div>
          <div className="quote-card">
            <div className="quote-mark">“</div>
            <p>사장님의 장사가 잘되도록<br/>끝까지 함께 고민합니다.</p>
            <span>미소브릿지 · 미소주류</span>
          </div>
        </section>

        <section className="cta-section">
          <div><span>상담이 필요하신가요?</span><h2>가장 쉬운 방법으로<br/>먼저 이야기해 주세요.</h2></div>
          <div className="cta-buttons">
            <a className="button gold-button" href={kakaoUrl} target="_blank" rel="noreferrer">카카오채널 상담 <ArrowRight/></a>
            <a className="phone-link" href="tel:031-336-3077"><Phone/> 031-336-3077</a>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">M</span><span><b>MISO BRIDGE</b><small>사장님의 성공을 연결합니다.</small></span></div>
        <p>(주)미소주류 · 대표전화 031-336-3077<br/>본 사이트는 미소브릿지 V1 서비스 준비 페이지입니다.</p>
        <p className="copyright">© 2026 MISO BRIDGE. All rights reserved.</p>
      </footer>

      {formKind && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && closeForm()}>
          <div className="modal" role="dialog" aria-modal="true">
            <button className="modal-close" onClick={closeForm} aria-label="닫기"><X/></button>
            <div className="modal-head">
              <span className="section-kicker">{formKind === "partner" ? "NEW PARTNER" : formKind === "pickup" ? "PICKUP PARTNER" : "ADVERTISING"}</span>
              <h2>{formKind === "partner" ? "신규 거래 신청" : formKind === "pickup" ? "픽업 파트너 신청" : "광고·입점 문의"}</h2>
              <p>입력하신 정보는 상담과 검토 목적으로만 사용됩니다.</p>
            </div>
            {!isSupabaseConfigured && <div className="config-alert">현재 화면은 미리보기입니다. 배포 전에 Supabase 환경변수를 연결해야 실제 접수가 가능합니다.</div>}
            <form onSubmit={submitForm}>
              {formKind === "advertising" ? (
                <>
                  <Field label="회사명" name="company_name" required />
                  <Field label="담당자명" name="contact_name" required />
                  <Field label="연락처" name="phone" type="tel" required />
                  <Select label="문의 구분" name="category" options={["제조사 입점", "배너 광고", "프랜차이즈", "식자재·서비스", "기타"]}/>
                  <Field label="예상 예산(선택)" name="budget" placeholder="예: 월 100만원" />
                </>
              ) : (
                <>
                  <Field label="매장명" name="store_name" required />
                  <Field label="대표자명" name="owner_name" required />
                  <Field label="연락처" name="phone" type="tel" required />
                  <Field label="매장 주소" name="address" required />
                  {formKind === "partner" ? (
                    <>
                      <Select label="업종" name="business_type" options={["일반음식점", "주점", "카페", "소매점", "신규 오픈 준비", "기타"]}/>
                      <label className="field"><span>사업자등록증 <b>*9�h��춻�q�^wX\
�O��[ۈ�^O^��O���O��[ۏ�_O��[X���X�[�B��^ܝY�][\�