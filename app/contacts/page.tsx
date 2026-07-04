"use client";

import { useState } from "react";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { Check, Clock3, Copy, MapPin, MessageCircle, Navigation, Phone, UserCheck, Wrench } from "lucide-react";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import RevealOnScroll from "@/components/RevealOnScroll";
import {
  SITE_MAP_QUERY,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  SITE_SUPPORT_PHONE_DISPLAY,
  SITE_SUPPORT_PHONE_TEL,
  siteAddress,
  siteWhatsAppHref,
} from "@/lib/siteContacts";

export default function ContactsPage() {
  const lang = useLang();
  const [addressCopied, setAddressCopied] = useState(false);
  const whatsappUrl = siteWhatsAppHref();

  const mapQueryEncoded = encodeURIComponent(SITE_MAP_QUERY);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQueryEncoded}&hl=${lang === "uz" ? "ru" : "ru"}&z=16&output=embed`;
  const buildRouteUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQueryEncoded}`;
  const twoGisUrl = `https://2gis.kz/shymkent/search/${encodeURIComponent(SITE_MAP_QUERY)}`;
  const addressLine = siteAddress(lang);

  const content = {
    ru: {
      title: "Контакты",
      mapTitle: "Как нас найти",
      mapCaption: "Офис и самовывоз по адресу на карте.",
      buildRoute: "Построить маршрут",
      open2gis: "Открыть в 2ГИС",
      office: "Офис и самовывоз",
      schedule: "График работы",
      team: "Связь",
      salesTitle: "Звонок и WhatsApp",
      salesHint: "Подбор запчастей, заказы, резерв и доставка",
      supportTitle: "Ошибка на сайте",
      supportHint: "Если страница не открывается, не грузится каталог или что-то сломалось",
      supportCall: "Позвонить в поддержку",
      whatsapp: "Написать в WhatsApp",
      address: siteAddress("ru"),
      days: [
        ["Понедельник — четверг", "10:00 — 20:00"],
        ["Пятница", "14:00 — 20:00"],
        ["Суббота — воскресенье", "10:00 — 18:00"],
      ],
      response: "Ответ менеджера обычно в течение 5–20 минут в рабочее время",
      copyAddress: "Скопировать адрес",
      copiedAddress: "Адрес скопирован",
    },
    kz: {
      title: "Байланыс",
      mapTitle: "Бізді қалай табуға болады",
      mapCaption: "Картадағы мекенжай бойынша офис және алып кету.",
      buildRoute: "Маршрут құру",
      open2gis: "2ГИС-та ашу",
      office: "Офис және алып кету",
      schedule: "Жұмыс кестесі",
      team: "Байланыс",
      salesTitle: "Қоңырау және WhatsApp",
      salesHint: "Бөлшек іріктеу, тапсырыс, резерв және жеткізу",
      supportTitle: "Сайттағы қате",
      supportHint: "Бет ашылмаса, каталог жүктелмесе немесе бір нәрсе істемесе",
      supportCall: "Қолдауға қоңырау",
      whatsapp: "WhatsApp жазу",
      address: siteAddress("kz"),
      days: [
        ["Дүйсенбі — бейсенбі", "10:00 — 20:00"],
        ["Жұма", "14:00 — 20:00"],
        ["Сенбі — жексенбі", "10:00 — 18:00"],
      ],
      response: "Менеджер жауабы әдетте 5–20 минут ішінде жұмыс уақытында",
      copyAddress: "Мекенжайды көшіру",
      copiedAddress: "Мекенжай көшірілді",
    },
    uz: {
      title: "Aloqa",
      mapTitle: "Bizni qanday topish mumkin",
      mapCaption: "Xaritadagi manzil bo'yicha ofis va o'zi olib ketish.",
      buildRoute: "Marshrut qurish",
      open2gis: "2GIS da ochish",
      office: "Ofis va o'zi olib ketish",
      schedule: "Ish vaqti",
      team: "Bog'lanish",
      salesTitle: "Qo'ng'iroq va WhatsApp",
      salesHint: "Detal tanlash, buyurtma, rezerv va yetkazib berish",
      supportTitle: "Saytdagi xato",
      supportHint: "Sahifa ochilmasa, katalog yuklanmasa yoki biror narsa ishlamasa",
      supportCall: "Qo'llab-quvvatlashga qo'ng'iroq",
      whatsapp: "WhatsAppga yozish",
      address: siteAddress("uz"),
      days: [
        ["Dushanba — payshanba", "10:00 — 20:00"],
        ["Juma", "14:00 — 20:00"],
        ["Shanba — yakshanba", "10:00 — 18:00"],
      ],
      response: "Ish vaqtida menejer odatda 5–20 daqiqa ichida javob beradi",
      copyAddress: "Manzilni nusxalash",
      copiedAddress: "Manzil nusxalandi",
    },
  }[lang];

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(addressLine);
      setAddressCopied(true);
      window.setTimeout(() => setAddressCopied(false), 1600);
    } catch {
      setAddressCopied(false);
    }
  };

  return (
    <InnerPageLayout
      innerClassName="max-w-4xl mx-auto"
      breadcrumbs={[
        { label: tr(t.nav.home, lang), href: "/" },
        { label: content.title },
      ]}
      title={content.title}
    >
        <RevealOnScroll>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <div className="surface-panel rounded-2xl p-6 sm:p-7">
            <h2 className="mb-4 text-lg font-extrabold text-[color:var(--text-charcoal)] sm:text-xl">{content.office}</h2>
            <div className="flex items-start gap-2.5 rounded-xl border border-black/[0.08] bg-[color:var(--surface-light)] px-3.5 py-2.5 text-sm text-[color:var(--text-secondary)] sm:text-base">
              <MapPin size={18} className="mt-0.5 shrink-0 accent-icon" />
              <span className="min-w-0 flex-1">{addressLine}</span>
              <button
                type="button"
                onClick={copyAddress}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-xs font-semibold text-[color:var(--site-accent)] shadow-sm transition-colors hover:bg-[color:var(--site-accent-soft)]"
              >
                {addressCopied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
                <span className="hidden sm:inline">{addressCopied ? content.copiedAddress : content.copyAddress}</span>
              </button>
            </div>
            <h3 className="mb-2 mt-6 text-xs font-bold uppercase tracking-wide text-[color:var(--text-silver)]">{content.team}</h3>

            <div className="rounded-xl border border-black/[0.08] bg-[color:var(--surface-light)] p-4">
              <p className="mb-1 text-sm font-semibold text-[color:var(--text-charcoal)]">{content.salesTitle}</p>
              <p className="mb-3 text-xs leading-relaxed text-[color:var(--text-silver)]">{content.salesHint}</p>
              <a
                href={SITE_PHONE_TEL}
                className="flex items-center gap-2.5 rounded-xl border border-black/[0.08] bg-white px-3.5 py-3 text-base font-bold tabular-nums text-[color:var(--text-charcoal)] shadow-sm transition-colors hover:border-[color:var(--site-accent)]/25 hover:bg-[color:var(--site-accent-soft)]"
              >
                <Phone size={18} className="shrink-0 accent-icon" />
                {SITE_PHONE_DISPLAY}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp mt-3 w-full justify-center rounded-xl px-4 py-3"
              >
                <MessageCircle size={18} />
                {content.whatsapp}
              </a>
            </div>

            <div className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/70 p-4">
              <p className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--text-charcoal)]">
                <Wrench size={16} className="shrink-0 text-amber-700" />
                {content.supportTitle}
              </p>
              <p className="mb-3 text-xs leading-relaxed text-[color:var(--text-secondary)]">{content.supportHint}</p>
              <a
                href={SITE_SUPPORT_PHONE_TEL}
                className="flex items-center gap-2.5 rounded-xl border border-amber-200/90 bg-white px-3.5 py-3 text-base font-bold tabular-nums text-[color:var(--text-charcoal)] shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50"
              >
                <Phone size={18} className="shrink-0 text-amber-700" />
                {SITE_SUPPORT_PHONE_DISPLAY}
              </a>
              <p className="mt-2 text-xs text-[color:var(--text-silver)]">{content.supportCall}</p>
            </div>
          </div>

          <div className="surface-panel rounded-2xl p-6 sm:p-7">
            <h2 className="mb-4 text-lg font-extrabold text-[color:var(--text-charcoal)] sm:text-xl">{content.schedule}</h2>
            <div className="space-y-2">
              {content.days.map(([day, time]) => (
                <div
                  key={day}
                  className="flex items-center justify-between gap-2 rounded-xl border border-black/[0.08] bg-[color:var(--surface-light)] px-3 py-2.5 text-sm"
                >
                  <span className="inline-flex items-center gap-2 text-[color:var(--text-secondary)]">
                    <Clock3 size={15} className="shrink-0 accent-icon" />
                    {day}
                  </span>
                  <span className="shrink-0 font-bold tabular-nums text-[color:var(--text-charcoal)]">{time}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--site-accent)]/20 bg-[var(--site-accent)]/8 px-3 py-2 text-xs font-medium text-[var(--text-charcoal)] sm:text-sm">
              <UserCheck size={15} className="shrink-0" />
              {content.response}
            </div>
          </div>
        </div>
        </RevealOnScroll>

        <RevealOnScroll className="mt-6 sm:mt-8" delayMs={60}>
        <div className="surface-panel overflow-hidden rounded-2xl accent-border-l p-6 sm:p-7">
          <h2 className="mb-1 text-lg font-extrabold text-[color:var(--text-charcoal)] sm:text-xl">{content.mapTitle}</h2>
          <p className="mb-4 text-sm text-[color:var(--text-secondary)]">{content.mapCaption}</p>
          <div className="relative aspect-[16/10] min-h-[220px] w-full overflow-hidden rounded-2xl border border-black/[0.08] bg-[color:var(--surface-light)] sm:min-h-[300px]">
            <iframe
              title={content.mapTitle}
              src={mapEmbedUrl}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm text-[color:var(--text-secondary)]">
              <MapPin size={16} className="mt-0.5 shrink-0 accent-icon" />
              <span>{addressLine}</span>
            </p>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-stretch">
              <a
                href={buildRouteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl btn-primary px-5 py-3 text-sm font-semibold text-white shadow-md shadow-black/10 transition-transform hover:bg-[var(--site-accent-hover)] active:scale-[0.99] sm:w-auto"
              >
                <Navigation size={18} className="shrink-0" />
                {content.buildRoute}
              </a>
              <button
                type="button"
                onClick={copyAddress}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--text-charcoal)] shadow-sm transition-colors hover:border-[color:var(--site-accent)]/25 hover:bg-[color:var(--site-accent-soft)] sm:w-auto"
              >
                {addressCopied ? <Check size={18} className="shrink-0 text-[color:var(--site-accent)]" aria-hidden /> : <Copy size={18} className="shrink-0 text-[color:var(--site-accent)]" aria-hidden />}
                {addressCopied ? content.copiedAddress : content.copyAddress}
              </button>
              <a
                href={twoGisUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--text-charcoal)] shadow-sm transition-colors hover:border-[color:var(--site-accent)]/25 hover:bg-[color:var(--site-accent-soft)] sm:w-auto"
              >
                <MapPin size={18} className="shrink-0 text-cyan-600" aria-hidden />
                {content.open2gis}
              </a>
            </div>
          </div>
        </div>
        </RevealOnScroll>
    </InnerPageLayout>
  );
}
