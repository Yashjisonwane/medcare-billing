// src/pages/cms/CmsClaimListPage.jsx
import React, { useEffect, useState } from 'react';
import { mockCms1500Service } from '../../services/mock/mockCms1500Service';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { FileCheck, ChevronRight, AlertTriangle, Eye, Printer, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CmsClaimListPage = () => {
  const [allClaims, setAllClaims] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const billIds = ['bill-anik-001', 'bill-davs-001', 'bill-josmic-001'];
    Promise.all(billIds.map(id => mockCms1500Service.getClaimsByBillId(id))).then(results => {
      const flattened = results.flat();
      setAllClaims(flattened);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CMS-1500 Health Insurance Claim Reference Queue</h1>
          <p className="text-xs text-slate-500">Date-grouped 08/05 health insurance claim form references generated from provider bills</p>
        </div>
      </div>

      <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-900 flex items-center gap-2.5">
        <FileCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
        <span>
          <strong>Form Version:</strong> Official CMS-1500 (02/12) Standard &bull; Automated claim mapping linked to appointment visit dates.
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Claim DOS</th>
                <th className="p-3">Provider</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Box 17 Referring</th>
                <th className="p-3">Diagnoses (Box 21)</th>
                <th className="p-3 text-right">Total Charge</th>
                <th className="p-3 text-right">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allClaims.map((claim) => (
                <tr key={claim.claimId} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-teal-700">{claim.dosDisplay}</td>
                  <td className="p-3 font-bold text-slate-900">{claim.providerName}</td>
                  <td className="p-3 text-slate-800">{claim.box2}</td>
                  <td className="p-3 text-slate-700">{claim.box17ReferringName}</td>
                  <td className="p-3 font-mono text-slate-600">{claim.box21Diagnoses?.join(', ')}</td>
                  <td className="p-3 text-right font-bold text-slate-900 font-tabular">${claim.box28TotalCharge}</td>
                  <td className="p-3 text-right">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-700 rounded-full border border-teal-200">
                      {claim.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => navigate(`/cms-1500/${claim.billId}/preview`)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview Form
                    </button>
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
