import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  /** Extra classes on the inner `site-container` (e.g. `max-w-3xl mx-auto`). */
  innerClassName?: string;
};

export default function PageShell({ children, innerClassName = "" }: PageShellProps) {
  return (
    <div className="page-frame min-h-[100dvh]">
      <div className={`site-container py-6 sm:py-10 lg:py-12 ${innerClassName}`.trim()}>{children}</div>
    </div>
  );
}
