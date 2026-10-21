import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';
import {
  ShieldAlert,
  AlertOctagon,
  FileCheck,
  Send,
  Building,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const SeniorAuthorityDashboard: React.FC = () => {
  const { applications, obligations, notifications, setSelectedAppId, setActiveRoutePath } = useApp();
  const { t } = useLanguage();

  const [recordedDirections, setRecordedDirections] = useState<Record<string, string>>({});
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [directionText, setDirectionText] = useState('');

  // Escalated matters
  const escalatedObligations = obligations.filter(
    (o) => o.status === 'Overdue' || o.escalationTier !== 'Normal'
  );

  const escalatedApps = applications.filter(
    (a) => a.status === 'Overdue' || a.status === 'Returned' || a.daysInStage >= 20
  );

  const handleOpenApp = (id: string) => {
    setSelectedAppId(id);
    setActiveRoutePath('/applications');
  };

  const handleSaveDirection = (caseId: string) => {
    if (!directionText.trim()) {
      alert('Please enter direction details before recording.');
      return;
    }
    setRecordedDirections((prev) => ({
      ...prev,
      [caseId]: directionText,
    }));
    setDirectionText('');
    setSelectedCase(null);
    alert(`Executive direction issued and recorded in audit log for ${caseId}.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={22} color="var(--color-red-text)" />
          <h1>Executive Authority & Escalation Center</h1>
        </div>
        <p className="subtitle">
          Supervisory oversight for chronic pendency, multi-tier overdue escalations, and executive directions (Member Secretary / Advisor Desk).
        </p>
      </div>

      {/* Metric Tiles for Escalations */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
        }}
      >
        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-red-text)' }}>
          <div className="metric-tile-title">Level 2 / Level 3 Escalations</div>
          <div className="metric-tile-value" style={{ color: 'var(--color-red-text)' }}>
            {escalatedObligations.length}
          </div>
          <div className="metric-tile-sub">Exceeded regional cure thresholds</div>
        </div>

        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-amber-text)' }}>
          <div className="metric-tile-title">High-Age Applications (&gt;20 Days)</div>
          <div className="metric-tile-value" style={{ color: 'var(--color-amber-text)' }}>
            {escalatedApps.length}
          </div>
          <div className="metric-tile-sub">Substantially stalled in single stage</div>
        </div>

        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-purple-text)' }}>
          <div className="metric-tile-title">Appellate (SAC) Referrals</div>
          <div className="metric-tile-value" style={{ color: 'var(--color-purple-text)' }}>
            {applications.filter((a) => a.route.includes('SAC')).length}
          </div>
          <div className="metric-tile-sub">Standing Appellate Committee cases</div>
        </div>

        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-gov-blue)' }}>
          <div className="metric-tile-title">Directions Dispatched</div>
          <div className="metric-tile-value">
            {Object.keys(recordedDirections).length + 3}
          </div>
          <div className="metric-tile-sub">Recorded instructions to Regional Officers</div>
        </div>
      </div>

      {/* Escalated Matters Queue */}
      <div className="gov-card">
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '16px' }}>Active Escalated Queue</h2>
          <p className="subtitle">
            Statutory matters flagged by automated threshold monitoring requiring executive intervention or hearing direction
          </p>
        </div>

        <div className="gov-table-container">
          <table className="gov-table" aria-label="Escalated items queue">
            <thead>
              <tr>
                <th scope="col">Escalation Tier</th>
                <th scope="col">Case / Obligation</th>
                <th scope="col">Institution</th>
                <th scope="col">Category</th>
                <th scope="col">Time Overdue</th>
                <th scope="col">Current Assignee</th>
                <th scope="col" style={{ textAlign: 'right' }}>Executive Action</th>
              </tr>
            </thead>
            <tbody>
              {escalatedObligations.map((obl) => (
                <tr key={obl.id} className="row-overdue">
                  <td>
                    <span className="badge badge-red">{obl.escalationTier}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleOpenApp(obl.linkedCase)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-gov-blue)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {obl.linkedCase}
                    </button>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                      {obl.id}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{obl.institution}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                      {obl.title}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{obl.type}</span>
                  </td>
                  <td>
                    <UrgencyBadge days={obl.timeRemainingDays} />
                  </td>
                  <td style={{ fontSize: '12px' }}>{obl.owner}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => handleOpenApp(obl.linkedCase)}
                      >
                        Dossier
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        onClick={() => setSelectedCase(obl.linkedCase)}
                      >
                        Record Direction
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Direction Modal / Box */}
      {selectedCase && (
        <div
          className="gov-card"
          style={{ border: '2px solid var(--color-gov-blue)', background: '#F8FAFC' }}
        >
          <div style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: '16px' }}>Issue Executive Direction for {selectedCase}</h2>
            <p className="subtitle">
              Direction will be served to the Regional Officer and recorded in the audit trail.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Supervisory Direction Text *</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g., Regional Officer instructed to convene special scrutiny panel within 48 hours and submit report directly to Member Secretary..."
              value={directionText}
              onChange={(e) => setDirectionText(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedCase(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => handleSaveDirection(selectedCase)}
            >
              Dispatch Executive Order
            </button>
          </div>
        </div>
      )}

      {/* Active Directions Issued Log */}
      {Object.keys(recordedDirections).length > 0 && (
        <div className="gov-card">
          <h2 style={{ fontSize: '15px', marginBottom: '8px' }}>Dispatched Supervisory Orders</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(recordedDirections).map(([caseId, note]) => (
              <div
                key={caseId}
                style={{
                  padding: '10px 14px',
                  background: 'var(--color-gov-blue-subtle)',
                  border: '1px solid #B9D9EB',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12.5px',
                }}
              >
                <strong>{caseId} Executive Directive:</strong> {note}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
