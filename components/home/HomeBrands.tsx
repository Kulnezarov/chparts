"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BrandLogoImage from "@/components/ui/BrandLogoImage";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { brands } from "@/lib/data";
import { getBrandLogoSrc } from "@/lib/brandLogos";
import { fetchPublicBrands } from "@/lib/publicApi";
import { matchBrandId } from "@/lib/brandResolve";

/** Порядок на главной: FAW → Dongfeng → Changan → Wuling */
const BRAND_ORDER = ["faw", "dongfeng", "changan", "wuling"] as const;
const ORDERED_BRANDS = BRAND_ORDER.map((slug) => brands.find((b) => b.slug === slug)!).filter(Boolean);

export default function HomeBrands() {
  const lang = useLang();
  const [hrefs, setHrefs] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublicBrands()
      .then((list) => {
        if (cancelled) return;
        const next: Record<string, string> = {};
        for (const b of ORDERED_BRANDS) {
          const id = matchBrandId(list, b.name);
          next[b.slug] = id != null ? `/catalog?brand=${id}` : "/catalog";
        }
        setHrefs(next);
      })
      .catch(() => {
        if (!cancelled) setHrefs(Object.fromEntries(ORDERED_BRANDS.map((x) => [x.slug, "/catalog"])));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative z-10 bg-[color:var(--surface-light)] pb-2 pt-8 sm:pt-10 sm:pb-4">
      <div className="site-container">
        <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--text-silver)]">
          {tr(t.hero.brandsEyebrow, lang)}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {ORDERED_BRANDS.map((brand) => (
            <Link
              key={brand.slug}
              href={hrefs?.[brand.slug] ?? "/catalog"}
              className="group flex flex-col items-center gap-3 rounded-[var(--radius-widget)] border border-black/[0.06] bg-white px-4 py-5 shadow-[0_2px_16px_rgba(29,29,31,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--site-accent)]/25 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="relative flex h-12 w-full max-w-[120px] items-center justify-center sm:h-14">
                <BrandLogoImage src={getBrandLogoSrc(brand.slug)} alt={brand.name} />
              </div>
              <span className="text-sm font-semibold text-[color:var(--text-charcoal)] transition-colors group-hover:text-[color:var(--site-accent)]">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
