import type { ReactNode } from "react";

type PageIntroProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
};

export default function PageIntro({ title, subtitle, eyebrow, actions, className = "" }: PageIntroProps) {
  return (
    <header className={`surface-panel mb-8 p-6 sm:p-8 ${className}`.trim()}>
      {eyebrow ? <p className="section-eyebrow mb-2 text-left">{eyebrow}</p> : null}
      <h1 className="page-title">{title}</h1>
      {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
      {actions ? <div className="mt-6 flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
