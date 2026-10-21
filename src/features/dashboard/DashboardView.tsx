import React from 'react';
import { useApp } from '../../context/AppContext';
import { RegionalDashboard } from './RegionalDashboard';
import { InstitutionDashboard } from './InstitutionDashboard';
import { BureauDashboard } from './BureauDashboard';
import { CommitteeDashboard } from './CommitteeDashboard';
import { SeniorAuthorityDashboard } from './SeniorAuthorityDashboard';

export const DashboardView: React.FC = () => {
  const { currentUser } = useApp();

  switch (currentUser.role) {
    case 'institution':
      return <InstitutionDashboard />;
    case 'bureau_officer':
      return <BureauDashboard />;
    case 'committee_member':
      return <CommitteeDashboard />;
    case 'senior_authority':
      return <SeniorAuthorityDashboard />;
    case 'regional_officer':
    case 'admin':
    default:
      return <RegionalDashboard />;
  }
};
