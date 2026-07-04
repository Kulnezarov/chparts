import type { Metadata } from "next";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

async function fetchPublicNames(
  path: "categories" | "brands",
): Promise<{ id: number; name: string }[]> {
  if (!API_BASE) return [];
  try {
    const r = await fetch(`${API_BASE}/api/v1/public/${path}`, { next: { revalidate: 300 } });
    if (!r.ok) return [];
    const data = (await r.json()) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .filter((row): row is { id: number; name: string } => row != null && typeof row === "object")
      .map((row) => ({ id: Number((row as { id: unknown }).id), name: String((row as { name: unknown }).name ?? "") }))
      .filter((row) => row.name.trim().length > 0);
  } catch {
    return [];
  }
}

type SearchParams = { cat?: string; brand?: string; q?: string };

export async function buildCatalogMetadata(sp: SearchParams): Promise<Metadata> {
  const catId = sp.cat ? Number(sp.cat) : NaN;
  const brandId = sp.brand ? Number(sp.brand) : NaN;
  const q = sp.q?.trim() ?? "";

  let title = "Каталог автозапчастей";
  let description =
    "Каталог автозапчастей FAW, Changan, Dongfeng, Wuling. Поиск по OEM и названию, цены в тенге, доставка по Казахстану.";
  const canonicalParams = new URLSearchParams();
  if (q) canonicalParams.set("q", q);
  if (!Number.isNaN(catId)) canonicalParams.set("cat", String(catId));
  if (!Number.isNaN(brandId)) canonicalParams.set("brand", String(brandId));
  const canonical = canonicalParams.toString() ? `/catalog?${canonicalParams.toString()}` : "/catalog";

  if (!Number.isNaN(catId)) {
    const cats = await fetchPublicNames("categories");
    const name = cats.find((c) => c.id === catId)?.name;
    if (name) {
      title = `${name} — каталог запчастей`;
      description = `Купить ${name.toLowerCase()} для китайских авто. Актуальные цены, наличие на складе, доставка по Казахстану.`;
    }
  } else if (!Number.isNaN(brandId)) {
    const brs = await fetchPublicNames("brands");
    const name = brs.find((b) => b.id === brandId)?.name;
    if (name) {
      title = `Запчасти ${name}`;
      description = `Автозапчасти ${name}: оригинал и аналоги. Подбор по OEM, WhatsApp-консультация, доставка по KZ.`;
    }
  } else if (q) {
    title = `Поиск: ${q}`;
    description = `Результаты поиска «${q}» в каталоге CHParts. Запчасти для китайских автомобилей.`;
  }

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  };
}
