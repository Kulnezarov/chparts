/** Единый источник URL сайта для metadata, sitemap, canonical. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://chparts.kz").replace(/\/$/, "");

export const SITE_NAME = "CHParts";

export const SITE_DESCRIPTION =
  "Официальные и проверенные автозапчасти FAW, Changan, Dongfeng, Wuling. Каталог, доставка по Казахстану, подбор по артикулу.";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Страницы, которые не индексируем (корзина, личное). */
export const NOINDEX_METADATA = {
  robots: { index: false, follow: false },
} as const;
