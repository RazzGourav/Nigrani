import React, { useState } from 'react';
import { Application } from '../../types';
import { Modal } from '../../components/common/Modal';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ReturnDeficiencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  onConfirm: (reason: string, deadline: string) => void;
}

export const ReturnDeficiencyModal: React.FC<ReturnDeficiencyModalProps> = ({
  isOpen,
  onClose,
  application,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [deadline, setDeadline] = useState('2026-10-27');
  const [attachmentNote, setAttachmentNote] = useState('');
  const [error, setError] = useState('');

  const handleCommit = () => {
    if (!reason.trim()) {
      setError('A return for deficiency cannot be submitted with an empty reason (AICTE APH Rule).');
      return;
    }
    setError('');
    onConfirm(reason, deadline);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Return Application for Correction"
      subtitle={`Application: ${application.id} • ${application.institutionName}`}
      footer={
        <>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger btn-sm" onClick={handleCommit}>
            <RotateCcw size={14} />
            <span>Confirm Return</span>
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div
          style={{
            background: 'var(--color-amber-bg)',
            border: '1px solid var(--color-amber-border)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12.5px',
            color: 'var(--color-amber-text)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Notice:</strong> This action will notify the institution via email/SMS, halt current processing, and record the deficiency reason in the case audit history.
          </div>
        </div>

        {/* Mandatory Reason Field per PRD 3.2 & 19.4 */}
        <div className="form-group">
          <label className="form-label">
            Reason for Return <span className="required">*</span>
          </label>
          <textarea
            className="form-textarea"
            rows={4}
            placeholder="Specify the exact missing statutory certificates, building norms shortfall, faculty cadre ratio discrepancies, or defective documentation required to be cured..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            required
            aria-required="true"
          />
          {error && <span className="form-error">{error}</span>}
          <span className="form-helper">
            Mandatory: State the regulatory handbook reference and specific rectifications expected.
          </span>
        </div>

        {/* Response Deadline */}
        <div className="form-group">
          <label className="form-label">
            Institution Response Due Date <span className="required">*</span>
          </label>
          <input
            type="date"
            className="form-input"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
          <span className="form-helper">
            Prescribed default: 7 calendar days from dispatch of deficiency communication.
          </span>
        </div>

        {/* Supporting Note */}
        <div className="form-group">
          <label className="form-label">Internal Supporting Note / Scrutiny File Reference (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Scrutiny Committee Minute Item 4.2 / File No. AICTE/RO/2026/89"
            value={attachmentNote}
            onChange={(e) => setAttachmentNote(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};
