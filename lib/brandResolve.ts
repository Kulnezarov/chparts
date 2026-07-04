import type { PublicBrand } from "@/lib/publicApi";
import { resolveMakeBrandId } from "@/lib/catalogFitment";

/** Сопоставление названия бренда с id из API каталога */
export function matchBrandId(brands: PublicBrand[], displayName: string): number | null {
  const makeId = resolveMakeBrandId(brands, displayName);
  if (makeId != null) return makeId;

  const needle = displayName.trim().toLowerCase();
  const exact = brands.find((b) => b.name.trim().toLowerCase() === needle);
  if (exact) return exact.id;
  return (
    brands.find(
      (b) =>
        b.name.toLowerCase().includes(needle) || needle.includes(b.name.trim().toLowerCase()),
    )?.id ?? null
  );
}
