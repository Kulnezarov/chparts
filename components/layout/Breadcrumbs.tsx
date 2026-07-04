import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = {
  label: string;
  href?: string;
};

type Props = {
  items: Crumb[];
  className?: string;
};

export default function Breadcrumbs({ items, className = "" }: Props) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className={`mb-6 flex flex-wrap items-center gap-1.5 text-[13px] ${className}`}
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-[color:var(--text-silver)]/60" />}
          {item.href ? (
            <Link
              href={item.href}
              className="inline-flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-[color:var(--text-silver)] transition hover:bg-[color:var(--site-accent-soft)] hover:text-[color:var(--site-accent)]"
            >
              {index === 0 && <Home className="h-3.5 w-3.5" />}
              {item.label}
            </Link>
          ) : (
            <span className="rounded-lg px-1.5 py-0.5 font-medium text-[color:var(--text-charcoal)]">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
