"use client";

import Link from "next/link";
import { Home, Search, ShoppingBag, Sparkles } from "lucide-react";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { siteWhatsAppHref } from "@/lib/siteContacts";

export default function NotFound() {
  const lang = useLang();
  const wa = siteWhatsAppHref();

  return (
    <div className="notfound-page relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-20%,rgba(0,113,227,0.12),transparent_50%)]" />

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="notfound-icon-wrap mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-black/[0.08] bg-white shadow-lg">
          <Sparkles className="h-8 w-8 text-[var(--site-accent)]" strokeWidth={1.75} />
        </div>

        <h1 className="notfound-404-text select-none text-7xl font-black leading-none tracking-tight text-[var(--text-charcoal)] sm:text-8xl" aria-hidden>
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-[var(--text-charcoal)] sm:text-3xl">{tr(t.notFound.title, lang)}</h2>
        <p className="mt-3 text-balance text-[var(--text-silver)]">{tr(t.notFound.desc, lang)}</p>

        <div className="mt-10 flex flex-col gap-3 sm:mx-auto sm:max-w-sm">
          <Link
            href="/catalog"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full btn-primary px-6 py-3.5 text-sm font-semibold text-white"
          >
            <Search className="h-5 w-5" />
            {tr(t.notFound.catalog, lang)}
          </Link>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/[0.1] bg-white px-6 py-3.5 text-sm font-semibold text-[var(--text-charcoal)]"
          >
            <Home className="h-5 w-5" />
            {tr(t.notFound.home, lang)}
          </Link>
          <Link
            href="/cart"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/[0.1] bg-white px-6 py-3.5 text-sm font-semibold text-[var(--text-charcoal)]"
          >
            <ShoppingBag className="h-5 w-5" />
            {tr(t.notFound.cart, lang)}
          </Link>
        </div>

        <p className="mt-10 text-sm text-[var(--text-silver)]">
          {tr(t.notFound.help, lang)}{" "}
          <a href={wa} target="_blank" rel="noreferrer" className="font-semibold text-[var(--site-accent)] hover:underline">
            {tr(t.notFound.whatsapp, lang)}
          </a>
        </p>
      </div>
    </div>
  );
}
