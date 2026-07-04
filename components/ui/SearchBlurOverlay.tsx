"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUiStore } from "@/store/uiStore";

export default function SearchBlurOverlay() {
  const focused = useUiStore((s) => s.searchFocused);
  const setSearchFocused = useUiStore((s) => s.setSearchFocused);

  return (
    <AnimatePresence>
      {focused && (
        <motion.button
          type="button"
          aria-label="Close search"
          className="fixed inset-0 z-[35] bg-black/25 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={() => setSearchFocused(false)}
        />
      )}
    </AnimatePresence>
  );
}
