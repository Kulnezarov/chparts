/** Фон hero — Changan CS55 (AVIF + JPEG fallback). */
export const HERO_CAR_IMAGE = {
  src: "/hero/changan-cs55-hero.avif",
  fallbackSrc: "/hero/changan-cs55-hero.jpg",
  alt: "Changan — автозапчасти CHParts",
} as const;

/** @deprecated используйте HERO_CAR_IMAGE */
export const HERO_BG_DESKTOP = HERO_CAR_IMAGE;
