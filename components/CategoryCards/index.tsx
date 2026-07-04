"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { fetchPublicCategories, type PublicCategory } from "@/lib/publicApi";
import {
  categoryVisualTone,
  filterParentCategories,
  pickHomeCategories,
} from "@/lib/catalogCategories";
import CategoryIcon from "@/components/CategoryCards/CategoryIcon";

export default function CategoryCards() {
  const lang = useLang();
  const [allCategories, setAllCategories] = useState<PublicCategory[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchPublicCategories()
      .then((list) => {
        if (!cancelled) setAllCategories(list);
      })
      .catch(() => {
        if (!cancelled) setAllCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const parentCount = useMemo(() => filterParentCategories(allCategories).length, [allCategories]);
  const categories = useMemo(() => pickHomeCategories(allCategories, 12), [allCategories]);

  if (!categories.length) return null;

  return (
    <section className="section-band section-band--muted">
      <div className="site-container py-14 sm:py-16">
        <div className="section-intro">
          <p className="section-eyebrow">{tr(t.nav.catalog, lang)}</p>
          <h2 className="section-heading">{tr(t.catalog.sectionsTitle, lang)}</h2>
          <p className="section-lead">
            {parentCount || categories.length} {tr(t.catalog.categoriesCount, lang)} · {tr(t.catalog.subtitle, lang)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {categories.map((cat) => {
            const tone = categoryVisualTone(cat.name);
            const countLabel =
              cat.products_count != null && cat.products_count > 0
                ? `${cat.products_count} ${tr(t.ui.pcs, lang)}`
                : null;

            return (
              <Link
                key={cat.id}
                href={`/catalog?cat=${cat.id}`}
                className="pro-card group flex min-h-[7.5rem] flex-col justify-between overflow-hidden p-4 sm:min-h-[8.25rem]"
              >
                <div className="flex items-start justify-between gap-2">
                  {cat.image_url ? (
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[var(--surface-light)]">
                      <Image
                        src={cat.image_url}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <CategoryIcon tone={tone} />
                  )}
                  {countLabel && (
                    <span className="rounded-full bg-[var(--surface-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-silver)]">
                      {countLabel}
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="line-clamp-2 text-left text-sm font-semibold leading-snug text-[var(--text-charcoal)] group-hover:text-[var(--site-accent)]">
                    {cat.name}
                  </h3>
                  <span className="mt-1.5 inline-flex items-center gap-0.5 text-[11px] font-semibold text-[var(--text-silver)] group-hover:text-[var(--site-accent)]">
                    {tr(t.catalog.browse, lang)}
                    <ChevronRight className="h-3 w-3" aria-hidden />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 rounded-full btn-primary px-6 py-2.5 text-sm font-semibold text-white"
          >
            {tr(t.ui.featuredAll, lang)}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
