"use client";

import { MessageCircle } from "lucide-react";
import { siteWhatsAppHref } from "@/lib/siteContacts";

type Props = {
  /** На десктопе — подпись на кнопке; на телефоне — только для aria-label */
  label?: string;
  className?: string;
  floating?: boolean;
};

export default function FloatingWhatsapp({ label = "WhatsApp", className = "", floating = true }: Props) {
  return (
    <a
      href={siteWhatsAppHref()}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={[
        "btn-whatsapp btn-wa-pulse",
        "inline-flex items-center justify-center rounded-full shadow-lg",
        floating
          ? "fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-[55] lg:bottom-8 lg:right-8"
          : "",
        "h-12 w-12 gap-0 p-0",
        "lg:h-auto lg:w-auto lg:gap-2 lg:px-5 lg:py-2.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <MessageCircle className="size-[22px] shrink-0 lg:size-[18px]" strokeWidth={2.25} aria-hidden />
      <span className="hidden lg:inline">{label}</span>
    </a>
  );
}
