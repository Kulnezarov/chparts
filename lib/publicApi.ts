export interface PublicProduct {
  id: number;
  name: string;
  /** Резерв под OEM/артикул для витрины (отображение в карточках) */
  article_oem?: string | null;
  /** Штрихкод со склада */
  barcode?: string | null;
  /** Артикул / SKU */
  sku?: string | null;
  /** Резерв под бренд (строкой), если API вернет сразу */
  brand?: string | null;
  /** Код модели авто (бэкенд: поле `model`) */
  model?: string | null;
  /** Резерв под совместимость моделей */
  car_model_compatibility?: string | null;
  /** Резерв под диапазон годов */
  year_range?: string | null;
  /** Резерв под единое поле цены (если backend отдает `price`) */
  price?: number | null;
  /** Резерв под единый статус наличия */
  stock_status?: string | null;
  // vin_compatibility?: string | null; // включим позже
  sale_price: number;
  quantity: number;
  category_id: number | null;
  /** Если бэкенд отдаёт — показываем название без отдельного запроса */
  category_name?: string | null;
  brand_id?: number | null;
  brand_name?: string | null;
  image_url: string | null;
  image_urls: string[];
  attributes?: Record<string, unknown> | null;
  attribute_labels?: string[];
  storefront_fields?: { label: string; value: string }[];
  /** Назначение — видно в карточке каталога без открытия товара */
  purpose?: string | null;
  /** Ключевые характеристики для chips на карточке (до 4) */
  card_highlights?: string[];
  /** Описание товара */
  description?: string | null;
  compatibility_text?: string | null;
  compatibility_labels?: string[];
  compatibility_primary?: string | null;
  compatibility_more_count?: number;
  compatibility_more_brands?: number;
  compatibility_groups?: { brand_id: number; brand_name: string; models: string[] }[];
}

/** Артикул для показа покупателю (не штрихкод). */
export function displayArticle(p: Pick<PublicProduct, "sku" | "article_oem">): string | null {
  return p.sku?.trim() || p.article_oem?.trim() || null;
}

const PURPOSE_ATTR_KEYS = ["naznachenie", "naznacheniye", "purpose", "назначение"] as const;

function isPurposeLabel(label: string): boolean {
  return label.toLowerCase().includes("назнач");
}

/** Назначение товара для карточки (API `purpose` или поля атрибутов). */
export function productPurpose(
  p: Pick<PublicProduct, "purpose" | "storefront_fields" | "attributes">
): string | null {
  const fromApi = p.purpose?.trim();
  if (fromApi) return fromApi;

  for (const row of p.storefront_fields ?? []) {
    if (isPurposeLabel(row.label) && row.value.trim()) return row.value.trim();
  }

  const attrs = p.attributes;
  if (attrs && typeof attrs === "object" && !Array.isArray(attrs)) {
    for (const key of PURPOSE_ATTR_KEYS) {
      const raw = attrs[key];
      if (typeof raw === "string" && raw.trim()) return raw.trim();
    }
  }

  return null;
}

export interface PublicCategory {
  id: number;
  name: string;
  /** Родительская категория (когда бэкенд отдаёт дерево из склада) */
  parent_id?: number | null;
  /** parent | leaf | group | item — если бэкенд явно указывает уровень */
  level?: string | null;
  slug?: string | null;
  image_url?: string | null;
  products_count?: number | null;
  sort_order?: number | null;
}

export interface PublicBrand {
  id: number;
  name: string;
}

export interface PublicVehicleBrand {
  id: number;
  name: string;
  slug?: string | null;
}

export interface PublicVehicleModel {
  id: number;
  vehicle_brand_id: number;
  name: string;
  slug?: string | null;
  brand?: PublicVehicleBrand | null;
}

export interface PublicEngineFamily {
  id: number;
  code: string;
  name?: string | null;
  summary?: string | null;
  manufacturer?: string | null;
  vehicle_models?: PublicVehicleModel[];
}

