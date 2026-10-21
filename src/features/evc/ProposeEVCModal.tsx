import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { EVCSchedule } from '../../types';
import { Calendar, UserCheck } from 'lucide-react';

interface ProposeEVCModalProps {
  isOpen: boolean;
  onClose: () => void;
  evc: EVCSchedule;
  onConfirm: (proposedDate: string, committee: string, notes?: string) => void;
}

export const ProposeEVCModal: React.FC<ProposeEVCModalProps> = ({
  isOpen,
  onClose,
  evc,
  onConfirm,
}) => {
  const [proposedDate, setProposedDate] = useState(evc.proposedDate || '2026-10-24');
  const [committee, setCommittee] = useState(
    evc.assignedCommittee || 'Prof. Harish Chandra (Chairman), Dr. R. Ramanujan (Member)'
  );
  const [notes, setNotes] = useState(evc.observations || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(proposedDate, committee, notes);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Propose EVC Visit Date & Committee Panel"
      subtitle={`Schedule: ${evc.id} • ${evc.institutionName} (${evc.applicationId})`}
      footer={
        <>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit}>
            <Calendar size={14} />
            <span>Confirm Proposal</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-group">
          <label className="form-label">Proposed Visit Date *</label>
          <input
            type="date"
            className="form-input"
            value={proposedDate}
            onChange={(e) => setProposedDate(e.target.value)}
            required
          />
          <span className="form-helper">
            Statutory scheduling deadline: {evc.schedulingDeadline}
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">Assigned Expert Committee Panel *</label>
          <select
            className="form-select"
            value={committee}
            onChange={(e) => setCommittee(e.target.value)}
          >
            <option value="Prof. Harish Chandra (Chairman), Dr. R. Ramanujan (Member)">
              Panel 1: Prof. Harish Chandra (Chairman) & Dr. R. Ramanujan
            </option>
            <option value="Dr. Mohan Kelkar (Chairman), Prof. Swati Deshpande">
              Panel 2: Dr. Mohan Kelkar (Chairman) & Prof. Swati Deshpande
            </option>
            <option value="Prof. D. K. Patil (Chairman), Dr. Nalini Sharma">
              Panel 3: Prof. D. K. Patil (Chairman) & Dr. Nalini Sharma
            </option>
            <option value="Regional EVC Expert Panel (Rotational)">
              Panel 4: Regional EVC Expert Panel (Rotational Quorum)
            </option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Special Inspection Directives / Focus Areas</label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="e.g. Verify barrier-free access ramps, inspect computing laboratory servers, and confirm faculty appointment letter dispatch..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};
