import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  FileSpreadsheet,
  CalendarDays,
  CheckSquare,
  FileText,
  AlertTriangle,
  Bell,
  BarChart3,
  History,
  Settings,
  Users,
  ShieldAlert,
} from 'lucide-react';

export const SideNavigation: React.FC = () => {
  const {
    currentUser,
    activeRoutePath,
    setActiveRoutePath,
    setSelectedAppId,
    applications,
    evcSchedules,
    compliance,
    documents,
    obligations,
    notifications,
  } = useApp();
  const { t } = useLanguage();

  // Role scoped counts
  const scopedApps =
    currentUser.role === 'institution'
      ? applications.filter((a) => a.institutionName === currentUser.institutionName)
      : currentUser.regionScope === 'All'
      ? applications
      : applications.filter((a) => a.region === currentUser.regionScope);

  const openAppsCount = scopedApps.filter((a) => a.status !== 'Approved' && a.status !== 'Rejected').length;
  const pendingEVCCount = evcSchedules.filter((e) => e.status === 'Awaiting scheduling' || e.status === 'Proposed').length;
  const pendingCompCount = compliance.filter((c) => c.submissionStatus === 'Under review' || c.submissionStatus === 'Not submitted').length;
  const urgentDocsCount = documents.filter((d) => d.status === 'Due soon' || d.status === 'Expired').length;
  const overdueObligationsCount = obligations.filter((o) => o.status === 'Overdue').length;
  const failedNotifsCount = notifications.filter((n) => n.status === 'Failed').length;

  const handleNav = (path: string) => {
    setSelectedAppId(null);
    setActiveRoutePath(path);
  };

  const navItems = [
    {
      path: '/dashboard',
      label: t('nav.overview'),
      icon: LayoutDashboard,
      roles: ['institution', 'regional_officer', 'bureau_officer', 'committee_member', 'senior_authority', 'admin'],
    },
    {
      path: '/applications',
      label: t('nav.applications'),
      icon: FileSpreadsheet,
      count: openAppsCount,
      countUrgent: scopedApps.some((a) => a.status === 'Returned' || a.status === 'Overdue'),
      roles: ['institution', 'regional_officer', 'bureau_officer', 'committee_member', 'senior_authority', 'admin'],
    },
    {
      path: '/evc',
      label: t('nav.evc'),
      icon: CalendarDays,
      count: pendingEVCCount,
      roles: ['regional_officer', 'bureau_officer', 'committee_member', 'senior_authority', 'admin'],
    },
    {
      path: '/compliance',
      label: t('nav.compliance'),
      icon: CheckSquare,
      count: pendingCompCount,
      roles: ['institution', 'regional_officer', 'bureau_officer', 'senior_authority', 'admin'],
    },
    {
      path: '/documents',
      label: t('nav.documents'),
      icon: FileText,
      count: urgentDocsCount,
      countUrgent: urgentDocsCount > 0,
      roles: ['institution', 'regional_officer', 'bureau_officer', 'senior_authority', 'admin'],
    },
    {
      path: '/obligations',
      label: t('nav.obligations'),
      icon: AlertTriangle,
      count: overdueObligationsCount,
      countUrgent: overdueObligationsCount > 0,
      roles: ['institution', 'regional_officer', 'bureau_officer', 'committee_member', 'senior_authority', 'admin'],
    },
    {
      path: '/notifications',
      label: t('nav.notifications'),
      icon: Bell,
      count: failedNotifsCount,
      countUrgent: failedNotifsCount > 0,
      roles: ['institution', 'regional_officer', 'bureau_officer', 'committee_member', 'senior_authority', 'admin'],
    },
    {
      path: '/reports',
      label: t('nav.reports'),
      icon: BarChart3,
      roles: ['regional_officer', 'bureau_officer', 'senior_authority', 'admin'],
    },
    {
      path: '/audit',
      label: t('nav.audit'),
      icon: History,
      badgeText: 'Verified',
      roles: ['institution', 'regional_officer', 'bureau_officer', 'committee_member', 'senior_authority', 'admin'],
    },
  ];

  const adminItems = [
    {
      path: '/admin/rules',
      label: t('nav.rulebook'),
      icon: Settings,
      roles: ['bureau_officer', 'admin'],
    },
    {
      path: '/admin/users',
      label: t('nav.users'),
      icon: Users,
      roles: ['admin'],
    },
  ];

  const visibleNav = navItems.filter((i) => i.roles.includes(currentUser.role));
  const visibleAdmin = adminItems.filter((i) => i.roles.includes(currentUser.role));

  return (
    <aside
      className="app-sidebar"
      style={{
        width: '240px',
        background: '#FFFFFF',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        minHeight: 'calc(100vh - 60px)',
      }}
    >
      <div style={{ padding: '16px 10px' }}>
        {/* Navigation list */}
        <nav aria-label="Main Navigation">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {visibleNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoutePath === item.path;
              return (
                <li key={item.path}>
                  <button
                    type="button"
                    onClick={() => handleNav(item.path)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: isActive ? 'var(--color-gov-blue-subtle)' : 'transparent',
                      color: isActive ? 'var(--color-gov-blue)' : 'var(--color-text-main)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.15s ease',
                      borderLeft: isActive ? '3px solid var(--color-gov-blue)' : '3px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={17} color={isActive ? 'var(--color-gov-blue)' : 'var(--color-text-muted)'} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        style={{
                          background: item.countUrgent ? 'var(--color-red-bg)' : 'var(--color-neutral-bg)',
                          color: item.countUrgent ? 'var(--color-red-text)' : 'var(--color-text-muted)',
                          border: `1px solid ${item.countUrgent ? 'var(--color-red-border)' : 'var(--color-neutral-border)'}`,
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '10px',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {item.count}
                      </span>
                    )}
                    {item.badgeText && (
                      <span
                        style={{
                          background: 'var(--color-green-bg)',
                          color: 'var(--color-green-text)',
                          border: '1px solid var(--color-green-border)',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: 'var(--radius-xs)',
                        }}
                      >
                        {item.badgeText}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Administration Section */}
          {visibleAdmin.length > 0 && (
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-light)',
                  padding: '0 12px 6px 12px',
                  letterSpacing: '0.04em',
                }}
              >
                {t('nav.admin')}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {visibleAdmin.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeRoutePath === item.path;
                  return (
                    <li key={item.path}>
                      <button
                        type="button"
                        onClick={() => handleNav(item.path)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: isActive ? 'var(--color-gov-blue-subtle)' : 'transparent',
                          color: isActive ? 'var(--color-gov-blue)' : 'var(--color-text-main)',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '13px',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          borderLeft: isActive ? '3px solid var(--color-gov-blue)' : '3px solid transparent',
                        }}
                      >
                        <Icon size={17} color={isActive ? 'var(--color-gov-blue)' : 'var(--color-text-muted)'} />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </nav>
      </div>

      {/* Footer Info per PRD 6.5 & 19.1 */}
      <div
        style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--color-border-subtle)',
          background: '#F8FAFC',
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          lineHeight: '1.4',
        }}
      >
        <div style={{ fontWeight: 600, color: 'var(--color-primary-navy)' }}>
          Prototype v1.0 • SIH 26262
        </div>
        <div>AICTE Regulation Bureau</div>
        <div style={{ marginTop: '4px', fontSize: '10.5px', color: 'var(--color-text-light)' }}>
          Data updated: 21 Oct 2026
        </div>
      </div>
    </aside>
  );
};
