// src/pages/billing/BillDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { formatCurrency } from '../../utils/billingCalculations';
import { formatStatus } from '../../utils/formatters';
import { PrintableStatementModal } from '../../components/billing/PrintableStatementModal';
import { useUIStore } from '../../store/uiStore';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, FileText, CheckCircle2, Lock, Plus, FileCheck, Printer } from 'lucide-react';

export const BillDetailsPage = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const [paymentForm, setPaymentForm] = useState({ amount: 150, payerType: 'INSURANCE', referenceNumber: 'REF-9921', lineIndex: 0 });
  const [adjustmentForm, setAdjustmentForm] = useState({ amount: 50, reason: 'Contractual Adjustment', lineIndex: 0 });

  const { addToast } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    mockBillingService.getBillById(id).then(setBill);
  }, [id]);

  if (!bill) return <div className="p-6 text-xs text-slate-500">Loading provider bill statement...</div>;

  const handlePostPayment = async (e) => {
    e.preventDefault();
    const updated = await mockBillingService.postPayment(bill.id, paymentForm.lineIndex, Number(paymentForm.amount), paymentForm.payerType, paymentForm.referenceNumber);
    setBill(updated);
    setShowPaymentModal(false);
    addToast('Payment posted successfully!', 'success');
  };

  const handlePostAdjustment = async (e) => {
    e.preventDefault();
    const updated = await mockBillingService.postAdjustment(bill.id, adjustmentForm.lineIndex, Number(adjustmentForm.amount), adjustmentForm.reason);
    setBill(updated);
    setShowAdjustmentModal(false);
    addToast('Adjustment posted successfully!', 'success');
  };

  const handleFinalise = async () => {
    const updated = await mockBillingService.finaliseBill(bill.id);
    setBill(updated);
    addToast('Bill finalized!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <button onClick={() => navigate('/billing/provider-bills')} className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to Provider Bills Ledger
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{bill.providerName} Statement</h1>
            <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full font-bold text-xs border border-teal-200">
              {formatStatus(bill.status)}
            </span>
          </div>
          <p className="text-xs text-slate-500">Statement #{bill.statementNumber} | Case #{bill.caseId} | {bill.patientName}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print PDF Statement
          </button>
          <button onClick={() => setShowPaymentModal(true)} className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
            Post Payment
          </button>
          <button onClick={() => setShowAdjustmentModal(true)} className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition">
            Post Adjustment
          </button>
          <button onClick={handleFinalise} className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition">
            Finalise Bill
          </button>
        </div>
      </div>

      {/* Bill Line Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 className="text-sm font-bold text-slate-900">Itemized Service Line Ledger</h2>
          <span className="text-xs text-slate-500 font-semibold">{(bill.lineItems || []).length} Service Lines</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">DOS</th>
                <th className="p-3">CPT / Code</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Units</th>
                <th className="p-3 text-right">Charge</th>
                <th className="p-3 text-right">Ins. Pay</th>
                <th className="p-3 text-right">Pat. Pay</th>
                <th className="p-3 text-right">Adjustment</th>
                <th className="p-3 text-right">Line Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-tabular">
              {(bill.lineItems || []).map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-mono text-slate-500">{item.dos}</td>
                  <td className="p-3 font-bold text-slate-900">{item.cptCode}</td>
                  <td className="p-3 text-slate-800">{item.description}</td>
                  <td className="p-3 text-right font-mono">{item.units}</td>
                  <td className="p-3 text-right font-bold text-slate-900">{formatCurrency(item.charge)}</td>
                  <td className="p-3 text-right font-semibold text-emerald-600">{formatCurrency(item.payments?.insurance || 0)}</td>
                  <td className="p-3 text-right font-semibold text-emerald-600">{formatCurrency(item.payments?.patient || 0)}</td>
                  <td className="p-3 text-right font-semibold text-amber-600">{formatCurrency(item.adjustments || 0)}</td>
                  <td className="p-3 text-right font-bold text-teal-700">{formatCurrency(item.lineBalance || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500"><span>Total Charges:</span><span className="font-bold text-slate-900 font-tabular">{formatCurrency(bill.totals?.totalCharges || 0)}</span></div>
            <div className="flex justify-between text-emerald-600"><span>Total Payments:</span><span className="font-bold font-tabular">{formatCurrency(bill.totals?.totalPayments || 0)}</span></div>
            <div className="flex justify-between text-amber-600"><span>Total Adjustments:</span><span className="font-bold font-tabular">{formatCurrency(bill.totals?.totalAdjustments || 0)}</span></div>
            <div className="flex justify-between text-sm font-bold text-teal-700 pt-2 border-t border-slate-200">
              <span>Balance Due:</span>
              <span className="font-tabular">{formatCurrency(bill.totals?.balanceDue || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Printable Statement Modal */}
      {showPrintModal && (
        <PrintableStatementModal bill={bill} onClose={() => setShowPrintModal(false)} />
      )}

      {/* Post Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handlePostPayment} className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Post Payment</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Amount ($)</label>
              <input type="number" required value={paymentForm.amount} onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})} className="w-full px-3 py-2 text-xs border rounded-xl" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Payer Type</label>
              <select value={paymentForm.payerType} onChange={(e) => setPaymentForm({...paymentForm, payerType: e.target.value})} className="w-full px-3 py-2 text-xs border rounded-xl">
                <option value="INSURANCE">Auto Insurance Payer</option>
                <option value="PATIENT">Patient Out-of-Pocket</option>
                <option value="ATTORNEY_LOP">Attorney LOP Settlement</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowPaymentModal(false)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-sm">Submit Payment</button>
            </div>
          </form>
        </div>
      )}

      {/* Post Adjustment Modal */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handlePostAdjustment} className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Post Adjustment</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Amount ($)</label>
              <input type="number" required value={adjustmentForm.amount} onChange={(e) => setAdjustmentForm({...adjustmentForm, amount: e.target.value})} className="w-full px-3 py-2 text-xs border rounded-xl" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Reason</label>
              <input type="text" required value={adjustmentForm.reason} onChange={(e) => setAdjustmentForm({...adjustmentForm, reason: e.target.value})} className="w-full px-3 py-2 text-xs border rounded-xl" />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAdjustmentModal(false)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-sm">Submit Adjustment</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
