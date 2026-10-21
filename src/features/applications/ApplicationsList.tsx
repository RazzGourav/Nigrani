import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Application, Region } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { CreateApplicationModal } from './CreateApplicationModal';
import {
  Search,
  Filter,
  Download,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowUpDown,
  Building2,
} from 'lucide-react';

export const ApplicationsList: React.FC = () => {
  const {
    currentUser,
    applications,
    createApplication,
    setSelectedAppId,
  } = useApp();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortField, setSortField] = useState<'id' | 'daysInStage' | 'nextDeadline'>('daysInStage');
  const [sortAsc, setSortAsc] = useState(false);

  // Scoped dataset based on role per PRD 4.2 & Journey F
  const scopedApps = useMemo(() => {
    if (currentUser.role === 'institution') {
      return applications.filter((a) => a.institutionName === (currentUser.institutionName || 'North Valley Institute of Technology'));
    }
    if (currentUser.regionScope !== 'All') {
      return applications.filter((a) => a.region === currentUser.regionScope);
    }
    return applications;
  }, [applications, currentUser]);

  // Filter application list
  const filteredApps = useMemo(() => {
    return scopedApps.filter((app) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = app.id.toLowerCase().includes(q);
        const matchesInst = app.institutionName.toLowerCase().includes(q);
        const matchesOfficer = app.assignedOfficer.toLowerCase().includes(q);
        if (!matchesId && !matchesInst && !matchesOfficer) return false;
      }

      // Stage
      if (stageFilter !== 'ALL') {
        if (!app.currentStage.toLowerCase().includes(stageFilter.toLowerCase())) return false;
      }

      // Status
      if (statusFilter !== 'ALL') {
        if (app.status !== statusFilter) return false;
      }

      // Region
      if (regionFilter !== 'ALL') {
        if (app.region !== regionFilter) return false;
      }

      // Overdue only
      if (overdueOnly) {
        if (app.status !== 'Overdue' && app.status !== 'Returned') return false;
      }

      return true;
    });
  }, [scopedApps, searchQuery, stageFilter, statusFilter, regionFilter, overdueOnly]);

  // Sorting
  const sortedApps = useMemo(() => {
    return [...filteredApps].sort((a, b) => {
      if (sortField === 'daysInStage') {
        return sortAsc ? a.daysInStage - b.daysInStage : b.daysInStage - a.daysInStage;
      }
      if (sortField === 'id') {
        return sortAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      }
      if (sortField === 'nextDeadline') {
        return sortAsc ? a.nextDeadline.localeCompare(b.nextDeadline) : b.nextDeadline.localeCompare(a.nextDeadline);
      }
      return 0;
    });
  }, [filteredApps, sortField, sortAsc]);

  // Pagination
  const totalResults = sortedApps.length;
  const totalPages = Math.ceil(totalResults / pageSize) || 1;
  const paginatedApps = sortedApps.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: 'id' | 'daysInStage' | 'nextDeadline') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStageFilter('ALL');
    setStatusFilter('ALL');
    setRegionFilter('ALL');
    setOverdueOnly(false);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = ['Application ID,Institution,Type,Region,Stage,Status,Days in Stage,Next Deadline,Assigned Officer,Last Updated'];
    const rows = filteredApps.map((a) =>
      `"${a.id}","${a.institutionName}","${a.applicationType}","${a.region}","${a.currentStage}","${a.status}",${a.daysInStage},"${a.nextDeadline}","${a.assignedOfficer}","${a.lastUpdated}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NIGRANI_Applications_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasActiveFilters =
    searchQuery || stageFilter !== 'ALL' || statusFilter !== 'ALL' || regionFilter !== 'ALL' || overdueOnly;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header and Title */}
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
          <h1>{t('nav.applications')}</h1>
          <p className="subtitle">
            Track processing stage, statutory ownership, and next required action across active approval files.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <Download size={14} />
            <span>{t('common.export_csv')}</span>
          </button>

          {currentUser.role !== 'institution' && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={14} />
              <span>{t('action.create_app')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar per PRD 8.8 & 19.2 */}
      <div
        className="gov-card"
        style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          {/* Search box */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--color-text-light)' }}
            />
            <input
              type="search"
              className="form-input"
              style={{ paddingLeft: '32px', width: '100%' }}
              placeholder={t('common.search_placeholder')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Stage Filter */}
          <div style={{ minWidth: '150px' }}>
            <select
              className="form-select"
              value={stageFilter}
              onChange={(e) => {
                setStageFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: '100%' }}
            >
              <option value="ALL">All Stages</option>
              <option value="Scrutiny">Scrutiny Review</option>
              <option value="EVC">EVC Scheduling / Visit</option>
              <option value="Deficiency">Deficiency Response</option>
              <option value="SAC">Appellate (SAC)</option>
              <option value="Bureau">Bureau Verification</option>
              <option value="Approved">Approved</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '140px' }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: '100%' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Due Soon">Due Soon</option>
              <option value="Overdue">Overdue</option>
              <option value="Returned">Returned for Correction</option>
              <option value="Approved">Approved</option>
            </select>
          </div>

          {/* Region Filter (Disabled if scoped to single region) */}
          {currentUser.regionScope === 'All' && currentUser.role !== 'institution' && (
            <div style={{ minWidth: '140px' }}>
              <select
                className="form-select"
                value={regionFilter}
                onChange={(e) => {
                  setRegionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ width: '100%' }}
              >
                <option value="ALL">All Regions</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="West">West</option>
                <option value="East">East</option>
                <option value="Central">Central</option>
              </select>
            </div>
          )}

          {/* Overdue checkbox */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              userSelect: 'none',
              padding: '0 4px',
            }}
          >
            <input
              type="checkbox"
              checked={overdueOnly}
              onChange={(e) => {
                setOverdueOnly(e.target.checked);
                setCurrentPage(1);
              }}
              style={{ width: '16px', height: '16px', accentColor: 'var(--color-red-text)' }}
            />
            <span>Overdue only</span>
          </label>

          {/* Clear button */}
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleClearFilters}
              style={{ marginLeft: 'auto' }}
            >
              <X size={13} />
              <span>{t('common.clear_all')}</span>
            </button>
          )}
        </div>

        {/* Active Filter Chips per PRD 8.8 & 19.2 */}
        {hasActiveFilters && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              alignItems: 'center',
              paddingTop: '6px',
              borderTop: '1px solid var(--color-border-subtle)',
              fontSize: '12px',
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>Active filters:</span>
            {searchQuery && (
              <span className="badge badge-neutral">
                Search: "{searchQuery}"
                <X size={11} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSearchQuery('')} />
              </span>
            )}
            {stageFilter !== 'ALL' && (
              <span className="badge badge-neutral">
                Stage: {stageFilter}
                <X size={11} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setStageFilter('ALL')} />
              </span>
            )}
            {statusFilter !== 'ALL' && (
              <span className="badge badge-neutral">
                Status: {statusFilter}
                <X size={11} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setStatusFilter('ALL')} />
              </span>
            )}
            {regionFilter !== 'ALL' && (
              <span className="badge badge-neutral">
                Region: {regionFilter}
                <X size={11} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setRegionFilter('ALL')} />
              </span>
            )}
            {overdueOnly && (
              <span className="badge badge-red">
                Overdue only
                <X size={11} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setOverdueOnly(false)} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Operational Data Table per PRD 8.8 & 19.2 */}
      <div className="gov-table-container">
        {paginatedApps.length > 0 ? (
          <table className="gov-table" aria-label="Applications list">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sortable"
                  onClick={() => handleSort('id')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>App ID</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th scope="col">Institution</th>
                <th scope="col">Type</th>
                <th scope="col">Region</th>
                <th scope="col">Current Stage</th>
                <th scope="col">Status</th>
                <th
                  scope="col"
                  className="sortable"
                  onClick={() => handleSort('daysInStage')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Days in Stage</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  scope="col"
                  className="sortable"
                  onClick={() => handleSort('nextDeadline')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Next Due</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th scope="col">Assigned Officer</th>
                <th scope="col" style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedApps.map((app) => {
                const isOverdue = app.status === 'Overdue' || app.status === 'Returned';
                const isDueSoon = app.status === 'Due Soon';

                return (
                  <tr
                    key={app.id}
                    className={isOverdue ? 'row-overdue' : isDueSoon ? 'row-urgent' : ''}
                  >
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedAppId(app.id)}
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
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        PID: {app.institutionId}
                      </div>
                    </td>
                    <td style={{ fontSize: '12.5px' }}>{app.applicationType}</td>
                    <td>
                      <span className="badge badge-neutral">{app.region}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{app.currentStage}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>
                        Route: {app.route}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="num-cell" style={{ fontWeight: 600 }}>
                      {app.daysInStage} days
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.nextDeadline}</div>
                      {app.status === 'Returned' && (
                        <div style={{ fontSize: '11px', color: 'var(--color-purple-text)' }}>
                          Deficiency notice sent
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      {app.assignedOfficer}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => setSelectedAppId(app.id)}
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <EmptyState
            title="No matching applications found"
            description="No applications match the current filter criteria. You can broaden your search or clear filters to view all records."
            actionText="Clear All Filters"
            onAction={handleClearFilters}
          />
        )}
      </div>

      {/* Pagination Footer per PRD 8.8 & 19.2 */}
      {totalResults > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
          }}
        >
          <div>
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong>–
            <strong>{Math.min(currentPage * pageSize, totalResults)}</strong> of{' '}
            <strong>{totalResults}</strong> results
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-xs"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={13} />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={`btn btn-xs ${currentPage === p ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCurrentPage(p)}
                style={{ minWidth: '28px', padding: '0 6px' }}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              className="btn btn-secondary btn-xs"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <span>Next</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Onboard Application Modal */}
      <CreateApplicationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => {
          const newId = createApplication(data);
          setSelectedAppId(newId);
        }}
      />
    </div>
  );
};
