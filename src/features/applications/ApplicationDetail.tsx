import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';
import { Breadcrumbs } from '../../components/shell/Breadcrumbs';
import { TransitionModal } from './TransitionModal';
import { ReturnDeficiencyModal } from './ReturnDeficiencyModal';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  FileText,
  User,
  Shield,
  Upload,
  AlertOctagon,
  ExternalLink,
  ChevronRight,
  FileCheck,
} from 'lucide-react';

export const ApplicationDetail: React.FC = () => {
  const {
    selectedAppId,
    setSelectedAppId,
    applications,
    currentUser,
    transitionApplication,
    returnApplicationForDeficiency,
    respondToDeficiency,
    compliance,
    documents,
    obligations,
    auditLogs,
    setActiveRoutePath,
  } = useApp();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'overview' | 'workflow' | 'documents' | 'obligations' | 'audit'>('overview');
  const [isTransitionOpen, setIsTransitionOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [responseNote, setResponseNote] = useState('');
  const [isRespondingDeficiency, setIsRespondingDeficiency] = useState(false);

  const app = applications.find((a) => a.id === selectedAppId);

  if (!app) {
    return (
      <div style={{ padding: '24px' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setSelectedAppId(null)}
        >
          <ArrowLeft size={14} />
          <span>Back to Applications</span>
        </button>
        <div style={{ marginTop: '20px', color: 'var(--color-red-text)' }}>
          Application record not found.
        </div>
      </div>
    );
  }

  // Linked items
  const linkedCompliance = compliance.filter((c) => c.applicationRef === app.id);
  const linkedDocuments = documents.filter((d) => d.applicationRef === app.id);
  const linkedObligations = obligations.filter((o) => o.linkedCase === app.id);
  const linkedAudit = auditLogs.filter((ev) => ev.affectedRecord.includes(app.id));

  // Determine permitted actions based on role and state per PRD 4.2 & 8.9
  const isOfficer = currentUser.role === 'regional_officer' || currentUser.role === 'bureau_officer' || currentUser.role === 'admin';
  const isInstitution = currentUser.role === 'institution';
  const isConcluded = app.status === 'Approved' || app.status === 'Rejected';

  const handleDeficiencyResponse = () => {
    if (!responseNote.trim()) {
      alert('Please enter your rectification response note before submitting.');
      return;
    }
    respondToDeficiency(app.id, responseNote);
    setIsRespondingDeficiency(false);
    setResponseNote('');
    alert('Deficiency response submitted. Application returned to Regional Scrutiny Review queue.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Breadcrumbs */}
      <div>
        <Breadcrumbs
          items={[
            { label: 'Applications', onClick: () => setSelectedAppId(null) },
            { label: `${app.id} (${app.institutionName})` },
          ]}
        />
      </div>

      {/* Header Block per PRD 8.9 & 19.3 wireframe */}
      <div
        className="gov-card"
        style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--color-primary-navy)',
                letterSpacing: '-0.01em',
              }}
            >
              {app.id}
            </span>
            <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-main)' }}>
              {app.institutionName}
            </span>
            <StatusBadge status={app.status} />
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px',
              marginTop: '6px',
              fontSize: '13px',
              color: 'var(--color-text-muted)',
            }}
          >
            <span>
              <strong>Type:</strong> {app.applicationType}
            </span>
            <span>•</span>
            <span>
              <strong>Route:</strong> {app.route}
            </span>
            <span>•</span>
            <span>
              <strong>Current Stage:</strong> <span style={{ color: 'var(--color-gov-blue)', fontWeight: 600 }}>{app.currentStage}</span>
            </span>
            <span>•</span>
            <span>
              <strong>Rule Version:</strong> <code style={{ background: '#EEF2F6', padding: '1px 5px', borderRadius: '3px' }}>{app.ruleVersion}</code>
            </span>
          </div>
        </div>

        {/* Primary Action Callout Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setSelectedAppId(null)}
          >
            <ArrowLeft size={14} />
            <span>Back to Queue</span>
          </button>

          {isOfficer && !isConcluded && app.status !== 'Returned' && (
            <>
              <button
                type="button"
                className="btn btn-danger-outline btn-sm"
                onClick={() => setIsReturnOpen(true)}
              >
                <RotateCcw size={14} />
                <span>Return for Correction</span>
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setIsTransitionOpen(true)}
              >
                <CheckCircle2 size={14} />
                <span>Transition Stage</span>
              </button>
            </>
          )}

          {isInstitution && app.status === 'Returned' && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => setIsRespondingDeficiency(true)}
            >
              <RotateCcw size={14} />
              <span>Respond to Deficiency Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* Next Action Callout Panel per PRD 19.3 Wireframe */}
      <div
        style={{
          background: app.status === 'Returned' ? 'var(--color-red-bg)' : '#FFFFFF',
          border: `1px solid ${app.status === 'Returned' ? 'var(--color-red-border)' : 'var(--color-border)'}`,
          borderLeft: `5px solid ${app.status === 'Returned' ? 'var(--color-red-text)' : 'var(--color-gov-blue)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: app.status === 'Returned' ? 'var(--color-red-text)' : 'var(--color-gov-blue)',
            }}
          >
            NEXT REQUIRED ACTION
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-navy)', marginTop: '2px' }}>
            {app.status === 'Returned'
              ? `Institutional Rectification Response (${app.deficiencyReason || 'Required statutory documents'})`
              : app.currentStage === 'Scrutiny'
              ? 'Complete Academic Credentials Scrutiny & Forward'
              : app.currentStage === 'EVC'
              ? 'Confirm Expert Visit Committee (EVC) Schedule & Dates'
              : app.currentStage === 'Approved'
              ? 'All Stages Concluded — Final Order Dispatched'
              : `Review and Advance ${app.currentStage}`}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            <strong>Assigned Owner:</strong> {app.assignedOfficer} • <strong>Stage Age:</strong> {app.daysInStage} days elapsed
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary-navy)' }}>
            Deadline: {app.nextDeadline}
          </div>
          <div style={{ marginTop: '4px' }}>
            {app.status === 'Approved' ? (
              <span className="badge badge-green">Concluded</span>
            ) : app.status === 'Overdue' ? (
              <span className="badge badge-red">Overdue for Decision</span>
            ) : (
              <span className="badge badge-amber">Statutory SLA Active</span>
            )}
          </div>
        </div>
      </div>

      {/* Deficiency Response Inline Box if Institution */}
      {isRespondingDeficiency && (
        <div
          className="gov-card"
          style={{ border: '2px solid var(--color-red-text)', background: '#FFF8F8' }}
        >
          <h2 style={{ fontSize: '15px', color: 'var(--color-red-text)', marginBottom: '8px' }}>
            Submit Institutional Response to Deficiency Notice
          </h2>
          <p style={{ fontSize: '13px', marginBottom: '12px' }}>
            <strong>Deficiency Notice:</strong> {app.deficiencyReason}
          </p>

          <div className="form-group">
            <label className="form-label">Rectification Statement & Upload Notes *</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="State the rectified certificates uploaded, municipal NOC dispatch reference number, and confirmation of compliance..."
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsRespondingDeficiency(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleDeficiencyResponse}
            >
              Submit Response to Scrutiny Panel
            </button>
          </div>
        </div>
      )}

      {/* 5 Tabs per PRD 8.9 & 19.3 */}
      <div>
        <div className="tabs-header">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FileText size={15} />
            <span>Overview</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'workflow' ? 'active' : ''}`}
            onClick={() => setActiveTab('workflow')}
          >
            <Clock size={15} />
            <span>Workflow Timeline ({app.stages.length} Stages)</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <FileCheck size={15} />
            <span>Documents ({linkedDocuments.length})</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'obligations' ? 'active' : ''}`}
            onClick={() => setActiveTab('obligations')}
          >
            <AlertTriangle size={15} />
            <span>Obligations ({linkedObligations.length + linkedCompliance.length})</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            <Shield size={15} />
            <span>Activity & Audit ({linkedAudit.length})</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
            <div className="gov-card">
              <h2 style={{ fontSize: '15px', marginBottom: '14px' }}>Applicant & Institution Information</h2>
              <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: '10px', fontSize: '13px' }}>
                <dt style={{ color: 'var(--color-text-muted)' }}>Permanent ID (PID):</dt>
                <dd style={{ fontWeight: 600 }}>{app.institutionId}</dd>

                <dt style={{ color: 'var(--color-text-muted)' }}>Region Office:</dt>
                <dd style={{ fontWeight: 600 }}>{app.region} Region</dd>

                <dt style={{ color: 'var(--color-text-muted)' }}>Discipline / Course:</dt>
                <dd>{app.programme}</dd>

                <dt style={{ color: 'var(--color-text-muted)' }}>Intake Capacity:</dt>
                <dd className="num" style={{ fontWeight: 600 }}>{app.intakeProposed} seats</dd>

                <dt style={{ color: 'var(--color-text-muted)' }}>Authorized Signatory:</dt>
                <dd>{app.contactPerson}</dd>

                <dt style={{ color: 'var(--color-text-muted)' }}>Official Email:</dt>
                <dd>{app.contactEmail}</dd>

                <dt style={{ color: 'var(--color-text-muted)' }}>Phone Number:</dt>
                <dd>{app.contactPhone}</dd>
              </dl>
            </div>

            <div className="gov-card">
              <h2 style={{ fontSize: '15px', marginBottom: '14px' }}>Regulatory Route & Governance</h2>
              <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: '10px', fontSize: '13px' }}>
                <dt style={{ color: 'var(--color-text-muted)' }}>Approval Route:</dt>
                <dd>
                  <span className="badge badge-blue">{app.route}</span>
                </dd>

                <dt style={{ color: 'var(--color-text-muted)' }}>Handbook Rule:</dt>
                <dd style={{ fontWeight: 600 }}>{app.ruleVersion}</dd>

                <dt style={{ color: 'var(--color-text-muted)' }}>Current Owner:</dt>
                <dd>{app.assignedOfficer}</dd>

                <dt style={{ color: 'var(--color-text-muted)' }}>Last Action Commited:</dt>
                <dd>{app.lastUpdated}</dd>

                <dt style={{ color: 'var(--color-text-muted)' }}>Active Blockers:</dt>
                <dd>
                  {app.blockers && app.blockers.length > 0 ? (
                    <span style={{ color: 'var(--color-red-text)', fontWeight: 600 }}>
                      {app.blockers.join(', ')}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-green-text)' }}>No active procedural blockers</span>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        )}

        {/* Tab 2: Workflow Timeline (Configured Route Stages ONLY per PRD 8.9 & 19.3) */}
        {activeTab === 'workflow' && (
          <div className="gov-card">
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px' }}>Configured Approval Route Sequence: {app.route}</h2>
              <p className="subtitle">
                Only statutory stages applicable to route <em>{app.route}</em> under Rule {app.ruleVersion} are rendered.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
              {app.stages.map((st, idx) => {
                const isCompleted = st.status === 'completed';
                const isInProgress = st.status === 'in_progress';
                const isReturned = st.status === 'returned';

                return (
                  <div
                    key={st.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      position: 'relative',
                    }}
                  >
                    {/* State Icon */}
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isCompleted
                          ? 'var(--color-green-bg)'
                          : isInProgress
                          ? 'var(--color-gov-blue-subtle)'
                          : isReturned
                          ? 'var(--color-red-bg)'
                          : '#F2F4F7',
                        color: isCompleted
                          ? 'var(--color-green-text)'
                          : isInProgress
                          ? 'var(--color-gov-blue)'
                          : isReturned
                          ? 'var(--color-red-text)'
                          : 'var(--color-text-light)',
                        border: `2px solid ${
                          isCompleted
                            ? 'var(--color-green-border)'
                            : isInProgress
                            ? 'var(--color-gov-blue)'
                            : isReturned
                            ? 'var(--color-red-border)'
                            : 'var(--color-neutral-border)'
                        }`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                        fontWeight: 700,
                        fontSize: '12px',
                      }}
                    >
                      {isCompleted ? '✓' : isReturned ? '✕' : isInProgress ? '●' : idx + 1}
                    </div>

                    {/* Stage Details */}
                    <div
                      style={{
                        flex: 1,
                        paddingBottom: '16px',
                        borderBottom:
                          idx < app.stages.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: isInProgress ? 700 : 600 }}>
                          {st.label}
                        </div>
                        <StatusBadge status={st.status} />
                      </div>

                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Responsible Authority: <strong>{st.roleResponsible}</strong> • Prescribed SLA: {st.slaDays} days
                      </div>

                      {st.completedAt && (
                        <div style={{ fontSize: '11.5px', color: 'var(--color-green-text)', marginTop: '4px' }}>
                          Completed on: {st.completedAt}
                        </div>
                      )}

                      {st.notes && (
                        <div
                          style={{
                            fontSize: '12px',
                            background: isReturned ? 'var(--color-red-bg)' : '#F8FAFC',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: `1px solid ${isReturned ? 'var(--color-red-border)' : 'var(--color-border-subtle)'}`,
                            marginTop: '8px',
                            color: isReturned ? 'var(--color-red-text)' : 'var(--color-text-main)',
                          }}
                        >
                          <strong>{isReturned ? 'Deficiency Returned Note:' : 'Observation:'}</strong> {st.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Documents & Renewals */}
        {activeTab === 'documents' && (
          <div className="gov-card">
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Statutory Documents & Clearances</h2>
            <div className="gov-table-container">
              <table className="gov-table" aria-label="Application documents">
                <thead>
                  <tr>
                    <th scope="col">Document Type</th>
                    <th scope="col">Expiry Date</th>
                    <th scope="col">Days Remaining</th>
                    <th scope="col">Status</th>
                    <th scope="col">Reviewer</th>
                    <th scope="col" style={{ textAlign: 'right' }}>OCR Extraction</th>
                  </tr>
                </thead>
                <tbody>
                  {linkedDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td style={{ fontWeight: 600 }}>{doc.documentType}</td>
                      <td>{doc.expiryDate}</td>
                      <td>
                        <UrgencyBadge days={doc.daysUntilExpiry} />
                      </td>
                      <td>
                        <StatusBadge status={doc.status} />
                      </td>
                      <td>{doc.reviewer}</td>
                      <td style={{ textAlign: 'right' }}>
                        {doc.ocrData ? (
                          <button
                            type="button"
                            className="btn btn-secondary btn-xs"
                            onClick={() => setActiveRoutePath('/documents')}
                          >
                            <span>Inspect OCR ({doc.ocrData.confidence}%)</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>Verified File</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {linkedDocuments.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>
                        No separate document expirations tracked for this application.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Obligations */}
        {activeTab === 'obligations' && (
          <div className="gov-card">
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Active Procedural Obligations</h2>
            <div className="gov-table-container">
              <table className="gov-table" aria-label="Application obligations">
                <thead>
                  <tr>
                    <th scope="col">Obligation ID</th>
                    <th scope="col">Title</th>
                    <th scope="col">Type</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {linkedObligations.map((obl) => (
                    <tr key={obl.id}>
                      <td style={{ fontWeight: 600 }}>{obl.id}</td>
                      <td>{obl.title}</td>
                      <td>
                        <span className="badge badge-neutral">{obl.type}</span>
                      </td>
                      <td>{obl.dueDate}</td>
                      <td>
                        <StatusBadge status={obl.status} />
                      </td>
                      <td>{obl.owner}</td>
                    </tr>
                  ))}
                  {linkedCompliance.map((comp) => (
                    <tr key={comp.id}>
                      <td style={{ fontWeight: 600 }}>{comp.id}</td>
                      <td>{comp.title}</td>
                      <td>
                        <span className="badge badge-neutral">Compliance Condition</span>
                      </td>
                      <td>{comp.dueDate}</td>
                      <td>
                        <StatusBadge status={comp.submissionStatus} />
                      </td>
                      <td>{comp.assignedReviewer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Activity & Audit */}
        {activeTab === 'audit' && (
          <div className="gov-card">
            <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>Application Event Log & Audit Trail</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {linkedAudit.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    padding: '12px 14px',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    background: '#F8FAFC',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary-navy)' }}>
                      {ev.action.replace(/_/g, ' ')}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                      {ev.timestamp}
                    </div>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--color-text-main)', marginTop: '4px' }}>
                    Actor: <strong>{ev.actor}</strong> ({ev.actorRole})
                  </div>
                  {ev.reason && (
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                      Reason: "{ev.reason}"
                    </div>
                  )}
                  <div style={{ fontSize: '10.5px', color: 'var(--color-text-light)', marginTop: '6px', fontFamily: 'monospace' }}>
                    Block Hash: {ev.currentHash.substring(0, 32)}... [SHA-256 Validated]
                  </div>
                </div>
              ))}
              {linkedAudit.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                  No historical events logged yet for this application.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Transition Modal */}
      <TransitionModal
        isOpen={isTransitionOpen}
        onClose={() => setIsTransitionOpen(false)}
        application={app}
        onConfirm={(targetStage, notes) => {
          transitionApplication(app.id, targetStage, notes);
        }}
      />

      {/* Return for Deficiency Modal */}
      <ReturnDeficiencyModal
        isOpen={isReturnOpen}
        onClose={() => setIsReturnOpen(false)}
        application={app}
        onConfirm={(reason, deadline) => {
          returnApplicationForDeficiency(app.id, reason, deadline);
        }}
      />
    </div>
  );
};
