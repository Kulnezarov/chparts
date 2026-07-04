"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import BrandLogoImage from "@/components/ui/BrandLogoImage";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { brands } from "@/lib/data";
import { getBrandLogoSrc } from "@/lib/brandLogos";
import { fetchPublicBrands } from "@/lib/publicApi";
import { matchBrandId } from "@/lib/brandResolve";

export default function BrandCards() {
  const lang = useLang();
  const [hrefs, setHrefs] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublicBrands()
      .then((list) => {
        if (cancelled) return;
        const next: Record<string, string> = {};
        for (const b of brands) {
          const id = matchBrandId(list, b.name);
          next[b.slug] = id != null ? `/catalog?brand=${id}` : "/catalog";
        }
        setHrefs(next);
      })
      .catch(() => {
        if (!cancelled) setHrefs(Object.fromEntries(brands.map((x) => [x.slug, "/catalog"])));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section-band section-band--muted">
      <div className="site-container py-14 sm:py-16">
        <div className="section-intro">
          <p className="section-eyebrow">{tr(t.nav.catalog, lang)}</p>
          <h2 className="section-heading">{tr(t.brands.title, lang)}</h2>
          <p className="section-lead">{tr(t.brands.subtitle, lang)}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={hrefs?.[brand.slug] ?? "/catalog"}
              className="pro-card group flex flex-col items-center gap-4 px-4 py-6"
            >
              <div className="relative flex h-14 w-full max-w-[140px] items-center justify-center">
                <BrandLogoImage
                  src={getBrandLogoSrc(brand.slug)}
                  alt={brand.name}
                  width={140}
                  height={56}
                  sizes="140px"
                  className="h-full w-full object-contain opacity-90 transition-opacity group-hover:opacity-100"
                />
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-[color:var(--foreground)] group-hover:text-[color:var(--site-accent)]">
                {brand.name}
                <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
