"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/favoritesStore";

export default function FavoritesFab() {
  const count = useFavoritesStore((s) => s.items.length);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:hidden"
    >
      <Link
        href="/favorites"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--site-accent)] text-white shadow-lg shadow-[color:var(--site-accent)]/30 transition hover:bg-[color:var(--site-accent-hover)] active:scale-[0.98]"
        aria-label="Севимлилар"
      >
        <Heart className="h-5 w-5" />
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff3b30] px-1 text-xs font-semibold text-white ring-2 ring-white"
          >
            {count}
          </motion.span>
        )}
      </Link>
    </motion.div>
  );
}
