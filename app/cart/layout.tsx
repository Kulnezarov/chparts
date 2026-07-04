import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NOINDEX_METADATA } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Корзина",
  description:
    "Оформление заказа, выбор доставки по Шымкенту и по Казахстану. Корзина хранится в браузере на устройстве.",
  ...NOINDEX_METADATA,
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return children;
}
