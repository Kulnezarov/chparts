import { ProductPageSkeleton, TopLoadingBar } from "@/components/ui/Skeleton";

export default function ProductLoading() {
  return (
    <>
      <TopLoadingBar active />
      <ProductPageSkeleton />
    </>
  );
}
