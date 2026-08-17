// src/pages/appointments/CalendarPage.jsx
import React, { useEffect, useState } from 'react';
import { mockAppointmentService } from '../../services/mock/mockAppointmentService';
import { Calendar as CalendarIcon, Clock, PlusCircle, User, ChevronLeft, ChevronRight, Sparkles, Filter, ShieldCheck, Eye, Edit3, Phone, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isClinicClosed } from '../../constants/usHolidays';
import { ScheduleAppointmentModal } from '../../components/modals/ScheduleAppointmentModal';
import { AppointmentDetailsModal } from '../../components/modals/AppointmentDetailsModal';
import { EditAppointmentModal } from '../../components/modals/EditAppointmentModal';
import { useUIStore } from '../../store/uiStore';

export const CalendarPage = () => {
  const [apts, setApts] = useState([]);
  const [currentDate, setCurrentDate] = useState('2026-08-04');
  const [channelFilter, setChannelFilter] = useState('ALL'); // ALL | SELF | STAFF
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);
  const [editingApt, setEditingApt] = useState(null);
  const navigate = useNavigate();
  const { activeProviderFilter } = useUIStore();

  const loadAppointments = () => {
    mockAppointmentService.getAppointments().then(res => setApts(res || [])).catch(() => {});
  };

  useEffect(() => {
    loadAppointments();
  }, [activeProviderFilter]);

  const closedCheck = isClinicClosed(currentDate);

  const filteredApts = apts.filter(apt => {
    // Channel filter
    if (channelFilter === 'SELF' && !(!!apt.bookingChannel || (apt.bookingRef && apt.bookingRef.startsWith('SELF-')))) return false;
    if (channelFilter === 'STAFF' && (!!apt.bookingChannel || (apt.bookingRef && apt.bookingRef.startsWith('SELF-')))) return false;
    
    // Provider filter
    if (activeProviderFilter !== 'ALL' && apt.providerId !== activeProviderFilter) return false;
    
    return true;
  });

  const selfBookedCount = apts.filter(a => a.bookingChannel || (a.bookingRef && a.bookingRef.startsWith('SELF-'))).length;

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
            onClick={() => navigate('/appointments/self-booking')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Patient Self-Booking
          </button>
          <button
            onClick={() => setShowBookModal(true)}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Staff Book Visit
          </button>
        </div>
      </div>

      {/* ── Date Navigator & Channel Filter Bar ── */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-600 cursor-pointer"><ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          <span className="text-xs sm:text-sm font-bold text-slate-900">Tuesday, August 4, 2026</span>
          <button className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-600 cursor-pointer"><ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          
          {closedCheck.isClosed && (
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1">
              {closedCheck.isWeekend ? '📅' : '🇺🇸'} {closedCheck.reason}
            </span>
          )}
        </div>

        {/* Channel Filter Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold mr-1">
            <Filter className="w-3.5 h-3.5 text-teal-600" /> Channel:
          </div>
          <button
            onClick={() => setChannelFilter('ALL')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              channelFilter === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({apts.length})
          </button>
          <button
            onClick={() => setChannelFilter('SELF')}
            className={`px-2.5 py-1 text-xs font-extrabold rounded-lg transition flex items-center gap-1 cursor-pointer ${
              channelFilter === 'SELF' ? 'bg-purple-600 text-white shadow-sm' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
            }`}
          >
            <Sparkles className="w-3 h-3" /> Self-Booked ({selfBookedCount})
          </button>
          <button
            onClick={() => setChannelFilter('STAFF')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              channelFilter === 'STAFF' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Staff Manual
          </button>
        </div>
      </div>

      {closedCheck.isClosed && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-950 space-y-1 text-xs">
          <h3 className="font-bold flex items-center gap-2 text-amber-900">
            <span>{closedCheck.isWeekend ? '📅' : '🇺🇸'}</span> Practice Closed — {closedCheck.reason}
          </h3>
          <p className="text-amber-800">
            {closedCheck.isWeekend
              ? 'Routine clinical appointments are not scheduled on Saturdays and Sundays. Emergency visits require administrator override during scheduling.'
              : 'Routine clinical appointments are suspended for this US Federal Holiday. Emergency visits require administrator override during scheduling.'}
          </p>
        </div>
      )}

      {/* ── Time Slot Queue (Responsive Mobile & Desktop) ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-3">
        {filteredApts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No appointments found matching selected channel filter.</div>
        ) : (
          filteredApts.map((apt) => {
            const isSelfBooked = apt.bookingChannel || (apt.bookingRef && apt.bookingRef.startsWith('SELF-'));
            const isInitial = apt.visitType === 'INITIAL' || (!apt.visitType && apt.cptCode?.includes('99204'));
            return (
              <div
                key={apt.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                  isSelfBooked ? 'bg-purple-50/40 border-purple-200' : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-white text-teal-700 flex flex-col items-center justify-center font-bold border border-slate-200 shrink-0 shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span className="text-[10px] mt-0.5 font-mono font-extrabold">{apt.startTime}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">{apt.patientName}</h3>
                      {isSelfBooked && (
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-purple-600" /> Self-Booked
                        </span>
                      )}
                      <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${
                        apt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {apt.status || 'SCHEDULED'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      <strong className="text-slate-700">{apt.providerName || 'Attending Physician'}</strong> • Type: {apt.type || 'Consultation'} ({apt.durationMinutes || 30} mins)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedApt(apt)}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-600" /> View
                  </button>
                  <button
                    onClick={() => setEditingApt(apt)}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Modals */}
      <ScheduleAppointmentModal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        onAppointmentBooked={() => loadAppointments()}
      />

      {selectedApt && (
        <AppointmentDetailsModal
          isOpen={!!selectedApt}
          onClose={() => setSelectedApt(null)}
          appointment={selectedApt}
        />
      )}

      {editingApt && (
        <EditAppointmentModal
          isOpen={!!editingApt}
          onClose={() => setEditingApt(null)}
          appointment={editingApt}
          onAppointmentUpdated={() => loadAppointments()}
        />
      )}
    </div>
  );
};
