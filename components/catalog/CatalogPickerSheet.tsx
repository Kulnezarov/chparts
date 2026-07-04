"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Search, X } from "lucide-react";

export type PickerOption = {
  value: string;
  label: string;
  description?: string;
};

type Props = {
  open: boolean;
  title: string;
  allLabel: string;
  allDescription?: string;
  searchPlaceholder: string;
  helperText?: string;
  emptyLabel?: string;
  options: PickerOption[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
  onClose: () => void;
};

export default function CatalogPickerSheet({
  open,
  title,
  allLabel,
  allDescription,
  searchPlaceholder,
  helperText,
  emptyLabel = "Ничего не найдено",
  options,
  selectedValue,
  onSelect,
  onClose,
}: Props) {
  const [q, setQ] = useState("");

  const closeSheet = useCallback(() => {
    setQ("");
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

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((o) => o.label.toLowerCase().includes(needle));
  }, [options, q]);

  if (!open || typeof document === "undefined") return null;

  const pick = (value: string | null) => {
    onSelect(value);
    closeSheet();
  };

  return createPortal(
    <div className="catalog-picker fixed inset-0 z-[100] flex flex-col bg-white lg:hidden" role="dialog" aria-modal="true" aria-label={title}>
      <header className="flex shrink-0 items-center gap-3 border-b border-black/[0.06] px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={closeSheet}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f7] text-[var(--text-charcoal)]"
          aria-label="Назад"
        >
          <X size={20} />
        </button>
        <h2 className="flex-1 text-lg font-bold text-[var(--text-charcoal)]">{title}</h2>
      </header>

      <div className="shrink-0 px-4 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-silver)]" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="input-catalog h-11 w-full pl-10 text-[16px]"
            autoFocus
          />
        </div>
        {helperText && <p className="mt-2 px-1 text-xs leading-snug text-[var(--text-silver)]">{helperText}</p>}
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <li>
          <button
            type="button"
            className={`catalog-picker-row${selectedValue == null || selectedValue === "" ? " catalog-picker-row--active" : ""}`}
            onClick={() => pick(null)}
          >
            <span className="min-w-0 text-left">
              <span className="block">{allLabel}</span>
              {allDescription && <span className="catalog-picker-row-hint">{allDescription}</span>}
            </span>
            {(selectedValue == null || selectedValue === "") && <Check className="h-5 w-5 shrink-0 text-[var(--site-accent)]" strokeWidth={2.5} />}
          </button>
        </li>
        {filtered.map((o) => {
          const active = selectedValue === o.value;
          return (
            <li key={o.value}>
              <button
                type="button"
                className={`catalog-picker-row${active ? " catalog-picker-row--active" : ""}`}
                onClick={() => pick(o.value)}
              >
                <span className="min-w-0 text-left">
                  <span className="block truncate">{o.label}</span>
                  {o.description && <span className="catalog-picker-row-hint">{o.description}</span>}
                </span>
                {active && <Check className="h-5 w-5 shrink-0 text-[var(--site-accent)]" strokeWidth={2.5} />}
              </button>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-[var(--text-silver)]">{emptyLabel}</li>
        )}
      </ul>
    </div>,
    document.body,
  );
}
