// src/pages/billing/PaymentsAndAdjustmentsPage.jsx
import React, { useState } from 'react';
import { CreditCard, Plus, Search, CheckCircle, XCircle, Clock, X, Save, DollarSign, FileText } from 'lucide-react';
import { formatCurrency } from '../../utils/billingCalculations';

const SAMPLE_PAYMENTS = [
  { id: 'PMT-001', date: '01/15/2026', provider: 'JOSMIC Wellness Center', patient: 'SAMPLE TESTING', type: 'Insurance Payment', amount: 0.00, method: 'EFT', status: 'Pending', ref: 'POL-9928374' },
  { id: 'PMT-002', date: '01/15/2026', provider: "DAV'S Anatomy", patient: 'SAMPLE TESTING', type: 'Insurance Payment', amount: 0.00, method: 'EFT', status: 'Pending', ref: 'POL-9928374' },
  { id: 'PMT-003', date: '01/15/2026', provider: 'ANIK Laser Therapy', patient: 'SAMPLE TESTING', type: 'Insurance Payment', amount: 0.00, method: 'EFT', status: 'Pending', ref: 'POL-9928374' },
];

const SAMPLE_ADJUSTMENTS = [
  { id: 'ADJ-001', date: '01/15/2026', provider: 'JOSMIC Wellness Center', type: 'Contractual Write-off', amount: 0.00, reason: 'Awaiting Insurance EOB', status: 'Pending' },
  { id: 'ADJ-002', date: '01/15/2026', provider: "DAV'S Anatomy", type: 'Contractual Write-off', amount: 0.00, reason: 'Awaiting Insurance EOB', status: 'Pending' },
];

const inputCls = 'w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-900 mb-1';

