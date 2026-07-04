"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/useLang";
import { t, tr } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/Skeleton";

type Props = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
  imgClassName?: string;
};

function Placeholder({ className, lang }: { className: string; lang: ReturnType<typeof useLang> }) {
  return (
    <div
      className={`product-image-placeholder flex h-full w-full flex-col items-center justify-center gap-2 ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/[0.06] bg-white/90 shadow-sm">
        <Package className="h-6 w-6 text-[color:var(--site-accent)]/50" strokeWidth={1.5} aria-hidden />
      </div>
      <span className="text-[10px] font-medium text-[color:var(--text-silver)]">{tr(t.ui.noPhoto, lang)}</span>
    </div>
  );
}

export default function ProductImage({
  src,
  alt,
  className = "",
  sizes = "(max-width: 640px) 50vw, 33vw",
  priority = false,
  fit = "cover",
  imgClassName = "",
}: Props) {
  const lang = useLang();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const url = src?.trim();

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [url]);

  useEffect(() => {
    if (!url || priority || loaded || failed) return;
    const timer = window.setTimeout(() => setFailed(true), 12000);
    return () => window.clearTimeout(timer);
  }, [url, priority, loaded, failed]);

  if (!url || failed) {
    return <Placeholder className={className} lang={lang} />;
  }

  const isProxyMedia = url.startsWith("/api/");

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {!loaded && priority !== true ? (
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" aria-hidden />
      ) : null}
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={isProxyMedia}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`${fit === "contain" ? "object-contain" : "object-cover"} transition-opacity duration-300 ${
          loaded || priority ? "opacity-100" : "opacity-0"
        } ${imgClassName}`}
      />
    </div>
  );
}
