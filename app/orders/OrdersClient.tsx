"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, MessageCircle, Package, RefreshCw, Trash2, X } from "lucide-react";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { useOrdersStore, type SavedOrderLine } from "@/store/ordersStore";
import { fetchPublicReserveDetail, type PublicReserveDetail } from "@/lib/publicApi";
import { resolveLineStatusFromWarehouse, type OrderLineStatus } from "@/lib/reserveStatus";
import { getOrderStatusPresentation, type OrderWarehouseStatus } from "@/lib/orderClientHints";
import ProductImage from "@/components/ui/ProductImage";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { siteWhatsAppHrefWithText, whatsappPrefillReserveQuestion } from "@/lib/siteContacts";

const syncBannerCopy = {
  ru: {
    syncAllOk: "Статусы обновлены по всем резервам в списке.",
    syncPartial: (ok: number, fail: number) =>
      `Обновлено: ${ok}. Не получилось снять данные с сервера: ${fail}. Попробуйте позже или напишите в WhatsApp с номером резерва.`,
    syncAllFailed: "Статусы не обновлены. Проверьте сеть и попробуйте снова либо уточните у менеджера.",
  },
  kz: {
    syncAllOk: "Тізімдегі барлық резервтер бойынша статус жаңартылды.",
    syncPartial: (ok: number, fail: number) =>
      `Жаңартылды: ${ok}. Серверден алынбады: ${fail}. Кейінірек повторлаңыз немесе резерв нөмірімен WhatsApp жазыңыз.`,
    syncAllFailed: "Статус жаңартылмады. Желі немесе қосымша қайталаңыз.",
  },
  uz: {
    syncAllOk: "Ro'yxatdagi barcha rezervlar bo'yicha status yangilandi.",
    syncPartial: (ok: number, fail: number) =>
      `Yangilandi: ${ok}. Serverdan olinmadi: ${fail}. Keyinroq urinib ko'ring yoki rezerv raqami bilan WhatsAppga yozing.`,
    syncAllFailed: "Status yangilanmadi. Internetni tekshiring yoki qayta urinib ko'ring.",
  },
} as const;

function warehouseStatusFromDetail(d: PublicReserveDetail): OrderWarehouseStatus {
  return {
    statusTitle: d.status_title ?? "",
    isCancelled: d.is_cancelled === true,
    isFulfilled: d.is_fulfilled === true,
    cancellationReasonCode: d.cancellation_reason_code,
    cancellationReasonTitle: d.cancellation_reason_title,
    cancellationComment: d.cancellation_comment,
  };
}

