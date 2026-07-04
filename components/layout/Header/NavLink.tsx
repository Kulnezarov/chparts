"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { href: string; label: string };

export default function NavLink({ href, label }: Props) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`header-nav-link ${active ? "header-nav-link--active" : ""}`}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
