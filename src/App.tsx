import React from 'react';
import { useApp } from './context/AppContext';
import { useLanguage } from './context/LanguageContext';
import { AppHeader } from './components/shell/AppHeader';
import { SideNavigation } from './components/shell/SideNavigation';
import { DashboardView } from './features/dashboard/DashboardView';
import { ApplicationsView } from './features/applications/ApplicationsView';
import { EVCScheduling } from './features/evc/EVCScheduling';
import { ComplianceList } from './features/compliance/ComplianceList';
import { DocumentsList } from './features/documents/DocumentsList';
import { ObligationsList } from './features/obligations/ObligationsList';
import { NotificationCenter } from './features/notifications/NotificationCenter';
import { ReportsView } from './features/reports/ReportsView';
import { AuditTrailView } from './features/audit/AuditTrailView';
import { RulebookManager } from './features/admin/RulebookManager';
import { UserManagement } from './features/admin/UserManagement';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { activeRoutePath, setActiveRoutePath, currentUser } = useApp();
  const { t } = useLanguage();

  // Role authorization boundary check per PRD 4.2
  const checkPermission = (path: string): boolean => {
    if (path.startsWith('/admin')) {
      return currentUser.role === 'admin' || currentUser.role === 'bureau_officer';
    }
    if (path === '/reports') {
      return currentUser.role !== 'institution';
    }
    if (path === '/evc') {
      return currentUser.role !== 'institution';
    }
    return true;
  };

  const isPermitted = checkPermission(activeRoutePath);

  const renderActiveModule = () => {
    if (!isPermitted) {
      return (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            margin: '40px auto',
            maxWidth: '540px',
          }}
        >
          <ShieldAlert size={44} color="var(--color-red-text)" style={{ margin: '0 auto 14px auto' }} />
          <h2 style={{ fontSize: '18px', color: 'var(--color-primary-navy)' }}>
            Access Restricted — Role Boundary Enforced
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '8px', marginBottom: '20px' }}>
            You do not have administrative access to this module under your current role (<em>{currentUser.role.replace('_', ' ')}</em>).
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setActiveRoutePath('/dashboard')}
          >
            <ArrowLeft size={14} />
            <span>Return to Authorised Dashboard</span>
          </button>
        </div>
      );
    }

    switch (activeRoutePath) {
      case '/dashboard':
        return <DashboardView />;
      case '/applications':
        return <ApplicationsView />;
      case '/evc':
        return <EVCScheduling />;
      case '/compliance':
        return <ComplianceList />;
      case '/documents':
        return <DocumentsList />;
      case '/obligations':
        return <ObligationsList />;
      case '/notifications':
        return <NotificationCenter />;
      case '/reports':
        return <ReportsView />;
      case '/audit':
        return <AuditTrailView />;
      case '/admin/rules':
        return <RulebookManager />;
      case '/admin/users':
        return <UserManagement />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Skip to Main Content Link (GIGW 3.0 / WCAG) */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Global Government Header */}
      <AppHeader />

      {/* Main Layout Body */}
      <div style={{ display: 'flex', flex: 1 }}>
        <SideNavigation />

        <main
          id="main-content"
          tabIndex={-1}
          style={{
            flex: 1,
            padding: '24px 32px',
            overflowY: 'auto',
            maxWidth: '1440px',
            width: '100%',
          }}
        >
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
};
