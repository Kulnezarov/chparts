"use client";

import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";

type Props = {
  className?: string;
  /** `full` — CH + Parts; `compact` — только Parts (когда CH уже в иконке) */
  variant?: "full" | "compact";
};

export default function SiteWordmark({
  className = "font-extrabold text-xl tracking-tight text-white",
  variant = "full",
}: Props) {
  const lang = useLang();
  const rest = tr(t.site.wordmarkRest, lang);

  return (
    <span
      className={`${className} inline-block origin-left transition-[transform,letter-spacing] duration-200 ease-out group-hover:scale-[1.02] group-hover:tracking-wide`.trim()}
    >
      {variant === "full" ? (
        <>
          <span className="text-[var(--site-accent)] transition-colors duration-200 group-hover:text-[var(--site-accent-hover)]">
            {tr(t.site.wordmarkAccent, lang)}
          </span>
          {rest}
        </>
      ) : (
        rest
      )}
    </span>
  );
}
