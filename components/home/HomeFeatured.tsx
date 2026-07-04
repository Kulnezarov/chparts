"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { fetchPublicProductsPage, type PublicProduct } from "@/lib/publicApi";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";
import { ProductCardGridSkeleton, TopLoadingBar } from "@/components/ui/Skeleton";
import { useCartStore } from "@/store/cartStore";
import { cartExtrasFromProduct } from "@/lib/cartProductMeta";
import { useToastStore } from "@/store/toastStore";

export default function HomeFeatured() {
  const lang = useLang();
  const [items, setItems] = useState<PublicProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoadError(false);
        const page = await fetchPublicProductsPage({ page: 1, pageSize: 8 });
        if (!cancelled) {
          setItems(page.items);
          setTotal(page.total);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setLoadError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const top = useMemo(() => {
    return [...items].sort((a, b) => Number(b.quantity > 0) - Number(a.quantity > 0));
  }, [items]);

  const inStock = lang === "ru" ? "В наличии" : lang === "kz" ? "Қолда бар" : "Bor";
  const outStock = lang === "ru" ? "Нет в наличии" : lang === "kz" ? "Қолда жоқ" : "Yo'q";

  if (!loading && loadError) {
    return (
      <section className="bg-[color:var(--surface-light)]">
        <div className="site-container pb-6 pt-8 sm:pb-8 sm:pt-10">
          <div className="empty-state text-center">
            <p className="text-sm font-medium text-[color:var(--text-charcoal)]">
              {lang === "ru"
                ? "Не удалось загрузить товары. Проверьте, что сервер запущен (dev.cmd или Start-CHparts.bat) и открыт http://localhost:3000"
                : lang === "kz"
                  ? "Тауарларды жүктеу мүмкін болмады. Сервер іске қосылғанын тексеріңіз."
                  : "Tovarlarni yuklab bo'lmadi. Server ishlayotganini va http://localhost:3000 ochilganini tekshiring."}
            </p>
            <Link href="/catalog" className="btn-primary mt-4 inline-flex">
              {tr(t.nav.catalog, lang)}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!loading && !top.length) return null;

  return (
    <section className="bg-[color:var(--surface-light)]">
      <div className="site-container pb-6 pt-8 sm:pb-8 sm:pt-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-accent)]">
              {tr(t.nav.catalog, lang)}
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-[color:var(--text-charcoal)] sm:text-[1.65rem]">
              {tr(t.ui.featuredTitle, lang)}
            </h2>
            {total > 0 && (
              <p className="mt-1 text-sm text-[color:var(--text-silver)]">
                {total.toLocaleString("ru-RU")}{" "}
                {lang === "ru" ? "позиций в каталоге" : lang === "kz" ? "каталогтағы позиция" : "pozitsiya katalogda"}
              </p>
            )}
          </div>
          <Link
            href="/catalog"
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--site-accent)] shadow-sm transition-colors hover:bg-[color:var(--site-accent-soft)]"
          >
            {tr(t.ui.featuredAll, lang)}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <>
            <TopLoadingBar active />
            <ProductCardGridSkeleton count={8} />
          </>
        ) : (
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
        )}
      </div>
    </section>
  );
}
