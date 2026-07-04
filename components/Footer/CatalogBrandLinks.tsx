"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPublicBrands } from "@/lib/publicApi";
import { matchBrandId } from "@/lib/brandResolve";

const LABELS = ["Changan", "Wuling", "Dongfeng", "FAW"] as const;

export default function CatalogBrandLinks() {
  const [hrefs, setHrefs] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublicBrands()
      .then((brands) => {
        if (cancelled) return;
        const next: Record<string, string> = {};
        for (const label of LABELS) {
          const id = matchBrandId(brands, label);
          next[label] = id != null ? `/catalog?brand=${id}` : "/catalog";
        }
        setHrefs(next);
      })
      .catch(() => {
        if (!cancelled) {
          setHrefs(Object.fromEntries(LABELS.map((l) => [l, "/catalog"])));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ul className="space-y-2 text-sm">
      {LABELS.map((name) => (
        <li key={name}>
          <Link
            href={hrefs?.[name] ?? "/catalog"}
            className="transition-colors hover:text-[var(--site-accent)]"
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
