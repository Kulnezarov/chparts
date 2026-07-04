"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { useLang } from "@/lib/useLang";
import { getRecentSearches, clearRecentSearches, addRecentSearch } from "@/lib/searchHistory";

type Props = {
  searchValue: string;
  placeholder: string;
  findLabel: string;
  loadingLabel: string;
  noSuggestionsLabel: string;
  suggestions: string[];
  suggestionsOpen: boolean;
  suggestionsLoading: boolean;
  activeSuggestionIdx: number;
  /** Узкая «пилюля» в липкой панели при прокрутке без фокуса */
  compactIdle?: boolean;
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

export default function CatalogMobileSearch({
  searchValue,
  placeholder,
  findLabel,
  loadingLabel,
  noSuggestionsLabel,
  suggestions,
  suggestionsOpen,
  suggestionsLoading,
  activeSuggestionIdx,
  compactIdle = false,
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
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const showCancel = focused || searchValue.length > 0;

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClear();
    // Blur any active input
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`catalog-search-morph ${compactIdle ? "catalog-search-morph--idle" : "catalog-search-morph--active"}`}
    >
      <div className="flex items-center gap-2.5 w-full">
        <div className="relative flex-1">
          <input
            type="search"
            enterKeyHint="search"
            value={searchValue}
            onFocus={() => {
              setRecent(getRecentSearches());
              setFocused(true);
              onFocus();
            }}
            onBlur={() => {
              setFocused(false);
              onBlur();
            }}
            onChange={(e) => onSearchValueChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className={`catalog-search-inline-input w-full rounded-full pl-4 ${
              searchValue.length > 0 ? "pr-9" : "pr-10"
            }`}
          />
          {searchValue.length > 0 ? (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 active:opacity-60 transition-opacity"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          ) : (
            <Search
              size={15}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              aria-hidden
            />
          )}

          {suggestionsOpen && searchValue.trim().length >= 2 && (
            <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-lg">
              <div className="max-h-44 overflow-auto">
                {suggestionsLoading ? (
                  <div className="px-2 py-1.5 text-xs text-slate-400">{loadingLabel}</div>
                ) : suggestions.length === 0 ? (
                  <div className="px-2 py-1.5 text-xs text-slate-400">{noSuggestionsLabel}</div>
                ) : (
                  suggestions.map((s, idx) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => onSuggestionSelect(s)}
                      onMouseEnter={() => onSuggestionHover(idx)}
                      className={`w-full px-2 py-1.5 text-left text-xs text-zinc-700 hover:bg-[var(--site-accent)]/6 ${
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

          {focused && recent.length > 0 && searchValue.trim().length < 2 && (
            <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-lg text-left">
              <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
                <span>{lang === "uz" ? "Yaqinda" : lang === "kz" ? "Жақында" : "Недавние"}</span>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    clearRecentSearches();
                    setRecent([]);
                  }}
                  className="text-[color:var(--site-accent)] active:opacity-60 font-bold"
                >
                  {lang === "uz" ? "Tozalash" : lang === "kz" ? "Тазалау" : "Очистить"}
                </button>
              </div>
              <div className="flex flex-col">
                {recent.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSearchValueChange(s);
                      setFocused(false);
                      addRecentSearch(s);
                      // Trigger search submission
                      const p = new URLSearchParams(window.location.search);
                      p.set("q", s);
                      window.location.href = `/catalog?${p.toString()}`;
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-zinc-700 hover:bg-[var(--site-accent)]/6"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {showCancel && (
          <button
            type="button"
            onMouseDown={handleCancelClick}
            className="text-sm font-semibold text-[color:var(--site-accent)] active:opacity-60 transition-all pr-1 shrink-0"
            aria-label={findLabel}
          >
            {lang === "uz" ? "Bekor qilish" : lang === "kz" ? "Бас тарту" : "Отмена"}
          </button>
        )}
      </div>
    </form>
  );
}
