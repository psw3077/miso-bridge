import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

type ContractType = "trade" | "employment" | "special";
type ContractStatus = "draft" | "sent" | "signed" | "completed" | "cancelled";

type FormState = {
  contractType: ContractType;
  partyName: string;
  phone: string;
  address: string;
  businessNumber: string;
  notes: string;
};

type PublicContract = {
  id: string;
  contract_type: ContractType;
  party_name: string;
  phone: string;
  address: string | null;
  business_number: string | null;
  notes: string | null;
  document_text: string | null;
  status: ContractStatus;
  signed_at: string | null;
  created_at: string;
  updated_at: string;
};

const specialAgreement = `별지서식 제13호\n근로시간 특례 합의서\n‘(주)00주류회사 대표 ’ __________ 와 동 근로자대표 __________ 는 근로기준법 제 58조 제1항의 근로시간 계산의 특례에 의해 사업장 밖 근로를 시키는 경우의 근로시간 산정에 관하여 다음과 같이 합의한다.\n\n제1조 [목적] 이 합의서는 1주 52시간의 범위내에서 사업장 밖에서 근로를 하는 근로자에 대한 근로시간을 산정하는데 그 목적이 있다. 다만 위 52시간은 최장 한도로서 각 근로자의 근로계약서에서 정한 시간을 우선 적용한다.\n\n제2조 [대상의 범위] 이 합의서는 당 사업장의 근로자로서 근무시간의 상당부분을 사업장 밖의 업무에 종사하는 근로자에게 적용한다.\n\n제3조 [사업장 밖 근로 ] 제2조에 정한 직원이 통상 근로시간의 전부 또는 일부를 사업장 밖에서 업무에 종사하며, 이러한 사업장 밖 업무에 대해 회사는 업무의 수행수단 및 시간 배분에 관해 근로자에게 구체적 지시를 하지 아니한다.\n\n제4조 [휴게시간] 제2조와 제3조의 적용을 받는 직원에 대해 취업규칙에서 정한 휴게시간도 적용한다. 다만 사업장 밖의 근로시간에 해당하는 경우에는 해당 근로자가 자율적으로 휴게시간을 행사한다.\n\n제5조 [근로시간특례] 1주 52시간까지 근로가 가능한 대상근로자의 범위는 위 제 2조에 정한 직종의 근로자에게 적용하나, 구체적 연장시간은 각 개별근로자의 근로계약서를 우선한다.\n\n제6조 [근로시간특례의 사유 및 기간 ] 제2조에 정한 직원의 주 52시간의 근무는 사업장 밖 근로에 대한 근로시간 산정이 어려운 경우에 해당하여 본 특례사항을 시행한다.\n\n제7조 [시행일] 이 합의서의 유효기간은 20____년 ____월 ____일 부터 1년으로 하되, 유효기간 만료 1개월 전까지 개정 관련 별도 의견이 없는 경우에는 동일 내용으로 재연장 될 것으로 본다.\n\n20_____ 년 _____ 월 _____ 일\n사 용 자 : ____________________ (서명 또는 날인)\n근로자대표 : ____________________ (서명 또는 날인)`;

function SignatureBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    drawing.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const p = point(e);
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    e.preventDefault();
    const p = point(e);
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f2a4a";
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (ref.current) onChange(ref.current.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return <div className="miso-signature-box">
    <div className="miso-contract-row"><strong>전자서명</strong><button type="button" onClick={clear}>지우기</button></div>
    <canvas ref={ref} width={900} height={280} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end} onPointerCancel={end} style={{ width: "100%", height: 150, touchAction: "none", border: "1px dashed #94a3b8", borderRadius: 12, background: "white" }} />
    {value && <small>서명이 입력되었습니다.</small>}
  </div>;
}

function PublicSigning({ token }: { token: string }) {
  const [contract, setContract] = useState<PublicContract | null>(null);
  const [signature, setSignature] = useState("");
  const [status, setStatus] = useState("계약서를 불러오는 중입니다.");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!supabase) return setStatus("서버 연결 설정이 필요합니다.");
      const result = await supabase.rpc("get_miso_contract_by_token", { p_token: token });
      if (!active) return;
      if (result.error) return setStatus(`계약서 조회 오류: ${result.error.message}`);
      const row = Array.isArray(result.data) ? result.data[0] : result.data;
      if (!row) return setStatus("유효하지 않거나 종료된 계약 링크입니다.");
      setContract(row as PublicContract);
      setStatus("");
    })();
    return () => { active = false; };
  }, [token]);

  async function sign() {
    if (!supabase || !contract) return;
    if (!signature) return setStatus("서명을 먼저 입력해 주세요.");
    setBusy(true);
    setStatus("");
    const result = await supabase.rpc("sign_miso_contract_by_token", { p_token: token, p_signature: signature });
    setBusy(false);
    if (result.error) return setStatus(`서명 오류: ${result.error.message}`);
    const row = Array.isArray(result.data) ? result.data[0] : result.data;
    setContract({ ...contract, status: "signed", signed_at: row?.signed_at ?? new Date().toISOString() });
    setStatus("서명이 정상적으로 완료되었습니다. 창을 닫으셔도 됩니다.");
  }

  const title = contract?.contract_type === "trade" ? "거래처 전자계약" : contract?.contract_type === "employment" ? "근로계약서" : "근로시간 특례 합의서";

  return <main className="miso-contract-shell">
    <section className="miso-contract-card">
      <div className="miso-contract-heading"><span>MISO ONE</span><h1>{title || "전자계약 서명"}</h1><p>내용을 확인한 뒤 아래에 서명해 주세요.</p></div>
      <div className="miso-contract-form">
        {contract && <>
          <label>이름 / 거래처명<input value={contract.party_name} readOnly /></label>
          <label>전화번호<input value={contract.phone} readOnly /></label>
          {contract.address && <label>주소<input value={contract.address} readOnly /></label>}
          {contract.business_number && <label>사업자번호<input value={contract.business_number} readOnly /></label>}
          {contract.notes && <label>메모<textarea value={contract.notes} readOnly rows={4} /></label>}
          {contract.document_text && <article className="miso-contract-document"><pre>{contract.document_text}</pre></article>}
          {contract.status === "signed" ? <p className="miso-contract-status">서명 완료{contract.signed_at ? ` · ${new Date(contract.signed_at).toLocaleString("ko-KR")}` : ""}</p> : <>
            <SignatureBox value={signature} onChange={setSignature} />
            <div className="miso-contract-actions"><button type="button" disabled={busy} onClick={sign}>{busy ? "서명 저장 중…" : "동의하고 서명 완료"}</button><button type="button" onClick={() => window.print()}>인쇄 / PDF</button></div>
          </>}
        </>}
        {status && <p className="miso-contract-status">{status}</p>}
      </div>
    </section>
  </main>;
}