function stringFromUnknown(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function collectImageUrl(value: unknown, output: string[]) {
  const direct = stringFromUnknown(value);
  if (direct) {
    output.push(direct);
    return;
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const row = value as Record<string, unknown>;
  const nested =
    row.image_url ??
    row.url ??
    row.src ??
    row.path ??
    row.file_url ??
    row.photo_url ??
    row.media_url;
  const nestedUrl = stringFromUnknown(nested);
  if (nestedUrl) output.push(nestedUrl);
}

function normalizeProductImages(raw: Record<string, unknown>): string[] {
  const candidates: unknown[] = [
    raw.image_url,
    raw.main_image_url,
    raw.thumbnail_url,
    raw.image_urls,
    raw.images,
    raw.photos,
    raw.photo_urls,
    raw.media,
    raw.product_images,
  ];
  const urls: string[] = [];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      for (const item of candidate) collectImageUrl(item, urls);
    } else {
      collectImageUrl(candidate, urls);
    }
  }

  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const url of urls) {
    const proxied = proxyImageUrl(url);
    if (!proxied || seen.has(proxied)) continue;
    seen.add(proxied);
    normalized.push(proxied);
  }
  return normalized;
}

function normalizeProduct(raw: Record<string, unknown>): PublicProduct {
  const categoryId = raw.category_id;
  const brandId = raw.brand_id;
  const imageUrls = normalizeProductImages(raw);
  // Бэкенд: article = артикул (SKU), oem/barcode = штрихкод (только для склада).
  const barcode = stringFromUnknown(raw.oem) ?? stringFromUnknown(raw.barcode);
  const sku = stringFromUnknown(raw.article) ?? stringFromUnknown(raw.sku);

  return {
    id: Number(raw.id),
    name: String(raw.name ?? ""),
    barcode,
    sku,
    article_oem: sku ?? null,
    brand: raw.brand != null && String(raw.brand).trim() !== "" ? String(raw.brand) : null,
    model: (() => {
      const fromModel = stringFromUnknown(raw.model);
      const fromCompat = stringFromUnknown(raw.car_model_compatibility);
      return fromModel ?? fromCompat;
    })(),
    car_model_compatibility: (() => {
      const compatText = stringFromUnknown(raw.compatibility_text);
      if (compatText) return compatText;
      const labels = Array.isArray(raw.compatibility_labels)
        ? raw.compatibility_labels.map((x) => String(x).trim()).filter(Boolean)
        : [];
      if (labels.length) return labels.join(", ");
      const fromModel = stringFromUnknown(raw.model);
      const fromCompat = stringFromUnknown(raw.car_model_compatibility);
      return fromCompat ?? fromModel;
    })(),
    year_range:
      raw.year_range != null && String(raw.year_range).trim() !== ""
        ? String(raw.year_range)
        : null,
    price:
      raw.price != null && !Number.isNaN(Number(raw.price))
        ? Number(raw.price)
        : null,
    stock_status:
      raw.stock_status != null && String(raw.stock_status).trim() !== ""
        ? String(raw.stock_status)
        : null,
    sale_price: Number(raw.sale_price ?? 0),
    quantity: Number(raw.quantity ?? 0),
    category_id: categoryId == null ? null : Number(categoryId),
    category_name:
      raw.category_name != null && String(raw.category_name).trim() !== ""
        ? String(raw.category_name)
        : null,
    brand_id: brandId == null ? null : Number(brandId),
    brand_name:
      raw.brand_name != null && String(raw.brand_name).trim() !== "" ? String(raw.brand_name) : null,
    image_url: imageUrls[0] ?? null,
    image_urls: imageUrls,
    attributes:
      raw.attributes && typeof raw.attributes === "object" && !Array.isArray(raw.attributes)
        ? (raw.attributes as Record<string, unknown>)
        : null,
    attribute_labels: Array.isArray(raw.attribute_labels)
      ? raw.attribute_labels.map((x) => String(x).trim()).filter(Boolean)
      : [],
    storefront_fields: Array.isArray(raw.storefront_fields)
      ? raw.storefront_fields
          .map((x) => {
            if (!x || typeof x !== "object") return null;
            const row = x as Record<string, unknown>;
            const label = String(row.label ?? "").trim();
            const value = String(row.value ?? "").trim();
            if (!label || !value) return null;
            return { label, value };
          })
          .filter((x): x is { label: string; value: string } => x != null)
      : [],
    purpose: stringFromUnknown(raw.purpose),
    card_highlights: Array.isArray(raw.card_highlights)
      ? raw.card_highlights.map((x) => String(x ?? "").trim()).filter(Boolean)
      : [],
    description: stringFromUnknown(raw.description),
    compatibility_text: stringFromUnknown(raw.compatibility_text),
    compatibility_labels: Array.isArray(raw.compatibility_labels)
      ? raw.compatibility_labels.map((x) => String(x).trim()).filter(Boolean)
      : [],
    compatibility_primary: stringFromUnknown(raw.compatibility_primary),
    compatibility_more_count: Number(raw.compatibility_more_count ?? raw.compatibility_more_brands ?? 0) || 0,
    compatibility_more_brands: Number(raw.compatibility_more_brands ?? raw.compatibility_more_count ?? 0) || 0,
    compatibility_groups: Array.isArray(raw.compatibility_groups)
      ? raw.compatibility_groups
          .map((x) => {
            if (!x || typeof x !== "object") return null;
            const row = x as Record<string, unknown>;
            const brand_name = String(row.brand_name ?? "").trim();
            const brand_id = Number(row.brand_id ?? 0);
            const models = Array.isArray(row.models)
              ? row.models.map((m) => String(m).trim()).filter(Boolean)
              : [];
            if (!brand_name) return null;
            return { brand_id, brand_name, models };
          })
          .filter((x): x is { brand_id: number; brand_name: string; models: string[] } => x != null)
      : [],
  };
}

