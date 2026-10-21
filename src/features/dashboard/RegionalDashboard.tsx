import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';
import {
  AlertTriangle,
  Clock,
  Calendar,
  FileText,
  ArrowRight,
  Filter,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export const RegionalDashboard: React.FC = () => {
  const {
    currentUser,
    applications,
    evcSchedules,
    obligations,
    auditLogs,
    setActiveRoutePath,
    setSelectedAppId,
  } = useApp();
  const { t } = useLanguage();

  const [selectedRegion, setSelectedRegion] = useState<string>(
    currentUser.regionScope === 'All' ? 'All' : currentUser.regionScope
  );
  const [dateFilter, setDateFilter] = useState<string>('30');

  // Filter applications by region
  const regionFilteredApps =
    selectedRegion === 'All'
      ? applications
      : applications.filter((a) => a.region === selectedRegion);

  const openCasesCount = regionFilteredApps.filter(
    (a) => a.status !== 'Approved' && a.status !== 'Rejected'
  ).length;

  const dueSoonCount = regionFilteredApps.filter(
    (a) => a.status === 'Due Soon' || (a.daysInStage >= 10 && a.status !== 'Approved')
  ).length;

  const overdueCount = regionFilteredApps.filter(
    (a) => a.status === 'Overdue' || a.status === 'Returned'
  ).length;

  const evcPendingCount = evcSchedules.filter(
    (e) =>
      (selectedRegion === 'All' || e.region === selectedRegion) &&
      (e.status === 'Awaiting scheduling' || e.status === 'Proposed')
  ).length;

  // Ageing bands per PRD 8.4: 0-7, 8-15, 16-30, 31+ days
  const band0_7 = regionFilteredApps.filter((a) => a.daysInStage <= 7 && a.status !== 'Approved').length;
  const band8_15 = regionFilteredApps.filter((a) => a.daysInStage >= 8 && a.daysInStage <= 15 && a.status !== 'Approved').length;
  const band16_30 = regionFilteredApps.filter((a) => a.daysInStage >= 16 && a.daysInStage <= 30 && a.status !== 'Approved').length;
  const band31_plus = regionFilteredApps.filter((a) => a.daysInStage >= 31 && a.status !== 'Approved').length;

  // Priority queue sorted by urgency
  const priorityQueue = [...regionFilteredApps]
    .filter((a) => a.status !== 'Approved')
    .sort((a, b) => {
      const getWeight = (status: string) => {
        if (status === 'Overdue' || status === 'Returned') return 1;
        if (status === 'Due Soon') return 2;
        return 3;
      };
      return getWeight(a.status) - getWeight(b.status) || b.daysInStage - a.daysInStage;
    })
    .slice(0, 5);

  const handleOpenApp = (appId: string) => {
    setSelectedAppId(appId);
    setActiveRoutePath('/applications');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title & Filter Bar per PRD 19.1 */}
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
          <h1>{t('nav.overview')}</h1>
          <p className="subtitle">
            Cases and obligations requiring attention in your authorised regional jurisdiction ({currentUser.regionScope} Region).
          </p>
        </div>

        {/* Global Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              Region:
            </span>
            <select
              className="form-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{ height: '32px', fontSize: '12.5px', padding: '0 8px' }}
            >
              <option value="All">All Permitted</option>
              <option value="North">North Region</option>
              <option value="South">South Region</option>
              <option value="West">West Region</option>
              <option value="East">East Region</option>
              <option value="Central">Central Region</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              Period:
            </span>
            <select
              className="form-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ height: '32px', fontSize: '12.5px', padding: '0 8px' }}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Academic Cycle 2026-27</option>
            </select>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-xs"
            onClick={() => {
              setSelectedRegion(currentUser.regionScope === 'All' ? 'All' : currentUser.regionScope);
              setDateFilter('30');
            }}
          >
            {t('common.clear_all')}
          </button>
        </div>
      </div>

      {/* 4 Metric Tiles per PRD 6.4 & 8.4 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
        }}
      >
        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-gov-blue)' }}>
          <div className="metric-tile-title">Open Cases</div>
          <div className="metric-tile-value">{openCasesCount}</div>
          <div className="metric-tile-sub">Under active scrutiny or visit</div>
        </div>

        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-amber-text)' }}>
          <div className="metric-tile-title">Due in 7 Days</div>
          <div className="metric-tile-value" style={{ color: 'var(--color-amber-text)' }}>
            {dueSoonCount}
          </div>
          <div className="metric-tile-sub">Approaching regulatory stage deadline</div>
        </div>

        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-red-text)' }}>
          <div className="metric-tile-title">Overdue / Returned</div>
          <div className="metric-tile-value" style={{ color: 'var(--color-red-text)' }}>
            {overdueCount}
          </div>
          <div className="metric-tile-sub">Requires deficiency check or escalation</div>
        </div>

        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-teal)' }}>
          <div className="metric-tile-title">EVC Pending</div>
          <div className="metric-tile-value" style={{ color: 'var(--color-teal)' }}>
            {evcPendingCount}
          </div>
          <div className="metric-tile-sub">Expert Visit Committee scheduling required</div>
        </div>
      </div>

      {/* Needs Attention Priority Work Queue per PRD 8.4 & 19.1 */}
      <div className="gov-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--color-amber-text)" />
              <span>Needs Attention — Priority Queue</span>
            </h2>
            <p className="subtitle">
              Sorted by statutory deadline urgency, deficiency return status, and days in stage.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-xs"
            onClick={() => setActiveRoutePath('/applications')}
          >
            <span>View All Applications</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="gov-table-container">
          <table className="gov-table" aria-label="Priority queue applications">
            <thead>
              <tr>
                <th scope="col">Priority</th>
                <th scope="col">Application ID</th>
                <th scope="col">Institution</th>
                <th scope="col">Stage</th>
                <th scope="col">Next Due</th>
                <th scope="col">Days in Stage</th>
                <th scope="col">Assigned Owner</th>
                <th scope="col" style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {priorityQueue.map((app) => {
                const isOverdue = app.status === 'Overdue' || app.status === 'Returned';
                const isDueSoon = app.status === 'Due Soon';
                const priorityLabel = isOverdue ? 'CRITICAL' : isDueSoon ? 'HIGH' : 'NORMAL';

                return (
                  <tr
                    key={app.id}
                    className={isOverdue ? 'row-overdue' : isDueSoon ? 'row-urgent' : ''}
                  >
                    <td>
                      <span
                        className={`badge ${
                          isOverdue ? 'badge-red' : isDueSoon ? 'badge-amber' : 'badge-neutral'
                        }`}
                      >
                        {priorityLabel}
                      </span>
                    </td>
                    <td>
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
                          fontFamily: 'inherit',
                          fontSize: '13px',
                        }}
                      >
                        {app.id}
                      </button>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.institutionName}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                        {app.applicationType} • {app.region}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{app.currentStage}</div>
                      <StatusBadge status={app.status} />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.nextDeadline}</div>
                      {app.status === 'Returned' && (
                        <span style={{ fontSize: '11px', color: 'var(--color-purple-text)' }}>
                          Deficiency notice sent
                        </span>
                      )}
                    </td>
                    <td className="num-cell" style={{ fontWeight: 600 }}>
                      {app.daysInStage} days
                    </td>
                    <td style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
                      {app.assignedOfficer}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        onClick={() => handleOpenApp(app.id)}
                      >
                        <span>Open Case</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Section: Case Ageing Bands & Recent Operational Activity per PRD 19.1 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '18px',
        }}
      >
        {/* Case Ageing Bands */}
        <div className="gov-card">
          <div style={{ marginBottom: '14px' }}>
            <h2 style={{ fontSize: '15px' }}>Case Ageing Distribution</h2>
            <p className="subtitle">Days elapsed in current processing stage (Dashboard analysis bands)</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>0–7 days (Fresh / Early Scrutiny)</span>
                <span className="num" style={{ fontWeight: 700, color: 'var(--color-green-text)' }}>{band0_7} cases</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (band0_7 / (openCasesCount || 1)) * 100)}%`, height: '100%', background: 'var(--color-green-text)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>8–15 days (Mid-stage verification)</span>
                <span className="num" style={{ fontWeight: 700, color: 'var(--color-gov-blue)' }}>{band8_15} cases</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (band8_15 / (openCasesCount || 1)) * 100)}%`, height: '100%', background: 'var(--color-gov-blue)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>16–30 days (Approaching SLA limit)</span>
                <span className="num" style={{ fontWeight: 700, color: 'var(--color-amber-text)' }}>{band16_30} cases</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (band16_30 / (openCasesCount || 1)) * 100)}%`, height: '100%', background: 'var(--color-amber-text)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>31+ days (Critical Delay / Escalated)</span>
                <span className="num" style={{ fontWeight: 700, color: 'var(--color-red-text)' }}>{band31_plus} cases</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (band31_plus / (openCasesCount || 1)) * 100)}%`, height: '100%', background: 'var(--color-red-text)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Operational Activity Stream */}
        <div className="gov-card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '15px' }}>Recent Workflow Activity</h2>
              <p className="subtitle">Verified state transitions & audit events</p>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-xs"
              onClick={() => setActiveRoutePath('/audit')}
            >
              Audit Log →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {auditLogs.slice(-4).reverse().map((ev) => (
              <div
                key={ev.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid var(--color-border-subtle)',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--color-text-muted)',
                    whiteSpace: 'nowrap',
                    paddingTop: '2px',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {ev.timestamp.split(' ')[1]?.substring(0, 5) || '12:00'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-primary-navy)' }}>
                    {ev.action.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    {ev.affectedRecord} • by {ev.actor}
                  </div>
                  {ev.reason && (
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-main)', marginTop: '2px', fontStyle: 'italic' }}>
                      "{ev.reason.substring(0, 80)}{ev.reason.length > 80 ? '...' : ''}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
