import React, { useEffect, useState } from 'react';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { mockPatientService } from '../../services/mock/mockPatientService';
import { mockCaseService } from '../../services/mock/mockCaseService';
import { mockAppointmentService } from '../../services/mock/mockAppointmentService';
import { apiAuditService } from '../../services/api/apiAuditService';
import { mockReminderService } from '../../services/mock/mockReminderService';
import { INITIAL_PROVIDER_CONFIGS } from '../../constants/providerConfigs';
import { formatCurrency } from '../../utils/billingCalculations';
import { formatStatus } from '../../utils/formatters';
import { DollarSign, Users, FileText, Activity, ShieldCheck, ArrowUpRight, ChevronRight, AlertTriangle, Bell, Clock, CheckSquare, Sparkles, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddPatientModal } from '../../components/modals/AddPatientModal';
import { AddCaseModal } from '../../components/modals/AddCaseModal';
import { ScheduleAppointmentModal } from '../../components/modals/ScheduleAppointmentModal';
import { useUIStore } from '../../store/uiStore';

export const SuperAdminDashboard = () => {
  const [aging, setAging] = useState({ grandTotal: 0, past90: 0 });
  const [patientCount, setPatientCount] = useState(0);
  const [caseCount, setCaseCount] = useState(0);
  const [aptsCount, setAptsCount] = useState(0);
  const [selfBookedCount, setSelfBookedCount] = useState(0);
  const [auditLogs, setAuditLogs] = useState([]);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddCaseModal, setShowAddCaseModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const navigate = useNavigate();
  const { activeProviderFilter } = useUIStore();

  const loadData = () => {
    mockBillingService.getAgingSummary(activeProviderFilter).then(setAging);
    mockPatientService.getPatients().then(pts => setPatientCount(pts.length));
    mockCaseService.getCases().then(cs => setCaseCount(cs.length));
    mockAppointmentService.getAppointments().then(apts => {
      const filtered = activeProviderFilter === 'ALL' ? apts : apts.filter(a => a.providerId === activeProviderFilter);
      setAptsCount(filtered.length);
      const selfs = filtered.filter(a => a.bookingChannel || (a.bookingRef && a.bookingRef.startsWith('SELF-'))).length;
      setSelfBookedCount(selfs);
    });
    apiAuditService.getLogs().then(logs => setAuditLogs(logs.slice(0, 5)));
  };

  useEffect(() => {
    loadData();
  }, [activeProviderFilter]);

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Super Admin Master Overview</h1>
          <p className="text-xs text-slate-500">System-wide practice management, provider configurations &amp; financial ledgers</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowAddPatientModal(true)} className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer">
            <PlusCircle className="w-4 h-4" /> Add Patient
          </button>
          <button onClick={() => setShowAddCaseModal(true)} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer">
            <PlusCircle className="w-4 h-4" /> Add Case
          </button>
          <button onClick={() => setShowScheduleModal(true)} className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer">
            <Clock className="w-4 h-4" /> Book Visit
          </button>
          <button onClick={() => navigate('/admin/providers')} className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-sm transition">
            Providers
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (Active Patients, Active Cases, Today's Appointments, Outstanding Balance, Aging, Reminder Failures) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 medical-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Outstanding Balance & A/R</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-tabular">{formatCurrency(aging.grandTotal)}</p>
          <p className="text-[11px] text-teal-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> 6 Service Modality Statements
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 medical-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Patients & Cases</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-tabular">{patientCount} Patients / {caseCount} Cases</p>
          <p className="text-[11px] text-slate-500">Active clinical accident charts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 medical-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Scheduled Appointments</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-tabular">{aptsCount} Visits</p>
          <p className="text-[11px] text-purple-700 font-extrabold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> {selfBookedCount} Patient Self-Bookings
          </p>
        </div>

        <div 
          onClick={() => navigate('/billing/aging')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 medical-card-hover cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Past 90+ Days A/R Aging</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-tabular">{formatCurrency(aging.past90 || 0)}</p>
          <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
            Overdue Legal Liens &amp; Claims <ChevronRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Provider & Modality Health Grid (6 Modalities) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Provider Status &amp; 6 Service Modality Profiles</h2>
          <button onClick={() => navigate('/billing/provider-bills')} className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1 cursor-pointer">
            Open Provider Bills Ledger <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {[
            ...Object.values(INITIAL_PROVIDER_CONFIGS).map(prov => ({
              id: prov.id,
              category: prov.serviceCategory,
              name: prov.name,
              isPending: prov.isPlaceholder,
              notice: prov.isPlaceholder ? 'Counselor billing details pending client reference documents.' : null
            })),
            {
              id: 'srv-trigger-point-card',
              category: 'Trigger Point Injection (TPI)',
              name: 'Trigger Point Injection',
              isPending: true,
              notice: 'Provider assignment & fee schedule pending.'
            },
            {
              id: 'srv-tecar-card',
              category: 'TECAR Therapy (Radiofrequency)',
              name: 'TECAR Therapy',
              isPending: true,
              notice: 'Provider assignment & CPT rules pending.'
            }
          ].map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 medical-card-hover">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-teal-700 truncate">{item.category}</span>
                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ${
                  item.isPending ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-teal-100 text-teal-800 border border-teal-200'
                }`}>
                  {item.isPending ? 'Configuration Pending' : 'Active'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 truncate">{item.name}</h3>

              {item.isPending && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>{item.notice}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent System Audit Activity */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Operational Audit Activity</h2>
          <button onClick={() => navigate('/admin/audit-logs')} className="text-xs font-bold text-teal-600 hover:underline">
            View All Audit Logs â†’
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Action</th>
                <th className="p-3">Resource</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                  <td className="p-3 font-bold text-slate-900">{log.user}</td>
                  <td className="p-3"><span className="px-2.5 py-0.5 bg-teal-50 text-teal-700 rounded-md font-semibold border border-teal-200/50">{log.role}</span></td>
                  <td className="p-3 font-mono text-teal-700 font-bold">{log.action}</td>
                  <td className="p-3 text-slate-800">{log.resource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Modals */}
      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onPatientAdded={() => loadData()}
      />

      <AddCaseModal
        isOpen={showAddCaseModal}
        onClose={() => setShowAddCaseModal(false)}
        onCaseAdded={() => loadData()}
      />

      <ScheduleAppointmentModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onAppointmentBooked={() => loadData()}
      />
    </div>
  );
};
