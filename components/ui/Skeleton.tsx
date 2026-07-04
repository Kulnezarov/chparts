"use client";

import { useLang } from "@/lib/useLang";
import { useDelayedTrue } from "@/lib/useDelayedTrue";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`skeleton ${className}`.trim()} aria-hidden />;
}

export function ProductCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <article className="product-card overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className={`product-card-body space-y-2 ${compact ? "p-3" : ""}`}>
        <Skeleton className="h-2.5 w-2/3 rounded-full" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
        <div className="product-card-footer mt-2 flex items-end justify-between gap-2">
          <Skeleton className="h-7 w-24 rounded-lg" />
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
        </div>
      </div>
    </article>
  );
}

export function ProductCardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="catalog-product-grid" aria-busy="true" aria-label="Загрузка товаров">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BreadcrumbSkeleton() {
  return (
    <div className="mb-6 flex items-center gap-2" aria-hidden>
      <Skeleton className="h-7 w-28 rounded-full" />
      <Skeleton className="h-3 w-3 rounded-full" />
      <Skeleton className="h-7 w-20 rounded-full" />
    </div>
  );
}

export function CatalogFiltersSkeleton() {
  return (
    <div className="mb-6 space-y-3" aria-hidden>
      <Skeleton className="h-11 w-full rounded-xl" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div className="page-frame bg-[#f5f5f7] pb-28 lg:pb-10" aria-busy="true" aria-label="Загрузка товара">
      <div className="site-container py-4 sm:py-8">
        <BreadcrumbSkeleton />
        <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white">
          <div className="grid lg:grid-cols-2">
            <Skeleton className="aspect-square w-full rounded-none lg:min-h-[420px]" />
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
              <Skeleton className="h-3 w-1/3 rounded-full" />
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-8 w-4/5 rounded-lg" />
              <Skeleton className="h-10 w-40 rounded-lg" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-11/12 rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
              <div className="flex gap-3 pt-4">
                <Skeleton className="h-12 flex-1 rounded-full" />
                <Skeleton className="h-12 w-36 rounded-full" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <Skeleton className="mb-4 h-6 w-40 rounded-lg" />
          <ProductCardGridSkeleton count={4} />
        </div>
      </div>
    </div>
  );
}

export function PageTitleSkeleton() {
  return <Skeleton className="h-9 w-48 rounded-xl" aria-hidden />;
}

const slowCopy = {
  ru: "Медленное соединение — загружаем данные…",
  kz: "Байланыс баяу — деректер жүктелуде…",
  uz: "Sekin internet — yuklanmoqda…",
};

/** Появляется, если loading дольше ~1.6 с — понятно при плохом интернете. */
export function SlowLoadingHint({ active }: { active: boolean }) {
  const lang = useLang();
  const show = useDelayedTrue(active, 1600);
  if (!show) return null;

  return (
    <p
      role="status"
      className="slow-loading-hint mb-4 flex items-center gap-2 text-sm text-zinc-500"
    >
      <span className="slow-loading-hint__dot" aria-hidden />
      {slowCopy[lang]}
    </p>
  );
}

/** Тонкая полоска вверху страницы при загрузке. */
export function TopLoadingBar({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="top-loading-bar" role="progressbar" aria-label="Загрузка">
      <div className="top-loading-bar__inner" />
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-3 rounded-xl border border-black/[0.06] bg-white p-3.5 sm:gap-4 sm:p-4">
      <Skeleton className="h-16 w-16 shrink-0 rounded-xl sm:h-[4.5rem] sm:w-[4.5rem]" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3 w-1/2 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4 rounded" />
      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  );
}

export function CheckoutSectionSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border border-black/[0.06] bg-white p-4">
      <Skeleton className="h-6 w-1/3 rounded-lg" />
      <FormFieldSkeleton />
      <FormFieldSkeleton />
    </div>
  );
}
