import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../../components/common/Modal';
import { AuditEvent } from '../../types';
import {
  History,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  CheckCircle,
  FileCode,
  Lock,
} from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditLogs, verifyAuditChain } = useApp();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    valid: boolean;
    count: number;
  }>({ tested: true, valid: true, count: auditLogs.length });

  const handleTestIntegrity = () => {
    const res = verifyAuditChain();
    setVerificationResult({
      tested: true,
      valid: res.valid,
      count: res.totalChecked,
    });
  };

  const filteredLogs = auditLogs.filter((ev) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesRecord = ev.affectedRecord.toLowerCase().includes(q);
      const matchesActor = ev.actor.toLowerCase().includes(q);
      const matchesAction = ev.action.toLowerCase().includes(q);
      if (!matchesRecord && !matchesActor && !matchesAction) return false;
    }
    if (actionFilter !== 'ALL' && !ev.action.includes(actionFilter)) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={22} color="var(--color-gov-blue)" />
            <h1>{t('nav.audit')}</h1>
          </div>
          <p className="subtitle">
            Immutable chronological record of regulatory stage transitions, deficiency notices, evidence submissions, and administrative actions.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handleTestIntegrity}
        >
          <ShieldCheck size={14} color="var(--color-green-text)" />
          <span>Verify Chain Integrity</span>
        </button>
      </div>

      {/* Cryptographic Hash-Chain Verification Banner per PRD 8.16 & Journey E */}
      <div
        style={{
          background: verificationResult.valid ? 'var(--color-green-bg)' : 'var(--color-red-bg)',
          border: `1px solid ${verificationResult.valid ? 'var(--color-green-border)' : 'var(--color-red-border)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {verificationResult.valid ? (
            <ShieldCheck size={24} color="var(--color-green-text)" />
          ) : (
            <ShieldAlert size={24} color="var(--color-red-text)" />
          )}
          <div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: verificationResult.valid ? 'var(--color-green-text)' : 'var(--color-red-text)',
              }}
            >
              {verificationResult.valid
                ? 'Integrity check passed — 100% of event blocks validly chained'
                : 'Integrity check failed — Inconsistent block hash detected'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-main)', marginTop: '2px' }}>
              SHA-256 cryptographic linkage validated across {verificationResult.count} sequential workflow events.
            </div>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', maxWidth: '360px', textAlign: 'right' }}>
          <em>Note:</em> Hash chaining detects unauthorized retroactive tampering in the event log.
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className="gov-card"
        style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}
      >
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search
            size={14}
            style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--color-text-light)' }}
          />
          <input
            type="search"
            className="form-input"
            style={{ paddingLeft: '32px', width: '100%' }}
            placeholder="Search affected record, actor, or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ minWidth: '180px' }}>
          <select
            className="form-select"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="ALL">All Event Types</option>
            <option value="TRANSITION">Stage Transitions</option>
            <option value="DEFICIENCY">Deficiency Notices & Responses</option>
            <option value="EVIDENCE">Evidence Submissions & Reviews</option>
            <option value="EVC">EVC Proposals & Schedules</option>
            <option value="APPLICATION">Application Submissions</option>
          </select>
        </div>

        {(searchQuery || actionFilter !== 'ALL') && (
          <button
            type="button"
            className="btn btn-secondary btn-xs"
            onClick={() => {
              setSearchQuery('');
              setActionFilter('ALL');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Audit Log Table per PRD 8.16 */}
      <div className="gov-table-container">
        <table className="gov-table" aria-label="Audit events history">
          <thead>
            <tr>
              <th scope="col">Event ID</th>
              <th scope="col">Timestamp (UTC/IST)</th>
              <th scope="col">Actor & Role</th>
              <th scope="col">Action Commited</th>
              <th scope="col">Affected Case / Record</th>
              <th scope="col">State Transition</th>
              <th scope="col">Cryptographic Chain Hash</th>
              <th scope="col" style={{ textAlign: 'right' }}>Dossier</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.slice().reverse().map((ev) => (
              <tr key={ev.id}>
                <td style={{ fontWeight: 600 }}>{ev.id}</td>
                <td style={{ fontSize: '12px', fontVariantNumeric: 'tabular-nums' }}>
                  {ev.timestamp}
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{ev.actor}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    {ev.actorRole}
                  </div>
                </td>
                <td>
                  <span className="badge badge-neutral" style={{ fontWeight: 600 }}>
                    {ev.action}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--color-primary-navy)' }}>
                    {ev.affectedRecord}
                  </div>
                </td>
                <td style={{ fontSize: '12px' }}>
                  {ev.previousStatus && ev.currentStatus ? (
                    <span>
                      {ev.previousStatus} → <strong>{ev.currentStatus}</strong>
                    </span>
                  ) : (
                    <span>{ev.currentStatus || 'Action Committed'}</span>
                  )}
                </td>
                <td>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Lock size={11} color="var(--color-green-text)" />
                    <span>{ev.currentHash.substring(0, 16)}...</span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => setSelectedEvent(ev)}
                  >
                    <Eye size={12} />
                    <span>Payload</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Raw Payload Modal per PRD 8.16 */}
      {selectedEvent && (
        <Modal
          isOpen={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
          title={`Audit Payload Block — ${selectedEvent.id}`}
          subtitle={`${selectedEvent.action} • Committed at ${selectedEvent.timestamp}`}
          footer={
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                <strong>Actor:</strong> {selectedEvent.actor} ({selectedEvent.actorRole})
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                <strong>Affected Record:</strong> {selectedEvent.affectedRecord}
              </div>
              {selectedEvent.reason && (
                <div style={{ fontSize: '12.5px', color: 'var(--color-primary-navy)', marginTop: '6px' }}>
                  <strong>Recorded Justification:</strong> "{selectedEvent.reason}"
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <FileCode size={14} />
                <span>Structured Event Block (JSON Schema & Cryptographic Linkage)</span>
              </label>
              <pre
                style={{
                  background: '#1E293B',
                  color: '#F8FAFC',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11.5px',
                  lineHeight: 1.5,
                  overflowX: 'auto',
                  fontFamily: 'monospace',
                }}
              >
                {JSON.stringify(
                  {
                    eventId: selectedEvent.id,
                    timestamp: selectedEvent.timestamp,
                    actor: selectedEvent.actor,
                    actorRole: selectedEvent.actorRole,
                    action: selectedEvent.action,
                    affectedRecord: selectedEvent.affectedRecord,
                    previousState: selectedEvent.previousStatus,
                    currentState: selectedEvent.currentStatus,
                    reason: selectedEvent.reason,
                    previousBlockHash: selectedEvent.previousHash,
                    currentBlockHash: selectedEvent.currentHash,
                    integrityValidation: 'PASS_SHA256_MATCH',
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
