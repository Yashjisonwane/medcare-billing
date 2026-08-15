// src/pages/appointments/CheckInPage.jsx
import React, { useEffect, useState } from 'react';
import { mockAppointmentService } from '../../services/mock/mockAppointmentService';
import { useUIStore } from '../../store/uiStore';
import { CheckCircle2, Clock, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CheckInPage = () => {
  const [apts, setApts] = useState([]);
  const { addToast, activeProviderFilter } = useUIStore();
  const navigate = useNavigate();

  const loadAppointments = () => {
    mockAppointmentService.getAppointments().then(setApts);
  };

  useEffect(() => {
    loadAppointments();
  }, [activeProviderFilter]);

  const handleStatusToggle = async (id, newStatus) => {
    await mockAppointmentService.updateStatus(id, newStatus);
    loadAppointments();
    addToast(`Visit status updated to ${newStatus}`, 'success');
  };

  const filteredApts = apts.filter(apt => {
    if (activeProviderFilter !== 'ALL' && apt.providerId !== activeProviderFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/appointments/calendar')} className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Calendar
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Front Desk Check-in Queue</h1>
        <p className="text-xs text-slate-500">Update real-time patient arrival, lobby waiting status & exam room assignments</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredApts.map((apt) => (
          <div key={apt.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 medical-card-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-100">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{apt.patientName}</h3>
                <p className="text-xs text-teal-700 font-semibold">{apt.providerName} — {apt.appointmentType}</p>
                <p className="text-[11px] text-slate-500">Scheduled: {apt.startTime} | Location: {apt.location}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleStatusToggle(apt.id, 'SCHEDULED')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  apt.status === 'SCHEDULED' ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Scheduled
              </button>

              <button
                onClick={() => handleStatusToggle(apt.id, 'CHECKED_IN')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  apt.status === 'CHECKED_IN' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Checked In (Waiting)
              </button>

              <button
                onClick={() => handleStatusToggle(apt.id, 'IN_EXAM')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  apt.status === 'IN_EXAM' ? 'bg-cyan-700 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                In Exam Room
              </button>

              <button
                onClick={() => handleStatusToggle(apt.id, 'COMPLETED')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  apt.status === 'COMPLETED' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
