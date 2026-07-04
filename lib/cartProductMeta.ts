import type { PublicProduct } from "@/lib/publicApi";

export type CartProductExtras = {
  barcode?: string | null;
  sku?: string | null;
  brandName?: string | null;
  categoryName?: string | null;
};

export function cartExtrasFromProduct(product: Pick<
  PublicProduct,
  "barcode" | "sku" | "article_oem" | "brand_name" | "brand" | "category_name"
>): CartProductExtras {
  const barcode = product.barcode?.trim() || null;
  const sku = product.sku?.trim() || product.article_oem?.trim() || null;
  const brandName = product.brand_name?.trim() || product.brand?.trim() || null;
  const categoryName = product.category_name?.trim() || null;
  return { barcode, sku, brandName, categoryName };
}
