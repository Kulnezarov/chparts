import {
  BreadcrumbSkeleton,
  PageTitleSkeleton,
  ProductCardGridSkeleton,
  SlowLoadingHint,
  TopLoadingBar,
} from "@/components/ui/Skeleton";

export default function FavoritesLoading() {
  return (
    <div className="page-frame min-h-screen">
      <TopLoadingBar active />
      <div className="site-container py-8">
        <BreadcrumbSkeleton />
        <PageTitleSkeleton />
        <SlowLoadingHint active />
        <ProductCardGridSkeleton count={6} />
      </div>
    </div>
  );
}
