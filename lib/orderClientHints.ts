import type { SiteLang } from "@/lib/siteContacts";

export type OrderStatusTone = "cancelled" | "fulfilled" | "pending";

export type OrderWarehouseStatus = {
  statusTitle: string;
  isCancelled: boolean;
  isFulfilled: boolean;
  cancellationReasonCode?: string | null;
  cancellationReasonTitle?: string | null;
  cancellationComment?: string | null;
};

export type OrderStatusPresentation = {
  tone: OrderStatusTone;
  title: string;
  message: string;
  hint: string;
};

const reasonHints: Record<
  string,
  Record<SiteLang, { message: string; hint: string }>
> = {
  wrong_product: {
    ru: {
      message: "В заявке указан неверный товар.",
      hint: "Оформите заказ заново с нужной позицией или напишите нам — поможем подобрать.",
    },
    kz: {
      message: "Өтінімде тауар дұрыс көрсетілмеген.",
      hint: "Дұрыс позициямен қайта тапсырыс беріңіз немесе бізге жазыңыз — көмектесеміз.",
    },
    uz: {
      message: "Arizada noto'g'ri tovar ko'rsatilgan.",
      hint: "To'g'ri pozitsiya bilan qayta buyurtma bering yoki bizga yozing — tanlashda yordam beramiz.",
    },
  },
  not_paid: {
    ru: {
      message: "Оплата не подтверждена.",
      hint: "Если хотите завершить заказ — свяжитесь с нами для уточнения оплаты.",
    },
    kz: {
      message: "Төлем расталмаған.",
      hint: "Тапсырысты аяқтағыңыз келсе — төлемді нақтылау үшін хабарласыңыз.",
    },
    uz: {
      message: "To'lov tasdiqlanmadi.",
      hint: "Buyurtmani yakunlamoqchi bo'lsangiz — to'lovni aniqlash uchun bog'laning.",
    },
  },
  invalid_contact_data: {
    ru: {
      message: "Не удалось связаться: некорректные контактные данные.",
      hint: "Проверьте имя и телефон, оформите заказ заново или напишите в WhatsApp.",
    },
    kz: {
      message: "Байланыс деректері дұрыс емес — хабарласа алмадық.",
      hint: "Аты мен телефонды тексеріп, қайта тапсырыс беріңіз немесе WhatsApp жазыңыз.",
    },
    uz: {
      message: "Bog'lanib bo'lmadi — aloqa ma'lumotlari noto'g'ri.",
      hint: "Ism va telefonni tekshiring, qayta buyurtma bering yoki WhatsAppga yozing.",
    },
  },
  not_reachable: {
    ru: {
      message: "Мы не смогли с вами связаться.",
      hint: "Напишите в WhatsApp или позвоните — подтвердим заказ в рабочее время.",
    },
    kz: {
      message: "Сізбен байланыса алмадық.",
      hint: "WhatsApp жазыңыз немесе қоңырау шалыңыз — жұмыс уақытында растаймыз.",
    },
    uz: {
      message: "Siz bilan bog'lana olmadik.",
      hint: "WhatsAppga yozing yoki qo'ng'iroq qiling — ish vaqtida tasdiqlaymiz.",
    },
  },
  out_of_stock: {
    ru: {
      message: "К сожалению, товар закончился на складе.",
      hint: "Выберите аналог в каталоге или спросите менеджера о поступлении.",
    },
    kz: {
      message: "Өкінішке орай, тауар қоймада жоқ.",
      hint: "Каталогтан баламасын таңдаңыз немесе менеджерден келуін сұраңыз.",
    },
    uz: {
      message: "Afsuski, tovar omborda tugagan.",
      hint: "Katalogdan analog tanlang yoki menejerdan kelishini so'rang.",
    },
  },
  client_refused: {
    ru: {
      message: "Заказ отменён по вашему запросу.",
      hint: "Новый заказ можно оформить в любое время через каталог.",
    },
    kz: {
      message: "Тапсырыс сіздің сұранысыңыз бойынша тоқтатылды.",
      hint: "Жаңа тапсырысты каталог арқылы кез келген уақытта рәсімдеуге болады.",
    },
    uz: {
      message: "Buyurtma sizning so'rovingiz bo'yicha bekor qilindi.",
      hint: "Yangi buyurtmani istalgan vaqtda katalog orqali berishingiz mumkin.",
    },
  },
  duplicate: {
    ru: {
      message: "Это дубль заявки.",
      hint: "Активный заказ обрабатывается отдельно. Уточните номер резерва у менеджера.",
    },
    kz: {
      message: "Бұл өтінімнің көшірмесі.",
      hint: "Белсенді тапсырыс бөлек өңделеді. Резерв нөмірін менеджерден нақтылаңыз.",
    },
    uz: {
      message: "Bu arizaning dublikati.",
      hint: "Faol buyurtma alohida ko'rib chiqiladi. Rezerv raqamini menejerdan aniqlang.",
    },
  },
  other: {
    ru: {
      message: "Заказ отменён магазином.",
      hint: "Подробности — в комментарии ниже или у менеджера в WhatsApp.",
    },
    kz: {
      message: "Тапсырыс дүкен тарапынан тоқтатылды.",
      hint: "Толығырақ — төмендегі түсініктемеде немесе WhatsApp арқылы.",
    },
    uz: {
      message: "Buyurtma do'kon tomonidan bekor qilindi.",
      hint: "Batafsil — quyidagi izohda yoki WhatsApp orqali.",
    },
  },
};

