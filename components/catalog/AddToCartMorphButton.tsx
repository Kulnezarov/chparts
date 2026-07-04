"use client";

import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";

type Props = {
  disabled?: boolean;
  onAdd: () => void;
  "aria-label"?: string;
};

export default function AddToCartMorphButton({ disabled, onAdd, "aria-label": ariaLabel }: Props) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1200);
    return () => clearTimeout(t);
  }, [done]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    onAdd();
    setDone(true);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel ?? "Add to cart"}
      onClick={handleClick}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-[background-color,transform] duration-200 active:scale-95 disabled:cursor-not-allowed disabled:bg-[#d1d1d6] ${
        done ? "bg-[color:var(--success)]" : "bg-[color:var(--site-accent)]"
      }`}
    >
      {done ? <Check size={20} strokeWidth={2.5} aria-hidden /> : <Plus size={20} strokeWidth={2.5} aria-hidden />}
    </button>
  );
}
