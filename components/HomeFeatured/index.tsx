"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { fetchPublicProductsPage, type PublicProduct } from "@/lib/publicApi";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";
import { useCartStore } from "@/store/cartStore";
import { cartExtrasFromProduct } from "@/lib/cartProductMeta";
import { useToastStore } from "@/store/toastStore";

export default function HomeFeatured() {
  const lang = useLang();
  const [items, setItems] = useState<PublicProduct[]>([]);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const page = await fetchPublicProductsPage({ page: 1, pageSize: 16 });
        if (!cancelled) setItems(page.items);
      } catch {
        if (!cancelled) setItems([]);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const top = useMemo(() => {
    return [...items].sort((a, b) => Number(b.quantity > 0) - Number(a.quantity > 0)).slice(0, 8);
  }, [items]);

  const inStock = lang === "ru" ? "В наличии" : lang === "kz" ? "Қолда бар" : "In stock";
  const outStock = lang === "ru" ? "Нет в наличии" : lang === "kz" ? "Қолда жоқ" : "Out of stock";

  if (!top.length) return null;

  return (
    <section className="section-band section-band--canvas">
      <div className="site-container py-14 sm:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[color:var(--text-charcoal)]">{tr(t.ui.featuredTitle, lang)}</h2>
          <Link
            href="/catalog"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[color:var(--site-accent)] hover:underline"
          >
            {tr(t.ui.featuredAll, lang)}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {top.map((p) => (
            <CatalogProductCard
              key={p.id}
              product={p}
              brandName={p.brand_name || p.brand || "—"}
              categoryName={p.category_name || "—"}
              inStockLabel={inStock}
              outStockLabel={outStock}
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
      </div>
    </section>
  );
}
