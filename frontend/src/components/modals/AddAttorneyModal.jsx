// src/components/modals/AddAttorneyModal.jsx
import React, { useState } from 'react';
import { Modal } from './Modal';
import { mockAttorneyService } from '../../services/mock/mockAttorneyService';
import { useUIStore } from '../../store/uiStore';
import { Scale, Save, Building, Phone, Mail, MapPin, User, CheckCircle2 } from 'lucide-react';

const inputCls = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

export const AddAttorneyModal = ({ isOpen, onClose, onAttorneyAdded }) => {
  const { addToast } = useUIStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    phone: '',
    email: '',
    address: '',
    caseManager: '',
    lienAgreementType: 'LETTER_OF_PROTECTION'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.firm.trim()) {
      addToast('Please enter both Attorney Name and Law Firm Name', 'warning');
      return;
    }

    setLoading(true);
    try {
      const added = await mockAttorneyService.createAttorney(formData);
      addToast(`Law Firm "${added.firm}" registered to clinic network!`, 'success');
      if (onAttorneyAdded) onAttorneyAdded(added);
      onClose();
    } catch {
      addToast('Failed to register law firm', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Attorney & Law Firm"
      subtitle="Add legal partner, Letter of Protection (LOP) lien agreement & billing contacts"
      icon={Scale}
      size="lg"
      iconColor="text-teal-700"
      iconBg="bg-teal-50"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Register Law Firm'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-teal-600" /> Law Firm &amp; Lead Attorney
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Law Firm Legal Name *</label>
              <input
                required
                className={inputCls}
                placeholder="e.g. Davis & Associates Injury Law Group"
                value={formData.firm}
                onChange={e => setFormData({ ...formData, firm: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Lead Attorney Full Name *</label>
              <input
                required
                className={inputCls}
                placeholder="e.g. Sarah Jenkins, Esq."
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Direct Phone / Office</label>
              <input
                type="tel"
                className={inputCls}
                placeholder="713-555-0188"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Lien Records / Billing Email</label>
              <input
                type="email"
                className={inputCls}
                placeholder="records@lawoffice.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Law Firm Physical / Mailing Address</label>
            <input
              className={inputCls}
              placeholder="e.g. 1001 Fannin St. Suite 1200, Houston TX 77002"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <User className="w-4 h-4 text-teal-600" /> Case Management &amp; Lien Agreement
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Assigned Legal Case Manager</label>
              <input
                className={inputCls}
                placeholder="e.g. Maria Gonzalez (Direct: 713-555-0300)"
                value={formData.caseManager}
                onChange={e => setFormData({ ...formData, caseManager: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Lien Agreement Default</label>
              <select
                className={inputCls}
                value={formData.lienAgreementType}
                onChange={e => setFormData({ ...formData, lienAgreementType: e.target.value })}
              >
                <option value="LETTER_OF_PROTECTION">Letter of Protection (LOP)</option>
                <option value="MEDICAL_LIEN">Direct Medical Lien (Texas Property Code)</option>
                <option value="PIP_ASSIGNMENT">PIP / MedPay Assignment</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
