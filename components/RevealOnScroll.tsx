"use client";

import { type ReactNode, useEffect, useRef } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Задержка старта анимации (мс) — каскад секций */
  delayMs?: number;
};

/**
 * Плавное появление при прокрутке (opacity + translateY), один раз.
 */
export default function RevealOnScroll({ children, className = "", delayMs = 0 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-item ${className}`.trim()}
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
