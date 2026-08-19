// src/pages/billing/AgingSummaryPage.jsx
import React, { useEffect, useState } from 'react';
import { apiBillingService } from '../../services/api/apiBillingService';
import { formatCurrency } from '../../utils/billingCalculations';
import { useSettings } from '../../utils/settingsCache';
import { ArrowLeft, TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle, XCircle, BarChart2, FileText, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Provider aging baseline breakdown
const PROVIDER_AGING = [
  {
    provider: 'JOSMIC Wellness Center',
    category: 'Pain Management',
    statement: '120197',
    current: 0,
    past30: 1214.00,
    past60: 0,
    past90: 0,
    total: 1214.00,
    status: 'FINALISED_DEMO',
    risk: 'low',
  },
  {
    provider: "DAV'S Anatomy",
    category: 'Shockwave Therapy (ESWT)',
    statement: '121559',
    current: 0,
    past30: 0,
    past60: 0,
    past90: 9870.00,
    total: 9870.00,
    status: 'ISSUED_DEMO',
    risk: 'high',
  },
  {
    provider: 'ANIK Laser Therapy',
    category: 'Laser Therapy',
    statement: '121560',
    current: 0,
    past30: 0,
    past60: 0,
    past90: 18920.00,
    total: 18920.00,
    status: 'ISSUED_DEMO',
    risk: 'high',
  },
  {
    provider: 'Counselor Practice (Hope Behavioral)',
    category: 'Counseling & Mental Health',
    statement: '1024-C',
    current: 0,
    past30: 0,
    past60: 0,
    past90: 0,
    total: 1140.00,
    status: 'ISSUED_DEMO',
    risk: 'none',
  },
];

const PATIENT_AGING = [
  { patientId: 'PAT-141849159', name: 'Demo Patient 001', caseId: 'CASE-2025-1227', attorney: 'OJ Law Firm', insurance: 'State Farm', current: 0, past30: 1214.00, past60: 0, past90: 28790.00, total: 30004.00 },
  { patientId: 'PAT-293847561', name: 'Robert Johnson', caseId: 'CASE-2026-0210', attorney: 'Cole Law Firm', insurance: 'Workers Comp', current: 2400.00, past30: 1800.00, past60: 950.00, past90: 0, total: 5150.00 },
  { patientId: 'PAT-384756293', name: 'Jane Smith', caseId: 'CASE-2026-0105', attorney: 'Vance & Associates', insurance: 'Geico', current: 0, past30: 3200.00, past60: 1400.00, past90: 5600.00, total: 10200.00 },
  { patientId: 'PAT-476528394', name: 'aa jj', caseId: 'CASE-2026-507', attorney: 'Self-Represented (Direct)', insurance: 'Progressive', current: 1750.00, past30: 0, past60: 0, past90: 0, total: 1750.00 },
];

const RECENT_ACTIVITY = [
  { date: '08/18/2026', type: 'Payment Posted', provider: 'JOSMIC Wellness Center', amount: 500.00, note: 'Attorney interim payment credited', icon: 'check' },
  { date: '08/17/2026', type: 'Statement Issued', provider: "DAV'S Anatomy", amount: 8000.00, note: 'Bill #216743 issued to OJ Lawal — 90+ days aging', icon: 'doc' },
  { date: '08/15/2026', type: 'Statement Issued', provider: 'ANIK Laser Therapy', amount: 14556.00, note: 'Laser therapy claim submitted to attorney lien', icon: 'doc' },
  { date: '08/10/2026', type: 'Clinical Note Signed', provider: 'Counselor Practice', amount: 0, note: 'Psychotherapy intake (90834) signed & linked', icon: 'check' },
  { date: '08/05/2026', type: 'Adjustment Applied', provider: 'ANIK Laser Therapy', amount: -50.00, note: 'Contractual write-off posted', icon: 'check' },
];

const riskBadge = (risk) => {
  if (risk === 'high') return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-red-100 text-red-700 border border-red-200">HIGH RISK</span>;
  if (risk === 'low') return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200">REVIEW</span>;
  return <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-slate-100 text-slate-500 border border-slate-200">N/A</span>;
};

const statusBadge = (status) => {
  const map = {
    FINALISED_DEMO: 'bg-slate-100 text-slate-700 border-slate-200',
    ISSUED_DEMO: 'bg-teal-50 text-teal-700 border-teal-200',
    CONFIGURATION_PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  };
  const label = {
    FINALISED_DEMO: 'Finalised',
    ISSUED_DEMO: 'Issued',
    CONFIGURATION_PENDING: 'Pending Config',
  };
  return (
    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${map[status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
      {label[status] || status}
    </span>
  );
};

const ActivityIcon = ({ type }) => {
  if (type === 'warn') return <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-3.5 h-3.5 text-amber-600" /></div>;
  if (type === 'doc') return <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0"><FileText className="w-3.5 h-3.5 text-teal-600" /></div>;
  if (type === 'alert') return <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"><XCircle className="w-3.5 h-3.5 text-red-500" /></div>;
  return <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /></div>;
};

export const AgingSummaryPage = () => {
  const settings = useSettings();
  const [aging, setAging] = useState({
    current: 109034,
    past30: 430,
    past60: 530,
    past90: 28790,
    grandTotal: 138784,
    providerAgingBreakdown: PROVIDER_AGING,
    patientAgingLedger: PATIENT_AGING
  });
  const navigate = useNavigate();

  useEffect(() => {
    apiBillingService.getAgingSummary().then(res => {
      if (res) {
        setAging(prev => ({
          ...prev,
          ...res,
          providerAgingBreakdown: res.providerAgingBreakdown && res.providerAgingBreakdown.length > 0 ? res.providerAgingBreakdown : PROVIDER_AGING,
          patientAgingLedger: res.patientAgingLedger && res.patientAgingLedger.length > 0 ? res.patientAgingLedger : PATIENT_AGING
        }));
      }
    }).catch(() => {});
  }, []);

  const total = aging.grandTotal || (aging.current + aging.past30 + aging.past60 + aging.past90) || 1;
  const pct = (val) => ((val / total) * 100).toFixed(1);

  const collectionRate = aging.grandTotal > 0
    ? Math.round(((aging.grandTotal - aging.past90) / aging.grandTotal) * 100)
    : 0;

  const providerAgingList = aging.providerAgingBreakdown || PROVIDER_AGING;
  const patientAgingList = aging.patientAgingLedger || PATIENT_AGING;

  return (
    <div className="space-y-6">
      {/* Back nav */}
      <button onClick={() => navigate('/billing/four-bills')} className="flex items-center gap-1 text-xs font-bold text-secondary-container hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to 4-Bill Ledger
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Accounts Receivable Aging Summary</h1>
          <p className="text-xs text-on-surface-variant">5-Bucket financial aging analysis across all 4 practice provider billing ledgers</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> As of Aug 05, 2026
          </div>
          <div className="px-3 py-1.5 bg-teal-50 rounded-xl text-xs font-bold text-teal-700 border border-teal-200 flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" /> 1 Active Case
          </div>
        </div>
      </div>

      {/* 5-Bucket Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {[
          { label: 'Current Due', value: aging.current, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <CheckCircle className="w-4 h-4 text-emerald-500" /> },
          { label: '30 Days Past Due', value: aging.past30, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: <Clock className="w-4 h-4 text-blue-500" /> },
          { label: '60 Days Past Due', value: aging.past60, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
          { label: '90+ Days Past Due', value: aging.past90, color: 'text-error', bg: 'bg-red-50', border: 'border-red-200', icon: <XCircle className="w-4 h-4 text-red-500" /> },
          { label: 'Grand Total Balance', value: aging.grandTotal, color: 'text-on-surface', bg: 'bg-surface-container-low', border: 'border-secondary-container/40', icon: <TrendingUp className="w-4 h-4 text-secondary-container" /> },
        ].map((bucket) => (
          <div key={bucket.label} className={`${bucket.bg} p-4 rounded-xl border ${bucket.border} shadow-sm text-center space-y-1`}>
            <div className="flex justify-center mb-1">{bucket.icon}</div>
            <span className="text-[11px] font-bold text-on-surface-variant block">{bucket.label}</span>
            <span className={`text-lg font-bold font-tabular ${bucket.color}`}>{formatCurrency(bucket.value)}</span>
          </div>
        ))}
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Providers</p>
          <p className="text-2xl font-bold text-slate-900">4</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Across 1 active case</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Billed vs. Collected</p>
          <p className="text-2xl font-bold text-slate-900">{collectionRate}%</p>
          <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5">
            <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${collectionRate}%` }} />
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">High-Risk Balances</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(aging.past90)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">90+ days outstanding</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Pending Config</p>
          <p className="text-2xl font-bold text-amber-600">1</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Provider billing incomplete</p>
        </div>
      </div>

      {/* Provider Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-teal-600" />
          <h2 className="text-sm font-bold text-slate-900">Provider-Level Aging Breakdown</h2>
          <span className="ml-auto text-[10px] text-slate-400 font-semibold">{providerAgingList.length} PROVIDERS</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                <th className="text-left px-5 py-3">Provider</th>
                <th className="text-left px-4 py-3">Stmt #</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Current</th>
                <th className="text-right px-4 py-3">30 Days</th>
                <th className="text-right px-4 py-3">60 Days</th>
                <th className="text-right px-4 py-3">90+ Days</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="text-center px-4 py-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {providerAgingList.map((row, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-slate-900 truncate max-w-[160px]">{row.provider}</p>
                    <p className="text-[10px] text-slate-400">{row.category}</p>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 font-mono">{row.statement}</td>
                  <td className="px-4 py-3.5">{statusBadge(row.status)}</td>
                  <td className="px-4 py-3.5 text-right font-tabular text-emerald-600">{formatCurrency(row.current)}</td>
                  <td className="px-4 py-3.5 text-right font-tabular text-blue-600">{formatCurrency(row.past30)}</td>
                  <td className="px-4 py-3.5 text-right font-tabular text-amber-600">{formatCurrency(row.past60)}</td>
                  <td className="px-4 py-3.5 text-right font-tabular font-bold text-red-600">{formatCurrency(row.past90)}</td>
                  <td className="px-4 py-3.5 text-right font-tabular font-bold text-slate-900">{formatCurrency(row.total)}</td>
                  <td className="px-4 py-3.5 text-center">{riskBadge(row.risk)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-bold text-xs border-t border-slate-200">
                <td className="px-5 py-3 text-slate-700" colSpan={3}>Grand Totals</td>
                <td className="px-4 py-3 text-right font-tabular text-emerald-600">{formatCurrency(aging.current)}</td>
                <td className="px-4 py-3 text-right font-tabular text-blue-600">{formatCurrency(aging.past30)}</td>
                <td className="px-4 py-3 text-right font-tabular text-amber-600">{formatCurrency(aging.past60)}</td>
                <td className="px-4 py-3 text-right font-tabular text-red-600">{formatCurrency(aging.past90)}</td>
                <td className="px-4 py-3 text-right font-tabular text-slate-900">{formatCurrency(aging.grandTotal)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Patient Aging & Recent Activity â€” 2 column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Patient-Level Aging */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">Patient Aging Ledger</h2>
            <span className="ml-auto text-[10px] text-slate-400 font-semibold">{patientAgingList.length} PATIENTS / CASES</span>
          </div>
          <div className="divide-y divide-slate-50">
            {patientAgingList.map((p, i) => {
              const pct90 = p.total > 0 ? Math.round((p.past90 / p.total) * 100) : 0;
              return (
                <div key={i} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.patientId} • {p.caseId}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-900 font-tabular">{formatCurrency(p.total)}</span>
                  </div>
                  <div className="flex gap-2 text-[10px] text-slate-500 flex-wrap mb-2">
                    <span>⚖️ {p.attorney}</span>
                    <span>🛡️ {p.insurance}</span>
                  </div>
                  {/* Mini aging bar */}
                  <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
                    {p.total > 0 && <>
                      <div className="bg-emerald-400" style={{ width: `${(p.current / p.total) * 100}%` }} />
                      <div className="bg-blue-400" style={{ width: `${(p.past30 / p.total) * 100}%` }} />
                      <div className="bg-amber-400" style={{ width: `${(p.past60 / p.total) * 100}%` }} />
                      <div className="bg-red-400" style={{ width: `${(p.past90 / p.total) * 100}%` }} />
                    </>}
                    {p.total === 0 && <div className="bg-slate-200 w-full" />}
                  </div>
                  {pct90 > 0 && (
                    <p className="text-[9px] text-red-500 font-bold mt-1">{pct90}% in 90+ day bucket</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">Recent Billing Activity</h2>
            <span className="ml-auto text-[10px] text-slate-400 font-semibold">{RECENT_ACTIVITY.length} EVENTS</span>
          </div>
          <div className="divide-y divide-slate-50">
            {RECENT_ACTIVITY.map((ev, i) => (
              <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                <ActivityIcon type={ev.icon} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{ev.type}</p>
                    {ev.amount !== 0 && (
                      <span className={`text-xs font-bold font-tabular flex-shrink-0 ${ev.amount > 0 ? 'text-teal-600' : 'text-red-500'}`}>
                        {ev.amount > 0 ? '+' : ''}{formatCurrency(ev.amount)}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{ev.provider}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{ev.note}</p>
                </div>
                <span className="text-[9px] text-slate-300 font-mono flex-shrink-0 mt-0.5">{ev.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aging Distribution Visual */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-teal-600" />
          <h2 className="text-sm font-bold text-slate-900">Aging Balance Distribution</h2>
          <span className="ml-auto text-xs font-bold text-slate-900 font-tabular">{formatCurrency(aging.grandTotal)} total</span>
        </div>
        {[
          { label: 'Current (0 days)', value: aging.current, total: aging.grandTotal, color: 'bg-emerald-500', text: 'text-emerald-600' },
          { label: '30 Days Past Due', value: aging.past30, total: aging.grandTotal, color: 'bg-blue-500', text: 'text-blue-600' },
          { label: '60 Days Past Due', value: aging.past60, total: aging.grandTotal, color: 'bg-amber-500', text: 'text-amber-600' },
          { label: '90+ Days Past Due', value: aging.past90, total: aging.grandTotal, color: 'bg-red-500', text: 'text-red-600' },
        ].map((bucket) => {
          const pct = bucket.total > 0 ? ((bucket.value / bucket.total) * 100).toFixed(1) : '0.0';
          return (
            <div key={bucket.label} className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500 w-40 flex-shrink-0">{bucket.label}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className={`${bucket.color} h-2.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
              </div>
              <span className={`text-[11px] font-bold font-tabular w-20 text-right ${bucket.text}`}>{formatCurrency(bucket.value)}</span>
              <span className="text-[10px] text-slate-400 w-10 text-right">{pct}%</span>
            </div>
          );
        })}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-700 w-40 flex-shrink-0">Grand Total</span>
          <div className="flex-1 bg-gradient-to-r from-emerald-400 via-blue-400 via-amber-400 to-red-500 h-2.5 rounded-full opacity-60" />
          <span className="text-[11px] font-bold text-slate-900 font-tabular w-20 text-right">{formatCurrency(aging.grandTotal)}</span>
          <span className="text-[10px] text-slate-400 w-10 text-right">100%</span>
        </div>
      </div>
    </div>
  );
};
