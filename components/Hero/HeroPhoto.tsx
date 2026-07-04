"use client";

import { useEffect, useState } from "react";
import { HERO_CAR_IMAGE } from "@/lib/heroPhotos";

/** Фото hero — AVIF + JPEG fallback, после первого кадра. */
export default function HeroPhoto() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      if (!cancelled) setReady(true);
    };
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(load, { timeout: 800 });
      return () => {
        cancelled = true;
        cancelIdleCallback(id);
      };
    }
    const t = window.setTimeout(load, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  if (!ready) return null;

  return (
    <div className="hero-v26-photos hero-v26-photos--loaded absolute inset-0" aria-hidden>
      <picture>
        <source srcSet={HERO_CAR_IMAGE.src} type="image/avif" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_CAR_IMAGE.fallbackSrc}
          alt=""
          decoding="async"
          fetchPriority="low"
          className="h-full w-full object-cover object-[center_42%] lg:object-[65%_center]"
        />
      </picture>
    </div>
  );
}
