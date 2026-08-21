import { CreditCard, ExternalLink, QrCode } from "lucide-react";

export default function CardAdminTools(){
 return <section className="admin-quick-tools"><div><span>MISO CARD TOOLS</span><h2>전자명함 관리</h2><p>직원 전자명함 주소와 QR을 만들고 실제 명함을 바로 확인합니다.</p></div><nav><a href="/card-pro/team/generator/" target="_blank" rel="noreferrer"><QrCode/><b>직원명함 생성</b><small>직원별 URL · QR 만들기</small><ExternalLink/></a><a href="/card-pro/" target="_blank" rel="noreferrer"><CreditCard/><b>대표 전자명함</b><small>박상욱 대표 명함 확인</small><ExternalLink/></a><a href="/card-pro/team/" target="_blank" rel="noreferrer"><CreditCard/><b>직원명함 샘플</b><small>직원용 디자인 확인</small><ExternalLink/></a></nav></section>;
}