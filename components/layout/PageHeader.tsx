type PageHeaderProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function PageHeader({ title, subtitle, children, className = "" }: PageHeaderProps) {
  return (
    <div className={`mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`.trim()}>
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
