import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Адрес в Шымкенте (Ибрагим Ата 260/1), график, телефоны +7 776 682 22 25 и +7 701 352 22 23, поддержка сайта +7 775 998 99 97.",
  robots: { index: true, follow: true },
};

export default function ContactsLayout({ children }: { children: ReactNode }) {
  return children;
}
