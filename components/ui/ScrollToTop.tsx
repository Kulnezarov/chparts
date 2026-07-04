"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { useLang } from "@/lib/useLang";

export default function ScrollToTop() {
  const lang = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const aria =
    lang === "uz" ? "Yuqoriga" : lang === "kz" ? "Жоғарыға" : "Наверх страницы";

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={aria}
      className="fixed bottom-20 left-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-zinc-700 shadow-lg transition hover:border-[var(--site-accent)]/18 hover:bg-[var(--site-accent)]/6 hover:text-[var(--site-accent)] md:bottom-8"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ChevronUp className="h-5 w-5" aria-hidden />
    </button>
  );
}
