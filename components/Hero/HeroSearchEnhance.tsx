"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/useLang";
import { useUiStore } from "@/store/uiStore";
import { addRecentSearch, clearRecentSearches, getRecentSearches } from "@/lib/searchHistory";

/** Поиск: недавние запросы и подсветка фокуса (HTML формы уже на сервере). */
export default function HeroSearchEnhance() {
  const lang = useLang();
  const router = useRouter();
  const setSearchFocused = useUiStore((s) => s.setSearchFocused);
  const [recent, setRecent] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const form = document.getElementById("hero-search-form");
    const section = document.querySelector(".hero-v26");
    const input = form?.querySelector<HTMLInputElement>('input[name="q"]');
    if (!form || !input || !section) return;

    const onFocus = () => {
      setRecent(getRecentSearches());
      setOpen(true);
      setSearchFocused(true);
      section.classList.add("hero-v26--search-focused");
    };

    const onBlur = () => {
      window.setTimeout(() => {
        setOpen(false);
        setSearchFocused(false);
        section.classList.remove("hero-v26--search-focused");
      }, 150);
    };

    const onSubmit = (e: Event) => {
      e.preventDefault();
      const q = input.value.trim();
      if (q) addRecentSearch(q);
      router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
      setOpen(false);
      setSearchFocused(false);
      section.classList.remove("hero-v26--search-focused");
      input.blur();
    };

    input.addEventListener("focus", onFocus);
    input.addEventListener("blur", onBlur);
    form.addEventListener("submit", onSubmit);

    return () => {
      input.removeEventListener("focus", onFocus);
      input.removeEventListener("blur", onBlur);
      form.removeEventListener("submit", onSubmit);
    };
  }, [router, setSearchFocused]);

  const goSearch = (q: string) => {
    addRecentSearch(q);
    router.push(`/catalog?q=${encodeURIComponent(q)}`);
    setOpen(false);
    setSearchFocused(false);
    document.querySelector(".hero-v26")?.classList.remove("hero-v26--search-focused");
  };

  const recentLabel =
    lang === "uz" ? "Яқinda изланганлар" : lang === "kz" ? "Жақында ізделгендер" : "Недавние запросы";
  const clearLabel = lang === "uz" ? "Тозалash" : lang === "kz" ? "Тазалау" : "Очистить";

  if (!open || recent.length === 0) return null;

  return (
    <div className="hero-recent-panel absolute left-0 right-0 z-[35] mt-2 overflow-hidden rounded-[22px] border border-white/70 bg-white/[0.92] text-left text-[color:var(--text-charcoal)] shadow-[0_18px_52px_rgba(10,10,12,0.22)] backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-2.5 text-xs font-semibold text-[color:var(--text-silver)]">
        <span>{recentLabel}</span>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            clearRecentSearches();
            setRecent([]);
          }}
          className="font-bold text-[color:var(--site-accent)] active:opacity-60"
        >
          {clearLabel}
        </button>
      </div>
      <div className="flex flex-col">
        {recent.map((s) => (
          <button
            key={s}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              goSearch(s);
            }}
            className="flex w-full items-center px-4 py-3 text-left text-sm font-medium text-[color:var(--text-charcoal)] transition-colors hover:bg-black/[0.04]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
