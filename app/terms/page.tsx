"use client";

import Link from "next/link";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";

type Section = { title: string; paragraphs: string[] };

export default function TermsPage() {
  const lang = useLang();
  const c = {
    ru: {
      title: "Условия использования сайта",
      subtitle: "Правила работы с каталогом, заказом, гарантией и возвратом на chparts.kz.",
      sections: [
        {
          title: "Общие положения",
          paragraphs: [
            "Сайт chparts.kz принадлежит магазину автозапчастей в г. Шымкент. Используя каталог и оформляя заявку, вы соглашаетесь с этими условиями.",
            "Обработка персональных данных описана отдельно в политике конфиденциальности.",
          ],
        },
        {
          title: "Каталог и заказ",
          paragraphs: [
            "Цены, наличие, фото и описания носят ознакомительный характер. Итоговая сумма, срок и комплектация подтверждаются менеджером после резерва.",
            "Оформление заявки на сайте не является автоматической оплатой — менеджер связывается с вами для согласования.",
          ],
        },
        {
          title: "Оплата и доставка",
          paragraphs: [
            "Способ оплаты и доставки согласуются индивидуально: перевод на карту, наличные при самовывозе, доставка по Казахстану в согласованные сроки.",
          ],
        },
        {
          title: "Гарантия на товар",
          paragraphs: [
            "На часть позиций действует гарантия поставщика. Срок и условия зависят от конкретной детали — уточняйте у менеджера до покупки.",
            "Претензия по заводскому браку принимается, если неисправность подтверждена и деталь не была повреждена при установке, транспортировке или хранении по вашей вине.",
          ],
        },
        {
          title: "Возврат денег и обмен при браке",
          paragraphs: [
            "Если товар оказался бракованным по вине производителя или поставки, мы можем вернуть деньги или заменить на новую деталь.",
            "Возврат или обмен возможны только после того, как бракованный товар физически получен обратно нами и осмотрен. Без возврата детали решение не принимается.",
            "Сообщите о проблеме как можно раньше — желательно в день получения, до монтажа.",
          ],
        },
        {
          title: "Монтаж, мастер и ответственность",
          paragraphs: [
            "Мы не отвечаем за работу стороннего мастера, автосервиса или водителя, который устанавливает или перевозит деталь.",
            "При неумелой установке, самодельных доработках или грубом обращении деталь может быть повреждена ещё до выхода из обшивки или до начала эксплуатации — в таких случаях претензий к качеству товара не принимаем.",
            "Рекомендуем доверять монтаж специалистам с опытом по китайским автомобилям. Риск неквалифицированного монтажа несёт заказчик.",
          ],
        },
        {
          title: "Ограничение ответственности",
          paragraphs: [
            "Мы не несём ответственность за косвенный ущерб (простой авто, упущенную выгоду), если он не вызван прямым нарушением наших обязательств по подтверждённому браку товара.",
          ],
        },
        {
          title: "Связь",
          paragraphs: [
            "По заказам и подбору — телефон и WhatsApp на странице «Контакты». По ошибкам сайта — отдельный номер поддержки, указанный там же.",
          ],
        },
      ] as Section[],
      privacyLink: "Политика конфиденциальности",
    },
    kz: {
      title: "Сайтты пайдалану шарттары",
      subtitle: "chparts.kz каталогы, тапсырыс, кепілдік және қайтару ережелері.",
      sections: [
        {
          title: "Жалпы ережелер",
          paragraphs: [
            "chparts.kz — Шымкенттегі автобөлшек дүкені. Сайтты пайдалану осы шарттармен келісесіз.",
            "Жеке деректер — құпиялылық саясатында.",
          ],
        },
        {
          title: "Каталог және тапсырыс",
          paragraphs: [
            "Баға, фото және сипаттама — таныстыру. Нақты шарттар менеджер растайды.",
          ],
        },
        {
          title: "Төлем және жеткізу",
          paragraphs: ["Жеке келісіледі: карта, қолма-қол, РК бойынша жеткізу."],
        },
        {
          title: "Тауар кепілдігі",
          paragraphs: [
            "Кей позицияларда жеткізуші кепілдігі бар — нақты тауар бойынша сұраңыз.",
            "Заводтық ақау — орнату немесе сіздің кінәңізбен зақымдалмаған болса.",
          ],
        },
        {
          title: "Ақау бойынша қайтару",
          paragraphs: [
            "Заводтық брак расталса — ақша қайтару немесе ауыстыру.",
            "Тек біз бракованды тауарды кері алғаннан кейін шешім қабылдаймыз.",
            "Мәселені алу күні, орнатпай тұрып хабарлаңыз.",
          ],
        },
        {
          title: "Орнату және жауапкершілік",
          paragraphs: [
            "Тәжірибесіз шебер, сервис немесе жүргізуші жұмысына кепілдік бермейміз.",
            "Кәсіби емес орнату кезінде бөлшек обшивкадан шықпай-ақ зақымдалуы мүмкін — мұндайда тауарға шағым қабылданбайды.",
          ],
        },
        {
          title: "Жауапкершілікті шектеу",
          paragraphs: ["Косвен зиян үшін жауап бермейміз, тек расталған брак бойынша міндеттемелеріміз шегінде."],
        },
        {
          title: "Байланыс",
          paragraphs: ["Тапсырыс — «Байланыс» беті. Сайт қатесі — қолдау нөмірі сол жерде."],
        },
      ] as Section[],
      privacyLink: "Құпиялылық саясаты",
    },
    uz: {
      title: "Foydalanish shartlari",
      subtitle: "chparts.kz saytida katalog, buyurtma, kafolat va qaytarish.",
      sections: [
        {
          title: "Umumiy qoidalar",
          paragraphs: [
            "chparts.kz Chimkentdagi avto detallar do'koni tomonidan boshqariladi. Saytdan foydalanish ushbu shartlarni qabul qilish hisoblanadi.",
            "Shaxsiy ma'lumotlar maxfiylik siyosatida ko'rsatilgan.",
          ],
        },
        {
          title: "Katalog va buyurtma",
          paragraphs: [
            "Narxlar, mavjudlik, fotolar va tavsiflar ma'lumot uchun. Yakuniy summa, muddat va komplektatsiya rezervdan keyin menejer bilan tasdiqlanadi.",
            "Saytda ariza qoldirish avtomatik to'lov emas — menejer kelishish uchun bog'lanadi.",
          ],
        },
        {
          title: "To'lov va yetkazib berish",
          paragraphs: [
            "To'lov va yetkazib berish usuli alohida kelishiladi: kartaga o'tkazma, o'zi olib ketishda naqd pul, Qozog'iston bo'ylab kelishilgan muddatda yetkazib berish.",
          ],
        },
        {
          title: "Tovar kafolati",
          paragraphs: [
            "Ba'zi pozitsiyalarda yetkazib beruvchi kafolati amal qiladi — aniq detal bo'yicha menejerdan so'rang.",
            "Zavod nuqsoni bo'yicha murojaat qabul qilinadi, agar nosozlik tasdiqlansa va detal o'rnatish, tashish yoki saqlashda sizning aybingiz bilan shikastlanmagan bo'lsa.",
          ],
        },
        {
          title: "Nuqson bo'yicha pul qaytarish va almashtirish",
          paragraphs: [
            "Tovar ishlab chiqaruvchi yoki yetkazib berish aybi bilan nuqsonli bo'lsa, pul qaytarish yoki yangi detal bilan almashtirish mumkin.",
            "Qaytarish yoki almashtirish faqat nuqsonli tovar qayta qabul qilingan va ko'rilgandan keyin mumkin.",
            "Muammo haqida imkon qadar tezroq xabar bering — olish kunida, o'rnatishdan oldin.",
          ],
        },
        {
          title: "O'rnatish va javobgarlik",
          paragraphs: [
            "Uchinchi tomon usta, servis yoki haydovchi ishiga javobgar emasmiz.",
            "Noto'g'ri o'rnatish yoki qo'pol muomala detalni obivkadan chiqmasdan buzishi mumkin — bunday holatda talab qabul qilinmaydi.",
            "Xitoy avtolari bo'yicha tajribali ustalarni tavsiya qilamiz. Noto'g'ri o'rnatish xavfi mijoz zimmasida.",
          ],
        },
        {
          title: "Javobgarlikni cheklash",
          paragraphs: [
            "Tasdiqlangan nuqson bo'yicha majburiyatlarimizdan tashqari bilvosita zarar uchun javobgar emasmiz.",
          ],
        },
        {
          title: "Aloqa",
          paragraphs: [
            "Buyurtma va tanlash — «Aloqa» sahifasidagi telefon va WhatsApp. Sayt xatosi — u yerda ko'rsatilgan qo'llab-quvvatlash raqami.",
          ],
        },
      ] as Section[],
      privacyLink: "Maxfiylik siyosati",
    },
  }[lang];

  return (
    <InnerPageLayout
      innerClassName="max-w-3xl mx-auto"
      breadcrumbs={[
        { label: tr(t.nav.home, lang), href: "/" },
        { label: c.title },
      ]}
      title={c.title}
      subtitle={c.subtitle}
    >
      <div className="surface-panel p-6 sm:p-8">
        <div className="legal-prose">
          {c.sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-2 text-lg font-bold text-[color:var(--text-charcoal)]">{section.title}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </section>
          ))}
          <p className="pt-2">
            <Link href="/privacy" className="link-accent font-semibold">
              {c.privacyLink}
            </Link>
          </p>
        </div>
      </div>
    </InnerPageLayout>
  );
}
