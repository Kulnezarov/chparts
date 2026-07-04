"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

export type ChipOption = { id: number; name: string };

type Props = {
  label: string;
  allLabel: string;
  options: ChipOption[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  maxHeightClass?: string;
};

export default function FilterChips({
  label,
  allLabel,
  options,
  selectedId,
  onSelect,
  searchable = false,
  searchPlaceholder = "Поиск…",
  maxHeightClass = "max-h-52",
}: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((o) => o.name.toLowerCase().includes(needle));
  }, [options, q]);

  return (
    <div>
      <p className="filter-section-label">{label}</p>
      {searchable && options.length > 8 && (
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-silver)]" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="input-catalog h-9 pl-9 text-sm"
          />
          {q && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--text-silver)] hover:bg-black/[0.04]"
              onClick={() => setQ("")}
              aria-label="Очистить"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
      <div className={`filter-chip-scroll ${maxHeightClass}`}>
        <button
          type="button"
          className={`filter-chip${selectedId == null ? " filter-chip--active" : ""}`}
          onClick={() => onSelect(null)}
        >
          {allLabel}
        </button>
        {filtered.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`filter-chip${selectedId === o.id ? " filter-chip--active" : ""}`}
            onClick={() => onSelect(o.id)}
          >
            {o.name}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="px-1 py-2 text-xs text-[var(--text-silver)]">Ничего не найдено</p>
        )}
      </div>
    </div>
  );
}
