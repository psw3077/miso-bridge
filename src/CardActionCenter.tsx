import { useMemo } from 'react';
import type { CardEvent } from './cardFunnel';
import { getStaffPerformance, type StaffLead } from './cardStaffPerformance';

type Props={events:CardEvent[];leads:StaffLead[]};
export default function CardActionCenter({events,leads}:Props){
 const staff=useMemo(()=>getStaffPerformance(events,leads),[events,leads]);
 const views=events.filter(x=>x.event_type==='view').length;
 const contacts=events.filter(x=>['phone','kakao','sms'].includes(x.event_type)).length;
 const newClicks=events.filter(x=>x.event_type==='new_partner').length;
 const contactRate=views?Math.round(contacts/views*100):0;
 const appRate=views?Math.round(leads.length/views*100):0;
 const approved=leads.filter(x=>x.status==='approved').length;
 const actions:{priority:string;title:string;detail:string;copy?:string}[]=[];
 if(views<30)actions.push({priority:'1순위',title:'전자명함 노출부터 늘리기',detail:'아직 판단할 데이터가 적습니다. 카카오톡·문자·QR·종이명함에 MISO CARD를 적극 사용하세요.',copy:'주식회사 미소주류 박상욱 대표 전자명함입니다. 주류 납품·신규거래·창업상담이 필요하시면 아래에서 바로 연락주세요.'});
 else if(contactRate<10)actions.push({priority:'1순위',title:'상담 버튼 문구 강화',detail:`조회 대비 상담 클릭률이 ${contactRate}%입니다. 첫 화면에서 전화·카카오톡을 더 강하게 보여주는 것이 좋습니다.`,copy:'주류 납품 견적이 필요하신가요? 전화 또는 카카오톡으로 바로 상담하세요.'});
 if(newClicks>0&&leads.length/newClicks<0.35)actions.push({priority:'2순위',title:'신규거래 신청 단계 줄이기',detail:'신규거래 버튼 클릭 후 실제 신청 이탈이 큽니다. 처음에는 상호·지역·연락처만 받고 나머지는 상담 중 확인하는 방식을 추천합니다.'});
 if(views>=30&&appRate<3)actions.push({priority:'2순위',title:'신규거래 혜택을 더 명확하게',detail:`현재 조회 대비 신청률은 ${appRate}%입니다. 공급 가능 지역·취급주류·상담 장점을 버튼 바로 아래에서 보여주세요.`});
 const best=staff.filter(x=>x.views>=10).sort((a,b)=>b.approvalRate-a.approvalRate)[0];
 if(best&&best.approved>0)actions.push({priority:'확대',title:`${best.name} 성공 패턴 공유`,detail:`승인 ${best.approved}건, 조회 대비 승인율 ${best.approvalRate}%입니다. 이 담당자의 명함 공유 대상·첫 상담 방식·후속 연락 방식을 팀 표준으로 정리해보세요.`});
 if(approved>0)actions.push({priority:'관리',title:'승인 이후 실제 거래까지 추적',detail:'승인 건을 끝으로 보지 말고 첫 주문·30일 재주문까지 연결하면 MISO CARD의 실제 매출 기여도를 판단할 수 있습니다.'});
 const copy=async(t:string)=>{try{await navigator.clipboard.writeText(t);alert('문구를 복사했습니다.')}catch{prompt('아래 문구를 복사하세요.',t)}};
 if(!actions.length)return null;
 return <section className="admin-panel"><div className="admin-panel-title"><div><span>MISO CARD ACTION CENTER</span><h2>지금 실행할 영업 액션</h2><small>현재 데이터에서 우선 실행할 일을 바로 보여줍니다.</small></div></div><div style={{display:'grid',gap:10}}>{actions.map((a,i)=><article key={i} style={{padding:16,border:'1px solid #e3e9ef',borderRadius:14}}><small>{a.priority}</small><h3 style={{margin:'5px 0'}}>{a.title}</h3><p style={{margin:'0 0 9px',lineHeight:1.6}}>{a.detail}</p>{a.copy&&<button onClick={()=>copy(a.copy!)}>추천 공유문구 복사</button>}</article>)}</div></section>;
}