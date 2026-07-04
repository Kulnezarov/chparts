"use client";

import { useLang } from "@/lib/useLang";
import { BadgeCheck, Clock3, ShieldCheck, Truck } from "lucide-react";

const icons = [Truck, ShieldCheck, BadgeCheck, Clock3];

export default function HomeTrust() {
  const lang = useLang();
  const labels = {
    ru: [
      { title: "Доставка по Казахстану", desc: "Отправка 1–3 дня" },
      { title: "Проверенные поставки", desc: "Надёжные каналы" },
      { title: "Гарантия на позиции", desc: "По артикулу" },
      { title: "Ответ в WhatsApp", desc: "5–20 минут" },
    ],
    kz: [
      { title: "Қазақстан бойынша жеткізу", desc: "1–3 күн" },
      { title: "Сенімді жеткізілім", desc: "Тексерілген арналар" },
      { title: "Кепілдік", desc: "Артикул бойынша" },
      { title: "WhatsApp жауап", desc: "5–20 минут" },
    ],
    uz: [
      { title: "Qozog'iston bo'ylab yetkazib berish", desc: "1–3 kun" },
      { title: "Ishonchli yetkazib berish", desc: "Tekshirilgan kanallar" },
      { title: "Kafolat", desc: "Artikul bo'yicha" },
      { title: "WhatsApp javob", desc: "5–20 daqiqa" },
    ],
  }[lang];

  return (
    <section className="relative z-[5] bg-[color:var(--surface-light)] pb-2 pt-1 sm:pb-4">
      <div className="site-container py-4 sm:py-8">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
          {labels.map((item, idx) => {
            const Icon = icons[idx];
            return (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-black/[0.06] bg-white p-3.5 shadow-[0_1px_8px_rgba(29,29,31,0.04)] sm:p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--site-accent-soft)] sm:h-10 sm:w-10">
                  <Icon size={17} className="text-[color:var(--site-accent)]" strokeWidth={2} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold leading-snug text-[color:var(--text-charcoal)] sm:text-sm">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[color:var(--text-silver)]">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
