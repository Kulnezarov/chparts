import type { Lang } from "@/store/langStore";
import { t } from "@/lib/i18n";

export const getNavLinks = (lang: Lang) => [
  { key: "home",      href: "/" },
  { key: "catalog",   href: "/catalog" },
  { key: "contacts",  href: "/contacts" },
  { key: "orders",    href: "/orders" },
  { key: "about",     href: "/about" },
].map((item) => ({
  ...item,
  label: t.nav[item.key as keyof typeof t.nav][lang],
}));
