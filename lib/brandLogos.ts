import type { Brand } from "./data";

/**
 * Официальные / распространённые логотипы (Wikimedia / Wikipedia) + локальный Dongfeng.
 */
const BRAND_LOGO_SRC: Record<Brand, string> = {
  changan: "https://upload.wikimedia.org/wikipedia/commons/0/00/Changan_icon.svg",
  faw: "https://upload.wikimedia.org/wikipedia/en/1/18/FAW_Group_logo_%282022%29.png",
  /** SAIC-GM-Wuling — в составе бренда Wuling */
  wuling: "https://upload.wikimedia.org/wikipedia/en/4/4b/SGMW_2025_logo.png",
  dongfeng: "/brands/dongfeng.svg",
};

export function getBrandLogoSrc(slug: Brand): string {
  return BRAND_LOGO_SRC[slug];
}
