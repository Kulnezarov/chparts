"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Loader2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useUiStore } from "@/store/uiStore";
import { useCartStore } from "@/store/cartStore";
import { useLang } from "@/lib/useLang";
import { createPublicOrder, type PublicDeliveryType, type PublicPaymentType } from "@/lib/publicApi";
import { appendPaymentToComment, buildOrderComment, type OrderCommentLabels } from "@/lib/buildOrderComment";
import { formatKzRuPhoneDisplay, isKzRuPhoneComplete, normalizeKzRuPhoneDigits } from "@/lib/phoneMask";
import { isHttpError } from "@/lib/httpError";
import { useOrdersStore } from "@/store/ordersStore";
import ProductImage from "@/components/ui/ProductImage";
import CitySearchField from "@/components/cart/CitySearchField";
import { siteAddress } from "@/lib/siteContacts";

type DeliveryMode = "pickup" | "shymkent" | "kz";

const labelsByLang = {
  ru: {
    title: "Корзина",
    itemsCount: (n: number) => `${n} ${n === 1 ? "позиция" : n < 5 ? "позиции" : "позиций"}`,
    empty: "Корзина пуста",
    emptyHint: "Добавьте запчасти из каталога — оформим резерв за минуту.",
    toCatalog: "В каталог",
    name: "Имя",
    phone: "Телефон",
    delivery: "Способ получения",
    pickup: "Самовывоз",
    pickupHint: "Офис по адресу на странице «Контакты»",
    shymkent: "Доставка по Шымкенту",
    kazakhstan: "Доставка по РК",
    address: "Адрес в Шымкенте",
    city: "Город",
    details: "Адрес / отделение",
    comment: "Комментарий (необязательно)",
    payment: "Оплата",
    payCard: "Перевод на карту",
    payCash: "Наличные",
    submit: "Оформить заказ",
    processing: "Отправка…",
    total: "Итого",
    fail: "Не удалось оформить. Попробуйте позже или позвоните нам.",
    failStock: "Не удалось оформить: по одному из товаров не хватает остатка. Обновите корзину или позвоните нам.",
    failValidation: "Проверьте данные заказа и попробуйте ещё раз.",
    failNotFound: "Не удалось оформить: один из товаров больше недоступен. Удалите его из корзины и добавьте заново из каталога.",
    failRateLimit: "Слишком много попыток оформления. Подождите минуту и попробуйте снова.",
    failDetails: (status: number, detail?: string) =>
      `Не удалось оформить. Код ошибки: ${status}${detail ? ` · ${detail}` : ""}`,
    failNetwork: "Не удалось оформить: нет ответа от сервера. Проверьте интернет или попробуйте позже.",
    errName: "Укажите имя",
    errPhone: "Введите телефон полностью",
    errAddress: "Укажите адрес доставки",
    errCity: "Укажите город",
    errDetails: "Укажите адрес или отделение",
    successTitle: "Заказ принят",
    successHint: "Менеджер свяжется с вами для подтверждения и уточнения доставки.",
    reserve: "Резерв",
    continue: "Продолжить покупки",
    orders: "Мои заказы",
    remove: "Удалить",
    clear: "Очистить корзину",
    privacyNote: "Нажимая «Оформить», вы соглашаетесь с условиями сайта.",
    checkoutTitle: "Данные для заказа",
    itemsTitle: "Товары",
    showItems: "Показать товары",
    hideItems: "Скрыть товары",
    perItem: "за 1 шт",
  },
  kz: {
    title: "Себет",
    itemsCount: (n: number) => `${n} позиция`,
    empty: "Себет бос",
    emptyHint: "Каталогтан бөлшек қосыңыз — резерв бір минутта.",
    toCatalog: "Каталогқа",
    name: "Аты",
    phone: "Телефон",
    delivery: "Алу тәсілі",
    pickup: "Алып кету",
    pickupHint: "Мекенжай — «Байланыс» бетінде",
    shymkent: "Шымкент бойынша жеткізу",
    kazakhstan: "ҚР бойынша жеткізу",
    address: "Шымкенттегі мекенжай",
    city: "Қала",
    details: "Мекенжай / бөлімше",
    comment: "Түсініктеме (міндетті емес)",
    payment: "Төлем",
    payCard: "Картаға аударым",
    payCash: "Қолма-қол",
    submit: "Тапсырыс беру",
    processing: "Жіберілуде…",
    total: "Барлығы",
    fail: "Тапсырыс сәтсіз. Кейінірек қайталаңыз.",
    failStock: "Тапсырыс беру мүмкін болмады: бір тауардың қоймадағы саны жеткіліксіз.",
    failValidation: "Тапсырыс деректерін тексеріп, қайта көріңіз.",
    failNotFound: "Тапсырыс беру мүмкін болмады: бір тауар енді қолжетімсіз. Оны себеттен алып, каталогтан қайта қосыңыз.",
    failRateLimit: "Тапсырыс беру әрекеті тым көп. Бір минут күтіп, қайта көріңіз.",
    failDetails: (status: number, detail?: string) =>
      `Тапсырыс беру мүмкін болмады. Қате коды: ${status}${detail ? ` · ${detail}` : ""}`,
    failNetwork: "Тапсырыс беру мүмкін болмады: серверден жауап жоқ. Интернетті тексеріп, қайта көріңіз.",
    errName: "Атыңызды жазыңыз",
    errPhone: "Телефонды толық енгізіңіз",
    errAddress: "Мекенжайды жазыңыз",
    errCity: "Қаланы жазыңыз",
    errDetails: "Мекенжайды жазыңыз",
    successTitle: "Тапсырыс қабылданды",
    successHint: "Менеджер растау үшін хабарласады.",
    reserve: "Резерв",
    continue: "Сатып алуды жалғастыру",
    orders: "Тапсырыстар",
    remove: "Жою",
    clear: "Себетті тазалау",
    privacyNote: "«Тапсырыс беру» — сайт шарттарымен келісесіз.",
    checkoutTitle: "Тапсырыс деректері",
    itemsTitle: "Тауарлар",
    showItems: "Тауарларды көрсету",
    hideItems: "Тауарларды жасыру",
    perItem: "1 дана үшін",
  },
  uz: {
    title: "Сават",
    itemsCount: (n: number) => `${n} ta pozitsiya`,
    empty: "Сavат бош",
    emptyHint: "Katalogdan detal qo'shing — bir daqiqada rezerv qilamiz.",
    toCatalog: "Katalog",
    name: "Ism",
    phone: "Telefon",
    delivery: "Olish usuli",
    pickup: "O'zi olib ketish",
    pickupHint: "Manzil «Aloqa» sahifasida",
    shymkent: "Chimkent bo'ylab yetkazib berish",
    kazakhstan: "Qozog'iston bo'ylab yetkazib berish",
    address: "Chimkentdagi manzil",
    city: "Shahar",
    details: "Manzil / bo'lim",
    comment: "Izoh (ixtiyoriy)",
    payment: "To'lov",
    payCard: "Kartaga o'tkazma",
    payCash: "Naqd pul",
    submit: "Buyurtma berish",
    processing: "Yuborilmoqda…",
    total: "Jami",
    fail: "Buyurtma yuborilmadi. Keyinroq urinib ko'ring yoki qo'ng'iroq qiling.",
    failStock: "Buyurtma yuborilmadi: mahsulotlardan birining ombordagi soni yetarli emas.",
    failValidation: "Buyurtma ma'lumotlarini tekshirib, qayta urinib ko'ring.",
    failNotFound: "Buyurtma yuborilmadi: mahsulotlardan biri endi mavjud emas. Uni savatdan olib, katalogdan qayta qo'shing.",
    failRateLimit: "Buyurtma urinishlari juda ko'p. Bir daqiqa kutib, qayta urinib ko'ring.",
    failDetails: (status: number, detail?: string) =>
      `Buyurtma yuborilmadi. Xato kodi: ${status}${detail ? ` · ${detail}` : ""}`,
    failNetwork: "Buyurtma yuborilmadi: serverdan javob yo'q. Internetni tekshirib, qayta urinib ko'ring.",
    errName: "Ismingizni yozing",
    errPhone: "Telefonni to'liq kiriting",
    errAddress: "Yetkazib berish manzilini yozing",
    errCity: "Shaharni tanlang",
    errDetails: "Manzil yoki bo'limni yozing",
    successTitle: "Buyurtma qabul qilindi",
    successHint: "Menejer tasdiqlash va yetkazib berishni aniqlash uchun bog'lanadi.",
    reserve: "Rezerv",
    continue: "Xaridni davom ettirish",
    orders: "Buyurtmalarim",
    remove: "O'chirish",
    clear: "Savatni tozalash",
    privacyNote: "«Buyurtma berish» — sayt shartlariga rozisiz.",
    checkoutTitle: "Buyurtma ma'lumotlari",
    itemsTitle: "Tovarlar",
    showItems: "Tovarlarni ko'rsatish",
    hideItems: "Tovarlarni yashirish",
    perItem: "1 dona",
  },
};

