import type { Lang } from "@/store/langStore";

/** Подписи переключателя языка — единый стиль (кириллица). */
export const SITE_LANG_OPTIONS: { id: Lang; label: string }[] = [
  { id: "ru", label: "РУС" },
  { id: "kz", label: "ҚАЗ" },
  { id: "uz", label: "ЎЗБ" },
];
