"use client";

import { useLangStore, type Lang } from "@/store/langStore";

export function useLang(): Lang {
  const lang = useLangStore((s) => s.lang);
  const hasHydrated = useLangStore((s) => s._hasHydrated);
  return hasHydrated ? lang : "ru";
}
