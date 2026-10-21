import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';
import {
  RotateCcw,
  Globe,
  Bell,
  UserCheck,
  ChevronDown,
  Building2,
  Shield,
  FileCheck,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { currentUser, switchRole, notifications, resetDemoData, setActiveRoutePath } = useApp();
  const { language, setLanguage, t } = useLanguage();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const failedCount = notifications.filter((n) => n.status === 'Failed').length;
  const overdueCount = notifications.filter((n) => n.status === 'Escalated').length;

  const roleOptions: { role: UserRole; label: string; desc: string; icon: any }[] = [
    {
      role: 'regional_officer',
      label: 'Regional Officer (North)',
      desc: 'Queue management, EVC scheduling, Deficiencies',
      icon: Shield,
    },
    {
      role: 'institution',
      label: 'Institution User',
      desc: 'North Valley Institute (Submissions & Responses)',
      icon: Building2,
    },
    {
      role: 'bureau_officer',
      label: 'Bureau Officer (HQ)',
      desc: 'National overview, Bottlenecks, Cross-region',
      icon: Layers,
    },
    {
      role: 'committee_member',
      label: 'Committee Member',
      desc: 'EVC visits, Hearings & Inspection reports',
      icon: FileCheck,
    },
    {
      role: 'senior_authority',
      label: 'Senior Authority',
      desc: 'Member Secretary (Escalations & Directions)',
      icon: UserCheck,
    },
    {
      role: 'admin',
      label: 'System Administrator',
      desc: 'Rulebook configuration, Routes, SLA timers',
      icon: Sparkles,
    },
  ];

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setShowRoleMenu(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to clean synthetic seed state? All test modifications will be cleared.')) {
      resetDemoData();
    }
  };

  return (
    <header
      style={{
        background: 'var(--color-primary-navy)',
        color: '#FFFFFF',
        height: '60px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand Identity & Prototype Notice */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span
            style={{
              fontSize: '19px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: '#FFFFFF',
            }}
          >
            {t('brand.title')}
          </span>
          <span
            style={{
              fontSize: '12.5px',
              color: 'rgba(255, 255, 255, 0.72)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.25)',
              paddingLeft: '10px',
              fontWeight: 500,
            }}
          >
            {t('brand.subtitle')}
          </span>
        </div>

        {/* Official Prototype Badge per PRD 6.5 & Important Positioning */}
        <div
          style={{
            background: 'rgba(254, 240, 138, 0.15)',
            border: '1px solid rgba(254, 240, 138, 0.4)',
            color: '#FEF08A',
            fontSize: '10.5px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            padding: '2px 8px',
            borderRadius: 'var(--radius-xs)',
            textTransform: 'uppercase',
          }}
        >
          {t('brand.demo_tag')}
        </div>
      </div>

      {/* Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Reset Demo Data Button */}
        <button
          type="button"
          onClick={handleReset}
          className="btn btn-xs"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '11.5px',
          }}
          title="Reset synthetic data to pristine initial demonstration state"
        >
          <RotateCcw size={12} />
          <span>{t('common.reset_demo')}</span>
        </button>

        {/* Language Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <button
            type="button"
            onClick={() => setLanguage('en')}
            style={{
              background: language === 'en' ? 'var(--color-gov-blue)' : 'transparent',
              color: '#FFFFFF',
              border: 'none',
              padding: '2px 8px',
              fontSize: '11.5px',
              fontWeight: 600,
              borderRadius: '2px',
              cursor: 'pointer',
            }}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            style={{
              background: language === 'hi' ? 'var(--color-gov-blue)' : 'transparent',
              color: '#FFFFFF',
              border: 'none',
              padding: '2px 8px',
              fontSize: '11.5px',
              fontWeight: 600,
              borderRadius: '2px',
              cursor: 'pointer',
            }}
          >
            हिन्दी
          </button>
        </div>

        {/* Notifications Icon Button */}
        <button
          type="button"
          onClick={() => setActiveRoutePath('/notifications')}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            position: 'relative',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="View notifications"
        >
          <Bell size={18} />
          {failedCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: 'var(--color-red-text)',
                color: '#fff',
                borderRadius: '50%',
                width: '14px',
                height: '14px',
                fontSize: '9px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              !
            </span>
          )}
        </button>

        {/* Role Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '5px 10px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '12.5px',
            }}
            aria-expanded={showRoleMenu}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase' }}>
                {t('role.switch_title')}
              </div>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{currentUser.name}</span>
                <span style={{ opacity: 0.75, fontSize: '11px' }}>({currentUser.role.replace('_', ' ')})</span>
              </div>
            </div>
            <ChevronDown size={14} />
          </button>

          {showRoleMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '6px',
                width: '320px',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-border)',
                zIndex: 100,
                color: 'var(--color-text-main)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '10px 14px',
                  background: '#F8FAFC',
                  borderBottom: '1px solid var(--color-border)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                }}
              >
                Switch Demonstration Role
              </div>
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = currentUser.role === opt.role;
                  return (
                    <button
                      key={opt.role}
                      type="button"
                      onClick={() => handleRoleSelect(opt.role)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 14px',
                        background: isSelected ? 'var(--color-gov-blue-subtle)' : 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--color-border-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div
                        style={{
                          background: isSelected ? 'var(--color-gov-blue)' : '#EDF2F7',
                          color: isSelected ? '#FFFFFF' : 'var(--color-primary-navy)',
                          padding: '6px',
                          borderRadius: 'var(--radius-xs)',
                          marginTop: '2px',
                        }}
                      >
                        <Icon size={14} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: isSelected ? 'var(--color-gov-blue)' : 'var(--color-text-main)' }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          {opt.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div
                style={{
                  padding: '8px 14px',
                  background: '#F8FAFC',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                }}
              >
                Demonstration tool: pivots views, data filters, and actionable permissions instantly.
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
