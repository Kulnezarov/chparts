import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Условия использования",
  description: "Правила использования сайта CHParts и оформления заказов на автозапчасти.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }: { children: ReactNode }) {
  return children;
}
