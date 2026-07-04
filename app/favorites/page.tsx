"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useCartStore } from "@/store/cartStore";
import { cartExtrasFromProduct } from "@/lib/cartProductMeta";
import { useToastStore } from "@/store/toastStore";
import {
  fetchPublicBrands,
  fetchPublicCategories,
  buildIdNameMap,
  type PublicProduct,
} from "@/lib/publicApi";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";
import InnerPageLayout from "@/components/layout/InnerPageLayout";
import { ProductCardGridSkeleton, SlowLoadingHint, TopLoadingBar } from "@/components/ui/Skeleton";

export default function FavoritesPage() {
  const lang = useLang();
  const favorites = useFavoritesStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);

  const [categoryById, setCategoryById] = useState<Map<number, string>>(new Map());
  const [brandById, setBrandById] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadMetadata = async () => {
      try {
        const [cats, brs] = await Promise.all([
          fetchPublicCategories(),
          fetchPublicBrands(),
        ]);
        if (!active) return;
        setCategoryById(buildIdNameMap(cats));
        setBrandById(buildIdNameMap(brs));
      } catch (err) {
        console.error("Failed to load metadata for favorites page", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadMetadata();
    return () => {
      active = false;
    };
  }, []);

  const labels = useMemo(() => {
    return {
      ru: {
        title: "Избранное",
        empty: "Список избранного пуст",
        emptyHint: "Отмечайте запчасти сердечком в каталоге, чтобы не потерять их.",
        toCatalog: "В каталог",
        added: "Товар добавлен в корзину",
        inStock: "В наличии",
        outStock: "Под заказ",
      },
      kz: {
        title: "Таңдаулылар",
        empty: "Таңдаулылар тізімі бос",
        emptyHint: "Жоғалтып алмас үшін каталогтағы бөлшектерді жүрекшемен белгілеңіз.",
        toCatalog: "Каталогқа",
        added: "Тауар себетке қосылды",
        inStock: "Қолда бар",
        outStock: "Тапсырыспен",
      },
      uz: {
        title: "Sevimlilar",
        empty: "Sevimlilar ro'yxati bo'sh",
        emptyHint: "Katalogdagi detallarni yurakcha bilan belgilang — bu yerda saqlanadi.",
        toCatalog: "Katalogga",
        added: "Tovar savatga qo'shildi",
        inStock: "Bor",
        outStock: "Buyurtma bo'yicha",
      },
    }[lang];
  }, [lang]);

  const handleAddToCart = (p: PublicProduct) => {
    addItem({
      id: p.id,
      name: p.name,
      price: p.sale_price,
      imageUrl: p.image_url,
      available: p.quantity,
      ...cartExtrasFromProduct(p),
    });
    showToast(labels.added);
  };

  const getBrandName = (p: PublicProduct) => {
    if (p.brand_name) return p.brand_name;
    if (p.brand_id && brandById.has(p.brand_id)) return brandById.get(p.brand_id)!;
    return "—";
  };

  const getCategoryName = (p: PublicProduct) => {
    if (p.category_name) return p.category_name;
    if (p.category_id && categoryById.has(p.category_id)) return categoryById.get(p.category_id)!;
    return "—";
  };

  return (
    <>
      <TopLoadingBar active={loading} />
      <InnerPageLayout
        breadcrumbs={[
          { label: tr(t.nav.home, lang), href: "/" },
          { label: labels.title },
        ]}
        title={labels.title}
      >
        {loading ? (
          <div>
            <SlowLoadingHint active />
            <ProductCardGridSkeleton count={favorites.length > 0 ? Math.min(favorites.length, 8) : 4} />
          </div>
        ) : favorites.length === 0 ? (
          <div className="surface-panel mt-2 rounded-2xl border-2 border-dashed border-black/[0.08] bg-[color:var(--surface-light)]/50 p-10 text-center sm:p-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--site-accent-soft)] text-[color:var(--site-accent)]/40">
              <Heart className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <p className="font-medium text-[color:var(--text-charcoal)]">{labels.empty}</p>
            <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{labels.emptyHint}</p>
            <Link href="/catalog" className="btn-primary mt-6">
              {labels.toCatalog}
            </Link>
          </div>
        ) : (
          <div className="catalog-product-grid">
            {favorites.map((p) => (
              <CatalogProductCard
                key={p.id}
                product={p}
                brandName={getBrandName(p)}
                categoryName={getCategoryName(p)}
                inStockLabel={labels.inStock}
                outStockLabel={labels.outStock}
                onAddToCart={() => handleAddToCart(p)}
              />
            ))}
          </div>
        )}
      </InnerPageLayout>
    </>
  );
}
