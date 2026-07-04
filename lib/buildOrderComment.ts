import type { PublicDeliveryType, PublicPaymentType } from "./publicApi";

export interface OrderCommentLabels {
  blockTitle: string;
  methodLabel: string;
  pickup: string;
  cityDelivery: string;
  postDelivery: string;
  addressLabel: string;
  cityLabel: string;
  detailsLabel: string;
}

export function buildOrderComment(
  userComment: string | undefined,
  deliveryType: PublicDeliveryType,
  fields: { address?: string; city?: string; details?: string },
  l: OrderCommentLabels,
): string {
  const lines: string[] = [];
  lines.push(l.blockTitle);
  if (deliveryType === "pickup") {
    lines.push(`${l.methodLabel}: ${l.pickup}`);
  } else if (deliveryType === "city") {
    lines.push(`${l.methodLabel}: ${l.cityDelivery}`);
    if (fields.address?.trim()) lines.push(`${l.addressLabel}: ${fields.address.trim()}`);
  } else {
    lines.push(`${l.methodLabel}: ${l.postDelivery}`);
    if (fields.city?.trim()) lines.push(`${l.cityLabel}: ${fields.city.trim()}`);
    if (fields.details?.trim()) lines.push(`${l.detailsLabel}: ${fields.details.trim()}`);
  }
  const block = lines.join("\n");
  const u = userComment?.trim();
  return u ? `${u}\n\n${block}` : block;
}

export interface PaymentCommentLabels {
  blockTitle: string;
  methodLabel: string;
  card: string;
  cash: string;
}

/** Добавляет блок оплаты к уже собранному комментарию (после доставки). */
export function appendPaymentToComment(
  base: string,
  paymentType: PublicPaymentType,
  l: PaymentCommentLabels,
): string {
  const method =
    paymentType === "cash" ? l.cash : l.card;
  const block = `${l.blockTitle}\n${l.methodLabel}: ${method}`;
  return base.trim() ? `${base.trim()}\n\n${block}` : block;
}
