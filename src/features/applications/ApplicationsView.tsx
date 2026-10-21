import React from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationsList } from './ApplicationsList';
import { ApplicationDetail } from './ApplicationDetail';

export const ApplicationsView: React.FC = () => {
  const { selectedAppId } = useApp();

  return selectedAppId ? <ApplicationDetail /> : <ApplicationsList />;
};
