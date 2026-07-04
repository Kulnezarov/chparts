/** Унифицированный статус позиции для витрины */
export type OrderLineStatus = "pending" | "processing" | "cancelled" | "issued";

export function normalizeLineStatus(raw: unknown): OrderLineStatus {
  const t = String(raw ?? "")
    .toLowerCase()
    .trim();
  if (!t) return "pending";
  if (/(cancel|cancell|отмен|аннулир)/i.test(t)) return "cancelled";
  if (/(issue|выдан|fulfill|complete|готов|closed|deliver|выдач|заверш)/i.test(t)) return "issued";
  if (/(process|обработ|сбор|резерв|new|ожид|pending)/i.test(t)) return "processing";
  return "pending";
}
