// src/pages/cases/CaseDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { apiCaseService as mockCaseService } from '../../services/api/apiCaseService';
import { apiBillingService as mockBillingService } from '../../services/api/apiBillingService';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Receipt, Shield, AlertTriangle, ChevronRight, User } from 'lucide-react';
import { formatCurrency } from '../../utils/billingCalculations';

export const CaseDetailsPage = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [fourBills, setFourBills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    mockCaseService.getCaseById(id || 'case-001').then(setCaseData);
    mockBillingService.getFourBillsByCase('case-001').then(res => setFourBills(res.allBills));
  }, [id]);

  if (!caseData) return <div className="p-8 text-center text-xs text-on-surface-variant">Loading case details...</div>;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/cases')} className="flex items-center gap-1 text-xs font-bold text-secondary-container hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Case Registry
      </button>

      {/* Case Header */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-on-surface">{caseData.caseId}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              {caseData.status}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Patient: <strong className="text-secondary-container font-bold cursor-pointer" onClick={() => navigate(`/patients/${caseData.patientId}/profile`)}>{caseData.patientName}</strong> | Accident Date: <strong className="text-on-surface">{caseData.accidentDate}</strong>
          </p>
        </div>

        <button onClick={() => navigate(`/billing/provider-bills?caseId=${caseData.id || id}`)} className="px-4 py-2 bg-secondary-container text-white text-xs font-bold rounded-lg shadow hover:bg-secondary flex items-center gap-1.5 cursor-pointer">
          <Receipt className="w-4 h-4" /> Open Provider Bills Ledger
        </button>
      </div>

      {/* Case Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-secondary-container" /> Accident Information
          </h2>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-on-surface-variant">Accident Type:</span><span className="font-semibold">{caseData.accidentType}</span></div>
            <div className="flex justify-between"><span className="text-on-surface-variant">Mechanism of Injury:</span><span className="font-semibold">{caseData.mechanismOfInjury}</span></div>
            <div className="flex justify-between"><span className="text-on-surface-variant">Accident State:</span><span className="font-semibold">{caseData.accidentState}</span></div>
            <div className="flex justify-between"><span className="text-on-surface-variant">Referring Provider:</span><span className="font-semibold">{caseData.referringProviderName}</span></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-secondary-container" /> Attorney & Law Firm
          </h2>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-on-surface-variant">Attorney Name:</span><span className="font-bold text-on-surface">{caseData.attorneyName}</span></div>
            <div className="flex justify-between"><span className="text-on-surface-variant">Law Firm:</span><span className="font-semibold">{caseData.lawFirm}</span></div>
            <div className="flex justify-between"><span className="text-on-surface-variant">Phone:</span><span className="font-semibold">{caseData.attorneyPhone}</span></div>
            <div className="flex justify-between"><span className="text-on-surface-variant">Insurance Co:</span><span className="font-semibold">{caseData.insuranceCompany}</span></div>
          </div>
        </div>
      </div>

      {/* Six Provider Bills & Modalities Overview Grid */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-on-surface">Six Provider Bills &amp; Service Modalities for this Case</h2>
          <span className="text-xs text-on-surface-variant">6 Provider Service Ledgers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fourBills.map((bill) => (
            <div key={bill.id} className="p-4 rounded-xl border border-outline-variant bg-surface space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-secondary-container truncate">{bill.providerName}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                    bill.status === 'FINALISED_DEMO' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                    bill.status === 'CONFIGURATION_PENDING' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                  }`}>
                    {bill.status}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant mb-2">Category: {bill.serviceCategory}</p>

                {bill.providerId === 'prov-counselor' ? (
                  <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded text-[11px] text-amber-800 space-y-1 my-2">
                    <p className="font-bold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Counselor Config Pending</p>
                    <p className="text-[10px] text-amber-900/80">Pricing, CPT codes & billing details pending client confirmation.</p>
                  </div>
                ) : (
                  <div className="border-t border-outline-variant pt-2 space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-on-surface-variant">Charges:</span><span className="font-bold text-on-surface font-tabular">{formatCurrency(bill.totals.totalCharges)}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant">Balance:</span><span className="font-bold text-secondary-container font-tabular">{formatCurrency(bill.totals.balanceDue)}</span></div>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate(`/billing/bills/${bill.id}`)}
                className="w-full py-1.5 bg-secondary-container hover:bg-secondary text-white text-xs font-bold rounded shadow-sm transition mt-2"
              >
                Open Ledger
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
