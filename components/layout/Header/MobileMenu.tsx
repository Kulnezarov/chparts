"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getNavLinks } from "@/lib/navLinks";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import LangSwitcher from "./LangSwitcher";
import { useLangStore, type Lang } from "@/store/langStore";

const langs: { id: Lang; label: string }[] = [
  { id: "ru", label: "РУС" },
  { id: "kz", label: "ҚАЗ" },
  { id: "uz", label: "UZB" },
];

export default function MobileMenu() {
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const setLang = useLangStore((s) => s.setLang);
  const currentLang = useLangStore((s) => s.lang);
  const links = getNavLinks(lang);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const panel = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[120] bg-black/22 backdrop-blur-md lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[130] flex w-[min(88vw,360px)] flex-col border-l border-white/70 bg-white/[0.92] p-5 shadow-2xl backdrop-blur-2xl lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="mb-6 flex items-center justify-between border-b border-black/[0.06] pb-4">
              <span className="text-xl font-bold tracking-tight text-[color:var(--text-charcoal)]">{tr(t.ui.menuTitle, lang)}</span>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.06] text-[color:var(--text-charcoal)] active:scale-95"
                onClick={() => setOpen(false)}
                aria-label={tr(t.ui.menuClose, lang)}
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3.5 text-[17px] font-semibold text-[color:var(--text-charcoal)] transition-colors hover:bg-black/[0.04] active:bg-black/[0.06]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex gap-1 rounded-full border border-black/[0.08] bg-black/[0.04] p-1 sm:hidden">
              {langs.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLang(l.id)}
                  className={`flex-1 rounded-full py-2 text-[11px] font-bold ${
                    currentLang === l.id ? "bg-white shadow-sm" : "text-[color:var(--text-tertiary)]"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div className="mt-4 hidden sm:block">
              <LangSwitcher />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        className="header-mobile-menu-btn"
        onClick={() => setOpen(true)}
        aria-label={tr(t.ui.menuOpen, lang)}
        aria-expanded={open}
      >
        <Menu size={18} strokeWidth={1.75} />
      </button>
      {typeof document !== "undefined" ? createPortal(panel, document.body) : null}
    </>
  );
}