const fallbackCopy: Record<SiteLang, Record<OrderStatusTone, OrderStatusPresentation>> = {
  ru: {
    cancelled: {
      tone: "cancelled",
      title: "Заказ отменён",
      message: "Магазин не может выполнить этот заказ.",
      hint: "Если это ошибка или нужна помощь — напишите в WhatsApp с номером резерва.",
    },
    fulfilled: {
      tone: "fulfilled",
      title: "Заказ выполнен",
      message: "Товар выдан или передан вам.",
      hint: "Спасибо за покупку! По вопросам гарантии — «Контакты» или WhatsApp.",
    },
    pending: {
      tone: "pending",
      title: "Ожидает подтверждения",
      message: "Заявка принята. Менеджер проверит наличие и свяжется с вами.",
      hint: "Если долго нет ответа в рабочее время — напишите в WhatsApp с номером резерва.",
    },
  },
  kz: {
    cancelled: {
      tone: "cancelled",
      title: "Тапсырыс тоқтатылды",
      message: "Дүкен бұл тапсырысты орындай алмайды.",
      hint: "Қате болса немесе көмек керек болса — резерв нөмірімен WhatsApp жазыңыз.",
    },
    fulfilled: {
      tone: "fulfilled",
      title: "Тапсырыс орындалды",
      message: "Тауар берілді.",
      hint: "Сатып алғаныңызға рахмет! Кепілдік сұрақтары — «Байланыс» немесе WhatsApp.",
    },
    pending: {
      tone: "pending",
      title: "Растау күтілуде",
      message: "Өтінім қабылданды. Менеджер қолжетімділікті тексеріп, хабарласады.",
      hint: "Жұмыс уақытында ұзақ жауап болмаса — резерв нөмірімен WhatsApp жазыңыз.",
    },
  },
  uz: {
    cancelled: {
      tone: "cancelled",
      title: "Buyurtma bekor qilindi",
      message: "Do'kon bu buyurtmani bajara olmaydi.",
      hint: "Agar bu xato bo'lsa yoki yordam kerak bo'lsa — rezerv raqami bilan WhatsAppga yozing.",
    },
    fulfilled: {
      tone: "fulfilled",
      title: "Buyurtma bajarildi",
      message: "Tovar sizga topshirildi.",
      hint: "Xaridingiz uchun rahmat! Kafolat bo'yicha — «Aloqa» yoki WhatsApp.",
    },
    pending: {
      tone: "pending",
      title: "Tasdiq kutilmoqda",
      message: "Ariza qabul qilindi. Menejer mavjudlikni tekshiradi va bog'lanadi.",
      hint: "Ish vaqtida javob kechiksa — rezerv raqami bilan WhatsAppga yozing.",
    },
  },
};

export function getOrderStatusPresentation(
  lang: SiteLang,
  status: OrderWarehouseStatus | null | undefined,
): OrderStatusPresentation | null {
  if (!status) return null;

  if (status.isCancelled) {
    const base = fallbackCopy[lang].cancelled;
    const code = (status.cancellationReasonCode || "").trim();
    const reasonCopy = code ? reasonHints[code]?.[lang] : undefined;
    const reasonTitle = status.cancellationReasonTitle?.trim();
    let message = reasonCopy?.message ?? base.message;
    if (reasonTitle && code !== "other" && !reasonCopy) {
      const reasonLabel = lang === "kz" ? "Себебі" : lang === "uz" ? "Sababi" : "Причина";
      message = `${base.message} ${reasonLabel}: ${reasonTitle}.`;
    }
    const comment = status.cancellationComment?.trim();
    if (comment) {
      const label = lang === "kz" ? "Комментарий" : lang === "uz" ? "Izoh" : "Комментарий";
      message = `${message} ${label}: ${comment}`;
    }
    return {
      tone: "cancelled",
      title: status.statusTitle || base.title,
      message,
      hint: reasonCopy?.hint ?? base.hint,
    };
  }

  if (status.isFulfilled) {
    const base = fallbackCopy[lang].fulfilled;
    return {
      ...base,
      title: status.statusTitle || base.title,
    };
  }

  const base = fallbackCopy[lang].pending;
  return {
    ...base,
    title: status.statusTitle || base.title,
  };
}