import { HttpError } from "@/lib/httpError";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// В браузере все запросы идут через Next.js rewrite /api/proxy/:path* → бэкенд/api/:path*
// Это обходит CORS, т.к. запрос идёт на тот же origin (localhost:3000)
function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/api/proxy/v1";
  }
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");

  // SSR: внутренний URL бэкенда (Docker/VPS), если задан — быстрее и надёжнее.
  const serverDirect = process.env.API_BASE_URL?.replace(/\/$/, "");
  if (serverDirect) {
    return `${serverDirect}/api/v1`;
  }

  // Иначе тот же прокси через loopback, как в браузере (rewrite → бэкенд).
  // Прямой fetch на NEXT_PUBLIC_API_BASE_URL с сервера Next часто падает (сеть/firewall),
  // из‑за этого карточка товара уходила в 404, хотя каталог в браузере работал.
  const port = process.env.PORT || "3000";
  return `http://127.0.0.1:${port}/api/proxy/v1`;
}

// Преобразует URL изображения с бэкенда в проксированный URL (см. next.config rewrites: /api/proxy/* → бэкенд)
export function proxyImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const base = API_BASE_URL?.replace(/\/$/, "") ?? "";

  // Абсолютный URL нашего бэкенда, например http://194.32.142.253/api/v1/media/...
  if (base && trimmed.startsWith(base)) {
    const path = trimmed.slice(base.length);
    return "/api/proxy" + path.replace(/^\/api/, "");
  }

  // Часто API отдаёт только путь: /api/v1/media/... — браузер тогда бьёт в localhost:3000/api/v1/... (404, нет rewrites)
  if (trimmed.startsWith("/api/v1/")) {
    return "/api/proxy/v1/" + trimmed.slice("/api/v1/".length);
  }
  if (trimmed.startsWith("/api/") && !trimmed.startsWith("/api/proxy")) {
    return "/api/proxy" + trimmed.replace(/^\/api/, "");
  }

  // Внутренние/проксированные пути допускаем как есть.
  if (trimmed.startsWith("/")) return trimmed;

  // Разрешаем только https-картинки из разрешённых хостов (см. next.config remotePatterns).
  // Иначе отравленные данные API могли бы подгрузить чужие изображения/трекеры.
  try {
    const u = new URL(trimmed);
    const allowedHosts = new Set<string>();
    if (base) {
      try {
        allowedHosts.add(new URL(base).hostname);
      } catch {}
    }
    const okSuffixes = ["wikimedia.org", "unsplash.com", "pngwing.com"];
    const hostOk =
      allowedHosts.has(u.hostname) || okSuffixes.some((s) => u.hostname === s || u.hostname.endsWith("." + s));
    if (u.protocol === "https:" && hostOk) return trimmed;
  } catch {}

  return null;
}

