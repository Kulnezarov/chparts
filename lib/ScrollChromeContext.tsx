"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useScrollHide } from "@/lib/useScrollHide";

const ScrollChromeContext = createContext(false);

/** Один слушатель скролла для шапки и мобильного поиска каталога */
export function ScrollChromeProvider({ children }: { children: ReactNode }) {
  const hidden = useScrollHide({ threshold: 56 });
  return <ScrollChromeContext.Provider value={hidden}>{children}</ScrollChromeContext.Provider>;
}

export function useScrollChrome() {
  return useContext(ScrollChromeContext);
}
