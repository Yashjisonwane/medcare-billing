// src/components/modals/UploadDocumentModal.jsx
import React, { useState } from 'react';
import { Modal } from './Modal';
import { mockDocumentService } from '../../services/mock/mockDocumentService';
import { useUIStore } from '../../store/uiStore';
import { UploadCloud, FileText, CheckCircle2, Save, X, Paperclip } from 'lucide-react';

const inputCls = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

export const UploadDocumentModal = ({ isOpen, onClose, patientId, patientName, onDocumentUploaded }) => {
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: 'Police_Accident_Report_HPD889201.pdf',
    type: 'Police Accident Report',
    providerName: 'JOSMIC Wellness Center',
    category: 'LEGAL',
    notes: 'Official police crash investigation report and witness statements for auto accident claim.',
  });

  const set = (field, val) => setFormData(p => ({ ...p, [field]: val }));

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      set('name', file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const created = await mockDocumentService.uploadDocument({
        ...formData,
        patientId: patientId || 'pat-001',
        patientName: patientName || 'Demo Patient',
        size: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.4 MB',
      });
      addToast(`Document "${created.name}" uploaded to patient profile successfully!`, 'success');
      if (onDocumentUploaded) onDocumentUploaded(created);
      onClose();
    } catch {
      addToast('Failed to upload document', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Patient Document &amp; Legal Attachment"
      subtitle={`Attach medical reports, insurance cards, MRI scans, or police reports to ${patientName || 'Patient'}`}
      icon={UploadCloud}
      size="lg"
      iconColor="text-teal-600"
      iconBg="bg-teal-50"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> {isLoading ? 'Uploading...' : 'Save & Attach Document'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drag & Drop File Picker */}
        <div className="relative border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/30 rounded-2xl p-6 text-center transition cursor-pointer group">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg,.docx"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-teal-100 group-hover:bg-teal-200 text-teal-700 flex items-center justify-center transition">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 group-hover:text-teal-900">
                {selectedFile ? selectedFile.name : 'Click to Browse or Drag & Drop File'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Supported formats: PDF, PNG, JPG, DOCX (Max size: 25 MB)
              </p>
            </div>
            {selectedFile && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Ready to Upload ({(selectedFile.size / 1024).toFixed(0)} KB)
              </span>
            )}
          </div>
        </div>

        {/* Document Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Document Name *</label>
            <input
              required
              className={inputCls}
              value={formData.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Police_Report_2026.pdf"
            />
          </div>

          <div>
            <label className={labelCls}>Document Category / Type</label>
            <select
              className={inputCls}
              value={formData.type}
              onChange={e => set('type', e.target.value)}
            >
              <option value="Police Accident Report">Police Crash / Accident Report</option>
              <option value="Auto Insurance Card / Policy">Auto Insurance Card / Policy</option>
              <option value="Signed Attorney LOP">Signed Attorney Letter of Protection (LOP)</option>
              <option value="MRI & Radiology Diagnostic Scan">MRI &amp; Radiology Diagnostic Scan</option>
              <option value="External Physician Referral">External Physician Referral</option>
              <option value="Medical Narrative Report">Medical Narrative Report</option>
              <option value="Itemized Billing Statement">Itemized Billing Statement</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Associated Practice Provider</label>
            <select
              className={inputCls}
              value={formData.providerName}
              onChange={e => set('providerName', e.target.value)}
            >
              <option value="JOSMIC Wellness Center">JOSMIC Wellness Center (Pain Mgmt)</option>
              <option value="DAV'S Anatomy">DAV'S Anatomy (Shockwave ESWT)</option>
              <option value="ANIK Laser Therapy">ANIK Laser Therapy (Class IV Laser)</option>
              <option value="Counselor Practice">Counselor Practice (Hope Behavioral Health)</option>
              <option value="External / Attorney">External / Attorney / Legal LOP</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Access Permission</label>
            <select className={inputCls} defaultValue="ALL_STAFF">
              <option value="ALL_STAFF">All Clinic Staff &amp; Doctors</option>
              <option value="BILLING_ONLY">Billing &amp; Legal Team Only</option>
              <option value="DOCTORS_ONLY">Treating Physicians Only</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Clinical / Legal Notes &amp; Remarks</label>
          <textarea
            rows={2}
            className={inputCls}
            value={formData.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Additional notes about this document..."
          />
        </div>
      </form>
    </Modal>
  );
};
