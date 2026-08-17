// src/components/modals/CaseDetailsModal.jsx
import React, { useState } from 'react';
import { Modal } from './Modal';
import { 
  FileSpreadsheet, Shield, Scale, ExternalLink, Calendar, MapPin, 
  Stethoscope, Receipt, User, Clock, AlertTriangle, FileText, CheckCircle2, ChevronRight, Edit3, Save, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockCaseService } from '../../services/mock/mockCaseService';
import { useUIStore } from '../../store/uiStore';
import { formatCurrency } from '../../utils/billingCalculations';

const KNOWN_LAW_FIRMS = [
  { name: 'OJ Lawal, Esq.', firm: 'OJ Law Firm & Associates LLC', phone: '713-555-0188', email: 'attorney@ojlawfirm.com' },
  { name: 'Marcus Vance, Esq.', firm: 'Law Offices of Marcus Vance', phone: '713-555-0219', email: 'mvance@vancelaw.com' },
  { name: 'Robert Cole, Attorney', firm: 'Cole & Partners Injury Law', phone: '713-555-0442', email: 'rcole@colelaw.com' },
  { name: 'Sarah Jenkins, Esq.', firm: 'Davis & Associates Injury Law Group', phone: '713-555-0300', email: 'sjenkins@davisinjury.com' },
];

