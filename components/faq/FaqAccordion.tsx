"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type Item = { q: string; a: string };

type Props = { items: Item[] };

export default function FaqAccordion({ items }: Props) {
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div
            key={item.q}
            className="overflow-hidden rounded-[var(--radius-widget)] border border-black/[0.06] bg-white shadow-[0_2px_12px_rgba(10,10,12,0.04)]"
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-[15px] font-semibold leading-snug text-[color:var(--foreground)]">{item.q}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 28 }}>
                <ChevronDown size={20} className="shrink-0 text-[color:var(--text-tertiary)]" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  className="overflow-hidden"
                >
                  <p className="border-t border-black/[0.06] px-5 pb-5 pt-3 text-[15px] leading-relaxed text-[color:var(--text-secondary)]">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
