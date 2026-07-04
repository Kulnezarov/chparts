import { brands as siteBrands } from "@/lib/data";
import type { PublicBrand, PublicProduct } from "@/lib/publicApi";

/** Код модели с карточки товара (бэкенд отдаёт поле `model`). */
export function getProductModel(product: PublicProduct): string | null {
  const raw = product.model?.trim() || product.car_model_compatibility?.trim();
  return raw || null;
}

/**
 * ID марки без кода модели в названии (исключаем «FAW 1010», «1010», «Changan Star/Faw 1024»).
 */
export function resolveMakeBrandId(apiBrands: PublicBrand[], makeName: string): number | null {
  const needle = makeName.trim().toLowerCase();
  if (!needle) return null;

  const exact = apiBrands.find((b) => b.name.trim().toLowerCase() === needle);
  if (exact) return exact.id;

  const needleCompact = needle.replace(/\s+/g, "");
  const compact = apiBrands.find(
    (b) => b.name.trim().toLowerCase().replace(/\s+/g, "") === needleCompact,
  );
  if (compact) return compact.id;

  const shortName = apiBrands.find((b) => {
    const n = b.name.trim().toLowerCase();
    if (/\d/.test(n)) return false;
    if (n.includes("/") || n.includes(" ")) return false;
    return n === needle;
  });
  return shortName?.id ?? null;
}

/** Марки для фильтра каталога: FAW, Changan, Dongfeng, Wuling. */
export function getCatalogMakeOptions(apiBrands: PublicBrand[]): PublicBrand[] {
  const options: PublicBrand[] = [];
  for (const site of siteBrands) {
    const id = resolveMakeBrandId(apiBrands, site.name);
    if (id != null) options.push({ id, name: site.name });
  }
  return options;
}

export function collectModelCodes(products: PublicProduct[]): string[] {
  const unique = new Set<string>();
  for (const p of products) {
    const code = getProductModel(p);
    if (code) unique.add(code);
  }
  return Array.from(unique).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}
