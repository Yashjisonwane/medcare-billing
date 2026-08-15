// src/components/modals/AddCaseModal.jsx
import React, { useState } from 'react';
import { Modal } from './Modal';
import { mockCaseService } from '../../services/mock/mockCaseService';
import { DynamicDiagnosisPicker } from '../common/DynamicDiagnosisPicker';
import { useUIStore } from '../../store/uiStore';
import { FileSpreadsheet, Save, Shield, User, Stethoscope, Scale, PlusCircle } from 'lucide-react';

const inputCls = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

export const AddCaseModal = ({ isOpen, onClose, onCaseAdded }) => {
  const { addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState('ACCIDENT'); // ACCIDENT | LEGAL | CLINICAL
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientId: 'pat-001',
    patientName: 'Demo Patient 001 (SAMPLE TESTING)',
    patientDob: '1985-05-15',
    patientPhone: '713-555-0100',
    accidentDate: '2025-12-27',
    initialDate: '2025-12-30',
    dischargeDate: '2026-01-26',
    accidentType: 'AUTO_ACCIDENT',
    accidentState: 'TX',
    accidentCity: 'Houston',
    accidentLocation: 'Interstate 10 Westbound near Exit 747',
    mechanismOfInjury: 'Motor Vehicle Accident (Rear-end collision)',
    policeReportNumber: 'HPD-2025-889201',
    emergencyTransport: 'AMBULANCE',
    chiefComplaint: 'Neck pain, lower back pain, vehicular anxiety post-collision',
    injuryBodyParts: 'Cervical spine, lumbar spine, head',
    diagnosisCodes: ['M54.6', 'M54.50', 'S13.4XXA', 'S39.012A'],
    referringProviderName: 'Anthony Nguyen, MD',
    referringProviderNpi: '1234567890',
    attorneyName: 'OJ Lawal & Associates',
    lawFirm: 'OJ Law Firm & Associates LLC',
    attorneyPhone: '713-555-0188',
    attorneyEmail: 'attorney@ojlawfirm.com',
    lawFirmAddress: '11711 Bedford St. Suite 01, Houston TX 77031',
    litigationStatus: 'PRE_LITIGATION',
    insuranceCompany: 'Example Auto Insurance Co.',
    insurancePolicyNumber: 'POL-9928374',
    insuranceClaimNumber: 'CLM-2025-88192',
    insuranceAdjuster: 'James Wilson',
    insuranceAdjusterPhone: '800-555-0299',
    liabilityStatus: 'LIABILITY_ACCEPTED',
    assignedProviderIds: ['prov-josmic', 'prov-davs', 'prov-anik', 'prov-counselor'],
    caseNotes: 'Accident case linking JOSMIC, DAVS, ANIK, and Counselor Practice bills.'
  });

  const set = (field, val) => setFormData(p => ({ ...p, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const created = await mockCaseService.createCase(formData);
      addToast(`Accident Case ${created.caseId || 'CASE-2026'} created successfully!`, 'success');
      if (onCaseAdded) onCaseAdded(created);
      onClose();
    } catch {
      addToast('Failed to create accident case', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Accident &amp; Legal Case"
      subtitle="Link patient injuries to attorney lien, insurance policy &amp; 4 provider ledgers"
      icon={FileSpreadsheet}
      size="2xl"
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
            <Save className="w-4 h-4" /> {isLoading ? 'Creating Case...' : 'Create Accident Case'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('ACCIDENT')}
            className={`pb-2 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ACCIDENT' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> 1. Accident &amp; Injury
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LEGAL')}
            className={`pb-2 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'LEGAL' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Scale className="w-3.5 h-3.5" /> 2. Legal Lien &amp; Auto Insurance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CLINICAL')}
            className={`pb-2 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'CLINICAL' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" /> 3. Dynamic Diagnoses (ICD-10)
          </button>
        </div>

        {/* Tab 1: Accident Information */}
        {activeTab === 'ACCIDENT' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Patient Name *</label>
                <input required className={inputCls} value={formData.patientName} onChange={e => set('patientName', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Date of Birth</label>
                <input type="date" className={inputCls} value={formData.patientDob} onChange={e => set('patientDob', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Patient Phone</label>
                <input type="tel" className={inputCls} value={formData.patientPhone} onChange={e => set('patientPhone', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Date of Accident *</label>
                <input type="date" required className={inputCls} value={formData.accidentDate} onChange={e => set('accidentDate', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Accident Type</label>
                <select className={inputCls} value={formData.accidentType} onChange={e => set('accidentType', e.target.value)}>
                  <option value="AUTO_ACCIDENT">Auto Accident (MVA)</option>
                  <option value="SLIP_AND_FALL">Slip &amp; Fall</option>
                  <option value="WORKERS_COMP">Worker's Comp</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Police Report #</label>
                <input className={inputCls} value={formData.policeReportNumber} onChange={e => set('policeReportNumber', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Accident Location / Street</label>
                <input className={inputCls} value={formData.accidentLocation} onChange={e => set('accidentLocation', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Mechanism of Injury</label>
                <input className={inputCls} value={formData.mechanismOfInjury} onChange={e => set('mechanismOfInjury', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Initial Treatment Date</label>
                <input type="date" className={inputCls} value={formData.initialDate} onChange={e => set('initialDate', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Estimated Discharge Date</label>
                <input type="date" className={inputCls} value={formData.dischargeDate} onChange={e => set('dischargeDate', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Legal & Insurance */}
        {activeTab === 'LEGAL' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Attorney Name</label>
                <input className={inputCls} value={formData.attorneyName} onChange={e => set('attorneyName', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Law Firm</label>
                <input className={inputCls} value={formData.lawFirm} onChange={e => set('lawFirm', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Attorney Phone</label>
                <input className={inputCls} value={formData.attorneyPhone} onChange={e => set('attorneyPhone', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Attorney Email</label>
                <input className={inputCls} value={formData.attorneyEmail} onChange={e => set('attorneyEmail', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Litigation Status</label>
                <select className={inputCls} value={formData.litigationStatus} onChange={e => set('litigationStatus', e.target.value)}>
                  <option value="PRE_LITIGATION">Pre-Litigation (LOP)</option>
                  <option value="IN_LITIGATION">In Litigation (Lawsuit Filed)</option>
                  <option value="SETTLED">Settled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200 pt-2">
              <div>
                <label className={labelCls}>Auto Insurance Carrier</label>
                <input className={inputCls} value={formData.insuranceCompany} onChange={e => set('insuranceCompany', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Claim Number</label>
                <input className={inputCls} value={formData.insuranceClaimNumber} onChange={e => set('insuranceClaimNumber', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Adjuster Name &amp; Phone</label>
                <input className={inputCls} value={`${formData.insuranceAdjuster} (${formData.insuranceAdjusterPhone})`} onChange={e => set('insuranceAdjuster', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Providers & Diagnoses */}
        {activeTab === 'CLINICAL' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Referring Physician</label>
                <input className={inputCls} value={formData.referringProviderName} onChange={e => set('referringProviderName', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Referring Provider NPI</label>
                <input className={inputCls} value={formData.referringProviderNpi} onChange={e => set('referringProviderNpi', e.target.value)} />
              </div>
            </div>

            {/* Dynamic ICD-10 Diagnosis Picker */}
            <div className="pt-1">
              <DynamicDiagnosisPicker
                selectedCodes={formData.diagnosisCodes}
                onChange={(codes) => set('diagnosisCodes', codes)}
                label="Case Diagnostic Codes (Box 21 Pointers A-L)"
              />
            </div>

            <div>
              <label className={labelCls}>Chief Complaints &amp; Injury Summary</label>
              <textarea
                rows={2}
                className={inputCls}
                value={formData.chiefComplaint}
                onChange={e => set('chiefComplaint', e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Case Notes &amp; 4-Provider Coordination</label>
              <textarea
                rows={2}
                className={inputCls}
                value={formData.caseNotes}
                onChange={e => set('caseNotes', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
