"use client";

import Link from "next/link";
import { Cog, Heart, MessageCircle } from "lucide-react";
import ProductImage from "@/components/ui/ProductImage";
import AddToCartMorphButton from "./AddToCartMorphButton";
import { displayArticle, productPurpose, type PublicProduct } from "@/lib/publicApi";
import { siteWhatsAppHrefWithText } from "@/lib/siteContacts";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";

type Props = {
  product: PublicProduct;
  brandName: string;
  categoryName: string;
  inStockLabel: string;
  outStockLabel: string;
  onAddToCart: () => void;
  compact?: boolean;
  variant?: "grid" | "list";
};

export default function CatalogProductCard({
  product: p,
  brandName,
  categoryName,
  inStockLabel,
  outStockLabel,
  onAddToCart,
  compact = false,
  variant = "grid",
}: Props) {
  const lang = useLang();
  const inStock = p.quantity > 0;
  const meta = [brandName, categoryName].filter((x) => x && x !== "—").join(" · ");
  const purpose = productPurpose(p);
  const highlights = (p.card_highlights ?? []).slice(0, compact ? 2 : 3);
  const compatibility =
    p.compatibility_primary?.trim() ||
    p.compatibility_labels?.find((label) => label.trim())?.trim() ||
    p.model?.trim() ||
    null;

  const isFavorite = useFavoritesStore((s) => s.isFavorite(p.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(p);
  };

  const article = displayArticle(p);
  const locale = lang === "uz" ? "uz-UZ" : lang === "kz" ? "kk-KZ" : "ru-RU";
  const compatibilityLabel = lang === "kz" ? "Сәйкес" : lang === "uz" ? "Mos" : "Подходит";
  const clarifyLabel = lang === "kz" ? "Нақтылау" : lang === "uz" ? "Aniqlash" : "Уточнить";
  const whatsappHref = siteWhatsAppHrefWithText(
    lang === "kz"
      ? `Сәлеметсіз бе! Осы тауардың бар-жоғын нақтылағым келеді: ${p.name}${article ? `, артикул ${article}` : ""}.`
      : lang === "uz"
        ? `Assalomu alaykum! Shu mahsulot mavjudligini aniqlashtirmoqchiman: ${p.name}${article ? `, artikul ${article}` : ""}.`
        : `Здравствуйте! Хочу уточнить наличие товара: ${p.name}${article ? `, артикул ${article}` : ""}.`,
  );

  return (
    <article className={`product-card product-card--${variant} group relative`}>
      <div className="relative product-card-media">
        <Link href={`/catalog/${p.id}`} className="block h-full w-full">
          {p.image_url ? (
            <ProductImage
              src={p.image_url}
              alt={p.name}
              imgClassName="transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="product-card-placeholder">
              <Cog size={40} strokeWidth={1.25} className="text-[color:var(--site-accent)]/35" aria-hidden />
            </div>
          )}
        </Link>
        <span className={`product-card-badge${inStock ? " product-card-badge--ok" : " product-card-badge--out"}`}>
          {inStock ? inStockLabel : outStockLabel}
        </span>

        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-105 active:scale-90"
          aria-label={tr(t.nav.favorites, lang)}
        >
          <Heart
            size={15}
            className={`transition-colors duration-300 ${
              isFavorite ? "fill-[#ff3b30] text-[#ff3b30]" : "text-[color:var(--text-silver)]"
            }`}
          />
        </button>
      </div>

      <div className="product-card-body">
        {meta ? <p className="product-card-meta">{meta}</p> : null}
        <Link
          href={`/catalog/${p.id}`}
          className={compact ? "product-card-title text-[14px] min-h-[2.25rem]" : "product-card-title"}
        >
          {p.name}
        </Link>
        {article ? <p className="product-card-sku">{article}</p> : null}
        {purpose ? <p className="product-card-purpose">{purpose}</p> : null}
        {highlights.length > 0 ? (
          <div className="product-card-highlights">
            {highlights.map((item) => (
              <span key={item} className="product-card-highlight-chip">
                {item}
              </span>
            ))}
          </div>
        ) : null}
        {compatibility ? (
          <p className="product-card-compatibility">
            <span>{compatibilityLabel}:</span> {compatibility}
            {p.compatibility_more_count ? ` +${p.compatibility_more_count}` : ""}
          </p>
        ) : null}
        <div className="product-card-footer">
          <div>
            <p className="product-card-price">
              {p.sale_price.toLocaleString(locale)}
              <span className="product-card-currency"> ₸</span>
            </p>
            <p className="product-card-stock">
              {Math.max(0, p.quantity)} {tr(t.ui.pcs, lang)}
            </p>
          </div>
          {inStock ? (
            <AddToCartMorphButton onAdd={onAddToCart} />
          ) : (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="product-card-whatsapp"
              aria-label={clarifyLabel}
            >
              <MessageCircle size={15} aria-hidden />
              <span>{clarifyLabel}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
