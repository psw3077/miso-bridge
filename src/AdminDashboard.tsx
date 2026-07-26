import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Cloud, Code2, Database, ExternalLink, FileText, Home, LogIn, LogOut, Phone, RefreshCw, ShieldCheck, Store, Users, Megaphone, MapPin, Search, TableProperties } from "lucide-react";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

type Status = "pending" | "approved" | "hold" | "rejected";
type Tab = "partner" | "pickup" | "advertising";
type TableName = "partner_applications" | "pickup_partner_applications" | "advertising_inquiries";
type Notice = { type: "ok" | "error"; text: string } | null;

type PartnerApplication = {
  id: string; store_name: string; owner_name: string; phone: string; address: string;
  business_type: string; inquiry: string | null; license_path: string; status?: Status; created_at: string;
};
type PickupApplication = {
  id: string; store_name: string; owner_name: string; phone: string; address: string;
  pickup_hours: string | null; benefit_interest: string | null; status?: Status; created_at: string;
};
type AdvertisingInquiry = {
  id: string; company_name: string; contact_name: string; phone: string;
  category: string | null; budget: string | null; inquiry: string | null; status?: Status; created_at: string;
};

const ADMIN_EMAIL = "psw3077@gmail.com";
const SQL_FILE_URL = "https://github.com/psw3077/miso-bridge/blob/main/supabase/admin_setup.sql";
const GITHUB_REPO_URL = "https://github.com/psw3077/miso-bridge";
const SUPABASE_SQL_URL = "https://supabase.com/dashboard/project/uapndiopsckecpysdzuk/sql/new";
const SUPABASE_TABLE_URL = "https://supabase.com/dashboard/project/uapndiopsckecpysdzuk/editor";
const CLOUDFLARE_URL = "https://dash.cloudflare.com/";

