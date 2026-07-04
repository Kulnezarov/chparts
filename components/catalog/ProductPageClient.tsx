"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLang } from "@/lib/useLang";
import {
  Bell,
  Check,
  Minus,
  Plus,
  ShoppingCart,
  CheckCircle,
  ChevronRight,
  Clock,
  Copy,
  Home,
  Send,
} from "lucide-react";
import {
  buildIdNameMap,
  displayArticle,
  fetchPublicBrands,
  fetchPublicCategories,
  fetchPublicProductById,
  fetchPublicProductsPage,
  type PublicProduct,
} from "@/lib/publicApi";
import { useCartStore } from "@/store/cartStore";
import { cartExtrasFromProduct } from "@/lib/cartProductMeta";
import { useToastStore } from "@/store/toastStore";
import { t, tr } from "@/lib/i18n";
import { siteWhatsAppHrefWithText } from "@/lib/siteContacts";
import ProductGallery from "@/components/ProductGallery";
import { ProductPageSkeleton, SlowLoadingHint, TopLoadingBar } from "@/components/ui/Skeleton";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";

async function loadRelated(product: PublicProduct): Promise<PublicProduct[]> {
  const used = new Set<number>([product.id]);
  const merged: PublicProduct[] = [];

  const add = (items: PublicProduct[]) => {
    for (const p of items) {
      if (used.has(p.id)) continue;
      used.add(p.id);
      merged.push(p);
      if (merged.length >= 6) return;
    }
  };

  if (product.category_id != null) {
    const page = await fetchPublicProductsPage({
      categoryId: product.category_id,
      page: 1,
      pageSize: 12,
    });
    add(page.items.filter((p) => p.id !== product.id));
  }
  if (merged.length < 6 && product.brand_id != null) {
    const page = await fetchPublicProductsPage({
      brandId: product.brand_id,
      page: 1,
      pageSize: 12,
    });
    add(page.items.filter((p) => p.id !== product.id));
  }
  return merged.slice(0, 6);
}

function QtyStepper({
  qty,
  maxQty,
  onDec,
  onInc,
  size = "md",
}: {
  qty: number;
  maxQty: number;
  onDec: () => void;
  onInc: () => void;
  size?: "md" | "sm";
}) {
  const btn = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-black/[0.1] bg-white">
      <button
        type="button"
        className={`flex ${btn} items-center justify-center text-[var(--text-charcoal)] hover:bg-[#f5f5f7] disabled:opacity-40`}
        disabled={qty <= 1}
        onClick={onDec}
        aria-label="Уменьшить"
      >
        <Minus size={size === "sm" ? 16 : 18} strokeWidth={2} />
      </button>
      <span className={`min-w-[2.75rem] text-center font-bold tabular-nums text-[var(--text-charcoal)] ${size === "sm" ? "text-sm" : "text-base"}`}>
        {qty}
      </span>
      <button
        type="button"
        className={`flex ${btn} items-center justify-center text-[var(--text-charcoal)] hover:bg-[#f5f5f7] disabled:opacity-40`}
        disabled={qty >= maxQty}
        onClick={onInc}
        aria-label="Увеличить"
      >
        <Plus size={size === "sm" ? 16 : 18} strokeWidth={2} />
      </button>
    </div>
  );
}

