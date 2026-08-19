// src/pages/cases/CaseListPage.jsx
import React, { useEffect, useState } from 'react';
import { mockCaseService } from '../../services/mock/mockCaseService';
import { FileText, PlusCircle, Search, ChevronRight, Eye, FileSpreadsheet, Scale, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddCaseModal } from '../../components/modals/AddCaseModal';
import { CaseDetailsModal } from '../../components/modals/CaseDetailsModal';
import { AddAttorneyModal } from '../../components/modals/AddAttorneyModal';

export const CaseListPage = () => {
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddAttorneyModal, setShowAddAttorneyModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const navigate = useNavigate();

  const loadCases = () => {
    mockCaseService.getCases({ search }).then(res => setCases(res || [])).catch(() => {});
  };

  useEffect(() => {
    loadCases();
  }, [search]);

  return (
    <div className="space-y-5">
      {/* â”€â”€ Top Header & Actions â”€â”€ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Accident &amp; Legal Cases</h1>
          <p className="text-xs text-slate-500">Motor vehicle accidents, personal injury claims, law firm assignments &amp; 4-provider billing linkages</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button 
            onClick={() => setShowAddAttorneyModal(true)} 
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Scale className="w-4 h-4 text-teal-600" /> Register Law Firm
          </button>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Create Accident Case
          </button>
        </div>
      </div>

      {/* â”€â”€ Search Bar â”€â”€ */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by Case ID, patient name, attorney, law firm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs rounded-lg border-0 bg-transparent focus:ring-0 text-slate-900 outline-none"
        />
      </div>

      {/* â”€â”€ Cases List (Mobile Cards + Desktop Table) â”€â”€ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {cases.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-900">No Accident Cases Found</p>
            <p className="text-xs text-slate-500">No records match your search criteria.</p>
          </div>
        ) : (
          <>
            {/* 1. Mobile Cards View (< 768px) */}
            <div className="divide-y divide-slate-100 md:hidden">
              {cases.map((c) => (
                <div key={c.id} className="p-4 space-y-3 hover:bg-slate-50/70 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-extrabold text-teal-700 font-mono text-sm block">{c.caseId}</span>
                      <h3
                        onClick={() => setSelectedCase(c)}
                        className="font-bold text-slate-900 text-xs mt-0.5 hover:underline cursor-pointer"
                      >
                        {c.patientName}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {c.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Accident Date: <strong className="text-slate-800">{c.accidentDate}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Attorney: <strong className="text-slate-800">{c.attorneyName || 'Self-Represented'}</strong> {c.lawFirm ? `(${c.lawFirm})` : ''}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {c.assignedProviderIds?.map(pid => (
                      <span key={pid} className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-800 rounded border border-slate-200">
                        {pid.replace('prov-', '').toUpperCase()}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button 
                      onClick={() => setSelectedCase(c)} 
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" /> View Case
                    </button>
                    <button 
                      onClick={() => navigate(`/billing/provider-bills?caseId=${c.id || c.caseId}`)} 
                      className="flex-1 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition cursor-pointer shadow-xs"
                    >
                      Bills Ledger <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
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
                    <tr key={c.id} className="hover:bg-slate-50/80 transition">
                      <td 
                        className="p-3.5 font-bold font-mono text-teal-700 hover:underline cursor-pointer"
                        onClick={() => setSelectedCase(c)}
                      >
                        {c.caseId}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">{c.patientName}</td>
                      <td className="p-3.5 text-slate-600">
                        <p className="font-semibold text-slate-900">{c.accidentDate}</p>
                        <p className="text-[10px] text-slate-400">{c.accidentType}</p>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {c.attorneyName || c.lawFirm ? (
                          <>
                            <p className="font-bold text-slate-900">{c.attorneyName || 'Personal Injury Attorney'}</p>
                            <p className="text-[10px] text-slate-400">{c.lawFirm || 'Lien Representation'}</p>
                          </>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 inline-block">
                            Self-Represented / Direct Billing
                          </span>
                        )}
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
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs inline-flex items-center gap-1 transition cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-teal-600" /> View Case
                          </button>
                          <button 
                            onClick={() => navigate(`/billing/provider-bills?caseId=${c.id || c.caseId}`)} 
                            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1 transition cursor-pointer shadow-xs"
                          >
                            Bills Ledger <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Interactive Modals */}
      <AddCaseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCaseAdded={() => loadCases()}
      />

      <AddAttorneyModal
        isOpen={showAddAttorneyModal}
        onClose={() => setShowAddAttorneyModal(false)}
        onAttorneyAdded={() => loadCases()}
      />

      {selectedCase && (
        <CaseDetailsModal
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          caseItem={selectedCase}
          onCaseUpdated={() => loadCases()}
        />
      )}
    </div>
  );
};
