import type { MetadataRoute } from "next";
import { fetchPublicProducts } from "@/lib/publicApi";
import { SITE_URL } from "@/lib/siteConfig";

const STATIC_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/catalog", priority: 0.9, changeFrequency: "daily" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contacts", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, priority, changeFrequency }) => ({
    url: path ? `${SITE_URL}${path}` : `${SITE_URL}/`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchPublicProducts();
    productEntries = products.slice(0, 5000).map((p) => ({
      url: `${SITE_URL}/catalog/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
  } catch {
    /* API недоступен при сборке — sitemap всё равно отдаст статические URL */
  }

  return [...staticEntries, ...productEntries];
}
