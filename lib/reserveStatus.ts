/** Унифицированный статус позиции для витрины */
export type OrderLineStatus = "pending" | "processing" | "cancelled" | "issued";

export function normalizeLineStatus(raw: unknown): OrderLineStatus {
  const t = String(raw ?? "")
    .toLowerCase()
    .trim();
  if (!t) return "pending";

  if (
    /(cancel|cancell|отмен|аннулир|отказ|refus|reject|denied|declin|bekor|rad et|отклон|не подтверж)/i.test(
      t,
    )
  ) {
    return "cancelled";
  }

  if (
    /(issue|issued|выдан|fulfill|complete|готов|closed|deliver|выдач|заверш|approved|approve|одобр|confirm|accept|berildi|tasdiq|выдано|sold|picked)/i.test(
      t,
    )
  ) {
    return "issued";
  }

  if (/(process|обработ|сбор|резерв|new|ожид|pending|новый|в работе|собира)/i.test(t)) {
    return "processing";
  }

  return "pending";
}

type WarehouseLineStatusInput = {
  rawStatus?: unknown;
  lineCancelled?: boolean;
  orderCancelled?: boolean;
  orderFulfilled?: boolean;
};

/** Статус позиции с учётом флагов строки и всего резерва со склада. */
export function resolveLineStatusFromWarehouse(input: WarehouseLineStatusInput): OrderLineStatus {
  if (input.lineCancelled || input.orderCancelled) return "cancelled";

  const normalized = normalizeLineStatus(input.rawStatus);
  if (normalized === "cancelled" || normalized === "issued") return normalized;
  if (input.orderFulfilled) return "issued";
  return normalized;
}
