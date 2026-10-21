import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppContent } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LanguageProvider>
  </StrictMode>,
);
