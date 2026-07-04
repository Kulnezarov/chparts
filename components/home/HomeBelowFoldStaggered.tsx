"use client";

import { useEffect, useState, type ComponentType } from "react";
import HomeBrands from "@/components/home/HomeBrands";
import HomeFeatured from "@/components/home/HomeFeatured";
import HomeSeo from "@/components/HomeSeo";
import CategoryCards from "@/components/CategoryCards";
import HowToOrder from "@/components/HowToOrder";
import {
  HomeBrandsSkeleton,
  HomeCategoriesSkeleton,
  HomeFeaturedSkeleton,
  HomeHowToSkeleton,
  HomeSeoSkeleton,
} from "@/components/home/HomeBelowFoldSkeleton";

const STAGGER_MS = 120;

const SECTIONS: {
  id: string;
  slotClass: string;
  Component: ComponentType;
  Skeleton: ComponentType;
}[] = [
  { id: "brands", slotClass: "home-section-slot--brands", Component: HomeBrands, Skeleton: HomeBrandsSkeleton },
  { id: "featured", slotClass: "home-section-slot--featured", Component: HomeFeatured, Skeleton: HomeFeaturedSkeleton },
  { id: "categories", slotClass: "home-section-slot--categories", Component: CategoryCards, Skeleton: HomeCategoriesSkeleton },
  { id: "howto", slotClass: "home-section-slot--howto", Component: HowToOrder, Skeleton: HomeHowToSkeleton },
  { id: "seo", slotClass: "home-section-slot--seo", Component: HomeSeo, Skeleton: HomeSeoSkeleton },
];

export default function HomeBelowFoldStaggered() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= SECTIONS.length) return;
    const delay = visible === 0 ? 40 : STAGGER_MS;
    const t = window.setTimeout(() => setVisible((v) => v + 1), delay);
    return () => clearTimeout(t);
  }, [visible]);

  const loading = visible < SECTIONS.length;

  return (
    <div aria-busy={loading}>
      {SECTIONS.map((section, index) => {
        const ready = index < visible;
        const { Component, Skeleton, id, slotClass } = section;
        return (
          <div key={id} className={`home-section-slot ${slotClass}`}>
            {ready ? <Component /> : <Skeleton />}
          </div>
        );
      })}
    </div>
  );
}