export type PublicProductSort =
  | "default"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc";

export interface FetchPublicProductsParams {
  q?: string;
  categoryId?: number | null;
  brandId?: number | null;
  model?: string | null;
  vehicleBrandId?: number | null;
  vehicleModelId?: number | null;
  engineFamilyId?: number | null;
  year?: string | null;
  /** Фильтр наличия: all — не передаём, in/out — query in_stock */
  inStock?: "all" | "in" | "out";
  page?: number;
  pageSize?: number;
  offset?: number;
  sort?: PublicProductSort;
}

export interface PublicProductsPage {
  items: PublicProduct[];
  /** Общее число позиций (если бэкенд отдал). Иначе длина текущей страницы */
  total: number;
}

function parseProductsResponse(json: unknown): PublicProductsPage {
  if (Array.isArray(json)) {
    const items = json.map((row) => normalizeProduct(row as Record<string, unknown>));
    return { items, total: 0 };
  }
  if (json && typeof json === "object") {
    const o = json as Record<string, unknown>;
    const rawItems = o.items ?? o.results ?? o.data ?? o.products;
    const totalRaw = o.total ?? o.count ?? o.total_count;
    if (Array.isArray(rawItems)) {
      const items = rawItems.map((row) => normalizeProduct(row as Record<string, unknown>));
      const total =
        typeof totalRaw === "number" && !Number.isNaN(totalRaw)
          ? totalRaw
          : 0;
      return { items, total };
    }
  }
  return { items: [], total: 0 };
}

/**
 * Список товаров с пагинацией и фильтрами.
 * Параметры query: q, category_id, brand_id, in_stock, limit, offset, sort
 * Ответ: массив ИЛИ { items, total } — оба варианта поддерживаются.
 */
export async function fetchPublicProductsPage(
  params: FetchPublicProductsParams = {},
): Promise<PublicProductsPage> {
  const baseUrl = getApiBaseUrl();
  const searchParams = new URLSearchParams();

  if (params.q?.trim()) {
    searchParams.set("q", params.q.trim());
  }
  if (params.categoryId != null && !Number.isNaN(params.categoryId)) {
    searchParams.set("category_id", String(params.categoryId));
  }
  if (params.brandId != null && !Number.isNaN(params.brandId)) {
    searchParams.set("brand_id", String(params.brandId));
  }
  if (params.model?.trim()) {
    searchParams.set("model", params.model.trim());
  }
  if (params.vehicleBrandId != null && !Number.isNaN(params.vehicleBrandId)) {
    searchParams.set("vehicle_brand_id", String(params.vehicleBrandId));
  }
  if (params.vehicleModelId != null && !Number.isNaN(params.vehicleModelId)) {
    searchParams.set("vehicle_model_id", String(params.vehicleModelId));
  }
  if (params.engineFamilyId != null && !Number.isNaN(params.engineFamilyId)) {
    searchParams.set("engine_family_id", String(params.engineFamilyId));
  }
  if (params.year?.trim()) {
    searchParams.set("year", params.year.trim());
  }
  if (params.inStock === "in") {
    searchParams.set("in_stock", "true");
  }
  if (params.inStock === "out") {
    searchParams.set("in_stock", "false");
  }
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? 24, 4), 100);
  const offset = params.offset != null ? Math.max(0, params.offset) : (page - 1) * pageSize;
  searchParams.set("limit", String(pageSize));
  searchParams.set("offset", String(offset));

  if (params.sort && params.sort !== "default") {
    searchParams.set("sort", params.sort);
  }

  const qs = searchParams.toString();
  const url = `${baseUrl}/public/products${qs ? `?${qs}` : ""}`;

  let lastStatus = 0;
  let lastDetail: string | undefined;
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (response.ok) {
      const json = (await response.json()) as unknown;
      return parseProductsResponse(json);
    }

    lastStatus = response.status;
    try {
      const body = (await response.json()) as { detail?: unknown };
      if (typeof body.detail === "string") lastDetail = body.detail;
    } catch {
      // ignore parse errors
    }

    const retryable = response.status >= 500 || response.status === 429;
    if (!retryable || attempt === 2) break;
    await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
  }

  const detailSuffix = lastDetail ? `: ${lastDetail}` : "";
  throw new HttpError(`Failed to load products: ${lastStatus}${detailSuffix}`, lastStatus, lastDetail);
}