export default function ProductPageClient({ id }: { id: string }) {
  const lang = useLang();
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [related, setRelated] = useState<PublicProduct[]>([]);
  const [categoryById, setCategoryById] = useState<Map<number, string>>(new Map());
  const [brandById, setBrandById] = useState<Map<number, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [compatOpen, setCompatOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [articleCopied, setArticleCopied] = useState(false);
  const [notifyName, setNotifyName] = useState("");
  const [notifyPhone, setNotifyPhone] = useState("");
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const [item, categories, brands] = await Promise.all([
          fetchPublicProductById(id),
          fetchPublicCategories(),
          fetchPublicBrands(),
        ]);

        if (cancelled) return;
        setCategoryById(buildIdNameMap(categories));
        setBrandById(buildIdNameMap(brands));
        setProduct(item);
        setQty(1);
        if (item) {
          const rel = await loadRelated(item);
          if (!cancelled) setRelated(rel);
        } else {
          setRelated([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const labels = {
    ru: {
      home: "Главная",
      catalog: "Каталог",
      oem: "Артикул / OEM",
      category: "Категория",
      brand: "Марка",
      model: "Совместимость",
      year: "Годы",
      inStock: "В наличии",
      outStock: "Нет в наличии",
      addCart: "В корзину",
      related: "Похожие товары",
      moreInCategory: "Все в категории",
      noCategory: "Без категории",
      noBrand: "—",
      qty: "Количество",
      details: "Характеристики",
      pcs: "шт.",
      copy: "Скопировать",
      copied: "Скопировано",
      notifyTitle: "Сообщить о поступлении",
      notifyLead: "Оставьте имя и телефон, заявка откроется в WhatsApp.",
      name: "Имя",
      phone: "Телефон",
      sendRequest: "Отправить заявку",
      description: "Описание",
      showDescription: "Показать описание",
      hideDescription: "Скрыть описание",
    },
    kz: {
      home: "Басты бет",
      catalog: "Каталог",
      oem: "Артикул / OEM",
      category: "Санат",
      brand: "Марка",
      model: "Сәйкестік",
      year: "Жылдар",
      inStock: "Қолда бар",
      outStock: "Қолда жоқ",
      addCart: "Себетке",
      related: "Ұқсас тауарлар",
      moreInCategory: "Санаттағы барлығы",
      noCategory: "Санатсыз",
      noBrand: "—",
      qty: "Саны",
      details: "Сипаттамасы",
      pcs: "дана",
      copy: "Көшіру",
      copied: "Көшірілді",
      notifyTitle: "Түскенде хабарлау",
      notifyLead: "Атыңыз бен телефоныңызды қалдырыңыз, өтінім WhatsApp-та ашылады.",
      name: "Аты",
      phone: "Телефон",
      sendRequest: "Өтінім жіберу",
      description: "Сипаттама",
      showDescription: "Сипаттаманы көрсету",
      hideDescription: "Сипаттаманы жасыру",
    },
    uz: {
      home: "Bosh sahifa",
      catalog: "Katalog",
      oem: "Artikul / OEM",
      category: "Kategoriya",
      brand: "Marka",
      model: "Moslik",
      year: "Yillar",
      inStock: "Bor",
      outStock: "Yo'q",
      addCart: "Savatga qo'shish",
      related: "O'xshash tovarlar",
      moreInCategory: "Kategoriyadagi hammasi",
      noCategory: "Kategoriyasiz",
      noBrand: "—",
      qty: "Miqdor",
      details: "Tavsif",
      pcs: "dona",
      copy: "Nusxalash",
      copied: "Nusxalandi",
      notifyTitle: "Kelganda xabar berish",
      notifyLead: "Ism va telefonni qoldiring, so'rov WhatsApp-da ochiladi.",
      name: "Ism",
      phone: "Telefon",
      sendRequest: "So'rov yuborish",
      description: "Tavsif",
      showDescription: "Tavsifni ko'rsatish",
      hideDescription: "Tavsifni yashirish",
    },
  }[lang];

  const categoryText = useMemo(() => {
    if (!product) return "";
    if (product.category_name?.trim()) return product.category_name.trim();
    if (product.category_id != null && categoryById.has(product.category_id)) return categoryById.get(product.category_id)!;
    return product.category_id != null ? `#${product.category_id}` : labels.noCategory;
  }, [product, categoryById, labels.noCategory]);

  const brandText = useMemo(() => {
    if (!product) return "";
    if (product.brand_name?.trim()) return product.brand_name.trim();
    if (product.brand?.trim()) return product.brand.trim();
    if (product.brand_id != null && brandById.has(product.brand_id)) return brandById.get(product.brand_id)!;
    return product.brand_id != null ? `#${product.brand_id}` : labels.noBrand;
  }, [product, brandById, labels.noBrand]);

  const handleAdd = () => {
    if (!product || product.quantity <= 0) return;
    const n = Math.min(qty, product.quantity);
    for (let i = 0; i < n; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.sale_price,
        imageUrl: product.image_url,
        available: product.quantity,
        ...cartExtrasFromProduct(product),
      });
    }
    showToast(tr(t.ui.addedToCart, lang), { label: tr(t.ui.viewCart, lang), href: "/cart" });
  };

  if (isLoading) {
    return (
      <>
        <TopLoadingBar active />
        <ProductPageSkeleton />
        <SlowLoadingHint active />
      </>
    );
  }

  if (!product) notFound();

  const inStock = product.quantity > 0;
  const maxQty = Math.max(1, product.quantity);
  const article = displayArticle(product);

  const handleCopyArticle = async () => {
    if (!article) return;
    try {
      await navigator.clipboard.writeText(article);
      setArticleCopied(true);
      window.setTimeout(() => setArticleCopied(false), 1400);
    } catch {
      setArticleCopied(false);
    }
  };

  const handleNotifySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message =
      lang === "kz"
        ? `Сәлеметсіз бе! Тауар түскенде хабарлауыңызды сұраймын: ${product.name}${article ? `, артикул ${article}` : ""}. Атым: ${notifyName || "—"}. Телефон: ${notifyPhone || "—"}.`
        : lang === "uz"
          ? `Assalomu alaykum! Mahsulot kelganda xabar berishingizni so'rayman: ${product.name}${article ? `, artikul ${article}` : ""}. Ism: ${notifyName || "—"}. Telefon: ${notifyPhone || "—"}.`
          : `Здравствуйте! Сообщите, пожалуйста, когда появится товар: ${product.name}${article ? `, артикул ${article}` : ""}. Имя: ${notifyName || "—"}. Телефон: ${notifyPhone || "—"}.`;
    window.open(siteWhatsAppHrefWithText(message), "_blank", "noopener,noreferrer");
  };

  const displayFields =
    product.storefront_fields && product.storefront_fields.length > 0
      ? product.storefront_fields
      : (product.attribute_labels || []).map((line) => {
          const idx = line.indexOf(": ");
          if (idx > 0) return { label: line.slice(0, idx), value: line.slice(idx + 2) };
          return { label: line, value: "" };
        }).filter((r) => r.label && r.value);

  const compatGroups = product.compatibility_groups || [];
  const compatLabels = product.compatibility_labels || [];
  const compatPrimary =
    product.compatibility_primary ||
    (product.compatibility_labels && product.compatibility_labels[0]) ||
    product.compatibility_text?.split(",")[0]?.trim() ||
    null;
  const compatMoreBrands =
    product.compatibility_more_brands ??
    product.compatibility_more_count ??
    Math.max(0, compatGroups.length - 1);
  const compatMoreLabel =
    lang === "ru"
      ? compatMoreBrands === 1
        ? "ещё 1 бренд"
        : compatMoreBrands >= 2 && compatMoreBrands <= 4
          ? `ещё ${compatMoreBrands} бренда`
          : compatMoreBrands > 4
            ? `ещё ${compatMoreBrands} брендов`
            : ""
      : lang === "kz"
        ? compatMoreBrands === 1
          ? "тағы 1 марка"
          : `тағы ${compatMoreBrands} марка`
        : compatMoreBrands === 1
          ? "1 more brand"
          : `${compatMoreBrands} more brands`;

  const baseSpecRows = [
    article ? { label: labels.oem, value: article } : null,
    brandText && brandText !== labels.noBrand ? { label: labels.brand, value: brandText } : null,
    categoryText ? { label: labels.category, value: categoryText } : null,
  ].filter((row): row is { label: string; value: string } => row != null);

  const seenSpecRows = new Set<string>();
  const specRows = [...baseSpecRows, ...displayFields]
    .map((row) => ({
      label: row.label,
      value: row.value,
      show: Boolean(row.label && row.value),
    }))
    .filter((row) => {
      if (!row.show) return false;
      const key = `${row.label.trim().toLowerCase()}|${row.value.trim().toLowerCase()}`;
      if (seenSpecRows.has(key)) return false;
      seenSpecRows.add(key);
      return true;
    });

  return (
    <div className="page-frame pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-10">
      <div className="site-container py-4 sm:py-8">
        <nav className="product-detail-breadcrumb">
          <Link href="/" className="inline-flex items-center gap-1 font-medium text-[var(--text-charcoal)] hover:text-[var(--site-accent)]">
            <Home size={12} />
            {labels.home}
          </Link>
          <ChevronRight size={12} className="shrink-0 opacity-40" />
          <Link href="/catalog" className="font-medium text-[var(--text-charcoal)] hover:text-[var(--site-accent)]">
            {labels.catalog}
          </Link>
          <ChevronRight size={12} className="shrink-0 opacity-40" />
          <span className="line-clamp-1 max-w-[10rem] font-medium text-[var(--text-charcoal)] sm:max-w-md">{product.name}</span>
        </nav>

        <article className="product-detail-hero">
          <ProductGallery key={product.id} images={product.image_urls} name={product.name} compact />

          <div className="product-detail-summary">
            <h1 className="product-detail-title">{product.name}</h1>

            {article && (
              <div className="product-detail-article">
                <span className="product-detail-article-label">{labels.oem}</span>
                <code className="product-detail-article-code">{article}</code>
                <button
                  type="button"
                  onClick={handleCopyArticle}
                  className="product-detail-copy"
                  aria-label={articleCopied ? labels.copied : labels.copy}
                >
                  {articleCopied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
                  <span>{articleCopied ? labels.copied : labels.copy}</span>
                </button>
              </div>
            )}

            <div className="product-detail-stock-row">
              {inStock ? (
                <span className="product-detail-stock product-detail-stock--ok">
                  <CheckCircle size={14} />
                  {labels.inStock} · {product.quantity} {labels.pcs}
                </span>
              ) : (
                <span className="product-detail-stock product-detail-stock--out">
                  <Clock size={14} />
                  {labels.outStock}
                </span>
              )}
            </div>

            <p className="product-detail-price">
              {product.sale_price.toLocaleString("ru-RU")} ₸
            </p>
            {inStock ? (
              <div className="product-detail-buy hidden lg:flex">
                <div className="product-detail-qty">
                  <span className="text-sm font-medium text-[color:var(--text-silver)]">{labels.qty}</span>
                  <QtyStepper
                    qty={qty}
                    maxQty={maxQty}
                    onDec={() => setQty((v) => Math.max(1, v - 1))}
                    onInc={() => setQty((v) => Math.min(maxQty, v + 1))}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="product-detail-cart-btn btn-primary"
                >
                  <ShoppingCart size={20} />
                  {labels.addCart}
                </button>
              </div>
            ) : (
              <form id="notify-form" onSubmit={handleNotifySubmit} className="product-detail-notify">
                <div>
                  <h2 className="product-detail-notify-title">
                    <Bell size={17} aria-hidden />
                    {labels.notifyTitle}
                  </h2>
                  <p className="product-detail-notify-lead">{labels.notifyLead}</p>
                </div>
                <div className="product-detail-notify-grid">
                  <label className="product-detail-notify-field">
                    <span>{labels.name}</span>
                    <input
                      value={notifyName}
                      onChange={(e) => setNotifyName(e.target.value)}
                      placeholder={labels.name}
                      className="input-catalog"
                    />
                  </label>
                  <label className="product-detail-notify-field">
                    <span>{labels.phone}</span>
                    <input
                      value={notifyPhone}
                      onChange={(e) => setNotifyPhone(e.target.value)}
                      placeholder="+7"
                      className="input-catalog"
                      required
                    />
                  </label>
                </div>
                <button type="submit" className="product-detail-notify-submit">
                  <Send size={16} aria-hidden />
                  {labels.sendRequest}
                </button>
              </form>
            )}
          </div>
        </article>

        {specRows.length > 0 && (
          <section className="product-detail-section">
            <h2 className="product-detail-section-title">{labels.details}</h2>
            <dl className="product-detail-specs">
              {specRows.map((row) => (
                <div key={`${row.label}-${row.value}`} className="product-detail-spec-row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {compatPrimary && (
          <section className="product-detail-section">
            <button
              type="button"
              onClick={() => setCompatOpen((v) => !v)}
              className="product-detail-accordion-trigger"
            >
              <span>
                <span className="product-detail-section-eyebrow">
                  {lang === "ru" ? "Совместим с" : lang === "kz" ? "Үйлеседі" : "Fits"}
                </span>
                <span className="product-detail-accordion-title">{compatPrimary}</span>
                {!compatOpen && compatMoreBrands > 0 && (
                  <span className="product-detail-accordion-hint">
                    ({lang === "ru" ? "и" : lang === "kz" ? "және" : "and"} {compatMoreLabel})
                  </span>
                )}
              </span>
              <ChevronRight
                size={18}
                className={`product-detail-accordion-icon ${compatOpen ? "rotate-90" : ""}`}
              />
            </button>
            {compatOpen && (
              <div className="product-detail-compat-list">
                {compatGroups.length > 0
                  ? compatGroups.map((g) => (
                    <dl key={g.brand_id} className="product-detail-compat-row">
                      <dt>{g.brand_name}</dt>
                      <dd>{g.models.join(", ") || "—"}</dd>
                    </dl>
                  ))
                  : compatLabels.map((label) => (
                    <p key={label} className="product-detail-compat-chip">{label}</p>
                  ))}
              </div>
            )}
          </section>
        )}

        {product.description && (
          <section className="product-detail-section">
            <button
              type="button"
              onClick={() => setDescriptionOpen((v) => !v)}
              className="product-detail-accordion-trigger"
            >
              <span>
                <span className="product-detail-section-eyebrow">{labels.description}</span>
                <span className="product-detail-accordion-title">
                  {descriptionOpen ? labels.hideDescription : labels.showDescription}
                </span>
              </span>
              <ChevronRight
                size={18}
                className={`product-detail-accordion-icon ${descriptionOpen ? "rotate-90" : ""}`}
              />
            </button>
            {descriptionOpen && (
              <p className="product-detail-description">{product.description}</p>
            )}
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-4 text-lg font-bold text-[var(--text-charcoal)]">{labels.related}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
              {related.map((p) => (
                <CatalogProductCard
                  key={p.id}
                  product={p}
                  brandName={p.brand_name || p.brand || brandText}
                  categoryName={p.category_name || categoryText}
                  inStockLabel={labels.inStock}
                  outStockLabel={labels.outStock}
                  compact
                  onAddToCart={() => {
                    if (p.quantity <= 0) return;
                    addItem({
                      id: p.id,
                      name: p.name,
                      price: p.sale_price,
                      imageUrl: p.image_url,
                      available: p.quantity,
                      ...cartExtrasFromProduct(p),
                    });
                    showToast(tr(t.ui.addedToCart, lang), { label: tr(t.ui.viewCart, lang), href: "/cart" });
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="product-detail-mobile-bar">
        <div className="product-detail-mobile-inner">
          <div className="product-detail-mobile-price">
            <p>{inStock ? labels.qty : labels.outStock}</p>
            <strong>
              {product.sale_price.toLocaleString("ru-RU")} ₸
            </strong>
          </div>
          {inStock ? (
            <>
              <QtyStepper
                qty={qty}
                maxQty={maxQty}
                size="sm"
                onDec={() => setQty((v) => Math.max(1, v - 1))}
                onInc={() => setQty((v) => Math.min(maxQty, v + 1))}
              />
              <button
                type="button"
                onClick={handleAdd}
                className="product-detail-mobile-buy btn-primary"
              >
                <ShoppingCart size={18} strokeWidth={2.5} />
                <span className="truncate">{labels.addCart}</span>
              </button>
            </>
          ) : (
            <a href="#notify-form" className="product-detail-mobile-buy product-detail-mobile-buy--notify">
              <Bell size={17} aria-hidden />
              <span className="truncate">{labels.notifyTitle}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
