import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductPageClient from "@/components/catalog/ProductPageClient";
import JsonLd from "@/components/seo/JsonLd";
import { fetchPublicProductById, displayArticle } from "@/lib/publicApi";
import { SITE_NAME, absoluteUrl } from "@/lib/siteConfig";

type PageProps = { params: Promise<{ id: string }> };

function productDescription(product: Awaited<ReturnType<typeof fetchPublicProductById>>): string {
  if (!product) return "";
  const parts = [
    product.brand_name || product.brand,
    product.category_name,
    displayArticle(product) ? `арт. ${displayArticle(product)}` : null,
    product.sale_price > 0 ? `${product.sale_price.toLocaleString("ru-RU")} ₸` : null,
    product.quantity > 0 ? "в наличии" : "уточняйте наличие",
  ].filter(Boolean);
  return parts.join(" · ") || `Купить ${product.name} в ${SITE_NAME}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchPublicProductById(id);
  if (!product) {
    return { title: "Товар не найден", robots: { index: false, follow: false } };
  }

  const title = product.name;
  const description = productDescription(product);
  const canonical = `/catalog/${id}`;
  const ogImage = product.image_url ? [{ url: product.image_url, alt: product.name }] : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage?.map((i) => i.url),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await fetchPublicProductById(id);
  if (!product) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: productDescription(product),
    sku: displayArticle(product) || String(product.id),
    image: product.image_urls.length ? product.image_urls : product.image_url ? [product.image_url] : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "KZT",
      price: product.sale_price,
      availability:
        product.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/catalog/${id}`),
    },
    brand: product.brand_name || product.brand
      ? { "@type": "Brand", name: product.brand_name || product.brand }
      : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Каталог", item: absoluteUrl("/catalog") },
      { "@type": "ListItem", position: 3, name: product.name, item: absoluteUrl(`/catalog/${id}`) },
    ],
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ProductPageClient id={id} />
    </>
  );
}
