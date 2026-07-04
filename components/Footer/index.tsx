"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { Clock3, MapPin, MessageCircle } from "lucide-react";
import SiteWordmark from "@/components/layout/SiteWordmark";
import {
  SITE_PHONE_ALT_DISPLAY,
  SITE_PHONE_ALT_TEL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  siteAddress,
  siteWhatsAppHref,
} from "@/lib/siteContacts";

const footerNavLinkClass =
  "text-[15px] leading-snug text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-charcoal)]";

export default function Footer() {
  const lang = useLang();
  const pathname = usePathname();
  const isProductDetail =
    pathname.startsWith("/catalog/") && pathname !== "/catalog";

  if (isProductDetail) return null;

  const year = new Date().getFullYear();

  const navLinks = [
    { href: "/", label: tr(t.nav.home, lang) },
    { href: "/catalog", label: tr(t.catalog.title, lang) },
    { href: "/contacts", label: tr(t.nav.contacts, lang) },
    { href: "/about", label: tr(t.nav.about, lang) },
    { href: "/faq", label: tr(t.footer.helpFaq, lang) },
  ] as const;

  return (
    <footer className="mt-auto border-t border-black/[0.06] bg-white">
      <div className="site-container py-12 md:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* Бренд */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="group inline-block">
              <SiteWordmark className="text-3xl font-extrabold tracking-tight text-[color:var(--site-accent)] sm:text-[2rem]" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[color:var(--text-secondary)]">
              {tr(t.footer.slogan, lang)}
            </p>
          </div>

          {/* Навигация */}
          <nav aria-label={tr(t.footer.navAria, lang)} className="lg:justify-self-center">
            <ul className="flex flex-col gap-2.5">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={footerNavLinkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Контакты */}
          <address className="flex flex-col gap-3 not-italic sm:col-span-2 lg:col-span-1 lg:justify-self-end lg:text-right">
            <p className="inline-flex gap-2 text-sm leading-relaxed text-[color:var(--text-charcoal)] lg:justify-end">
              <MapPin
                size={16}
                className="mt-0.5 shrink-0 text-[color:var(--site-accent)]"
                aria-hidden
              />
              <span>{siteAddress(lang)}</span>
            </p>
            <p>
              <a
                href={SITE_PHONE_TEL}
                className="text-[15px] font-semibold text-[color:var(--text-charcoal)] underline-offset-2 transition-colors hover:text-[color:var(--site-accent)] hover:underline"
              >
                {SITE_PHONE_DISPLAY}
              </a>
            </p>
            <p>
              <a
                href={SITE_PHONE_ALT_TEL}
                className="text-[15px] font-semibold text-[color:var(--text-charcoal)] underline-offset-2 transition-colors hover:text-[color:var(--site-accent)] hover:underline"
              >
                {SITE_PHONE_ALT_DISPLAY}
              </a>
            </p>
            <p className="inline-flex lg:justify-end">
              <a
                href={siteWhatsAppHref()}
                target="_blank"
                rel="noreferrer"
                className="footer-wa-btn"
              >
                <MessageCircle size={16} aria-hidden />
                {tr(t.ui.whatsapp, lang)}
              </a>
            </p>
            <p className="inline-flex gap-2 text-sm text-[color:var(--text-secondary)] lg:justify-end">
              <Clock3
                size={16}
                className="mt-0.5 shrink-0 text-[color:var(--site-accent)]"
                aria-hidden
              />
              <span>{tr(t.footer.schedule, lang)}</span>
            </p>
          </address>
        </div>
      </div>

      <div className="site-container border-t border-black/[0.06] py-4 text-center text-xs text-[color:var(--text-tertiary)]">
        © {year} CHParts ·{" "}
        <Link href="/privacy" className="link-accent">
          {tr(t.footer.privacy, lang)}
        </Link>
        {" · "}
        <Link href="/terms" className="link-accent">
          {tr(t.footer.terms, lang)}
        </Link>
      </div>
    </footer>
  );
}
