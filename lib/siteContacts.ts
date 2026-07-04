/** Основной телефон: звонки, WhatsApp, заказы */
export const SITE_PHONE_DIGITS = "77766822225";

export const SITE_PHONE_DISPLAY = "+7 776 682 22 25";
export const SITE_PHONE_TEL = `tel:+${SITE_PHONE_DIGITS}`;

/** Дополнительный телефон менеджера */
export const SITE_PHONE_ALT_DIGITS = "77013522223";

export const SITE_PHONE_ALT_DISPLAY = "+7 701 352 22 23";
export const SITE_PHONE_ALT_TEL = `tel:+${SITE_PHONE_ALT_DIGITS}`;

/** Техподдержка — ошибки и сбои на сайте */
export const SITE_SUPPORT_PHONE_DIGITS = "77759989997";

export const SITE_SUPPORT_PHONE_DISPLAY = "+7 775 998 99 97";
export const SITE_SUPPORT_PHONE_TEL = `tel:+${SITE_SUPPORT_PHONE_DIGITS}`;

/** WhatsApp магазина (основной номер) */
export const SITE_WHATSAPP_DIGITS = SITE_PHONE_DIGITS;

export function siteWhatsAppHref(): string {
  return `https://wa.me/${SITE_WHATSAPP_DIGITS}`;
}

/** Ссылка wa.me с предзаполненным текстом (UTF-8). */
export function siteWhatsAppHrefWithText(message: string): string {
  const q = message.trim() ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${SITE_WHATSAPP_DIGITS}${q}`;
}

export type SiteLang = "ru" | "kz" | "uz";

/** Адрес магазина и самовывоза */
export const SITE_ADDRESS = {
  ru: "г. Шымкент, ул. Ибрагим Ата, 260/1, мкр. Исфиджаб, 1 этаж",
  kz: "Шымкент, Ибрагим Ата көшесі, 260/1, Исфиджаб т., 1-қабат",
  uz: "Chimkent, Ibragim Ata ko'chasi, 260/1, Isfidjab MFY, 1-qavat",
} as const;

export const SITE_MAP_QUERY = "Ибрагим Ата 260/1, Шымкент, Казахстан";

export function siteAddress(lang: SiteLang): string {
  return SITE_ADDRESS[lang];
}

/** Текст для вопроса по конкретному резерву (корзина / «Мои заказы»). */
export function whatsappPrefillReserveQuestion(lang: SiteLang, reserveId: number): string {
  if (lang === "kz") {
    return `Сәлеметсіз бе! Резерв №${reserveId} бойынша сұрағым бар:`;
  }
  if (lang === "uz") {
    return `Assalomu alaykum! №${reserveId} rezerv boʻyicha savolim bor:`;
  }
  return `Здравствуйте! Вопрос по резерву №${reserveId}:`;
}
