"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Порог прокрутки (px) с верха, ниже которого панель всегда видна */
  threshold?: number;
  /** Минимальный шаг прокрутки для смены состояния */
  delta?: number;
};

/**
 * Скрывает панель при прокрутке вниз, показывает при прокрутке вверх или у верха страницы.
 */
export function useScrollHide({ threshold = 72, delta = 10 }: Options = {}) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      if (y <= threshold) {
        setHidden(false);
      } else if (y > lastY.current + delta) {
        setHidden(true);
      } else if (y < lastY.current - delta) {
        setHidden(false);
      }
      lastY.current = y;
      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, delta]);

  return hidden;
}
