import React, { useEffect, useState } from 'react';
import { mockAppointmentService } from '../../services/mock/mockAppointmentService';
import { mockClinicalNoteService } from '../../services/mock/mockClinicalNoteService';
import { Calendar, FileCheck, Users, Receipt, PlusCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddPatientModal } from '../../components/modals/AddPatientModal';
import { ScheduleAppointmentModal } from '../../components/modals/ScheduleAppointmentModal';

export const ClinicAdminDashboard = () => {
  const [apts, setApts] = useState([]);
  const [unsignedCount, setUnsignedCount] = useState(0);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const navigate = useNavigate();

  const loadData = () => {
    mockAppointmentService.getAppointments().then(setApts);
    mockClinicalNoteService.getNotes().then(notes => {
      setUnsignedCount(notes.filter(n => n.status !== 'SIGNED_LOCKED').length);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clinic Admin Dashboard</h1>
          <p className="text-xs text-slate-500">Daily operational management, appointments, intake &amp; unsigned charts</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAddPatientModal(true)} className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer">
            <PlusCircle className="w-4 h-4" /> Register Patient
          </button>
          <button onClick={() => setShowScheduleModal(true)} className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer">
            <Calendar className="w-4 h-4" /> Book Visit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Today's Visits</span>
            <Calendar className="w-5 h-5 text-secondary-container" />
          </div>
          <p className="text-2xl font-bold text-on-surface font-tabular">{apts.length}</p>
          <p className="text-[11px] text-emerald-600 font-semibold">1 Checked In, 2 Scheduled</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Unsigned Clinical Charts</span>
            <FileCheck className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-on-surface font-tabular">{unsignedCount}</p>
          <p className="text-[11px] text-amber-600 font-semibold">Requires doctor/therapist sign-off</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Active Accident Cases</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-on-surface font-tabular">1 Case</p>
          <p className="text-[11px] text-on-surface-variant">4 Providers assigned</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Provider Bills Status</span>
            <Receipt className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-on-surface font-tabular">4 Bills</p>
          <p className="text-[11px] text-on-surface-variant">JOSMIC, DAVS, ANIK, Counselor</p>
        </div>
      </div>

      {/* Today's Schedule Table */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-on-surface">Today's Appointment Queue</h2>
          <button onClick={() => navigate('/appointments/calendar')} className="text-xs font-bold text-secondary-container hover:underline flex items-center gap-1">
            Open Full Calendar <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container text-on-surface-variant uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Provider</th>
                <th className="p-3">Visit Type</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {apts.map((apt) => (
                <tr key={apt.id} className="hover:bg-surface">
                  <td className="p-3 font-bold text-on-surface">{apt.startTime}</td>
                  <td className="p-3 font-semibold text-secondary-container">{apt.patientName}</td>
                  <td className="p-3 text-on-surface-variant">{apt.providerName}</td>
                  <td className="p-3 text-on-surface">{apt.appointmentType}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      apt.status === 'CHECKED_IN' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => navigate('/appointments/checkin')} className="text-xs font-bold text-secondary-container hover:underline">
                      Manage Visit
                    </button>
                  </td>
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

      <ScheduleAppointmentModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onAppointmentBooked={() => loadData()}
      />
    </div>
  );
};
