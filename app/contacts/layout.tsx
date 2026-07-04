import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Адрес в Шымкенте, график, телефон +7 701 352 22 25 и поддержка сайта +7 775 998 99 97. Подбор запчастей и доставка по Казахстану.",
  robots: { index: true, follow: true },
};

export default function ContactsLayout({ children }: { children: ReactNode }) {
  return children;
}
