"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import HomeBelowFoldSkeleton from "@/components/home/HomeBelowFoldSkeleton";

const HomeBelowFoldStaggered = dynamic(
  () => import("@/components/home/HomeBelowFoldStaggered"),
  {
    ssr: false,
    loading: () => <HomeBelowFoldSkeleton />,
  },
);

/**
 * Сразу показывает скелетоны под hero, затем подгружает секции по одной.
 */
export default function HomeBelowFoldDeferred() {
  const [startLoad, setStartLoad] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const go = () => {
      if (!cancelled) setStartLoad(true);
    };

    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(go, { timeout: 700 });
      return () => {
        cancelled = true;
        cancelIdleCallback(id);
      };
    }

    const t = window.setTimeout(go, 80);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  if (!startLoad) {
    return <HomeBelowFoldSkeleton />;
  }

  return <HomeBelowFoldStaggered />;
}
