import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import { getCardFunnel, type CardEvent } from "./cardFunnel";
import { getStaffPerformance } from "./cardStaffPerformance";

type Period = 7 | 30 | 0;
type LeadRow = { status?: string | null; source_card?: string | null; source_staff?: string | null; created_at?: string | null };

const PERIOD_LABEL: Record<Period, string> = { 7: "최근 7일", 30: "최근 30일", 0: "전체" };

export default function CardFunnelPanel() {
  const [period, setPeriod] = useState<Period>(30);
  const [events, setEvents] = useState<CardEvent[]>([]);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void load(); }, [period]);

  async function load() {
    if (!supabase) return;
    setLoading(true); setError(null);
    const since = period ? new Date(Date.now() - period * 86400000).toISOString() : null;
    let eventQuery = supabase.from("miso_card_events").select("event_type,card_id,staff_name,created_at").order("created_at", { ascending: false }).limit(5000);
    let leadQuery = supabase.from("partner_applications").select("status,source_card,source_staff,created_at").or("source_card.not.is.null,source_staff.not.is.null");
    if (since) { eventQuery = eventQuery.gte("created_at", since); leadQuery = leadQuery.gte("created_at", since); }
    const [eventResult, leadResult] = await Promise.all([eventQuery, leadQuery]);
    if (eventResult.error || leadResult.error) setError(eventResult.error?.message || leadResult.error?.message || "통계를 불러오지 못했습니다.");
    setEvents((eventResult.data ?? []) as CardEvent[]);
    setLeads((leadResult.data ?? []) as LeadRow[]);
    setLoading(false);
  }

  const stats = useMemo(() => getCardFunnel(events, leads.filter(x => x.status === "approved").length), [events, leads]);
  const staffPerformance = useMemo(() => getStaffPerformance(events, leads), [events, leads]);
  const applications = leads.length;
  const appRate = stats.views ? Math.round(applications / stats.views * 100) : 0;
  const steps = [
    ["명함 조회", stats.views, "100%"],
    ["전화·카톡·문자", stats.contacts, `${stats.contactRate}%`],
    ["신규거래 클릭", stats.leadClicks, `${stats.leadClickRate}%`],
    ["신규거래 신청", applications, `${appRate}%`],
    ["거래 승인", stats.approvedLeads, `${stats.approvalRate}%`],
  ] as const;

  return <section className="admin-panel">
    <div className="admin-panel-title">
      <div><span>MISO CARD FUNNEL</span><h2>전자명함 영업 퍼널</h2><small>명함을 본 사람이 실제 거래로 이어지는 과정을 확인합니다.</small></div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{([7,30,0] as Period[]).map(p => <button key={p} className={period===p?"active":""} onClick={()=>setPeriod(p)}>{PERIOD_LABEL[p]}</button>)}</div>
    </div>
    {error && <div className="admin-notice error">{error}</div>}
    {loading ? <p className="admin-empty">MISO CARD 통계를 불러오는 중입니다.</p> : <>
      <div className="admin-stats">
        <article><div><b>{stats.views}</b><span>명함 조회</span></div></article>
        <article><div><b>{stats.contacts}</b><span>상담 클릭 · {stats.contactRate}%</span></div></article>
        <article><div><b>{applications}</b><span>신규거래 신청 · {appRate}%</span></div></article>
        <article><div><b>{stats.approvedLeads}</b><span>거래 승인 · {stats.approvalRate}%</span></div></article>
      </div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>단계</th><th>건수</th><th>조회 대비</th></tr></thead><tbody>{steps.map(([label,count,rate]) => <tr key={label}><td><strong>{label}</strong></td><td>{count}건</td><td>{rate}</td></tr>)}</tbody></table></div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}><small>연락처 저장 {stats.saves}건</small><small>공유·링크복사·QR {stats.shares}건</small><small>기간: {PERIOD_LABEL[period]}</small></div>

      <div className="admin-panel-title" style={{marginTop:24}}><div><span>MISO CARD PERFORMANCE</span><h2>직원별 영업성과</h2><small>조회수가 아니라 실제 신청·승인 성과까지 비교합니다.</small></div></div>
      {staffPerformance.length === 0 ? <p className="admin-empty">직원별 비교 데이터가 아직 없습니다.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>순위</th><th>담당자/명함</th><th>조회</th><th>상담</th><th>상담률</th><th>신규거래 클릭</th><th>신청</th><th>신청률</th><th>승인</th><th>승인율</th></tr></thead><tbody>{staffPerformance.map((x,i)=><tr key={x.name}><td>{i+1}</td><td><strong>{x.name}</strong></td><td>{x.views}</td><td>{x.contacts}</td><td>{x.contactRate}%</td><td>{x.leadClicks}</td><td>{x.applications}</td><td>{x.applicationRate}%</td><td><strong>{x.approved}</strong></td><td>{x.approvalRate}%</td></tr>)}</tbody></table></div>}

      {stats.views===0 && <p className="admin-empty">아직 실제 사용 데이터가 없습니다. 배포 후 명함이 열리고 버튼이 눌리면 자동 집계됩니다.</p>}
    </>}
  </section>;
}
