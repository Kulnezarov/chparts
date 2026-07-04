import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "Шымкент: запчасти для китайских авто с 2020 года, доставка по РК, прямые поставки, более 100 000 позиций в ассортименте.",
  robots: { index: true, follow: true },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
