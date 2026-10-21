import React, { useState } from 'react';
import { Application } from '../../types';
import { Modal } from '../../components/common/Modal';
import { ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface TransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  onConfirm: (nextStage: string, notes?: string) => void;
}

export const TransitionModal: React.FC<TransitionModalProps> = ({
  isOpen,
  onClose,
  application,
  onConfirm,
}) => {
  const currentStageIndex = application.stages.findIndex((s) => s.status === 'in_progress');
  const nextStageObj =
    currentStageIndex >= 0 && currentStageIndex < application.stages.length - 1
      ? application.stages[currentStageIndex + 1]
      : null;

  const defaultNextStage = nextStageObj ? nextStageObj.label : 'Competent Authority Approval';
  const [selectedNextStage, setSelectedNextStage] = useState(defaultNextStage);
  const [notes, setNotes] = useState('');

  const handleCommit = () => {
    onConfirm(selectedNextStage, notes);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Workflow Stage Transition"
      subtitle={`Application: ${application.id} • ${application.institutionName}`}
      footer={
        <>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleCommit}>
            <CheckCircle2 size={14} />
            <span>Confirm Transition</span>
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Stage change display */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'var(--color-gov-blue-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #B9D9EB',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Current Active Stage
            </div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-primary-navy)' }}>
              {application.currentStage}
            </div>
          </div>

          <ArrowRight size={20} color="var(--color-gov-blue)" />

          <div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Target Stage (Configured Route)
            </div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-green-text)' }}>
              {selectedNextStage}
            </div>
          </div>
        </div>

        {/* Target Stage Selector if multiple allowed */}
        <div className="form-group">
          <label className="form-label">Next Applicable Stage *</label>
          <select
            className="form-select"
            value={selectedNextStage}
            onChange={(e) => setSelectedNextStage(e.target.value)}
          >
            {application.stages
              .filter((s) => s.status !== 'completed' && s.status !== 'in_progress')
              .map((st) => (
                <option key={st.id} value={st.label}>
                  {st.label} (Responsible: {st.roleResponsible})
                </option>
              ))}
            <option value="Final Approval Granted">Final Approval Granted (Conclude Application)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Scrutiny Findings & Transition Observations</label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="Record official verification notes, committee quorum reference, or file endorsement details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <span className="form-helper">
            This observation will be permanently appended to the immutable case audit trail.
          </span>
        </div>

        {/* Consequence Summary per PRD 8.9 */}
        <div
          style={{
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            padding: '10px 12px',
            background: '#F8FAFC',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <strong>Workflow Consequence:</strong> Committing this transition moves responsibility to{' '}
          <em>{nextStageObj?.roleResponsible || 'Senior Authority'}</em> and resets stage ageing to Day 0.
        </div>
      </div>
    </Modal>
  );
};
