import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  BarChart3,
  Printer,
  Download,
  Calendar,
  Layers,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { applications, obligations, evcSchedules, compliance, documents } = useApp();
  const { t } = useLanguage();

  const [activeReport, setActiveReport] = useState<
    'pendency' | 'ageing' | 'evc' | 'compliance' | 'documents'
  >('pendency');

  const [dateRange, setDateRange] = useState('Academic Year 2026–27');
  const nowStr = '21 Oct 2026, 23:45 IST';

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Report Category,Entity,Metric Value,Denominator,Percentage,Remarks'];
    let rows: string[] = [];

    if (activeReport === 'pendency') {
      rows = ['North,12,18,66.7%,In Progress', 'South,8,14,57.1%,In Progress', 'West,15,22,68.2%,In Progress'];
    } else {
      rows = ['Sample Row 1,10,20,50%,Report Metrics Export'];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NIGRANI_Report_${activeReport}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations
  const totalApps = applications.length;
  const openApps = applications.filter((a) => a.status !== 'Approved' && a.status !== 'Rejected').length;
  const approvedApps = applications.filter((a) => a.status === 'Approved').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <BarChart3 size={22} color="var(--color-gov-blue)" />
            <h1>{t('nav.reports')}</h1>
          </div>
          <p className="subtitle">
            Executive oversight dossiers, regional pendency analytics, and verifiable compliance rate reporting.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <Download size={14} />
            <span>{t('common.export_csv')}</span>
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handlePrint}>
            <Printer size={14} />
            <span>{t('common.print')}</span>
          </button>
        </div>
      </div>

      {/* Report Navigation Tabs */}
      <div className="tabs-header">
        <button
          type="button"
          className={`tab-btn ${activeReport === 'pendency' ? 'active' : ''}`}
          onClick={() => setActiveReport('pendency')}
        >
          <span>Application Pendency by Stage</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeReport === 'ageing' ? 'active' : ''}`}
          onClick={() => setActiveReport('ageing')}
        >
          <span>Ageing Analysis (0–31+ Days)</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeReport === 'evc' ? 'active' : ''}`}
          onClick={() => setActiveReport('evc')}
        >
          <span>EVC Inspection Performance</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeReport === 'compliance' ? 'active' : ''}`}
          onClick={() => setActiveReport('compliance')}
        >
          <span>Undertakings & Conditions</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeReport === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveReport('documents')}
        >
          <span>Document Validity Risk</span>
        </button>
      </div>

      {/* Report Header Metadata Banner per PRD 8.15 */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '12.5px',
          color: 'var(--color-text-muted)',
        }}
      >
        <div>
          <strong>Report Title:</strong>{' '}
          {activeReport === 'pendency'
            ? 'Application Stage Pendency & Workflow Trajectory'
            : activeReport === 'ageing'
            ? 'Cumulative Dossier Ageing Distribution'
            : activeReport === 'evc'
            ? 'EVC Panel Scheduling & Report Receipt Cadence'
            : activeReport === 'compliance'
            ? 'Mandatory Undertaking Compliance & Verification Ratio'
            : 'Statutory Document Expiry & Land Title Forecast'}
        </div>
        <div>
          <strong>Generated:</strong> {nowStr} • <strong>Scope:</strong> {dateRange}
        </div>
      </div>

      {/* Report Content 1: Pendency */}
      {activeReport === 'pendency' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="gov-card">
            <h2 style={{ fontSize: '15px', marginBottom: '8px' }}>Stage-wise Processing Load</h2>
            <p className="subtitle" style={{ marginBottom: '14px' }}>
              Distribution of active applications across statutory stages. All rates state exact denominators per PRD 8.15.
            </p>

            <div className="gov-table-container">
              <table className="gov-table" aria-label="Stage-wise processing load">
                <thead>
                  <tr>
                    <th scope="col">Workflow Stage</th>
                    <th scope="col">Applications Count</th>
                    <th scope="col">Denominator (Total Open)</th>
                    <th scope="col">Share of Pendency</th>
                    <th scope="col">Statutory Prescribed SLA</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { stage: 'Scrutiny Committee Review', count: applications.filter((a) => a.currentStage.includes('Scrutiny')).length, sla: '14 Days' },
                    { stage: 'EVC Scheduling & Visit', count: applications.filter((a) => a.currentStage.includes('EVC')).length, sla: '14 Days' },
                    { stage: 'Deficiency Response (Institution)', count: applications.filter((a) => a.status === 'Returned').length, sla: '7 Days' },
                    { stage: 'Standing Appeals Committee (SAC)', count: applications.filter((a) => a.currentStage.includes('SAC')).length, sla: '10 Days' },
                    { stage: 'Bureau Verification & Approval', count: applications.filter((a) => a.currentStage.includes('Bureau') || a.currentStage.includes('Approved')).length, sla: '7 Days' },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{row.stage}</td>
                      <td className="num-cell" style={{ fontWeight: 700 }}>{row.count}</td>
                      <td className="num-cell">{openApps} open cases</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, width: '45px' }}>
                            {Math.round((row.count / (openApps || 1)) * 100)}%
                          </span>
                          <div style={{ width: '120px', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${(row.count / (openApps || 1)) * 100}%`, height: '100%', background: 'var(--color-gov-blue)' }} />
                          </div>
                        </div>
                      </td>
                      <td>{row.sla}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Report Content 2: Ageing Analysis */}
      {activeReport === 'ageing' && (
        <div className="gov-card">
          <h2 style={{ fontSize: '15px', marginBottom: '8px' }}>Cumulative Dossier Ageing Bands</h2>
          <p className="subtitle" style={{ marginBottom: '14px' }}>
            Analysis of days spent in current statutory phase against Approval Process Handbook thresholds.
          </p>

          <div className="gov-table-container">
            <table className="gov-table" aria-label="Ageing analysis table">
              <thead>
                <tr>
                  <th scope="col">Ageing Band</th>
                  <th scope="col">Active Applications</th>
                  <th scope="col">Percentage of Workload</th>
                  <th scope="col">Actionable Regulatory Consequence</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>0–7 Days (Normal Velocity)</td>
                  <td className="num-cell">{applications.filter((a) => a.daysInStage <= 7 && a.status !== 'Approved').length}</td>
                  <td>{Math.round((applications.filter((a) => a.daysInStage <= 7 && a.status !== 'Approved').length / (openApps || 1)) * 100)}%</td>
                  <td>Routine scrutiny; within standard processing parameters.</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>8–15 Days (Mid-Turnaround)</td>
                  <td className="num-cell">{applications.filter((a) => a.daysInStage >= 8 && a.daysInStage <= 15 && a.status !== 'Approved').length}</td>
                  <td>{Math.round((applications.filter((a) => a.daysInStage >= 8 && a.daysInStage <= 15 && a.status !== 'Approved').length / (openApps || 1)) * 100)}%</td>
                  <td>Advance reminder dispatched to scrutiny panel.</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>16–30 Days (Stage Overrun)</td>
                  <td className="num-cell">{applications.filter((a) => a.daysInStage >= 16 && a.daysInStage <= 30 && a.status !== 'Approved').length}</td>
                  <td>{Math.round((applications.filter((a) => a.daysInStage >= 16 && a.daysInStage <= 30 && a.status !== 'Approved').length / (openApps || 1)) * 100)}%</td>
                  <td>Level 1 Escalation: Regional Officer personal docket.</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, color: 'var(--color-red-text)' }}>31+ Days (Critical Pendency)</td>
                  <td className="num-cell" style={{ color: 'var(--color-red-text)', fontWeight: 700 }}>
                    {applications.filter((a) => a.daysInStage >= 31 && a.status !== 'Approved').length}
                  </td>
                  <td>{Math.round((applications.filter((a) => a.daysInStage >= 31 && a.status !== 'Approved').length / (openApps || 1)) * 100)}%</td>
                  <td>Level 2 / Level 3 Escalation to Bureau Advisor / Member Secretary.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Content 3: EVC Performance */}
      {activeReport === 'evc' && (
        <div className="gov-card">
          <h2 style={{ fontSize: '15px', marginBottom: '8px' }}>EVC Panel Execution Cadence</h2>
          <p className="subtitle" style={{ marginBottom: '14px' }}>
            Tracking of on-site Expert Visit Committees from proposal to final observation report upload.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Total EVC Quota</div>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>{evcSchedules.length}</div>
            </div>
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Confirmed / Scheduled</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-green-text)' }}>
                {evcSchedules.filter((e) => e.status === 'Scheduled' || e.status === 'Visit completed').length}
              </div>
            </div>
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Awaiting Panel Fixation</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-amber-text)' }}>
                {evcSchedules.filter((e) => e.status === 'Awaiting scheduling' || e.status === 'Proposed').length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Content 4: Compliance */}
      {activeReport === 'compliance' && (
        <div className="gov-card">
          <h2 style={{ fontSize: '15px', marginBottom: '8px' }}>Institutional Undertaking Compliance Ratio</h2>
          <p className="subtitle" style={{ marginBottom: '14px' }}>
            Compliance fulfillment rate across mandatory statutory categories (7th CPC, anti-ragging, fire clearances).
          </p>

          <div className="gov-table-container">
            <table className="gov-table" aria-label="Compliance ratio table">
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Conditions Tracked</th>
                  <th scope="col">Verified & Complied</th>
                  <th scope="col">Under Scrutiny</th>
                  <th scope="col">Pending Submission</th>
                </tr>
              </thead>
              <tbody>
                {['Faculty', 'Safety', 'Grievance', 'Affidavit', 'Land'].map((cat) => {
                  const match = compliance.filter((c) => c.category === cat);
                  const verified = match.filter((c) => c.verificationStatus === 'Verified').length;
                  const underReview = match.filter((c) => c.submissionStatus === 'Under review' || c.submissionStatus === 'Submitted').length;
                  const pending = match.filter((c) => c.submissionStatus === 'Not submitted' || c.submissionStatus === 'Rejected — correction required').length;

                  return (
                    <tr key={cat}>
                      <td style={{ fontWeight: 600 }}>{cat} Compliance</td>
                      <td className="num-cell">{match.length}</td>
                      <td className="num-cell" style={{ color: 'var(--color-green-text)', fontWeight: 600 }}>{verified}</td>
                      <td className="num-cell" style={{ color: 'var(--color-gov-blue)' }}>{underReview}</td>
                      <td className="num-cell" style={{ color: pending > 0 ? 'var(--color-red-text)' : 'inherit' }}>{pending}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Content 5: Documents */}
      {activeReport === 'documents' && (
        <div className="gov-card">
          <h2 style={{ fontSize: '15px', marginBottom: '8px' }}>Statutory Document Expiry Risk Forecast</h2>
          <p className="subtitle" style={{ marginBottom: '14px' }}>
            Forecasting land titles, lease deeds, building certificates, and fire NOCs approaching validity cessation.
          </p>

          <div className="gov-table-container">
            <table className="gov-table" aria-label="Document expiry risk table">
              <thead>
                <tr>
                  <th scope="col">Validity Horizon</th>
                  <th scope="col">Affected Documents</th>
                  <th scope="col">Statutory Risk Classification</th>
                  <th scope="col">Prescribed Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>Already Expired</td>
                  <td className="num-cell" style={{ color: 'var(--color-red-text)', fontWeight: 700 }}>
                    {documents.filter((d) => d.status === 'Expired').length}
                  </td>
                  <td><span className="badge badge-red">Statutory Halt</span></td>
                  <td>Withhold EoA extension until renewed endorsement uploaded.</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Expiring in 0–30 Days</td>
                  <td className="num-cell" style={{ color: 'var(--color-amber-text)', fontWeight: 700 }}>
                    {documents.filter((d) => d.status === 'Due soon').length}
                  </td>
                  <td><span className="badge badge-amber">Advance Warning</span></td>
                  <td>Automated 30-day registered notification served to Registrar.</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Valid (&gt;30 Days)</td>
                  <td className="num-cell" style={{ color: 'var(--color-green-text)', fontWeight: 700 }}>
                    {documents.filter((d) => d.status === 'Valid').length}
                  </td>
                  <td><span className="badge badge-green">Compliant</span></td>
                  <td>Active valid status; continuous monitoring.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
