import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { ComplianceObligation } from '../../types';
import { CheckCircle2, RotateCcw, FileText } from 'lucide-react';

interface VerifyEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  obligation: ComplianceObligation;
  onVerify: (decision: 'accept' | 'reject', feedback: string) => void;
}

export const VerifyEvidenceModal: React.FC<VerifyEvidenceModalProps> = ({
  isOpen,
  onClose,
  obligation,
  onVerify,
}) => {
  const [decision, setDecision] = useState<'accept' | 'reject'>('accept');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (decision === 'reject' && !feedback.trim()) {
      alert('Please state the correction reason when rejecting compliance evidence.');
      return;
    }
    onVerify(decision, feedback || 'Evidence evaluated and found compliant with AICTE norms.');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Institutional Evidence Dossier"
      subtitle={`${obligation.id} • ${obligation.institutionName}`}
      footer={
        <>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn-sm ${decision === 'accept' ? 'btn-primary' : 'btn-danger'}`}
            onClick={handleSubmit}
          >
            {decision === 'accept' ? (
              <>
                <CheckCircle2 size={14} />
                <span>Accept Evidence & Mark Complied</span>
              </>
            ) : (
              <>
                <RotateCcw size={14} />
                <span>Reject & Request Correction</span>
              </>
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary-navy)' }}>
            SUBMITTED FILE: {obligation.submittedFile?.name || 'Attached PDF Document'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Submitted on {obligation.submittedFile?.submittedAt || '2026-10-20'} ({obligation.submittedFile?.size || '2.1 MB'})
          </div>
          {obligation.submittedFile?.note && (
            <div style={{ fontSize: '12px', color: 'var(--color-text-main)', marginTop: '6px', fontStyle: 'italic' }}>
              Institution Declaration: "{obligation.submittedFile.note}"
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Verification Determination *</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <label
              style={{
                flex: 1,
                border: `2px solid ${decision === 'accept' ? 'var(--color-green-text)' : 'var(--color-border)'}`,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: decision === 'accept' ? 'var(--color-green-bg)' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <input
                type="radio"
                name="decision"
                checked={decision === 'accept'}
                onChange={() => setDecision('accept')}
              />
              <span style={{ fontWeight: 600, color: 'var(--color-green-text)' }}>
                Accept & Certify Compliance
              </span>
            </label>

            <label
              style={{
                flex: 1,
                border: `2px solid ${decision === 'reject' ? 'var(--color-red-text)' : 'var(--color-border)'}`,
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: decision === 'reject' ? 'var(--color-red-bg)' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <input
                type="radio"
                name="decision"
                checked={decision === 'reject'}
                onChange={() => setDecision('reject')}
              />
              <span style={{ fontWeight: 600, color: 'var(--color-red-text)' }}>
                Reject & Request Correction
              </span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Official Reviewer Observations / Correction Rationale {decision === 'reject' && <span className="required">*</span>}
          </label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder={
              decision === 'accept'
                ? 'Optional remarks endorsing the audit trail...'
                : 'State the specific discrepancies (e.g., missing RTGS transaction IDs, expired certificates, non-conforming affidavits)...'
            }
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required={decision === 'reject'}
          />
        </div>
      </form>
    </Modal>
  );
};