export default function AdminDashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [partners, setPartners] = useState<PartnerApplication[]>([]);
  const [pickups, setPickups] = useState<PickupApplication[]>([]);
  const [ads, setAds] = useState<AdvertisingInquiry[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("partner");
  const [searchTerm, setSearchTerm] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      const currentEmail = data.session?.user.email ?? null;
      setSignedInEmail(currentEmail);
      if (currentEmail === ADMIN_EMAIL) void loadAll(); else setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentEmail = session?.user.email ?? null;
      setSignedInEmail(currentEmail);
      if (currentEmail === ADMIN_EMAIL) void loadAll();
      else { setPartners([]); setPickups([]); setAds([]); setLoading(false); }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault(); setNotice(null);
    if (!supabase) return setNotice({ type: "error", text: "Supabase 연결이 필요합니다." });
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) return setNotice({ type: "error", text: "등록된 관리자 이메일만 로그인할 수 있습니다." });
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) { setLoading(false); setNotice({ type: "error", text: error.message }); return; }
    setNotice({ type: "ok", text: "관리자 로그인에 성공했습니다." });
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut();
    setSignedInEmail(null); setPartners([]); setPickups([]); setAds([]);
  }

  async function loadAll() {
    if (!supabase) return;
    setLoading(true); setNotice(null);
    const [partnerResult, pickupResult, adResult] = await Promise.all([
      supabase.from("partner_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("pickup_partner_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("advertising_inquiries").select("*").order("created_at", { ascending: false }),
    ]);
    const errors = [partnerResult.error, pickupResult.error, adResult.error].filter(Boolean);
    if (errors.length) setNotice({ type: "error", text: `일부 목록 조회 실패: ${errors.map((x) => x?.message).join(" / ")}` });
    setPartners((partnerResult.data ?? []) as PartnerApplication[]);
    setPickups((pickupResult.data ?? []) as PickupApplication[]);
    setAds((adResult.data ?? []) as AdvertisingInquiry[]);
    setLoading(false);
  }

  async function openLicense(path: string) {
    if (!supabase) return;
    const { data, error } = await supabase.storage.from("business-licenses").createSignedUrl(path, 300);
    if (error || !data?.signedUrl) return setNotice({ type: "error", text: `사업자등록증 열기 실패: ${error?.message ?? "파일 없음"}` });
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function changeStatus(table: TableName, id: string, status: Status) {
    if (!supabase || savingId) return;
    setNotice(null); setSavingId(id);
    const { data, error } = await supabase.from(table).update({ status }).eq("id", id).select("id, status").maybeSingle();
    if (error) setNotice({ type: "error", text: `상태 변경 실패: ${error.message}` });
    else if (!data) { setNotice({ type: "error", text: "상태가 저장되지 않았습니다. 관리자 수정 권한을 확인해 주세요." }); await loadAll(); }
    else {
      if (table === "partner_applications") setPartners((items) => items.map((item) => item.id === id ? { ...item, status: data.status } : item));
      if (table === "pickup_partner_applications") setPickups((items) => items.map((item) => item.id === id ? { ...item, status: data.status } : item));
      if (table === "advertising_inquiries") setAds((items) => items.map((item) => item.id === id ? { ...item, status: data.status } : item));
      setNotice({ type: "ok", text: "처리 상태가 저장되었습니다." });
    }
    setSavingId(null);
  }

  const statusSelect = (table: TableName, id: string, value?: Status) => (
    <select disabled={savingId === id} value={value ?? "pending"} onChange={(e) => changeStatus(table, id, e.target.value as Status)}>
      <option value="pending">대기</option><option value="approved">승인</option><option value="hold">보류</option><option value="rejected">거절</option>
    </select>
  );

  const q = searchTerm.trim().toLowerCase();
  const filteredPartners = useMemo(() => partners.filter((x) => !q || [x.store_name, x.owner_name, x.phone, x.address, x.business_type, x.inquiry].some((v) => String(v ?? "").toLowerCase().includes(q))), [partners, q]);
  const filteredPickups = useMemo(() => pickups.filter((x) => !q || [x.store_name, x.owner_name, x.phone, x.address, x.pickup_hours, x.benefit_interest].some((v) => String(v ?? "").toLowerCase().includes(q))), [pickups, q]);
  const filteredAds = useMemo(() => ads.filter((x) => !q || [x.company_name, x.contact_name, x.phone, x.category, x.budget, x.inquiry].some((v) => String(v ?? "").toLowerCase().includes(q))), [ads, q]);
  const permissionSetupNeeded = !loading && partners.length > 0 && pickups.length === 0 && ads.length === 0;

  if (!isSupabaseConfigured) return <main className="admin-shell"><section className="admin-login"><ShieldCheck size={42}/><h1>미소브릿지 관리자</h1><p>Cloudflare의 Supabase 환경변수를 먼저 연결해 주세요.</p><a href="/">홈으로 돌아가기</a></section></main>;

  if (signedInEmail !== ADMIN_EMAIL) return <main className="admin-shell"><section className="admin-login"><ShieldCheck size={42}/><span>MISO BRIDGE ADMIN</span><h1>관리자 로그인</h1><p>관리자 이메일은 <b>{ADMIN_EMAIL}</b>입니다.</p><form onSubmit={login}><label>이메일<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={ADMIN_EMAIL}/></label><label>비밀번호<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="비밀번호"/></label>{notice && <div className={`admin-notice ${notice.type}`}>{notice.text}</div>}<button disabled={loading}><LogIn size={18}/>{loading ? "로그인 중..." : "로그인"}</button></form><a href="/">← 미소브릿지 홈</a></section></main>;

  return <main className="admin-page">
    <header className="admin-header"><div><span>MISO BRIDGE</span><h1>관리자 대시보드</h1></div><div className="admin-header-actions"><a className="admin-home-link" href="/"><Home size={17}/>홈페이지</a><button onClick={loadAll}><RefreshCw size={17}/>새로고침</button><button onClick={logout}><LogOut size={17}/>로그아웃</button></div></header>
    {notice && <div className={`admin-notice admin-wide-notice ${notice.type}`}>{notice.text}</div>}

    <section className="admin-quick-tools">
      <div><span>QUICK TOOLS</span><h2>프로그램 바로가기</h2><p>관리 작업에 필요한 프로그램을 새 창으로 바로 엽니다.</p></div>
      <nav>
        <a href={SUPABASE_SQL_URL} target="_blank" rel="noreferrer"><Database/><b>Supabase SQL</b><small>권한 SQL 실행</small><ExternalLink/></a>
        <a href={SUPABASE_TABLE_URL} target="_blank" rel="noreferrer"><TableProperties/><b>Supabase 데이터</b><small>접수 내역 확인</small><ExternalLink/></a>
        <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer"><Code2/><b>GitHub</b><small>홈페이지 코드 관리</small><ExternalLink/></a>
        <a href={CLOUDFLARE_URL} target="_blank" rel="noreferrer"><Cloud/><b>Cloudflare</b><small>배포 상태 확인</small><ExternalLink/></a>
      </nav>
    </section>

    {permissionSetupNeeded && <section className="admin-permission-guide">
      <AlertTriangle size={28}/>
      <div><b>픽업·광고 접수 건이 0으로 보이나요?</b><p>접수 완료 문구가 떴는데 여기에서 0건이면 Supabase 관리자 조회 권한 SQL을 한 번 실행해야 합니다.</p></div>
      <a href={SQL_FILE_URL} target="_blank" rel="noreferrer"><Database size={17}/>권한 SQL 열기</a>
    </section>}

    <section className="admin-stats">
      <article><Store/><div><b>{partners.length}</b><span>신규 거래 신청</span></div></article>
      <article><MapPin/><div><b>{pickups.length}</b><span>픽업 파트너 신청</span></div></article>
      <article><Megaphone/><div><b>{ads.length}</b><span>광고·입점 문의</span></div></article>
      <article><Users/><div><b>{[...partners, ...pickups, ...ads].filter((x) => (x.status ?? "pending") === "pending").length}</b><span>전체 승인 대기</span></div></article>
    </section>

    <section className="admin-toolbar">
      <div className="admin-tabs">
        <button className={activeTab === "partner" ? "active" : ""} onClick={() => setActiveTab("partner")}>신규 거래 <b>{partners.length}</b></button>
        <button className={activeTab === "pickup" ? "active" : ""} onClick={() => setActiveTab("pickup")}>픽업 파트너 <b>{pickups.length}</b></button>
        <button className={activeTab === "advertising" ? "active" : ""} onClick={() => setActiveTab("advertising")}>광고·입점 <b>{ads.length}</b></button>
      </div>
      <label className="admin-search"><Search size={17}/><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="상호·대표자·전화번호·지역 검색"/></label>
    </section>

    {activeTab === "partner" && <section className="admin-panel"><div className="admin-panel-title"><div><span>PARTNER APPLICATIONS</span><h2>신규 거래 신청</h2></div><a href="/">홈페이지 보기</a></div>{loading ? <p className="admin-empty">목록을 불러오는 중입니다.</p> : filteredPartners.length === 0 ? <p className="admin-empty">검색 결과가 없습니다.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>접수일</th><th>매장/대표자</th><th>연락처·주소</th><th>업종</th><th>사업자등록증</th><th>상태</th></tr></thead><tbody>{filteredPartners.map((item) => <tr key={item.id}><td>{new Date(item.created_at).toLocaleString("ko-KR")}</td><td><strong>{item.store_name}</strong><small>{item.owner_name}</small></td><td><a href={`tel:${item.phone}`}><Phone size={14}/>{item.phone}</a><small>{item.address}</small></td><td>{item.business_type}</td><td><button className="document-button" onClick={() => openLicense(item.license_path)}><FileText size={16}/>파일 보기</button></td><td>{statusSelect("partner_applications", item.id, item.status)}</td></tr>)}</tbody></table></div>}</section>}

    {activeTab === "pickup" && <section className="admin-panel"><div className="admin-panel-title"><div><span>PICKUP PARTNERS</span><h2>픽업 파트너 신청</h2></div></div>{loading ? <p className="admin-empty">목록을 불러오는 중입니다.</p> : filteredPickups.length === 0 ? <p className="admin-empty">검색 결과가 없습니다.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>접수일</th><th>매장/대표자</th><th>연락처·주소</th><th>픽업 가능 시간</th><th>관심 혜택</th><th>상태</th></tr></thead><tbody>{filteredPickups.map((item) => <tr key={item.id}><td>{new Date(item.created_at).toLocaleString("ko-KR")}</td><td><strong>{item.store_name}</strong><small>{item.owner_name}</small></td><td><a href={`tel:${item.phone}`}><Phone size={14}/>{item.phone}</a><small>{item.address}</small></td><td>{item.pickup_hours || "-"}</td><td>{item.benefit_interest || "-"}</td><td>{statusSelect("pickup_partner_applications", item.id, item.status)}</td></tr>)}</tbody></table></div>}</section>}

    {activeTab === "advertising" && <section className="admin-panel"><div className="admin-panel-title"><div><span>ADVERTISING INQUIRIES</span><h2>광고·입점 문의</h2></div></div>{loading ? <p className="admin-empty">목록을 불러오는 중입니다.</p> : filteredAds.length === 0 ? <p className="admin-empty">검색 결과가 없습니다.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>접수일</th><th>회사/담당자</th><th>연락처</th><th>분류</th><th>예산</th><th>문의 내용</th><th>상태</th></tr></thead><tbody>{filteredAds.map((item) => <tr key={item.id}><td>{new Date(item.created_at).toLocaleString("ko-KR")}</td><td><strong>{item.company_name}</strong><small>{item.contact_name}</small></td><td><a href={`tel:${item.phone}`}><Phone size={14}/>{item.phone}</a></td><td>{item.category || "-"}</td><td>{item.budget || "-"}</td><td>{item.inquiry || "-"}</td><td>{statusSelect("advertising_inquiries", item.id, item.status)}</td></tr>)}</tbody></table></div>}</section>}
  </main>;
}
