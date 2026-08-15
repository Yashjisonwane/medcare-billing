import React, { useEffect, useState } from 'react';
import { mockAppointmentService } from '../../services/mock/mockAppointmentService';
import { Calendar as CalendarIcon, Clock, PlusCircle, User, ChevronLeft, ChevronRight, Sparkles, Filter, ShieldCheck, Eye, Edit3 } from 'lucide-react';
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
    mockAppointmentService.getAppointments().then(setApts);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointment Calendar &amp; Schedule</h1>
          <p className="text-xs text-slate-500">Multi-provider daily calendar, time slot bookings, edit appointments &amp; multi-line billing codes</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/appointments/self-booking')} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer">
            <Sparkles className="w-4 h-4" /> Patient Self-Booking Portal
          </button>
          <button onClick={() => setShowBookModal(true)} className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer">
            <PlusCircle className="w-4 h-4" /> Staff Book Visit
          </button>
        </div>
      </div>

      {/* Channel Summary & Channel Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"><ChevronLeft className="w-5 h-5" /></button>
          <span className="text-sm font-bold text-slate-900">Tuesday, August 4, 2026</span>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"><ChevronRight className="w-5 h-5" /></button>
          
          {closedCheck.isClosed && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold flex items-center gap-1">
              {closedCheck.isWeekend ? '📅' : '🇺🇸'} {closedCheck.reason}
            </span>
          )}
        </div>

        {/* Channel Filter Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-bold mr-1">
            <Filter className="w-3.5 h-3.5 text-teal-600" /> Channel:
          </div>
          <button
            onClick={() => setChannelFilter('ALL')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              channelFilter === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Bookings ({apts.length})
          </button>
          <button
            onClick={() => setChannelFilter('SELF')}
            className={`px-3 py-1 text-xs font-extrabold rounded-lg transition flex items-center gap-1 cursor-pointer ${
              channelFilter === 'SELF' ? 'bg-purple-600 text-white shadow-sm' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
            }`}
          >
            <Sparkles className="w-3 h-3" /> Self-Booked ({selfBookedCount})
          </button>
          <button
            onClick={() => setChannelFilter('STAFF')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
              channelFilter === 'STAFF' ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Staff Manual
          </button>
        </div>
      </div>

      {closedCheck.isClosed && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-950 space-y-1">
          <h3 className="text-sm font-bold flex items-center gap-2 text-amber-900">
            <span>{closedCheck.isWeekend ? '📅' : '🇺🇸'}</span> Practice Closed — {closedCheck.reason}
          </h3>
          <p className="text-xs text-amber-800">
            {closedCheck.isWeekend
              ? 'Routine clinical appointments are not scheduled on Saturdays and Sundays. Emergency visits require administrator override during scheduling.'
              : 'Routine clinical appointments are suspended for this US Federal Holiday. Emergency visits require administrator override during scheduling.'}
          </p>
        </div>
      )}

      {/* Time Grid View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="space-y-3">
          {filteredApts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No appointments found matching selected channel filter.</div>
          ) : (
            filteredApts.map((apt) => {
              const isSelfBooked = apt.bookingChannel || (apt.bookingRef && apt.bookingRef.startsWith('SELF-'));
              const isInitial = apt.visitType === 'INITIAL' || (!apt.visitType && apt.cptCode?.includes('99204'));
              return (
                <div
                  key={apt.id}
                  className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 medical-card-hover ${
                    isSelfBooked ? 'bg-purple-50/40 border-purple-200' : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex flex-col items-center justify-center font-bold border border-teal-100 shrink-0">
                      <Clock className="w-4 h-4" />
                      <span className="text-[10px] mt-0.5">{apt.startTime}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900">{apt.patientName}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isInitial ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isInitial ? 'Initial' : 'Subsequent'}
                        </span>
                        {isSelfBooked && (
                          <span className="px-2 py-0.5 bg-purple-600 text-white text-[10px] font-extrabold rounded-md shadow-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> SELF-BOOKED ONLINE
                          </span>
                        )}
                        {apt.bookingRef && (
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-mono font-bold rounded">
                            {apt.bookingRef}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-teal-700 font-semibold mt-0.5">
                        {apt.providerName} — {apt.appointmentType} {apt.cptCode && <span className="bg-teal-100 text-teal-800 px-1 py-0.2 rounded text-[10px] font-bold font-mono">CPT: {apt.cptCode}</span>}
                      </p>
                      <p className="text-[11px] text-slate-500">Location: {apt.location} | Reminder: {apt.reminderStatus}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      apt.status === 'CHECKED_IN' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {apt.status}
                    </span>
                    <button
                      onClick={() => setSelectedApt(apt)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" /> Details &amp; Check-in
                    </button>
                    <button
                      onClick={() => setEditingApt(apt)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer shadow-xs"
                      title="Edit Appointment, Change to Subsequent/Initial or Modify CPT Codes"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-teal-400" /> Edit
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Interactive Modals */}
      <ScheduleAppointmentModal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        onAppointmentBooked={() => loadAppointments()}
      />

      <AppointmentDetailsModal
        isOpen={!!selectedApt}
        onClose={() => setSelectedApt(null)}
        appointment={selectedApt}
        onStatusUpdated={() => loadAppointments()}
        onEditAppointment={(apt) => setEditingApt(apt)}
      />

      <EditAppointmentModal
        isOpen={!!editingApt}
        onClose={() => setEditingApt(null)}
        appointment={editingApt}
        onAppointmentUpdated={() => {
          loadAppointments();
          setSelectedApt(null);
        }}
      />
    </div>
  );
};

