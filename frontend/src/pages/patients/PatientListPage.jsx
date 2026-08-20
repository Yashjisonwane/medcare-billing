// src/pages/patients/PatientListPage.jsx
import React, { useEffect, useState } from 'react';
import { mockPatientService } from '../../services/mock/mockPatientService';
import { apiPatientService } from '../../services/api/apiPatientService';
import { useUIStore } from '../../store/uiStore';
import { Search, PlusCircle, User, Phone, Mail, ChevronRight, Filter, Eye, MapPin, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AddPatientModal } from '../../components/modals/AddPatientModal';
import { PatientDetailsModal } from '../../components/modals/PatientDetailsModal';

export const PatientListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast, activeProviderFilter } = useUIStore();

  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState(() => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('search') || '';
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const q = queryParams.get('search');
    if (q !== null) {
      setSearch(q);
    }
  }, [location.search]);

  const loadPatients = () => {
    setIsLoading(true);
    mockPatientService.getPatients({ search, status: statusFilter }).then(res => {
      setPatients(res || []);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  };

  const formatDobDDMMYYYY = (dobStr) => {
    if (!dobStr) return 'N/A';
    const clean = dobStr.trim();
    // YYYY-MM-DD format (e.g. 1988-08-15)
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
      const [yyyy, mm, dd] = clean.split('-');
      return `${dd}-${mm}-${yyyy}`;
    }
    // MM/DD/YYYY format (e.g. 08/15/1988)
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(clean)) {
      const [mm, dd, yyyy] = clean.split('/');
      const paddedMm = mm.padStart(2, '0');
      const paddedDd = dd.padStart(2, '0');
      return `${paddedDd}-${paddedMm}-${yyyy}`;
    }
    return clean;
  };

  const handleDeletePatient = async (pat) => {
    const confirmText = `Are you sure you want to delete patient "${pat.firstName} ${pat.lastName}" (MRN: ${pat.patientId || pat.id})?\n\nThis will safely remove the patient profile and all associated cases, appointments, notes and files from the database cleanly.`;
    if (!window.confirm(confirmText)) return;

    try {
      await apiPatientService.deletePatient(pat.id);
      addToast(`Patient ${pat.firstName} ${pat.lastName} deleted successfully!`, 'success');
      loadPatients();
    } catch (err) {
      console.error('Failed to delete patient:', err);
      addToast('Failed to delete patient. Please try again.', 'error');
    }
  };

  useEffect(() => {
    loadPatients();
  }, [search, statusFilter]);

  const filteredPatients = patients.filter(pat => {
    if (activeProviderFilter === 'ALL') return true;
    return pat.assignedProviderIds?.includes(activeProviderFilter);
  });

  return (
    <div className="space-y-5">
      {/* -- Top Header & Register Action -- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Patient Registry</h1>
          <p className="text-xs text-slate-500">Master patient records, contact details, assigned providers &amp; accident case links</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Register New Patient
        </button>
      </div>

      {/* -- Search & Filter Controls -- */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, patient ID, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2 border border-slate-200 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* -- Patient List (Responsive: Desktop Table + Mobile Cards) -- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading patient registry...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <User className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-900">No Patients Found</p>
            <p className="text-xs text-slate-500">No records match your filter criteria.</p>
            <button
              onClick={() => { setSearch(''); setStatusFilter(''); }}
              className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          <>
            {/* 1. Mobile Card View (< 768px) */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredPatients.map((pat) => (
                <div key={pat.id} className="p-4 space-y-3 hover:bg-slate-50/70 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        onClick={() => navigate(`/patients/${pat.id}/profile`)}
                        className="font-extrabold text-slate-900 text-sm hover:text-teal-700 cursor-pointer"
                      >
                        {pat.firstName} {pat.middleName ? `${pat.middleName} ` : ''}{pat.lastName}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        ID: {pat.patientId || pat.id} • DOB: {formatDobDDMMYYYY(pat.dob)} ({pat.sex})
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {pat.status || 'ACTIVE'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{pat.phone || '713-555-0100'}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{pat.address?.city || 'Houston'}, {pat.address?.state || 'TX'}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {pat.assignedProviderIds?.map((pid) => (
                      <span key={pid} className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                        {pid.replace('prov-', '').toUpperCase()}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedPatient(pat)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" /> Quick View
                    </button>
                    <button
                      onClick={() => navigate(`/patients/${pat.id}/profile`)}
                      className="flex-1 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition cursor-pointer shadow-xs"
                    >
                      Open Chart <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePatient(pat)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Delete Patient Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop High-Density Table (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Patient ID</th>
                    <th className="p-3.5">Patient Name</th>
                    <th className="p-3.5">DOB (DD-MM-YYYY) / Sex</th>
                    <th className="p-3.5">Contact Info</th>
                    <th className="p-3.5">Assigned Providers</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.map((pat) => (
                    <tr key={pat.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-mono text-slate-600 font-bold">{pat.patientId || pat.id}</td>
                      <td className="p-3.5">
                        <p
                          className="font-bold text-teal-700 hover:underline cursor-pointer"
                          onClick={() => setSelectedPatient(pat)}
                        >
                          {pat.firstName} {pat.middleName ? `${pat.middleName} ` : ''}{pat.lastName}
                        </p>
                        <p className="text-[10px] text-slate-400">{pat.address?.city || 'Houston'}, {pat.address?.state || 'TX'}</p>
                      </td>
                      <td className="p-3.5 text-slate-900 font-tabular font-semibold">{formatDobDDMMYYYY(pat.dob)} ({pat.sex})</td>
                      <td className="p-3.5 text-slate-600 space-y-0.5">
                        <p className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {pat.phone}</p>
                        <p className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {pat.email}</p>
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1">
                          {pat.assignedProviderIds?.map(pid => (
                            <span key={pid} className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-800 rounded-md border border-slate-200">
                              {pid.replace('prov-', '').toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {pat.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedPatient(pat)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs inline-flex items-center gap-1 transition cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-teal-600" /> Quick View
                          </button>
                          <button
                            onClick={() => navigate(`/patients/${pat.id}/profile`)}
                            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1 transition cursor-pointer shadow-xs"
                          >
                            Open Chart <ChevronRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeletePatient(pat)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs inline-flex items-center gap-1 transition cursor-pointer border border-rose-200"
                            title="Delete Patient Record"
                          >
                            <Trash2 className="w-3 h-3 text-rose-600" /> Delete
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

      {/* -- Modals -- */}
      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onPatientAdded={() => loadPatients()}
      />

      {selectedPatient && (
        <PatientDetailsModal
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          patient={selectedPatient}
        />
      )}
    </div>
  );
};
