// src/pages/dashboards/BillingStaffDashboard.jsx
import React, { useEffect, useState } from 'react';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { mockCaseService } from '../../services/mock/mockCaseService';
import { formatCurrency } from '../../utils/billingCalculations';
import { Receipt, DollarSign, FileCheck, Clock, PlusCircle, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BillingStaffDashboard = () => {
  const [aging, setAging] = useState({ grandTotal: 0, past90: 0 });
  const [fourBills, setFourBills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    mockBillingService.getAgingSummary().then(setAging).catch(() => {});
    mockCaseService.getCases().then(cases => {
      const target = cases && cases.length > 0 ? cases[0] : { id: 'case-001' };
      mockBillingService.getFourBillsByCase(target.id || target.caseId).then(res => {
        if (res?.allBills) setFourBills(res.allBills);
      }).catch(() => {});
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Billing Staff Multi-Provider Ledger Hub</h1>
          <p className="text-xs text-on-surface-variant">6 Provider bill statements &amp; modalities, service line entry, payments, adjustments &amp; CMS-1500 claim previews</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/billing/create')} className="px-3 py-2 bg-secondary-container text-white rounded-lg text-xs font-bold shadow hover:bg-secondary flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4" /> Create Provider Bill
          </button>
          <button onClick={() => navigate('/cms-1500')} className="px-3 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-container flex items-center gap-1.5">
            <FileCheck className="w-4 h-4" /> CMS-1500 Claims
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Total Practice Accounts Receivable</span>
            <DollarSign className="w-5 h-5 text-secondary-container" />
          </div>
          <p className="text-2xl font-bold text-on-surface font-tabular">{formatCurrency(aging.grandTotal)}</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Across all 6 provider bills</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">90+ Days Past Due</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-on-surface font-tabular">{formatCurrency(aging.past90)}</p>
          <p className="text-[11px] text-amber-600 font-semibold">Overdue collection follow-up</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">CMS-1500 Previews</span>
            <FileCheck className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-on-surface font-tabular">3 Generated</p>
          <p className="text-[11px] text-on-surface-variant">Red-grid visual claims ready</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Pending Service Modalities</span>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-on-surface font-tabular">3 Modalities</p>
          <p className="text-[11px] text-amber-600 font-semibold">Counselor, TPI &amp; TECAR Pending</p>
        </div>
      </div>

      {/* 6-Bill Ledger Overview Cards */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-on-surface">Case CASE-2025-1227 — Provider Bills Overview</h2>
          <button onClick={() => navigate('/billing/provider-bills')} className="text-xs font-bold text-secondary-container hover:underline flex items-center gap-1 cursor-pointer">
            Open Provider Bills Ledger <ChevronRight className="w-4 h-4" />
          </button>
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
                <p className="text-[11px] text-on-surface-variant mb-2">Statement #{bill.statementNumber}</p>
                <div className="border-t border-outline-variant pt-2 space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-on-surface-variant">Total Charges:</span><span className="font-bold text-on-surface font-tabular">{formatCurrency(bill.totals.totalCharges)}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Payments:</span><span className="font-semibold text-emerald-600 font-tabular">{formatCurrency(bill.totals.totalPayments)}</span></div>
                  <div className="flex justify-between"><span className="text-on-surface-variant">Adjustments:</span><span className="font-semibold text-amber-600 font-tabular">{formatCurrency(bill.totals.totalAdjustments)}</span></div>
                  <div className="flex justify-between border-t border-outline-variant pt-1 font-bold"><span className="text-on-surface">Balance Due:</span><span className="text-secondary-container font-tabular">{formatCurrency(bill.totals.balanceDue)}</span></div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button onClick={() => navigate(`/billing/bills/${bill.id}`)} className="flex-1 py-1.5 bg-secondary-container text-white text-xs font-bold rounded hover:bg-secondary">
                  Open Ledger
                </button>
                <button onClick={() => navigate(`/cms-1500/${bill.id}/preview`)} className="px-2 py-1.5 bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-bold rounded">
                  CMS-1500
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
