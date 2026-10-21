import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = '520px',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="drawer-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="drawer-panel" style={{ maxWidth: width }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-surface)',
          }}
        >
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700 }}>{title}</h2>
            {subtitle && <p className="subtitle" style={{ fontSize: '12px' }}>{subtitle}</p>}
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-xs"
            onClick={onClose}
            aria-label="Close drawer"
            style={{ width: '28px', height: '28px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>{children}</div>

        {footer && (
          <div
            style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--color-border)',
              background: '#F8FAFC',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
