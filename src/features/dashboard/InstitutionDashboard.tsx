import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';
import {
  AlertTriangle,
  Upload,
  FileText,
  Clock,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  Building2,
  Calendar,
} from 'lucide-react';

export const InstitutionDashboard: React.FC = () => {
  const {
    currentUser,
    applications,
    compliance,
    documents,
    obligations,
    setSelectedAppId,
    setActiveRoutePath,
  } = useApp();
  const { t } = useLanguage();

  const instName = currentUser.institutionName || 'North Valley Institute of Technology';

  // Scope to institution's own data only per PRD 4.2 & Journey F
  const myApps = applications.filter((a) => a.institutionName === instName);
  const myCompliance = compliance.filter((c) => c.institutionName === instName);
  const myDocs = documents.filter((d) => d.institutionName === instName);
  const myObligations = obligations.filter((o) => o.institution === instName);

  const appsInProgressCount = myApps.filter((a) => a.status === 'In Progress' || a.status === 'Due Soon').length;
  const actionsRequiredCount = myApps.filter((a) => a.status === 'Returned').length + myCompliance.filter((c) => c.submissionStatus === 'Not submitted' || c.submissionStatus === 'Rejected — correction required').length;
  const obligationsDueSoonCount = myObligations.filter((o) => o.status === 'Due soon').length;
  const overdueCount = myObligations.filter((o) => o.status === 'Overdue').length;

  // Has active deficiency notice?
  const returnedApp = myApps.find((a) => a.status === 'Returned');

  const handleOpenApp = (id: string) => {
    setSelectedAppId(id);
    setActiveRoutePath('/applications');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Institution Banner & Welcome */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-gov-blue-subtle)',
              color: 'var(--color-gov-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-gov-blue)', textTransform: 'uppercase' }}>
              Institution Portal Scope
            </div>
            <h1 style={{ fontSize: '20px' }}>{instName}</h1>
            <p className="subtitle">
              PID: {currentUser.institutionId || 'AICTE-1-492810'} • Authorized Signatory: {currentUser.name}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveRoutePath('/compliance')}
        >
          <Upload size={14} />
          <span>Upload Evidence</span>
        </button>
      </div>

      {/* Deficiency Alert Banner if applicable per PRD 8.3 & Journey B */}
      {returnedApp && (
        <div
          style={{
            background: 'var(--color-red-bg)',
            border: '1px solid var(--color-red-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
          }}
        >
          <div style={{ color: 'var(--color-red-text)', marginTop: '2px' }}>
            <AlertTriangle size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-red-text)' }}>
              Deficiency Notice Pending Institutional Rectification — {returnedApp.id}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-main)', marginTop: '4px' }}>
              <strong>Recorded Deficiency:</strong> {returnedApp.deficiencyReason || 'Missing required statutory clearance documents.'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-red-text)' }}>
                Response Due: {returnedApp.deficiencyDeadline || '27 Oct 2026'}
              </span>
              <button
                type="button"
                className="btn btn-danger btn-xs"
                onClick={() => handleOpenApp(returnedApp.id)}
              >
                Respond to Deficiency →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top 4 Metrics per PRD 8.3 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
        }}
      >
        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-gov-blue)' }}>
          <div className="metric-tile-title">Applications In Progress</div>
          <div className="metric-tile-value">{appsInProgressCount}</div>
          <div className="metric-tile-sub">Active in statutory approval workflow</div>
        </div>

        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-red-text)' }}>
          <div className="metric-tile-title">Actions Required</div>
          <div className="metric-tile-value" style={{ color: 'var(--color-red-text)' }}>
            {actionsRequiredCount}
          </div>
          <div className="metric-tile-sub">Deficiencies or pending submissions</div>
        </div>

        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-amber-text)' }}>
          <div className="metric-tile-title">Obligations Due Soon</div>
          <div className="metric-tile-value" style={{ color: 'var(--color-amber-text)' }}>
            {obligationsDueSoonCount}
          </div>
          <div className="metric-tile-sub">Due in next 7 calendar days</div>
        </div>

        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-green-text)' }}>
          <div className="metric-tile-title">Overdue Submissions</div>
          <div className="metric-tile-value" style={{ color: overdueCount > 0 ? 'var(--color-red-text)' : 'var(--color-green-text)' }}>
            {overdueCount}
          </div>
          <div className="metric-tile-sub">{overdueCount > 0 ? 'Requires immediate action' : 'Zero overdue filings'}</div>
        </div>
      </div>

      {/* Action Required Table per PRD 8.3 */}
      <div className="gov-card">
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '16px' }}>Action Required — Immediate Attention</h2>
          <p className="subtitle">Outstanding evidence, undertakings, and regulatory deficiency replies</p>
        </div>

        <div className="gov-table-container">
          <table className="gov-table" aria-label="Action required items">
            <thead>
              <tr>
                <th scope="col">Requirement Item</th>
                <th scope="col">Application Ref</th>
                <th scope="col">Category</th>
                <th scope="col">Due Date</th>
                <th scope="col">Status</th>
                <th scope="col" style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {myCompliance.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                      {item.conditionText.substring(0, 90)}...
                    </div>
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
                    <span className="badge badge-neutral">{item.category}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.dueDate}</div>
                  </td>
                  <td>
                    <StatusBadge status={item.submissionStatus} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs"
                      onClick={() => setActiveRoutePath('/compliance')}
                    >
                      <span>{item.submissionStatus === 'Not submitted' ? 'Submit' : 'View'}</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Columns: My Applications & Recently Submitted Evidence */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '18px',
        }}
      >
        {/* Applications Status List */}
        <div className="gov-card">
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '15px' }}>My Applications</h2>
              <p className="subtitle">Current processing stages and ownership</p>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={() => setActiveRoutePath('/applications')}
            >
              All Apps →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myApps.map((app) => (
              <div
                key={app.id}
                style={{
                  padding: '12px',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-surface-hover)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenApp(app.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-gov-blue)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '13.5px',
                      }}
                    >
                      {app.id}
                    </button>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      • {app.applicationType}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '4px', color: 'var(--color-text-main)' }}>
                    Current Stage: <strong>{app.currentStage}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-light)', marginTop: '2px' }}>
                    Last update: {app.lastUpdated} • Owner: {app.assignedOfficer}
                  </div>
                </div>

                <div>
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Submitted Evidence */}
        <div className="gov-card">
          <div style={{ marginBottom: '14px' }}>
            <h2 style={{ fontSize: '15px' }}>Recently Submitted Evidence</h2>
            <p className="subtitle">Files uploaded awaiting verification by AICTE Scrutiny Officers</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myCompliance.filter((c) => c.submittedFile).map((comp) => (
              <div
                key={comp.id}
                style={{
                  padding: '12px',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  background: '#F8FAFC',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{comp.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      File: {comp.submittedFile?.name} ({comp.submittedFile?.size})
                    </div>
                  </div>
                  <StatusBadge status={comp.submissionStatus} />
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--color-text-light)', marginTop: '6px' }}>
                  Submitted on {comp.submittedFile?.submittedAt} • Assigned to: {comp.assignedReviewer}
                </div>
              </div>
            ))}
            {myCompliance.filter((c) => c.submittedFile).length === 0 && (
              <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', textAlign: 'center', padding: '24px 0' }}>
                No recent submissions uploaded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
