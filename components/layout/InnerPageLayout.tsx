import type { ReactNode } from "react";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs, { type Crumb } from "@/components/layout/Breadcrumbs";
import PageHeader from "@/components/layout/PageHeader";

type InnerPageLayoutProps = {
  breadcrumbs: Crumb[];
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  innerClassName?: string;
  headerClassName?: string;
};

export default function InnerPageLayout({
  breadcrumbs,
  title,
  subtitle,
  actions,
  children,
  innerClassName = "",
  headerClassName,
}: InnerPageLayoutProps) {
  return (
    <PageShell innerClassName={innerClassName}>
      <Breadcrumbs items={breadcrumbs} />
      <PageHeader title={title} subtitle={subtitle} className={headerClassName}>
        {actions}
      </PageHeader>
      {children}
    </PageShell>
  );
}
