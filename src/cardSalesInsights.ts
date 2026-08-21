export type InsightLevel = "good" | "watch" | "action";
export type SalesInsight = { level: InsightLevel; title: string; message: string; action: string };

export function getSalesInsights(input:{views:number;contacts:number;contactRate:number;leadClicks:number;applications:number;approved:number;approvalRate:number;saves:number;shares:number;topStaff?:{name:string;approvalRate:number;approved:number}|null}){
 const {views,contacts,contactRate,leadClicks,applications,approved,approvalRate,saves,shares,topStaff}=input;
 const insights:SalesInsight[]=[];
 if(views<20){insights.push({level:"watch",title:"먼저 명함 노출을 늘릴 단계입니다",message:`현재 조회 ${views}건으로 전환율을 판단하기엔 표본이 적습니다.`,action:"대표·직원 QR을 문자, 카카오톡, 종이명함, 견적서에 적극 노출하세요."});}
 else if(contactRate<8){insights.push({level:"action",title:"상담 버튼 반응이 낮습니다",message:`조회 ${views}건 중 상담 클릭 ${contacts}건, 상담률 ${contactRate}%입니다.`,action:"첫 화면에서 전화·카카오톡 버튼을 더 크게 하고 '업소용 주류 빠른 견적' 같은 즉시 이익 문구를 테스트하세요."});}
 else if(contactRate>=15){insights.push({level:"good",title:"상담 유입이 좋습니다",message:`상담 클릭률이 ${contactRate}%로 반응이 좋습니다.`,action:"현재 첫 화면과 상담 버튼 구조를 유지하고 신규거래 신청 전환을 집중 개선하세요."});}
 if(views>=20&&leadClicks/Math.max(views,1)<0.04){insights.push({level:"action",title:"신규거래 버튼 전환을 개선할 필요가 있습니다",message:`명함 조회 대비 신규거래 클릭이 ${Math.round(leadClicks/Math.max(views,1)*100)}%입니다.`,action:"'신규 주류거래 시작하기' 옆에 납품지역·빠른상담·취급주류 혜택을 짧게 표시하세요."});}
 if(leadClicks>=5&&applications/Math.max(leadClicks,1)<0.35){insights.push({level:"action",title:"신청서 이탈 가능성이 있습니다",message:`신규거래 클릭 ${leadClicks}건 중 실제 신청 ${applications}건입니다.`,action:"신청 첫 단계 항목을 상호·지역·전화번호 정도로 줄이고 상세정보는 상담 후 받는 2단계 방식이 좋습니다."});}
 if(applications>=3&&approved/applications<0.35){insights.push({level:"watch",title:"신청은 들어오지만 승인 전환이 낮습니다",message:`신청 ${applications}건 중 승인 ${approved}건입니다.`,action:"유입 지역·업종·희망제품을 함께 분석해 미소주류가 실제 공급하기 좋은 고객을 명함 문구에서 더 선별하세요."});}
 if(approvalRate>=2&&approved>0){insights.push({level:"good",title:"실제 거래 전환이 발생하고 있습니다",message:`조회 대비 승인율 ${approvalRate}%, 승인 ${approved}건입니다.`,action:"성과가 좋은 명함의 문구와 공유 방식을 직원 명함에도 동일하게 적용하세요."});}
 if(shares<Math.max(1,Math.round(views*0.02))&&views>=30){insights.push({level:"watch",title:"명함 재공유가 적습니다",message:`조회 ${views}건 대비 공유·링크복사·QR 사용 ${shares}건입니다.`,action:"'사장님께 이 명함 보내기'처럼 공유 목적을 명확하게 보여주는 버튼 문구를 테스트하세요."});}
 if(saves>0){insights.push({level:"good",title:"연락처 저장이 발생했습니다",message:`연락처 저장 ${saves}건이 확인됩니다.`,action:"저장 후에도 다시 찾기 쉽도록 연락처 메모에 '미소주류 신규거래·주류상담'을 유지하세요."});}
 if(topStaff&&topStaff.approved>0){insights.push({level:"good",title:`이번 기간 우수 전환: ${topStaff.name}`,message:`승인 ${topStaff.approved}건, 조회 대비 승인율 ${topStaff.approvalRate}%입니다.`,action:"이 담당자의 명함 공유 상황과 상담 응대 방식을 다른 직원에게도 표준화하세요."});}
 return insights.slice(0,5);
}
