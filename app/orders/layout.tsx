import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NOINDEX_METADATA } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Мои заказы",
  description:
    "Список резервов в браузере и просмотр по ссылке /orders?reserve=НОМЕР с любого устройства. Статусы с сервера, WhatsApp +7 776 682 22 25.",
  ...NOINDEX_METADATA,
};

export default function OrdersLayout({ children }: { children: ReactNode }) {
  return children;
}
