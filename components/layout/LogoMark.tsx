import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  size?: "sm" | "md";
};

const sizes = { sm: { w: 16, h: 12 }, md: { w: 18, h: 14 } };

/**
 * Три полоски в плашке — анимация по наведению на ссылку с классом `group` (см. `globals.css` `.logo-bar`).
 */
export default function LogoMark({ size = "md", className, ...rest }: Props) {
  const { w, h } = sizes[size];
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 28 20"
      fill="none"
      className={`logo-bars text-white ${className ?? ""}`.trim()}
      aria-hidden
      {...rest}
    >
      <g className="logo-bar logo-bar-1">
        <path d="M2 4H18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <g className="logo-bar logo-bar-2">
        <path d="M5 10H22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <g className="logo-bar logo-bar-3">
        <path d="M2 16H26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
