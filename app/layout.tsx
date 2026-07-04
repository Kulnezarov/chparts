import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";
import SkipToMain from "@/components/SkipToMain";
import ScrollToTop from "@/components/ui/ScrollToTop";
import FloatingWhatsappGate from "@/components/layout/FloatingWhatsappGate";
import DeferredOverlays from "@/components/layout/DeferredOverlays";
import { ScrollChromeProvider } from "@/lib/ScrollChromeContext";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/siteConfig";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — автозапчасти для китайских авто`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "автозапчасти",
    "запчасти китайские авто",
    "FAW",
    "Changan",
    "Dongfeng",
    "Wuling",
    "Шымкент",
    "Казахстан",
    "OEM",
    "CHParts",
  ],
  openGraph: {
    type: "website",
    locale: "ru_KZ",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — автозапчасти для китайских авто`,
    description: "Каталог запчастей, быстрая доставка, гарантия качества.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — автозапчасти для китайских авто`,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoPartsStore",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  areaServed: { "@type": "Country", name: "Kazakhstan" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="site-body min-h-full flex flex-col antialiased">
        <JsonLd data={organizationJsonLd} />
        <SkipToMain />
        <ScrollChromeProvider>
          <Header />
          <DeferredOverlays />
          <main id="main-content" className="site-main-pad flex-1 outline-none" tabIndex={-1}>
            {children}
          </main>
        </ScrollChromeProvider>
        <Footer />
        <ScrollToTop />
        <FloatingWhatsappGate />
      </body>
    </html>
  );
}