export default function CartDrawer() {
  const lang = useLang();
  const labels = labelsByLang[lang];
  const open = useUiStore((s) => s.cartOpen);
  const setCartOpen = useUiStore((s) => s.setCartOpen);
  const { items, increase, decrease, remove, clear } = useCartStore();
  const addSavedOrder = useOrdersStore((s) => s.addOrder);

  useEffect(() => {
    if (!open) return;
    setItemsOpen(false);
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setCartOpen]);

  const [name, setName] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("7");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("pickup");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [details, setDetails] = useState("");
  const [userComment, setUserComment] = useState("");
  const [paymentType, setPaymentType] = useState<PublicPaymentType>("card");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ reserveId: number } | null>(null);
  const [itemsOpen, setItemsOpen] = useState(false);

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);
  const itemUnits = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

  const deliveryType: PublicDeliveryType =
    deliveryMode === "pickup" ? "pickup" : deliveryMode === "shymkent" ? "city" : "post";

  const commentLabels: OrderCommentLabels = {
    blockTitle: lang === "uz" ? "[Yetkazib berish]" : lang === "kz" ? "[Жеткізу]" : "[Доставка]",
    methodLabel: lang === "uz" ? "Usul" : lang === "kz" ? "Тәсіл" : "Способ",
    pickup: labels.pickup,
    cityDelivery: labels.shymkent,
    postDelivery: labels.kazakhstan,
    addressLabel: lang === "uz" ? "Manzil" : lang === "kz" ? "Мекенжай" : "Адрес",
    cityLabel: labels.city,
    detailsLabel: labels.details,
  };

  const paymentLabels = {
    blockTitle: lang === "uz" ? "[To'lov]" : lang === "kz" ? "[Төлем]" : "[Оплата]",
    methodLabel: lang === "uz" ? "Usul" : lang === "kz" ? "Тәсіл" : "Способ",
    card: labels.payCard,
    cash: labels.payCash,
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = labels.errName;
    if (!isKzRuPhoneComplete(phoneDigits)) e.phone = labels.errPhone;
    if (deliveryMode === "shymkent" && !address.trim()) e.address = labels.errAddress;
    if (deliveryMode === "kz") {
      if (!city.trim()) e.city = labels.errCity;
      if (!details.trim()) e.details = labels.errDetails;
    }
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setSubmitError(null);
    if (!items.length || !validate()) return;

    let comment = buildOrderComment(
      userComment,
      deliveryType,
      deliveryMode === "pickup"
        ? { address: siteAddress(lang) }
        : deliveryMode === "shymkent"
          ? { address: address.trim() }
          : { city: city.trim(), details: details.trim() },
      commentLabels,
    );
    comment = appendPaymentToComment(comment, paymentType, paymentLabels);

    const deliverySummary =
      deliveryMode === "pickup"
        ? labels.pickup
        : deliveryMode === "shymkent"
          ? `${labels.shymkent}: ${address.trim()}`
          : `${labels.kazakhstan}: ${city.trim()}`;

    setIsSubmitting(true);
    try {
      const orderTotal = total;
      const normalizedPhone = normalizeKzRuPhoneDigits(phoneDigits);
      const response = await createPublicOrder({
        customer_name: name.trim(),
        customer_phone: `+${normalizedPhone}`,
        comment,
        items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
        delivery_type: deliveryType,
        delivery_address: deliveryMode === "shymkent" ? address.trim() : null,
        delivery_city: deliveryMode === "kz" ? city.trim() : deliveryMode === "shymkent" ? "Шымкент" : null,
        delivery_details: deliveryMode === "kz" ? details.trim() : null,
        payment_type: paymentType,
      });

      addSavedOrder({
        reserveId: response.reserve_id,
        total: orderTotal,
        deliverySummary,
        paymentSummary: paymentType === "cash" ? labels.payCash : labels.payCard,
        deliveryType,
        paymentType,
        customerPhone: phoneDigits,
        lines: items.map((item) => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.imageUrl,
          barcode: item.barcode ?? null,
          sku: item.sku ?? null,
          brandName: item.brandName ?? null,
          categoryName: item.categoryName ?? null,
        })),
      });

      clear();
      setSuccess({ reserveId: response.reserve_id });
      setName("");
      setPhoneDigits("7");
      setAddress("");
      setCity("");
      setDetails("");
      setUserComment("");
      setDeliveryMode("pickup");
      setPaymentType("card");
    } catch (err) {
      if (isHttpError(err) && err.status === 409) {
        setItemsOpen(true);
        setSubmitError(labels.failStock);
      } else if (isHttpError(err) && err.status === 404) {
        setItemsOpen(true);
        setSubmitError(labels.failNotFound);
      } else if (isHttpError(err) && err.status === 429) {
        setSubmitError(labels.failRateLimit);
      } else if (isHttpError(err) && (err.status === 400 || err.status === 422)) {
        setSubmitError(labels.failValidation);
      } else if (isHttpError(err)) {
        setSubmitError(labels.failDetails(err.status, err.detail));
      } else {
        setSubmitError(labels.failNetwork);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const close = () => {
    setCartOpen(false);
    setTimeout(() => {
      if (!useCartStore.getState().items.length) setSuccess(null);
    }, 400);
  };

  const deliveryOptions: { id: DeliveryMode; label: string }[] = [
    { id: "pickup", label: labels.pickup },
    { id: "shymkent", label: labels.shymkent },
    { id: "kz", label: labels.kazakhstan },
  ];

  const panel = (
    <AnimatePresence mode="wait">
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={labels.title}
            className="fixed inset-y-0 right-0 z-[160] flex w-full max-w-none flex-col border-l border-black/[0.08] bg-white shadow-2xl sm:max-w-xl lg:max-w-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <div className="flex items-start justify-between gap-2 border-b border-black/[0.06] px-4 py-4 sm:gap-3 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{labels.title}</h2>
                {items.length > 0 && !success && (
                  <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold">
                    <span className="rounded-full bg-[color:var(--surface-light)] px-2 py-1 text-[color:var(--text-secondary)] sm:px-2.5">
                      {labels.itemsCount(itemUnits)}
                    </span>
                    <span className="rounded-full bg-[color:var(--site-accent-soft)] px-2 py-1 text-[color:var(--site-accent)] sm:px-2.5">
                      {total.toLocaleString("ru-RU")} ₸
                    </span>
                  </div>
                )}
              </div>
              <div className="flex shrink-0 items-start gap-1">
                {items.length > 0 && !success && (
                  <button
                    type="button"
                    onClick={clear}
                    className="rounded-lg px-1.5 py-1.5 text-[11px] font-medium text-rose-600 hover:bg-rose-50 sm:px-2 sm:text-xs"
                  >
                    {labels.clear}
                  </button>
                )}
                <button
                  type="button"
                  onClick={close}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.05] sm:h-10 sm:w-10"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              {success ? (
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <motion.div
                    className="flex min-h-[50vh] flex-col items-center justify-center text-center"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                  >
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--success-soft)] text-[color:var(--success)]">
                      <ShoppingBag size={36} />
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight">{labels.successTitle}</h3>
                    <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{labels.successHint}</p>
                    <p className="mt-6 text-sm font-medium text-[color:var(--text-tertiary)]">
                      {labels.reserve} #{success.reserveId}
                    </p>
                    <div className="mt-8 flex w-full max-w-xs flex-col gap-2">
                      <button
                        type="button"
                        className="btn-primary w-full"
                        onClick={() => {
                          setSuccess(null);
                          close();
                        }}
                      >
                        {labels.continue}
                      </button>
                      <Link href="/orders" className="btn-secondary w-full text-center" onClick={close}>
                        {labels.orders}
                      </Link>
                    </div>
                  </motion.div>
                </div>
              ) : items.length === 0 ? (
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
                    <ShoppingBag size={48} className="text-[color:var(--text-tertiary)] opacity-50" />
                    <p className="mt-4 font-medium">{labels.empty}</p>
                    <p className="mt-2 max-w-xs text-sm text-[color:var(--text-secondary)]">{labels.emptyHint}</p>
                    <Link href="/catalog" className="btn-primary mt-6" onClick={close}>
                      {labels.toCatalog}
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                  <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                    <div className="rounded-2xl border border-black/[0.06] bg-[color:var(--surface-light)]/70 p-2">
                      <button
                        type="button"
                        onClick={() => setItemsOpen((v) => !v)}
                        className="flex w-full flex-col items-start gap-2 rounded-xl bg-white px-3.5 py-3 text-left shadow-sm shadow-black/[0.02] min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between min-[380px]:gap-3"
                        aria-expanded={itemsOpen}
                      >
                        <span className="min-w-0 max-w-full">
                          <span className="block text-sm font-semibold text-[color:var(--text-charcoal)]">{labels.itemsTitle}</span>
                          <span className="mt-0.5 block truncate text-xs text-[color:var(--text-secondary)]">
                            {labels.itemsCount(itemUnits)} · {total.toLocaleString("ru-RU")} ₸
                          </span>
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[color:var(--site-accent-soft)] px-3 py-1.5 text-xs font-semibold text-[color:var(--site-accent)]">
                          {itemsOpen ? labels.hideItems : labels.showItems}
                          <ChevronDown
                            size={14}
                            className={`transition-transform ${itemsOpen ? "rotate-180" : ""}`}
                            aria-hidden
                          />
                        </span>
                      </button>

                      {itemsOpen && (
                      <ul className="mt-2 max-h-[min(42vh,320px)] space-y-3 overflow-y-auto rounded-xl">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="flex gap-3 rounded-[18px] border border-black/[0.06] bg-white p-3 shadow-sm shadow-black/[0.02]"
                        >
                          <Link
                            href={`/catalog/${item.id}`}
                            onClick={close}
                            className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#ebebed] sm:h-[4.5rem] sm:w-[4.5rem]"
                          >
                            <ProductImage src={item.imageUrl} alt={item.name} />
                          </Link>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2">
                              <Link
                                href={`/catalog/${item.id}`}
                                onClick={close}
                                className="line-clamp-2 min-w-0 flex-1 text-[15px] font-semibold leading-snug hover:text-[color:var(--site-accent)]"
                              >
                                {item.name}
                              </Link>
                              <button
                                type="button"
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[color:var(--text-tertiary)] transition-colors hover:bg-rose-50 hover:text-rose-600"
                                onClick={() => remove(item.id)}
                                aria-label={labels.remove}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <p className="mt-1 text-base font-bold tabular-nums text-[color:var(--text-charcoal)]">
                              {item.price.toLocaleString("ru-RU")} ₸
                              <span className="ml-1 text-xs font-medium text-[color:var(--text-silver)]">
                                {labels.perItem}
                              </span>
                            </p>
                            <div className="mt-2.5 inline-flex items-center rounded-full bg-black/[0.04] p-1">
                              <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[color:var(--text-charcoal)] shadow-sm disabled:opacity-40"
                                onClick={() => decrease(item.id)}
                                aria-label="-"
                              >
                                <Minus size={15} />
                              </button>
                              <span className="min-w-[2.25rem] text-center text-sm font-bold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[color:var(--text-charcoal)] shadow-sm disabled:opacity-40"
                                onClick={() => increase(item.id)}
                                disabled={item.quantity >= item.available}
                                aria-label="+"
                              >
                                <Plus size={15} />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                      </ul>
                      )}
                    </div>

                    <div className="space-y-4 border-t border-black/[0.06] pt-5 sm:space-y-5 sm:pt-6">
                      <h3 className="text-sm font-semibold text-[color:var(--text-charcoal)]">{labels.checkoutTitle}</h3>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-[color:var(--text-secondary)]">
                          {labels.name}
                        </label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="input-catalog h-12 text-base"
                          autoComplete="name"
                          placeholder={labels.name}
                        />
                        {fieldErrors.name && <p className="mt-1.5 text-sm text-red-600">{fieldErrors.name}</p>}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-[color:var(--text-secondary)]">
                          {labels.phone}
                        </label>
                        <input
                          type="tel"
                          value={formatKzRuPhoneDisplay(phoneDigits)}
                          onFocus={() => {
                            if (!phoneDigits) setPhoneDigits("7");
                          }}
                          onChange={(e) => setPhoneDigits(normalizeKzRuPhoneDigits(e.target.value))}
                          className="input-catalog h-12 text-base"
                          autoComplete="tel"
                          placeholder="+7 (___) ___-__-__"
                        />
                        {fieldErrors.phone && <p className="mt-1.5 text-sm text-red-600">{fieldErrors.phone}</p>}
                      </div>

                      <div>
                        <span className="mb-2.5 block text-sm font-medium text-[color:var(--text-secondary)]">
                          {labels.delivery}
                        </span>
                        <div className="flex flex-col gap-2.5">
                          {deliveryOptions.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setDeliveryMode(opt.id)}
                              className={`rounded-xl border px-4 py-3.5 text-left text-base font-medium transition-colors ${
                                deliveryMode === opt.id
                                  ? "border-[color:var(--site-accent)]/30 bg-[color:var(--site-accent)]/8 text-[color:var(--text-charcoal)]"
                                  : "border-black/[0.08] bg-white text-[color:var(--text-secondary)] hover:border-black/[0.12]"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                        {deliveryMode === "pickup" && (
                          <p className="mt-2.5 text-sm leading-relaxed text-[color:var(--text-secondary)]">
                            {labels.pickupHint}: {siteAddress(lang)}
                          </p>
                        )}
                        {deliveryMode === "shymkent" && (
                          <div className="mt-3">
                            <input
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="input-catalog h-12 text-base"
                              placeholder={labels.address}
                            />
                            {fieldErrors.address && (
                              <p className="mt-1.5 text-sm text-red-600">{fieldErrors.address}</p>
                            )}
                          </div>
                        )}
                        {deliveryMode === "kz" && (
                          <div className="mt-3 space-y-2.5">
                            <CitySearchField
                              value={city}
                              onChange={setCity}
                              placeholder={labels.city}
                            />
                            {fieldErrors.city && <p className="text-sm text-red-600">{fieldErrors.city}</p>}
                            <input
                              value={details}
                              onChange={(e) => setDetails(e.target.value)}
                              className="input-catalog h-12 text-base"
                              placeholder={labels.details}
                            />
                            {fieldErrors.details && (
                              <p className="text-sm text-red-600">{fieldErrors.details}</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="mb-2.5 block text-sm font-medium text-[color:var(--text-secondary)]">
                          {labels.payment}
                        </span>
                        <div className="ios-segmented-control relative flex h-11 w-full items-center rounded-xl bg-[#767680]/[0.12] p-[3px]">
                          <motion.div
                            className="absolute bottom-[3px] top-[3px] rounded-[8px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                            layout
                            transition={{ type: "spring", stiffness: 450, damping: 32 }}
                            style={{
                              width: "calc(50% - 6px)",
                              left: paymentType === "card" ? "3px" : "calc(50% + 3px)",
                            }}
                          />
                          {(["card", "cash"] as const).map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setPaymentType(p)}
                              className={`relative z-10 flex-1 rounded-[8px] py-2 text-center text-sm font-semibold outline-none transition-colors select-none sm:text-base ${
                                paymentType === p ? "text-[color:var(--text-charcoal)]" : "text-[color:var(--text-silver)] hover:text-[color:var(--text-charcoal)]"
                              }`}
                            >
                              {p === "card" ? labels.payCard : labels.payCash}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-[color:var(--text-secondary)]">
                          {labels.comment}
                        </label>
                        <textarea
                          value={userComment}
                          onChange={(e) => setUserComment(e.target.value)}
                          className="input-textarea-catalog min-h-[5.5rem] text-base"
                          rows={3}
                        />
                      </div>

                      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
                    </div>
                  </div>

                  <div className="shrink-0 border-t border-black/[0.06] bg-white px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.06)] sm:px-6 sm:py-5 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                    <div className="mb-3 flex items-baseline justify-between gap-2 sm:mb-4">
                      <span className="text-base text-[color:var(--text-secondary)]">{labels.total}</span>
                      <span className="text-2xl font-bold tabular-nums sm:text-[1.75rem]">{total.toLocaleString("ru-RU")} ₸</span>
                    </div>
                    <button type="submit" className="btn-primary min-h-12 w-full text-base font-semibold sm:min-h-[3.25rem]" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 size={18} className="animate-spin" />
                          {labels.processing}
                        </span>
                      ) : (
                        labels.submit
                      )}
                    </button>
                    <p className="mx-auto mt-2 max-w-[15rem] text-center text-[10px] leading-snug text-[color:var(--text-tertiary)] sm:max-w-none sm:text-[11px] sm:leading-relaxed">
                      {labels.privacyNote}{" "}
                      <Link href="/terms" className="link-accent" onClick={close}>
                        →
                      </Link>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(panel, document.body);
}