// ─── Post New Payment Modal ───────────────────────────────────────────────────
const PostPaymentModal = ({ onClose }) => {
  const [form, setForm] = useState({
    paymentType: 'INSURANCE',
    provider: 'prov-josmic',
    patientName: 'SAMPLE TESTING',
    patientId: 'PAT-141849159',
    caseId: 'CASE-2025-1227',
    paymentDate: new Date().toISOString().split('T')[0],
    postingDate: new Date().toISOString().split('T')[0],
    amount: '',
    method: 'EFT',
    checkNumber: '',
    referenceNumber: '',
    eobDate: '',
    insuranceCompany: 'Example Auto Insurance Co.',
    claimNumber: 'CLM-2025-88192',
    policyNumber: 'POL-9928374',
    adjusterName: 'James Wilson',
    allowedAmount: '',
    contractualAdj: '',
    coinsurance: '',
    deductible: '',
    denialReason: '',
    linkedBillId: 'bill-josmic-001',
    applyToStatement: 'STMT-120197',
    status: 'PENDING',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-6 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Post New Payment</h2>
              <p className="text-[10px] text-slate-400">Record insurance payment, patient payment or credit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg transition">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">

          {/* Payment Type */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Payment Type</p>
            <div className="flex flex-wrap gap-3">
              {[
                { val: 'INSURANCE', label: '🏛 Insurance Payment' },
                { val: 'PATIENT', label: '👤 Patient Payment' },
                { val: 'ATTORNEY', label: '⚖️ Attorney Settlement' },
                { val: 'WORKERS_COMP', label: '🏗 Workers\' Comp' },
              ].map(opt => (
                <label key={opt.val} className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border text-xs font-bold transition ${form.paymentType === opt.val ? 'bg-teal-50 border-teal-500 text-teal-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  <input type="radio" name="payType" checked={form.paymentType === opt.val} onChange={() => set('paymentType', opt.val)} className="sr-only" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Provider & Patient */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Provider & Patient Reference</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className={labelCls}>Practice Provider *</label>
                <select className={inputCls} value={form.provider} onChange={e => set('provider', e.target.value)}>
                  <option value="prov-josmic">JOSMIC Wellness Center</option>
                  <option value="prov-davs">DAV'S Anatomy</option>
                  <option value="prov-anik">ANIK Laser Therapy</option>
                  <option value="prov-counselor">Counselor Practice</option>
                </select>
              </div>
              <div><label className={labelCls}>Patient Name</label><input className={inputCls} value={form.patientName} onChange={e => set('patientName', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div><label className={labelCls}>Linked Case ID</label><input className={inputCls} value={form.caseId} onChange={e => set('caseId', e.target.value)} /></div>
              <div><label className={labelCls}>Apply to Statement #</label><input className={inputCls} value={form.applyToStatement} onChange={e => set('applyToStatement', e.target.value)} /></div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Payment Details</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div><label className={labelCls}>Payment Date *</label><input type="date" required className={inputCls} value={form.paymentDate} onChange={e => set('paymentDate', e.target.value)} /></div>
              <div><label className={labelCls}>Posting Date</label><input type="date" className={inputCls} value={form.postingDate} onChange={e => set('postingDate', e.target.value)} /></div>
              <div><label className={labelCls}>EOB / RA Date</label><input type="date" className={inputCls} value={form.eobDate} onChange={e => set('eobDate', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div><label className={labelCls}>Payment Amount ($) *</label><input type="number" step="0.01" required className={inputCls} value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0.00" /></div>
              <div><label className={labelCls}>Payment Method</label>
                <select className={inputCls} value={form.method} onChange={e => set('method', e.target.value)}>
                  <option value="EFT">EFT / ACH</option><option value="CHECK">Check</option><option value="CREDIT_CARD">Credit Card</option><option value="CASH">Cash</option><option value="WIRE">Wire Transfer</option>
                </select>
              </div>
              <div><label className={labelCls}>Check / Trace Number</label><input className={inputCls} value={form.checkNumber} onChange={e => set('checkNumber', e.target.value)} placeholder="CHK-0012345" /></div>
            </div>
            <div className="mt-3">
              <div><label className={labelCls}>Reference / ERA Number</label><input className={inputCls} value={form.referenceNumber} onChange={e => set('referenceNumber', e.target.value)} placeholder="ERA-2026-001" /></div>
            </div>
          </div>

          {/* Insurance EOB Details (conditional) */}
          {form.paymentType === 'INSURANCE' && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Insurance / EOB Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className={labelCls}>Insurance Company</label><input className={inputCls} value={form.insuranceCompany} onChange={e => set('insuranceCompany', e.target.value)} /></div>
                <div><label className={labelCls}>Adjuster Name</label><input className={inputCls} value={form.adjusterName} onChange={e => set('adjusterName', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div><label className={labelCls}>Claim Number</label><input className={inputCls} value={form.claimNumber} onChange={e => set('claimNumber', e.target.value)} /></div>
                <div><label className={labelCls}>Policy Number</label><input className={inputCls} value={form.policyNumber} onChange={e => set('policyNumber', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                <div><label className={labelCls}>Allowed Amt ($)</label><input type="number" step="0.01" className={inputCls} value={form.allowedAmount} onChange={e => set('allowedAmount', e.target.value)} placeholder="0.00" /></div>
                <div><label className={labelCls}>Contractual Adj ($)</label><input type="number" step="0.01" className={inputCls} value={form.contractualAdj} onChange={e => set('contractualAdj', e.target.value)} placeholder="0.00" /></div>
                <div><label className={labelCls}>Coinsurance ($)</label><input type="number" step="0.01" className={inputCls} value={form.coinsurance} onChange={e => set('coinsurance', e.target.value)} placeholder="0.00" /></div>
                <div><label className={labelCls}>Deductible ($)</label><input type="number" step="0.01" className={inputCls} value={form.deductible} onChange={e => set('deductible', e.target.value)} placeholder="0.00" /></div>
              </div>
              <div className="mt-3"><label className={labelCls}>Denial Reason (if partial/denied)</label><input className={inputCls} value={form.denialReason} onChange={e => set('denialReason', e.target.value)} placeholder="e.g. CO-45, PR-2, Coverage not applicable" /></div>
            </div>
          )}

          {/* Status & Notes */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Status & Notes</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className={labelCls}>Posting Status</label>
                <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="PENDING">Pending Review</option><option value="POSTED">Posted</option><option value="ON_HOLD">On Hold</option><option value="DENIED">Denied / Rejected</option>
                </select>
              </div>
            </div>
            <div className="mt-3"><label className={labelCls}>Internal Notes</label>
              <textarea rows={2} className={`${inputCls} resize-none`} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="e.g. EOB received via portal. Partial denial — appealing CO-45." />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5">
              <Save className="w-4 h-4" /> {saving ? 'Posting...' : 'Post Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const PaymentsAndAdjustmentsPage = () => {
  const [activeTab, setActiveTab] = useState('payments');
  const [search, setSearch] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments &amp; Adjustments</h1>
          <p className="text-xs text-slate-500">Post insurance payments, patient payments, write-offs and contractual adjustments</p>
        </div>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="px-3.5 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg shadow hover:bg-teal-700 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Post New Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Payments Posted', value: '$0.00', icon: CheckCircle, color: 'emerald' },
          { label: 'Total Adjustments', value: '$0.00', icon: XCircle, color: 'amber' },
          { label: 'Unapplied Credits', value: '$0.00', icon: Clock, color: 'blue' },
          { label: 'Outstanding Balance', value: '$30,004.00', icon: CreditCard, color: 'red' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{card.label}</span>
                <Icon className={`w-4 h-4 text-${card.color}-500`} />
              </div>
              <p className="text-xl font-black text-slate-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-5 py-3 text-xs font-bold transition ${activeTab === 'payments' ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Insurance &amp; Patient Payments
          </button>
          <button
            onClick={() => setActiveTab('adjustments')}
            className={`px-5 py-3 text-xs font-bold transition ${activeTab === 'adjustments' ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Write-offs &amp; Adjustments
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient, provider, or reference..."
              className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {activeTab === 'payments' && (
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3 text-left">Payment ID</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Provider</th>
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Method</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SAMPLE_PAYMENTS.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-teal-700">{p.id}</td>
                    <td className="p-3 font-mono text-slate-600">{p.date}</td>
                    <td className="p-3 font-semibold text-slate-800">{p.provider}</td>
                    <td className="p-3 text-slate-600">{p.patient}</td>
                    <td className="p-3 text-slate-600">{p.type}</td>
                    <td className="p-3 text-right font-mono font-bold">{formatCurrency(p.amount)}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">{p.method}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'Posted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'adjustments' && (
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3 text-left">Adj. ID</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Provider</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-left">Reason</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SAMPLE_ADJUSTMENTS.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-amber-700">{a.id}</td>
                    <td className="p-3 font-mono text-slate-600">{a.date}</td>
                    <td className="p-3 font-semibold text-slate-800">{a.provider}</td>
                    <td className="p-3 text-slate-600">{a.type}</td>
                    <td className="p-3 text-right font-mono font-bold">{formatCurrency(a.amount)}</td>
                    <td className="p-3 text-slate-500">{a.reason}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Post Payment Modal */}
      {showPaymentModal && <PostPaymentModal onClose={() => setShowPaymentModal(false)} />}
    </div>
  );
};
