"use client";

import { useMemo, useState } from "react";
import { CITIES_KZ } from "@/lib/cities-kz";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  id?: string;
};

export default function CitySearchField({ value, onChange, placeholder, id }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CITIES_KZ.slice(0, 12);
    return CITIES_KZ.filter((c) => c.toLowerCase().includes(q)).slice(0, 12);
  }, [query]);

  return (
    <div className="relative">
      <input
        id={id}
        value={open ? query : value}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!open) setOpen(true);
          if (!e.target.value.trim()) onChange("");
        }}
        onFocus={() => {
          setQuery(value);
          setOpen(true);
        }}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150);
        }}
        className="input-catalog h-12 text-base"
        placeholder={placeholder}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-black/[0.08] bg-white py-1 shadow-lg">
          {filtered.map((city) => (
            <li key={city}>
              <button
                type="button"
                className="w-full px-3 py-2.5 text-left text-sm text-[color:var(--text-charcoal)] hover:bg-[color:var(--site-accent-soft)]"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(city);
                  setQuery(city);
                  setOpen(false);
                }}
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
