"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { fetchPublicCategories, type PublicCategory } from "@/lib/publicApi";
import {
  buildParentChildMap,
  categoryVisualTone,
  filterParentCategories,
  formatSubcategoryPreview,
  pickHomeCategories,
} from "@/lib/catalogCategories";
import CategoryIcon from "@/components/CategoryCards/CategoryIcon";

const HOME_CATEGORY_LIMIT = 8;

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
  const childMap = useMemo(() => buildParentChildMap(allCategories), [allCategories]);
  const categories = useMemo(
    () => pickHomeCategories(allCategories, HOME_CATEGORY_LIMIT),
    [allCategories],
  );

  if (!categories.length) return null;

  return (
    <section className="section-band section-band--muted">
      <div className="site-container py-14 sm:py-16">
        <div className="section-intro">
          <p className="section-eyebrow">{tr(t.nav.catalog, lang)}</p>
          <h2 className="section-heading">{tr(t.catalog.sectionsTitle, lang)}</h2>
          <p className="section-lead">
            {parentCount || categories.length} {tr(t.catalog.categoriesCount, lang)} ·{" "}
            {tr(t.catalog.subtitle, lang)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {categories.map((cat) => {
            const children = childMap.get(cat.id) ?? [];
            const subtitle = formatSubcategoryPreview(children, 3);
            const tone = categoryVisualTone(cat.name);

            return (
              <Link
                key={cat.id}
                href={`/catalog?cat=${cat.id}`}
                className="category-card group flex min-h-[8.5rem] flex-col justify-between p-4 sm:min-h-[9rem]"
              >
                <CategoryIcon tone={tone} />
                <div className="mt-3">
                  <h3 className="line-clamp-2 text-left text-sm font-semibold leading-snug text-[var(--text-charcoal)] group-hover:text-[var(--site-accent)]">
                    {cat.name}
                  </h3>
                  {subtitle ? (
                    <p className="mt-1 line-clamp-2 text-left text-[11px] leading-snug text-[var(--text-silver)]">
                      {subtitle}
                    </p>
                  ) : cat.products_count != null && cat.products_count > 0 ? (
                    <p className="mt-1 text-left text-[11px] text-[var(--text-silver)]">
                      {cat.products_count} {tr(t.ui.pcs, lang)}
                    </p>
                  ) : null}
                  <span className="category-card__action">
                    {tr(t.catalog.browse, lang)}
                    <ChevronRight className="category-card__action-icon" aria-hidden />
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
