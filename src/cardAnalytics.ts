export type CardLead = { source_card?: string | null; source_staff?: string | null; status?: string | null; created_at?: string | null };

export function getCardLeadStats(items: CardLead[]) {
  const leads = items.filter((x) => Boolean(x.source_card || x.source_staff));
  const staffCounts = new Map<string, number>();
  for (const item of leads) {
    const key = item.source_staff || item.source_card || "전자명함";
    staffCounts.set(key, (staffCounts.get(key) || 0) + 1);
  }
  const byStaff = [...staffCounts.entries()].sort((a,b) => b[1]-a[1]).map(([name,count]) => ({ name, count }));
  const approved = leads.filter((x) => x.status === "approved").length;
  const pending = leads.filter((x) => !x.status || x.status === "pending").length;
  return { total: leads.length, approved, pending, byStaff };
}

export function cardSourceLabel(item: CardLead) {
  if (item.source_staff) return `MISO CARD · ${item.source_staff}`;
  if (item.source_card) return `MISO CARD · ${item.source_card}`;
  return "일반 유입";
}
