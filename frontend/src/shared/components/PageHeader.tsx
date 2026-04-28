import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
  return (
    <header className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-default-default">
      <div>
        <h1 className="prometeo-fonts-h2-bold text-neutral-strong-default">
          {title}
        </h1>
        {subtitle && (
          <p className="prometeo-fonts-body-medium text-neutral-medium-default mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
};

export default PageHeader;
