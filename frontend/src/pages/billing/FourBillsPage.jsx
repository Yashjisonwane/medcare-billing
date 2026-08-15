import React, { useEffect, useState } from 'react';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { mockCaseService } from '../../services/mock/mockCaseService';
import { formatCurrency } from '../../utils/billingCalculations';
import { formatStatus } from '../../utils/formatters';
import { Receipt, PlusCircle, AlertTriangle, ChevronRight, User, Shield, FileText, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreateBillModal } from '../../components/modals/CreateBillModal';

export const FourBillsPage = () => {
  const [selectedCaseId, setSelectedCaseId] = useState('case-001');
  const [caseData, setCaseData] = useState(null);
  const [bills, setBills] = useState([]);
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [showCreateBillModal, setShowCreateBillModal] = useState(false);
  const navigate = useNavigate();

  const loadBills = () => {
    mockCaseService.getCaseById(selectedCaseId).then(setCaseData);
    mockBillingService.getFourBillsByCase(selectedCaseId).then(res => setBills(res.allBills));
  };

  useEffect(() => {
    loadBills();
  }, [selectedCaseId]);

  return (
    <div className="space-y-5">
      {/* Top Back Navigation */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate(-1)} 
          className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-2xs transition flex items-center gap-2 cursor-pointer group"
          title="Go back"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>

        <button 
          onClick={() => navigate('/billing')} 
          className="px-3 py-2 text-xs font-bold text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded-xl transition cursor-pointer"
        >
          Billing Overview
        </button>

        <button 
          onClick={() => navigate('/cases')} 
          className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer hidden sm:inline-block"
        >
          Accident Cases
        </button>

        <button 
          onClick={() => navigate('/cms-1500')} 
          className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer hidden md:inline-block"
        >
          CMS-1500 Queue
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Six Provider Bills Ledger</h1>
          <p className="text-xs text-slate-500">Connected 6-provider bill statements &amp; modalities tied to patient accident case</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="px-3 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl border border-slate-200 shadow-sm min-w-0 truncate"
          >
            <option value="case-001">Case: CASE-2025-1227 (Demo Patient 001)</option>
          </select>

          <button onClick={() => setShowCreateBillModal(true)} className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer">
            <PlusCircle className="w-4 h-4" /> Create Provider Bill
          </button>
        </div>
      </div>

      {/* Patient & Case Context Banner */}
      {caseData && (
        <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">{caseData.patientName}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {caseData.caseId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Accident Date: <strong className="text-white">{caseData.accidentDate}</strong> ({caseData.accidentType})</p>
            </div>
            <div>
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold inline-block">
                Status: {formatStatus(caseData.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Attorney & Law Firm:</span>
              <strong className="text-white">{caseData.attorneyName}</strong>
              <p className="text-[10px] text-slate-400">{caseData.lawFirm}</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Auto Insurance Carrier:</span>
              <strong className="text-white">{caseData.insuranceCompany}</strong>
              <p className="text-[10px] text-slate-400">Policy: {caseData.insurancePolicyNumber}</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Practice Providers:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {caseData.assignedProviderIds?.map(pid => (
                  <span key={pid} className="px-2 py-0.5 text-[9px] font-bold bg-slate-800 text-teal-300 rounded border border-slate-700">
                    {pid.replace('prov-', '').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6 Core Modalities Provider Bill Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {bills.map((bill) => {
          const isCounselor = bill.providerId === 'prov-counselor';

          return (
            <div key={bill.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 medical-card-hover min-w-0">
              <div>
                <div className="flex items-center justify-between mb-2 gap-1">
                  <span className="text-[11px] font-bold text-teal-700 truncate">{bill.serviceCategory}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ${
                    bill.status === 'FINALISED_DEMO' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                    bill.status === 'CONFIGURATION_PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}>
                    {formatStatus(bill.status)}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">{bill.providerName}</h3>
                <p className="text-xs text-slate-500">Statement #{bill.statementNumber}</p>

                <div className="border-t border-slate-200 pt-3 mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Total Charges:</span><span className="font-bold text-slate-900 font-tabular">{formatCurrency(bill.totals?.totalCharges || 0)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Payments:</span><span className="font-semibold text-emerald-600 font-tabular">{formatCurrency(bill.totals?.totalPayments || 0)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Adjustments:</span><span className="font-semibold text-amber-600 font-tabular">{formatCurrency(bill.totals?.totalAdjustments || 0)}</span></div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-xs sm:text-sm">
                    <span className="text-slate-900">Balance Due:</span>
                    <span className="text-teal-700 font-tabular">{formatCurrency(bill.totals?.balanceDue || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => navigate(`/billing/bills/${bill.id}`)}
                  className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
                >
                  Open Ledger
                </button>
                <button
                  onClick={() => navigate(`/cms-1500/${bill.id}/preview`)}
                  className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                >
                  CMS-1500
                </button>
              </div>
            </div>
          );
        })}

        {/* 2 Additional Unconfigured Modalities Cards */}
        {[
          {
            id: 'srv-trigger-point-pending',
            category: 'Trigger Point Injection (TPI)',
            title: 'Trigger Point Injection',
            statement: '#STATEMENT-PENDING',
            status: 'Configuration Pending',
            reasons: ['Provider Assignment Required', 'CPT Code 20552 Pending', 'Pricing & Form Pending']
          },
          {
            id: 'srv-tecar-pending',
            category: 'TECAR Therapy (Radiofrequency)',
            title: 'TECAR Therapy',
            statement: '#STATEMENT-PENDING',
            status: 'Configuration Pending',
            reasons: ['Provider Assignment Required', 'RF CPT Code Pending', 'Pricing & Form Pending']
          }
        ].map((pending) => (
          <div key={pending.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 medical-card-hover min-w-0">
            <div>
              <div className="flex items-center justify-between mb-2 gap-1">
                <span className="text-[11px] font-bold text-amber-700 truncate">{pending.category}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex-shrink-0">
                  {pending.status}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">{pending.title}</h3>
              <p className="text-xs text-slate-500">Statement {pending.statement}</p>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1.5 my-3">
                <p className="font-bold text-xs flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" /> Service Configuration Pending
                </p>
                <ul className="text-[11px] text-amber-900/90 space-y-0.5 list-disc list-inside">
                  {pending.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setPendingModalOpen(pending.title)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition"
              >
                Pending Requirements
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Requirements Modal */}
      {pendingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-5 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 text-center">{pendingModalOpen} — Configuration Pending</h3>
            
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
              <p className="font-bold text-amber-800">Pending Setup Action Items:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>Assign Practice Provider in Practice &amp; Service Settings</li>
                <li>Confirm CPT Code &amp; Procedure Billing Rules</li>
                <li>Set Provider-Specific Fee Schedule &amp; Place of Service</li>
                <li>Upload Client Reference Documents / Clinical Forms</li>
              </ul>
            </div>

            <button
              onClick={() => setPendingModalOpen(false)}
              className="w-full py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              Close Notice
            </button>
          </div>
        </div>
      )}

      {/* Interactive Create Bill Modal */}
      <CreateBillModal
        isOpen={showCreateBillModal}
        onClose={() => setShowCreateBillModal(false)}
        onBillCreated={() => loadBills()}
      />
    </div>
  );
};
