import React from 'react';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface UrgencyBadgeProps {
  days: number;
  className?: string;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ days, className = '' }) => {
  if (days < 0) {
    const overdueDays = Math.abs(days);
    return (
      <span className={`badge badge-red ${className}`}>
        <AlertCircle size={13} aria-hidden="true" />
        <span>Overdue by {overdueDays} day{overdueDays === 1 ? '' : 's'}</span>
      </span>
    );
  }

  if (days === 0) {
    return (
      <span className={`badge badge-red ${className}`}>
        <AlertCircle size={13} aria-hidden="true" />
        <span>Due today</span>
      </span>
    );
  }

  if (days <= 3) {
    return (
      <span className={`badge badge-amber ${className}`}>
        <Clock size={13} aria-hidden="true" />
        <span>Due in {days} day{days === 1 ? '' : 's'}</span>
      </span>
    );
  }

  if (days <= 7) {
    return (
      <span className={`badge badge-neutral ${className}`}>
        <Clock size={13} aria-hidden="true" />
        <span>Due in {days} days</span>
      </span>
    );
  }

  return (
    <span className={`badge badge-green ${className}`}>
      <CheckCircle2 size={13} aria-hidden="true" />
      <span>{days} days remaining</span>
    </span>
  );
};
