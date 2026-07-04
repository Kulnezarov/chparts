"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLang } from "@/lib/useLang";

export default function HomeSeo() {
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const content = {
    ru: {
      title: "Запчасти для китайских авто FAW, Changan, Dongfeng",
      p1: "Каталог автозапчастей с актуальными позициями и удобным поиском по названию и OEM. Работаем с оригиналом и проверенными аналогами.",
      p2: "Если нужной позиции нет в наличии, менеджер поможет подобрать аналог и быстро оформить заказ через WhatsApp.",
      toggle: "Подробнее о магазине",
    },
    kz: {
      title: "FAW, Changan, Dongfeng көліктеріне бөлшектер",
      p1: "Каталогта өзекті позициялар мен OEM бойынша ыңғайлы іздеу. Оригинал мен тексерілген сәйкес өнімдер.",
      p2: "Қажетті тауар қолда болмаса, менеджер WhatsApp арқылы баламасын тауып, тапсырысты жылдам рәсімдеуге көмектеседі.",
      toggle: "Дүкен туралы толығырақ",
    },
    uz: {
      title: "FAW, Changan va Dongfeng uchun ehtiyot qismlar",
      p1: "Mavjud pozitsiyalar katalogi, detal nomi va OEM bo'yicha qulay izlash. Original va tekshirilgan analoglar.",
      p2: "Kerakli tovar bo'lmasa, menejer WhatsApp orqali mos variant topishga va buyurtmani tez rasmiylashtirishga yordam beradi.",
      toggle: "Do'kon haqida batafsil",
    },
  }[lang];

  return (
    <section className="border-t border-black/[0.06] bg-[color:var(--surface-light)]">
      <div className="site-container py-8 sm:py-10">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-white px-5 py-4 text-left shadow-sm transition-colors hover:bg-[#fafafa]"
          aria-expanded={open}
        >
          <span className="text-sm font-semibold text-[color:var(--text-charcoal)]">{content.toggle}</span>
          {open ? (
            <ChevronUp size={18} className="shrink-0 text-[color:var(--text-silver)]" />
          ) : (
            <ChevronDown size={18} className="shrink-0 text-[color:var(--text-silver)]" />
          )}
        </button>
        {open && (
          <div className="mt-4 rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-8">
            <h2 className="mb-3 text-xl font-bold text-[color:var(--text-charcoal)] sm:text-2xl">{content.title}</h2>
            <p className="mb-3 leading-relaxed text-[color:var(--text-silver)]">{content.p1}</p>
            <p className="leading-relaxed text-[color:var(--text-silver)]">{content.p2}</p>
            <Link
              href="/catalog"
              className="mt-4 inline-flex text-sm font-semibold text-[color:var(--site-accent)] hover:underline"
            >
              {lang === "ru" ? "Перейти в каталог →" : lang === "kz" ? "Каталогқа өту →" : "Katalogga o'tish →"}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
