"use client";

import Link from "next/link";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";

type Section = { title: string; paragraphs: string[] };

export default function PrivacyPage() {
  const lang = useLang();
  const c = {
    ru: {
      title: "Политика конфиденциальности",
      subtitle: "Как мы собираем, используем и храним ваши персональные данные на chparts.kz.",
      note:
        "Вопросы по гарантии, возврату и монтажу описаны в разделе «Условия использования» и на странице «О нас» — это отдельные правила покупки, не политика данных.",
      noteLinkTerms: "Условия использования",
      noteLinkAbout: "О нас",
      sections: [
        {
          title: "Какие данные мы получаем",
          paragraphs: [
            "При оформлении заказа вы указываете имя, телефон, адрес или способ получения, комментарий к заказу. Мы также видим состав корзины, номер резерва и статус позиций при синхронизации с складом.",
            "Технически браузер может сохранять локально историю заказов в разделе «Мои заказы», товары в корзине и избранном — без регистрации и личного кабинета.",
          ],
        },
        {
          title: "Зачем это нужно",
          paragraphs: [
            "Данные используются только для связи с вами, подбора и резерва запчастей, доставки или выдачи в офисе и уточнения статуса заказа.",
            "Мы не используем ваши контакты для массовой рекламной рассылки без отдельного согласия.",
          ],
        },
        {
          title: "Передача третьим лицам",
          paragraphs: [
            "Мы можем передать адрес и телефон службе доставки или курьеру только для выполнения вашего заказа. Данные не продаются и не передаются для сторонней рекламы.",
          ],
        },
        {
          title: "Срок хранения",
          paragraphs: [
            "Данные заказа хранятся столько, сколько нужно для исполнения обязательств, учёта резервов и разбора обращений. По запросу можно уточнить актуальность записи.",
          ],
        },
        {
          title: "Ваши права",
          paragraphs: [
            "Вы можете запросить уточнение или удаление переданных данных, если заказ уже выполнен или отменён. Напишите или позвоните через страницу «Контакты» — укажите номер резерва или телефон из заявки.",
          ],
        },
        {
          title: "Изменения политики",
          paragraphs: [
            "Актуальная версия всегда опубликована на этой странице. Продолжая пользоваться сайтом после обновления, вы соглашаетесь с новой редакцией.",
          ],
        },
      ] as Section[],
    },
    kz: {
      title: "Құпиялылық саясаты",
      subtitle: "chparts.kz сайтында жеке деректерді қалай жинаймыз, пайдаланамыз және сақтаймыз.",
      note:
        "Кепілдік, қайтару және орнату ережелері «Пайдалану шарттарында» және «Біз туралы» бетінде — бұл сатып алу ережелері, деректер саясаты емес.",
      noteLinkTerms: "Пайдалану шарттары",
      noteLinkAbout: "Біз туралы",
      sections: [
        {
          title: "Қандай деректер аламыз",
          paragraphs: [
            "Тапсырыс бергенде аты, телефон, мекенжай, алу тәсілі және түсініктеме көрсетесіз. Себет құрамы, резерв нөмірі және қойма статустары көрінеді.",
            "«Менің тапсырыстарым», себет және таңдаулылар браузерде локалды сақталуы мүмкін — аккаунтсыз.",
          ],
        },
        {
          title: "Неге қажет",
          paragraphs: [
            "Тек байланыс, бөлшек іріктеу, резерв, жеткізу немесе кеңседе беру және статус үшін.",
            "Келісімсіз жарнамалық хабарлама жібермейміз.",
          ],
        },
        {
          title: "Үшінші тарапқа беру",
          paragraphs: ["Жеткізу үшін ғана мекенжай мен телефон берілуі мүмкін. Деректер сатылмайды."],
        },
        {
          title: "Сақтау мерзімі",
          paragraphs: ["Тапсырыс орындалғанша және заңды міндеттемелер үшін қажет уақыт бойы."],
        },
        {
          title: "Құқықтарыңыз",
          paragraphs: ["Деректерді нақтылау немесе жоюды «Байланыс» арқылы сұрауға болады — резерв нөмірін көрсетіңіз."],
        },
        {
          title: "Өзгерістер",
          paragraphs: ["Жаңа редакция осы бетте жарияланады."],
        },
      ] as Section[],
    },
    uz: {
      title: "Maxfiylik siyosati",
      subtitle: "chparts.kz saytida shaxsiy ma'lumotlarni qanday yig'amiz, ishlatamiz va saqlaymiz.",
      note:
        "Kafolat, qaytarish va o'rnatish qoidalari «Foydalanish shartlari» va «Biz haqimizda» sahifalarida — bu xarid qoidalari, ma'lumotlar siyosati emas.",
      noteLinkTerms: "Foydalanish shartlari",
      noteLinkAbout: "Biz haqimizda",
      sections: [
        {
          title: "Qanday ma'lumotlar olamiz",
          paragraphs: [
            "Buyurtma berishda ism, telefon, manzil, olish usuli va izoh ko'rsatasiz. Savat tarkibi, rezerv raqami va ombor statuslari ko'rinadi.",
            "«Buyurtmalarim», savat va sevimlilar brauzerda mahalliy saqlanishi mumkin — akkauntsiz.",
          ],
        },
        {
          title: "Nima uchun kerak",
          paragraphs: [
            "Faqat bog'lanish, detal tanlash, rezerv, yetkazib berish yoki ofisda berish va status uchun.",
            "Alohida roziliksiz reklama xabarlarini yubormaymiz.",
          ],
        },
        {
          title: "Uchinchi tomonga berish",
          paragraphs: ["Yetkazib berish uchun faqat manzil va telefon berilishi mumkin. Ma'lumotlar sotilmaydi."],
        },
        {
          title: "Saqlash muddati",
          paragraphs: ["Buyurtma bajarilguncha va qonuniy majburiyatlar uchun kerak bo'lgan vaqt davomida."],
        },
        {
          title: "Sizning huquqlaringiz",
          paragraphs: ["Ma'lumotlarni aniqlashtirish yoki o'chirishni «Aloqa» orqali so'rashingiz mumkin — rezerv raqamini ko'rsating."],
        },
        {
          title: "O'zgarishlar",
          paragraphs: ["Yangi tahrir har doim shu sahifada e'lon qilinadi."],
        },
      ] as Section[],
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
        <p className="mb-6 rounded-xl border border-black/[0.08] bg-[color:var(--surface-light)] px-4 py-3 text-sm leading-relaxed text-[color:var(--text-secondary)]">
          {c.note}{" "}
          <Link href="/terms" className="link-accent font-semibold">
            {c.noteLinkTerms}
          </Link>
          {" · "}
          <Link href="/about" className="link-accent font-semibold">
            {c.noteLinkAbout}
          </Link>
        </p>
        <div className="legal-prose">
          {c.sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-2 text-lg font-bold text-[color:var(--text-charcoal)]">{section.title}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </InnerPageLayout>
  );
}
