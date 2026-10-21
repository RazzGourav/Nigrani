import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SubmitEvidenceModal } from './SubmitEvidenceModal';
import { VerifyEvidenceModal } from './VerifyEvidenceModal';
import { Drawer } from '../../components/common/Drawer';
import { ComplianceObligation } from '../../types';
import {
  CheckSquare,
  Upload,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const ComplianceList: React.FC = () => {
  const {
    compliance,
    currentUser,
    submitComplianceEvidence,
    reviewComplianceEvidence,
    setSelectedAppId,
    setActiveRoutePath,
  } = useApp();
  const { t } = useLanguage();

  const [activeUploadObl, setActiveUploadObl] = useState<ComplianceObligation | null>(null);
  const [activeVerifyObl, setActiveVerifyObl] = useState<ComplianceObligation | null>(null);
  const [drawerObl, setDrawerObl] = useState<ComplianceObligation | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Role scoping per PRD 4.2
  const scopedCompliance =
    currentUser.role === 'institution'
      ? compliance.filter((c) => c.institutionName === (currentUser.institutionName || 'North Valley Institute of Technology'))
      : compliance;

  const filteredCompliance = scopedCompliance.filter((c) => {
    if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && c.submissionStatus !== statusFilter) return false;
    return true;
  });

  const isInstitution = currentUser.role === 'institution';
  const isOfficer =
    currentUser.role === 'regional_officer' ||
    currentUser.role === 'bureau_officer' ||
    currentUser.role === 'admin';

  const handleOpenApp = (id: string) => {
    setSelectedAppId(id);
    setActiveRoutePath('/applications');
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
            <CheckSquare size={22} color="var(--color-gov-blue)" />
            <h1>{t('nav.compliance')}</h1>
          </div>
          <p className="subtitle">
            Track time-bound regulatory conditions, faculty undertakings, safety compliances, and evidentiary scrutiny.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className="gov-card"
        style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Category:
          </span>
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ height: '32px', fontSize: '12.5px', padding: '0 8px' }}
          >
            <option value="ALL">All Categories</option>
            <option value="Faculty">Faculty & Cadre</option>
            <option value="Safety">Safety & Structural</option>
            <option value="Grievance">Grievance & Anti-Ragging</option>
            <option value="Affidavit">Legal Affidavits</option>
            <option value="Land">Land & Infrastructure</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Submission Status:
          </span>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ height: '32px', fontSize: '12.5px', padding: '0 8px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Not submitted">Not submitted</option>
            <option value="Submitted">Submitted</option>
            <option value="Under review">Under review</option>
            <option value="Accepted">Accepted / Complied</option>
            <option value="Rejected — correction required">Correction Required</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        {(categoryFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <button
            type="button"
            className="btn btn-secondary btn-xs"
            onClick={() => {
              setCategoryFilter('ALL');
              setStatusFilter('ALL');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Operational Grid per PRD 8.11 */}
      <div className="gov-table-container">
        <table className="gov-table" aria-label="Compliance Obligations">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Institution</th>
              <th scope="col">App Ref</th>
              <th scope="col">Condition Title</th>
              <th scope="col">Category</th>
              <th scope="col">Due Date</th>
              <th scope="col">Submission Status</th>
              <th scope="col">Reviewer</th>
              <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompliance.map((item) => (
              <tr key={item.id}>
                <td>
                  <button
                    type="button"
                    onClick={() => setDrawerObl(item)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-gov-blue)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      textAlign: 'left',
                    }}
                  >
                    {item.id}
                  </button>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{item.institutionName}</div>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleOpenApp(item.applicationRef)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-gov-blue)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {item.applicationRef}
                  </button>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{item.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    Evidence: {item.evidenceRequired}
                  </div>
                </td>
                <td>
                  <span className="badge badge-neutral">{item.category}</span>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{item.dueDate}</div>
                </td>
                <td>
                  <StatusBadge status={item.submissionStatus} />
                </td>
                <td style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {item.assignedReviewer}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs"
                      onClick={() => setDrawerObl(item)}
                      title="Inspect Condition Details & History"
                    >
                      <Eye size={12} />
                      <span>Dossier</span>
                    </button>

                    {/* Institution upload button */}
                    {isInstitution && (item.submissionStatus === 'Not submitted' || item.submissionStatus === 'Rejected — correction required') && (
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        onClick={() => setActiveUploadObl(item)}
                      >
                        <Upload size={12} />
                        <span>Upload</span>
                      </button>
                    )}

                    {/* Officer verify button */}
                    {isOfficer && (item.submissionStatus === 'Submitted' || item.submissionStatus === 'Under review') && (
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        onClick={() => setActiveVerifyObl(item)}
                      >
                        <CheckCircle size={12} />
                        <span>Verify</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {activeUploadObl && (
        <SubmitEvidenceModal
          isOpen={Boolean(activeUploadObl)}
          onClose={() => setActiveUploadObl(null)}
          obligation={activeUploadObl}
          onSubmit={(fileName, note) => {
            submitComplianceEvidence(activeUploadObl.id, fileName, note);
          }}
        />
      )}

      {/* Verify Modal */}
      {activeVerifyObl && (
        <VerifyEvidenceModal
          isOpen={Boolean(activeVerifyObl)}
          onClose={() => setActiveVerifyObl(null)}
          obligation={activeVerifyObl}
          onVerify={(decision, feedback) => {
            reviewComplianceEvidence(activeVerifyObl.id, decision, feedback);
          }}
        />
      )}

      {/* Inspection Drawer per PRD 8.11 & 9.4 */}
      <Drawer
        isOpen={Boolean(drawerObl)}
        onClose={() => setDrawerObl(null)}
        title={drawerObl ? `${drawerObl.id} — Compliance Dossier` : ''}
        subtitle={drawerObl?.institutionName}
      >
        {drawerObl && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                FULL STATUTORY CONDITION
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.6, marginTop: '4px', background: '#F8FAFC', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
                {drawerObl.conditionText}
              </div>
            </div>

            <dl style={{ display: 'grid', gridTemplateColumns: '130px 1fr', rowGap: '8px', fontSize: '12.5px' }}>
              <dt style={{ color: 'var(--color-text-muted)' }}>Application Ref:</dt>
              <dd style={{ fontWeight: 600 }}>{drawerObl.applicationRef}</dd>

              <dt style={{ color: 'var(--color-text-muted)' }}>Due Date:</dt>
              <dd style={{ fontWeight: 600 }}>{drawerObl.dueDate}</dd>

              <dt style={{ color: 'var(--color-text-muted)' }}>Submission Status:</dt>
              <dd><StatusBadge status={drawerObl.submissionStatus} /></dd>

              <dt style={{ color: 'var(--color-text-muted)' }}>Reviewer Officer:</dt>
              <dd>{drawerObl.assignedReviewer}</dd>
            </dl>

            {drawerObl.submittedFile && (
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  ATTACHED EVIDENCE FILE
                </div>
                <div style={{ padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#F8FAFC' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>{drawerObl.submittedFile.name}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Uploaded on {drawerObl.submittedFile.submittedAt} ({drawerObl.submittedFile.size})
                  </div>
                  <div style={{ fontSize: '12px', fontStyle: 'italic', marginTop: '6px' }}>
                    Declaration: "{drawerObl.submittedFile.note}"
                  </div>
                </div>
              </div>
            )}

            {drawerObl.rejectionReason && (
              <div style={{ padding: '12px', background: 'var(--color-red-bg)', border: '1px solid var(--color-red-border)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-red-text)' }}>
                  DEFICIENCY / CORRECTION REASON:
                </div>
                <div style={{ fontSize: '12.5px', marginTop: '4px', color: 'var(--color-text-main)' }}>
                  {drawerObl.rejectionReason}
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '8px' }}>
                EVIDENCE LIFECYCLE AUDIT TRAIL
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {drawerObl.history.map((h, i) => (
                  <div key={i} style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 'var(--radius-xs)', fontSize: '12px', borderLeft: '3px solid var(--color-gov-blue)' }}>
                    <div style={{ fontWeight: 600 }}>{h.action}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      by {h.actor} • {h.timestamp}
                    </div>
                    {h.note && <div style={{ fontSize: '11.5px', marginTop: '2px', fontStyle: 'italic' }}>{h.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
