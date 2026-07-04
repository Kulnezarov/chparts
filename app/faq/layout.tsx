import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Вопросы и ответы",
  description:
    "Доставка, гарантия, оплата, заказ запчастей. Краткие ответы до звонка менеджеру.",
  robots: { index: true, follow: true },
};

export default function FaqLayout({ children }: { children: ReactNode }) {
  return children;
}