/**
 * Все товары по поиску (несколько страниц подряд).
 * Для карточки товара / «похожие» — предпочтительнее узкие запросы с фильтрами.
 */
export async function fetchPublicProducts(query?: string): Promise<PublicProduct[]> {
  const all: PublicProduct[] = [];
  const pageSize = 100;
  for (let page = 1; page <= 200; page++) {
    const { items, total } = await fetchPublicProductsPage({ q: query, page, pageSize });
    all.push(...items);
    if (items.length < pageSize) break;
    if (total > 0 && all.length >= total) break;
  }
  return all;
}

export async function fetchPublicProductById(id: string): Promise<PublicProduct | null> {
  const productId = Number(id);
  if (Number.isNaN(productId)) {
    return null;
  }

  const bases = [getApiBaseUrl()];
  // Запасной прямой URL с сервера, если loopback-прокси недоступен.
  if (typeof window === "undefined" && API_BASE_URL) {
    const direct = `${API_BASE_URL.replace(/\/$/, "")}/api/v1`;
    if (!bases.includes(direct)) bases.push(direct);
  }

  for (const baseUrl of bases) {
    try {
      const response = await fetch(`${baseUrl}/public/products/${productId}`, {
        cache: "no-store",
      });
      if (response.ok) {
        const json = (await response.json()) as unknown;
        if (json && typeof json === "object" && !Array.isArray(json)) {
          return normalizeProduct(json as Record<string, unknown>);
        }
      }
    } catch {
      /* пробуем следующий base */
    }
  }

  const pageSize = 100;
  for (let page = 1; page <= 200; page++) {
    const result = await fetchPublicProductsPage({ page, pageSize });
    const found = result.items.find((p) => p.id === productId);
    if (found) return found;
    if (result.items.length < pageSize) break;
    if (result.total > 0 && page * pageSize >= result.total) break;
  }

  return null;
}

export interface PublicOrderItemInput {
  product_id: number;
  quantity: number;
}

/** Способ доставки (сайт + опционально бэкенд SkladPro) */
export type PublicDeliveryType = "pickup" | "city" | "post";

/** Оплата: наличные только при самовывозе; иначе карта */
export type PublicPaymentType = "card" | "cash";

export interface PublicOrderCreateInput {
  customer_name: string;
  customer_phone: string;
  /** Итоговый текст: комментарий клиента + блок доставки (см. buildOrderComment на клиенте) */
  comment?: string;
  items: PublicOrderItemInput[];
  /** Ниже — опционально для расширенного API; при отсутствии в схеме FastAPI обычно игнорируются */
  delivery_type?: PublicDeliveryType;
  delivery_address?: string | null;
  delivery_city?: string | null;
  delivery_details?: string | null;
  payment_type?: PublicPaymentType;
}

