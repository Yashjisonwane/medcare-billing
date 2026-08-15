// src/pages/cases/CaseListPage.jsx
import React, { useEffect, useState } from 'react';
import { mockCaseService } from '../../services/mock/mockCaseService';
import { FileText, PlusCircle, Search, ChevronRight, Eye, FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddCaseModal } from '../../components/modals/AddCaseModal';
import { CaseDetailsModal } from '../../components/modals/CaseDetailsModal';

export const CaseListPage = () => {
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const navigate = useNavigate();

  const loadCases = () => {
    mockCaseService.getCases({ search }).then(setCases);
  };

  useEffect(() => {
    loadCases();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Accident &amp; Legal Cases</h1>
          <p className="text-xs text-slate-500">Motor vehicle accidents, personal injury claims, law firm assignments &amp; 4-provider billing linkages</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Create Accident Case
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by Case ID, patient name, attorney, law firm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs rounded-lg border-0 bg-transparent focus:ring-0 text-slate-900 outline-none"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3.5">Case ID</th>
                <th className="p-3.5">Patient</th>
                <th className="p-3.5">Accident Date &amp; Type</th>
                <th className="p-3.5">Attorney &amp; Law Firm</th>
                <th className="p-3.5">Assigned Providers</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td 
                    className="p-3.5 font-bold font-mono text-teal-700 hover:underline cursor-pointer"
                    onClick={() => setSelectedCase(c)}
                  >
                    {c.caseId}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">{c.patientName}</td>
                  <td className="p-3.5 text-slate-600">
                    <p className="font-semibold text-slate-900">{c.accidentDate}</p>
                    <p className="text-[10px] text-slate-500">{c.accidentType}</p>
                  </td>
                  <td className="p-3.5 text-slate-600">
                    <p className="font-bold text-slate-900">{c.attorneyName}</p>
                    <p className="text-[10px] text-slate-500">{c.lawFirm}</p>
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {c.assignedProviderIds?.map(pid => (
                        <span key={pid} className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-800 rounded border border-slate-200">
                          {pid.replace('prov-', '').toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => setSelectedCase(c)} 
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs inline-flex items-center gap-1 transition"
                      >
                        <Eye className="w-3 h-3 text-teal-600" /> View Case
                      </button>
                      <button 
                        onClick={() => navigate('/billing/four-bills')} 
                        className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold rounded-lg text-xs inline-flex items-center gap-1 transition"
                      >
                        4-Bills <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Modals */}
      <AddCaseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCaseAdded={() => loadCases()}
      />

      <CaseDetailsModal
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
        caseItem={selectedCase}
      />
    </div>
  );
};

