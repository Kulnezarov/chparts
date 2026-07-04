import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Как CHParts обрабатывает персональные данные при оформлении заказа и хранении истории.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return children;
}