export async function createPublicOrder(payload: PublicOrderCreateInput): Promise<{ ok: boolean; reserve_id: number }> {
  const baseUrl = getApiBaseUrl();
  const body: Record<string, unknown> = {
    customer_name: payload.customer_name,
    customer_phone: payload.customer_phone,
    items: payload.items,
  };
  if (payload.comment != null && String(payload.comment).trim() !== "") {
    body.comment = payload.comment.trim();
  }
  if (payload.delivery_type) body.delivery_type = payload.delivery_type;
  if (payload.delivery_address != null && String(payload.delivery_address).trim() !== "") {
    body.delivery_address = String(payload.delivery_address).trim();
  }
  if (payload.delivery_city != null && String(payload.delivery_city).trim() !== "") {
    body.delivery_city = String(payload.delivery_city).trim();
  }
  if (payload.delivery_details != null && String(payload.delivery_details).trim() !== "") {
    body.delivery_details = String(payload.delivery_details).trim();
  }
  if (payload.payment_type) body.payment_type = payload.payment_type;

  const response = await fetch(`${baseUrl}/public/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let detail: string | undefined;
    try {
      const errorJson = (await response.json()) as unknown;
      if (errorJson && typeof errorJson === "object" && "detail" in errorJson) {
        const rawDetail = (errorJson as { detail?: unknown }).detail;
        detail = typeof rawDetail === "string" ? rawDetail : JSON.stringify(rawDetail);
      }
    } catch {}
    throw new HttpError(`Failed to create order: ${response.status}`, response.status, detail);
  }

  return (await response.json()) as { ok: boolean; reserve_id: number };
}

/** Ответ склада по резерву (опциональный GET для «Мои заказы») */
export interface PublicReserveLineDetail {
  product_id: number;
  quantity: number;
  status: string;
  name?: string | null;
  barcode?: string | null;
  sku?: string | null;
  brand_name?: string | null;
  category_name?: string | null;
}

export interface PublicReserveDetail {
  reserve_id: number;
  lines: PublicReserveLineDetail[];
  status_title?: string;
  is_cancelled?: boolean;
  is_fulfilled?: boolean;
  cancellation_reason_code?: string | null;
  cancellation_reason_title?: string | null;
  cancellation_comment?: string | null;
}

function parseReserveDetailJson(json: unknown, reserveId: number): PublicReserveDetail | null {
  if (!json || typeof json !== "object") return null;
  const o = json as Record<string, unknown>;
  const rawItems =
    (Array.isArray(o.items) ? o.items : null) ??
    (Array.isArray(o.lines) ? o.lines : null) ??
    (Array.isArray(o.reserve_items) ? o.reserve_items : null) ??
    (o.data && typeof o.data === "object" && Array.isArray((o.data as Record<string, unknown>).items)
      ? (o.data as Record<string, unknown>).items
      : null);

  if (!Array.isArray(rawItems) || rawItems.length === 0) return null;

  const lines: PublicReserveLineDetail[] = [];
  for (const row of rawItems) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const pid = r.product_id ?? r.productId ?? r.id;
    if (pid == null) continue;
    const qty = r.quantity ?? r.qty ?? 1;
    const status = r.status ?? r.line_status ?? r.state ?? "pending";
    const nameRaw = r.name ?? r.product_name ?? r.productName;
    lines.push({
      product_id: Number(pid),
      quantity: Math.max(1, Number(qty) || 1),
      status: String(status),
      name: nameRaw != null ? String(nameRaw) : null,
      barcode: r.barcode != null ? String(r.barcode) : null,
      sku: r.sku != null ? String(r.sku) : null,
      brand_name: r.brand_name != null ? String(r.brand_name) : null,
      category_name: r.category_name != null ? String(r.category_name) : null,
    });
  }

  if (lines.length === 0) return null;

  const statusTitle = o.status_title != null ? String(o.status_title) : undefined;
  const isCancelled = o.is_cancelled === true;
  const isFulfilled = o.is_fulfilled === true;
  const cancellationReasonCode =
    o.cancellation_reason_code != null ? String(o.cancellation_reason_code) : null;
  const cancellationReasonTitle =
    o.cancellation_reason_title != null ? String(o.cancellation_reason_title) : null;
  const cancellationComment =
    o.cancellation_comment != null ? String(o.cancellation_comment) : null;

  return {
    reserve_id: Number(o.reserve_id ?? o.id ?? reserveId) || reserveId,
    lines,
    status_title: statusTitle,
    is_cancelled: isCancelled,
    is_fulfilled: isFulfilled,
    cancellation_reason_code: cancellationReasonCode,
    cancellation_reason_title: cancellationReasonTitle,
    cancellation_comment: cancellationComment,
  };
}

/**
 * Детали резерва со склада: статусы позиций (отмена / выдача).
 * Витрина сохраняет `reserve_id` из ответа POST /orders — это id резерва, не внутреннего «order».
 * Поэтому сначала GET …/reserves/{id}, затем …/orders/{id} (на бэке id могут различаться).
 * 404/422: эндпоинт нет / неверный id / не совпал тип id — тогда локальные статусы «в обработке» не обновятся.
 */
export async function fetchPublicReserveDetail(
  reserveId: number,
  phoneDigits?: string | null,
): Promise<PublicReserveDetail | null> {
  const baseUrl = getApiBaseUrl();
  const phoneQuery =
    phoneDigits && phoneDigits.replace(/\D/g, "").length >= 10
      ? `?phone=${encodeURIComponent(phoneDigits.replace(/\D/g, ""))}`
      : "";
  const paths = [`/public/reserves/${reserveId}${phoneQuery}`];

  for (const path of paths) {
    try {
      const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
      if (!response.ok) continue;
      const json = (await response.json()) as unknown;
      const parsed = parseReserveDetailJson(json, reserveId);
      if (parsed) return parsed;
    } catch {
      /* try next path */
    }
  }
  return null;
}

function normalizeCategory(raw: Record<string, unknown>): PublicCategory | null {
  const id = raw.id;
  if (id == null) return null;
  const name = raw.name != null ? String(raw.name) : "";
  if (!name.trim()) return null;

  const parentRaw = raw.parent_id ?? raw.parentId;
  const parent_id =
    parentRaw != null && !Number.isNaN(Number(parentRaw)) ? Number(parentRaw) : null;

  const level = stringFromUnknown(raw.level) ?? stringFromUnknown(raw.category_level);
  const slug = stringFromUnknown(raw.slug);
  const image_url = stringFromUnknown(raw.image_url) ?? stringFromUnknown(raw.image);
  const sortRaw = raw.sort_order ?? raw.sortOrder;
  const sort_order =
    sortRaw != null && !Number.isNaN(Number(sortRaw)) ? Number(sortRaw) : null;
  const countRaw = raw.products_count ?? raw.product_count ?? raw.items_count;
  const products_count =
    countRaw != null && !Number.isNaN(Number(countRaw)) ? Number(countRaw) : null;

  return {
    id: Number(id),
    name,
    parent_id,
    level,
    slug,
    image_url: image_url ? proxyImageUrl(image_url) : null,
    products_count,
    sort_order,
  };
}

function normalizeBrand(raw: Record<string, unknown>): PublicBrand | null {
  const id = raw.id;
  if (id == null) return null;
  const name = raw.name != null ? String(raw.name) : "";
  if (!name.trim()) return null;
  return { id: Number(id), name };
}

function normalizeVehicleBrand(raw: Record<string, unknown>): PublicVehicleBrand | null {
  const id = raw.id;
  if (id == null) return null;
  const name = raw.name != null ? String(raw.name) : "";
  if (!name.trim()) return null;
  return {
    id: Number(id),
    name,
    slug: stringFromUnknown(raw.slug),
  };
}

function normalizeVehicleModel(raw: Record<string, unknown>): PublicVehicleModel | null {
  const id = raw.id;
  const brandId = raw.vehicle_brand_id ?? raw.vehicleBrandId;
  if (id == null || brandId == null) return null;
  const name = raw.name != null ? String(raw.name) : "";
  if (!name.trim()) return null;
  const brandRaw = raw.brand;
  return {
    id: Number(id),
    vehicle_brand_id: Number(brandId),
    name,
    slug: stringFromUnknown(raw.slug),
    brand:
      brandRaw && typeof brandRaw === "object" && !Array.isArray(brandRaw)
        ? normalizeVehicleBrand(brandRaw as Record<string, unknown>)
        : null,
  };
}

function normalizeEngineFamily(raw: Record<string, unknown>): PublicEngineFamily | null {
  const id = raw.id;
  if (id == null) return null;
  const code = raw.code != null ? String(raw.code).trim() : "";
  if (!code) return null;
  return {
    id: Number(id),
    code,
    name: stringFromUnknown(raw.name),
    summary: stringFromUnknown(raw.summary),
    manufacturer: stringFromUnknown(raw.manufacturer),
    vehicle_models: Array.isArray(raw.vehicle_models)
      ? raw.vehicle_models
          .map((row) => normalizeVehicleModel(row as Record<string, unknown>))
          .filter((row): row is PublicVehicleModel => row != null)
      : [],
  };
}

/** Публичный список категорий (если роут есть на бэкенде). Иначе [] */
export async function fetchPublicCategories(): Promise<PublicCategory[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/public/categories`, { cache: "no-store" });
    if (!response.ok) return [];
    const data = (await response.json()) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .map((row) => normalizeCategory(row as Record<string, unknown>))
      .filter((c): c is PublicCategory => c != null);
  } catch {
    return [];
  }
}

