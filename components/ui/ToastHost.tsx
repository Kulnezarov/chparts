"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { CheckCircle2, X } from "lucide-react";
import { useToastStore } from "@/store/toastStore";
import { useUiStore } from "@/store/uiStore";

export default function ToastHost() {
  const message = useToastStore((s) => s.message);
  const action = useToastStore((s) => s.action);
  const hide = useToastStore((s) => s.hide);
  const setCartOpen = useUiStore((s) => s.setCartOpen);

  if (!message || typeof document === "undefined") return null;

  const openCart = () => {
    hide();
    setCartOpen(true);
  };

  return createPortal(
    <div
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[110] w-[min(calc(100%-2rem),24rem)] -translate-x-1/2 lg:bottom-[max(1.25rem,env(safe-area-inset-bottom))]"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-black/[0.08] bg-[var(--text-charcoal)] px-4 py-3 text-white shadow-xl">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#34c759]" aria-hidden />
        <p className="min-w-0 flex-1 text-sm font-medium">{message}</p>
        {action &&
          (action.href === "/cart" ? (
            <button
              type="button"
              onClick={openCart}
              className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/25"
            >
              {action.label}
            </button>
          ) : (
            <Link
              href={action.href}
              onClick={hide}
              className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold hover:bg-white/25"
            >
              {action.label}
            </Link>
          ))}
        <button
          type="button"
          onClick={hide}
          className="shrink-0 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Закрыть"
        >
          <X size={16} />
        </button>
      </div>
    </div>,
    document.body,
  );
}
