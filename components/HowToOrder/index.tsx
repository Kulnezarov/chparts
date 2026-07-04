"use client";

import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";

export default function HowToOrder() {
  const lang = useLang();

  return (
    <section className="section-band section-band--muted">
      <div className="site-container py-14 sm:py-16">
        <div className="section-intro">
          <p className="section-eyebrow">{tr(t.howToOrder.eyebrow, lang)}</p>
          <h2 className="section-heading">{tr(t.howToOrder.title, lang)}</h2>
          <p className="section-lead">{tr(t.howToOrder.subtitle, lang)}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.howToOrder.steps.map((step, i) => (
            <div key={i} className="pro-card relative flex flex-col p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--site-accent)] text-lg font-bold text-white shadow-[0_4px_12px_rgba(0,102,204,0.3)]">
                {i + 1}
              </div>
              <h3 className="mb-2 text-[15px] font-semibold text-[color:var(--foreground)]">{tr(step.title, lang)}</h3>
              <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">{tr(step.desc, lang)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
