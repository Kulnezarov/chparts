"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search, X } from "lucide-react";
import type { PublicCategory } from "@/lib/publicApi";
import { buildCategoryTree, resolveCategoryParentId } from "@/lib/catalogCategories";

type Labels = {
  title: string;
  allCategories: string;
  searchCategory: string;
  wholeSection: string;
  subcategories: string;
  emptyResults: string;
};

type Props = {
  open: boolean;
  labels: Labels;
  categories: PublicCategory[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onClose: () => void;
};

export default function CatalogMobileCategorySheet({
  open,
  labels,
  categories,
  selectedId,
  onSelect,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set());

  const activeParentId = useMemo(
    () => resolveCategoryParentId(categories, selectedId),
    [categories, selectedId],
  );
  const tree = useMemo(() => buildCategoryTree(categories, query), [categories, query]);

  const closeSheet = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeSheet]);

  useEffect(() => {
    if (!open || activeParentId == null) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      next.add(activeParentId);
      return next;
    });
  }, [open, activeParentId]);

  useEffect(() => {
    if (!open || !query.trim()) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      for (const row of tree) {
        if (row.childMatches) next.add(row.parent.id);
      }
      return next;
    });
  }, [open, query, tree]);

  if (!open || typeof document === "undefined") return null;

  const pick = (id: number | null) => {
    onSelect(id);
    closeSheet();
  };

  const toggleParent = (parentId: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(parentId)) next.delete(parentId);
      else next.add(parentId);
      return next;
    });
  };

  return createPortal(
    <div className="catalog-mobile-category-overlay lg:hidden" role="dialog" aria-modal="true" aria-label={labels.title}>
      <button type="button" className="catalog-mobile-category-backdrop" aria-label="Закрыть" onClick={closeSheet} />
      <section className="catalog-mobile-category-sheet">
        <header className="catalog-mobile-category-head">
          <div className="min-w-0 flex-1">
            <p className="filter-section-label">{labels.title}</p>
            <h2 className="truncate text-lg font-bold text-[var(--text-charcoal)]">{labels.allCategories}</h2>
          </div>
          <button
            type="button"
            onClick={closeSheet}
            className="catalog-mobile-category-close"
            aria-label="Закрыть"
          >
            <X size={20} aria-hidden />
          </button>
        </header>

        <div className="catalog-mobile-category-search-wrap">
          <label className="catalog-mobile-category-search">
            <Search size={17} className="shrink-0 text-[var(--text-silver)]" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.searchCategory}
              className="catalog-mobile-category-search-input"
              autoFocus
            />
          </label>
        </div>

        <nav className="catalog-mobile-category-list" aria-label={labels.title}>
          <button
            type="button"
            onClick={() => pick(null)}
            className={`catalog-mobile-category-row catalog-mobile-category-row--root${
              selectedId == null ? " catalog-mobile-category-row--active" : ""
            }`}
          >
            <span>{labels.allCategories}</span>
            {selectedId == null && <Check size={18} className="shrink-0 text-[var(--site-accent)]" aria-hidden />}
          </button>

          {tree.map(({ parent, children }) => {
            const isExpanded = expanded.has(parent.id);
            const parentActive = selectedId === parent.id;
            const childActive = children.some((child) => child.id === selectedId);
            const hasChildren = children.length > 0;

            return (
              <div key={parent.id} className="catalog-mobile-category-group">
                <button
                  type="button"
                  onClick={() => toggleParent(parent.id)}
                  className={`catalog-mobile-category-row catalog-mobile-category-row--parent${
                    parentActive || childActive ? " catalog-mobile-category-row--active" : ""
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate text-left">{parent.name}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[var(--site-accent)] transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>

                {isExpanded && (
                  <div className="catalog-mobile-category-folder">
                    {hasChildren && (
                      <p className="catalog-mobile-category-children-label">{labels.subcategories}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => pick(parent.id)}
                      className={`catalog-mobile-category-child${
                        parentActive ? " catalog-mobile-category-child--active" : ""
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block">{labels.wholeSection}</span>
                        <span className="catalog-mobile-category-child-hint">
                          Все товары в папке «{parent.name}»
                        </span>
                      </span>
                      {parentActive && <Check size={17} className="shrink-0" aria-hidden />}
                    </button>
                    {children.map((child) => {
                      const active = selectedId === child.id;
                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => pick(child.id)}
                          className={`catalog-mobile-category-child${
                            active ? " catalog-mobile-category-child--active" : ""
                          }`}
                        >
                          <span>{child.name}</span>
                          {active && <Check size={17} className="shrink-0" aria-hidden />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {tree.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-[var(--text-silver)]">{labels.emptyResults}</p>
          )}
        </nav>
      </section>
    </div>,
    document.body,
  );
}
