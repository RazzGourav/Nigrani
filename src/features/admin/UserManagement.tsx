import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Users, UserCheck, Shield, Building2, CheckCircle2 } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { users, currentUser, switchRole } = useApp();
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={22} color="var(--color-gov-blue)" />
          <h1>{t('nav.users')}</h1>
        </div>
        <p className="subtitle">
          Manage system actor identities, regional jurisdiction assignments, and role-based access privileges.
        </p>
      </div>

      <div className="gov-table-container">
        <table className="gov-table" aria-label="System users table">
          <thead>
            <tr>
              <th scope="col">User Name & Email</th>
              <th scope="col">System Role</th>
              <th scope="col">Designation / Bureau</th>
              <th scope="col">Jurisdiction Scope</th>
              <th scope="col">Status</th>
              <th scope="col" style={{ textAlign: 'right' }}>Demo Session Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isCurrent = currentUser.id === u.id;
              return (
                <tr key={u.id} style={{ background: isCurrent ? 'var(--color-gov-blue-subtle)' : 'transparent' }}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-primary-navy)' }}>
                      {u.name} {isCurrent && <span className="badge badge-blue">Active Session</span>}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                      {u.email}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ fontSize: '12.5px' }}>{u.designation}</td>
                  <td>
                    <span className="badge badge-neutral">
                      {u.regionScope === 'All' ? 'National (All Regions)' : `${u.regionScope} Region`}
                    </span>
                    {u.institutionName && (
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {u.institutionName}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-green">{u.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {isCurrent ? (
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-gov-blue)' }}>
                        Current User
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => switchRole(u.role)}
                      >
                        <UserCheck size={12} />
                        <span>Switch Session</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
