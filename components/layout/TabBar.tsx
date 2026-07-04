"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, ShoppingBag, Package } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { useLang } from "@/lib/useLang";
import { t } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

export default function TabBar() {
  const pathname = usePathname();
  const lang = useLang();
  const cartCount = useCartStore((s) => s.count);
  const setCartOpen = useUiStore((s) => s.setCartOpen);

  const tabs = [
    {
      key: "home",
      href: "/",
      icon: Home,
      label: t.nav.home[lang],
    },
    {
      key: "catalog",
      href: "/catalog",
      icon: Search,
      label: t.nav.catalog[lang],
    },
    {
      key: "favorites",
      href: "/favorites",
      icon: Heart,
      label: t.nav.favorites[lang],
    },
    {
      key: "cart",
      href: "/cart",
      icon: ShoppingBag,
      label: t.nav.cart[lang],
      isCart: true,
    },
    {
      key: "orders",
      href: "/orders",
      icon: Package,
      label: t.nav.orders[lang],
    },
  ];

  return (
    <nav className="ios-tab-bar lg:hidden" aria-label="Mobile Navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.isCart
          ? pathname === "/cart" || useUiStore.getState().cartOpen
          : pathname === tab.href;

        const handleClick = (e: React.MouseEvent) => {
          if (tab.isCart) {
            e.preventDefault();
            setCartOpen(true);
          }
        };

        return (
          <Link
            key={tab.key}
            href={tab.href}
            onClick={handleClick}
            className="ios-tab-item"
          >
            <div className="ios-tab-icon-wrap">
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? "text-[color:var(--site-accent)]" : "text-zinc-400"}
              />
              {tab.isCart && cartCount > 0 && (
                <AnimatePresence mode="popLayout">
                  <motion.span
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute -right-2 -top-1.5 flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full bg-[#ff3b30] px-1 text-[9px] font-bold text-white shadow-sm"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </motion.span>
                </AnimatePresence>
              )}
            </div>
            <span
              className={`ios-tab-label ${
                isActive ? "text-[color:var(--site-accent)] font-semibold" : "text-zinc-400"
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
