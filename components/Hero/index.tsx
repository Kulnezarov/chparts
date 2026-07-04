import Link from "next/link";
import { Handshake, ShieldCheck, Truck } from "lucide-react";
import { t, tr } from "@/lib/i18n";
import { siteWhatsAppHref } from "@/lib/siteContacts";
import HeroPhoto from "@/components/Hero/HeroPhoto";
import HeroSearchEnhance from "@/components/Hero/HeroSearchEnhance";
import HeroLangSync from "@/components/Hero/HeroLangSync";
import LogoMark from "@/components/layout/LogoMark";
import SiteWordmark from "@/components/layout/SiteWordmark";
import { IconClock, IconMapPin, IconMessageCircle, IconSearch } from "@/components/Hero/HeroIcons";

const QUICK_CHIPS = [
  { q: "фильтр", label: { ru: "Фильтры", kz: "Сүзгілер", uz: "Filtrlar" } },
  { q: "масло", label: { ru: "Масло", kz: "Май", uz: "Moy" } },
  { q: "тормоз", label: { ru: "Тормоза", kz: "Тормоз", uz: "Tormoz" } },
  { q: "генератор", label: { ru: "Генератор", kz: "Генератор", uz: "Generator" } },
] as const;

const HERO_BRANDS = ["FAW", "Changan", "Dongfeng", "Wuling"] as const;

const TRUST_ROWS = [
  { key: "hero.trust.delivery", Icon: Truck },
  { key: "hero.trust.quality", Icon: ShieldCheck },
  { key: "hero.trust.match", Icon: Handshake },
] as const;

function trustTitle(key: string, lang: "ru") {
  if (key === "hero.trust.delivery") return tr(t.homeWhy.delivery.title, lang);
  if (key === "hero.trust.quality") return tr(t.homeWhy.quality.title, lang);
  return tr(t.homeWhy.match.title, lang);
}

function trustDesc(key: string, lang: "ru") {
  if (key === "hero.trust.delivery") return tr(t.homeWhy.delivery.desc, lang);
  if (key === "hero.trust.quality") return tr(t.homeWhy.quality.desc, lang);
  return tr(t.homeWhy.match.desc, lang);
}

/** Серверный Hero — h1, поиск и кнопки в HTML сразу (быстрый LCP на 4G). */
export default function Hero() {
  const lang = "ru" as const;

  return (
    <section className="hero-v26 relative flex min-h-0 flex-col items-center overflow-hidden px-4 py-10 pb-12 text-center sm:px-6 sm:py-12 sm:pb-14 lg:min-h-[min(88vh,720px)] lg:justify-center lg:py-14">
      <div className="hero-v26-bg-fallback absolute inset-0" aria-hidden />
      <HeroPhoto />
      <HeroLangSync />

      <div className="hero-v26-scrim absolute inset-0 z-[1]" aria-hidden />
      <div className="hero-v26-content-veil" aria-hidden />
      <div className="hero-v26-glow" aria-hidden />

      <div className="relative z-20 mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.88fr)] lg:items-center lg:gap-12">
        <div className="flex max-w-lg flex-col items-center lg:items-start">
          <h1
            className="hero-v26-copy text-balance text-[clamp(1.75rem,5vw,3rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-[color:var(--text-on-dark)] lg:text-left"
            data-hero-i18n="hero.title"
          >
            {tr(t.hero.title, lang)}
          </h1>

          <p
            className="hero-v26-copy mt-2 max-w-xl text-balance text-sm font-medium leading-relaxed text-white/82 sm:text-[15px] lg:text-left"
            data-hero-i18n="hero.subtitle"
          >
            {tr(t.hero.subtitle, lang)}
          </p>

          <div className="hero-v26-copy mt-4 flex w-full max-w-xl flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
            <span className="hero-badge justify-center sm:justify-start">
              <IconClock className="shrink-0 text-white/90" />
              <span data-hero-i18n="hero.badgeWhatsapp">{tr(t.hero.badgeWhatsapp, lang)}</span>
            </span>
            <span className="hero-badge justify-center sm:justify-start">
              <IconMapPin className="shrink-0 text-white/90" />
              <span data-hero-i18n="hero.badgePickup">{tr(t.hero.badgePickup, lang)}</span>
            </span>
          </div>

          <div className="hero-v26-search-wrap relative z-30 mt-5 w-full max-w-xl">
            <form id="hero-search-form" action="/catalog" method="get" className="w-full">
              <label className="hero-search-capsule mx-auto flex cursor-text shadow-[0_8px_32px_rgba(0,0,0,0.22)] lg:mx-0">
                <input
                  type="search"
                  name="q"
                  autoComplete="off"
                  placeholder={tr(t.ui.searchPlaceholder, lang)}
                  className="min-w-0 flex-1 bg-transparent pl-1 text-[15px] text-white outline-none placeholder:text-white/62"
                />
                <IconSearch className="shrink-0 text-white/72" />
              </label>
            </form>
            <HeroSearchEnhance />
          </div>

          <div className="hero-v26-chips relative z-10 mt-3 w-full max-w-xl">
            <div className="hero-chips-scroll justify-center lg:justify-start">
              {QUICK_CHIPS.map((chip) => (
                <Link
                  key={chip.q}
                  href={`/catalog?q=${encodeURIComponent(chip.q)}`}
                  className="hero-chip"
                  data-hero-i18n={`chip.${chip.q}`}
                >
                  {chip.label[lang]}
                </Link>
              ))}
            </div>
          </div>

          <div className="hero-v26-actions relative z-10 mt-5 flex w-full max-w-xl flex-col gap-2.5 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/catalog" className="hero-btn-catalog" data-hero-i18n="ui.toCatalog">
              {tr(t.ui.toCatalog, lang)}
            </Link>
            <a
              href={siteWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn-wa"
            >
              <IconMessageCircle className="text-white" />
              <span data-hero-i18n="ui.whatsappPick">{tr(t.ui.whatsappPick, lang)}</span>
            </a>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="hero-trust-card">
            <div className="flex items-center gap-2.5">
              <span className="header-logo-mark flex h-9 w-9 shrink-0 items-center justify-center">
                <LogoMark size="sm" />
              </span>
              <SiteWordmark
                variant="full"
                className="text-[15px] font-bold tracking-[-0.03em] text-white"
              />
            </div>

            <div className="mt-5 space-y-1 divide-y divide-white/10">
              {TRUST_ROWS.map(({ key, Icon }) => (
                <div key={key} className="hero-trust-row">
                  <div className="hero-trust-icon">
                    <Icon size={18} strokeWidth={2} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight text-white" data-hero-i18n={`${key}.title`}>
                      {trustTitle(key, lang)}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-white/72" data-hero-i18n={`${key}.desc`}>
                      {trustDesc(key, lang)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55" data-hero-i18n="hero.brandsEyebrow">
                {tr(t.hero.brandsEyebrow, lang)}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {HERO_BRANDS.map((brand) => (
                  <span key={brand} className="hero-brand-chip">
                    {brand}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/78" data-hero-i18n="hero.brandsNote">
                {tr(t.hero.brandsNote, lang)}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