export default function ContractCenter() {
  const token = new URLSearchParams(window.location.search).get("contract");
  const [form, setForm] = useState<FormState>({ contractType: "trade", partyName: "", phone: "", address: "", businessNumber: "", notes: "" });
  const [signature, setSignature] = useState("");
  const [status, setStatus] = useState("");
  const [shareToken, setShareToken] = useState("");
  const [remoteStatus, setRemoteStatus] = useState<ContractStatus | "">("");

  useEffect(() => {
    if (!shareToken || !supabase) return;
    const check = async () => {
      const result = await supabase!.rpc("get_miso_contract_by_token", { p_token: shareToken });
      const row = Array.isArray(result.data) ? result.data[0] : result.data;
      if (!result.error && row?.status) setRemoteStatus(row.status as ContractStatus);
    };
    check();
    const timer = window.setInterval(check, 5000);
    return () => window.clearInterval(timer);
  }, [shareToken]);

  if (token) return <PublicSigning token={token} />;

  const title = useMemo(() => form.contractType === "trade" ? "거래처 전자계약" : form.contractType === "employment" ? "근로계약서" : "근로시간 특례 합의서", [form.contractType]);

  async function save(e: FormEvent) {
    e.preventDefault();
    setStatus("");
    if (!form.partyName || !form.phone) return setStatus("이름과 전화번호를 입력해 주세요.");
    if (!supabase) return setStatus("Supabase 환경변수 설정이 필요합니다.");

    const publicToken = crypto.randomUUID();
    const result = await supabase.from("miso_contracts").insert({
      contract_type: form.contractType,
      party_name: form.partyName,
      phone: form.phone,
      address: form.address || null,
      business_number: form.businessNumber || null,
      notes: form.notes || null,
      signature_data: signature || null,
      public_token: publicToken,
      status: signature ? "signed" : "sent",
      document_text: form.contractType === "special" ? specialAgreement : null,
      signed_at: signature ? new Date().toISOString() : null,
    }).select("id, public_token, status").single();

    if (result.error) return setStatus(`저장 오류: ${result.error.message}`);
    const shareUrl = `${window.location.origin}/?contracts=1&contract=${result.data.public_token}`;
    setShareToken(result.data.public_token);
    setRemoteStatus(result.data.status as ContractStatus);
    await navigator.clipboard?.writeText(shareUrl).catch(() => undefined);
    setStatus(`저장 완료. 서명 링크가 복사되었습니다: ${shareUrl}`);
  }

  return <main className="miso-contract-shell">
    <section className="miso-contract-card">
      <div className="miso-contract-heading">
        <span>MISO ONE</span><h1>{title}</h1><p>PC에서 작성하고 휴대폰에서 서명할 수 있도록 만든 전자계약 모듈입니다.</p>
      </div>
      <div className="miso-contract-tabs">
        <button className={form.contractType === "trade" ? "active" : ""} onClick={() => setForm({ ...form, contractType: "trade" })}>거래처 전자계약</button>
        <button className={form.contractType === "employment" ? "active" : ""} onClick={() => setForm({ ...form, contractType: "employment" })}>근로계약서</button>
        <button className={form.contractType === "special" ? "active" : ""} onClick={() => setForm({ ...form, contractType: "special" })}>근로시간 특례 합의서</button>
      </div>
      <form onSubmit={save} className="miso-contract-form">
        <label>이름 / 거래처명<input value={form.partyName} onChange={(e) => setForm({ ...form, partyName: e.target.value })} required /></label>
        <label>전화번호<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></label>
        <label>주소<input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
        {form.contractType === "trade" && <label>사업자번호<input value={form.businessNumber} onChange={(e) => setForm({ ...form, businessNumber: e.target.value })} /></label>}
        <label>메모<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} /></label>
        {form.contractType === "special" && <article className="miso-contract-document"><pre>{specialAgreement}</pre></article>}
        <SignatureBox value={signature} onChange={setSignature} />
        <div className="miso-contract-actions"><button type="submit">저장하고 서명 링크 만들기</button><button type="button" onClick={() => window.print()}>인쇄 / PDF</button></div>
        {shareToken && <p className="miso-contract-status">상대방 진행 상태: {remoteStatus || "확인 중"}{remoteStatus === "signed" ? " · 서명 완료" : ""}</p>}
        {status && <p className="miso-contract-status">{status}</p>}
      </form>
    </section>
  </main>;
}
