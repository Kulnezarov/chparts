"use client";

import { useUiStore } from "@/store/uiStore";

type Props = { children: React.ReactNode };

export default function BlurMainWhenSearch({ children }: Props) {
  const searchFocused = useUiStore((s) => s.searchFocused);
  return (
    <div className={searchFocused ? "site-blur-dim transition-[filter]" : "transition-[filter]"}>{children}</div>
  );
}
