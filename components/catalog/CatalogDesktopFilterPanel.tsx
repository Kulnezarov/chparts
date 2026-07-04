"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import type { PublicCategory, PublicProductSort } from "@/lib/publicApi";
import { buildCategoryTree, resolveCategoryParentId } from "@/lib/catalogCategories";

const SORT_VALUES: PublicProductSort[] = [
  "default",
  "price_asc",
  "price_desc",
  "name_asc",
  "name_desc",
];

type Labels = {
  filters: string;
  hideFilters: string;
  showFilters: string;
  searchCategory: string;
  allCategories: string;
  wholeSection: string;
  sort: string;
  sortDefault: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortNameAsc: string;
  sortNameDesc: string;
  categories: string;
  subcategories: string;
};

type Props = {
  labels: Labels;
  categories: PublicCategory[];
  categoryId: number | null;
  sort: PublicProductSort;
  open: boolean;
  onToggleOpen: () => void;
  onCategoryChange: (id: number | null) => void;
  onSortChange: (sort: PublicProductSort) => void;
};

const STORAGE_KEY = "chparts-catalog-filter-open";

export function readCatalogFilterOpen(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "0") return false;
    if (v === "1") return true;
  } catch {
    /* ignore */
  }
  return true;
}

export function writeCatalogFilterOpen(open: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, open ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export default function CatalogDesktopFilterPanel({
  labels,
  categories,
  categoryId,
  sort,
  open,
  onToggleOpen,
  onCategoryChange,
  onSortChange,
}: Props) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set());

  const activeParentId = useMemo(
    () => resolveCategoryParentId(categories, categoryId),
    [categories, categoryId],
  );

  const tree = useMemo(() => buildCategoryTree(categories, query), [categories, query]);

  useEffect(() => {
    if (activeParentId == null) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      next.add(activeParentId);
      return next;
    });
  }, [activeParentId]);

  useEffect(() => {
    if (!query.trim()) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      for (const row of tree) {
        if (row.childMatches) next.add(row.parent.id);
      }
      return next;
    });
  }, [query, tree]);

  const toggleParent = (parentId: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(parentId)) next.delete(parentId);
      else next.add(parentId);
      return next;
    });
  };

  if (!open) {
    return (
      <div className="catalog-filter-collapsed">
        <button
          type="button"
          onClick={onToggleOpen}
          className="catalog-filter-reopen"
          aria-label={labels.showFilters}
        >
          <PanelLeftOpen size={18} aria-hidden />
          <span>{labels.filters}</span>
        </button>
      </div>
    );
  }

  return (
    <aside className="catalog-filter-panel">
      <div className="catalog-filter-panel-head">
        <h2 className="catalog-filter-panel-title">{labels.filters}</h2>
        <button
          type="button"
          onClick={onToggleOpen}
          className="catalog-filter-panel-hide"
          aria-label={labels.hideFilters}
        >
          <PanelLeftClose size={18} aria-hidden />
        </button>
      </div>

      <label className="catalog-filter-search">
        <Search size={16} className="shrink-0 text-[color:var(--text-silver)]" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchCategory}
          className="catalog-filter-search-input"
        />
      </label>

      <div className="catalog-filter-section">
        <p className="filter-section-label">{labels.sort}</p>
        <select
          value={sort}
          onChange={(e) => {
            const v = e.target.value as PublicProductSort;
            if (SORT_VALUES.includes(v)) onSortChange(v);
          }}
          className="input-catalog catalog-filter-sort"
        >
          <option value="default">{labels.sortDefault}</option>
          <option value="price_asc">{labels.sortPriceAsc}</option>
          <option value="price_desc">{labels.sortPriceDesc}</option>
          <option value="name_asc">{labels.sortNameAsc}</option>
          <option value="name_desc">{labels.sortNameDesc}</option>
        </select>
      </div>

      <div className="catalog-filter-section min-h-0 flex-1">
        <p className="filter-section-label">{labels.categories}</p>
        <nav className="catalog-category-accordion" aria-label={labels.categories}>
          <button
            type="button"
            onClick={() => onCategoryChange(null)}
            className={`catalog-category-row catalog-category-row--root${
              categoryId == null ? " catalog-category-row--active" : ""
            }`}
          >
            {labels.allCategories}
          </button>

          {tree.map(({ parent, children }) => {
            const isExpanded = expanded.has(parent.id);
            const parentActive = categoryId === parent.id;
            const childActive = children.some((c) => c.id === categoryId);
            const hasChildren = children.length > 0;

            return (
              <div key={parent.id} className="catalog-category-group">
                <button
                  type="button"
                  onClick={() => toggleParent(parent.id)}
                  className={`catalog-category-row catalog-category-row--parent${
                    parentActive || childActive ? " catalog-category-row--open" : ""
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate text-left font-semibold">{parent.name}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-[color:var(--site-accent)] transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>

                {isExpanded && (
                  <div className="catalog-category-folder">
                    {hasChildren && (
                      <p className="catalog-category-children-label">{labels.subcategories}</p>
                    )}
                    <div className="catalog-category-children">
                      <button
                        type="button"
                        onClick={() => onCategoryChange(parent.id)}
                        className={`catalog-category-child${
                          parentActive ? " catalog-category-child--active" : ""
                        }`}
                      >
                        <span className="block">{labels.wholeSection}</span>
                        <span className="catalog-category-child-hint">
                          Все товары в папке «{parent.name}»
                        </span>
                      </button>
                      {children.map((child) => (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => onCategoryChange(child.id)}
                          className={`catalog-category-child${
                            categoryId === child.id ? " catalog-category-child--active" : ""
                          }`}
                        >
                          {child.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
