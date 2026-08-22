import type { CardEvent } from "./cardFunnel";

type Lead = {
  source_staff?: string | null;
  source_card?: string | null;
  created_at?: string | null;
};

type Props = {
  events: CardEvent[];
  leads: Lead[];
  loading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
};

function latestActivity(events: CardEvent[], leads: Lead[]) {
  const timestamps = [...events, ...leads]
    .map((row) => row.created_at)
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value))
    .filter((value) => !Number.isNaN(value.getTime()))
    .sort((a, b) => b.getTime() - a.getTime());

  return timestamps[0] ?? null;
}

export default function CardDataStatus({ events, leads, loading, error, onRefresh }: Props) {
  const hasData = events.length > 0 || leads.length > 0;
  const staffCount = new Set([
    ...events.map((row) => row.staff_name || row.card_id).filter(Boolean),
    ...leads.map((row) => row.source_staff || row.source_card).filter(Boolean),
  ]).size;
  const latest = latestActivity(events, leads);
  const status = loading
    ? "연결 확인 중"
    : error
      ? "수집 상태 확인 필요"
      : hasData
        ? "실데이터 수집 중"
        : "연결 정상 · 실데이터 대기";

  return (
    <section style={{ marginTop: 24 }}>
      <div className="admin-panel-title">
        <div>
          <span>DATA READINESS</span>
          <h3>실데이터 수집 상태</h3>
          <small>가짜 데이터 없이 실제 명함 활동과 신규거래 신청만 집계합니다.</small>
        </div>
        <button disabled={loading} onClick={() => void onRefresh()}>
          {loading ? "확인 중" : "지금 새로고침"}
        </button>
      </div>

      <div className="admin-stats">
        <article><div><b>{status}</b><span>Supabase 연결</span></div></article>
        <article><div><b>{events.length + leads.length}</b><span>현재 기간 실제 기록</span></div></article>
        <article><div><b>{staffCount}</b><span>집계된 담당자</span></div></article>
        <article>
          <div>
            <b>{latest ? latest.toLocaleDateString("ko-KR") : "-"}</b>
            <span>마지막 실제 활동</span>
          </div>
        </article>
      </div>

      {!loading && !error && !hasData && (
        <p className="admin-empty">
          연결은 정상입니다. 명함 링크가 배포되고 고객이 조회·상담·신청하면 이 화면에 자동으로 표시됩니다.
        </p>
      )}
    </section>
  );
}
