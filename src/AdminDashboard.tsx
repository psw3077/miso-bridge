import { FormEvent, useEffect, useState } from "react";
import { FileText, LogIn, LogOut, Phone, RefreshCw, ShieldCheck, Store, Users } from "lucide-react";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

type Application = {
  id: string;
  store_name: string;
  owner_name: string;
  phone: string;
  address: string;
  business_type: string;
  inquiry: string | null;
  license_path: string;
  status?: string;
  created_at: string;
};

type Notice = { type: "ok" | "error"; text: string } | null;

const ADMIN_EMAIL = "psw3077@gmail.com";

export default function AdminDashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      const currentEmail = data.session?.user.email ?? null;
      setSignedInEmail(currentEmail);
      if (currentEmail === ADMIN_EMAIL) void loadApplications();
      else setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentEmail = session?.user.email ?? null;
      setSignedInEmail(currentEmail);
      if (currentEmail === ADMIN_EMAIL) void loadApplications();
      else {
        setApplications([]);
        setLoading(false);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    setNotice(null);
    if (!supabase) return setNotice({ type: "error", text: "Supabase 연결이 필요합니다." });
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      return setNotice({ type: "error", text: "등록된 관리자 이메일만 로그인할 수 있습니다." });
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setLoading(false);
      setNotice({ type: "error", text: error.message });
      return;
    }
    setNotice({ type: "ok", text: "관리자 로그인에 성공했습니다." });
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut();
    setSignedInEmail(null);
    setApplications([]);
  }

  async function loadApplications() {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("partner_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setNotice({ type: "error", text: `신청 목록 조회 실패: ${error.message}` });
    else setApplications((data ?? []) as Application[]);
    setLoading(false);
  }

  async function openLicense(path: string) {
    if (!supabase) return;
    const { data, error } = await supabase.storage.from("business-licenses").createSignedUrl(path, 300);
    if (error || !data?.signedUrl) {
      setNotice({ type: "error", text: `사업자등록증 열기 실패: ${error?.message ?? "파일 없음"}` });
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function changeStatus(id: string, status: string) {
    if (!supabase || savingId) return;
    setNotice(null);
    setSavingId(id);

    const { data, error } = await supabase
      .from("partner_applications")
      .update({ status })
      .eq("id", id)
      .select("id, status")
      .maybeSingle();

    if (error) {
      setNotice({ type: "error", text: `상태 변경 실패: ${error.message}` });
    } else if (!data) {
      setNotice({ type: "error", text: "상태가 저장되지 않았습니다. 관리자 수정 권한을 다시 확인해 주세요." });
      await loadApplications();
    } else {
      setApplications((items) => items.map((item) => item.id === id ? { ...item, status: data.status } : item));
      setNotice({ type: "ok", text: "처리 상태가 저장되었습니다." });
    }

    setSavingId(null);
  }

  if (!isSupabaseConfigured) {
    return <main className="admin-shell"><section className="admin-login"><ShieldCheck size={42}/><h1>미소브릿지 관리자</h1><p>Cloudflare의 Supabase 환경변수를 먼저 연결해 주세요.</p><a href="/">홈으로 돌아가기</a></section></main>;
  }

  if (signedInEmail !== ADMIN_EMAIL) {
    return <main className="admin-shell">
      <section className="admin-login">
        <ShieldCheck size={42}/><span>MISO BRIDGE ADMIN</span><h1>관리자 로그인</h1>
        <p>관리자 이메일은 <b>{ADMIN_EMAIL}</b>입니다. 비밀번호는 Supabase 회원가입 때 직접 설정한 비밀번호를 사용합니다.</p>
        <form onSubmit={login}>
          <label>이메일<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={ADMIN_EMAIL}/></label>
          <label>비밀번호<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="비밀번호"/></label>
          {notice && <div className={`admin-notice ${notice.type}`}>{notice.text}</div>}
          <button disabled={loading}><LogIn size={18}/>{loading ? "로그인 중..." : "로그인"}</button>
        </form>
        <a href="/">← 미소브릿지 홈</a>
      </section>
    </main>;
  }

  return <main className="admin-page">
    <header className="admin-header"><div><span>MISO BRIDGE</span><h1>관리자 대시보드</h1></div><div className="admin-header-actions"><button onClick={loadApplications}><RefreshCw size={17}/>새로고침</button><button onClick={logout}><LogOut size={17}/>로그아웃</button></div></header>
    {notice && <div className={`admin-notice ${notice.type}`}>{notice.text}</div>}
    <section className="admin-stats">
      <article><Store/><div><b>{applications.length}</b><span>전체 거래 신청</span></div></article>
      <article><Users/><div><b>{applications.filter((x) => (x.status ?? "pending") === "pending").length}</b><span>승인 대기</span></div></article>
      <article><ShieldCheck/><div><b>{applications.filter((x) => x.status === "approved").length}</b><span>승인 완료</span></div></article>
    </section>
    <section className="admin-panel">
      <div className="admin-panel-title"><div><span>PARTNER APPLICATIONS</span><h2>신규 거래 신청</h2></div><a href="/">홈페이지 보기</a></div>
      {loading ? <p className="admin-empty">신청 목록을 불러오는 중입니다.</p> : applications.length === 0 ? <p className="admin-empty">접수된 신청이 없습니다. 신청 후 보이지 않으면 관리자 조회 정책 SQL을 실행해야 합니다.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>접수일</th><th>매장/대표자</th><th>연락처·주소</th><th>업종</th><th>사업자등록증</th><th>상태</th></tr></thead><tbody>{applications.map((item) => <tr key={item.id}>
        <td>{new Date(item.created_at).toLocaleString("ko-KR")}</td>
        <td><strong>{item.store_name}</strong><small>{item.owner_name}</small></td>
        <td><a href={`tel:${item.phone}`}><Phone size={14}/>{item.phone}</a><small>{item.address}</small></td>
        <td>{item.business_type}</td>
        <td><button className="document-button" onClick={() => openLicense(item.license_path)}><FileText size={16}/>파일 보기</button></td>
        <td><select disabled={savingId === item.id} value={item.status ?? "pending"} onChange={(e) => changeStatus(item.id, e.target.value)}><option value="pending">대기</option><option value="approved">승인</option><option value="hold">보류</option><option value="rejected">거절</option></select></td>
      </tr>)}</tbody></table></div>}
    </section>
  </main>;
}
