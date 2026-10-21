import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  items: { label: string; onClick?: () => void }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight size={13} color="var(--color-text-light)" />}
            {isLast || !item.onClick ? (
              <span style={{ fontWeight: isLast ? 600 : 400, color: isLast ? 'var(--color-primary-navy)' : 'inherit' }}>
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gov-blue)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
