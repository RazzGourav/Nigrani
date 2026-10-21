import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProposeEVCModal } from './ProposeEVCModal';
import { EVCSchedule } from '../../types';
import {
  CalendarDays,
  ListFilter,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Eye,
  AlertCircle,
  Building,
} from 'lucide-react';

export const EVCScheduling: React.FC = () => {
  const {
    evcSchedules,
    currentUser,
    proposeEVC,
    confirmEVCSchedule,
    setSelectedAppId,
    setActiveRoutePath,
  } = useApp();
  const { t } = useLanguage();

  const [viewMode, setViewMode] = useState<'queue' | 'calendar'>('queue');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeModalEVC, setActiveModalEVC] = useState<EVCSchedule | null>(null);

  // Region filtering
  const filteredSchedules = evcSchedules.filter((e) => {
    if (selectedRegion !== 'ALL' && e.region !== selectedRegion) return false;
    if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
    return true;
  });

  const handleOpenApp = (id: string) => {
    setSelectedAppId(id);
    setActiveRoutePath('/applications');
  };

  const isOfficer =
    currentUser.role === 'regional_officer' ||
    currentUser.role === 'bureau_officer' ||
    currentUser.role === 'admin';

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
            <CalendarDays size={22} color="var(--color-gov-blue)" />
            <h1>{t('nav.evc')}</h1>
          </div>
          <p className="subtitle">
            Manage physical and hybrid Expert Visit Committee (EVC) quotas, panel assignments, and scheduling compliance.
          </p>
        </div>

        {/* View Switcher: Queue vs Calendar per PRD 8.10 & 5.2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              background: '#E2E8F0',
              borderRadius: 'var(--radius-sm)',
              padding: '2px',
            }}
          >
            <button
              type="button"
              className={`btn btn-xs ${viewMode === 'queue' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('queue')}
              style={{ border: 'none' }}
            >
              <ListFilter size={13} />
              <span>Queue View</span>
            </button>
            <button
              type="button"
              className={`btn btn-xs ${viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('calendar')}
              style={{ border: 'none' }}
            >
              <Calendar size={13} />
              <span>Calendar View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="gov-card"
        style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}
      >
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
            <option value="ALL">All Regions</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="West">West</option>
            <option value="East">East</option>
            <option value="Central">Central</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            EVC Status:
          </span>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ height: '32px', fontSize: '12.5px', padding: '0 8px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Awaiting scheduling">Awaiting scheduling</option>
            <option value="Proposed">Proposed</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Visit completed">Visit completed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {(selectedRegion !== 'ALL' || statusFilter !== 'ALL') && (
          <button
            type="button"
            className="btn btn-secondary btn-xs"
            onClick={() => {
              setSelectedRegion('ALL');
              setStatusFilter('ALL');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Queue View per PRD 8.10 */}
      {viewMode === 'queue' ? (
        <div className="gov-table-container">
          <table className="gov-table" aria-label="EVC Queue">
            <thead>
              <tr>
                <th scope="col">Schedule ID</th>
                <th scope="col">Application ID</th>
                <th scope="col">Institution</th>
                <th scope="col">Region</th>
                <th scope="col">EVC Reason</th>
                <th scope="col">Readiness</th>
                <th scope="col">Scheduling Deadline</th>
                <th scope="col">Proposed / Confirmed</th>
                <th scope="col">Committee</th>
                <th scope="col">Status</th>
                <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.map((evc) => (
                <tr key={evc.id}>
                  <td style={{ fontWeight: 600 }}>{evc.id}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleOpenApp(evc.applicationId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-gov-blue)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {evc.applicationId}
                    </button>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{evc.institutionName}</div>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{evc.region}</span>
                  </td>
                  <td style={{ fontSize: '12px', maxWidth: '200px' }}>
                    {evc.reason}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        evc.readinessStatus === 'Ready'
                          ? 'badge-green'
                          : 'badge-amber'
                      }`}
                    >
                      {evc.readinessStatus}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{evc.schedulingDeadline}</td>
                  <td>
                    {evc.confirmedDate ? (
                      <span style={{ fontWeight: 700, color: 'var(--color-green-text)' }}>
                        {evc.confirmedDate} (Confirmed)
                      </span>
                    ) : evc.proposedDate ? (
                      <span style={{ color: 'var(--color-gov-blue)', fontWeight: 600 }}>
                        {evc.proposedDate} (Proposed)
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>Pending</span>
                    )}
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--color-text-muted)', maxWidth: '180px' }}>
                    {evc.assignedCommittee || 'Unassigned'}
                  </td>
                  <td>
                    <StatusBadge status={evc.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      {isOfficer && evc.status === 'Proposed' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-xs"
                          onClick={() => confirmEVCSchedule(evc.id)}
                        >
                          <CheckCircle size={12} />
                          <span>Confirm</span>
                        </button>
                      )}

                      {isOfficer && (evc.status === 'Awaiting scheduling' || evc.status === 'Proposed') && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-xs"
                          onClick={() => setActiveModalEVC(evc)}
                        >
                          <span>{evc.proposedDate ? 'Revise' : 'Propose'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => handleOpenApp(evc.applicationId)}
                      >
                        <Eye size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Calendar View per PRD 5.2 & 8.10 */
        <div className="gov-card">
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '16px' }}>October 2026 — Expert Visit Schedule</h2>
              <p className="subtitle">Visual calendar of on-site committee visits and regulatory deadlines</p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px',
              textAlign: 'center',
            }}
          >
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div
                key={day}
                style={{
                  padding: '8px 4px',
                  fontWeight: 700,
                  fontSize: '12px',
                  background: '#F1F5F9',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--color-primary-navy)',
                }}
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-10-${String(dayNum).padStart(2, '0')}`;
              const matchingEVCs = evcSchedules.filter(
                (e) => e.proposedDate === dateStr || e.confirmedDate === dateStr || e.schedulingDeadline === dateStr
              );

              return (
                <div
                  key={dayNum}
                  style={{
                    minHeight: '78px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '4px',
                    background: matchingEVCs.length > 0 ? '#F8FAFC' : '#FFFFFF',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontWeight: dayNum === 21 ? 800 : 500,
                        fontSize: '12px',
                        color: dayNum === 21 ? 'var(--color-gov-blue)' : 'var(--color-text-main)',
                      }}
                    >
                      {dayNum} {dayNum === 21 && '(Today)'}
                    </span>
                  </div>

                  <div>
                    {matchingEVCs.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => handleOpenApp(e.applicationId)}
                        style={{
                          fontSize: '10.5px',
                          padding: '2px 4px',
                          background: e.status === 'Scheduled' ? 'var(--color-green-bg)' : 'var(--color-gov-blue-subtle)',
                          color: e.status === 'Scheduled' ? 'var(--color-green-text)' : 'var(--color-gov-blue)',
                          borderRadius: '2px',
                          border: `1px solid ${e.status === 'Scheduled' ? 'var(--color-green-border)' : '#B9D9EB'}`,
                          marginBottom: '2px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontWeight: 600,
                        }}
                        title={`${e.institutionName} (${e.status})`}
                      >
                        {e.institutionName.split(' ')[0]} ({e.status})
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Propose Modal */}
      {activeModalEVC && (
        <ProposeEVCModal
          isOpen={Boolean(activeModalEVC)}
          onClose={() => setActiveModalEVC(null)}
          evc={activeModalEVC}
          onConfirm={(proposedDate, committee, notes) => {
            proposeEVC(activeModalEVC.applicationId, proposedDate, committee, notes);
          }}
        />
      )}
    </div>
  );
};
