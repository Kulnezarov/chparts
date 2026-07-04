"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, Phone, RefreshCw } from "lucide-react";
import { SITE_SUPPORT_PHONE_DISPLAY, SITE_SUPPORT_PHONE_TEL } from "@/lib/siteContacts";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error reporting service (Sentry, etc.)
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 shadow-lg">
        {/* Error Icon with Sad Emoji */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-red-100 p-4 text-4xl">
            ☹️
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-center text-2xl font-bold text-zinc-900">
          Что-то пошло не так
        </h1>

        {/* Error Message */}
        <p className="mt-2 text-center text-sm text-slate-600">
          К сожалению, на сайте произошла ошибка. Наша служба поддержки уже уведомлена о проблеме.
        </p>

        {/* Problem Description Box */}
        <div className="mt-4 rounded-lg border border-[var(--site-accent)]/18 bg-[var(--site-accent)]/6 p-3">
          <p className="text-xs font-semibold text-[var(--text-charcoal)] mb-1">📋 Описание проблемы:</p>
          <p className="text-xs text-[var(--site-accent)]">
            Если проблема продолжается, пожалуйста, напишите нам детали ошибки.
          </p>
        </div>

        {/* Error Details (dev only) */}
        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="mt-3 rounded-lg bg-slate-100 p-3">
            <p className="text-xs font-mono text-red-700">{error.message}</p>
            {error.digest && (
              <p className="mt-1 text-xs text-slate-500">Error ID: {error.digest}</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--site-accent)] px-6 py-3 font-semibold text-white hover:bg-[var(--site-accent-hover)] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Обновить
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-zinc-900 hover:bg-slate-50 transition-colors"
          >
            <Home className="h-4 w-4" />
            На главную
          </Link>
        </div>

        {/* Support Contact */}
        <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-3.5">
          <p className="text-xs font-semibold text-blue-900 mb-2">📞 Техподдержка:</p>
          <a
            href={SITE_SUPPORT_PHONE_TEL}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <Phone className="h-3.5 w-3.5" />
            {SITE_SUPPORT_PHONE_DISPLAY}
          </a>
          <p className="mt-2 text-xs text-blue-800">
            Пожалуйста, сохраните ID ошибки и сообщите нашему теходделу.
          </p>
        </div>
      </div>
    </div>
  );
}
