"use client";

import { useLang } from "@/lib/useLang";

export default function SkipToMain() {
  const lang = useLang();
  const label =
    lang === "uz" ? "Асosiy mazmunga oʻtish" : lang === "kz" ? "Негізгі мазмұнға өту" : "К основному содержимому";

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--site-accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
    >
      {label}
    </a>
  );
}
