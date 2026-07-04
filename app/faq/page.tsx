"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { Search } from "lucide-react";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import FaqAccordion from "@/components/faq/FaqAccordion";
import { SITE_PHONE_DISPLAY } from "@/lib/siteContacts";

export default function FaqPage() {
  const lang = useLang();

  const content = {
    ru: {
      title: "Вопросы и ответы",
      subtitle:
        "Кратко о заказе, сроках, гарантии и доставке. Подробности по конкретной детали — у менеджера в WhatsApp.",
      linkAbout: "О компании",
      linkContacts: "Контакты",
      items: [
        {
          q: "Кто вы и чем занимаетесь?",
          a: "Магазин автозапчастей в Шымкенте (индивидуальный предприниматель), специализация — китайские марки: FAW, Changan, Dongfeng, Wuling. Работаем с 2020 года, в ассортименте — более 100 000 позиций.",
        },
        {
          q: "Как с вами связаться и как быстро отвечаете?",
          a: `Позвоните или напишите в WhatsApp на ${SITE_PHONE_DISPLAY}. В рабочее время обычно отвечаем в течение 5–20 минут. Адрес и график — на странице «Контакты».`,
        },
        {
          q: "Как оформить заказ и как проходит доставка?",
          a: "Заказ можно оформить на сайте (корзина) или через менеджера. По Казахстану в типичных случаях доставка 1–3 дня — точные сроки согласуем при заказе. По Шымкенту — от 1990 ₸ после уточнения адреса.",
        },
        {
          q: "Какие цены и почему они выгодные?",
          a: "Мы закупаем по прямым договорам с поставщиками, без лишних наценок посредников — поэтому цена ближе к реальной стоимости поставки.",
        },
        {
          q: "Есть ли гарантия и можно ли вернуть товар?",
          a: "На часть позиций действует гарантия поставщика — срок уточняйте у менеджера. При заводском браке возможен возврат или замена после получения детали обратно нами. За работу мастера, водителя и повреждения при монтаже (в том числе до выхода из обшивки) мы не отвечаем — подробнее в «Условиях использования» и «О нас».",
        },
        {
          q: "Планируется ли оплата на сайте?",
          a: "Онлайн-оплата в планах. Сейчас оплата — перевод на карту или наличные при самовывозе, как договоритесь с менеджером.",
        },
      ],
    },
    kz: {
      title: "Сұрақтар мен жауаптар",
      subtitle: "Тапсырыс, мерзім, кепілдік және жеткізу. Нақты бөлшек — менеджерге жазыңыз.",
      linkAbout: "Біз туралы",
      linkContacts: "Байланыс",
      items: [
        {
          q: "Сіз кімсіз және не істейсіз?",
          a: "Шымкенттегі автобөлшек дүкені (жеке кәсіпкер), қытай маркаларына (FAW, Changan, Dongfeng, Wuling) маманданған. 2020 жылдан, 100 000+ позиция.",
        },
        {
          q: "Қалай хабарласамыз және жауап жылдамдығы қанша?",
          a: `${SITE_PHONE_DISPLAY} — қоңырау не WhatsApp. Жұмыс уақытында 5–20 мин ішінде. Мекенжай — «Байланыс» бетінде.`,
        },
        {
          q: "Тапсырыс пен жеткізу қалай?",
          a: "Сайт (себет) немесе менеджер. РК бойынша көбі 1–3 күн, нақтырақ — тапсырыс кезінде. Шымкент — 1990 ₸ бастап.",
        },
        {
          q: "Баға неліктен тиімді?",
          a: "Жеткізушілермен тікелей шарт, артық делдалсыз.",
        },
        {
          q: "Кепілдік пен қайтару бар ма?",
          a: "Кей бөлшекте жеткізуші кепілдігі — мерзімін сұраңыз. Заводтық ақау: орнатпай тұрып хабарлаңыз. Өзіңіз орнатқанда немесе тәжірибесіз шеберде болса — толығырақ «Біз туралы» бетінде.",
        },
        {
          q: "Сайтта онлайн төлем бола ма?",
          a: "Жоспарда. Қазір — картаға аударым не қолма-қол.",
        },
      ],
    },
    uz: {
      title: "Savollar va javoblar",
      subtitle: "Buyurtma, yetkazib berish va kafolat qisqacha. Aniq detal uchun WhatsAppga yozing.",
      linkAbout: "Biz haqimizda",
      linkContacts: "Aloqa",
      items: [
        {
          q: "Siz kimsiz va nima qilasiz?",
          a: "Chimkentdagi avto detallar do'koni (yakka tartibdagi tadbirkor), xitoy markalari: FAW, Changan, Dongfeng, Wuling. 2020-yildan beri, 100 000+ pozitsiya.",
        },
        {
          q: "Qanday bog'lanamiz va qanchalik tez javob berasiz?",
          a: `${SITE_PHONE_DISPLAY} — qo'ng'iroq yoki WhatsApp. Ish vaqtida odatda 5–20 daqiqa ichida. Manzil va jadval — «Aloqa» sahifasida.`,
        },
        {
          q: "Buyurtma va yetkazib berish qanday?",
          a: "Saytda (savat) yoki menejer orqali. Qozog'iston bo'ylab ko'pincha 1–3 kun — aniq muddat buyurtma vaqtida. Chimkent — 1990 ₸ dan, manzil aniqlangach.",
        },
        {
          q: "Narxlar nima uchun qulay?",
          a: "Yetkazib beruvchilar bilan to'g'ridan-to'g'ri shartnoma, ortiqcha vositachilar yo'q.",
        },
        {
          q: "Kafolat va qaytarish bormi?",
          a: "Ba'zi pozitsiyalarda yetkazib beruvchi kafolati — muddatini menejerdan so'rang. Zavod nuqsoni: o'rnatmasdan oldin xabar bering. O'zingiz o'rnatganda yoki tajribasiz usta ishida — batafsil «Biz haqimizda» sahifasida.",
        },
        {
          q: "Saytda onlayn to'lov bo'ladimi?",
          a: "Rejada. Hozir — kartaga o'tkazma yoki o'zi olib ketishda naqd pul, menejer bilan kelishilganidek.",
        },
      ],
    },
  }[lang];

  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return content.items;
    return content.items.filter(
      (item) => item.q.toLowerCase().includes(needle) || item.a.toLowerCase().includes(needle),
    );
  }, [content.items, query]);

  return (
    <InnerPageLayout
      innerClassName="max-w-3xl mx-auto"
      breadcrumbs={[
        { label: tr(t.nav.home, lang), href: "/" },
        { label: tr(t.nav.help, lang) },
      ]}
      title={content.title}
      subtitle={content.subtitle}
      actions={
        <div className="flex flex-wrap gap-2">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--text-charcoal)] shadow-sm transition-colors hover:border-[color:var(--site-accent)]/25 hover:bg-[color:var(--site-accent-soft)]"
          >
            {content.linkAbout}
          </Link>
          <Link
            href="/contacts"
            className="inline-flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--text-charcoal)] shadow-sm transition-colors hover:border-[color:var(--site-accent)]/25 hover:bg-[color:var(--site-accent-soft)]"
          >
            {content.linkContacts}
          </Link>
        </div>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-silver)]" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr(t.ui.faqSearch, lang)}
            className="input-catalog h-11 w-full pl-10"
          />
        </div>
      </div>

      <div className="mt-8">
        <FaqAccordion items={filteredItems} />
      </div>
    </InnerPageLayout>
  );
}
