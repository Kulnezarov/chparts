"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/useLang";
import type { Lang } from "@/store/langStore";
import { t, tr } from "@/lib/i18n";

const CHIP_LABELS: Record<string, Record<Lang, string>> = {
  "chip.фильтр": { ru: "Фильтры", kz: "Сүзгілер", uz: "Filtrlar" },
  "chip.масло": { ru: "Масло", kz: "Май", uz: "Moy" },
  "chip.тормоз": { ru: "Тормоза", kz: "Тормоз", uz: "Tormoz" },
  "chip.генератор": { ru: "Генератор", kz: "Генератор", uz: "Generator" },
};

const HERO_TEXT: Record<string, Record<Lang, string>> = {
  "hero.title": t.hero.title,
  "hero.subtitle": t.hero.subtitle,
  "hero.badgeWhatsapp": t.hero.badgeWhatsapp,
  "hero.badgePickup": t.hero.badgePickup,
  "hero.brandsNote": t.hero.brandsNote,
  "hero.brandsEyebrow": t.hero.brandsEyebrow,
  "hero.trust.delivery.title": t.homeWhy.delivery.title,
  "hero.trust.delivery.desc": t.homeWhy.delivery.desc,
  "hero.trust.quality.title": t.homeWhy.quality.title,
  "hero.trust.quality.desc": t.homeWhy.quality.desc,
  "hero.trust.match.title": t.homeWhy.match.title,
  "hero.trust.match.desc": t.homeWhy.match.desc,
  "ui.toCatalog": t.ui.toCatalog,
  "ui.whatsappPick": t.ui.whatsappPick,
  ...CHIP_LABELS,
};

/** После гидратации подставляет язык из localStorage (сервер отдаёт ru). */
export default function HeroLangSync() {
  const lang = useLang();

  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-hero-i18n]").forEach((el) => {
      const key = el.getAttribute("data-hero-i18n");
      if (!key) return;
      const entry = HERO_TEXT[key];
      if (entry) el.textContent = tr(entry, lang);
    });
    const input = document.querySelector<HTMLInputElement>("#hero-search-form input[name='q']");
    if (input && t.ui.searchPlaceholder) {
      input.placeholder = tr(t.ui.searchPlaceholder, lang);
    }
  }, [lang]);

  return null;
}
