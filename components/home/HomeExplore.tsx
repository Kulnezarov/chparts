"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle, Phone, MapPin, ChevronRight } from "lucide-react";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { fetchPublicBrands } from "@/lib/publicApi";
import { matchBrandId } from "@/lib/brandResolve";
import { brands as staticBrands } from "@/lib/data";
import { siteAddress, siteWhatsAppHref, SITE_PHONE_DISPLAY, SITE_PHONE_TEL } from "@/lib/siteContacts";
import SiteWordmark from "@/components/layout/SiteWordmark";
import LogoMark from "@/components/layout/LogoMark";

const BRAND_LABELS = ["Changan", "Wuling", "Dongfeng", "FAW"] as const;

export default function HomeExplore() {
  const lang = useLang();
  const [brandHrefs, setBrandHrefs] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    fetchPublicBrands()
      .then((list) => {
        if (cancelled) return;
        const next: Record<string, string> = {};
        for (const label of BRAND_LABELS) {
          const id = matchBrandId(list, label);
          next[label] = id != null ? `/catalog?brand=${id}` : "/catalog";
        }
        setBrandHrefs(next);
      })
      .catch(() => {
        if (!cancelled) {
          setBrandHrefs(Object.fromEntries(BRAND_LABELS.map((l) => [l, "/catalog"])));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const navLinks = [
    { href: "/catalog", label: tr(t.footer.catalog, lang) },
    { href: "/cart", label: tr(t.nav.cart, lang) },
    { href: "/about", label: tr(t.footer.about, lang) },
    { href: "/faq", label: tr(t.footer.faqLink, lang) },
    { href: "/contacts", label: tr(t.footer.contacts, lang) },
    { href: "/orders", label: tr(t.nav.orders, lang) },
  ];

  return (
    <section className="border-t border-[color:var(--border)] bg-white" aria-labelledby="home-explore-title">
      <div className="site-container py-10 sm:py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--site-accent)]">
            <LogoMark size="sm" className="text-white" />
          </div>
          <div>
            <SiteWordmark className="text-lg font-semibold text-[var(--text-charcoal)]" />
            <p id="home-explore-title" className="text-sm text-[var(--text-silver)]">
              {tr(t.footer.desc, lang)}
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          <div>
            <h3 className="home-explore-label">{tr(t.footer.catalog, lang)}</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
              {staticBrands.map((b) => (
                <Link
                  key={b.slug}
                  href={brandHrefs[b.name] ?? "/catalog"}
                  className="home-explore-chip"
                >
                  {b.name}
                  <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
                </Link>
              ))}
            </div>
            <Link href="/catalog" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--site-accent)] hover:underline">
              {lang === "ru" ? "Весь каталог" : lang === "kz" ? "Барлық каталог" : "Full catalog"}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <h3 className="home-explore-label">{tr(t.ui.company, lang)}</h3>
            <div className="flex flex-wrap gap-2">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} className="home-explore-pill">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="home-explore-label">{tr(t.footer.contacts, lang)}</h3>
            <div className="space-y-3 rounded-2xl border border-black/[0.08] bg-[#f5f5f7] p-4">
              <a href={SITE_PHONE_TEL} className="flex items-center gap-3 text-[var(--text-charcoal)] hover:text-[var(--site-accent)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
                  <Phone size={16} className="text-[var(--site-accent)]" />
                </span>
                <span className="font-semibold">{SITE_PHONE_DISPLAY}</span>
              </a>
              <p className="flex items-start gap-3 text-sm text-[#6e6e73]">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--site-accent)]" />
                {siteAddress(lang)}
              </p>
              <a
                href={siteWhatsAppHref()}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp flex w-full justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"
              >
                <MessageCircle size={16} />
                {tr(t.ui.whatsapp, lang)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
