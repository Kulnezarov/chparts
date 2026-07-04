#!/usr/bin/env python3
"""Replace leftover orange/amber Tailwind accents with unified blue (#0071e3)."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIRS = [ROOT / "app", ROOT / "components"]

# Order matters: longer / more specific first
REPLACEMENTS: list[tuple[str, str]] = [
    (
        r"bg-gradient-to-b from-orange-500 to-orange-600",
        "btn-primary",
    ),
    (
        r"bg-gradient-to-br from-orange-500 to-orange-600",
        "btn-primary",
    ),
    (
        r"hover:from-orange-400 hover:to-orange-500",
        "hover:bg-[#0077ed]",
    ),
    (r"shadow-orange-900/25", "shadow-black/10"),
    (r"shadow-orange-900/20", "shadow-black/10"),
    (r"shadow-orange-950/30", "shadow-black/10"),
    (r"shadow-orange-500/\d+", "shadow-black/10"),
    (r"shadow-orange-\d+/\d+", "shadow-black/10"),
    (r"ring-orange-\d+/\d+", "ring-[#0071e3]/15"),
    (r"border-l-\[3px\] border-l-orange-500", "accent-border-l"),
    (r"border-l-orange-500", "border-l-[#0071e3]"),
    (
        r"border-orange-300/90 bg-gradient-to-br from-orange-50/80 to-white shadow-sm ring-1 ring-orange-200/80",
        "option-card-selected",
    ),
    (r"from-orange-50/80 to-white", "from-[#0071e3]/6 to-white"),
    (r"from-orange-50/50 to-white", "from-[#0071e3]/5 to-white"),
    (r"to-orange-50/40", "to-[#0071e3]/5"),
    (r"from-orange-50", "from-[#0071e3]/6"),
    (r"to-orange-100", "to-[#0071e3]/10"),
    (r"from-orange-200", "from-[#0071e3]/20"),
    (r"to-orange-600", "to-[#0071e3]"),
    (r"from-orange-500", "from-[#0071e3]"),
    (r"bg-orange-500/15", "bg-[#0071e3]/12"),
    (r"bg-orange-500", "bg-[#0071e3]"),
    (r"bg-orange-600", "bg-[#0071e3]"),
    (r"bg-orange-100", "bg-[#0071e3]/10"),
    (r"bg-orange-50/90", "bg-[#0071e3]/8"),
    (r"bg-orange-50/80", "bg-[#0071e3]/8"),
    (r"bg-orange-50/60", "bg-[#0071e3]/6"),
    (r"bg-orange-50/50", "bg-[#0071e3]/6"),
    (r"bg-orange-50", "bg-[#0071e3]/6"),
    (r"hover:bg-orange-100/90", "hover:bg-[#0071e3]/12"),
    (r"hover:bg-orange-50/60", "hover:bg-[#0071e3]/6"),
    (r"hover:bg-orange-50/50", "hover:bg-[#0071e3]/6"),
    (r"hover:bg-orange-400", "hover:bg-[#0077ed]"),
    (r"hover:bg-orange-600", "hover:bg-[#0077ed]"),
    (r"hover:bg-orange-700", "hover:bg-[#0077ed]"),
    (r"border-orange-300/90", "border-[#0071e3]/30"),
    (r"border-orange-300/50", "border-[#0071e3]/25"),
    (r"border-orange-300", "border-[#0071e3]/25"),
    (r"border-orange-200/90", "border-[#0071e3]/20"),
    (r"border-orange-200/80", "border-[#0071e3]/20"),
    (r"border-orange-200/60", "border-[#0071e3]/18"),
    (r"border-orange-200", "border-[#0071e3]/18"),
    (r"border-orange-100/80", "border-[#0071e3]/15"),
    (r"border-orange-100", "border-[#0071e3]/15"),
    (r"hover:border-orange-300/50", "hover:border-[#0071e3]/30"),
    (r"hover:border-orange-300", "hover:border-[#0071e3]/30"),
    (r"hover:border-orange-200/90", "hover:border-[#0071e3]/22"),
    (r"hover:border-orange-200/80", "hover:border-[#0071e3]/22"),
    (r"hover:border-orange-200", "hover:border-[#0071e3]/20"),
    (r"hover:border-l-orange-500", "hover:border-l-[#0071e3]"),
    (r"group-hover:border-orange-200", "group-hover:border-[#0071e3]/20"),
    (r"group-hover:border-orange-300/50", "group-hover:border-[#0071e3]/25"),
    (r"hover:border-orange-400", "hover:border-[#0071e3]/35"),
    (r"text-orange-900", "text-[#1d1d1f]"),
    (r"text-orange-800/90", "text-[#1d1d1f]"),
    (r"text-orange-800", "text-[#1d1d1f]"),
    (r"text-orange-700", "text-[#0071e3]"),
    (r"text-orange-600", "text-[#0071e3]"),
    (r"text-orange-500", "accent-icon"),
    (r"text-orange-400", "text-[#0071e3]"),
    (r"text-orange-300", "text-[#64b5ff]"),
    (r"text-orange-200/90", "text-white/75"),
    (r"hover:text-orange-700", "hover:text-[#0071e3]"),
    (r"hover:text-orange-600", "hover:text-[#0071e3]"),
    (r"hover:text-orange-500", "hover:text-[#0071e3]"),
    (r"hover:text-orange-400", "hover:text-[#0071e3]"),
    (r"group-hover:text-orange-600", "group-hover:text-[#0071e3]"),
    (r"group-hover:text-orange-500", "group-hover:text-[#0071e3]"),
    (r"group-hover:text-orange-300", "group-hover:text-[#64b5ff]"),
    (r"group-hover:shadow-orange-500/10", "group-hover:shadow-black/8"),
    (r"focus:bg-orange-500", "focus:bg-[#0071e3]"),
    (r"ring-orange-500/20", "ring-[#0071e3]/15"),
    (r"ring-orange-200/50", "ring-[#0071e3]/12"),
    (r"ring-orange-200/80", "ring-[#0071e3]/15"),
    (r"ring-orange-200", "ring-[#0071e3]/12"),
    (r"border-amber-200/90 bg-gradient-to-b from-amber-50/90 to-white text-amber-950", "warn-callout"),
    (r"border-amber-200/80 bg-amber-50/90", "warn-callout border"),
    (r"text-amber-600", "accent-icon"),
    (r"text-amber-500", "text-[#6e6e73]"),
    (r"text-amber-950", "text-[#1d1d1f]"),
    (r"from-orange-500/30 to-amber-400/10", "from-[#0071e3]/25 to-[#0071e3]/5"),
    (r"bg-orange-100 text-zinc-900", "highlight-mark"),
]


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    orig = text
    for pattern, repl in REPLACEMENTS:
        text = re.sub(pattern, repl, text)
    if text != orig:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    changed = 0
    for d in DIRS:
        for path in d.rglob("*.tsx"):
            if patch_file(path):
                changed += 1
                print(path.relative_to(ROOT))
    print(f"Updated {changed} files")


if __name__ == "__main__":
    main()
