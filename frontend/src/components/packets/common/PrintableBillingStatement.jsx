// src/components/packets/common/PrintableBillingStatement.jsx
import React from 'react';
import { formatCurrency } from '../../../utils/billingCalculations';
import { useSettings } from '../../../utils/settingsCache';

export const PrintableBillingStatement = ({ bill, pageIndex = 0 }) => {
  const settings = useSettings();
  const b = bill || {
    providerName: '',
    providerAddress: '',
    providerPhone: '',
    statementNumber: '',
    statementDate: '',
    patientName: '',
    patientSystemId: '',
    patientAddress: '',
    billToName: '',
    billToAddress: '',
    lineItems: [],
    totals: { totalCharges: 0, totalPayments: 0, totalAdjustments: 0, balanceDue: 0 }
  };

  const lineItems = b.lineItems || [];
  const displayItems = lineItems.length > 8
    ? (pageIndex === 0 ? lineItems.slice(0, 8) : lineItems.slice(8))
    : lineItems;

  return (
    <div
      className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300 p-8 space-y-6 print:border-none print:shadow-none"
      style={{ width: '850px', height: '1100px', breakAfter: 'page', pageBreakAfter: 'always' }}
    >
      {/* Statement Top Header */}
      <div className="flex justify-between items-start border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase">{b.providerName}</h1>
          <p className="text-xs text-slate-600 mt-1">{b.providerAddress}</p>
          <p className="text-xs text-slate-600">TEL / CELL: {b.providerPhone} | FAX: 832-416-1502</p>
        </div>
        <div className="text-right font-mono">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Billing Statement</h2>
          <p className="text-xs font-bold text-slate-700 mt-1">Statement No: <span className="text-slate-900">{b.statementNumber}</span></p>
          <p className="text-xs font-semibold text-slate-600">Statement Date: {b.statementDate}</p>
          <p className="text-[10px] text-slate-500 font-bold mt-1">PAGE {pageIndex + 1} OF {lineItems.length > 8 ? 2 : 1}</p>
        </div>
      </div>

      {/* Bill To Box */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-full sm:w-1/2">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bill To:</p>
        <h3 className="text-sm font-bold text-slate-900 mt-0.5">{b.billToName}</h3>
        <p className="text-xs text-slate-700 whitespace-pre-line">{b.billToAddress}</p>
      </div>

      {/* Patient Details Banner */}
      <div className="grid grid-cols-3 gap-4 p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-500 block">Patient Name:</span>
          <strong className="text-slate-900 font-bold">{b.patientName}</strong>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 block">Patient Address:</span>
          <span className="text-slate-800 truncate block">{b.patientAddress}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 block">Patient ID / Case:</span>
          <span className="font-mono font-bold text-slate-900">{b.patientSystemId} ({b.caseId})</span>
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
            {displayItems.map((item, idx) => (
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

      {/* Aging Grid Footer */}
      {pageIndex === (lineItems.length > 8 ? 1 : 0) && (
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
                  <td className="p-2.5 border-r border-slate-300">{formatCurrency(b.aging?.current || 0)}</td>
                  <td className="p-2.5 border-r border-slate-300">{formatCurrency(b.aging?.past30 || 0)}</td>
                  <td className="p-2.5 border-r border-slate-300">{formatCurrency(b.aging?.past60 || 0)}</td>
                  <td className="p-2.5 border-r border-slate-300">{formatCurrency(b.aging?.past90 || 0)}</td>
                  <td className="p-2.5 bg-slate-100 text-slate-900 font-black text-sm">{formatCurrency(b.totals?.balanceDue || 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
