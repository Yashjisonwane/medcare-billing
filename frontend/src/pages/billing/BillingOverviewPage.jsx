// src/pages/billing/BillingOverviewPage.jsx
import React, { useEffect, useState } from 'react';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { formatCurrency } from '../../utils/billingCalculations';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle, Layers } from 'lucide-react';

export const BillingOverviewPage = () => {
  const [aging, setAging] = useState({ current: 0, past30: 0, past60: 0, past90: 0, grandTotal: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    mockBillingService.getAgingSummary().then(setAging);
  }, []);

  const providers = [
    { name: 'JOSMIC Wellness Center', specialty: 'Pain Management', total: 1214.00, paid: 0, status: 'Finalised', color: 'teal' },
    { name: "DAV'S Anatomy", specialty: 'Shockwave (ESWT)', total: 9870.00, paid: 0, status: 'Issued', color: 'blue' },
    { name: 'ANIK Laser Therapy', specialty: 'Laser Therapy', total: 18920.00, paid: 0, status: 'Issued', color: 'violet' },
    { name: 'Counselor Practice', specialty: 'Counseling & Mental Health', total: 0, paid: 0, status: 'Pending', color: 'amber' },
  ];

  const totalBilled = providers.reduce((a, p) => a + p.total, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Billing Overview</h1>
        <p className="text-xs text-slate-500">Practice-wide financial summary across all 4 provider billing ledgers</p>
      </div>

      {/* KPI Cards — Responsive text & padding */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Billed', value: formatCurrency(totalBilled), icon: DollarSign, color: 'teal' },
          { label: 'Amount Collected', value: formatCurrency(0), icon: CheckCircle, color: 'emerald' },
          { label: 'Outstanding Balance', value: formatCurrency(totalBilled), icon: Clock, color: 'amber' },
          { label: '90+ Days Overdue', value: formatCurrency(aging.past90), icon: AlertCircle, color: 'red' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-sm min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1 sm:mb-2">
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase truncate">{card.label}</span>
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-${card.color}-500 flex-shrink-0`} />
              </div>
              <p className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 font-mono truncate">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* AR Aging Buckets */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
        <h2 className="text-xs sm:text-sm font-bold text-slate-700 mb-3 sm:mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-teal-500" /> Accounts Receivable Aging Buckets
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {[
            { label: 'Current', value: aging.current, color: 'emerald' },
            { label: '1–30 Days', value: aging.past30, color: 'blue' },
            { label: '31–60 Days', value: aging.past60, color: 'amber' },
            { label: '61–90 Days', value: 0, color: 'orange' },
            { label: '90+ Days', value: aging.past90, color: 'red' },
          ].map(b => (
            <div key={b.label} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center min-w-0">
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase truncate">{b.label}</p>
              <p className={`text-xs sm:text-base font-black text-${b.color}-600 font-mono truncate mt-0.5`}>{formatCurrency(b.value)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Provider Billing Summary — Touch scrollable table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-500" /> Provider Billing Summary
          </h2>
          <button onClick={() => navigate('/billing/provider-bills')} className="text-xs font-bold text-teal-600 hover:underline cursor-pointer">
            Open Provider Bills Ledger →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[550px]">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3 text-left">Provider</th>
                <th className="p-3 text-left">Specialty</th>
                <th className="p-3 text-right">Total Billed</th>
                <th className="p-3 text-right">Collected</th>
                <th className="p-3 text-right">Balance Due</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {providers.map(p => (
                <tr key={p.name} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-800">{p.name}</td>
                  <td className="p-3 text-slate-500">{p.specialty}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800">{formatCurrency(p.total)}</td>
                  <td className="p-3 text-right font-mono text-emerald-600">{formatCurrency(p.paid)}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">{formatCurrency(p.total - p.paid)}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'Finalised' ? 'bg-teal-100 text-teal-700' :
                      p.status === 'Issued' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
