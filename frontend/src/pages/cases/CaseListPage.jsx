// src/pages/cases/CaseListPage.jsx
import React, { useEffect, useState } from 'react';
import { apiCaseService as mockCaseService } from '../../services/api/apiCaseService';
import { FileText, PlusCircle, Search, ChevronRight, Eye, FileSpreadsheet, Scale, Calendar, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddCaseModal } from '../../components/modals/AddCaseModal';
import { CaseDetailsModal } from '../../components/modals/CaseDetailsModal';
import { AddAttorneyModal } from '../../components/modals/AddAttorneyModal';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { ROLES } from '../../constants/rolePermissions';

export const CaseListPage = () => {
  const { addToast } = useUIStore();
  const { currentUser } = useAuthStore();

  const canToggleCaseStatus = [ROLES.SUPER_ADMIN, ROLES.BILLING_STAFF, ROLES.DOCTOR].includes(currentUser?.role);

  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddAttorneyModal, setShowAddAttorneyModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseToDelete, setCaseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const { activeProviderFilter } = useUIStore();

  const loadCases = () => {
    mockCaseService.getCases({ search }).then(res => setCases(res || [])).catch(() => {});
  };

  const handleToggleCaseStatus = async (c, newStatus) => {
    try {
      await mockCaseService.updateCase(c.id || c.caseId, { status: newStatus });
      addToast(`Accident Case ${c.caseId || ''} status updated to ${newStatus}`, 'success');
      loadCases();
    } catch (err) {
      console.error('Failed to update case status:', err);
      addToast('Failed to update case status', 'error');
    }
  };

  useEffect(() => {
    loadCases();
  }, [search]);

  const filteredCases = cases.filter(c => {
    if (activeProviderFilter === 'ALL') return true;
    return c.assignedProviderIds?.includes(activeProviderFilter);
  });

  return (
    <div className="space-y-5">
      {/* -- Top Header & Actions -- */}
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

      {/* -- Search Bar -- */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by Case ID, patient name, attorney, law firm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs rounded-lg border-0 bg-transparent focus:ring-0 text-slate-900 outline-none"
        />
      </div>

      {/* -- Cases List (Mobile Cards + Desktop Table) -- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredCases.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-900">No Accident Cases Found</p>
            <p className="text-xs text-slate-500">No records match your search criteria.</p>
          </div>
        ) : (
          <>
            {/* 1. Mobile Cards View (< 768px) */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredCases.map((c) => (
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
                    <div className="flex items-center gap-1.5">
                      {canToggleCaseStatus ? (
                        <select
                          value={c.status || 'ACTIVE'}
                          onChange={(e) => handleToggleCaseStatus(c, e.target.value)}
                          className={`px-3 py-1 text-[11px] font-extrabold rounded-full border outline-none cursor-pointer transition shadow-2xs shrink-0 ${
                            (c.status || 'ACTIVE') === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 ring-2 ring-emerald-400/20'
                              : c.status === 'SETTLED'
                              ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100 ring-2 ring-blue-400/20'
                              : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100 ring-2 ring-rose-400/20'
                          }`}
                        >
                          <option value="ACTIVE">🟢 ACTIVE</option>
                          <option value="INACTIVE">🔴 INACTIVE</option>
                          <option value="SETTLED">🔵 SETTLED</option>
                        </select>
                      ) : (
                        <span
                          className={`px-3 py-1 text-[11px] font-extrabold rounded-full border inline-flex items-center gap-1.5 shrink-0 ${
                            (c.status || 'ACTIVE') === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : c.status === 'SETTLED'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${
                            (c.status || 'ACTIVE') === 'ACTIVE' ? 'bg-emerald-500' : c.status === 'SETTLED' ? 'bg-blue-500' : 'bg-rose-500'
                          }`} />
                          {c.status || 'ACTIVE'}
                        </span>
                      )}
                      <button
                        onClick={() => setCaseToDelete(c)}
                        title="Delete Case"
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
                  {filteredCases.map((c) => (
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
                        {canToggleCaseStatus ? (
                          <select
                            value={c.status || 'ACTIVE'}
                            onChange={(e) => handleToggleCaseStatus(c, e.target.value)}
                            className={`px-3 py-1 text-[11px] font-extrabold rounded-full border outline-none cursor-pointer transition shadow-2xs ${
                              (c.status || 'ACTIVE') === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 ring-2 ring-emerald-400/20'
                                : c.status === 'SETTLED'
                                ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100 ring-2 ring-blue-400/20'
                                : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100 ring-2 ring-rose-400/20'
                            }`}
                          >
                            <option value="ACTIVE">🟢 ACTIVE</option>
                            <option value="INACTIVE">🔴 INACTIVE</option>
                            <option value="SETTLED">🔵 SETTLED</option>
                          </select>
                        ) : (
                          <span
                            className={`px-3 py-1 text-[11px] font-extrabold rounded-full border inline-flex items-center gap-1.5 ${
                              (c.status || 'ACTIVE') === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : c.status === 'SETTLED'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${
                              (c.status || 'ACTIVE') === 'ACTIVE' ? 'bg-emerald-500' : c.status === 'SETTLED' ? 'bg-blue-500' : 'bg-rose-500'
                            }`} />
                            {c.status || 'ACTIVE'}
                          </span>
                        )}
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
                          <button
                            onClick={() => setCaseToDelete(c)}
                            title="Delete Case"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Delete Confirmation Modal */}
      {caseToDelete && (
        <Modal
          isOpen={!!caseToDelete}
          onClose={() => setCaseToDelete(null)}
          title="Delete Accident Case"
          subtitle="Permanently remove case record & associated legal lien references"
          icon={AlertTriangle}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          size="sm"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setCaseToDelete(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> {isDeleting ? 'Deleting...' : 'Delete Case'}
              </button>
            </div>
          }
        >
          <div className="space-y-2 text-xs text-slate-600">
            <p>Are you sure you want to delete case <strong className="text-slate-900 font-mono">{caseToDelete.caseId}</strong> for patient <strong className="text-slate-900">{caseToDelete.patientName}</strong>?</p>
            <p className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200 font-semibold">
              Warning: This action will delete the case record from the database.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
