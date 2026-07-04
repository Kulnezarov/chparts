"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useUiStore } from "@/store/uiStore";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";

export default function CartPage() {
  const lang = useLang();
  const setCartOpen = useUiStore((s) => s.setCartOpen);

  useEffect(() => {
    setCartOpen(true);
  }, [setCartOpen]);

  return (
    <div className="site-container flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-[color:var(--text-secondary)]">{tr(t.nav.cart, lang)}</p>
      <Link href="/catalog" className="btn-primary mt-6">
        {tr(t.ui.toCatalog, lang)}
      </Link>
    </div>
  );
}
