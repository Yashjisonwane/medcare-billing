// src/components/modals/CreateBillModal.jsx
import React, { useState } from 'react';
import { Modal } from './Modal';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { useUIStore } from '../../store/uiStore';
import { DollarSign, Save, Tag, Receipt, Stethoscope } from 'lucide-react';

const inputCls = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

export const CreateBillModal = ({ isOpen, onClose, onBillCreated }) => {
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    providerId: 'prov-counselor',
    caseId: 'CASE-2025-1227',
    patientName: 'SAMPLE TESTING',
    statementNumber: `1024-${Math.floor(10 + Math.random() * 90)}`,
    dos: '2026-08-10',
    cptCode: '90834',
    description: 'Individual Psychotherapy (45 Min)',
    charge: '180.00',
    diagnosisCodes: 'F43.10, F41.1, M54.50'
  });

  const set = (field, val) => setFormData(p => ({ ...p, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const targetBillId = formData.providerId === 'prov-counselor' 
        ? 'bill-counselor-001' 
        : formData.providerId === 'prov-davs' 
        ? 'bill-davs-001' 
        : formData.providerId === 'prov-anik' 
        ? 'bill-anik-001' 
        : 'bill-josmic-001';

      const updated = await mockBillingService.addServiceLine(targetBillId, {
        dos: formData.dos,
        cptCode: formData.cptCode,
        description: formData.description,
        charge: parseFloat(formData.charge) || 180.00
      });

      addToast('New service line and provider bill generated successfully!', 'success');
      if (onBillCreated) onBillCreated(updated);
      onClose();
    } catch {
      addToast('Failed to create bill line item', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Provider Bill Statement &amp; Service Line"
      subtitle="Add itemized CPT procedure charges to patient accident case"
      icon={Receipt}
      size="lg"
      iconColor="text-teal-600"
      iconBg="bg-teal-50"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> {isLoading ? 'Posting...' : 'Post Bill Item'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Practice Care Provider */}
        <div>
          <label className={labelCls}>Select Practice Care Provider</label>
          <select
            value={formData.providerId}
            onChange={e => {
              const pid = e.target.value;
              let cpt = '99204';
              let desc = 'Initial Pain Management Consult';
              let fee = '1214.00';
              if (pid === 'prov-counselor') { cpt = '90834'; desc = 'Individual Psychotherapy (45 Min)'; fee = '180.00'; }
              if (pid === 'prov-davs') { cpt = '0101T'; desc = 'ESWT Shockwave Therapy Session'; fee = '1000.00'; }
              if (pid === 'prov-anik') { cpt = '97039'; desc = 'Laser Therapy Session'; fee = '2000.00'; }
              setFormData(p => ({ ...p, providerId: pid, cptCode: cpt, description: desc, charge: fee }));
            }}
            className={inputCls}
          >
            <option value="prov-counselor">Counselor Practice (Hope Behavioral Health)</option>
            <option value="prov-josmic">JOSMIC Wellness Center (Pain Management)</option>
            <option value="prov-davs">DAV'S Anatomy (Shockwave Therapy)</option>
            <option value="prov-anik">ANIK Laser Therapy (Laser Therapy)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Patient Name</label>
            <input className={inputCls} value={formData.patientName} onChange={e => set('patientName', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Accident Case ID</label>
            <input className={inputCls} value={formData.caseId} onChange={e => set('caseId', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Date of Service (DOS)</label>
            <input type="date" required className={inputCls} value={formData.dos} onChange={e => set('dos', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>CPT Procedure Code</label>
            <input required className={inputCls} value={formData.cptCode} onChange={e => set('cptCode', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Charge Amount ($)</label>
            <input type="number" step="0.01" required className={inputCls} value={formData.charge} onChange={e => set('charge', e.target.value)} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Service Description</label>
          <input required className={inputCls} value={formData.description} onChange={e => set('description', e.target.value)} />
        </div>

        <div>
          <label className={labelCls}>ICD-10 Diagnostic Codes (Box 21)</label>
          <input className={inputCls} value={formData.diagnosisCodes} onChange={e => set('diagnosisCodes', e.target.value)} />
        </div>
      </form>
    </Modal>
  );
};
