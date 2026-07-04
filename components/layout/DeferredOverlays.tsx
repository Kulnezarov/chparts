"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"), {
  ssr: false,
});

const ToastHost = dynamic(() => import("@/components/ui/ToastHost"), {
  ssr: false,
});

/** Корзина и тосты — после первого кадра, не блокируют главную. */
export default function DeferredOverlays() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const go = () => {
      if (!cancelled) setReady(true);
    };
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(go, { timeout: 1200 });
      return () => {
        cancelled = true;
        cancelIdleCallback(id);
      };
    }
    const t = window.setTimeout(go, 150);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <CartDrawer />
      <ToastHost />
    </>
  );
}
