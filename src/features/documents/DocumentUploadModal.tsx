import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { DocumentRenewal } from '../../types';
import { Upload, FileSearch, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentItem?: DocumentRenewal | null;
  onSubmit: (docId: string, newExpiry: string, fileName: string) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  documentItem,
  onSubmit,
}) => {
  const [docType, setDocType] = useState(documentItem?.documentType || 'Land Lease Deed');
  const [fileName, setFileName] = useState('Registered_Land_Lease_Extension_Deed_2026.pdf');
  const [expiryDate, setExpiryDate] = useState('2056-11-14');
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const [showOCRSuggestions, setShowOCRSuggestions] = useState(true);

  const handleSimulateOCR = () => {
    setIsOCRProcessing(true);
    setTimeout(() => {
      setIsOCRProcessing(false);
      setShowOCRSuggestions(true);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expiryDate) {
      alert('Please enter or confirm the renewal expiration date.');
      return;
    }
    onSubmit(documentItem?.id || 'DOC-NEW', expiryDate, fileName);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Statutory Document & Renew Validity"
      subtitle={documentItem ? `${documentItem.id} • ${documentItem.institutionName}` : 'New Document Verification'}
      footer={
        <>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit}>
            <Upload size={14} />
            <span>Confirm & Submit for Review</span>
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-group">
          <label className="form-label">Document Classification *</label>
          <select
            className="form-select"
            value={docType}
            onChange={(e) => setDocType(e.target.value as any)}
          >
            <option value="Land Lease Deed">Land Lease Deed (Registered 30+ Years)</option>
            <option value="Fire Safety NOC">Fire Safety NOC (Chief Fire Officer)</option>
            <option value="Building Stability Certificate">Building Stability Certificate (Form-B)</option>
            <option value="Occupancy Certificate">Occupancy Certificate (Municipal Body)</option>
            <option value="NBA Accreditation">NBA Accreditation Certificate</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Attached Document File *</label>
          <div
            style={{
              border: '2px dashed var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              textAlign: 'center',
              background: '#F8FAFC',
            }}
          >
            <Upload size={24} color="var(--color-gov-blue)" style={{ margin: '0 auto 6px auto' }} />
            <div style={{ fontWeight: 600, fontSize: '13px' }}>{fileName}</div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
              PDF format with registrar stamp & seal
            </div>
          </div>
        </div>

        {/* Simulated OCR Extraction Panel per PRD 5.2, 8.12, 11.1 & 17 */}
        <div
          style={{
            background: 'var(--color-gov-blue-subtle)',
            border: '1px solid #B9D9EB',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileSearch size={16} color="var(--color-gov-blue)" />
              <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-primary-navy)' }}>
                Simulated OCR Assisted Field Extraction
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                background: '#FEF08A',
                color: '#854D0E',
                padding: '2px 6px',
                borderRadius: '3px',
              }}
            >
              Confidence: 94.2%
            </span>
          </div>

          <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
            <strong>Advisory Safeguard:</strong> Extracted values are <em>unconfirmed suggestions</em> and must be reviewed against the deed before statutory acceptance.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
            <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>Extracted Lessee:</div>
              <div style={{ fontWeight: 600 }}>North Valley Educational Society</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>Survey / Plot No.:</div>
              <div style={{ fontWeight: 600 }}>Plot 84/2A & 84/3, Sector II</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>Lease Term Start:</div>
              <div style={{ fontWeight: 600 }}>15 Nov 1996</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>Extension Term End:</div>
              <div style={{ fontWeight: 600, color: 'var(--color-gov-blue)' }}>14 Nov 2056</div>
            </div>
          </div>

          <div
            style={{
              marginTop: '10px',
              fontSize: '11px',
              background: '#FFFFFF',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid var(--color-border-subtle)',
              fontFamily: 'monospace',
              color: 'var(--color-text-muted)',
            }}
          >
            Snippet: "...THIS EXTENSION OF LEASE registered on Vol 429 Page 12 between Development Authority and North Valley Society for a further term of thirty (30) years until 14th November 2056..."
          </div>
        </div>

        {/* Human Confirmed Date Field */}
        <div className="form-group">
          <label className="form-label">
            Confirmed New Expiration Date <span className="required">*</span>
          </label>
          <input
            type="date"
            className="form-input"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
          <span className="form-helper">
            Official confirmed expiry date used for automated alert calculation.
          </span>
        </div>
      </form>
    </Modal>
  );
};
