import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import type { CardEvent } from "./cardFunnel";
import { getStaffPerformance, type StaffLead } from "./cardStaffPerformance";

type Range = 3 | 6;
type Lead = StaffLead & { created_at?: string | null };

function monthKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`; }
function monthLabel(key: string) { const [y,m]=key.split('-'); return `${Number(y)}년 ${Number(m)}월`; }
function monthKeys(n: number) { const now=new Date(); const out:string[]=[]; for(let i=n-1;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);out.push(monthKey(d));} return out; }

export default function CardLongTermPerformance(){
  const [range,setRange]=useState<Range>(6);
  const [events,setEvents]=useState<CardEvent[]>([]);
  const [leads,setLeads]=useState<Lead[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);

  useEffect(()=>{void load();},[]);
  async function load(){
    if(!supabase)return;
    setLoading(true);setError(null);
    const since=new Date(); since.setMonth(since.getMonth()-6); since.setDate(1); since.setHours(0,0,0,0);
    const [e,l]=await Promise.all([
      supabase.from('miso_card_events').select('event_type,card_id,staff_name,created_at').gte('created_at',since.toISOString()).order('created_at',{ascending:true}).limit(10000),
      supabase.from('partner_applications').select('status,source_card,source_staff,created_at').or('source_card.not.is.null,source_staff.not.is.null').gte('created_at',since.toISOString()).order('created_at',{ascending:true})
    ]);
    if(e.error||l.error)setError(e.error?.message||l.error?.message||'장기 추세를 불러오지 못했습니다.');
    setEvents((e.data??[]) as CardEvent[]); setLeads((l.data??[]) as Lead[]); setLoading(false);
  }

  const months=useMemo(()=>monthKeys(range),[range]);
  const monthly=useMemo(()=>months.map(key=>{
    const ev=events.filter(x=>x.created_at&&monthKey(new Date(x.created_at))===key);
    const ls=leads.filter(x=>x.created_at&&monthKey(new Date(x.created_at))===key);
    const views=ev.filter(x=>x.event_type==='view').length;
    const contacts=ev.filter(x=>['phone','kakao','sms'].includes(x.event_type)).length;
    const applications=ls.length;
    const approved=ls.filter(x=>x.status==='approved').length;
    return{key,views,contacts,applications,approved,contactRate:views?Math.round(contacts/views*100):0,applicationRate:views?Math.round(applications/views*100):0,approvalRate:views?Math.round(approved/views*100):0};
  }),[months,events,leads]);

  const currentMonth=months[months.length-1];
  const prevMonth=months[months.length-2];
  const currentEvents=events.filter(x=>x.created_at&&monthKey(new Date(x.created_at))===currentMonth);
  const currentLeads=leads.filter(x=>x.created_at&&monthKey(new Date(x.created_at))===currentMonth);
  const prevEvents=events.filter(x=>x.created_at&&monthKey(new Date(x.created_at))===prevMonth);
  const prevLeads=leads.filter(x=>x.created_at&&monthKey(new Date(x.created_at))===prevMonth);
  const currentStaff=getStaffPerformance(currentEvents,currentLeads);
  const prevStaff=getStaffPerformance(prevEvents,prevLeads);
  const best=currentStaff.filter(x=>x.views>=3||x.applications>0).sort((a,b)=>b.approvalRate-a.approvalRate||b.approved-a.approved||b.applicationRate-a.applicationRate)[0];
  const needs=currentStaff.filter(x=>x.views>=5).sort((a,b)=>a.applicationRate-b.applicationRate||a.contactRate-b.contactRate)[0];
  const staffGrowth=currentStaff.map(x=>{const p=prevStaff.find(y=>y.name===x.name);return{...x,prevApplications:p?.applications??0,prevApproved:p?.approved??0,applicationDelta:x.applications-(p?.applications??0),approvedDelta:x.approved-(p?.approved??0)}}).sort((a,b)=>b.applicationDelta-a.applicationDelta||b.approvedDelta-a.approvedDelta);
  const maxViews=Math.max(1,...monthly.map(x=>x.views));

  return <section className="admin-panel">
    <div className="admin-panel-title"><div><span>MISO CARD TREND</span><h2>장기 영업 추세</h2><small>3개월·6개월 흐름과 직원별 성장세를 함께 봅니다.</small></div><div style={{display:'flex',gap:6}}>{([3,6] as Range[]).map(n=><button key={n} className={range===n?'active':''} onClick={()=>setRange(n)}>{n}개월</button>)}</div></div>
    {error&&<div className="admin-notice error">{error}</div>}
    {loading?<p className="admin-empty">장기 추세를 불러오는 중입니다.</p>:<>
      <div className="admin-stats">
        <article><div><b>{monthly.reduce((s,x)=>s+x.views,0)}</b><span>{range}개월 조회</span></div></article>
        <article><div><b>{monthly.reduce((s,x)=>s+x.applications,0)}</b><span>{range}개월 신규거래 신청</span></div></article>
        <article><div><b>{monthly.reduce((s,x)=>s+x.approved,0)}</b><span>{range}개월 승인</span></div></article>
        <article><div><b>{best?.name??'-'}</b><span>이번 달 최고 전환</span></div></article>
      </div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>월</th><th>조회</th><th>상담</th><th>신청</th><th>승인</th><th>신청률</th><th>승인율</th><th>조회 추이</th></tr></thead><tbody>{monthly.map(x=><tr key={x.key}><td><strong>{monthLabel(x.key)}</strong></td><td>{x.views}</td><td>{x.contacts}</td><td>{x.applications}</td><td>{x.approved}</td><td>{x.applicationRate}%</td><td>{x.approvalRate}%</td><td><div style={{minWidth:110,height:8,background:'#e9eef3',borderRadius:999,overflow:'hidden'}}><div style={{width:`${Math.max(2,Math.round(x.views/maxViews*100))}%`,height:'100%',background:'#0b4b7d'}}/></div></td></tr>)}</tbody></table></div>
      <div className="admin-stats" style={{marginTop:14}}>
        <article><div><b>{best?.name??'-'}</b><span>우수 직원 · 승인율 {best?.approvalRate??0}%</span></div></article>
        <article><div><b>{needs?.name??'-'}</b><span>개선 필요 · 신청률 {needs?.applicationRate??0}%</span></div></article>
      </div>
      {staffGrowth.length>0&&<><h3 style={{marginTop:22}}>직원별 전월 대비 성장</h3><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>담당자</th><th>이번달 신청</th><th>전월 신청</th><th>증감</th><th>이번달 승인</th><th>전월 승인</th><th>승인 증감</th></tr></thead><tbody>{staffGrowth.map(x=><tr key={x.name}><td><strong>{x.name}</strong></td><td>{x.applications}</td><td>{x.prevApplications}</td><td>{x.applicationDelta>0?`+${x.applicationDelta}`:x.applicationDelta}</td><td>{x.approved}</td><td>{x.prevApproved}</td><td>{x.approvedDelta>0?`+${x.approvedDelta}`:x.approvedDelta}</td></tr>)}</tbody></table></div></>}
      {monthly.every(x=>x.views===0&&x.applications===0)&&<p className="admin-empty">장기 비교에 사용할 실제 데이터가 아직 없습니다.</p>}
    </>}
  </section>;
}
