// src/pages/admin/ReportsPage.jsx
import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Download, TrendingUp, DollarSign, Users, FileText,
  Activity, Clock, CheckCircle, AlertCircle, PieChart as PieIcon,
  BarChart2, Calendar, Filter
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

// ── Mock Data ─────────────────────────────────────────────────────────────────

const PROVIDER_BILLING = [
  { provider: 'JOSMIC', charges: 1214, payments: 0, adjustments: 0, balance: 1214, sessions: 1, color: '#0d9488' },
  { provider: "DAV'S Anatomy", charges: 9870, payments: 0, adjustments: 0, balance: 9870, sessions: 3, color: '#3b82f6' },
  { provider: 'ANIK Laser', charges: 18920, payments: 0, adjustments: 0, balance: 18920, sessions: 3, color: '#7c3aed' },
  { provider: 'Counselor', charges: 0, payments: 0, adjustments: 0, balance: 0, sessions: 0, color: '#f59e0b' },
];

const MONTHLY_BILLING = [
  { month: 'Oct 25', billed: 0, collected: 0, outstanding: 0 },
  { month: 'Nov 25', billed: 0, collected: 0, outstanding: 0 },
  { month: 'Dec 25', billed: 1214, collected: 0, outstanding: 1214 },
  { month: 'Jan 26', billed: 28790, collected: 0, outstanding: 28790 },
  { month: 'Feb 26', billed: 0, collected: 0, outstanding: 30004 },
  { month: 'Mar 26', billed: 0, collected: 0, outstanding: 30004 },
];

const SESSION_BREAKDOWN = [
  { type: 'Pain Consultation', count: 1, provider: 'JOSMIC', charge: 1214, cpt: '99204' },
  { type: 'ESWT Shockwave', count: 3, provider: "DAV'S Anatomy", charge: 9870, cpt: '0101T' },
  { type: 'HILT Laser Therapy', count: 3, provider: 'ANIK Laser', charge: 18920, cpt: '97039' },
  { type: 'Counseling Session', count: 0, provider: 'Counselor', charge: 0, cpt: 'TBD' },
];

const CLAIM_STATUS = [
  { name: 'Generated (Demo)', value: 7, color: '#0d9488' },
  { name: 'Submitted', value: 0, color: '#3b82f6' },
  { name: 'Approved', value: 0, color: '#10b981' },
  { name: 'Denied', value: 0, color: '#ef4444' },
  { name: 'Pending', value: 0, color: '#f59e0b' },
];

const AGING_DATA = [
  { bucket: 'Current', amount: 30004, color: '#10b981' },
  { bucket: '1–30 Days', amount: 0, color: '#3b82f6' },
  { bucket: '31–60 Days', amount: 0, color: '#f59e0b' },
  { bucket: '61–90 Days', amount: 0, color: '#f97316' },
  { bucket: '90+ Days', amount: 0, color: '#ef4444' },
];

