import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';
import { Drawer } from '../../components/common/Drawer';
import { UnifiedObligation } from '../../types';
import {
  AlertTriangle,
  Clock,
  Calendar,
  Eye,
  Filter,
  CheckCircle,
  FileText,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const ObligationsList: React.FC = () => {
  const {
    obligations,
    currentUser,
    setSelectedAppId,
    setActiveRoutePath,
  } = useApp();
  const { t } = useLanguage();

  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [drawerObl, setDrawerObl] = useState<UnifiedObligation | null>(null);

  // Role scoping per PRD 4.2
  const scopedObligations =
    currentUser.role === 'institution'
      ? obligations.filter((o) => o.institution === (currentUser.institutionName || 'North Valley Institute of Technology'))
      : obligations;

  const filteredObligations = scopedObligations.filter((o) => {
    if (typeFilter !== 'ALL' && o.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    return true;
  });

  const handleOpenApp = (id: string) => {
    setSelectedAppId(id);
    setActiveRoutePath('/applications');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={22} color="var(--color-amber-text)" />
          <h1>{t('nav.obligations')}</h1>
        </div>
        <p className="subtitle">
          Unified statutory deadlines consolidated across application stage SLAs, EVC panel setups, compliance undertakings, and document validity.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div
        className="gov-card"
        style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Obligation Type:
          </span>
          <select
            className="form-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ height: '32px', fontSize: '12.5px', padding: '0 8px' }}
          >
            <option value="ALL">All Obligation Categories</option>
            <option value="Stage SLA">Stage SLA Turnaround</option>
            <option value="EVC Scheduling">EVC Scheduling</option>
            <option value="Undertaking">Compliance Undertaking</option>
            <option value="Document Renewal">Document Validity Renewal</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Status:
          </span>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ height: '32px', fontSize: '12.5px', padding: '0 8px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Due soon">Due soon</option>
            <option value="Overdue">Overdue</option>
            <option value="On track">On track</option>
            <option value="Action required">Action required</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {(typeFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <button
            type="button"
            className="btn btn-secondary btn-xs"
            onClick={() => {
              setTypeFilter('ALL');
              setStatusFilter('ALL');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Operational Grid per PRD 8.13 */}
      <div className="gov-table-container">
        <table className="gov-table" aria-label="Unified Obligations table">
          <thead>
            <tr>
              <th scope="col">Obligation ID</th>
              <th scope="col">Category</th>
              <th scope="col">Obligation Title</th>
              <th scope="col">Linked Case / Institution</th>
              <th scope="col">Current Assignee</th>
              <th scope="col">Statutory Deadline</th>
              <th scope="col">Time Remaining / Overdue</th>
              <th scope="col">Status</th>
              <th scope="col">Reminder Tier</th>
              <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredObligations.map((obl) => {
              const isOverdue = obl.status === 'Overdue';
              return (
                <tr key={obl.id} className={isOverdue ? 'row-overdue' : ''}>
                  <td>
                    <button
                      type="button"
                      onClick={() => setDrawerObl(obl)}
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
                      {obl.id}
                    </button>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{obl.type}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{obl.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      Basis: {obl.ruleBasis}
                    </div>
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
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      {obl.institution}
                    </div>
                  </td>
                  <td style={{ fontSize: '12px' }}>{obl.owner}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{obl.dueDate}</div>
                  </td>
                  <td>
                    <UrgencyBadge days={obl.timeRemainingDays} />
                  </td>
                  <td>
                    <StatusBadge status={obl.status} />
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        obl.escalationTier !== 'Normal' ? 'badge-red' : 'badge-neutral'
                      }`}
                    >
                      {obl.escalationTier}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => setDrawerObl(obl)}
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        onClick={() => handleOpenApp(obl.linkedCase)}
                      >
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Panel Drawer per PRD 8.13 & 9.4 */}
      <Drawer
        isOpen={Boolean(drawerObl)}
        onClose={() => setDrawerObl(null)}
        title={drawerObl ? `${drawerObl.id} — Obligation Detail` : ''}
        subtitle={drawerObl?.title}
      >
        {drawerObl && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                background: drawerObl.status === 'Overdue' ? 'var(--color-red-bg)' : '#F8FAFC',
                border: `1px solid ${drawerObl.status === 'Overdue' ? 'var(--color-red-border)' : 'var(--color-border)'}`,
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                STATUTORY URGENCY & TIMELINE
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary-navy)', marginTop: '4px' }}>
                <UrgencyBadge days={drawerObl.timeRemainingDays} />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Statutory Due Date: <strong>{drawerObl.dueDate}</strong>
              </div>
            </div>

            <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: '10px', fontSize: '12.5px' }}>
              <dt style={{ color: 'var(--color-text-muted)' }}>Linked Case:</dt>
              <dd style={{ fontWeight: 600 }}>{drawerObl.linkedCase} ({drawerObl.institution})</dd>

              <dt style={{ color: 'var(--color-text-muted)' }}>Category:</dt>
              <dd><span className="badge badge-neutral">{drawerObl.type}</span></dd>

              <dt style={{ color: 'var(--color-text-muted)' }}>Responsible Owner:</dt>
              <dd style={{ fontWeight: 600 }}>{drawerObl.owner}</dd>

              <dt style={{ color: 'var(--color-text-muted)' }}>Origin Event:</dt>
              <dd>{drawerObl.originEvent}</dd>

              <dt style={{ color: 'var(--color-text-muted)' }}>Handbook Rule Basis:</dt>
              <dd style={{ fontWeight: 600 }}>{drawerObl.ruleBasis}</dd>

              <dt style={{ color: 'var(--color-text-muted)' }}>Escalation Level:</dt>
              <dd><span className="badge badge-red">{drawerObl.escalationTier}</span></dd>

              <dt style={{ color: 'var(--color-text-muted)' }}>Reminder Tier:</dt>
              <dd>{drawerObl.reminderStage}</dd>
            </dl>

            <div style={{ paddingTop: '14px', borderTop: '1px solid var(--color-border)' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ width: '100%' }}
                onClick={() => {
                  handleOpenApp(drawerObl.linkedCase);
                  setDrawerObl(null);
                }}
              >
                <span>Navigate to Linked Application File</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
