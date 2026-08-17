// src/pages/appointments/CalendarPage.jsx
import React, { useState, useEffect } from 'react';
import { mockAppointmentService } from '../../services/mock/mockAppointmentService';
import { INITIAL_PROVIDER_CONFIGS } from '../../constants/providerConfigs';
import { ScheduleAppointmentModal } from '../../components/modals/ScheduleAppointmentModal';
import { AppointmentDetailsModal } from '../../components/modals/AppointmentDetailsModal';
import { EditAppointmentModal } from '../../components/modals/EditAppointmentModal';
import { useUIStore } from '../../store/uiStore';
import {
  Calendar as CalendarIcon, Clock, User, Phone,
  PlusCircle, Search, Filter, AlertCircle, Sparkles, CheckCircle2,
  ChevronLeft, ChevronRight, Check, X, Shield, ExternalLink, Globe, Copy
} from 'lucide-react';

export const CalendarPage = () => {
  const { addToast } = useUIStore();

  const [apts, setApts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProvider, setSelectedProvider] = useState('ALL');
  const [selectedChannel, setSelectedChannel] = useState('ALL'); // 'ALL' | 'SELF_PORTAL' | 'INTERNAL'

  // Modals
  const [showBookModal, setShowBookModal] = useState(false);
  const [viewingApt, setViewingApt] = useState(null);
  const [editingApt, setEditingApt] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, selectedProvider]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const filters = { date: selectedDate };
      if (selectedProvider !== 'ALL') filters.providerId = selectedProvider;
      const data = await mockAppointmentService.getAppointments(filters);
      setApts(data);
    } catch {
      addToast('Failed to load appointments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPatientLink = () => {
    const portalUrl = `${window.location.origin}/book`;
    navigator.clipboard.writeText(portalUrl);
    addToast(`Patient Public Booking link copied: ${portalUrl}`, 'success');
  };

  // Filter by channel if set
  const filteredApts = apts.filter(a => {
    if (selectedChannel === 'SELF_PORTAL') {
      return a.bookingChannel?.toLowerCase().includes('patient') || (a.bookingRef && a.bookingRef.startsWith('SELF-'));
    }
    if (selectedChannel === 'INTERNAL') {
      return !a.bookingChannel?.toLowerCase().includes('patient') && (!a.bookingRef || !a.bookingRef.startsWith('SELF-'));
    }
    return true;
  });

  const selfBookedCount = apts.filter(a => a.bookingChannel?.toLowerCase().includes('patient') || (a.bookingRef && a.bookingRef.startsWith('SELF-'))).length;

  return (
    <div className="space-y-5">
      {/* ── Top Header & Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Appointment Calendar &amp; Schedule</h1>
          <p className="text-xs text-slate-500">Multi-provider daily calendar, time slot bookings, edit appointments &amp; multi-line billing codes</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowBookModal(true)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Schedule Visit
          </button>
        </div>
      </div>

      {/* ── Date Navigator & Channel Filter Bar ── */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 1);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none cursor-pointer"
          />

          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + 1);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            Today
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Provider Filter */}
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-teal-600 outline-none cursor-pointer"
          >
            <option value="ALL">All Care Providers (4 Practices)</option>
            {Object.values(INITIAL_PROVIDER_CONFIGS).map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Channel Filter */}
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-teal-600 outline-none cursor-pointer"
          >
            <option value="ALL">All Booking Channels ({apts.length})</option>
            <option value="SELF_PORTAL">Online Self-Bookings ({selfBookedCount})</option>
            <option value="INTERNAL">Staff / Phone Bookings ({apts.length - selfBookedCount})</option>
          </select>
        </div>
      </div>

      {/* ── Appointments List / Schedule View ── */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200 animate-pulse">
          Loading schedule and bookings for {selectedDate}...
        </div>
      ) : filteredApts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Appointments Scheduled for {selectedDate}</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            There are no patient visits booked for this date under the selected provider or channel filter.
          </p>
          <button
            onClick={() => setShowBookModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Book Appointment Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApts.map((apt) => {
            const isSelfBooked = apt.bookingChannel?.toLowerCase().includes('patient') || (apt.bookingRef && apt.bookingRef.startsWith('SELF-'));

            return (
              <div
                key={apt.id}
                className="bg-white border border-slate-200 hover:border-teal-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Time & Badges */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>{apt.startTime} – {apt.endTime}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {isSelfBooked && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-purple-600" /> Self-Booked
                        </span>
                      )}
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                        apt.status === 'SCHEDULED' ? 'bg-emerald-100 text-emerald-800' :
                        apt.status === 'CHECKED_IN' ? 'bg-blue-100 text-blue-800' :
                        apt.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>

                  {/* Patient & Clinic Info */}
                  <div className="pt-2 space-y-1">
                    <h4 className="text-sm font-extrabold text-slate-900 truncate">{apt.patientName}</h4>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" /> {apt.providerName || 'JOSMIC Wellness Center'}
                    </p>
                    {apt.patientPhone && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" /> {apt.patientPhone}
                      </p>
                    )}
                    <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-bold rounded-lg border border-teal-200">
                        {apt.appointmentType || 'Consultation'}
                      </span>
                      {apt.cptCode && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-mono font-bold rounded-lg border border-slate-200">
                          CPT: {apt.cptCode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setViewingApt(apt)}
                    className="flex-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setEditingApt(apt)}
                    className="flex-1 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Edit / Modifiers
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modals ── */}
      {showBookModal && (
        <ScheduleAppointmentModal
          isOpen={showBookModal}
          onClose={() => setShowBookModal(false)}
          onAppointmentBooked={() => fetchAppointments()}
        />
      )}

      {viewingApt && (
        <AppointmentDetailsModal
          isOpen={!!viewingApt}
          onClose={() => setViewingApt(null)}
          appointment={viewingApt}
          onStatusUpdated={() => fetchAppointments()}
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
          onAppointmentUpdated={() => fetchAppointments()}
        />
      )}
    </div>
  );
};
