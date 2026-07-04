import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogPageContent from "@/components/catalog/CatalogPageContent";
import { buildCatalogMetadata } from "@/lib/catalogSeo";
import { ProductCardGridSkeleton, TopLoadingBar } from "@/components/ui/Skeleton";

type PageProps = {
  searchParams: Promise<{ cat?: string; brand?: string; q?: string; model?: string; sort?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  return buildCatalogMetadata(sp);
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="page-frame min-h-screen">
          <TopLoadingBar active />
          <div className="site-container py-10">
            <ProductCardGridSkeleton count={10} />
          </div>
        </div>
      }
    >
      <CatalogPageContent />
    </Suspense>
  );
}
