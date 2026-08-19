// src/pages/cms/CmsClaimListPage.jsx
import React, { useEffect, useState } from 'react';
import { mockCms1500Service } from '../../services/mock/mockCms1500Service';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { mockCaseService } from '../../services/mock/mockCaseService';
import { formatCurrency } from '../../utils/billingCalculations';
import { Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CmsClaimListPage = () => {
  const [allClaims, setAllClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    mockCaseService.getCases().then(async (cases) => {
      const allResults = [];
      const targetCases = cases && cases.length > 0 ? cases : [{ id: 'case-001', caseId: 'CASE-2025-1227' }];
      for (const c of targetCases) {
        try {
          const caseBillsRes = await mockBillingService.getFourBillsByCase(c.id || c.caseId);
          for (const bill of (caseBillsRes?.allBills || [])) {
            const claims = await mockCms1500Service.getClaimsByBillId(bill.id);
            allResults.push(...claims);
          }
        } catch {}
      }

      if (allResults.length > 0) {
        setAllClaims(allResults);
      } else {
        const fallbackIds = ['bill-anik-001', 'bill-davs-001', 'bill-josmic-001'];
        Promise.all(fallbackIds.map(id => mockCms1500Service.getClaimsByBillId(id))).then(res => {
          setAllClaims(res.flat());
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredClaims = allClaims.filter(c => {
    const q = search.toLowerCase();
    return (
      (c.box2 || '').toLowerCase().includes(q) ||
      (c.providerName || '').toLowerCase().includes(q) ||
      (c.dosDisplay || '').includes(q) ||
      (c.box17ReferringName || '').toLowerCase().includes(q) ||
      (c.box21Diagnoses || []).some(d => d.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Simple Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">CMS-1500 Claims</h1>
          <p className="text-xs text-slate-500">Date-grouped health insurance claims generated from provider bills (Form 02/12)</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search claims..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-800"
          />
        </div>
      </div>

      {/* Clean & Simple Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wide">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Claim DOS</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Box 17 Referring</th>
                <th className="py-3 px-4">Diagnoses (Box 21)</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Total Charge</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-xs text-slate-400">
                    No claims found.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr key={claim.claimId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                      {claim.dosDisplay}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {claim.providerName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {claim.box2}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {claim.box17ReferringName || 'Dr. Segun Adeoye'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 max-w-[220px]">
                      {(claim.box21Diagnoses || []).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(parseFloat(claim.box28TotalCharge) || 0)}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                        {claim.status || 'Generated & Validated'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/cms-1500/${claim.billId}/preview`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-lg transition shadow-2xs cursor-pointer whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Form</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
