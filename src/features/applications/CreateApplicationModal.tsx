import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { ApprovalRoute, ApplicationType, Region } from '../../types';
import { PlusCircle } from 'lucide-react';

interface CreateApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appData: any) => void;
}

export const CreateApplicationModal: React.FC<CreateApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [institutionName, setInstitutionName] = useState('');
  const [region, setRegion] = useState<Region>('North');
  const [applicationType, setApplicationType] = useState<ApplicationType>('Extension of Approval');
  const [route, setRoute] = useState<ApprovalRoute>('Scrutiny + EVC');
  const [programme, setProgramme] = useState('Engineering & Technology');
  const [intake, setIntake] = useState(240);
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName.trim()) {
      alert('Please enter Institution Name.');
      return;
    }
    onSubmit({
      institutionName,
      region,
      applicationType,
      route,
      programme,
      intakeProposed: Number(intake),
      contactPerson: contactPerson || 'Principal / Director',
      contactEmail: contactEmail || 'director@demo-institute.edu',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Demonstration Application"
      subtitle="Seed a new application into a configured AICTE Approval Process Handbook route"
      footer={
        <>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit}>
            <PlusCircle size={14} />
            <span>Create & Onboard Case</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-group">
          <label className="form-label">
            Institution Name <span className="required">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Malviya National Institute of Engineering"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Regional Office Jurisdiction *</label>
            <select
              className="form-select"
              value={region}
              onChange={(e) => setRegion(e.target.value as Region)}
            >
              <option value="North">North Region</option>
              <option value="South">South Region</option>
              <option value="West">West Region</option>
              <option value="East">East Region</option>
              <option value="Central">Central Region</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Application Type *</label>
            <select
              className="form-select"
              value={applicationType}
              onChange={(e) => setApplicationType(e.target.value as ApplicationType)}
            >
              <option value="Extension of Approval">Extension of Approval (EoA)</option>
              <option value="New Institution">New Institution Setup</option>
              <option value="Increase in Intake">Increase in Intake</option>
              <option value="New Programme">New Programme / Department</option>
              <option value="Standalone Verification">Standalone Verification</option>
            </select>
          </div>
        </div>

        {/* Route Selector (Defines the stage sequence) */}
        <div className="form-group">
          <label className="form-label">
            Configured Workflow Route <span className="required">*</span>
          </label>
          <select
            className="form-select"
            value={route}
            onChange={(e) => setRoute(e.target.value as ApprovalRoute)}
          >
            <option value="Scrutiny Only">Scrutiny Only (Fast-track EoA)</option>
            <option value="Scrutiny + EVC">Scrutiny + EVC (Mandatory On-site Inspection)</option>
            <option value="EVC Only">EVC Only (Direct Physical Verification)</option>
            <option value="Scrutiny + EVC + SAC">Scrutiny + EVC + SAC (With Standing Appellate Option)</option>
          </select>
          <span className="form-helper">
            Stages will be dynamically configured according to this selected route.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Programme / Discipline</label>
            <input
              type="text"
              className="form-input"
              value={programme}
              onChange={(e) => setProgramme(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Proposed Intake</label>
            <input
              type="number"
              className="form-input"
              value={intake}
              onChange={(e) => setIntake(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Contact Person (Head of Inst.)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dr. P. K. Sen"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="director@institute.ac.in"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
