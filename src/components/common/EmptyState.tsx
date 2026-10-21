import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon = <Inbox size={36} color="var(--color-text-light)" />,
}) => {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '16px 0',
      }}
    >
      <div style={{ marginBottom: '12px' }}>{icon}</div>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-primary-navy)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '420px', marginTop: '4px', marginBottom: actionText ? '16px' : '0' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};
