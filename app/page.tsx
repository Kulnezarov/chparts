import type { Metadata } from "next";
import Hero from "@/components/Hero";
import HomeBelowFoldDeferred from "@/components/home/HomeBelowFoldDeferred";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: `${SITE_NAME} — автозапчасти для китайских авто`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — автозапчасти FAW, Changan, Dongfeng`,
    description: SITE_DESCRIPTION,
    url: "/",
  },
};

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-[color:var(--surface-light)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,_rgba(51,144,236,0.14)_0%,_rgba(51,144,236,0.05)_34%,_transparent_72%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.55)_0%,_rgba(255,255,255,0)_70%)] blur-3xl opacity-60"
        aria-hidden
      />
      <div className="relative">
        <Hero />
        <HomeBelowFoldDeferred />
      </div>
    </div>
  );
}