export const CaseDetailsModal = ({ isOpen, onClose, caseItem, onCaseUpdated }) => {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState('ACCIDENT');
  const [isEditingLegal, setIsEditingLegal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [legalData, setLegalData] = useState({
    attorneyName: caseItem?.attorneyName || '',
    lawFirm: caseItem?.lawFirm || '',
    attorneyPhone: caseItem?.attorneyPhone || '',
    attorneyEmail: caseItem?.attorneyEmail || '',
    lawFirmAddress: caseItem?.lawFirmAddress || ''
  });

  if (!caseItem) return null;

  const handleSaveLegal = async () => {
    setSaving(true);
    try {
      await mockCaseService.updateCase(caseItem.id || caseItem.caseId, {
        attorneyName: legalData.attorneyName,
        lawFirm: legalData.lawFirm,
        attorneyPhone: legalData.attorneyPhone,
        attorneyEmail: legalData.attorneyEmail,
        lawFirmAddress: legalData.lawFirmAddress
      });
      caseItem.attorneyName = legalData.attorneyName;
      caseItem.lawFirm = legalData.lawFirm;
      caseItem.attorneyPhone = legalData.attorneyPhone;
      caseItem.attorneyEmail = legalData.attorneyEmail;
      caseItem.lawFirmAddress = legalData.lawFirmAddress;
      addToast('Attorney & Law Firm assigned successfully!', 'success');
      setIsEditingLegal(false);
      if (onCaseUpdated) onCaseUpdated();
    } catch {
      addToast('Failed to update attorney details', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectPreset = (preset) => {
    setLegalData({
      attorneyName: preset.name,
      lawFirm: preset.firm,
      attorneyPhone: preset.phone,
      attorneyEmail: preset.email,
      lawFirmAddress: '11711 Bedford St. Suite 01, Houston TX 77031'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Accident Case #${caseItem.caseId || 'CASE-2025-1227'}`}
      subtitle={`Patient: ${caseItem.patientName || 'SAMPLE TESTING'} | DOA: ${caseItem.accidentDate || '12/27/2025'}`}
      icon={FileSpreadsheet}
      size="2xl"
      iconColor="text-teal-700"
      iconBg="bg-teal-50"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate(`/billing/provider-bills?caseId=${caseItem.id || caseItem.caseId}`);
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5" /> View Connected Bills Ledger
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Context Strip */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-white">Case #{caseItem.caseId}</h3>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-bold text-[10px]">
                {caseItem.status || 'ACTIVE'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Patient: <strong className="text-slate-200">{caseItem.patientName}</strong> | DOA: <strong className="text-slate-200">{caseItem.accidentDate}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 sm:text-right border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Case Total Billing</span>
              <strong className="text-white text-base sm:text-lg font-mono">$24,960.00</strong>
              <p className="text-[10px] text-teal-300">4 Connected Provider Ledgers</p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 touch-scroll">
          {[
            { id: 'ACCIDENT', label: '1. Accident & Injury Profile', icon: FileText },
            { id: 'LEGAL', label: '2. Attorney & Auto Insurance', icon: Scale },
            { id: 'BILLS', label: '3. Connected 4-Provider Bills', icon: Receipt },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  active ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Accident & Injury Profile */}
        {activeTab === 'ACCIDENT' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Accident Date (DOA)</span>
                <strong className="text-slate-900 text-sm font-tabular">{caseItem.accidentDate || '2025-12-27'}</strong>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Accident Type</span>
                <strong className="text-slate-900">{caseItem.accidentType || 'AUTO_ACCIDENT'}</strong>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Location</span>
                <strong className="text-slate-900">{caseItem.accidentLocation || 'Interstate 10, Houston TX'}</strong>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Police Report #</span>
                <strong className="text-slate-900 font-mono">{caseItem.policeReportNumber || 'HPD-2025-889201'}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-teal-600" /> Mechanism of Injury &amp; Symptoms
                </h4>
                <div className="space-y-1 text-slate-700">
                  <p><strong>Mechanism:</strong> {caseItem.mechanismOfInjury || 'Motor Vehicle Accident (Rear-end collision at high impact)'}</p>
                  <p><strong>Chief Complaint:</strong> {caseItem.chiefComplaint || 'Cervical sprain/strain, lumbar pain radiating to buttocks, vehicular passenger anxiety'}</p>
                  <p><strong>Injury Body Parts:</strong> {caseItem.injuryBodyParts || 'Cervical spine, lumbar spine, thoracic spine, head'}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-teal-600" /> Box 21 Linked ICD-10 Diagnoses
                </h4>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {(caseItem.diagnosisCodes || ['M54.6', 'M54.50', 'S13.4', 'S33.5', 'F43.10']).map(code => (
                    <span key={code} className="px-2.5 py-1 bg-white text-slate-900 border border-slate-200 rounded-lg font-bold font-mono text-xs shadow-xs">
                      {code}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 pt-2">Diagnoses automatically map to HCFA CMS-1500 Box 21 on all provider claims.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Attorney & Auto Insurance */}
        {activeTab === 'LEGAL' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Attorney & Law Firm Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-teal-600" /> Attorney &amp; Law Firm (Legal Lien)
                  </h4>
                  {!isEditingLegal ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingLegal(true)}
                      className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> {caseItem.attorneyName ? 'Edit Attorney' : '+ Assign Attorney'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditingLegal(false)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {!isEditingLegal ? (
                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex justify-between">
                      <span>Attorney Name:</span>
                      <strong className="text-slate-900">{caseItem.attorneyName || 'Self-Represented (Direct Patient)'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Law Firm:</span>
                      <strong className="text-slate-900">{caseItem.lawFirm || 'Direct Billing / Self-Pay'}</strong>
                    </div>
                    {caseItem.lawFirmAddress && (
                      <div className="flex justify-between"><span>Firm Address:</span><strong className="text-slate-900">{caseItem.lawFirmAddress}</strong></div>
                    )}
                    {caseItem.attorneyPhone && (
                      <div className="flex justify-between"><span>Attorney Phone:</span><strong className="text-slate-900">{caseItem.attorneyPhone}</strong></div>
                    )}
                    {caseItem.attorneyEmail && (
                      <div className="flex justify-between"><span>Attorney Email:</span><strong className="text-slate-900">{caseItem.attorneyEmail}</strong></div>
                    )}
                    <div className="flex justify-between">
                      <span>Lien Agreement:</span>
                      <span className={`font-bold ${caseItem.attorneyName ? 'text-teal-700' : 'text-slate-500'}`}>
                        {caseItem.attorneyName ? 'Letter of Protection (LOP) on File' : 'Direct Patient Agreement'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Quick Select Law Firm Preset:</span>
                      <div className="flex flex-wrap gap-1">
                        {KNOWN_LAW_FIRMS.map(preset => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className="px-2 py-0.5 bg-white hover:bg-teal-50 hover:border-teal-300 text-slate-800 border border-slate-200 rounded text-[10px] font-semibold transition cursor-pointer"
                          >
                            + {preset.firm}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-800 mb-0.5">Attorney Full Name</label>
                      <input
                        type="text"
                        value={legalData.attorneyName}
                        onChange={e => setLegalData({ ...legalData, attorneyName: e.target.value })}
                        placeholder="e.g. OJ Lawal, Esq."
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:border-teal-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-800 mb-0.5">Law Firm Name</label>
                      <input
                        type="text"
                        value={legalData.lawFirm}
                        onChange={e => setLegalData({ ...legalData, lawFirm: e.target.value })}
                        placeholder="e.g. OJ Law Firm & Associates LLC"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:border-teal-600 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-800 mb-0.5">Attorney Phone</label>
                        <input
                          type="tel"
                          value={legalData.attorneyPhone}
                          onChange={e => setLegalData({ ...legalData, attorneyPhone: e.target.value })}
                          placeholder="713-555-0188"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:border-teal-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-800 mb-0.5">Attorney Email</label>
                        <input
                          type="email"
                          value={legalData.attorneyEmail}
                          onChange={e => setLegalData({ ...legalData, attorneyEmail: e.target.value })}
                          placeholder="attorney@lawoffice.com"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:border-teal-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingLegal(false)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveLegal}
                        disabled={saving}
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save & Link Attorney'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Auto Insurance Claim Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-teal-600" /> Auto Insurance Claim &amp; Policy
                </h4>
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex justify-between"><span>Insurance Carrier:</span><strong className="text-slate-900">{caseItem.insuranceCompany || 'Geico Auto Insurance Co.'}</strong></div>
                  <div className="flex justify-between"><span>Policy #:</span><strong className="text-slate-900 font-mono">{caseItem.insurancePolicyNumber || 'POL-9928374'}</strong></div>
                  <div className="flex justify-between"><span>Claim #:</span><strong className="text-slate-900 font-mono">{caseItem.insuranceClaimNumber || 'CLM-2025-88192'}</strong></div>
                  <div className="flex justify-between"><span>Insurance Adjuster:</span><strong className="text-slate-900">{caseItem.insuranceAdjuster || 'James Wilson'}</strong></div>
                  <div className="flex justify-between"><span>Adjuster Phone:</span><strong className="text-slate-900">{caseItem.insuranceAdjusterPhone || '800-555-0299'}</strong></div>
                  <div className="flex justify-between"><span>Liability Determination:</span><span className="text-emerald-700 font-bold">100% Accepted</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Connected 4-Provider Bills */}
        {activeTab === 'BILLS' && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: '1. JOSMIC Wellness Center', role: 'Pain Management Consultation', amount: 1214.00, cpt: '99204', st: 'Statement #1024-J' },
                { name: "2. DAV'S Anatomy", role: 'ESWT Shockwave Therapy (8 Sessions)', amount: 8000.00, cpt: '0101T', st: 'Statement #1024-D' },
                { name: '3. ANIK Laser Therapy', role: 'Laser Therapy + Supplies (6 Sessions)', amount: 14606.00, cpt: '97039, 10001, 97124', st: 'Statement #1024-A' },
                { name: '4. Counselor Practice (Hope Behavioral)', role: 'Individual Psychotherapy & PTSD', amount: 1140.00, cpt: '90791, 90834, 90837', st: 'Statement #1024-C' },
              ].map((b, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">{b.name}</strong>
                    <span className="font-mono font-bold text-teal-800 text-sm">{formatCurrency(b.amount)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{b.role}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[10px]">
                    <span className="font-mono text-slate-600">CPT: {b.cpt}</span>
                    <span className="font-bold text-slate-700">{b.st}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between font-bold">
              <span>Grand Total 4-Provider Practice Ledger:</span>
              <span className="text-base font-mono text-teal-300">$24,960.00</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
