"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";

export default function CartButton() {
  const lang = useLang();
  const count = useCartStore((s) => s.count);
  const cartOpen = useUiStore((s) => s.cartOpen);
  const setCartOpen = useUiStore((s) => s.setCartOpen);

  return (
    <button
      type="button"
      onClick={() => setCartOpen(!cartOpen)}
      className="header-cart-btn"
      aria-label={tr(t.nav.cart, lang)}
      aria-expanded={cartOpen}
    >
      <ShoppingBag size={16} strokeWidth={2} />
      <span className="hidden sm:inline">{tr(t.nav.cart, lang)}</span>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#ff3b30] px-1 text-[10px] font-bold leading-none text-white shadow-sm">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
