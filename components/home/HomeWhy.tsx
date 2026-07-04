"use client";

import { Rocket, ShieldCheck, Handshake } from "lucide-react";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";

const items = [
  { key: "delivery" as const, Icon: Rocket, accent: "text-[color:var(--site-accent)]", bg: "bg-[color:var(--site-accent-soft)]" },
  { key: "quality" as const, Icon: ShieldCheck, accent: "text-[#00e676]", bg: "bg-[rgba(0,230,118,0.12)]" },
  { key: "match" as const, Icon: Handshake, accent: "text-[color:var(--text-charcoal)]", bg: "bg-black/[0.04]" },
];

export default function HomeWhy() {
  const lang = useLang();

  return (
    <section className="section-band section-band--white border-t border-black/[0.06]">
      <div className="site-container py-14 sm:py-16">
        <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-[color:var(--text-charcoal)] sm:text-[1.75rem]">
          {tr(t.homeWhy.title, lang)}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {items.map(({ key, Icon, accent, bg }) => {
            const block = t.homeWhy[key];
            return (
              <article
                key={key}
                className="flex flex-col items-center rounded-[var(--radius-widget)] border border-black/[0.06] bg-white px-5 py-8 text-center shadow-[0_2px_12px_rgba(29,29,31,0.05)]"
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${bg}`}>
                  <Icon size={28} className={accent} strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="text-[17px] font-semibold text-[color:var(--text-charcoal)]">{tr(block.title, lang)}</h3>
                <p className="mt-2 max-w-[16rem] text-[15px] leading-relaxed text-[color:var(--text-silver)]">
                  {tr(block.desc, lang)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
