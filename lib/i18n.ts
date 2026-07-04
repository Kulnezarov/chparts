import type { Lang } from "@/store/langStore";

type Translatable = Record<Lang, string>;

export const t = {
  site: {
    wordmarkAccent: { ru: "CH", kz: "CH", uz: "CH" } as Translatable,
    wordmarkRest: { ru: "Parts", kz: "Parts", uz: "Parts" } as Translatable,
    tagline: {
      ru: "Автозапчасти · Шымкент",
      kz: "Автобөлшектер · Шымкент",
      uz: "Avto ehtiyot qismlar · Chimkent",
    } as Translatable,
  },
  ui: {
    noPhoto: { ru: "Нет фото", kz: "Сурет жоқ", uz: "Foto yo'q" } as Translatable,
    pcs: { ru: "шт.", kz: "дана", uz: "dona" } as Translatable,
    catalogErrorHint: {
      ru: "Проверьте соединение или попробуйте позже",
      kz: "Байланысты тексеріңіз немесе кейінірек әрекеттеніңіз",
      uz: "Internetni tekshiring yoki keyinroq urinib ko'ring",
    } as Translatable,
    catalogEmptyHint: {
      ru: "Смягчите фильтры или напишите нам — подберём",
      kz: "Сүзгілерді өзгертіңіз немесе жазыңыз — іріктейміз",
      uz: "Filtrlarni o'zgartiring yoki yozing — tanlab beramiz",
    } as Translatable,
    addedToCart: { ru: "Добавлено в корзину", kz: "Себетке қосылды", uz: "Savatga qo'shildi" } as Translatable,
    viewCart: { ru: "Корзина", kz: "Себет", uz: "Savat" } as Translatable,
    menuOpen: { ru: "Открыть меню", kz: "Мәзірді ашу", uz: "Menyuni ochish" } as Translatable,
    menuClose: { ru: "Закрыть меню", kz: "Мәзірді жабу", uz: "Menyuni yopish" } as Translatable,
    menuTitle: { ru: "Меню", kz: "Мәзір", uz: "Menyu" } as Translatable,
    featuredTitle: { ru: "В наличии сейчас", kz: "Қазір қолда", uz: "Hozir bor" } as Translatable,
    featuredAll: { ru: "Весь каталог", kz: "Барлық каталог", uz: "Butun katalog" } as Translatable,
    faqSearch: { ru: "Поиск по вопросам…", kz: "Сұрақтар бойынша іздеу…", uz: "Savollar bo'yicha izlash…" } as Translatable,
    faqExpandAll: { ru: "Развернуть все", kz: "Барлығын ашу", uz: "Hammasini ochish" } as Translatable,
    faqCollapseAll: { ru: "Свернуть", kz: "Жабу", uz: "Yopish" } as Translatable,
    ordersReservePlaceholder: { ru: "Номер резерва", kz: "Резерв нөмірі", uz: "Rezerv raqami" } as Translatable,
    ordersReserveFind: { ru: "Найти заказ", kz: "Тапсырысты табу", uz: "Buyurtmani topish" } as Translatable,
    whatsapp: { ru: "WhatsApp", kz: "WhatsApp", uz: "WhatsApp" } as Translatable,
    company: { ru: "Компания", kz: "Компания", uz: "Kompaniya" } as Translatable,
    searchPlaceholder: {
      ru: "Артикул или название детали…",
      kz: "Артикул немесе бөлшек атауы…",
      uz: "Artikul yoki detal nomi…",
    } as Translatable,
    toCatalog: { ru: "В каталог", kz: "Каталогқа", uz: "Katalogga" } as Translatable,
    whatsappPick: {
      ru: "Подобрать через WhatsApp",
      kz: "WhatsApp арқылы таңдау",
      uz: "WhatsApp orqali tanlash",
    } as Translatable,
  },
  hero: {
    title: {
      ru: "Запчасти для китайских авто. Просто. Быстро.",
      kz: "Қытай автоға бөлшектер. Қарапайым. Жылдам.",
      uz: "Xitoy avto uchun detallar. Oddiy. Tez.",
    } as Translatable,
    subtitle: {
      ru: "Шымкент · доставка по Казахстану · FAW, Changan, Dongfeng, Wuling",
      kz: "Шымкент · Қазақстан бойынша жеткізу · FAW, Changan, Dongfeng, Wuling",
      uz: "Chimkent · Qozog'iston bo'ylab yetkazib berish · FAW, Changan, Dongfeng, Wuling",
    } as Translatable,
    badgeWhatsapp: {
      ru: "Ответ в WhatsApp 5–20 мин",
      kz: "WhatsApp 5–20 мин",
      uz: "WhatsApp 5–20 daqiqada javob",
    } as Translatable,
    badgePickup: {
      ru: "Самовывоз: Исмаил ата 428",
      kz: "Өзі алу: Исмаил ата 428",
      uz: "O'zi olib ketish: Ismoil ata 428",
    } as Translatable,
    notFoundCta: {
      ru: "Не нашли деталь? Напишите артикул — подберём",
      kz: "Таппадыңыз ба? Артикулды жазыңыз",
      uz: "Detal topolmadingizmi? Artikulni yozing — tanlab beramiz",
    } as Translatable,
    brandsEyebrow: { ru: "Марки", kz: "Маркалар", uz: "Markalar" } as Translatable,
    brandsNote: {
      ru: "Подбор по артикулу, бренду и фото. Сначала проверяем совместимость, потом отправляем.",
      kz: "Артикул, бренд және фото бойынша таңдау. Алдымен сәйкестігін тексереміз, содан кейін жібереміз.",
      uz: "Artikul, brend va foto bo'yicha tanlash. Avval mosligini tekshiramiz, keyin yuboramiz.",
    } as Translatable,
  },
  homeWhy: {
    title: { ru: "Почему CHParts?", kz: "Неге CHParts?", uz: "Nega CHParts?" } as Translatable,
    delivery: {
      title: { ru: "Быстрая доставка", kz: "Жылдам жеткізу", uz: "Tez yetkazib berish" } as Translatable,
      desc: {
        ru: "По Шымкенту — от 1 часа, по Казахстану — от 1 дня.",
        kz: "Шымкент бойынша — 1 сағаттан, Қазақстан бойынша — 1 күннен.",
        uz: "Chimkent bo'ylab — 1 soatdan, Qozog'iston bo'ylab — 1 kundan.",
      } as Translatable,
    },
    quality: {
      title: { ru: "Гарантия качества", kz: "Сапа кепілдігі", uz: "Sifat kafolati" } as Translatable,
      desc: {
        ru: "Только оригиналы для китайских авто.",
        kz: "Қытай автоға арналған түпнұсқа бөлшектер.",
        uz: "Faqat xitoy avtomobillari uchun original detallar.",
      } as Translatable,
    },
    match: {
      title: { ru: "Подбор 1-в-1", kz: "1-ге-1 таңдау", uz: "1 ga 1 tanlash" } as Translatable,
      desc: {
        ru: "Менеджер перепроверит деталь перед отправкой.",
        kz: "Менеджер жібермес бұрын бөлшекті қайта тексереді.",
        uz: "Menejer yuborishdan oldin detalni qayta tekshiradi.",
      } as Translatable,
    },
  },
  notFound: {
    title: { ru: "Страница не найдена", kz: "Бет табылмады", uz: "Sahifa topilmadi" } as Translatable,
    desc: {
      ru: "Ссылка устарела или адрес введён с опечаткой. Перейдите в каталог или на главную.",
      kz: "Сілтеме ескірген немесе мекенжай қате. Каталогқа немесе басты бетке өтіңіз.",
      uz: "Havola eskirgan yoki manzil xato. Katalogga yoki bosh sahifaga o'ting.",
    } as Translatable,
    catalog: { ru: "В каталог", kz: "Каталогқа", uz: "Katalogga" } as Translatable,
    home: { ru: "На главную", kz: "Басты бетке", uz: "Bosh sahifaga" } as Translatable,
    cart: { ru: "Моя корзина", kz: "Себетім", uz: "Savatim" } as Translatable,
    help: { ru: "Нужна деталь?", kz: "Бөлшек керек пе?", uz: "Detal kerakmi?" } as Translatable,
    whatsapp: { ru: "Написать в WhatsApp", kz: "WhatsApp жазу", uz: "WhatsAppga yozish" } as Translatable,
  },
  nav: {
    home: { ru: "Главная", kz: "Басты бет", uz: "Bosh sahifa" } as Translatable,
    catalog: { ru: "Каталог", kz: "Каталог", uz: "Katalog" } as Translatable,
    about: { ru: "О нас", kz: "Біз туралы", uz: "Biz haqimizda" } as Translatable,
    help: { ru: "Помощь", kz: "Көмек", uz: "Yordam" } as Translatable,
    faq: { ru: "FAQ", kz: "FAQ", uz: "FAQ" } as Translatable,
    contacts: { ru: "Контакты", kz: "Байланыс", uz: "Aloqa" } as Translatable,
    orders: { ru: "Мои заказы", kz: "Тапсырыстар", uz: "Buyurtmalarim" } as Translatable,
    cart: { ru: "Корзина", kz: "Себет", uz: "Savat" } as Translatable,
    favorites: { ru: "Избранное", kz: "Таңдаулы", uz: "Sevimlilar" } as Translatable,
  },
  brands: {
    title: { ru: "Популярные марки", kz: "Танымал маркалар", uz: "Mashhur markalar" } as Translatable,
    subtitle: {
      ru: "Официальные поставщики и проверенные аналоги",
      kz: "Ресми жеткізушілер мен тексерілген сәйкес өнімдер",
      uz: "Rasmiy yetkazib beruvchilar va tekshirilgan analoglar",
    } as Translatable,
  },
  search: {
    title: { ru: "Найдите нужную запчасть", kz: "Қажетті бөлшекті табыңыз", uz: "Kerakli detalni toping" } as Translatable,
    subtitle: { ru: "Поиск по артикулу или названию детали", kz: "Артикул немесе бөлшек атауы бойынша іздеу", uz: "Artikul yoki detal nomi bo'yicha izlash" } as Translatable,
    placeholder: { ru: "Артикул или название...", kz: "Артикул немесе атауы...", uz: "Artikul yoki nomi..." } as Translatable,
    button: { ru: "Найти", kz: "Іздеу", uz: "Izlash" } as Translatable,
  },
  catalog: {
    title: { ru: "Каталог товаров", kz: "Тауарлар каталогы", uz: "Mahsulotlar katalogi" } as Translatable,
    goods: { ru: "товаров", kz: "тауар", uz: "mahsulot" } as Translatable,
    sectionsTitle: { ru: "Разделы каталога", kz: "Каталог бөлімдері", uz: "Katalog bo'limlari" } as Translatable,
    categoriesCount: { ru: "категорий", kz: "санат", uz: "kategoriya" } as Translatable,
    browse: { ru: "Смотреть", kz: "Қарау", uz: "Ko'rish" } as Translatable,
    subtitle: {
      ru: "Категории и быстрый переход в полный каталог",
      kz: "Санаттар және толық каталогқа жылдам өту",
      uz: "Kategoriyalar va to'liq katalogga tez o'tish",
    } as Translatable,
  },
  whyUs: {
    title: { ru: "Почему мы", kz: "Неліктен біз", uz: "Nega biz" } as Translatable,
    subtitle: {
      ru: "Работаем с запчастями для китайских авто: склад, доставка по РК, поддержка",
      kz: "Қытай авто бөлшектері: қойма, РК бойынша жеткізу, қолдау",
      uz: "Xitoy avto detallari: ombor, Qozog'iston bo'ylab yetkazib berish, yordam",
    } as Translatable,
    items: [
      {
        title: { ru: "Оригинальные запчасти", kz: "Түпнұсқа бөлшектер", uz: "Original detallar" } as Translatable,
        desc: { ru: "Только сертифицированные детали от официальных поставщиков", kz: "Тек ресми жеткізушілерден сертификатталған бөлшектер", uz: "Faqat rasmiy yetkazib beruvchilardan sertifikatlangan detallar" } as Translatable,
      },
      {
        title: { ru: "Быстрая доставка", kz: "Жылдам жеткізу", uz: "Tez yetkazib berish" } as Translatable,
        desc: { ru: "Доставка по всему Казахстану от 1 до 3 дней", kz: "Бүкіл Қазақстан бойынша 1-3 күнде жеткізу", uz: "Butun Qozog'iston bo'ylab 1–3 kun" } as Translatable,
      },
      {
        title: { ru: "Гарантия качества", kz: "Сапа кепілдігі", uz: "Sifat kafolati" } as Translatable,
        desc: { ru: "Гарантия на все запчасти от 6 месяцев до 2 лет", kz: "Барлық бөлшектерге 6 айдан 2 жылға дейін кепілдік", uz: "Barcha detallarga 6 oydan 2 yilgacha kafolat" } as Translatable,
      },
      {
        title: { ru: "Поддержка 24/7", kz: "24/7 қолдау", uz: "24/7 yordam" } as Translatable,
        desc: { ru: "Наши специалисты всегда готовы помочь с подбором", kz: "Біздің мамандар таңдауда әрдайым көмектесуге дайын", uz: "Mutaxassislarimiz tanlashda doim yordam berishga tayyor" } as Translatable,
      },
      {
        title: { ru: "Большой ассортимент", kz: "Үлкен ассортимент", uz: "Keng assortiment" } as Translatable,
        desc: { ru: "Более 500 000 позиций для китайских автомобилей", kz: "Қытай автомобильдері үшін 500 000-нан астам позиция", uz: "Xitoy avtomobillari uchun 500 000 dan ortiq pozitsiya" } as Translatable,
      },
      {
        title: { ru: "Выгодные цены", kz: "Тиімді бағалар", uz: "Qulay narxlar" } as Translatable,
        desc: { ru: "Прямые поставки без посредников — цены ниже рынка", kz: "Делдалсыз тікелей жеткізілімдер — нарықтан төмен бағалар", uz: "Vositachisiz to'g'ridan-to'g'ri yetkazib berish — bozordan arzon" } as Translatable,
      },
    ],
  },
  howToOrder: {
    title: { ru: "Как оформить заказ", kz: "Тапсырысты қалай рәсімдеу керек", uz: "Buyurtmani qanday rasmiylashtirish" } as Translatable,
    subtitle: {
      ru: "От поиска детали до получения — без лишних шагов",
      kz: "Бөлшекті табудан алуға дейін — артық қадамдарсыз",
      uz: "Detalni topishdan olishgacha — ortiqcha qadamssiz",
    } as Translatable,
    eyebrow: { ru: "4 шага", kz: "4 қадам", uz: "4 qadam" } as Translatable,
    steps: [
      {
        title: { ru: "Найдите деталь", kz: "Бөлшекті табыңыз", uz: "Detalni toping" } as Translatable,
        desc: { ru: "Введите артикул или название в строку поиска", kz: "Іздеу жолына артикул немесе атауды енгізіңіз", uz: "Izlash qatoriga artikul yoki nomini kiriting" } as Translatable,
      },
      {
        title: { ru: "Добавьте в корзину", kz: "Себетке қосыңыз", uz: "Savatga qo'shing" } as Translatable,
        desc: { ru: "Выберите нужную позицию и добавьте в корзину", kz: "Қажетті позицияны таңдап, себетке қосыңыз", uz: "Kerakli pozitsiyani tanlab, savatga qo'shing" } as Translatable,
      },
      {
        title: { ru: "Оформите заказ", kz: "Тапсырысты рәсімдеңіз", uz: "Buyurtmani rasmiylashtiring" } as Translatable,
        desc: { ru: "Укажите адрес доставки и выберите способ оплаты", kz: "Жеткізу мекенжайын көрсетіп, төлем тәсілін таңдаңыз", uz: "Yetkazib berish manzilini ko'rsating va to'lov usulini tanlang" } as Translatable,
      },
      {
        title: { ru: "Получите деталь", kz: "Бөлшекті алыңыз", uz: "Detalni oling" } as Translatable,
        desc: { ru: "Курьер доставит заказ прямо к вашей двери", kz: "Курьер тапсырысты тікелей есігіңізге жеткізеді", uz: "Kuryer buyurtmani eshigingizgacha yetkazadi" } as Translatable,
      },
    ],
  },
  footer: {
    slogan: {
      ru: "Инновационный подбор и доставка запчастей для китайских автомобилей в Казахстане",
      kz: "Қазақстанда қытай автомобильдеріне арналған бөлшектерді инновациялық іріктеу және жеткізу",
      uz: "Qozog'istonda xitoy avtomobillari uchun detallarni tanlash va yetkazib berish",
    } as Translatable,
    navAria: { ru: "Навигация", kz: "Навигация", uz: "Navigatsiya" } as Translatable,
    helpFaq: { ru: "Помощь / FAQ", kz: "Көмек / FAQ", uz: "Yordam / FAQ" } as Translatable,
    schedule: {
      ru: "Пн–Чт 10:00–20:00, Пт 14:00–20:00",
      kz: "Дс–Бс 10:00–20:00, Жм 14:00–20:00",
      uz: "Dush–Paysh 10:00–20:00, Juma 14:00–20:00",
    } as Translatable,
    desc: { ru: "Запчасти для китайских автомобилей. Быстро, надёжно, выгодно.", kz: "Қытай автомобильдеріне арналған бөлшектер. Жылдам, сенімді, тиімді.", uz: "Xitoy avtomobillari uchun detallar. Tez, ishonchli, qulay." } as Translatable,
    catalog: { ru: "Каталог", kz: "Каталог", uz: "Katalog" } as Translatable,
    about: { ru: "О компании", kz: "Компания туралы", uz: "Kompaniya haqida" } as Translatable,
    contacts: { ru: "Контакты", kz: "Байланыс", uz: "Aloqa" } as Translatable,
    rights: { ru: "Все права защищены", kz: "Барлық құқықтар қорғалған", uz: "Barcha huquqlar himoyalangan" } as Translatable,
    privacy: { ru: "Конфиденциальность", kz: "Құпиялылық", uz: "Maxfiylik" } as Translatable,
    terms: { ru: "Условия использования", kz: "Пайдалану шартлары", uz: "Foydalanish shartlari" } as Translatable,
    faqLink: { ru: "FAQ", kz: "FAQ", uz: "FAQ" } as Translatable,
  },
};

export function tr(obj: Translatable, lang: Lang): string {
  return obj[lang];
}
