import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { UrgencyBadge } from '../../components/common/UrgencyBadge';
import { DocumentUploadModal } from './DocumentUploadModal';
import { Modal } from '../../components/common/Modal';
import { DocumentRenewal } from '../../types';
import {
  FileText,
  Upload,
  CheckCircle,
  FileSearch,
  Clock,
  Eye,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const DocumentsList: React.FC = () => {
  const {
    documents,
    currentUser,
    submitDocumentRenewal,
    verifyDocumentRenewal,
    setSelectedAppId,
    setActiveRoutePath,
  } = useApp();
  const { t } = useLanguage();

  const [activeUploadDoc, setActiveUploadDoc] = useState<DocumentRenewal | null>(null);
  const [activeInspectOCR, setActiveInspectOCR] = useState<DocumentRenewal | null>(null);
  const [docTypeFilter, setDocTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Role scoping per PRD 4.2
  const scopedDocs =
    currentUser.role === 'institution'
      ? documents.filter((d) => d.institutionName === (currentUser.institutionName || 'North Valley Institute of Technology'))
      : documents;

  const filteredDocs = scopedDocs.filter((d) => {
    if (docTypeFilter !== 'ALL' && d.documentType !== docTypeFilter) return false;
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    return true;
  });

  const isInstitution = currentUser.role === 'institution';
  const isOfficer =
    currentUser.role === 'regional_officer' ||
    currentUser.role === 'bureau_officer' ||
    currentUser.role === 'admin';

  const handleOpenApp = (id: string) => {
    setSelectedAppId(id);
    setActiveRoutePath('/applications');
  };

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
            <FileText size={22} color="var(--color-gov-blue)" />
            <h1>{t('nav.documents')}</h1>
          </div>
          <p className="subtitle">
            Monitor statutory clearances, land title lease deeds, fire safety NOCs, and OCR-assisted expiration tracking.
          </p>
        </div>

        {isInstitution && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setActiveUploadDoc(documents[0] || null)}
          >
            <Upload size={14} />
            <span>Upload Renewal Document</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div
        className="gov-card"
        style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Document Type:
          </span>
          <select
            className="form-select"
            value={docTypeFilter}
            onChange={(e) => setDocTypeFilter(e.target.value)}
            style={{ height: '32px', fontSize: '12.5px', padding: '0 8px' }}
          >
            <option value="ALL">All Documents</option>
            <option value="Land Lease Deed">Land Lease Deed</option>
            <option value="Fire Safety NOC">Fire Safety NOC</option>
            <option value="Building Stability Certificate">Building Stability Certificate</option>
            <option value="Occupancy Certificate">Occupancy Certificate</option>
            <option value="NBA Accreditation">NBA Accreditation</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Validity Status:
          </span>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ height: '32px', fontSize: '12.5px', padding: '0 8px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Valid">Valid</option>
            <option value="Due soon">Due soon (≤30 Days)</option>
            <option value="Expired">Expired</option>
            <option value="Renewal submitted">Renewal submitted</option>
            <option value="Awaiting verification">Awaiting verification</option>
          </select>
        </div>

        {(docTypeFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <button
            type="button"
            className="btn btn-secondary btn-xs"
            onClick={() => {
              setDocTypeFilter('ALL');
              setStatusFilter('ALL');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Operational Grid per PRD 8.12 */}
      <div className="gov-table-container">
        <table className="gov-table" aria-label="Documents and Renewals">
          <thead>
            <tr>
              <th scope="col">Document ID</th>
              <th scope="col">Institution</th>
              <th scope="col">Document Classification</th>
              <th scope="col">Application Ref</th>
              <th scope="col">Start Date</th>
              <th scope="col">Expiry Date</th>
              <th scope="col">Days Remaining</th>
              <th scope="col">Renewal Status</th>
              <th scope="col">Scrutiny Reviewer</th>
              <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc) => (
              <tr key={doc.id}>
                <td style={{ fontWeight: 600 }}>{doc.id}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{doc.institutionName}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{doc.documentType}</div>
                  {doc.ocrData && (
                    <button
                      type="button"
                      onClick={() => setActiveInspectOCR(doc)}
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-gov-blue)',
                        background: 'var(--color-gov-blue-subtle)',
                        border: '1px solid #B9D9EB',
                        padding: '2px 7px',
                        borderRadius: '3px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '3px',
                        cursor: 'pointer',
                      }}
                      title="Inspect OCR Assisted Field Extraction"
                    >
                      <Sparkles size={11} />
                      <span>Inspect OCR ({doc.ocrData.confidence}%)</span>
                    </button>
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleOpenApp(doc.applicationRef)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-gov-blue)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {doc.applicationRef}
                  </button>
                </td>
                <td style={{ fontSize: '12.5px' }}>{doc.issueDate}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{doc.expiryDate}</div>
                </td>
                <td>
                  <UrgencyBadge days={doc.daysUntilExpiry} />
                </td>
                <td>
                  <StatusBadge status={doc.status} />
                </td>
                <td style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {doc.reviewer}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    {doc.ocrData && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => setActiveInspectOCR(doc)}
                        title="View OCR Extraction and Source Snippet"
                      >
                        <FileSearch size={12} />
                        <span>OCR</span>
                      </button>
                    )}

                    {isInstitution && (doc.status === 'Due soon' || doc.status === 'Expired') && (
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        onClick={() => setActiveUploadDoc(doc)}
                      >
                        <Upload size={12} />
                        <span>Renew</span>
                      </button>
                    )}

                    {isOfficer && (doc.status === 'Renewal submitted' || doc.status === 'Awaiting verification') && (
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        onClick={() => {
                          verifyDocumentRenewal(doc.id, true);
                          alert(`Document ${doc.id} verified and updated to Valid.`);
                        }}
                      >
                        <CheckCircle size={12} />
                        <span>Verify</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Renewal Modal */}
      {activeUploadDoc && (
        <DocumentUploadModal
          isOpen={Boolean(activeUploadDoc)}
          onClose={() => setActiveUploadDoc(null)}
          documentItem={activeUploadDoc}
          onSubmit={(docId, newExpiry, fileName) => {
            submitDocumentRenewal(docId, newExpiry, fileName);
          }}
        />
      )}

      {/* OCR Inspection Modal per PRD 5.2, 8.12, 11.1 */}
      {activeInspectOCR && (
        <Modal
          isOpen={Boolean(activeInspectOCR)}
          onClose={() => setActiveInspectOCR(null)}
          title={`OCR Extraction Dossier — ${activeInspectOCR.documentType}`}
          subtitle={`${activeInspectOCR.id} • ${activeInspectOCR.institutionName}`}
          footer={
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveInspectOCR(null)}
            >
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                background: '#FEF08A',
                border: '1px solid #CA8A04',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                color: '#854D0E',
              }}
            >
              <strong>GIGW & APH Regulatory Rule:</strong> OCR extracted fields are advisory aids. Human scrutiny officer verification is mandatory before updating statutory validity.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Confidence Score</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-gov-blue)' }}>
                  {activeInspectOCR.ocrData?.confidence}%
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Human Reviewer Endorsement</div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
                  {activeInspectOCR.ocrData?.verifiedByReviewer ? 'Verified' : 'Pending Verification'}
                </div>
              </div>
            </div>

            <dl style={{ display: 'grid', gridTemplateColumns: '150px 1fr', rowGap: '8px', fontSize: '12.5px' }}>
              <dt style={{ color: 'var(--color-text-muted)' }}>Extracted Lessee:</dt>
              <dd style={{ fontWeight: 600 }}>{activeInspectOCR.ocrData?.extractedLessee}</dd>

              <dt style={{ color: 'var(--color-text-muted)' }}>Survey / Plot No.:</dt>
              <dd style={{ fontWeight: 600 }}>{activeInspectOCR.ocrData?.extractedSurveyNo}</dd>

              <dt style={{ color: 'var(--color-text-muted)' }}>Start Date:</dt>
              <dd>{activeInspectOCR.ocrData?.extractedLeaseStart}</dd>

              <dt style={{ color: 'var(--color-text-muted)' }}>Calculated Expiry:</dt>
              <dd style={{ fontWeight: 700, color: 'var(--color-red-text)' }}>
                {activeInspectOCR.ocrData?.extractedLeaseEnd}
              </dd>
            </dl>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                SOURCE DOCUMENT EVIDENCE SNIPPET
              </div>
              <div
                style={{
                  padding: '12px',
                  background: '#F8FAFC',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '11.5px',
                  lineHeight: 1.5,
                  color: 'var(--color-text-main)',
                }}
              >
                {activeInspectOCR.ocrData?.sourceTextSnippet}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
