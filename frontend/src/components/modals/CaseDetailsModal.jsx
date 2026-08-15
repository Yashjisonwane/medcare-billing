// src/components/modals/CaseDetailsModal.jsx
import React, { useState } from 'react';
import { Modal } from './Modal';
import { 
  FileSpreadsheet, Shield, Scale, ExternalLink, Calendar, MapPin, 
  Stethoscope, Receipt, User, Clock, AlertTriangle, FileText, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/billingCalculations';

export const CaseDetailsModal = ({ isOpen, onClose, caseItem }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ACCIDENT');

  if (!caseItem) return null;

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
              navigate('/billing/four-bills');
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5" /> View Connected 4-Bill Ledger
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
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-teal-600" /> Attorney &amp; Law Firm (Legal Lien)
                </h4>
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex justify-between"><span>Attorney Name:</span><strong className="text-slate-900">{caseItem.attorneyName || 'OJ Lawal & Associates'}</strong></div>
                  <div className="flex justify-between"><span>Law Firm:</span><strong className="text-slate-900">{caseItem.lawFirm || 'OJ Law Firm & Associates LLC'}</strong></div>
                  <div className="flex justify-between"><span>Firm Address:</span><strong className="text-slate-900">{caseItem.lawFirmAddress || '11711 Bedford St. Suite 01, Houston TX 77031'}</strong></div>
                  <div className="flex justify-between"><span>Attorney Phone:</span><strong className="text-slate-900">{caseItem.attorneyPhone || '713-555-0188'}</strong></div>
                  <div className="flex justify-between"><span>Attorney Email:</span><strong className="text-slate-900">{caseItem.attorneyEmail || 'attorney@ojlawfirm.com'}</strong></div>
                  <div className="flex justify-between"><span>Lien Agreement:</span><span className="text-teal-700 font-bold">Letter of Protection (LOP) on File</span></div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-teal-600" /> Auto Insurance Claim &amp; Policy
                </h4>
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex justify-between"><span>Insurance Carrier:</span><strong className="text-slate-900">{caseItem.insuranceCompany || 'Example Auto Insurance Co.'}</strong></div>
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
