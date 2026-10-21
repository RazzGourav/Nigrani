import React from 'react';
import {
  Clock,
  AlertTriangle,
  AlertOctagon,
  CheckCircle,
  XCircle,
  RotateCcw,
  FileText,
  Calendar,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const s = status.toLowerCase();

  if (s.includes('overdue') || s.includes('expired') || s.includes('failed') || s.includes('rejected')) {
    return (
      <span className={`badge badge-red ${className}`}>
        <AlertOctagon size={13} aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  if (s.includes('due soon') || s.includes('proposed') || s.includes('awaiting') || s.includes('action required')) {
    return (
      <span className={`badge badge-amber ${className}`}>
        <AlertTriangle size={13} aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  if (s.includes('returned') || s.includes('retried')) {
    return (
      <span className={`badge badge-purple ${className}`}>
        <RotateCcw size={13} aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  if (s.includes('approved') || s.includes('verified') || s.includes('accepted') || s.includes('valid') || s.includes('closed') || s.includes('completed')) {
    return (
      <span className={`badge badge-green ${className}`}>
        <CheckCircle size={13} aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  if (s.includes('scheduled') || s.includes('submitted') || s.includes('under review')) {
    return (
      <span className={`badge badge-blue ${className}`}>
        <Calendar size={13} aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  if (s.includes('in progress') || s.includes('on track')) {
    return (
      <span className={`badge badge-neutral ${className}`}>
        <Clock size={13} aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span className={`badge badge-neutral ${className}`}>
      <HelpCircle size={13} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
};
