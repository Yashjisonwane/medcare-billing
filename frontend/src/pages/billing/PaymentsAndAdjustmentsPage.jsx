// src/pages/billing/PaymentsAndAdjustmentsPage.jsx
import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Search, CheckCircle, XCircle, Clock, X, Save, DollarSign, FileText, AlertCircle, Building2, User, Shield } from 'lucide-react';
import { formatCurrency } from '../../utils/billingCalculations';
import { apiBillingService } from '../../services/api/apiBillingService';
import { apiCaseService } from '../../services/api/apiCaseService';
import { apiProviderService } from '../../services/api/apiProviderService';
import { useUIStore } from '../../store/uiStore';

const inputCls = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

// Dynamic Post New Payment Modal
const PostPaymentModal = ({ onClose, onSuccess }) => {
  const { addToast } = useUIStore();
  const [saving, setSaving] = useState(false);
  const [casesList, setCasesList] = useState([]);
  const [availableStatements, setAvailableStatements] = useState([]);
  const [selectedStatement, setSelectedStatement] = useState(null);

  const [form, setForm] = useState({
    paymentType: 'INSURANCE',
    provider: 'prov-josmic',
    patientName: '',
    patientId: '',
    caseId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    postingDate: new Date().toISOString().split('T')[0],
    amount: '',
    method: 'EFT',
    checkNumber: '',
    referenceNumber: '',
    eobDate: '',
    insuranceCompany: '',
    claimNumber: '',
    policyNumber: '',
    adjusterName: '',
    allowedAmount: '',
    contractualAdj: '',
    coinsurance: '',
    deductible: '',
    denialReason: '',
    linkedBillId: '',
    applyToStatement: '',
    status: 'POSTED',
    notes: '',
  });

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  // Load cases on mount
  useEffect(() => {
    apiCaseService.getCases().then(res => {
      if (res && res.length > 0) {
        setCasesList(res);
        const firstCase = res[0];
        handleCaseSelect(firstCase.id || firstCase.caseId, res);
      }
    }).catch(err => {
      console.error('Failed to fetch cases:', err);
    });
  }, []);

  // When a case is selected, auto-populate patient, insurance and load statements
  const handleCaseSelect = async (caseId, list = casesList) => {
    const matched = list.find(c => c.id === caseId || c.caseId === caseId);
    if (!matched) return;

    setForm(prev => ({
      ...prev,
      caseId: matched.id || matched.caseId,
      patientName: matched.patientName || `${matched.patient?.firstName || ''} ${matched.patient?.lastName || ''}`.trim() || 'Accident Patient',
      patientId: matched.patientId || matched.patient?.patientId || 'PAT-100',
      insuranceCompany: matched.insuranceCompany || 'Auto Insurance Carrier',
      claimNumber: matched.insuranceClaimNumber || 'CLM-PENDING',
      policyNumber: matched.insurancePolicyNumber || 'POL-PENDING',
      adjusterName: matched.insuranceAdjuster || 'Assigned Adjuster'
    }));

    try {
      const res = await apiBillingService.getFourBillsByCase(matched.id || matched.caseId);
      const bills = res?.allBills || [];
      setAvailableStatements(bills);
      if (bills.length > 0) {
        // Prioritize bills with actual balance due > 0
        const activeBill = bills.find(b => (b.totals?.balanceDue || 0) > 0) || bills[0];
        setSelectedStatement(activeBill);
        setForm(prev => ({
          ...prev,
          linkedBillId: activeBill.id,
          provider: activeBill.providerId,
          applyToStatement: activeBill.statementNumber ? `Statement #${activeBill.statementNumber}` : activeBill.id
        }));
      } else {
        setSelectedStatement(null);
        setForm(prev => ({ ...prev, linkedBillId: '', applyToStatement: '' }));
      }
    } catch (e) {
      console.error('Failed to load statements for case:', e);
    }
  };

  const handleStatementChange = (billId) => {
    const matched = availableStatements.find(b => b.id === billId);
    if (matched) {
      setSelectedStatement(matched);
      setForm(prev => ({
        ...prev,
        linkedBillId: matched.id,
        provider: matched.providerId,
        applyToStatement: matched.statementNumber ? `Statement #${matched.statementNumber}` : matched.id
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      addToast('Please enter a valid payment amount.', 'warning');
      return;
    }

    if (!form.linkedBillId) {
      addToast('Please select an active provider statement to apply this payment.', 'warning');
      return;
    }

    setSaving(true);
    try {
      await apiBillingService.postPayment(
        form.linkedBillId,
        {
          lineIndex: 0,
          amount: Number(form.amount),
          type: form.paymentType,
          checkRef: form.checkNumber || form.referenceNumber || 'REF-AUTO'
        }
      );
      addToast(`Payment of $${Number(form.amount).toFixed(2)} posted directly to database!`, 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error posting payment:', err);
      addToast('Failed to post payment to database', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isSelectedZeroBalance = (selectedStatement?.totals?.balanceDue || 0) <= 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-6 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Post New Payment</h2>
              <p className="text-[10px] text-slate-500">Record dynamic insurance payment, patient payment, or attorney settlement</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-xl transition cursor-pointer">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Payment Type Selection */}
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Payment Type *</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { val: 'INSURANCE', label: '🏛️ Insurance Payment' },
                { val: 'PATIENT', label: '👤 Patient Payment' },
                { val: 'ATTORNEY', label: '⚖️ Attorney Settlement' },
                { val: 'WORKERS_COMP', label: "🏗️ Workers' Comp" },
              ].map(opt => (
                <label 
                  key={opt.val} 
                  className={`flex items-center justify-center p-2 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                    form.paymentType === opt.val ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-2xs' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input type="radio" name="payType" checked={form.paymentType === opt.val} onChange={() => set('paymentType', opt.val)} className="sr-only" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Dynamic Case & Statement Binding */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <p className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Case &amp; Provider Statement Reference</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Patient Accident Case *</label>
                <select
                  value={form.caseId}
                  onChange={(e) => handleCaseSelect(e.target.value)}
                  className={inputCls}
                >
                  {casesList.map(c => (
                    <option key={c.id || c.caseId} value={c.id || c.caseId}>
                      {c.caseId || c.id} - {c.patientName || 'Accident Patient'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Patient Full Name</label>
                <input className={inputCls} value={form.patientName} readOnly disabled />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Apply to Statement / Provider Ledger *</label>
                <select
                  value={form.linkedBillId}
                  onChange={(e) => handleStatementChange(e.target.value)}
                  className={inputCls}
                >
                  {availableStatements.length > 0 ? (
                    availableStatements.map(b => {
                      const bal = b.totals?.balanceDue || 0;
                      const isPaid = bal <= 0;
                      return (
                        <option key={b.id} value={b.id}>
                          {isPaid ? '✓ [PAID IN FULL] ' : '⏳ [BALANCE DUE] '}
                          {b.providerName} (Statement #{b.statementNumber || 'N/A'}) - {isPaid ? '$0.00 (Settled)' : formatCurrency(bal)}
                        </option>
                      );
                    })
                  ) : (
                    <option value="">No provider statements found for this case</option>
                  )}
                </select>
              </div>

              <div>
                <label className={labelCls}>Selected Statement Status</label>
                {isSelectedZeroBalance ? (
                  <div className="px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-xl text-xs flex items-center justify-between font-bold text-emerald-800">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Paid in Full / Complete:
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg">$0.00</span>
                  </div>
                ) : (
                  <div className="px-3 py-2 bg-amber-50 border border-amber-300 rounded-xl text-xs flex items-center justify-between font-mono font-bold text-amber-900">
                    <span className="text-amber-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Balance:
                    </span>
                    <span className="text-sm text-red-600 font-extrabold">{formatCurrency(selectedStatement?.totals?.balanceDue || 0)}</span>
                  </div>
                )}
              </div>
            </div>

            {isSelectedZeroBalance && (
              <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  à¤¯à¤¹ à¤¸à¥à¤Ÿà¥‡à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤ªà¥‚à¤°à¥€ à¤¤à¤°à¤¹ à¤šà¥à¤•à¤¤à¤¾ (<strong>Paid in Full / $0.00</strong>) à¤¹à¥ˆà¥¤ à¤¯à¤¦à¤¿ à¤…à¤¨à¥à¤¯ à¤•à¤¿à¤¸à¥€ à¤ªà¥à¤°à¥‹à¤µà¤¾à¤‡à¤¡à¤° à¤ªà¤° à¤¬à¤•à¤¾à¤¯à¤¾ à¤¹à¥ˆ, à¤¤à¥‹ à¤¡à¥à¤°à¥‰à¤ªà¤¡à¤¾à¤‰à¤¨ à¤¸à¥‡ à¤ªà¥‡à¤‚à¤¡à¤¿à¤‚à¤— à¤¸à¥à¤Ÿà¥‡à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤šà¥à¤¨à¥‡à¤‚à¥¤
                </span>
              </div>
            )}
          </div>

          {/* Payment Details */}
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Payment Details</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Payment Date *</label>
                <input type="date" required className={inputCls} value={form.paymentDate} onChange={e => set('paymentDate', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Posting Date</label>
                <input type="date" className={inputCls} value={form.postingDate} onChange={e => set('postingDate', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>EOB / RA Date</label>
                <input type="date" className={inputCls} value={form.eobDate} onChange={e => set('eobDate', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div>
                <label className={labelCls}>Payment Amount ($) *</label>
                <input type="number" step="0.01" required className={inputCls} value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <label className={labelCls}>Payment Method</label>
                <select className={inputCls} value={form.method} onChange={e => set('method', e.target.value)}>
                  <option value="EFT">EFT / ACH Direct Deposit</option>
                  <option value="CHECK">Insurance Check</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="CASH">Cash / Patient Direct</option>
                  <option value="WIRE">Attorney Settlement Wire</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Check / Trace Number</label>
                <input className={inputCls} value={form.checkNumber} onChange={e => set('checkNumber', e.target.value)} placeholder="e.g. CHK-889201" />
              </div>
            </div>
            
            <div className="mt-3">
              <label className={labelCls}>Reference / ERA Number</label>
              <input className={inputCls} value={form.referenceNumber} onChange={e => set('referenceNumber', e.target.value)} placeholder="e.g. ERA-2026-081" />
            </div>
          </div>

          {/* Insurance / EOB Details (when Insurance selected) */}
          {form.paymentType === 'INSURANCE' && (
            <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl space-y-3">
              <p className="text-[10px] font-extrabold text-teal-800 uppercase tracking-wider">Insurance &amp; EOB Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Insurance Carrier</label>
                  <input className={inputCls} value={form.insuranceCompany} onChange={e => set('insuranceCompany', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Claims Adjuster</label>
                  <input className={inputCls} value={form.adjusterName} onChange={e => set('adjusterName', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Claim Number</label>
                  <input className={inputCls} value={form.claimNumber} onChange={e => set('claimNumber', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Policy Number</label>
                  <input className={inputCls} value={form.policyNumber} onChange={e => set('policyNumber', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className={labelCls}>Allowed Amt ($)</label>
                  <input type="number" step="0.01" className={inputCls} value={form.allowedAmount} onChange={e => set('allowedAmount', e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <label className={labelCls}>Contractual Adj ($)</label>
                  <input type="number" step="0.01" className={inputCls} value={form.contractualAdj} onChange={e => set('contractualAdj', e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <label className={labelCls}>Coinsurance ($)</label>
                  <input type="number" step="0.01" className={inputCls} value={form.coinsurance} onChange={e => set('coinsurance', e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <label className={labelCls}>Deductible ($)</label>
                  <input type="number" step="0.01" className={inputCls} value={form.deductible} onChange={e => set('deductible', e.target.value)} placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Denial Reason / Remark Code (if applicable)</label>
                <input className={inputCls} value={form.denialReason} onChange={e => set('denialReason', e.target.value)} placeholder="e.g. CO-45, PR-2, Medically Necessary Verified" />
              </div>
            </div>
          )}

          {/* Status & Notes */}
          <div>
            <label className={labelCls}>Internal Notes</label>
            <textarea rows={2} className={`${inputCls} resize-none`} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="e.g. Insurance check received and posted towards outstanding balance." />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer">
              <Save className="w-4 h-4" /> {saving ? 'Posting to Ledger...' : 'Post Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Dynamic Post Adjustment / Write-Off Modal --------------------------------
const PostAdjustmentModal = ({ onClose, onSuccess }) => {
  const { addToast } = useUIStore();
  const [saving, setSaving] = useState(false);
  const [casesList, setCasesList] = useState([]);
  const [availableStatements, setAvailableStatements] = useState([]);
  const [selectedStatement, setSelectedStatement] = useState(null);

  const [form, setForm] = useState({
    caseId: '',
    linkedBillId: '',
    applyToStatement: '',
    amount: '',
    reason: 'Contractual Insurance Discount / LOP Settlement Adjustment'
  });

  useEffect(() => {
    apiCaseService.getCases().then(res => {
      if (res && res.length > 0) {
        setCasesList(res);
        handleCaseSelect(res[0].id || res[0].caseId, res);
      }
    });
  }, []);

  const handleCaseSelect = async (caseId, list = casesList) => {
    const matched = list.find(c => c.id === caseId || c.caseId === caseId);
    if (!matched) return;
    setForm(p => ({ ...p, caseId: matched.id || matched.caseId }));

    try {
      const res = await apiBillingService.getFourBillsByCase(matched.id || matched.caseId);
      const bills = res?.allBills || [];
      setAvailableStatements(bills);
      if (bills.length > 0) {
        setSelectedStatement(bills[0]);
        setForm(p => ({
          ...p,
          linkedBillId: bills[0].id,
          applyToStatement: bills[0].statementNumber ? `Statement #${bills[0].statementNumber}` : bills[0].id
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      addToast('Please enter a valid adjustment amount.', 'warning');
      return;
    }
    if (!form.linkedBillId) {
      addToast('Please select an active provider statement.', 'warning');
      return;
    }

    setSaving(true);
    try {
      await apiBillingService.postAdjustment(form.linkedBillId, {
        lineIndex: 0,
        amount: Number(form.amount),
        reason: form.reason
      });
      addToast(`Adjustment of $${Number(form.amount).toFixed(2)} applied directly to database!`, 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error posting adjustment:', err);
      addToast('Failed to apply adjustment to database.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8 border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Post Adjustment / Write-Off</h2>
              <p className="text-[10px] text-slate-500">Apply contractual write-off or attorney fee reduction</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-xl transition cursor-pointer">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className={labelCls}>Patient Accident Case *</label>
            <select value={form.caseId} onChange={e => handleCaseSelect(e.target.value)} className={inputCls}>
              {casesList.map(c => (
                <option key={c.id || c.caseId} value={c.id || c.caseId}>
                  {c.caseId || c.id} — {c.patientName || 'Accident Patient'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Apply to Statement / Provider Ledger *</label>
            <select 
              value={form.linkedBillId} 
              onChange={e => {
                const matched = availableStatements.find(b => b.id === e.target.value);
                if (matched) {
                  setSelectedStatement(matched);
                  setForm(p => ({ ...p, linkedBillId: matched.id, applyToStatement: matched.statementNumber || matched.id }));
                }
              }} 
              className={inputCls}
            >
              {availableStatements.map(b => (
                <option key={b.id} value={b.id}>
                  {b.providerName} (Statement #{b.statementNumber || 'N/A'}) — Balance: {formatCurrency(b.totals?.balanceDue || 0)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Adjustment Amount ($) *</label>
            <input type="number" step="0.01" required className={inputCls} value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" />
          </div>

          <div>
            <label className={labelCls}>Reason / Write-Off Type *</label>
            <select className={inputCls} value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}>
              <option value="Contractual Insurance Write-off (EOB CO-45)">Contractual Insurance Write-off (EOB CO-45)</option>
              <option value="Attorney LOP Settlement Discount">Attorney LOP Settlement Discount</option>
              <option value="Self-Pay Hardship Adjustment">Self-Pay Hardship Adjustment</option>
              <option value="Prompt Pay Discount">Prompt Pay Discount</option>
              <option value="Administrative Write-off">Administrative Write-off</option>
            </select>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer">
              <Save className="w-4 h-4" /> {saving ? 'Applying...' : 'Apply Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Payments & Adjustments Ledger Page
export const PaymentsAndAdjustmentsPage = () => {
  const [activeTab, setActiveTab] = useState('payments');
  const [search, setSearch] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [stats, setStats] = useState({ totalBilled: 139484, amountCollected: 650, totalAdjustments: 50, outstandingBalance: 138784 });
  const [dbTransactions, setDbTransactions] = useState([]);

  const loadData = () => {
    apiBillingService.getOverviewStats().then(res => {
      if (res?.kpis) setStats(res.kpis);
    }).catch(() => {});

    apiBillingService.getPaymentsList().then(txs => {
      if (txs && txs.length > 0) setDbTransactions(txs);
    }).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const displayPayments = dbTransactions.filter(t => t.type.includes('Payment'));
  const displayAdjustments = dbTransactions.filter(t => t.type.includes('Adjustment') || t.type.includes('Write-off'));

  const filteredPayments = displayPayments.filter(p => 
    p.patient?.toLowerCase().includes(search.toLowerCase()) ||
    p.provider?.toLowerCase().includes(search.toLowerCase()) ||
    p.ref?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAdjustments = displayAdjustments.filter(a => 
    a.patient?.toLowerCase().includes(search.toLowerCase()) ||
    a.provider?.toLowerCase().includes(search.toLowerCase()) ||
    a.reason?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Payments &amp; Adjustments Ledger</h1>
          <p className="text-xs text-slate-500">Post dynamic insurance checks, attorney settlement payments, contractual write-offs &amp; discounts</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAdjustmentModal(true)}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <FileText className="w-4 h-4 text-amber-600" /> Post Adjustment
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer transition"
          >
            <Plus className="w-4 h-4" /> Post New Payment
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Payments Posted', value: formatCurrency(stats.amountCollected || 0), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Adjustments', value: formatCurrency(stats.totalAdjustments || 0), icon: XCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total Billed Charges', value: formatCurrency(stats.totalBilled || 0), icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Outstanding Balance', value: formatCurrency(stats.outstandingBalance || 0), icon: CreditCard, color: 'text-teal-700', bg: 'bg-teal-50' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">{card.label}</span>
                <div className={`p-1.5 rounded-lg ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <p className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Transactions Tabs & Tables */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-5 py-3 text-xs font-bold transition cursor-pointer ${
              activeTab === 'payments' ? 'border-b-2 border-teal-600 text-teal-800 bg-teal-50/50' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Insurance &amp; Patient Payments ({displayPayments.length})
          </button>
          <button
            onClick={() => setActiveTab('adjustments')}
            className={`px-5 py-3 text-xs font-bold transition cursor-pointer ${
              activeTab === 'adjustments' ? 'border-b-2 border-teal-600 text-teal-800 bg-teal-50/50' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Write-Offs &amp; Adjustments ({displayAdjustments.length})
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions by patient name, provider, reference #..."
              className="w-full pl-10 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600"
            />
          </div>

          {activeTab === 'payments' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-left">Transaction ID</th>
                    <th className="p-3 text-left">Posting Date</th>
                    <th className="p-3 text-left">Provider Statement</th>
                    <th className="p-3 text-left">Patient</th>
                    <th className="p-3 text-left">Payer Type</th>
                    <th className="p-3 text-right">Amount Paid</th>
                    <th className="p-3 text-center">Payment Method</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-slate-400">
                        No payment transactions recorded yet. Click <strong>"Post New Payment"</strong> above to record your first payment.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-teal-700">{p.id}</td>
                        <td className="p-3 font-mono text-slate-600">{p.date}</td>
                        <td className="p-3 font-semibold text-slate-900">{p.provider}</td>
                        <td className="p-3 text-slate-700 font-medium">{p.patient}</td>
                        <td className="p-3 text-slate-600">{p.type}</td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-600">{formatCurrency(p.amount)}</td>
                        <td className="p-3 text-center">
                          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-bold">{p.method}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{p.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'adjustments' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-left">Adjustment ID</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Provider Statement</th>
                    <th className="p-3 text-left">Patient</th>
                    <th className="p-3 text-right">Adjusted Amount</th>
                    <th className="p-3 text-left">Reason / Code</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdjustments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-400">
                        No write-offs or adjustments recorded yet. Click <strong>"Post Adjustment"</strong> above to record contractual write-offs.
                      </td>
                    </tr>
                  ) : (
                    filteredAdjustments.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-amber-700">{a.id}</td>
                        <td className="p-3 font-mono text-slate-600">{a.date}</td>
                        <td className="p-3 font-semibold text-slate-900">{a.provider}</td>
                        <td className="p-3 text-slate-700 font-medium">{a.patient}</td>
                        <td className="p-3 text-right font-mono font-bold text-amber-600">{formatCurrency(a.amount)}</td>
                        <td className="p-3 text-slate-600 text-xs">{a.ref || a.reason || 'Contractual Adjustment'}</td>
                        <td className="p-3 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">{a.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Payment Modal */}
      {showPaymentModal && <PostPaymentModal onClose={() => setShowPaymentModal(false)} onSuccess={loadData} />}

      {/* Dynamic Adjustment Modal */}
      {showAdjustmentModal && <PostAdjustmentModal onClose={() => setShowAdjustmentModal(false)} onSuccess={loadData} />}
    </div>
  );
};
