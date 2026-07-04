"use client";

import { usePathname } from "next/navigation";
import FloatingWhatsapp from "@/components/ui/FloatingWhatsapp";
import FavoritesFab from "@/components/ui/FavoritesFab";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";

/** Плавающий WhatsApp на страницах, где полезен быстрый контакт (не дублируем главную — там свои CTA). */
export default function FloatingWhatsappGate() {
  const lang = useLang();
  const pathname = usePathname();

  /** На карточке товара уже есть своя кнопка WhatsApp */
  const isProductDetail =
    pathname.startsWith("/catalog/") && pathname !== "/catalog";

  if (isProductDetail) return null;
  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-[55] flex flex-col items-end gap-3 lg:bottom-8 lg:right-8">
      <FavoritesFab />
      <FloatingWhatsapp label={tr(t.ui.whatsapp, lang)} floating={false} />
    </div>
  );
}
