"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import CatalogFilterSelects, { type FilterSelectOption } from "./CatalogFilterSelects";

type Labels = {
  filters: string;
  category: string;
  brand: string;
  model: string;
  noCategory: string;
  noBrand: string;
  all: string;
  apply: string;
  clear: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  labels: Labels;
  categories: FilterSelectOption[];
  brands: FilterSelectOption[];
  modelOptions: string[];
  categoryId: number | null;
  brandId: number | null;
  model: string;
  onCategoryChange: (id: number | null) => void;
  onBrandChange: (id: number | null) => void;
  onModelChange: (value: string | null) => void;
  onClear: () => void;
};

export default function CatalogFilterSheet({
  open,
  onClose,
  labels,
  categories,
  brands,
  modelOptions,
  categoryId,
  brandId,
  model,
  onCategoryChange,
  onBrandChange,
  onModelChange,
  onClear,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-label={labels.filters}>
      <button
        type="button"
        className="absolute inset-0 bg-black/35"
        aria-label="Закрыть"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[min(85vh,520px)] overflow-hidden rounded-t-[20px] border border-black/[0.08] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3">
          <h2 className="text-base font-bold text-[var(--text-charcoal)]">{labels.filters}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f5f7] text-[var(--text-charcoal)]"
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-4">
          <CatalogFilterSelects
            labels={labels}
            categories={categories}
            brands={brands}
            modelOptions={modelOptions}
            categoryId={categoryId}
            brandId={brandId}
            model={model}
            onCategoryChange={onCategoryChange}
            onBrandChange={onBrandChange}
            onModelChange={onModelChange}
          />
        </div>
        <div className="flex gap-2 border-t border-black/[0.06] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onClear}
            className="h-11 flex-1 rounded-full border border-black/[0.1] text-sm font-semibold text-[var(--text-charcoal)]"
          >
            {labels.clear}
          </button>
          <button type="button" onClick={onClose} className="h-11 flex-1 rounded-full btn-primary text-sm font-semibold text-white">
            {labels.apply}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
