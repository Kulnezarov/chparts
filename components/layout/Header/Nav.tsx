"use client";

import { getNavLinks } from "@/lib/navLinks";
import { useLang } from "@/lib/useLang";
import NavLink from "./NavLink";

export default function Nav() {
  const lang = useLang();
  const links = getNavLinks(lang);

  return (
    <nav className="header-nav-rail justify-self-center" aria-label="Main">
      {links.map((item) => (
        <NavLink key={item.href} href={item.href} label={item.label} />
      ))}
    </nav>
  );
}
