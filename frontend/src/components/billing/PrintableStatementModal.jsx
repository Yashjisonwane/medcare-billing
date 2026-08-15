// src/components/billing/PrintableStatementModal.jsx
import React from 'react';
import { formatCurrency } from '../../utils/billingCalculations';
import { Printer, X, ShieldCheck } from 'lucide-react';

export const PrintableStatementModal = ({ bill, onClose }) => {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-300 p-6 space-y-6 text-slate-900 font-sans">
        
        {/* Top Control Bar (Hidden during printing) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">Official Billing Statement Preview</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" /> Print PDF Statement
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PAPER STATEMENT LAYOUT (Matching Sample PDF Layout) */}
        <div className="p-8 border border-slate-200 rounded-xl bg-white space-y-6 print:border-none print:p-0">
          
          {/* Statement Top Header */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase">{bill.providerName}</h1>
              <p className="text-xs text-slate-600 mt-1">{bill.providerAddress}</p>
              <p className="text-xs text-slate-600">TEL / CELL: {bill.providerPhone} | FAX: 832-416-1502</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Billing Statement</h2>
              <p className="text-xs font-bold text-slate-700 mt-1">Statement No: <span className="font-mono text-slate-900">{bill.statementNumber}</span></p>
              <p className="text-xs font-semibold text-slate-600">Statement Date: {bill.statementDate}</p>
            </div>
          </div>

          {/* Bill To Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-full sm:w-1/2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bill To:</p>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">{bill.billToName}</h3>
            <p className="text-xs text-slate-700 whitespace-pre-line">{bill.billToAddress}</p>
          </div>

          {/* Patient Details Banner */}
          <div className="grid grid-cols-3 gap-4 p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-500 block">Patient Name:</span>
              <strong className="text-slate-900 font-bold">{bill.patientName}</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 block">Patient Address:</span>
              <span className="text-slate-800 truncate block">{bill.patientAddress}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 block">Patient ID / Case:</span>
              <span className="font-mono font-bold text-slate-900">{bill.patientSystemId} ({bill.caseId})</span>
            </div>
          </div>

          {/* Service Line Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-200 text-slate-800 uppercase font-bold text-[10px] border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300">Date of Service</th>
                  <th className="p-2 border-r border-slate-300">Procedure</th>
                  <th className="p-2 border-r border-slate-300">Description</th>
                  <th className="p-2 text-right border-r border-slate-300">Charge</th>
                  <th className="p-2 text-right border-r border-slate-300">Ins. Pay</th>
                  <th className="p-2 text-right border-r border-slate-300">Pat. Pay</th>
                  <th className="p-2 text-right border-r border-slate-300">Adjustment</th>
                  <th className="p-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(bill.lineItems || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 font-tabular">
                    <td className="p-2 border-r border-slate-200 font-mono">{item.dos}</td>
                    <td className="p-2 border-r border-slate-200 font-bold">{item.cptCode}</td>
                    <td className="p-2 border-r border-slate-200">{item.description}</td>
                    <td className="p-2 text-right border-r border-slate-200 font-bold">{formatCurrency(item.charge)}</td>
                    <td className="p-2 text-right border-r border-slate-200 text-slate-600">{formatCurrency(item.payments?.insurance || 0)}</td>
                    <td className="p-2 text-right border-r border-slate-200 text-slate-600">{formatCurrency(item.payments?.patient || 0)}</td>
                    <td className="p-2 text-right border-r border-slate-200 text-slate-600">{formatCurrency(item.adjustments || 0)}</td>
                    <td className="p-2 text-right font-bold text-slate-900">{formatCurrency(item.lineBalance || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Comments & Aging Grid Footer */}
          <div className="pt-4 space-y-4">
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-center text-xs font-tabular">
                <thead className="bg-slate-200 font-bold text-[10px] uppercase text-slate-700">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Current Due</th>
                    <th className="p-2 border-r border-slate-300">Past Due 30 Days</th>
                    <th className="p-2 border-r border-slate-300">Past Due 60 Days</th>
                    <th className="p-2 border-r border-slate-300">Past Due 90 Days</th>
                    <th className="p-2 bg-slate-800 text-white">Balance Due</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-bold text-slate-900">
                    <td className="p-2.5 border-r border-slate-300">{formatCurrency(bill.aging?.current || 0)}</td>
                    <td className="p-2.5 border-r border-slate-300">{formatCurrency(bill.aging?.past30 || 0)}</td>
                    <td className="p-2.5 border-r border-slate-300">{formatCurrency(bill.aging?.past60 || 0)}</td>
                    <td className="p-2.5 border-r border-slate-300">{formatCurrency(bill.aging?.past90 || 0)}</td>
                    <td className="p-2.5 bg-slate-100 text-slate-900 font-black text-sm">{formatCurrency(bill.totals?.balanceDue || 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-slate-500 italic text-center">
              Thank you for choosing {bill.providerName}. For billing questions, please call {bill.providerPhone}.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
