import React, { useEffect, useState } from 'react';
import { mockAppointmentService } from '../../services/mock/mockAppointmentService';
import { mockReminderService } from '../../services/mock/mockReminderService';
import { Users, Calendar, Bell, PlusCircle, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddPatientModal } from '../../components/modals/AddPatientModal';
import { ScheduleAppointmentModal } from '../../components/modals/ScheduleAppointmentModal';

export const ReceptionistDashboard = () => {
  const [apts, setApts] = useState([]);
  const [reminderLogs, setReminderLogs] = useState([]);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const navigate = useNavigate();

  const loadData = () => {
    mockAppointmentService.getAppointments().then(setApts);
    mockReminderService.getLogs().then(setReminderLogs);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckIn = async (aptId) => {
    await mockAppointmentService.updateStatus(aptId, 'CHECKED_IN');
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Receptionist Front Desk Hub</h1>
          <p className="text-xs text-slate-500">Patient arrival check-in queue, scheduling &amp; automated reminder delivery tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAddPatientModal(true)} className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer">
            <PlusCircle className="w-4 h-4" /> Register New Patient
          </button>
          <button onClick={() => setShowScheduleModal(true)} className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer">
            <Calendar className="w-4 h-4" /> Schedule Visit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Arrival Check-in Queue</span>
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-on-surface font-tabular">{apts.filter(a => a.status === 'CHECKED_IN').length} Waiting</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Patients in lobby waiting area</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Today's Total Scheduled</span>
            <Calendar className="w-5 h-5 text-secondary-container" />
          </div>
          <p className="text-2xl font-bold text-on-surface font-tabular">{apts.length} Booked</p>
          <p className="text-[11px] text-on-surface-variant">Across all 4 practice providers</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Reminders Dispatched</span>
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-on-surface font-tabular">{reminderLogs.length} Sent (Demo)</p>
          <p className="text-[11px] text-on-surface-variant">SMS & Email automated reminders</p>
        </div>
      </div>

      {/* Front Desk Check-in Queue Table */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-on-surface">Patient Check-in Action Queue</h2>
          <button onClick={() => navigate('/appointments/checkin')} className="text-xs font-bold text-secondary-container hover:underline">
            Open Dedicated Check-in Screen →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container text-on-surface-variant uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Patient Name</th>
                <th className="p-3">Provider & Visit Type</th>
                <th className="p-3">Reminder Delivery</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">One-Click Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {apts.map((apt) => (
                <tr key={apt.id} className="hover:bg-surface">
                  <td className="p-3 font-bold text-on-surface">{apt.startTime}</td>
                  <td className="p-3 font-bold text-secondary-container">{apt.patientName}</td>
                  <td className="p-3">
                    <p className="font-semibold text-on-surface">{apt.providerName}</p>
                    <p className="text-[10px] text-on-surface-variant">{apt.appointmentType}</p>
                  </td>
                  <td className="p-3 text-on-surface-variant font-mono">{apt.reminderStatus}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      apt.status === 'CHECKED_IN' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                    }`}>
                      {apt.status === 'CHECKED_IN' ? 'In Waiting Room' : apt.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {apt.status !== 'CHECKED_IN' ? (
                      <button
                        onClick={() => handleCheckIn(apt.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs shadow-sm transition flex items-center gap-1 ml-auto"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Check In
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600">Checked In ✓</span>
                    )}
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
