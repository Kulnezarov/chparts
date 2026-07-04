import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  available: number;
  quantity: number;
  barcode?: string | null;
  sku?: string | null;
  brandName?: string | null;
  categoryName?: string | null;
}

interface CartStore {
  items: CartItem[];
  count: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
}

function getCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      count: 0,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((x) => x.id === item.id);
          let nextItems: CartItem[];
          if (existing) {
            nextItems = state.items.map((x) =>
              x.id === item.id ? { ...x, quantity: Math.min(x.quantity + 1, Math.max(1, item.available)) } : x,
            );
          } else {
            nextItems = [...state.items, { ...item, quantity: Math.min(1, Math.max(1, item.available)) }];
          }
          return { items: nextItems, count: getCount(nextItems) };
        }),
      increase: (id) =>
        set((state) => {
          const nextItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(item.quantity + 1, Math.max(1, item.available)) } : item,
          );
          return { items: nextItems, count: getCount(nextItems) };
        }),
      decrease: (id) =>
        set((state) => {
          const nextItems = state.items
            .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
            .filter((item) => item.quantity > 0);
          return { items: nextItems, count: getCount(nextItems) };
        }),
      remove: (id) =>
        set((state) => {
          const nextItems = state.items.filter((item) => item.id !== id);
          return { items: nextItems, count: getCount(nextItems) };
        }),
      clear: () => set({ items: [], count: 0 }),
    }),
    { name: "cnparts-cart" },
  ),
);
