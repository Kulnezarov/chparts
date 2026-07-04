import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "ru" | "kz" | "uz";

interface LangStore {
  lang: Lang;
  _hasHydrated: boolean;
  setLang: (lang: Lang) => void;
  setHasHydrated: (v: boolean) => void;
}

export const useLangStore = create<LangStore>()(
  persist(
    (set) => ({
      lang: "ru",
      _hasHydrated: false,
      setLang: (lang) => set({ lang }),
      setHasHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: "cnparts-lang",
      version: 2,
      migrate: (persisted) => {
        const state = persisted as { lang?: string };
        if (state.lang === "en") state.lang = "ru";
        return persisted as LangStore;
      },
      onRehydrateStorage: () => (state) => {
        if (state?.lang === ("en" as Lang)) state.setLang("ru");
        state?.setHasHydrated(true);
      },
    }
  )
);