export default function OrdersClient() {
  const lang = useLang();
  const orders = useOrdersStore((s) => s.orders);
  const removeOrder = useOrdersStore((s) => s.removeOrder);
  const clearAll = useOrdersStore((s) => s.clearAll);

  const [syncing, setSyncing] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [syncBanner, setSyncBanner] = useState<{ kind: "ok" | "partial" | "fail"; text: string } | null>(null);

  const syncFromWarehouse = useCallback(async () => {
    const list = useOrdersStore.getState().orders;
    if (list.length === 0) return;
    setSyncing(true);
    setSyncBanner(null);
    const merge = useOrdersStore.getState().mergeLineStatuses;
    const msgs = syncBannerCopy[lang];
    let updated = 0;
    let failed = 0;
    try {
      for (const o of list) {
        try {
          const detail = await fetchPublicReserveDetail(o.reserveId, o.customerPhone);
          if (detail?.lines.length) {
            merge(
              o.reserveId,
              detail.lines.map((l) => ({
                product_id: l.product_id,
                status: resolveLineStatusFromWarehouse({
                  rawStatus: l.status,
                  lineCancelled: l.is_cancelled,
                  orderCancelled: detail.is_cancelled,
                  orderFulfilled: detail.is_fulfilled,
                }),
                name: l.name,
                sku: l.sku,
                brandName: l.brand_name,
                categoryName: l.category_name,
              })),
              warehouseStatusFromDetail(detail),
            );
            updated++;
          } else {
            failed++;
          }
        } catch {
          failed++;
        }
      }
    } finally {
      setSyncing(false);
    }
    if (updated > 0 && failed === 0) {
      setSyncBanner({ kind: "ok", text: msgs.syncAllOk });
    } else if (updated > 0 && failed > 0) {
      setSyncBanner({ kind: "partial", text: msgs.syncPartial(updated, failed) });
    } else {
      setSyncBanner({ kind: "fail", text: msgs.syncAllFailed });
    }
  }, [lang]);

  const didAutoSync = useRef(false);
  useEffect(() => {
    if (didAutoSync.current || orders.length === 0) return;
    didAutoSync.current = true;
    void syncFromWarehouse();
  }, [orders.length, syncFromWarehouse]);

  const content = {
    ru: {
      empty: "Пока нет оформленных заказов.",
      emptyHint: "Оформите заказ в корзине — он появится здесь. Подтверждение и чек придут в WhatsApp.",
      toCart: "В корзину",
      toCatalog: "Каталог",
      reserve: "Резерв",
      delivery: "Доставка",
      payment: "Оплата",
      positions: "Позиции",
      clearAll: "Очистить список",
      clearTitle: "Очистить весь список?",
      clearDescription:
        "Список хранится только в этом браузере на устройстве, без личного кабинета. Очистка не отменяет заказ на стороне магазина. Номер резерва можно снова уточнить у менеджера.",
      clearCancel: "Отмена",
      clearAction: "Очистить",
      linkPrivacy: "/privacy",
      privacyLabel: "Политика конфиденциальности",
      localDisclaimer:
        "Список хранится в этом браузере на устройстве. При смене телефона или очистке данных он может пропасть — номер резерва всегда можно уточнить в WhatsApp или на странице «Контакты».",
      listCount: (n: number) => `В списке: ${n}`,
      syncDismiss: "Скрыть",
      remove: "Удалить",
      refresh: "Обновить",
      refreshing: "Обновление…",
      stPending: "В обработке",
      stCancelled: "Отменено",
      stIssued: "Выдано",
      labelSku: "Артикул",
      labelProductId: "ID",
    },
    kz: {
      empty: "Әлі тапсырыс жоқ.",
      emptyHint: "Себеттен тапсырыс рәсімдеңіз — ол осында шығады. Растау мен чек WhatsApp-қа келеді.",
      toCart: "Себетке",
      toCatalog: "Каталог",
      reserve: "Резерв",
      delivery: "Жеткізу",
      payment: "Төлем",
      positions: "Позициялар",
      clearAll: "Тізімді тазалау",
      clearTitle: "Тізімді тазалаймыз ба?",
      clearDescription:
        "Тізім осы құрылғыдағы браузерде сақталады, жеке кабинет жоқ. Тазалау дүкендеги тапсырысты кері алмайды. Резерв нөмірін менеджерден қайта сұрауға болады.",
      clearCancel: "Бас тарту",
      clearAction: "Тазалау",
      linkPrivacy: "/privacy",
      privacyLabel: "Құпиялылық саясаты",
      localDisclaimer:
        "Тізім осы браузерде сақталады. Құрылғы ауыстырғанда немесе деректер тазаласа — жоғалуы мүмкін. Резерв нөмірін WhatsApp немесе «Байланыс» арқылы нақтылауға болады.",
      listCount: (n: number) => `Тізімде: ${n}`,
      syncDismiss: "Жасыру",
      remove: "Жою",
      refresh: "Жаңарту",
      refreshing: "Жаңарту…",
      stPending: "Өңделуде",
      stCancelled: "Тоқтатылды",
      stIssued: "Берілді",
      labelSku: "Артикул",
      labelProductId: "ID",
    },
    uz: {
      empty: "Hali buyurtmalar yo'q.",
      emptyHint: "Savatdan buyurtma bering — u shu yerda paydo bo'ladi. Tasdiq va chek WhatsAppga keladi.",
      toCart: "Savatga",
      toCatalog: "Katalog",
      reserve: "Rezerv",
      delivery: "Yetkazib berish",
      payment: "To'lov",
      positions: "Pozitsiyalar",
      clearAll: "Ro'yxatni tozalash",
      clearTitle: "Butun ro'yxatni tozalaysizmi?",
      clearDescription:
        "Ro'yxat faqat shu qurilmadagi brauzerda saqlanadi, shaxsiy kabinet yo'q. Tozalash do'kondagi buyurtmani bekor qilmaydi. Rezerv raqamini menejerdan qayta so'rashingiz mumkin.",
      clearCancel: "Bekor qilish",
      clearAction: "Tozalash",
      linkPrivacy: "/privacy",
      privacyLabel: "Maxfiylik siyosati",
      localDisclaimer:
        "Ro'yxat shu brauzerda saqlanadi. Qurilmani almashtirsangiz yoki ma'lumotlarni tozalasaniz — yo'qolishi mumkin. Rezerv raqamini har doim WhatsApp yoki «Aloqa» orqali aniqlashingiz mumkin.",
      listCount: (n: number) => `Ro'yxatda: ${n}`,
      syncDismiss: "Yashirish",
      remove: "O'chirish",
      refresh: "Yangilash",
      refreshing: "Yangilanmoqda…",
      stPending: "Ko'rib chiqilmoqda",
      stCancelled: "Bekor qilindi",
      stIssued: "Berildi",
      labelSku: "Artikul",
      labelProductId: "ID",
    },
  }[lang];

  const locale = lang === "uz" ? "uz-UZ" : lang === "kz" ? "kk-KZ" : "ru-RU";

  const badgeClass = (s: OrderLineStatus | undefined) => {
    const v = s ?? "pending";
    if (v === "cancelled") return "bg-rose-100 text-rose-800 border-rose-200";
    if (v === "issued") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    return "bg-[color:var(--surface-light)] text-[color:var(--text-secondary)] border-black/[0.08]";
  };

  const badgeText = (s: OrderLineStatus | undefined) => {
    const v = s ?? "pending";
    if (v === "cancelled") return content.stCancelled;
    if (v === "issued") return content.stIssued;
    return content.stPending;
  };

  const renderLineRow = (line: SavedOrderLine, oLocalId: string) => (
    <li
      key={`${oLocalId}-${line.product_id}`}
      className="flex gap-3.5 rounded-xl border border-black/[0.06] bg-white p-3.5 sm:gap-4 sm:p-4"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#ebebed] ring-1 ring-black/[0.04] sm:h-[4.5rem] sm:w-[4.5rem]">
        <ProductImage src={line.imageUrl} alt={line.name} sizes="72px" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <Link
            href={`/catalog/${line.product_id}`}
            className="line-clamp-2 text-[15px] font-semibold leading-snug text-[color:var(--text-charcoal)] hover:text-[var(--site-accent)]"
          >
            {line.name}
          </Link>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeClass(line.status)}`}
          >
            {badgeText(line.status)}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-[color:var(--text-secondary)]">
          <span className="font-medium tabular-nums">×{line.quantity}</span>
          {line.price > 0 ? (
            <span className="tabular-nums"> · {(line.price * line.quantity).toLocaleString(locale)} ₸</span>
          ) : null}
        </p>
        {line.sku ? (
          <div className="mt-2.5">
            <div className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[color:var(--surface-light)] px-2.5 py-1.5 ring-1 ring-black/[0.04]">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[color:var(--text-silver)]">
                {content.labelSku}
              </span>
              <span className="truncate font-mono text-sm text-[color:var(--text-charcoal)] select-all">{line.sku}</span>
            </div>
          </div>
        ) : null}
        <p className="mt-2 text-xs text-[color:var(--text-silver)]">
          {[line.brandName, line.categoryName].filter(Boolean).join(" · ")}
          {(line.brandName || line.categoryName) && " · "}
          <span className="font-mono tabular-nums">{content.labelProductId} {line.product_id}</span>
        </p>
      </div>
    </li>
  );

  const renderGrouped = (o: { localId: string; lines: SavedOrderLine[] }) => (
    <ul className="space-y-2.5">{o.lines.map((line) => renderLineRow(line, o.localId))}</ul>
  );

  return (
    <InnerPageLayout
      innerClassName="max-w-4xl mx-auto"
      breadcrumbs={[
        { label: tr(t.nav.home, lang), href: "/" },
        { label: tr(t.nav.orders, lang) },
      ]}
      title={tr(t.nav.orders, lang)}
      subtitle={orders.length > 0 ? content.listCount(orders.length) : undefined}
      actions={
        orders.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void syncFromWarehouse()}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 py-2.5 text-sm font-semibold text-[color:var(--text-charcoal)] shadow-sm transition-all hover:border-[color:var(--site-accent)]/20 hover:bg-[color:var(--surface-light)] disabled:opacity-50"
            >
              {syncing ? (
                <Loader2 className="h-4 w-4 animate-spin accent-icon" />
              ) : (
                <RefreshCw className="h-4 w-4 accent-icon" />
              )}
              {syncing ? content.refreshing : content.refresh}
            </button>
            <button
              type="button"
              onClick={() => setClearOpen(true)}
              className="rounded-full px-3 py-2.5 text-sm font-medium text-[color:var(--text-silver)] transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              {content.clearAll}
            </button>
          </div>
        ) : undefined
      }
    >

        {syncBanner ? (
          <div
            role="status"
            className={`mb-4 flex flex-wrap items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-sm sm:items-center ${
              syncBanner.kind === "ok"
                ? "border-emerald-200/90 bg-gradient-to-b from-emerald-50/90 to-white text-emerald-900"
                : syncBanner.kind === "partial"
                  ? "warn-callout"
                  : "border-rose-200/90 bg-gradient-to-b from-rose-50/90 to-white text-rose-900"
            }`}
          >
            <p className="min-w-0 flex-1 leading-relaxed">{syncBanner.text}</p>
            <button
              type="button"
              onClick={() => setSyncBanner(null)}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-[color:var(--text-secondary)] transition-colors hover:bg-white/80 hover:text-[color:var(--text-charcoal)]"
            >
              <X className="h-3.5 w-3.5" />
              {content.syncDismiss}
            </button>
          </div>
        ) : null}

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-black/[0.06] bg-white p-10 text-center shadow-sm sm:p-14">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--site-accent-soft)] text-[color:var(--site-accent)]/40">
              <Package className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <p className="text-lg font-semibold text-[color:var(--text-charcoal)]">{content.empty}</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[color:var(--text-secondary)]">{content.emptyHint}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <Link
                href="/cart"
                className="inline-flex rounded-xl btn-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-black/10 transition-transform hover:bg-[var(--site-accent-hover)] active:scale-[0.99]"
              >
                {content.toCart}
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-5 py-2.5 text-sm font-semibold text-[color:var(--text-charcoal)] shadow-sm transition-colors hover:border-[color:var(--site-accent)]/18 hover:bg-[color:var(--surface-light)]"
              >
                {content.toCatalog}
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((o) => (
              <article
                key={o.localId}
                className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/[0.06] bg-[color:var(--surface-light)]/70 px-5 py-4 sm:px-6">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold tracking-tight text-[color:var(--text-charcoal)] sm:text-xl">
                      {content.reserve}{" "}
                      <span className="tabular-nums text-[var(--site-accent)]">#{o.reserveId}</span>
                    </p>
                    <time className="mt-1 block text-sm text-[color:var(--text-silver)]" dateTime={o.createdAt}>
                      {new Date(o.createdAt).toLocaleString(locale, {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-[color:var(--text-charcoal)]">
                    {o.total.toLocaleString(locale)} ₸
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-b border-black/[0.06] px-5 py-3 sm:px-6">
                  {(() => {
                    const presentation = getOrderStatusPresentation(lang, o.warehouseStatus);
                    if (!presentation || (!o.warehouseStatus?.isCancelled && !o.warehouseStatus?.isFulfilled)) {
                      return null;
                    }
                    return (
                      <div
                        className={`mb-1 w-full rounded-xl border px-3.5 py-3 text-sm ${
                          presentation.tone === "cancelled"
                            ? "border-rose-200 bg-rose-50 text-rose-900"
                            : "border-emerald-200 bg-emerald-50 text-emerald-900"
                        }`}
                      >
                        <p className="font-semibold">{presentation.title}</p>
                        <p className="mt-1 leading-relaxed">{presentation.message}</p>
                        {presentation.hint ? (
                          <p className="mt-1 text-xs opacity-90">{presentation.hint}</p>
                        ) : null}
                      </div>
                    );
                  })()}
                  <a
                    href={siteWhatsAppHrefWithText(whatsappPrefillReserveQuestion(lang, o.reserveId))}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-whatsapp inline-flex rounded-full px-3.5 py-2 text-sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => removeOrder(o.localId)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-[color:var(--text-silver)] transition-colors hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    {content.remove}
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 sm:divide-x sm:divide-black/[0.06] border-b border-black/[0.06]">
                  <div className="px-5 py-3.5 sm:px-6">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--text-silver)]">{content.delivery}</p>
                    <p className="mt-1 text-sm text-[color:var(--text-charcoal)]">{o.deliverySummary}</p>
                  </div>
                  <div className="border-t border-black/[0.06] px-5 py-3.5 sm:border-t-0 sm:px-6">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--text-silver)]">{content.payment}</p>
                    <p className="mt-1 text-sm text-[color:var(--text-charcoal)]">{o.paymentSummary}</p>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-silver)]">{content.positions}</p>
                  {renderGrouped(o)}
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-10 border-t border-black/[0.06] pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <p className="max-w-2xl text-xs leading-relaxed text-[color:var(--text-secondary)]">{content.localDisclaimer}</p>
            <Link
              href={content.linkPrivacy}
              className="shrink-0 text-xs font-semibold text-[var(--site-accent)] hover:underline"
            >
              {content.privacyLabel}
            </Link>
          </div>
        </footer>

        <ConfirmDialog
          open={clearOpen}
          onClose={() => setClearOpen(false)}
          title={content.clearTitle}
          description={content.clearDescription}
          cancelLabel={content.clearCancel}
          confirmLabel={content.clearAction}
          onConfirm={() => clearAll()}
        />
    </InnerPageLayout>
  );
}
