import React, { useEffect, useState } from 'react';
import { mockPatientService } from '../../services/mock/mockPatientService';
import { Search, PlusCircle, User, Phone, Mail, ChevronRight, Filter, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddPatientModal } from '../../components/modals/AddPatientModal';
import { PatientDetailsModal } from '../../components/modals/PatientDetailsModal';

export const PatientListPage = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  const loadPatients = () => {
    setIsLoading(true);
    mockPatientService.getPatients({ search, status: statusFilter }).then(res => {
      setPatients(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadPatients();
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Registry</h1>
          <p className="text-xs text-slate-500">Master patient records, contact details, assigned providers &amp; accident case links</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Register New Patient
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-outline absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Patient ID, name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface focus:border-secondary-container"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-on-surface-variant" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface text-on-surface text-xs font-medium rounded-lg px-3 py-2 border border-outline-variant focus:border-secondary-container"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-on-surface-variant">Loading patient registry...</div>
        ) : patients.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <User className="w-10 h-10 text-outline mx-auto" />
            <p className="text-sm font-bold text-on-surface">No Patients Found</p>
            <p className="text-xs text-on-surface-variant">No records match your filter criteria.</p>
            <button onClick={() => { setSearch(''); setStatusFilter(''); }} className="text-xs font-bold text-secondary-container hover:underline">
              Clear Search Filter
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container text-on-surface-variant uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3.5">Patient ID</th>
                  <th className="p-3.5">Patient Name</th>
                  <th className="p-3.5">DOB / Sex</th>
                  <th className="p-3.5">Contact Info</th>
                  <th className="p-3.5">Assigned Providers</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {patients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-surface transition">
                    <td className="p-3.5 font-mono text-on-surface-variant font-bold">{pat.patientId}</td>
                    <td className="p-3.5">
                      <p 
                        className="font-bold text-teal-700 hover:underline cursor-pointer" 
                        onClick={() => setSelectedPatient(pat)}
                      >
                        {pat.lastName}, {pat.firstName} {pat.middleName}
                      </p>
                      <p className="text-[10px] text-slate-500">{pat.address?.city}, {pat.address?.state}</p>
                    </td>
                    <td className="p-3.5 text-slate-900 font-tabular">{pat.dob} ({pat.sex})</td>
                    <td className="p-3.5 text-slate-600 space-y-0.5">
                      <p className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {pat.phone}</p>
                      <p className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {pat.email}</p>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {pat.assignedProviderIds?.map(pid => (
                          <span key={pid} className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-800 rounded border border-slate-200">
                            {pid.replace('prov-', '').toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {pat.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPatient(pat)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs inline-flex items-center gap-1 transition"
                        >
                          <Eye className="w-3 h-3 text-teal-600" /> Quick View
                        </button>
                        <button
                          onClick={() => navigate(`/patients/${pat.id}/profile`)}
                          className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg font-bold text-xs inline-flex items-center gap-1 transition"
                        >
                          Profile <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Modals */}
      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onPatientAdded={() => loadPatients()}
      />

      <PatientDetailsModal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        patient={selectedPatient}
      />
    </div>
  );
};
