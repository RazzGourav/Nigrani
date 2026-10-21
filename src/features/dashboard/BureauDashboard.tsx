import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Layers,
  BarChart3,
  TrendingDown,
  AlertCircle,
  Building,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export const BureauDashboard: React.FC = () => {
  const { applications, obligations, evcSchedules, setActiveRoutePath } = useApp();
  const { t } = useLanguage();

  const regions: ('North' | 'South' | 'West' | 'East' | 'Central')[] = [
    'North',
    'South',
    'West',
    'East',
    'Central',
  ];

  // Region comparison stats
  const regionStats = regions.map((reg) => {
    const regApps = applications.filter((a) => a.region === reg);
    const openCount = regApps.filter((a) => a.status !== 'Approved' && a.status !== 'Rejected').length;
    const overdueCount = regApps.filter((a) => a.status === 'Overdue' || a.status === 'Returned').length;
    const dueSoonCount = regApps.filter((a) => a.status === 'Due Soon').length;
    const avgDays =
      openCount > 0
        ? Math.round(regApps.reduce((acc, curr) => acc + curr.daysInStage, 0) / regApps.length)
        : 0;

    return {
      region: reg,
      total: regApps.length,
      open: openCount,
      overdue: overdueCount,
      dueSoon: dueSoonCount,
      avgDays,
    };
  });

  // Stage bottleneck analysis
  const stagesList = [
    { name: 'Scrutiny Review', key: 'Scrutiny', normDays: 14 },
    { name: 'EVC Scheduling & Visit', key: 'EVC', normDays: 14 },
    { name: 'Deficiency Response', key: 'Deficiency', normDays: 7 },
    { name: 'Standing Appeals (SAC)', key: 'SAC', normDays: 10 },
    { name: 'Bureau / Competent Authority', key: 'Bureau', normDays: 7 },
  ];

  const stageBottlenecks = stagesList.map((st) => {
    const matchingApps = applications.filter(
      (a) => a.currentStage.toLowerCase().includes(st.key.toLowerCase()) && a.status !== 'Approved'
    );
    const delayedApps = matchingApps.filter((a) => a.daysInStage > st.normDays);
    const avgElapsed =
      matchingApps.length > 0
        ? Math.round(matchingApps.reduce((acc, c) => acc + c.daysInStage, 0) / matchingApps.length)
        : 0;

    return {
      stage: st.name,
      activeCases: matchingApps.length,
      delayedCases: delayedApps.length,
      normDays: st.normDays,
      avgElapsed,
      bottleneckRisk: delayedApps.length > 0 ? 'High' : avgElapsed > st.normDays * 0.75 ? 'Moderate' : 'Low',
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Title & Scope */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={22} color="var(--color-gov-blue)" />
          <h1>National Bureau Performance & Bottleneck Analysis</h1>
        </div>
        <p className="subtitle">
          Cross-regional monitoring across AICTE regional offices for Academic Cycle 2026–27.
        </p>
      </div>

      {/* Top 4 Bureau Key Decision Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
        }}
      >
        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-gov-blue)' }}>
          <div className="metric-tile-title">Total Applications Tracked</div>
          <div className="metric-tile-value">{applications.length}</div>
          <div className="metric-tile-sub">All 5 statutory administrative zones</div>
        </div>

        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-red-text)' }}>
          <div className="metric-tile-title">National Overdue Rate</div>
          <div className="metric-tile-value" style={{ color: 'var(--color-red-text)' }}>
            {Math.round(
              (applications.filter((a) => a.status === 'Overdue' || a.status === 'Returned').length /
                (applications.length || 1)) *
                100
            )}
            %
          </div>
          <div className="metric-tile-sub">Cases exceeding handbook SLA timeline</div>
        </div>

        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-teal)' }}>
          <div className="metric-tile-title">Active EVC Inspections</div>
          <div className="metric-tile-value" style={{ color: 'var(--color-teal)' }}>
            {evcSchedules.filter((e) => e.status !== 'Closed').length}
          </div>
          <div className="metric-tile-sub">Panels proposed, scheduled, or visiting</div>
        </div>

        <div className="metric-tile" style={{ borderLeft: '4px solid var(--color-green-text)' }}>
          <div className="metric-tile-title">Approved / Concluded</div>
          <div className="metric-tile-value" style={{ color: 'var(--color-green-text)' }}>
            {applications.filter((a) => a.status === 'Approved').length}
          </div>
          <div className="metric-tile-sub">Final statutory orders recorded</div>
        </div>
      </div>

      {/* Region Comparison Operational Table per PRD 8.5 */}
      <div className="gov-card">
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '16px' }}>Regional Processing Comparison</h2>
          <p className="subtitle">
            Denominators, overdue counts, and average stage durations by Regional Office (No shaming; objective workflow telemetry).
          </p>
        </div>

        <div className="gov-table-container">
          <table className="gov-table" aria-label="Regional processing comparison">
            <thead>
              <tr>
                <th scope="col">Region Office</th>
                <th scope="col">Total Cases</th>
                <th scope="col">Open In-Progress</th>
                <th scope="col">Due Soon (≤7d)</th>
                <th scope="col">Overdue / Returned</th>
                <th scope="col">Avg Stage Age</th>
                <th scope="col" style={{ textAlign: 'right' }}>Inspection Scope</th>
              </tr>
            </thead>
            <tbody>
              {regionStats.map((r) => (
                <tr key={r.region}>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary-navy)' }}>
                    {r.region} Region Office
                  </td>
                  <td className="num-cell">{r.total}</td>
                  <td className="num-cell" style={{ fontWeight: 600 }}>{r.open}</td>
                  <td>
                    {r.dueSoon > 0 ? (
                      <span className="badge badge-amber">{r.dueSoon} cases</span>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>0</span>
                    )}
                  </td>
                  <td>
                    {r.overdue > 0 ? (
                      <span className="badge badge-red">{r.overdue} cases</span>
                    ) : (
                      <span className="badge badge-green">0</span>
                    )}
                  </td>
                  <td className="num-cell" style={{ fontWeight: 600 }}>
                    {r.avgDays} days
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs"
                      onClick={() => setActiveRoutePath('/applications')}
                    >
                      <span>Filter Region</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stage Bottleneck Heatmap / Accessible Table per PRD 8.5 */}
      <div className="gov-card">
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '16px' }}>Approval Stage Bottleneck Telemetry</h2>
          <p className="subtitle">
            Evaluation of where cases accumulate delays against prescribed Approval Process Handbook (APH) SLA norms.
          </p>
        </div>

        <div className="gov-table-container">
          <table className="gov-table" aria-label="Stage bottleneck telemetry">
            <thead>
              <tr>
                <th scope="col">Workflow Stage</th>
                <th scope="col">Active Cases</th>
                <th scope="col">APH Norm SLA</th>
                <th scope="col">Actual Avg Elapsed</th>
                <th scope="col">Delayed Beyond Norm</th>
                <th scope="col">Bottleneck Status</th>
              </tr>
            </thead>
            <tbody>
              {stageBottlenecks.map((st) => (
                <tr key={st.stage}>
                  <td style={{ fontWeight: 600 }}>{st.stage}</td>
                  <td className="num-cell">{st.activeCases}</td>
                  <td className="num-cell">{st.normDays} days</td>
                  <td className="num-cell" style={{ fontWeight: 600 }}>
                    {st.avgElapsed} days
                  </td>
                  <td>
                    {st.delayedCases > 0 ? (
                      <span className="badge badge-red">{st.delayedCases} cases delayed</span>
                    ) : (
                      <span className="badge badge-green">Within SLA norm</span>
                    )}
                  </td>
                  <td>
                    {st.bottleneckRisk === 'High' ? (
                      <span className="badge badge-red">High Delay Risk</span>
                    ) : st.bottleneckRisk === 'Moderate' ? (
                      <span className="badge badge-amber">Moderate Load</span>
                    ) : (
                      <span className="badge badge-green">Normal Flow</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
