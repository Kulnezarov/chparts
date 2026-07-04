"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { useLang } from "@/lib/useLang";
import { getRecentSearches, clearRecentSearches, addRecentSearch } from "@/lib/searchHistory";

type Props = {
  searchValue: string;
  placeholder: string;
  hint?: string;
  findLabel: string;
  loadingLabel: string;
  noSuggestionsLabel: string;
  suggestionsLabel: string;
  suggestions: string[];
  suggestionsOpen: boolean;
  suggestionsLoading: boolean;
  activeSuggestionIdx: number;
  onSearchValueChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  onSuggestionSelect: (value: string) => void;
  onSuggestionHover: (idx: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  highlightMatch: (text: string, needle: string) => ReactNode;
};

export default function CatalogDesktopSearch({
  searchValue,
  placeholder,
  hint,
  findLabel,
  loadingLabel,
  noSuggestionsLabel,
  suggestionsLabel,
  suggestions,
  suggestionsOpen,
  suggestionsLoading,
  activeSuggestionIdx,
  onSearchValueChange,
  onFocus,
  onBlur,
  onSubmit,
  onClear,
  onSuggestionSelect,
  onSuggestionHover,
  onKeyDown,
  highlightMatch,
}: Props) {
  const lang = useLang();
  const [recentOpen, setRecentOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  const showRecent = recentOpen && recent.length > 0 && searchValue.trim().length < 2 && !suggestionsOpen;

  return (
    <form onSubmit={onSubmit} className="catalog-search-desktop">
      <div className="catalog-search-desktop-capsule">
        <Search className="catalog-search-desktop-icon" size={18} strokeWidth={2} aria-hidden />
        <input
          type="search"
          value={searchValue}
          onFocus={() => {
            setRecent(getRecentSearches());
            setRecentOpen(true);
            onFocus();
          }}
          onBlur={() => {
            setTimeout(() => {
              setRecentOpen(false);
              onBlur();
            }, 120);
          }}
          onChange={(e) => onSearchValueChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="catalog-search-desktop-input"
          aria-label={placeholder}
        />
        {searchValue.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="catalog-search-desktop-clear"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
        <button type="submit" className="catalog-search-desktop-submit">
          {findLabel}
        </button>
      </div>

      {hint ? <p className="catalog-search-desktop-hint">{hint}</p> : null}

      {suggestionsOpen && searchValue.trim().length >= 2 && (
        <div className="catalog-search-desktop-dropdown">
          <div className="border-b border-black/[0.06] px-3 py-2 text-xs font-semibold text-[color:var(--text-silver)]">
            {suggestionsLabel}
          </div>
          <div className="max-h-64 overflow-auto">
            {suggestionsLoading ? (
              <div className="px-3 py-2 text-sm text-[color:var(--text-silver)]">{loadingLabel}</div>
            ) : suggestions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-[color:var(--text-silver)]">{noSuggestionsLabel}</div>
            ) : (
              suggestions.map((s, idx) => (
                <button
                  type="button"
                  key={s}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSuggestionSelect(s)}
                  onMouseEnter={() => onSuggestionHover(idx)}
                  className={`w-full px-3 py-2.5 text-left text-sm text-[color:var(--text-charcoal)] hover:bg-[color:var(--site-accent-soft)] ${
                    idx === activeSuggestionIdx ? "bg-[var(--site-accent)]/6" : ""
                  }`}
                >
                  {highlightMatch(s, searchValue)}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {showRecent && (
        <div className="catalog-search-desktop-dropdown">
          <div className="flex items-center justify-between border-b border-black/[0.06] px-3 py-2 text-xs font-semibold text-[color:var(--text-silver)]">
            <span>{lang === "uz" ? "Yaqinda" : lang === "kz" ? "Жақында" : "Недавние"}</span>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                clearRecentSearches();
                setRecent([]);
              }}
              className="font-semibold text-[color:var(--site-accent)] hover:underline"
            >
              {lang === "uz" ? "Tozalash" : lang === "kz" ? "Тазалау" : "Очистить"}
            </button>
          </div>
          <div className="max-h-48 overflow-auto py-1">
            {recent.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSearchValueChange(s);
                  addRecentSearch(s);
                  onSuggestionSelect(s);
                }}
                className="w-full px-3 py-2 text-left text-sm text-[color:var(--text-charcoal)] hover:bg-[color:var(--site-accent-soft)]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
