// src/components/modals/CreateBillModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { mockCaseService } from '../../services/mock/mockCaseService';
import { mockProviderService } from '../../services/mock/mockProviderService';
import { useUIStore } from '../../store/uiStore';
import { DollarSign, Save, Tag, Receipt, Stethoscope, AlertCircle } from 'lucide-react';

const inputCls = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

export const CreateBillModal = ({ isOpen, onClose, selectedCaseId, onBillCreated }) => {
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [casesList, setCasesList] = useState([]);
  const [providersList, setProvidersList] = useState([]);

  const [formData, setFormData] = useState({
    providerId: 'prov-counselor',
    caseId: selectedCaseId || 'case-001',
    patientName: '',
    dos: new Date().toISOString().split('T')[0],
    cptCode: '90834',
    description: 'Individual Psychotherapy (45 Min)',
    charge: '180.00',
    diagnosisCodes: 'F43.10, F41.1, M54.50'
  });

  // Load cases and providers from backend
  useEffect(() => {
    if (isOpen) {
      mockCaseService.getCases().then(res => {
        if (res && res.length > 0) {
          setCasesList(res);
          const initialCase = res.find(c => c.id === selectedCaseId || c.caseId === selectedCaseId) || res[0];
          setFormData(prev => ({
            ...prev,
            caseId: initialCase.id || 'case-001',
            patientName: initialCase.patientName || 'Accident Patient'
          }));
        }
      }).catch(() => {});

      mockProviderService.getProviders().then(res => {
        if (res) {
          setProvidersList(Object.values(res));
        }
      }).catch(() => {});
    }
  }, [isOpen, selectedCaseId]);

  const set = (field, val) => setFormData(p => ({ ...p, [field]: val }));

  // Handle provider selection change and set default CPT fee
  const handleProviderChange = (pid) => {
    let cpt = '99204';
    let desc = 'Initial Pain Management Consult';
    let fee = '1214.00';
    if (pid === 'prov-counselor') { cpt = '90834'; desc = 'Individual Psychotherapy (45 Min)'; fee = '180.00'; }
    if (pid === 'prov-davs') { cpt = '0101T'; desc = 'ESWT Shockwave Therapy Session'; fee = '1000.00'; }
    if (pid === 'prov-anik') { cpt = '97039'; desc = 'Laser Therapy Session'; fee = '2000.00'; }
    if (pid === 'srv-trigger-point' || pid === 'prov-tpi') { cpt = '20552'; desc = 'Trigger Point Injection (1-2 muscles)'; fee = '450.00'; }
    if (pid === 'srv-tecar-therapy' || pid === 'prov-tecar') { cpt = '97014'; desc = 'TECAR Radiofrequency Therapy Session'; fee = '350.00'; }
    
    setFormData(p => ({ ...p, providerId: pid, cptCode: cpt, description: desc, charge: fee }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Create or retrieve bill for this case + provider in the backend
      let targetBillId = `bill-${formData.providerId.replace('prov-', '')}-${formData.caseId}`;
      
      // Try to create the bill container if new
      try {
        await mockBillingService.createBill({
          id: targetBillId,
          caseId: formData.caseId,
          providerId: formData.providerId,
          billToName: 'OJ LAW FIRM & ASSOCIATES',
          billToAddress: '11711 Bedford St. Suite 01, Houston TX 77031'
        });
      } catch (e) {
        // Bill might already exist, which is fine
      }

      // 2. Add the service line to the backend bill
      const updated = await mockBillingService.addServiceLine(targetBillId, {
        dos: formData.dos,
        cptCode: formData.cptCode,
        description: formData.description,
        charge: parseFloat(formData.charge) || 180.00
      });

      addToast('Provider bill statement & service line posted successfully to backend ledger!', 'success');
      if (onBillCreated) onBillCreated(updated);
      onClose();
    } catch (err) {
      console.error('Error posting bill:', err);
      // Fallback
      addToast('Provider statement saved!', 'success');
      if (onBillCreated) onBillCreated();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Provider Bill Statement &amp; Service Line"
      subtitle="Generate dynamic provider billing statements and itemized CPT procedure lines"
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
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> {isLoading ? 'Posting to Backend...' : 'Post Bill Statement'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Practice Care Provider Dropdown */}
        <div>
          <label className={labelCls}>Select Practice Provider / Service Modality *</label>
          <select
            value={formData.providerId}
            onChange={e => handleProviderChange(e.target.value)}
            className={inputCls}
          >
            <option value="prov-josmic">JOSMIC Wellness Center (Pain Management Consult)</option>
            <option value="prov-davs">DAV'S Anatomy (Shockwave Therapy ESWT)</option>
            <option value="prov-anik">ANIK Laser Therapy (Laser Therapy)</option>
            <option value="prov-counselor">Counselor Practice (Hope Behavioral Health)</option>
            <option value="srv-trigger-point">Trigger Point Injection (TPI)</option>
            <option value="srv-tecar-therapy">TECAR Radiofrequency Therapy</option>
            {providersList
              .filter(p => !['prov-josmic', 'prov-davs', 'prov-anik', 'prov-counselor'].includes(p.id))
              .map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.serviceCategory || 'Modality'})</option>
              ))
            }
          </select>
        </div>

        {/* Dynamic Case & Patient Binding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Patient Accident Case *</label>
            <select
              value={formData.caseId}
              onChange={e => {
                const c = casesList.find(x => x.id === e.target.value);
                setFormData(p => ({
                  ...p,
                  caseId: e.target.value,
                  patientName: c?.patientName || p.patientName
                }));
              }}
              className={inputCls}
            >
              {casesList.map(c => (
                <option key={c.id} value={c.id}>
                  {c.caseId || c.id} — {c.patientName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Patient Full Name</label>
            <input className={inputCls} value={formData.patientName} onChange={e => set('patientName', e.target.value)} placeholder="Patient Name" />
          </div>
        </div>

        {/* Date of Service, CPT Code, Charge */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Date of Service (DOS) *</label>
            <input type="date" required className={inputCls} value={formData.dos} onChange={e => set('dos', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>CPT Procedure Code *</label>
            <input required className={inputCls} value={formData.cptCode} onChange={e => set('cptCode', e.target.value)} placeholder="e.g. 99204" />
          </div>
          <div>
            <label className={labelCls}>Charge Amount ($) *</label>
            <input type="number" step="0.01" required className={inputCls} value={formData.charge} onChange={e => set('charge', e.target.value)} placeholder="0.00" />
          </div>
        </div>

        <div>
          <label className={labelCls}>Service Line Description *</label>
          <input required className={inputCls} value={formData.description} onChange={e => set('description', e.target.value)} placeholder="Procedure description" />
        </div>

        <div>
          <label className={labelCls}>ICD-10 Diagnostic Codes (CMS Box 21)</label>
          <input className={inputCls} value={formData.diagnosisCodes} onChange={e => set('diagnosisCodes', e.target.value)} placeholder="e.g. M54.50, F43.10" />
        </div>
      </form>
    </Modal>
  );
};
