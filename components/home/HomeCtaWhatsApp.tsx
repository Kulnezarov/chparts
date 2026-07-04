"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { siteWhatsAppHrefWithText } from "@/lib/siteContacts";

export default function HomeCtaWhatsApp() {
  const lang = useLang();
  const message =
    lang === "ru"
      ? "Здравствуйте! Не нашёл нужную запчасть на сайте. Артикул: "
      : lang === "kz"
        ? "Сәлеметсіз бе! Сайтта керек бөлшекті таппадым. Артикул: "
        : "Hello! I could not find the part on the site. Part number: ";

  return (
    <section className="section-band section-band--muted">
      <div className="site-container py-10 sm:py-12">
        <div className="flex flex-col items-center gap-5 rounded-[var(--radius-widget)] border border-black/[0.06] bg-white px-6 py-8 text-center shadow-[0_4px_24px_rgba(29,29,31,0.06)] sm:flex-row sm:justify-between sm:text-left">
          <div className="max-w-lg">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-accent)]">
              WhatsApp
            </p>
            <h2 className="text-xl font-bold tracking-tight text-[color:var(--text-charcoal)] sm:text-2xl">
              {tr(t.hero.notFoundCta, lang)}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-silver)]">
              {lang === "ru"
                ? "Менеджер проверит наличие на складе и предложит аналог."
                : lang === "kz"
                  ? "Менеджер қоймада бар-жоғын тексеріп, балама ұсынады."
                  : "Our manager will check stock and suggest an alternative."}
            </p>
          </div>
          <a
            href={siteWhatsAppHrefWithText(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
          >
            <MessageCircle size={18} />
            {tr(t.ui.whatsappPick, lang)}
          </a>
        </div>
        <p className="mt-4 text-center text-xs text-[color:var(--text-silver)]">
          {lang === "ru" ? "Или " : lang === "kz" ? "Немесе " : "Or "}
          <Link href="/catalog" className="font-semibold text-[color:var(--site-accent)] hover:underline">
            {tr(t.ui.toCatalog, lang)}
          </Link>
        </p>
      </div>
    </section>
  );
}
