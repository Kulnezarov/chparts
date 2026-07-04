import { ProductCardGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

export function HomeBrandsSkeleton() {
  return (
    <section className="bg-[color:var(--surface-light)] pb-2 pt-8 sm:pb-4 sm:pt-10" aria-hidden>
      <div className="site-container">
        <Skeleton className="mx-auto mb-4 h-3 w-36 rounded-full" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 rounded-[var(--radius-widget)] border border-black/[0.06] bg-white px-4 py-5"
            >
              <Skeleton className="h-12 w-[120px] rounded-lg sm:h-14" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeTrustSkeleton() {
  return (
    <section className="bg-[color:var(--surface-light)] pb-2 pt-1 sm:pb-4" aria-hidden>
      <div className="site-container py-4 sm:py-8">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-black/[0.06] bg-white p-3.5 sm:p-4"
            >
              <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-3 w-2/3 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeCategoriesSkeleton() {
  return (
    <section className="section-band section-band--muted" aria-hidden>
      <div className="site-container py-14 sm:py-16">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-8 w-56 max-w-full rounded-lg" />
          <Skeleton className="h-4 w-40 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="pro-card min-h-[5.5rem] space-y-3 p-4">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeFeaturedSkeleton() {
  return (
    <section className="bg-[color:var(--surface-light)]" aria-hidden>
      <div className="site-container pb-6 pt-8 sm:pb-8 sm:pt-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-8 w-48 max-w-full rounded-lg" />
            <Skeleton className="h-4 w-36 rounded-md" />
          </div>
          <Skeleton className="h-10 w-28 shrink-0 rounded-full" />
        </div>
        <ProductCardGridSkeleton count={8} />
      </div>
    </section>
  );
}

export function HomeCtaSkeleton() {
  return (
    <section className="section-band section-band--muted" aria-hidden>
      <div className="site-container py-10 sm:py-12">
        <div className="rounded-[var(--radius-widget)] border border-black/[0.06] bg-white px-6 py-8">
          <Skeleton className="mb-2 h-3 w-20 rounded-full" />
          <Skeleton className="h-7 w-full max-w-md rounded-lg" />
          <Skeleton className="mt-3 h-4 w-full max-w-lg rounded-md" />
          <Skeleton className="mt-6 h-11 w-44 rounded-full" />
        </div>
      </div>
    </section>
  );
}

export function HomeHowToSkeleton() {
  return (
    <section className="section-band section-band--muted" aria-hidden>
      <div className="site-container py-14 sm:py-16">
        <div className="mb-10 space-y-2 text-center">
          <Skeleton className="mx-auto h-3 w-28 rounded-full" />
          <Skeleton className="mx-auto h-8 w-64 max-w-full rounded-lg" />
          <Skeleton className="mx-auto h-4 w-72 max-w-full rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="pro-card space-y-3 p-6 text-center">
              <Skeleton className="mx-auto h-12 w-12 rounded-xl" />
              <Skeleton className="mx-auto h-4 w-3/4 rounded-md" />
              <Skeleton className="mx-auto h-3 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeWhySkeleton() {
  return (
    <section className="section-band section-band--white border-t border-black/[0.06]" aria-hidden>
      <div className="site-container py-14 sm:py-16">
        <Skeleton className="mx-auto mb-10 h-8 w-72 max-w-full rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-[var(--radius-widget)] border border-black/[0.06] bg-white px-5 py-8 text-center">
              <Skeleton className="mx-auto mb-4 h-14 w-14 rounded-2xl" />
              <Skeleton className="mx-auto h-5 w-32 rounded-md" />
              <Skeleton className="mx-auto mt-2 h-4 w-full max-w-[16rem] rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeSeoSkeleton() {
  return (
    <section className="border-t border-black/[0.06] bg-[#eef0f4]" aria-hidden>
      <div className="site-container py-8 sm:py-10">
        <div className="rounded-2xl border border-black/[0.06] bg-white px-5 py-4">
          <Skeleton className="h-5 w-full max-w-lg rounded-md" />
        </div>
      </div>
    </section>
  );
}

/** Полный скелетон нижней части главной (пока грузится чанк). */
export default function HomeBelowFoldSkeleton() {
  return (
    <div aria-busy="true" aria-label="Загрузка разделов">
      <div className="home-section-slot home-section-slot--brands">
        <HomeBrandsSkeleton />
      </div>
      <div className="home-section-slot home-section-slot--trust">
        <HomeTrustSkeleton />
      </div>
      <div className="home-section-slot home-section-slot--categories">
        <HomeCategoriesSkeleton />
      </div>
      <div className="home-section-slot home-section-slot--featured">
        <HomeFeaturedSkeleton />
      </div>
      <div className="home-section-slot home-section-slot--cta">
        <HomeCtaSkeleton />
      </div>
      <div className="home-section-slot home-section-slot--howto">
        <HomeHowToSkeleton />
      </div>
      <div className="home-section-slot home-section-slot--why">
        <HomeWhySkeleton />
      </div>
      <div className="home-section-slot home-section-slot--seo">
        <HomeSeoSkeleton />
      </div>
    </div>
  );
}
