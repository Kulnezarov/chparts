"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useLang } from "@/lib/useLang";
import ProductImage from "@/components/ui/ProductImage";

type Props = {
  images: string[];
  name: string;
  /** Компактная высота на странице товара (мобильный) */
  compact?: boolean;
};

export default function ProductGallery({ images, name, compact = false }: Props) {
  const lang = useLang();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const pushedHistoryRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);

  const currentImage = images[selectedIndex] ?? null;
  const lightboxImage = lightboxIndex == null ? null : images[lightboxIndex] ?? null;

  const labels = {
    ru: {
      close: "Закрыть",
      previous: "Предыдущее фото",
      next: "Следующее фото",
      open: "Увеличить фото",
      photo: "Фото",
    },
    kz: {
      close: "Жабу",
      previous: "Алдыңғы фото",
      next: "Келесі фото",
      open: "Фотоны үлкейту",
      photo: "Фото",
    },
    uz: {
      close: "Yopish",
      previous: "Oldingi foto",
      next: "Keyingi foto",
      open: "Fotoni kattalashtirish",
      photo: "Foto",
    },
  }[lang];

  const showPrevious = useCallback(() => {
    if (images.length < 2) return;
    if (lightboxIndex == null) {
      setSelectedIndex((idx) => (idx <= 0 ? images.length - 1 : idx - 1));
      return;
    }
    setLightboxIndex((idx) => {
      if (idx == null) return idx;
      return idx <= 0 ? images.length - 1 : idx - 1;
    });
  }, [images.length, lightboxIndex]);

  const showNext = useCallback(() => {
    if (images.length < 2) return;
    if (lightboxIndex == null) {
      setSelectedIndex((idx) => (idx + 1) % images.length);
      return;
    }
    setLightboxIndex((idx) => {
      if (idx == null) return idx;
      return (idx + 1) % images.length;
    });
  }, [images.length, lightboxIndex]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    if (!pushedHistoryRef.current && typeof window !== "undefined") {
      window.history.pushState({ productGallery: true }, "", window.location.href);
      pushedHistoryRef.current = true;
    }
  };

  const closeLightbox = useCallback(() => {
    if (pushedHistoryRef.current && typeof window !== "undefined") {
      window.history.back();
      return;
    }
    setLightboxIndex(null);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      if (!pushedHistoryRef.current) return;
      pushedHistoryRef.current = false;
      setLightboxIndex(null);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (lightboxIndex == null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeLightbox, images.length, lightboxIndex, showNext, showPrevious]);

  const handleTouchEnd = (clientX: number) => {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    if (startX == null) return;
    const diff = clientX - startX;
    if (Math.abs(diff) < 40) return;
    if (diff > 0) {
      showPrevious();
    } else {
      showNext();
    }
  };

  return (
    <>
      <div className="bg-[color:var(--surface-light)] p-3 sm:p-4">
        <button
          type="button"
          onClick={() => currentImage && openLightbox(selectedIndex)}
          disabled={!currentImage}
          className={`group relative w-full overflow-hidden rounded-xl bg-[color:var(--surface-white)] disabled:cursor-default ${
            compact ? "h-52 sm:h-64 md:h-72 md:min-h-[360px]" : "h-72 md:min-h-[360px]"
          }`}
          aria-label={labels.open}
        >
          <ProductImage
            src={currentImage}
            alt={name}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            fit="contain"
          />
          {currentImage && (
            <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950/70 text-white opacity-90 shadow-lg transition-opacity group-hover:opacity-100">
              <Maximize2 size={17} />
            </span>
          )}
          {images.length > 1 && (
            <span className="absolute bottom-3 right-3 rounded-lg bg-zinc-950/75 px-2 py-1 text-xs font-semibold tabular-nums text-white">
              {selectedIndex + 1} / {images.length}
            </span>
          )}
        </button>

        {images.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
            {images.map((src, index) => (
              <button
                type="button"
                key={`${src}-${index}`}
                onClick={() => setSelectedIndex(index)}
                onDoubleClick={() => openLightbox(index)}
                className={`relative aspect-square overflow-hidden rounded-lg border bg-white transition-all ${
                  index === selectedIndex
                    ? "border-[var(--site-accent)] ring-2 ring-[var(--site-accent)]/15"
                    : "border-black/[0.08] hover:border-[color:var(--site-accent)]/18"
                }`}
                aria-label={`${labels.photo} ${index + 1}`}
              >
                <ProductImage src={src} alt={`${name} ${index + 1}`} sizes="96px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex != null && lightboxImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/95 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
          onTouchStart={(event) => {
            touchStartXRef.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            handleTouchEnd(event.changedTouches[0]?.clientX ?? 0);
          }}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              closeLightbox();
            }}
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white shadow-lg ring-1 ring-white/15 transition-colors hover:bg-white/20 sm:right-5 sm:top-5"
            aria-label={labels.close}
          >
            <X size={22} />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-white/10 text-white shadow-lg ring-1 ring-white/15 transition-colors hover:bg-white/20 sm:left-5"
                aria-label={labels.previous}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-white/10 text-white shadow-lg ring-1 ring-white/15 transition-colors hover:bg-white/20 sm:right-5"
                aria-label={labels.next}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            className="relative h-[86vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <ProductImage
              src={lightboxImage}
              alt={`${name} ${lightboxIndex + 1}`}
              sizes="100vw"
              priority
              fit="contain"
              imgClassName="select-none"
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold tabular-nums text-white ring-1 ring-white/15">
              {lightboxIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
