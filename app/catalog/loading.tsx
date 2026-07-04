import {
  BreadcrumbSkeleton,
  CatalogFiltersSkeleton,
  PageTitleSkeleton,
  ProductCardGridSkeleton,
  SlowLoadingHint,
  TopLoadingBar,
} from "@/components/ui/Skeleton";

export default function CatalogLoading() {
  return (
    <div className="page-frame min-h-screen">
      <TopLoadingBar active />
      <div className="site-container py-8 sm:py-10">
        <BreadcrumbSkeleton />
        <PageTitleSkeleton />
        <SlowLoadingHint active />
        <CatalogFiltersSkeleton />
        <ProductCardGridSkeleton count={10} />
      </div>
    </div>
  );
}
