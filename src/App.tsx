import { FormEvent, useState } from "react";
import {
  ArrowRight, BadgeCheck, BarChart3, Building2, CheckCircle2, ChevronRight,
  FileUp, Instagram, LogIn, MapPin, Menu, Megaphone, MessageCircle,
  Newspaper, Phone, PlayCircle, Search, ShieldCheck, Sparkles, Store,
  UserPlus, Users, X,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

type FormKind = "partner" | "pickup" | "advertising" | "auth" | null;
type AuthMode = "signup" | "login";
type Notice = { type: "ok" | "error"; text: string } | null;

const links = {
  kakao: "http://pf.kakao.com/_xnaXJn",
  blog: "https://blog.naver.com/saga9292",
  instagram: "https://www.instagram.com/misojooryu/",
  website: "https://miso73590.imweb.me/",
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formKind, setFormKind] = useState<FormKind>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [notice, setNotice] = useState<Notice>(null);
  const [submitting, setSubmitting] = useState(false);

  const openForm = (kind: Exclude<FormKind, null>, mode?: AuthMode) => {
    if (mode) setAuthMode(mode);
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
      if (formKind === "auth") {
        const email = String(data.get("email") || "");
        const password = String(data.get("password") || "");
        const result = authMode === "signup"
          ? await supabase.auth.signUp({ email, password, options: { data: { name: data.get("name"), member_type: data.get("member_type") } } })
          : await supabase.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
        setNotice({ type: "ok", text: authMode === "signup" ? "회원가입이 접수되었습니다. 이메일을 확인해 주세요." : "로그인되었습니다." });
      } else if (formKind === "partner") {
        const file = data.get("license") as File;
        if (!file?.size) throw new Error("사업자등록증 파일을 첨부해 주세요.");
        if (file.size > 8 * 1024 * 1024) throw new Error("파일은 8MB 이하만 가능합니다.");
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${crypto.randomUUID()}/${safeName}`;
        const upload = await supabase.storage.from("business-licenses").upload(path, file);
        if (upload.error) throw upload.error;
        const result = await supabase.from("partner_applications").insert({
          owner_name: data.get("owner_name"), phone: data.get("phone"),
          store_name: data.get("store_name"), business_type: data.get("business_type"),
          address: data.get("address"), inquiry: data.get("inquiry"), license_path: path,
        });
        if (result.error) throw result.error;
        setNotice({ type: "ok", text: "신규 거래 신청이 접수되었습니다." });
      } else if (formKind === "pickup") {
        const result = await supabase.from("pickup_partner_applications").insert({
          store_name: data.get("store_name"), owner_name: data.get("owner_name"), phone: data.get("phone"),
          address: data.get("address"), pickup_hours: data.get("pickup_hours"), benefit_interest: data.get("benefit_interest"),
        });
        if (result.error) throw result.error;
        setNotice({ type: "ok", text: "픽업 파트너 신청이 접수되었습니다." });
      } else {
        const result = await supabase.from("advertising_inquiries").insert({
          company_name: data.get("company_name"), contact_name: data.get("contact_name"), phone: data.get("phone"),
          category: data.get("category"), budget: data.get("budget"), inquiry: data.get("inquiry"),
        });
        if (result.error) throw result.error;
        setNotice({ type: "ok", text: "광고·입점 문의가 접수되었습니다." });
      }
      form.reset();
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "처리 중 오류가 발생했습니다." });
    } finally { setSubmitting(false); }
  }

  return <>
    <header className="header">
      <a className="brand" href="#top"><span className="brand-mark">M</span><span><b>MISO BRIDGE</b><small>미소브릿지</small></span></a>
      <nav className={menuOpen ? "nav open" : "nav"}>
        <a href="#business">사장님 시작하기</a><a href="#pickup-center">픽업 매장 찾기</a>
        <a href="#success-center">장사성공센터</a><a href="#advertising">광고센터</a><a href="#about">회사소개</a>
        <button className="nav-link" onClick={() => openForm("auth", "signup")}><UserPlus size={16}/> 회원가입</button>
        <button className="nav-link" onClick={() => openForm("auth", "login")}><LogIn size={16}/> 로그인</button>
      </nav>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><BadgeCheck size={17}/> 대한민국 외식업 연결 플랫폼</div>
          <h1>사장님의 성공을<br/><em>연결합니다.</em></h1>
          <p>주류 거래부터 픽업, 창업·마케팅·광고까지.<br/>외식업 사장님에게 필요한 연결을 한곳에 모았습니다.</p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => openForm("partner")}>사장님 시작하기 <ArrowRight size={18}/></button>
            <button className="button secondary" onClick={() => openForm("auth", "signup")}>무료 회원가입</button>
          </div>
          <div className="trust-row"><span><ShieldCheck/> 사업자 서류 안전 보관</span><span><CheckCircle2/> 서울·경기 전역 상담</span></div>
        </div>
        <div className="hero-visual"><div className="bridge-card main-card"><span className="mini-label">MISO BRIDGE</span><h3>장사가 잘되는 연결</h3><div className="metric"><b>01</b><span>주류 거래</span></div><div className="metric"><b>02</b><span>픽업 매장</span></div><div className="metric"><b>03</b><span>창업·마케팅</span></div><div className="metric"><b>04</b><span>광고·입점</span></div></div></div>
      </section>

      <section className="channel-strip">
        <a href="tel:0313363077"><Phone/> 전화 031-336-3077</a>
        <a href={links.kakao} target="_blank" rel="noreferrer"><MessageCircle/> 카카오채널</a>
        <a href={links.blog} target="_blank" rel="noreferrer"><Newspaper/> 미소주류 블로그</a>
        <a href={links.instagram} target="_blank" rel="noreferrer"><Instagram/> 인스타그램</a>
        <a href={links.website} target="_blank" rel="noreferrer"><Building2/> 미소주류 홈페이지</a>
      </section>

      <section className="section" id="business">
        <div className="section-heading"><span className="section-kicker">START WITH MISO</span><h2>사장님에게 필요한 시작을<br/>한 번에 연결합니다.</h2></div>
        <div className="cards four">
          <Service icon={<Building2/>} no="01" title="미소주류 신규 거래" text="사업자등록증을 등록하고 주류 납품 상담을 신청합니다." action="거래 신청" onClick={() => openForm("partner")}/>
          <Service icon={<MapPin/>} no="02" title="픽업 파트너 신청" text="우리 매장을 고객이 찾는 픽업 거점으로 등록합니다." action="파트너 신청" onClick={() => openForm("pickup")}/>
          <Service icon={<Users/>} no="03" title="사업자 회원가입" text="사업자 전용 정보와 향후 파트너 기능을 이용합니다." action="회원가입" onClick={() => openForm("auth", "signup")}/>
          <Service icon={<Megaphone/>} no="04" title="광고·입점 문의" text="제조사와 외식업 서비스를 미소브릿지에 소개합니다." action="광고 문의" onClick={() => openForm("advertising")}/>
        </div>
      </section>

      <section className="section alt" id="success-center">
        <div className="section-heading"><span className="section-kicker">BUSINESS SUCCESS CENTER</span><h2>장사성공센터</h2><p>현장에서 바로 도움이 되는 상담과 콘텐츠를 연결합니다.</p></div>
        <div className="success-grid">
          <Info icon={<Sparkles/>} title="창업 컨설팅" text="상권·업종·주류·운영 준비를 연결합니다."/>
          <Info icon={<BarChart3/>} title="업종 변경·매출 개선" text="메뉴와 운영 구조를 다시 점검합니다."/>
          <Info icon={<ShieldCheck/>} title="폐업 컨설팅" text="원상복구·정리·재도전을 함께 검토합니다."/>
          <Info icon={<Search/>} title="정책자금 정보" text="외식업 지원제도를 이해하기 쉽게 정리합니다."/>
          <Info icon={<PlayCircle/>} title="마케팅 교육" text="블로그·인스타·당근·카카오 활용법을 제공합니다."/>
          <Info icon={<MessageCircle/>} title="AI 장사상담" text="아이디어를 실행 가능한 계획으로 정리합니다."/>
        </div>
      </section>

      <section className="pickup-section" id="pickup-center"><div><span className="section-kicker light">PICKUP NETWORK</span><h2>가까운 픽업 매장을<br/>찾는 기능을 준비 중입니다.</h2><p>승인된 파트너 매장을 지역별로 검색하고 주문 상품을 안전하게 픽업하는 구조로 확장합니다.</p></div><button className="button gold-button" onClick={() => openForm("pickup")}>픽업 파트너 먼저 신청 <ArrowRight/></button></section>

      <section className="section about" id="about"><div className="about-copy"><span className="section-kicker">OPERATED BY MISO JOORYU</span><h2>미소주류가 운영하는<br/>외식업 연결 플랫폼</h2><p>미소브릿지는 단순한 회사 소개 홈페이지가 아닙니다. 거래처, 소비자, 제조사와 외식업 서비스를 실제 매출 기회로 연결하는 플랫폼을 목표로 합니다.</p></div><div className="quote-card"><div className="quote-mark">“</div><p>술 파는 회사를 넘어<br/>장사 잘되게 만드는 회사로.</p><span>미소브릿지 · (주)미소주류</span></div></section>

      <section className="cta-section" id="advertising"><div><span>지금 바로 연결하세요</span><h2>전화·카카오·온라인 신청<br/>편한 방법을 선택하세요.</h2></div><div className="cta-buttons"><a className="button gold-button" href={links.kakao} target="_blank" rel="noreferrer">카카오 상담 <ArrowRight/></a><a className="phone-link" href="tel:0313363077"><Phone/> 031-336-3077</a></div></section>
    </main>

    <footer><div className="brand footer-brand"><span className="brand-mark">M</span><span><b>MISO BRIDGE</b><small>사장님의 성공을 연결합니다.</small></span></div><p>(주)미소주류 · 대표전화 031-336-3077<br/>서울·경기 전역 주류 거래 및 외식업 연결 상담</p><p className="copyright">이용약관 · 개인정보처리방침<br/>© 2026 MISO BRIDGE.</p></footer>

    <div className="mobile-actions"><a href="tel:0313363077"><Phone/>전화</a><a href={links.kakao} target="_blank" rel="noreferrer"><MessageCircle/>카카오</a><button onClick={() => openForm("auth", "signup")}><UserPlus/>가입</button><button onClick={() => openForm("partner")}><Store/>거래신청</button></div>

    {formKind && <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && closeForm()}><div className="modal"><button className="modal-close" onClick={closeForm}><X/></button><div className="modal-head"><span className="section-kicker">MISO BRIDGE</span><h2>{formKind === "partner" ? "신규 거래 신청" : formKind === "pickup" ? "픽업 파트너 신청" : formKind === "advertising" ? "광고·입점 문의" : authMode === "signup" ? "회원가입" : "로그인"}</h2></div>{!isSupabaseConfigured && <div className="config-alert">Supabase 환경변수를 연결하면 실제 접수와 로그인이 작동합니다.</div>}<form onSubmit={submitForm}>
      {formKind === "auth" ? <><Field label="이메일" name="email" type="email" required/><Field label="비밀번호" name="password" type="password" required/>{authMode === "signup" && <><Field label="이름" name="name" required/><Select label="회원 구분" name="member_type" options={["일반회원","사업자회원","픽업 파트너","제조사·광고주"]}/></>}</> : formKind === "advertising" ? <><Field label="회사명" name="company_name" required/><Field label="담당자명" name="contact_name" required/><Field label="연락처" name="phone" type="tel" required/><Select label="문의 구분" name="category" options={["제조사 입점","배너 광고","프랜차이즈","식자재·서비스","기타"]}/><Field label="예상 예산" name="budget"/><Field label="문의 내용" name="inquiry" textarea full required/></> : <><Field label="매장명" name="store_name" required/><Field label="대표자명" name="owner_name" required/><Field label="연락처" name="phone" type="tel" required/><Field label="매장 주소" name="address" required/>{formKind === "partner" ? <><Select label="업종" name="business_type" options={["일반음식점","주점","카페","소매점","신규 오픈 준비","기타"]}/><label className="field full"><span>사업자등록증 <b>*</b></span><div className="file-input"><FileUp/><input name="license" type="file" accept=".pdf,.jpg,.jpeg,.png" required/></div></label><Field label="문의 내용" name="inquiry" textarea full/></> : <><Field label="픽업 가능 시간" name="pickup_hours" required/><Select label="원하는 혜택" name="benefit_interest" options={["신규 고객 방문","매장 홍보","픽업 수익","신제품 우선 공급"]}/></>}</>}
      {notice && <div className={`notice ${notice.type}`}>{notice.text}</div>}<button className="button primary submit-button" disabled={submitting}>{submitting ? "처리 중..." : "신청하기"}</button></form></div></div>}
  </>;
}

function Service({icon,no,title,text,action,onClick}:{icon:React.ReactNode;no:string;title:string;text:string;action:string;onClick:()=>void}) { return <article className="service-card"><div className="icon-box">{icon}</div><span className="card-number">{no}</span><h3>{title}</h3><p>{text}</p><button onClick={onClick}>{action}<ChevronRight/></button></article>; }
function Info({icon,title,text}:{icon:React.ReactNode;title:string;text:string}) { return <article className="info-card"><div>{icon}</div><h3>{title}</h3><p>{text}</p></article>; }
function Field({label,name,type="text",required=false,placeholder,textarea=false,full=false}:{label:string;name:string;type?:string;required?:boolean;placeholder?:string;textarea?:boolean;full?:boolean}) { return <label className={`field ${full ? "full" : ""}`}><span>{label}{required && <b> *</b>}</span>{textarea ? <textarea name={name} required={required} placeholder={placeholder}/> : <input name={name} type={type} required={required} placeholder={placeholder}/>}</label>; }
function Select({label,name,options}:{label:string;name:string;options:string[]}) { return <label className="field"><span>{label}</span><select name={name}>{options.map((o)=><option key={o}>{o}</option>)}</select></label>; }

export default App;
