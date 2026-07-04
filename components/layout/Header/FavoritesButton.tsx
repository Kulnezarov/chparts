"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useLang } from "@/lib/useLang";

export default function FavoritesButton() {
  const lang = useLang();
  const count = useFavoritesStore((s) => s.items.length);
  const label = lang === "kz" ? "Таңдаулылар" : lang === "uz" ? "Sevimlilar" : "Избранное";

  return (
    <Link href="/favorites" className="header-favorites-btn" aria-label={label}>
      <Heart size={16} strokeWidth={2} className={count > 0 ? "fill-current" : ""} />
      <span className="hidden lg:inline">{label}</span>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#ff3b30] px-1 text-[10px] font-bold leading-none text-white shadow-sm">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
