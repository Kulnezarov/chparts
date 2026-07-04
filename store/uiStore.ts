import { create } from "zustand";

interface UiStore {
  cartOpen: boolean;
  searchFocused: boolean;
  setCartOpen: (open: boolean) => void;
  setSearchFocused: (focused: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  cartOpen: false,
  searchFocused: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setSearchFocused: (searchFocused) => set({ searchFocused }),
}));
