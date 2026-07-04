"use client";

import Link from "next/link";
import Nav from "./Nav";
import CartButton from "./CartButton";
import FavoritesButton from "./FavoritesButton";
import MobileMenu from "./MobileMenu";
import LangSwitcher from "./LangSwitcher";
import LogoMark from "@/components/layout/LogoMark";
import SiteWordmark from "@/components/layout/SiteWordmark";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { useScrollChrome } from "@/lib/ScrollChromeContext";

export default function Header() {
  const hidden = useScrollChrome();
  const lang = useLang();

  return (
    <header
      className={`site-header-bar transition-transform duration-300 ease-out will-change-transform ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="site-container header-inner">
        <div className="header-col-start">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 outline-offset-2 sm:gap-3"
          aria-label="CHparts"
        >
          <span className="header-logo-mark shrink-0 transition-transform duration-300 group-hover:scale-[1.03]">
            <LogoMark size="md" />
          </span>
          <span className="flex min-w-0 flex-col justify-center gap-0.5 leading-none">
            <SiteWordmark
              variant="full"
              className="block truncate text-[17px] font-bold tracking-[-0.03em] text-[color:var(--text-charcoal)] md:text-[18px]"
            />
            <span className="header-logo-tagline">{tr(t.site.tagline, lang)}</span>
          </span>
        </Link>
        </div>

        <Nav />

        <div className="header-col-end">
        <div className="header-actions-rail">
          <div className="hidden sm:block">
            <LangSwitcher />
          </div>
          <FavoritesButton />
          <CartButton />
          <MobileMenu />
        </div>
        </div>
      </div>
    </header>
  );
}
