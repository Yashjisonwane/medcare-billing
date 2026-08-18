// src/pages/billing/FourBillsPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiBillingService } from '../../services/api/apiBillingService';
import { apiCaseService } from '../../services/api/apiCaseService';
import { apiProviderService } from '../../services/api/apiProviderService';
import { formatCurrency } from '../../utils/billingCalculations';
import { formatStatus } from '../../utils/formatters';
import { Receipt, PlusCircle, AlertTriangle, ChevronRight, User, Shield, FileText, Lock, ArrowLeft, Building, Stethoscope, DollarSign, Calendar, Layers } from 'lucide-react';
import { CreateBillModal } from '../../components/modals/CreateBillModal';

export const FourBillsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [casesList, setCasesList] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(searchParams.get('caseId') || '');
  const [caseData, setCaseData] = useState(null);
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateBillModal, setShowCreateBillModal] = useState(false);
  const navigate = useNavigate();

  // 1. Initial Load: Fetch all cases from backend
  useEffect(() => {
    apiCaseService.getCases().then(res => {
      if (res && res.length > 0) {
        setCasesList(res);
        const queryId = searchParams.get('caseId');
        const matched = res.find(c => c.id === queryId || c.caseId === queryId);
        const targetCase = matched || res[0];
        setSelectedCaseId(targetCase.id || targetCase.caseId);
        setCaseData(targetCase);
      }
    }).catch(err => {
      console.error('Failed to fetch cases list:', err);
    });
  }, []);

  // 2. Load bills whenever selectedCaseId changes
  const loadBills = async (targetId) => {
    const idToUse = targetId || selectedCaseId;
    if (!idToUse) return;
    setIsLoading(true);
    try {
      const [cData, bData] = await Promise.all([
        apiCaseService.getCaseById(idToUse).catch(() => null),
        apiBillingService.getFourBillsByCase(idToUse).catch(() => ({ allBills: [] }))
      ]);

      if (cData) {
        setCaseData(cData);
      } else {
        const found = casesList.find(c => c.id === idToUse || c.caseId === idToUse);
        if (found) setCaseData(found);
      }

      setBills(bData?.allBills || []);
    } catch (err) {
      console.error('Failed to load bills:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCaseId) {
      loadBills(selectedCaseId);
    }
  }, [selectedCaseId]);

  // 3. Dropdown case change handler
  const handleCaseChange = (newCaseId) => {
    setSelectedCaseId(newCaseId);
    setSearchParams({ caseId: newCaseId });
    const localMatch = casesList.find(c => c.id === newCaseId || c.caseId === newCaseId);
    if (localMatch) {
      setCaseData(localMatch);
    }
  };

  // Grand totals across all provider statements for this case
  const grandTotalCharges = bills.reduce((acc, b) => acc + (b.totals?.totalCharges || 0), 0);
  const grandTotalPayments = bills.reduce((acc, b) => acc + (b.totals?.totalPayments || 0), 0);
  const grandTotalAdjustments = bills.reduce((acc, b) => acc + (b.totals?.totalAdjustments || 0), 0);
  const grandBalanceDue = bills.reduce((acc, b) => acc + (b.totals?.balanceDue || 0), 0);

  return (
    <div className="space-y-5">
      {/* ── Top Navigation & Breadcrumb ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <button 
          onClick={() => navigate(-1)} 
          className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer group"
          title="Go back"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>

        <button 
          onClick={() => navigate('/billing/overview')} 
          className="px-3 py-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 hover:bg-teal-50 rounded-xl transition cursor-pointer"
        >
          Billing Overview
        </button>

        <button 
          onClick={() => navigate('/cases')} 
          className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer hidden sm:inline-block"
        >
          Accident Cases
        </button>

        <button 
          onClick={() => navigate('/cms-1500')} 
          className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer hidden md:inline-block"
        >
          CMS-1500 Queue
        </button>
      </div>

      {/* ── Header Title & Dynamic Case Selector ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Provider Bills Ledger</h1>
          <p className="text-xs text-slate-500">Connected practice provider statements &amp; itemized clinical ledgers tied to patient accident cases</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Dynamic Backend Case Dropdown */}
          <select
            value={selectedCaseId}
            onChange={(e) => handleCaseChange(e.target.value)}
            className="px-3 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl border border-slate-200 shadow-sm min-w-[220px] max-w-full truncate cursor-pointer outline-none focus:border-teal-600"
          >
            {casesList.length > 0 ? (
              casesList.map((c) => (
                <option key={c.id || c.caseId} value={c.id || c.caseId}>
                  {c.caseId || c.id} — {c.patientName || 'Accident Patient'}
                </option>
              ))
            ) : (
              <option value="" disabled>No cases found in database</option>
            )}
          </select>

          <button
            onClick={() => setShowCreateBillModal(true)}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> Create Provider Bill
          </button>
        </div>
      </div>

      {/* ── Patient & Case Context Banner ── */}
      {caseData && (
        <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">{caseData.patientName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
                  {caseData.caseId || caseData.id}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {caseData.accidentType || 'AUTO_ACCIDENT'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Accident Date: <strong className="text-white font-mono">{caseData.accidentDate || 'N/A'}</strong>
                {caseData.initialDate && <> • Admission: <strong className="text-white font-mono">{caseData.initialDate}</strong></>}
              </p>
            </div>
            <div>
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold inline-block border border-slate-700">
                Status: {formatStatus(caseData.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Attorney &amp; Law Firm:</span>
              <strong className="text-white text-xs">{caseData.attorneyName || 'Self-Represented (Direct)'}</strong>
              <p className="text-[10px] text-slate-400">{caseData.lawFirm || 'Personal Injury Law'}</p>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Auto Insurance Carrier:</span>
              <strong className="text-white text-xs">{caseData.insuranceCompany || 'Auto Insurance Claim'}</strong>
              <p className="text-[10px] text-slate-400">Policy: {caseData.insurancePolicyNumber || 'POL-PENDING'}</p>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Case Financials:</span>
              <div className="flex items-center justify-between text-xs mt-0.5">
                <span className="text-slate-400">Total Statements:</span>
                <strong className="text-teal-300 font-mono">{bills.length} Bills</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Balance Due:</span>
                <strong className="text-emerald-400 font-mono font-bold">{formatCurrency(grandBalanceDue)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Dynamic Provider Bill Statements ── */}
      {bills.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-100">
            <Receipt className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Provider Bills Found for This Case</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              There are currently no provider billing statements generated for case {caseData?.caseId || selectedCaseId}. You can create one dynamically using the button below.
            </p>
          </div>
          <button
            onClick={() => setShowCreateBillModal(true)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm inline-flex items-center gap-1.5 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Create First Provider Bill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bills.map((bill) => (
            <div key={bill.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-300 hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-2 gap-1">
                  <span className="text-[11px] font-extrabold text-teal-700 truncate">{bill.serviceCategory || 'Clinical Practice Modality'}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                    bill.status === 'FINALISED_DEMO' || bill.status === 'FINALIZED' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                    bill.status === 'CONFIGURATION_PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}>
                    {formatStatus(bill.status || 'ISSUED')}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">{bill.providerName}</h3>
                <p className="text-xs text-slate-500 font-mono">Statement #{bill.statementNumber || 'N/A'}</p>

                <div className="border-t border-slate-100 pt-3 mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Charges:</span>
                    <span className="font-bold text-slate-900 font-tabular font-mono">{formatCurrency(bill.totals?.totalCharges || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payments:</span>
                    <span className="font-semibold text-emerald-600 font-tabular font-mono">{formatCurrency(bill.totals?.totalPayments || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Adjustments:</span>
                    <span className="font-semibold text-amber-600 font-tabular font-mono">{formatCurrency(bill.totals?.totalAdjustments || 0)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-xs sm:text-sm">
                    <span className="text-slate-900">Balance Due:</span>
                    <span className="text-teal-700 font-tabular font-mono">{formatCurrency(bill.totals?.balanceDue || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => navigate(`/billing/bills/${bill.id}`)}
                  className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition text-center cursor-pointer"
                >
                  Open Ledger
                </button>
                <button
                  onClick={() => navigate(`/cms-1500/${bill.id}/preview`)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 text-xs font-bold rounded-xl transition text-center cursor-pointer"
                >
                  CMS-1500
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Interactive Create Bill Modal ── */}
      <CreateBillModal
        isOpen={showCreateBillModal}
        onClose={() => setShowCreateBillModal(false)}
        selectedCaseId={selectedCaseId}
        onBillCreated={() => loadBills(selectedCaseId)}
      />
    </div>
  );
};
