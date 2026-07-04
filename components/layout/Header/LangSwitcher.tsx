"use client";

import { motion } from "framer-motion";
import { useLangStore } from "@/store/langStore";
import { SITE_LANG_OPTIONS } from "@/lib/langOptions";

export default function LangSwitcher() {
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const idx = SITE_LANG_OPTIONS.findIndex((l) => l.id === lang);

  return (
    <div className="header-lang-switch" role="group" aria-label="Language">
      <motion.div
        className="absolute top-0.5 bottom-0.5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
        layout
        transition={{ type: "spring", stiffness: 480, damping: 32 }}
        style={{
          width: `calc(${100 / SITE_LANG_OPTIONS.length}% - 2px)`,
          left: `calc(${idx * (100 / SITE_LANG_OPTIONS.length)}% + 1px)`,
        }}
      />
      {SITE_LANG_OPTIONS.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => setLang(l.id)}
          className={`relative z-10 min-w-[2.35rem] px-2 py-1 text-[10px] font-bold tracking-wide transition-colors outline-none select-none ${
            lang === l.id
              ? "text-[color:var(--text-charcoal)]"
              : "text-[color:var(--text-silver)] hover:text-[color:var(--text-secondary)]"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
