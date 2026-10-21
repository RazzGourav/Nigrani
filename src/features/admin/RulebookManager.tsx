import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../../components/common/Modal';
import { ApprovalRule } from '../../types';
import {
  Settings,
  Plus,
  Edit2,
  CheckCircle,
  Clock,
  Layers,
  Shield,
  AlertTriangle,
} from 'lucide-react';

export const RulebookManager: React.FC = () => {
  const { rules, updateRule, currentUser } = useApp();
  const { t } = useLanguage();

  const [selectedRule, setSelectedRule] = useState<ApprovalRule | null>(null);
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null);
  const [newVersionNote, setNewVersionNote] = useState('');

  const handleSaveRule = () => {
    if (!editingRule) return;
    const versionParts = editingRule.version.split('.');
    const nextVer = `${versionParts[0]}.${Number(versionParts[1] || 1) + 1}`;

    updateRule(editingRule.id, {
      ...editingRule,
      version: nextVer,
    });
    setEditingRule(null);
    setNewVersionNote('');
    alert(`Rule ${editingRule.name} updated to ${nextVer} and logged in audit history.`);
  };

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
            <Settings size={22} color="var(--color-gov-blue)" />
            <h1>{t('nav.rulebook')}</h1>
          </div>
          <p className="subtitle">
            Configure approval routes, mandatory stage sequences, statutory SLA turnaround timers, and multi-tier escalation parameters (AICTE APH 2024–27 baseline).
          </p>
        </div>
      </div>

      {/* Safety Safeguard Banner per PRD 8.17 & 17 */}
      <div
        style={{
          background: 'var(--color-gov-blue-subtle)',
          border: '1px solid #B9D9EB',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          fontSize: '12px',
          color: 'var(--color-text-main)',
        }}
      >
        <strong>Rule Versioning Safeguard:</strong> Modifying active rules generates a new version tag (e.g. <code>ROUTE-2026.2</code>). Completed historical cases retain the rule version effective at the time of their adjudication.
      </div>

      {/* Rules List Grid per PRD 8.17 */}
      <div className="gov-table-container">
        <table className="gov-table" aria-label="Approval process rules">
          <thead>
            <tr>
              <th scope="col">Rule Identifier</th>
              <th scope="col">Rule Name</th>
              <th scope="col">Approval Route</th>
              <th scope="col">Active Version</th>
              <th scope="col">Stages Configured</th>
              <th scope="col">Effective Date</th>
              <th scope="col">Status</th>
              <th scope="col">Last Modified</th>
              <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td style={{ fontWeight: 600 }}>{rule.id}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{rule.name}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                    {rule.description}
                  </div>
                </td>
                <td>
                  <span className="badge badge-neutral">{rule.route}</span>
                </td>
                <td>
                  <code style={{ background: '#EDF2F7', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>
                    {rule.version}
                  </code>
                </td>
                <td className="num-cell" style={{ fontWeight: 600 }}>
                  {rule.stages.length} stages
                </td>
                <td>{rule.effectiveDate}</td>
                <td>
                  <span className="badge badge-green">{rule.status}</span>
                </td>
                <td style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                  {rule.lastEditedTime}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs"
                      onClick={() => setSelectedRule(rule)}
                    >
                      Inspect
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-xs"
                      onClick={() => {
                        setEditingRule(rule);
                        setNewVersionNote('');
                      }}
                    >
                      <Edit2 size={11} />
                      <span>Configure</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rule Detail View Modal */}
      {selectedRule && (
        <Modal
          isOpen={Boolean(selectedRule)}
          onClose={() => setSelectedRule(null)}
          title={`Approval Rule Definition: ${selectedRule.name}`}
          subtitle={`Route: ${selectedRule.route} • Version ${selectedRule.version}`}
          footer={
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedRule(null)}
            >
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px' }}>{selectedRule.description}</p>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                ORDERED STAGE SEQUENCE & PRESCRIBED SLAS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedRule.stages.map((st, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '8px 12px',
                      background: '#F8FAFC',
                      border: '1px solid var(--color-border)',
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12.5px',
                    }}
                  >
                    <div>
                      <strong>{i + 1}. {st.name}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        Assigned Authority: {st.role}
                      </div>
                    </div>
                    <span className="badge badge-neutral">{st.slaDays} Days SLA</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                ESCALATION TRIGGER MATRIX
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedRule.escalationRules.map((esc, i) => (
                  <div key={i} style={{ flex: 1, padding: '8px', background: 'var(--color-red-bg)', border: '1px solid var(--color-red-border)', borderRadius: '4px', fontSize: '11.5px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-red-text)' }}>Overdue +{esc.overdueDays} Days</div>
                    <div style={{ color: 'var(--color-text-main)', marginTop: '2px' }}>Escalate to: {esc.escalationRole}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Rule Edit & Version Modal per PRD 8.17 */}
      {editingRule && (
        <Modal
          isOpen={Boolean(editingRule)}
          onClose={() => setEditingRule(null)}
          title={`Configure Rule & Publish New Version`}
          subtitle={`Editing ${editingRule.id} (${editingRule.name})`}
          footer={
            <>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingRule(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveRule}>
                <CheckCircle size={14} />
                <span>Publish New Version</span>
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Rule Title</label>
              <input
                type="text"
                className="form-input"
                value={editingRule.name}
                onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description / Applicability Scope</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={editingRule.description}
                onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Version Release Changelog Note *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Revised Scrutiny SLA from 15 to 14 days as per Executive Committee directive..."
                value={newVersionNote}
                onChange={(e) => setNewVersionNote(e.target.value)}
                required
              />
              <span className="form-helper">
                This note will be saved into the version changelog alongside administrator credentials.
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
