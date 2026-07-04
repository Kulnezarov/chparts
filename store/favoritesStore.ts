import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PublicProduct } from "@/lib/publicApi";

interface FavoritesStore {
  items: PublicProduct[];
  toggleFavorite: (product: PublicProduct) => void;
  isFavorite: (id: number) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleFavorite: (product) => {
        const items = get().items;
        const exists = items.some((item) => item.id === product.id);
        if (exists) {
          set({ items: items.filter((item) => item.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },
      isFavorite: (id) => {
        return get().items.some((item) => item.id === id);
      },
    }),
    {
      name: "chparts-favorites",
    },
  ),
);
