"use client";

import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { ShieldCheck, Truck, Star, Headphones, Package, Tag } from "lucide-react";

const icons = [ShieldCheck, Truck, Star, Headphones, Package, Tag];

export default function WhyUs() {
  const lang = useLang();

  return (
    <section className="section-band section-band--white">
      <div className="site-container py-14 sm:py-16">
        <div className="section-intro">
          <p className="section-eyebrow">{tr(t.whyUs.title, lang)}</p>
          <h2 className="section-heading">{tr(t.whyUs.title, lang)}</h2>
          <p className="section-lead">{tr(t.whyUs.subtitle, lang)}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.whyUs.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="pro-card flex gap-4 p-5 sm:p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--site-accent-soft)]">
                  <Icon size={20} className="accent-icon" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-1.5 text-[15px] font-semibold text-[color:var(--foreground)]">{tr(item.title, lang)}</h3>
                  <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">{tr(item.desc, lang)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
