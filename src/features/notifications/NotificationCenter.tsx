import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { SystemNotification } from '../../types';
import {
  Bell,
  Mail,
  MessageSquare,
  AlertOctagon,
  RotateCcw,
  CheckCircle,
  Eye,
  Filter,
  ArrowRight,
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    retryNotification,
    setSelectedAppId,
    setActiveRoutePath,
  } = useApp();
  const { t } = useLanguage();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedNotif, setSelectedNotif] = useState<SystemNotification | null>(null);

  const filteredNotifs = notifications.filter((n) => {
    if (statusFilter !== 'ALL' && n.status !== statusFilter) return false;
    return true;
  });

  const handleOpenLinked = (linkedCase: string) => {
    const appId = linkedCase.replace('DEF-', '');
    setSelectedAppId(appId);
    setActiveRoutePath('/applications');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={22} color="var(--color-gov-blue)" />
          <h1>{t('nav.notifications')}</h1>
        </div>
        <p className="subtitle">
          Observe automated reminder dispatch, multi-channel statutory alerts (Email, SMS, Portal Notice), and transmission failure outcomes.
        </p>
      </div>

      {/* Honest Simulation Disclaimer per PRD 8.14 */}
      <div
        style={{
          background: '#F8FAFC',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          fontSize: '12px',
          color: 'var(--color-text-muted)',
        }}
      >
        <strong>Simulated Notification Adapter:</strong> Transmission outcomes reflect mock SMTP and SMS gateway telemetry. Failed dispatches provide actionable retry capabilities.
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '2px solid var(--color-border)', paddingBottom: '2px' }}>
        {['ALL', 'Scheduled', 'Sent', 'Failed', 'Retried', 'Escalated'].map((st) => (
          <button
            key={st}
            type="button"
            className={`tab-btn ${statusFilter === st ? 'active' : ''}`}
            onClick={() => setStatusFilter(st)}
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            {st === 'ALL' ? 'All Alerts' : st}
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                background: '#EDF2F7',
                padding: '1px 5px',
                borderRadius: '8px',
                color: 'var(--color-text-main)',
              }}
            >
              {st === 'ALL' ? notifications.length : notifications.filter((n) => n.status === st).length}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications Table per PRD 8.14 */}
      <div className="gov-table-container">
        <table className="gov-table" aria-label="System Notifications table">
          <thead>
            <tr>
              <th scope="col">Dispatched / Created</th>
              <th scope="col">Recipient & Role</th>
              <th scope="col">Linked Obligation</th>
              <th scope="col">Alert Type</th>
              <th scope="col">Channel</th>
              <th scope="col">Delivery Outcome</th>
              <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifs.map((n) => {
              const isFailed = n.status === 'Failed';
              return (
                <tr key={n.id} className={isFailed ? 'row-overdue' : ''}>
                  <td style={{ fontSize: '12.5px', fontVariantNumeric: 'tabular-nums' }}>
                    {n.createdAt}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{n.recipient}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      Role: {n.role}
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleOpenLinked(n.linkedObligation)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-gov-blue)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {n.linkedObligation}
                    </button>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{n.messageType}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px' }}>
                      {n.channel === 'Email' ? <Mail size={13} /> : <MessageSquare size={13} />}
                      <span>{n.channel}</span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={n.status} />
                    {n.errorSummary && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-red-text)',
                          marginTop: '4px',
                          maxWidth: '220px',
                        }}
                      >
                        {n.errorSummary}
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      {isFailed && (
                        <button
                          type="button"
                          className="btn btn-primary btn-xs"
                          onClick={() => {
                            retryNotification(n.id);
                            alert(`Notification ${n.id} re-queued and dispatched successfully.`);
                          }}
                        >
                          <RotateCcw size={12} />
                          <span>Retry</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => setSelectedNotif(n)}
                      >
                        <Eye size={12} />
                        <span>Preview</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Message Preview Modal */}
      {selectedNotif && (
        <Modal
          isOpen={Boolean(selectedNotif)}
          onClose={() => setSelectedNotif(null)}
          title={`Message Dispatch Preview — ${selectedNotif.messageType}`}
          subtitle={`Dispatched to ${selectedNotif.recipient} via ${selectedNotif.channel}`}
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div>
                <StatusBadge status={selectedNotif.status} />
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedNotif(null)}
              >
                Close
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                <strong>Linked File:</strong> {selectedNotif.linkedObligation} • <strong>Timestamp:</strong> {selectedNotif.createdAt}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Dispatched Content Payload</label>
              <div
                style={{
                  background: '#FFFFFF',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedNotif.messageBody}
              </div>
            </div>

            {selectedNotif.errorSummary && (
              <div style={{ background: 'var(--color-red-bg)', border: '1px solid var(--color-red-border)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--color-red-text)' }}>
                  GATEWAY EXCEPTION:
                </div>
                <div style={{ fontSize: '12px', marginTop: '2px', color: 'var(--color-text-main)' }}>
                  {selectedNotif.errorSummary}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
