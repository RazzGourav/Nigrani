import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { ComplianceObligation } from '../../types';
import { Upload, FileCheck } from 'lucide-react';

interface SubmitEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  obligation: ComplianceObligation;
  onSubmit: (fileName: string, note: string) => void;
}

export const SubmitEvidenceModal: React.FC<SubmitEvidenceModalProps> = ({
  isOpen,
  onClose,
  obligation,
  onSubmit,
}) => {
  const [fileName, setFileName] = useState(`${obligation.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}_Compliance_Certified.pdf`);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) {
      alert('Please provide a short declaration note describing the uploaded evidence.');
      return;
    }
    onSubmit(fileName, note);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Statutory Compliance Evidence"
      subtitle={`${obligation.id} • ${obligation.title}`}
      footer={
        <>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit}>
            <Upload size={14} />
            <span>Submit Evidence to Scrutiny Panel</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div
          style={{
            background: 'var(--color-gov-blue-subtle)',
            border: '1px solid #B9D9EB',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12.5px',
          }}
        >
          <strong>Condition Requirement:</strong> {obligation.conditionText}
        </div>

        <div className="form-group">
          <label className="form-label">Evidence File Attachment *</label>
          <div
            style={{
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              textAlign: 'center',
              background: '#F8FAFC',
            }}
          >
            <Upload size={28} color="var(--color-gov-blue)" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{fileName}</div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              PDF format, certified with digital signature or official seal (Max 10MB)
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Institutional Declaration & Notes *</label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="State the authority resolution number, date of execution, bank payment reference, or certifying officer details..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />
        </div>
      </form>
    </Modal>
  );
};