const formatCurrency = (v) => `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
const COLORS = ['#0d9488', '#3b82f6', '#7c3aed', '#f59e0b'];

// ── Custom Tooltip ──────────────────────────────────────────────────────────
const CurrencyTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
        <p className="font-bold text-slate-700 mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }} className="font-mono">
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ── Page ──────────────────────────────────────────────────────────────────────
export const ReportsPage = () => {
  const { addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState('billing');

  const totalBilled = PROVIDER_BILLING.reduce((a, p) => a + p.charges, 0);
  const totalSessions = PROVIDER_BILLING.reduce((a, p) => a + p.sessions, 0);
  const totalClaims = 7;

  const TABS = [
    { id: 'billing', label: 'Billing Summary', icon: DollarSign },
    { id: 'sessions', label: 'Treatment Sessions', icon: Activity },
    { id: 'claims', label: 'CMS-1500 Claims', icon: FileText },
    { id: 'aging', label: 'AR Aging', icon: Clock },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-teal-600" />
            Analytics & Practice Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive billing, clinical, and financial analytics across all 4 provider ledgers
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => addToast('Simulated financial report PDF exported!', 'success')}
            className="px-3.5 py-2 bg-slate-700 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 hover:bg-slate-800 transition"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button
            onClick={() => addToast('Simulated report CSV exported!', 'success')}
            className="px-3.5 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 hover:bg-teal-700 transition"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Amount Billed', value: formatCurrency(totalBilled), sub: 'Across all 4 providers', icon: DollarSign, color: 'teal' },
          { label: 'Total Collected', value: formatCurrency(0), sub: 'Awaiting insurance payment', icon: CheckCircle, color: 'emerald' },
          { label: 'Outstanding Balance', value: formatCurrency(totalBilled), sub: 'Total accounts receivable', icon: AlertCircle, color: 'amber' },
          { label: 'Active Patients', value: '1', sub: 'Demo Patient 001', icon: Users, color: 'violet' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{card.label}</span>
                <div className={`w-7 h-7 rounded-lg bg-${card.color}-100 flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 text-${card.color}-600`} />
                </div>
              </div>
              <p className="text-xl font-black text-slate-900 font-mono">{card.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Secondary KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total CMS-1500 Claims', value: totalClaims, icon: FileText, color: 'blue' },
          { label: 'Treatment Sessions', value: `${totalSessions} sessions`, icon: Activity, color: 'teal' },
          { label: 'Active Providers', value: '3 of 4', icon: Users, color: 'violet' },
          { label: 'Pending Approvals', value: '0', icon: Clock, color: 'amber' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-${card.color}-100 flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 text-${card.color}-600`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{card.label}</p>
                <p className="text-base font-black text-slate-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-slate-200 gap-1">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                activeTab === tab.id ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── BILLING SUMMARY TAB ── */}
      {activeTab === 'billing' && (
        <div className="space-y-5">
          {/* Provider Charges Bar Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Provider Total Charges vs. Collections ($)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PROVIDER_BILLING} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="provider" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="charges" name="Total Billed" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="payments" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="balance" name="Outstanding" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Trend + Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Monthly Area Chart */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-700 mb-4">Monthly Billing Trend (Oct 2025 – Mar 2026)</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MONTHLY_BILLING}>
                    <defs>
                      <linearGradient id="billedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="outstandingGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CurrencyTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="billed" name="Billed" stroke="#0d9488" fill="url(#billedGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="outstanding" name="Outstanding" stroke="#f59e0b" fill="url(#outstandingGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CMS Claim Status Pie */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-700 mb-4">CMS-1500 Claim Status</h2>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={CLAIM_STATUS} cx="50%" cy="50%" innerRadius={35} outerRadius={60}
                      dataKey="value" paddingAngle={3}>
                      {CLAIM_STATUS.map((entry, i) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={v => [`${v} claims`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 mt-2">
                {CLAIM_STATUS.map(s => (
                  <div key={s.name} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-slate-600">{s.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Provider Detail Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-700">Provider Billing Ledger Summary</h2>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold">
                <tr>
                  <th className="p-3.5 text-left">Provider</th>
                  <th className="p-3.5 text-center">Sessions</th>
                  <th className="p-3.5 text-right">Total Billed</th>
                  <th className="p-3.5 text-right">Payments</th>
                  <th className="p-3.5 text-right">Adjustments</th>
                  <th className="p-3.5 text-right">Balance Due</th>
                  <th className="p-3.5 text-center">Collection Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PROVIDER_BILLING.map(p => (
                  <tr key={p.provider} className="hover:bg-slate-50">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="font-bold text-slate-800">{p.provider}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-mono text-slate-700">{p.sessions}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900">{formatCurrency(p.charges)}</td>
                    <td className="p-3.5 text-right font-mono text-emerald-600">{formatCurrency(p.payments)}</td>
                    <td className="p-3.5 text-right font-mono text-amber-600">{formatCurrency(p.adjustments)}</td>
                    <td className="p-3.5 text-right font-mono font-black text-slate-900">{formatCurrency(p.balance)}</td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.charges === 0 ? 'bg-slate-100 text-slate-400' : 'bg-amber-100 text-amber-700'}`}>
                        {p.charges === 0 ? 'N/A' : '0%'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 border-t-2 border-slate-200 font-black text-xs">
                <tr>
                  <td className="p-3.5 text-slate-700">TOTALS</td>
                  <td className="p-3.5 text-center font-mono text-slate-800">{totalSessions}</td>
                  <td className="p-3.5 text-right font-mono text-slate-900">{formatCurrency(totalBilled)}</td>
                  <td className="p-3.5 text-right font-mono text-emerald-700">{formatCurrency(0)}</td>
                  <td className="p-3.5 text-right font-mono text-amber-700">{formatCurrency(0)}</td>
                  <td className="p-3.5 text-right font-mono text-slate-900">{formatCurrency(totalBilled)}</td>
                  <td className="p-3.5 text-center text-amber-700">0% Overall</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── TREATMENT SESSIONS TAB ── */}
      {activeTab === 'sessions' && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Sessions by Provider (Count)</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SESSION_BREAKDOWN}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Sessions" radius={[4, 4, 0, 0]}>
                    {SESSION_BREAKDOWN.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-700">Session & Procedure Breakdown</h2>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold">
                <tr>
                  <th className="p-3.5 text-left">Treatment Type</th>
                  <th className="p-3.5 text-left">Provider</th>
                  <th className="p-3.5 text-center">CPT Code</th>
                  <th className="p-3.5 text-center">Sessions</th>
                  <th className="p-3.5 text-right">Total Charge</th>
                  <th className="p-3.5 text-right">Avg Per Session</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SESSION_BREAKDOWN.map((s, i) => (
                  <tr key={s.type} className="hover:bg-slate-50">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="font-bold text-slate-800">{s.type}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600">{s.provider}</td>
                    <td className="p-3.5 text-center font-mono font-bold text-teal-700">{s.cpt}</td>
                    <td className="p-3.5 text-center font-mono font-bold text-slate-800">{s.count}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900">{formatCurrency(s.charge)}</td>
                    <td className="p-3.5 text-right font-mono text-slate-600">
                      {s.count > 0 ? formatCurrency(s.charge / s.count) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CMS CLAIMS TAB ── */}
      {activeTab === 'claims' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Claims Generated', value: 7, color: 'teal' },
              { label: 'ANIK Claims', value: 3, color: 'violet' },
              { label: "DAV'S Claims", value: 3, color: 'blue' },
              { label: 'JOSMIC Claims', value: 1, color: 'emerald' },
            ].map(c => (
              <div key={c.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{c.label}</p>
                <p className={`text-3xl font-black text-${c.color}-600`}>{c.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-700">CMS-1500 Claims Register</h2>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold">
                <tr>
                  <th className="p-3.5 text-left">Claim DOS</th>
                  <th className="p-3.5 text-left">Provider</th>
                  <th className="p-3.5 text-left">Patient</th>
                  <th className="p-3.5 text-left">Diagnosis (Box 21)</th>
                  <th className="p-3.5 text-right">Total Charge</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { dos: '01/22/2026', provider: 'ANIK Laser Therapy', patient: 'SAMPLE TESTING', dx: 'M5450, M542, M25572', charge: 6140.00 },
                  { dos: '01/24/2026', provider: 'ANIK Laser Therapy', patient: 'SAMPLE TESTING', dx: 'M5450, M542, M25572', charge: 6140.00 },
                  { dos: '01/26/2026', provider: 'ANIK Laser Therapy', patient: 'SAMPLE TESTING', dx: 'M5450, M542, M25572', charge: 6640.00 },
                  { dos: '01/06/2026', provider: "DAV'S Anatomy", patient: 'SAMPLE TESTING', dx: 'M5450, M542, M25572', charge: 3390.00 },
                  { dos: '01/07/2026', provider: "DAV'S Anatomy", patient: 'SAMPLE TESTING', dx: 'M5450, M542, M25572', charge: 3140.00 },
                  { dos: '01/08/2026', provider: "DAV'S Anatomy", patient: 'SAMPLE TESTING', dx: 'M5450, M542, M25572', charge: 3340.00 },
                  { dos: '12/30/2025', provider: 'JOSMIC Wellness Center', patient: 'SAMPLE TESTING', dx: 'M546, M5450', charge: 1214.00 },
                ].map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono text-slate-700">{c.dos}</td>
                    <td className="p-3.5 font-semibold text-slate-800">{c.provider}</td>
                    <td className="p-3.5 text-slate-600">{c.patient}</td>
                    <td className="p-3.5 font-mono text-xs text-slate-500">{c.dx}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-900">{formatCurrency(c.charge)}</td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-700">Generated</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 border-t-2 border-slate-200">
                <tr>
                  <td colSpan={4} className="p-3.5 font-black text-slate-700 text-xs">TOTAL (7 Claims)</td>
                  <td className="p-3.5 text-right font-mono font-black text-slate-900">{formatCurrency(30004)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── AR AGING TAB ── */}
      {activeTab === 'aging' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {AGING_DATA.map(b => (
              <div key={b.bucket} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{b.bucket}</p>
                <p className="text-lg font-black font-mono" style={{ color: b.color }}>{formatCurrency(b.amount)}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 mb-4">AR Aging Distribution ($)</h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={AGING_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={v => [formatCurrency(v), 'Amount']} />
                  <Bar dataKey="amount" name="Amount" radius={[4, 4, 0, 0]}>
                    {AGING_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AR Detail by Provider */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-700">AR Aging by Provider</h2>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold">
                <tr>
                  <th className="p-3.5 text-left">Provider</th>
                  <th className="p-3.5 text-right">Total AR</th>
                  <th className="p-3.5 text-right">Current</th>
                  <th className="p-3.5 text-right">31–60 Days</th>
                  <th className="p-3.5 text-right">61–90 Days</th>
                  <th className="p-3.5 text-right">90+ Days</th>
                  <th className="p-3.5 text-center">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PROVIDER_BILLING.map(p => (
                  <tr key={p.provider} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-800">{p.provider}</td>
                    <td className="p-3.5 text-right font-mono font-black text-slate-900">{formatCurrency(p.balance)}</td>
                    <td className="p-3.5 text-right font-mono text-emerald-600">{formatCurrency(p.balance)}</td>
                    <td className="p-3.5 text-right font-mono text-slate-400">$0.00</td>
                    <td className="p-3.5 text-right font-mono text-slate-400">$0.00</td>
                    <td className="p-3.5 text-right font-mono text-slate-400">$0.00</td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.balance === 0 ? 'bg-slate-100 text-slate-400' : 'bg-emerald-100 text-emerald-700'}`}>
                        {p.balance === 0 ? 'None' : 'Current'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