/** Публичный список марок (если роут есть на бэкенде). Иначе [] */
export async function fetchPublicBrands(): Promise<PublicBrand[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/public/brands`, { cache: "no-store" });
    if (!response.ok) return [];
    const data = (await response.json()) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .map((row) => normalizeBrand(row as Record<string, unknown>))
      .filter((b): b is PublicBrand => b != null);
  } catch {
    return [];
  }
}

export async function fetchPublicVehicleBrands(): Promise<PublicVehicleBrand[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/public/compatibility/vehicle-brands`, { cache: "no-store" });
    if (!response.ok) return [];
    const data = (await response.json()) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .map((row) => normalizeVehicleBrand(row as Record<string, unknown>))
      .filter((row): row is PublicVehicleBrand => row != null);
  } catch {
    return [];
  }
}

export async function fetchPublicVehicleModels(vehicleBrandId?: number | null): Promise<PublicVehicleModel[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const qs =
      vehicleBrandId != null && !Number.isNaN(vehicleBrandId)
        ? `?vehicle_brand_id=${encodeURIComponent(String(vehicleBrandId))}`
        : "";
    const response = await fetch(`${baseUrl}/public/compatibility/vehicle-models${qs}`, { cache: "no-store" });
    if (!response.ok) return [];
    const data = (await response.json()) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .map((row) => normalizeVehicleModel(row as Record<string, unknown>))
      .filter((row): row is PublicVehicleModel => row != null);
  } catch {
    return [];
  }
}

export async function fetchPublicEngineFamilies(): Promise<PublicEngineFamily[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/public/compatibility/engine-families`, { cache: "no-store" });
    if (!response.ok) return [];
    const data = (await response.json()) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .map((row) => normalizeEngineFamily(row as Record<string, unknown>))
      .filter((row): row is PublicEngineFamily => row != null);
  } catch {
    return [];
  }
}

export function buildIdNameMap<T extends { id: number; name: string }>(rows: T[]): Map<number, string> {
  const map = new Map<number, string>();
  for (const row of rows) {
    map.set(row.id, row.name);
  }
  return map;
}
