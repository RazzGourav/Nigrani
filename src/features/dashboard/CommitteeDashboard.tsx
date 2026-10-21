import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  FileCheck,
  Calendar,
  Building,
  CheckCircle,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const CommitteeDashboard: React.FC = () => {
  const { currentUser, evcSchedules, applications, setSelectedAppId, setActiveRoutePath } = useApp();
  const { t } = useLanguage();

  const [selectedEVC, setSelectedEVC] = useState<string | null>(null);
  const [observationText, setObservationText] = useState('');
  const [observationType, setObservationType] = useState('Satisfactory');
  const [submittedObs, setSubmittedObs] = useState<Record<string, string>>({});

  // Committee assigned schedules
  const assignedSchedules = evcSchedules.filter(
    (e) =>
      e.assignedCommittee?.toLowerCase().includes('harish') ||
      e.assignedCommittee?.toLowerCase().includes('panel') ||
      e.assignedCommittee?.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[1] || 'xyz')
  );

  const handleOpenApp = (id: string) => {
    setSelectedAppId(id);
    setActiveRoutePath('/applications');
  };

  const handleSaveObservation = (evcId: string) => {
    if (!observationText.trim()) {
      alert('Please enter your committee observation before submitting.');
      return;
    }
    setSubmittedObs((prev) => ({
      ...prev,
      [evcId]: `[${observationType}] ${observationText} (Submitted by ${currentUser.name} on ${new Date().toLocaleDateString()})`,
    }));
    setObservationText('');
    setSelectedEVC(null);
    alert('Committee observation recorded and committed to case record.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCheck size={22} color="var(--color-gov-blue)" />
          <h1>Committee Member Workspace</h1>
        </div>
        <p className="subtitle">
          Review assigned Expert Visit Committee (EVC) schedules, evaluate infrastructure evidence, and record inspection observations.
        </p>
      </div>

      {/* Top Notice: Official Boundary per PRD 8.6 & 15.9 */}
      <div
        style={{
          background: 'var(--color-gov-blue-subtle)',
          border: '1px solid #B9D9EB',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          fontSize: '12.5px',
          color: 'var(--color-text-main)',
        }}
      >
        <strong>Administrative Boundary Notice:</strong> Committee observations are advisory and evidentiary in nature. Final statutory approvals/rejections remain exclusively reserved for competent regulatory authorities.
      </div>

      {/* Assigned EVC Inspection Schedule */}
      <div className="gov-card">
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '16px' }}>Assigned Inspection & Hearing Schedule</h2>
          <p className="subtitle">Institutions where you are designated Chairman or Panel Expert</p>
        </div>

        <div className="gov-table-container">
          <table className="gov-table" aria-label="Assigned committee visits">
            <thead>
              <tr>
                <th scope="col">Schedule ID</th>
                <th scope="col">Application ID</th>
                <th scope="col">Institution</th>
                <th scope="col">Inspection Reason</th>
                <th scope="col">Proposed / Confirmed Date</th>
                <th scope="col">Status</th>
                <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignedSchedules.map((evc) => (
                <tr key={evc.id}>
                  <td style={{ fontWeight: 600 }}>{evc.id}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleOpenApp(evc.applicationId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-gov-blue)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {evc.applicationId}
                    </button>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{evc.institutionName}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                      Committee: {evc.assignedCommittee}
                    </div>
                  </td>
                  <td style={{ fontSize: '12.5px' }}>{evc.reason}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>
                      {evc.confirmedDate || evc.proposedDate || 'Date to be fixed'}
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={evc.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => handleOpenApp(evc.applicationId)}
                      >
                        Inspect Dossier
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        onClick={() => setSelectedEVC(evc.id)}
                      >
                        Record Notes
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observation Entry Form Modal / Section if Selected */}
      {selectedEVC && (
        <div
          className="gov-card"
          style={{ border: '2px solid var(--color-gov-blue)', background: '#F8FAFC' }}
        >
          <div style={{ marginBottom: '14px' }}>
            <h2 style={{ fontSize: '16px' }}>Record Committee On-Site Observation — Schedule {selectedEVC}</h2>
            <p className="subtitle">
              Observations will be linked into the formal case dossier for Regional Officer & Competent Authority scrutiny.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '14px' }}>
            <div className="form-group">
              <label className="form-label">Observation Categorization</label>
              <select
                className="form-select"
                value={observationType}
                onChange={(e) => setObservationType(e.target.value)}
              >
                <option value="Satisfactory — Compliant with Norms">Satisfactory — Compliant with Norms</option>
                <option value="Minor Shortfall — Rectification Recommended">Minor Shortfall — Rectification Recommended</option>
                <option value="Major Deficiency — Insufficient Laboratory/Built-up Area">Major Deficiency — Insufficient Lab / Space</option>
                <option value="Safety Hazard — Urgent Attention">Safety Hazard — Urgent Attention</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Committee Observations & Findings *</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Enter physical inspection observations regarding built-up area, laboratory equipment, faculty registers, and library titles..."
                value={observationText}
                onChange={(e) => setObservationText(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedEVC(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleSaveObservation(selectedEVC)}
            >
              Submit Observation to Dossier
            </button>
          </div>
        </div>
      )}

      {/* Submitted Observations Log */}
      {Object.keys(submittedObs).length > 0 && (
        <div className="gov-card">
          <h2 style={{ fontSize: '15px', marginBottom: '8px' }}>Recently Recorded Observations</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(submittedObs).map(([evcId, note]) => (
              <div
                key={evcId}
                style={{
                  padding: '10px 14px',
                  background: 'var(--color-green-bg)',
                  border: '1px solid var(--color-green-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12.5px',
                }}
              >
                <strong>{evcId}:</strong> {note}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
