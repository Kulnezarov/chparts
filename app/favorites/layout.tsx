import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NOINDEX_METADATA } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Избранное",
  description: "Сохранённые товары CHParts — список хранится в браузере на вашем устройстве.",
  ...NOINDEX_METADATA,
};

export default function FavoritesLayout({ children }: { children: ReactNode }) {
  return children;
}
