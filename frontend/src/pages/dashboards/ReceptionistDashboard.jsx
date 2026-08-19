import React, { useEffect, useState } from 'react';
import { apiAppointmentService } from '../../services/api/apiAppointmentService';
import { mockReminderService } from '../../services/mock/mockReminderService';
import { Users, Calendar, Bell, PlusCircle, CheckCircle2, Clock, Sparkles, Edit3, Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddPatientModal } from '../../components/modals/AddPatientModal';
import { ScheduleAppointmentModal } from '../../components/modals/ScheduleAppointmentModal';
import { AppointmentDetailsModal } from '../../components/modals/AppointmentDetailsModal';
import { EditAppointmentModal } from '../../components/modals/EditAppointmentModal';

export const ReceptionistDashboard = () => {
  const [apts, setApts] = useState([]);
  const [reminderLogs, setReminderLogs] = useState([]);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [viewingApt, setViewingApt] = useState(null);
  const [editingApt, setEditingApt] = useState(null);
  const navigate = useNavigate();

  const loadData = () => {
    apiAppointmentService.getAllAppointments().then(setApts).catch(err => console.error("Error fetching appointments:", err));
    mockReminderService.getLogs().then(setReminderLogs).catch(err => console.error("Error fetching reminders:", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckIn = async (aptId) => {
    try {
      await apiAppointmentService.updateStatus(aptId, 'CHECKED_IN');
      loadData();
    } catch (err) {
      console.error("Error checking in:", err);
    }
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
        <div
          onClick={() => navigate('/appointments/checkin')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Arrival Check-in Queue</span>
            <Clock className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-tabular">{apts.filter(a => a.status === 'CHECKED_IN').length} Waiting</p>
          <p className="text-[11px] text-teal-600 font-semibold">Patients in lobby waiting area</p>
        </div>

        <div
          onClick={() => navigate('/appointments/calendar')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Today's Total Scheduled</span>
            <Calendar className="w-5 h-5 text-slate-700" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-tabular">{apts.length} Booked</p>
          <p className="text-[11px] text-slate-500">Across all 4 practice providers</p>
        </div>

        <div
          onClick={() => navigate('/appointments/reminders')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Reminders Dispatched</span>
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-tabular">{reminderLogs.length || apts.length} Sent</p>
          <p className="text-[11px] text-slate-500">SMS &amp; Email automated reminders</p>
        </div>
      </div>

      {/* Front Desk Check-in Queue Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Today's Patient Arrival Queue</h2>
            <p className="text-xs text-slate-500">Check in patients, edit visits or assign exam rooms</p>
          </div>
          <button 
            onClick={() => navigate('/appointments/checkin')} 
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1.5 hover:underline transition"
          >
            Open Dedicated Check-in Screen <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5 whitespace-nowrap">Time</th>
                <th className="p-3.5 whitespace-nowrap">Patient Name</th>
                <th className="p-3.5">Provider &amp; Visit Type</th>
                <th className="p-3.5 whitespace-nowrap">Reminder Delivery</th>
                <th className="p-3.5 whitespace-nowrap">Status</th>
                <th className="p-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {apts.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-mono font-bold text-slate-900 whitespace-nowrap text-xs">
                    {apt.startTime}
                  </td>
                  <td className="p-3.5 font-bold text-teal-800 whitespace-nowrap text-xs">
                    {apt.patientName}
                  </td>
                  <td className="p-3.5 min-w-[200px]">
                    <p className="font-bold text-slate-900">{apt.providerName}</p>
                    <p className="text-[11px] text-slate-500">{apt.appointmentType}</p>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="text-slate-600 font-mono text-[11px] bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                      {apt.reminderStatus || 'Automated SMS Dispatched'}
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-block ${
                      apt.status === 'CHECKED_IN' ? 'bg-teal-100 text-teal-900 border border-teal-300' :
                      apt.status === 'IN_EXAM' ? 'bg-cyan-100 text-cyan-900 border border-cyan-300' :
                      apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {apt.status === 'CHECKED_IN' ? 'In Lobby Waiting' :
                       apt.status === 'IN_EXAM' ? 'In Exam Room' : apt.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {apt.status !== 'CHECKED_IN' && apt.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleCheckIn(apt.id)}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Check In
                        </button>
                      )}
                      <button
                        onClick={() => setViewingApt(apt)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer border border-transparent hover:border-slate-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingApt(apt)}
                        className="p-1.5 text-teal-600 hover:text-teal-900 hover:bg-teal-50 rounded-lg transition cursor-pointer border border-transparent hover:border-teal-200"
                        title="Edit Appointment / Modifiers"
                      >
                        <Edit3 className="w-4 h-4" />
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

      {viewingApt && (
        <AppointmentDetailsModal
          isOpen={!!viewingApt}
          onClose={() => setViewingApt(null)}
          appointment={viewingApt}
          onStatusUpdated={() => loadData()}
          onEditAppointment={(apt) => {
            setViewingApt(null);
            setEditingApt(apt);
          }}
        />
      )}

      {editingApt && (
        <EditAppointmentModal
          isOpen={!!editingApt}
          onClose={() => setEditingApt(null)}
          appointment={editingApt}
          onAppointmentUpdated={() => loadData()}
        />
      )}
    </div>
  );
};
