"use client";


import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Clock3,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  Truck,
} from "lucide-react";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { siteAddress, siteWhatsAppHref, SITE_PHONE_DISPLAY, SITE_PHONE_TEL } from "@/lib/siteContacts";

export default function AboutPage() {
  const lang = useLang();
  const whatsappUrl = siteWhatsAppHref();
  const revealRootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!revealRootRef.current) return;
    const elements = Array.from(revealRootRef.current.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const content = {
    ru: {
      title: "О компании",
      legalLine:
        "Мы работаем как индивидуальный предприниматель (автозапчасти в Шымкенте) и ведём коммуникацию с клиентами через сайт, телефон и мессенджеры.",
      intro:
        "Магазин автозапчастей в Шымкенте с фокусом на китайские марки. Помогаем владельцам и СТО подобрать деталь по артикулу, категории или описанию, ведём заказ от заявки до выдачи или доставки по Казахстану.",
      lead:
        "С 2020 года держим привлекательные цены за счёт прямых договоров с поставщиками, без лишних посредников. Проверяем комплектность и состояние позиций перед отгрузкой, по согласованию доставляем по РК в типичные сроки 1–3 дня.",
      bullets: [
        { t: "Цена и поставки", d: "Выгодные цены и прямые договоры с поставщиками — вы платите ближе к фактической стоимости поставки." },
        { t: "Доставка", d: "По Казахстану в большинстве случаев 1–3 дня (зависит от направления и службы; точные сроки согласуем при заказе). По Шымкенту — от 1990 ₸ после уточнения адреса." },
        { t: "Специализация", d: "FAW, Changan, Dongfeng, Wuling и сопутствующий ассортимент для китайского автопарка." },
      ],

      statsTitle: "В цифрах",
      stats: [
        { k: "100 000+", v: "позиций в ассортименте" },
        { k: "2020", v: "год основания" },
        { k: "1–3 дня", v: "типичные сроки доставки по РК" },
        { k: "4 марки", v: "FAW, Changan, Dongfeng, Wuling" },
      ],
      sectionProcess: "Как мы работаем",
      process: [
        "Запрос от клиента (сайт, WhatsApp, звонок)",
        "Подбор вариантов: оригинал / проверенные аналоги",
        "Согласование цены, срока и способа получения",
        "Резерв и проверка товара на складе",
        "Упаковка и отгрузка или выдача в офисе",
      ],
      sectionConditions: "Гарантия, монтаж, доставка и оплата",
      guarantee:
        "На отдельные позиции распространяется гарантия поставщика — срок и условия уточняйте у менеджера по конкретной детали. Претензию по заводскому браку рассматриваем, если неисправность подтверждена и деталь не повреждена при установке или перевозке.",
      returnText:
        "При подтверждённом браке возможен возврат денег или замена на новую деталь — только после того, как товар получен обратно нами и осмотрен. Сообщите о проблеме до монтажа, желательно в день получения.",
      installationLiability:
        "Мы не отвечаем за работу стороннего мастера, сервиса или водителя. При неумелом монтаже или грубом обращении деталь может быть сломана ещё до выхода из обшивки — в таких случаях претензий к товару не принимаем. Рекомендуем опытных специалистов по китайским авто.",
      delivery:
        "По согласованию — доставка по Казахстану в ориентире 1–3 дня. По Шымкенту — от 1990 ₸, точная сумма после адреса. В отдалённые пункты сроки могут быть дольше — проговариваем заранее.",
      payment: "Онлайн-оплата на сайте в планах; сейчас — перевод на карту, наличные при самовывозе согласно договорённости.",
      sectionContacts: "Контакты и график",
      address: siteAddress("ru"),
      phoneMain: SITE_PHONE_DISPLAY,
      phoneLabel: "Телефон и WhatsApp",
      contactsBlockTitle: "Связь",
      scheduleBlockTitle: "Режим работы",
      scheduleDays: [
        ["Понедельник — четверг", "10:00 — 20:00"],
        ["Пятница", "14:00 — 20:00"],
        ["Суббота — воскресенье", "10:00 — 18:00"],
      ],
      scheduleNote: "В рабочие часы менеджер обычно отвечает в течение 5–20 минут.",
      cta: "Написать в WhatsApp",
      toCatalog: "Перейти в каталог",
      toContacts: "Контакты и карта",
    },
    kz: {
      title: "Біз туралы",
      legalLine:
        "Біз жеке кәсіпкер ретінде жұмыс істейміз (автокөлік бөлшектері, Шымкент), клиенттермен сайт, телефон және мессенджер арқылы байланысамыз.",
      intro:
        "Шымкенттегі қытай авто бөлшектері. Тапсырысты РК бойынша жеткізуге дейін сүйемелдейміз.",
      lead:
        "2020 жылдан бері жеткізушілермен тікелей шарттар арқылы тиімді баға ұстаймыз. Келісім бойынша РК бойынша көбінесе 1–3 күн ішінде жеткізу.",
      bullets: [
        { t: "Баға мен жеткізу", d: "Тиімді баға және жеткізушілермен тікелей жұмыс — артық делдалсыз." },
        { t: "Жеткізу", d: "РК бойынша жиі 1–3 күн (нақтырақ тапсырыс кезінде). Шымкент — 1990 ₸ бастап, мекенжайды нақтылағанда." },
        { t: "Мамандық", d: "FAW, Changan, Dongfeng, Wuling және сұраныстың қалғаны." },
      ],

      statsTitle: "Сандарда",
      stats: [
        { k: "100 000+", v: "позициядан астам" },
        { k: "2020", v: "негізделген жыл" },
        { k: "1–3 күн", v: "РК бойынша қалыпты жеткізу" },
        { k: "4 марка", v: "FAW, Changan, Dongfeng, Wuling" },
      ],
      sectionProcess: "Қалай жұмыс істейміз",
      process: [
        "Клиент сұранысы (сайт, WhatsApp, қоңырау)",
        "Оригинал / тексерілген сәйкес өнімдер",
        "Бағаны, мерзімді және алу тәсілін келісу",
        "Резерв және қоймада тексеру",
        "Қаптау және жіберу немесе кеңседе беру",
      ],
      sectionConditions: "Кепілдік, орнату, жеткізу, төлем",
      guarantee:
        "Кей бөлшектерде жеткізуші кепілдігі — мерзімін нақты тауар бойынша сұраңыз. Заводтық ақау расталса, орнату немесе тасымалдау кезінде зақымдалмаған болуы керек.",
      returnText:
        "Расталған брак бойынша ақша қайтару немесе ауыстыру — тек тауар кері алынғаннан кейін. Орнатпай, алу күні хабарлаңыз.",
      installationLiability:
        "Тәжірибесіз шебер, сервис немесе жүргізуші жұмысына жауап бермейміз. Кәсіби емес орнату кезінде бөлшек обшивкадан шықпай-ақ бүлінуі мүмкін — мұндайда шағым қабылданбайды.",
      delivery:
        "Келісім бойынша — әдетте 1–3 күн. Шымкент — 1990 ₸ бастап. Қашық ауылдарда ұзарады — алдын ала айтамыз.",
      payment: "Сайттағы онлайн төлем жоспарда; қазір — карта, қолма-қол.",
      sectionContacts: "Байланыс және жоспар",
      address: siteAddress("kz"),
      phoneMain: SITE_PHONE_DISPLAY,
      phoneLabel: "Телефон және WhatsApp",
      contactsBlockTitle: "Байланыс",
      scheduleBlockTitle: "Жұмыс уақыты",
      scheduleDays: [
        ["Дүйсенбі — бейсенбі", "10:00 — 20:00"],
        ["Жұма", "14:00 — 20:00"],
        ["Сенбі — жексенбі", "10:00 — 18:00"],
      ],
      scheduleNote: "Жұмыс уақытында жауап әдетте 5–20 мин ішінде.",
      cta: "WhatsApp жазыу",
      toCatalog: "Каталогқа",
      toContacts: "Байланыс",
    },
    uz: {
      title: "Biz haqimizda",
      legalLine:
        "Biz Chimkentda yakka tartibdagi tadbirkor sifatida (avto detallar) ishlaymiz va mijozlar bilan sayt, telefon va messenjerlar orqali bog'lanamiz.",
      intro:
        "Chimkentdan xitoy avto detallarini yetkazamiz. Moslik bo'yicha yordam beramiz va buyurtmani Qozog'iston bo'ylab yetkazib berishgacha kuzatamiz.",
      lead:
        "2020-yildan beri yetkazib beruvchilar bilan to'g'ridan-to'g'ri shartnomalar orqali qulay narx saqlaymiz. Yuborishdan oldin tovarni tekshiramiz; kelishuv bo'yicha Qozog'iston bo'ylab odatda 1–3 ish kuni.",
      bullets: [
        { t: "Narx va yetkazib berish", d: "Qulay narx va to'g'ridan-to'g'ri yetkazib beruvchilar — ortiqcha vositachilar yo'q." },
        { t: "Yetkazib berish", d: "Qozog'iston bo'ylab ko'pincha 1–3 kun (aniq muddat buyurtma vaqtida). Chimkent — 1990 ₸ dan, manzil aniqlangach." },
        { t: "Mutaxassislik", d: "FAW, Changan, Dongfeng, Wuling va xitoy avtoparki uchun boshqa tovarlar." },
      ],

      statsTitle: "Raqamlarda",
      stats: [
        { k: "100 000+", v: "pozitsiya assortimentda" },
        { k: "2020", v: "tashkil etilgan yil" },
        { k: "1–3 kun", v: "odatiy yetkazib berish" },
        { k: "4 marka", v: "FAW, Changan, Dongfeng, Wuling" },
      ],
      sectionProcess: "Qanday ishlaymiz",
      process: [
        "Mijoz so'rovi (sayt, WhatsApp, qo'ng'iroq)",
        "Variantlar: original / tekshirilgan analoglar",
        "Narx, muddat va olish usulini kelishish",
        "Rezerv va omborda tekshirish",
        "Qadoqlash va yuborish yoki ofisda berish",
      ],
      sectionConditions: "Kafolat, o'rnatish, yetkazib berish va to'lov",
      guarantee:
        "Ba'zi pozitsiyalarda yetkazib beruvchi kafolati — muddat va shartlarni aniq detal bo'yicha menejerdan so'rang. Zavod nuqsoni bo'yicha murojaat qabul qilamiz, agar nosozlik tasdiqlansa va detal o'rnatish yoki tashishda shikastlanmagan bo'lsa.",
      returnText:
        "Tasdiqlangan nuqson bo'yicha pul qaytarish yoki almashtirish — faqat tovar qayta qabul qilingan va ko'rilgandan keyin. Muammo haqida o'rnatishdan oldin, imkon qadar olish kunida xabar bering.",
      installationLiability:
        "Uchinchi tomon usta, servis yoki haydovchi ishiga javobgar emasmiz. Noto'g'ri o'rnatish yoki qo'pol muomala detalni obivkadan chiqmasdan buzishi mumkin — bunday holatda talab qabul qilinmaydi. Xitoy avtolari bo'yicha tajribali ustalarni tavsiya qilamiz.",
      delivery:
        "Kelishuv bo'yicha — Qozog'iston bo'ylab taxminan 1–3 kun. Chimkent — 1990 ₸ dan, aniq summa manzildan keyin. Uzoq nuqtalarda muddat uzayishi mumkin — oldindan aytamiz.",
      payment: "Saytda onlayn to'lov rejada; hozir — kartaga o'tkazma, o'zi olib ketishda naqd pul.",
      sectionContacts: "Aloqa va ish vaqti",
      address: siteAddress("uz"),
      phoneMain: SITE_PHONE_DISPLAY,
      phoneLabel: "Telefon va WhatsApp",
      contactsBlockTitle: "Bog'lanish",
      scheduleBlockTitle: "Ish vaqti",
      scheduleDays: [
        ["Dushanba — payshanba", "10:00 — 20:00"],
        ["Juma", "14:00 — 20:00"],
        ["Shanba — yakshanba", "10:00 — 18:00"],
      ],
      scheduleNote: "Ish vaqtida menejer odatda 5–20 daqiqa ichida javob beradi.",
      cta: "WhatsAppga yozish",
      toCatalog: "Katalogga o'tish",
      toContacts: "Aloqa va xarita",
    },
  }[lang];



  return (
    <InnerPageLayout
      innerClassName="max-w-4xl mx-auto"
      breadcrumbs={[
        { label: tr(t.nav.home, lang), href: "/" },
        { label: tr(t.nav.about, lang) },
      ]}
      title={content.title}
      subtitle={content.intro}
    >
        <p className="mb-8 text-sm leading-relaxed text-[color:var(--text-secondary)] sm:text-base">{content.legalLine}</p>

        <div ref={revealRootRef} className="space-y-8 sm:space-y-10">
          <div data-reveal className="reveal-item">
            <p className="text-base leading-relaxed text-[color:var(--text-secondary)] sm:text-lg">{content.lead}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-1 sm:gap-4">
              {content.bullets.map((b, idx) => (
                <li
                  key={b.t}
                  className="flex gap-3 rounded-2xl border border-black/[0.08] bg-[color:var(--surface-light)] p-4 shadow-sm"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--site-accent)]/10 text-[var(--site-accent)]">
                    {idx === 0 ? <Target size={20} /> : idx === 1 ? <Truck size={20} /> : <Sparkles size={20} />}
                  </span>
                  <div>
                    <p className="font-bold text-[color:var(--text-charcoal)]">{b.t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[color:var(--text-secondary)]">{b.d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp rounded-xl px-5 py-2.5"
              >
                <MessageCircle size={17} />
                {content.cta}
              </a>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition-colors hover:border-[var(--site-accent)]/18 hover:bg-[color:var(--surface-light)]"
              >
                {content.toCatalog}
              </Link>
              <Link
                href="/contacts"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-2 py-2.5 text-sm font-semibold text-[var(--site-accent)] hover:underline"
              >
                {content.toContacts}
              </Link>
            </div>
          </div>




          <section data-reveal className="reveal-item">
            <h2 className="mb-4 text-xl font-extrabold tracking-tight text-[color:var(--text-charcoal)] sm:text-2xl">{content.statsTitle}</h2>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {content.stats.map((s, i) => (
                <div
                  key={`${s.k}-${i}`}
                  className="surface-panel surface-panel-hover rounded-2xl p-4 sm:p-5"
                >
                  <p className="text-2xl font-extrabold tabular-nums text-[var(--site-accent)] sm:text-3xl">{s.k}</p>
                  <p className="mt-2 text-xs leading-snug text-[color:var(--text-secondary)] sm:text-sm">{s.v}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />

          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:gap-6">
            <div data-reveal className="reveal-item surface-panel rounded-2xl p-6 sm:p-7">
              <h2 className="mb-5 text-lg font-extrabold text-[color:var(--text-charcoal)] sm:text-xl">{content.sectionProcess}</h2>
              <ol className="relative space-y-0">
                {content.process.map((step, idx) => (
                  <li key={step} className="relative flex gap-3 pb-4 last:pb-0">
                    {idx < content.process.length - 1 && (
                      <span
                        className="absolute left-[13px] top-8 h-[calc(100%-0.5rem)] w-px bg-gradient-to-b from-[var(--site-accent)]/20 to-[var(--site-accent)]/10"
                        aria-hidden
                      />
                    )}
                    <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full btn-primary text-xs font-bold text-white shadow-sm">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5 text-sm leading-relaxed text-[color:var(--text-secondary)] sm:text-base">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div data-reveal className="reveal-item surface-panel rounded-2xl p-6 sm:p-7">
              <h2 className="mb-5 text-lg font-extrabold text-[color:var(--text-charcoal)] sm:text-xl">{content.sectionConditions}</h2>
              <div className="space-y-4 text-sm leading-relaxed text-[color:var(--text-secondary)] sm:text-base">
                <p className="flex items-start gap-2.5">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 accent-icon" />
                  {content.guarantee}
                </p>
                <p className="flex items-start gap-2.5">
                  <BadgeCheck size={18} className="mt-0.5 shrink-0 accent-icon" />
                  {content.returnText}
                </p>
                <p className="flex items-start gap-2.5">
                  <Truck size={18} className="mt-0.5 shrink-0 accent-icon" />
                  {content.delivery}
                </p>
                <p className="flex items-start gap-2.5">
                  <PackageCheck size={18} className="mt-0.5 shrink-0 accent-icon" />
                  {content.payment}
                </p>
                <p className="flex items-start gap-2.5 rounded-xl warn-callout px-3 py-3 text-sm sm:text-base">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 accent-icon" />
                  {content.installationLiability}
                </p>
              </div>
            </div>
          </div>

          <div data-reveal className="reveal-item surface-panel rounded-2xl p-6 sm:p-7">
            <h2 className="mb-5 text-lg font-extrabold text-[color:var(--text-charcoal)] sm:text-xl">{content.sectionContacts}</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
              <div className="rounded-2xl border border-black/[0.08] bg-[color:var(--surface-light)] p-5">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[color:var(--text-silver)]">{content.contactsBlockTitle}</h3>
                <p className="flex items-start gap-2.5 rounded-xl border border-black/[0.08] bg-white px-3.5 py-2.5 text-sm text-[color:var(--text-secondary)] sm:text-base">
                  <MapPin size={18} className="mt-0.5 shrink-0 accent-icon" />
                  {content.address}
                </p>
                <p className="mb-1 mt-4 text-xs font-semibold text-[color:var(--text-silver)]">{content.phoneLabel}</p>
                <a
                  href={SITE_PHONE_TEL}
                  className="flex items-center gap-2.5 rounded-xl border border-black/[0.08] bg-white px-3.5 py-2.5 text-sm font-semibold text-[color:var(--text-charcoal)] transition-colors hover:border-[var(--site-accent)]/18 hover:bg-[var(--site-accent)]/6 sm:text-base"
                >
                  <Phone size={18} className="shrink-0 accent-icon" />
                  {content.phoneMain}
                </a>
              </div>
              <div className="rounded-2xl border border-[var(--site-accent)]/15 bg-gradient-to-b from-[var(--site-accent)]/5 to-white p-5">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[color:var(--text-silver)]">{content.scheduleBlockTitle}</h3>
                <div className="space-y-2">
                  {content.scheduleDays.map(([day, time]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between gap-2 rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-sm"
                    >
                      <span className="inline-flex items-center gap-2 text-[color:var(--text-secondary)]">
                        <Clock3 size={15} className="shrink-0 accent-icon" />
                        {day}
                      </span>
                      <span className="shrink-0 font-bold tabular-nums text-[color:var(--text-charcoal)]">{time}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 rounded-xl border border-[var(--site-accent)]/18 bg-[var(--site-accent)]/8 px-3 py-2 text-xs leading-relaxed text-[var(--text-charcoal)] sm:text-sm">
                  {content.scheduleNote}
                </p>
              </div>
            </div>
          </div>
        </div>
    </InnerPageLayout>
  );
}
