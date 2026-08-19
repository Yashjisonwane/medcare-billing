// src/pages/appointments/CheckInPage.jsx
import React, { useEffect, useState } from 'react';
import { apiAppointmentService } from '../../services/api/apiAppointmentService';
import { INITIAL_PROVIDER_CONFIGS } from '../../constants/providerConfigs';
import { apiProviderService } from '../../services/api/apiProviderService';
import { AppointmentDetailsModal } from '../../components/modals/AppointmentDetailsModal';
import { EditAppointmentModal } from '../../components/modals/EditAppointmentModal';
import { ScheduleAppointmentModal } from '../../components/modals/ScheduleAppointmentModal';
import { useUIStore } from '../../store/uiStore';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Clock, User, ArrowLeft, Search, Filter,
  Calendar, Building2, Edit3, Eye, PlusCircle, AlertCircle,
  DoorOpen, Sparkles, Phone, MapPin, Check, RefreshCw, AlertTriangle
} from 'lucide-react';

export const CheckInPage = () => {
  const [apts, setApts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProvider, setSelectedProvider] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'SCHEDULED' | 'CHECKED_IN' | 'IN_EXAM' | 'COMPLETED'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [viewingApt, setViewingApt] = useState(null);
  const [editingApt, setEditingApt] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const [providersList, setProvidersList] = useState([]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const filters = { date: selectedDate };
      if (selectedProvider !== 'ALL') filters.providerId = selectedProvider;
      const data = await apiAppointmentService.getAllAppointments();
      let filteredData = data;
      if (filters.date) {
        filteredData = filteredData.filter(a => a.date === filters.date);
      }
      if (filters.providerId && filters.providerId !== 'ALL') {
        filteredData = filteredData.filter(a => a.providerId === filters.providerId);
      }
      setApts(filteredData);
    } catch {
      addToast('Failed to load check-in queue.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadProviders = async () => {
    try {
      const data = await apiProviderService.getProviders();
      setProvidersList(Object.values(data));
    } catch (err) {
      console.error('Failed to load providers', err);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [selectedDate, selectedProvider]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiAppointmentService.updateStatus(id, newStatus);
      const readable = newStatus === 'SCHEDULED' ? 'Scheduled (Not Arrived)' :
                       newStatus === 'CHECKED_IN' ? 'Checked In (Lobby Waiting)' :
                       newStatus === 'IN_EXAM' ? 'In Exam Room' : 'Completed';
      addToast(`Patient status updated: ${readable}`, 'success');
      loadAppointments();
    } catch {
      addToast('Failed to update visit status', 'error');
    }
  };

  // Filter logic
  const filteredApts = apts.filter(apt => {
    if (statusFilter !== 'ALL' && apt.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.patientName?.toLowerCase().includes(q);
      const matchPhone = apt.patientPhone?.includes(q);
      const matchCase = apt.caseId?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchCase) return false;
    }
    return true;
  });

  const countScheduled = apts.filter(a => a.status === 'SCHEDULED').length;
  const countWaiting = apts.filter(a => a.status === 'CHECKED_IN').length;
  const countInExam = apts.filter(a => a.status === 'IN_EXAM').length;
  const countCompleted = apts.filter(a => a.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/appointments/calendar')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Back to Calendar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Front Desk Check-In Queue</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time patient arrival tracking, lobby waiting queue &amp; visit updates
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => loadAppointments()}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            title="Refresh Queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Book New Arrival
          </button>
        </div>
      </div>

      {/* KPI Status Pipeline Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setStatusFilter(statusFilter === 'SCHEDULED' ? 'ALL' : 'SCHEDULED')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'SCHEDULED'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={statusFilter === 'SCHEDULED' ? 'text-amber-100' : 'text-slate-500'}>Expected Arrivals</span>
            <Clock className={`w-4 h-4 ${statusFilter === 'SCHEDULED' ? 'text-amber-100' : 'text-amber-500'}`} />
          </div>
          <p className="text-2xl font-extrabold font-mono mt-1">{countScheduled}</p>
          <p className={`text-[10px] font-bold ${statusFilter === 'SCHEDULED' ? 'text-amber-100' : 'text-amber-600'}`}>
            Scheduled (Not Arrived)
          </p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'CHECKED_IN' ? 'ALL' : 'CHECKED_IN')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'CHECKED_IN'
              ? 'bg-teal-700 text-white border-teal-700 shadow-md ring-2 ring-teal-700/20'
              : 'bg-white border-slate-200 hover:border-teal-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={statusFilter === 'CHECKED_IN' ? 'text-teal-100' : 'text-slate-500'}>Waiting in Lobby</span>
            <User className={`w-4 h-4 ${statusFilter === 'CHECKED_IN' ? 'text-teal-200' : 'text-teal-600'}`} />
          </div>
          <p className="text-2xl font-extrabold font-mono mt-1">{countWaiting}</p>
          <p className={`text-[10px] font-bold ${statusFilter === 'CHECKED_IN' ? 'text-teal-100' : 'text-teal-600'}`}>
            Checked In (Waiting)
          </p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'IN_EXAM' ? 'ALL' : 'IN_EXAM')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'IN_EXAM'
              ? 'bg-cyan-800 text-white border-cyan-800 shadow-md ring-2 ring-cyan-800/20'
              : 'bg-white border-slate-200 hover:border-cyan-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={statusFilter === 'IN_EXAM' ? 'text-cyan-100' : 'text-slate-500'}>In Exam / Therapy</span>
            <DoorOpen className={`w-4 h-4 ${statusFilter === 'IN_EXAM' ? 'text-cyan-200' : 'text-cyan-600'}`} />
          </div>
          <p className="text-2xl font-extrabold font-mono mt-1">{countInExam}</p>
          <p className={`text-[10px] font-bold ${statusFilter === 'IN_EXAM' ? 'text-cyan-100' : 'text-cyan-700'}`}>
            With Doctor / Therapist
          </p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'COMPLETED' ? 'ALL' : 'COMPLETED')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'COMPLETED'
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-800/20'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={statusFilter === 'COMPLETED' ? 'text-emerald-100' : 'text-slate-500'}>Completed</span>
            <CheckCircle2 className={`w-4 h-4 ${statusFilter === 'COMPLETED' ? 'text-emerald-200' : 'text-emerald-600'}`} />
          </div>
          <p className="text-2xl font-extrabold font-mono mt-1">{countCompleted}</p>
          <p className={`text-[10px] font-bold ${statusFilter === 'COMPLETED' ? 'text-emerald-100' : 'text-emerald-700'}`}>
            Visits Finished Today
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search patient name, phone, case #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-none transition"
            />
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-teal-600 outline-none cursor-pointer"
          >
            <option value="ALL">All Care Providers</option>
            {providersList.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-teal-600 outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses ({apts.length})</option>
            <option value="SCHEDULED">Scheduled (Not Arrived) ({countScheduled})</option>
            <option value="CHECKED_IN">Waiting in Lobby ({countWaiting})</option>
            <option value="IN_EXAM">In Exam Room ({countInExam})</option>
            <option value="COMPLETED">Completed ({countCompleted})</option>
          </select>
        </div>
      </div>

      {/* Patient Queue Cards List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200 animate-pulse">
          Loading check-in queue...
        </div>
      ) : filteredApts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <User className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Patient Check-in Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            There are no appointments matching your date, provider, or status filter.
          </p>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Book New Arrival
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApts.map((apt) => {
            const isSelfBooked = apt.bookingChannel?.toLowerCase().includes('patient') || (apt.bookingRef && apt.bookingRef.startsWith('SELF-'));

            return (
              <div
                key={apt.id}
                className={`bg-white p-5 rounded-2xl border shadow-xs hover:shadow-md transition space-y-4 ${
                  apt.status === 'SCHEDULED' ? 'border-amber-200/80 hover:border-amber-400' :
                  apt.status === 'CHECKED_IN' ? 'border-teal-300 hover:border-teal-500 ring-1 ring-teal-500/10' :
                  apt.status === 'IN_EXAM' ? 'border-cyan-300 hover:border-cyan-500' :
                  'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  {/* Patient & Booking Details */}
                  <div className="flex items-start gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                      apt.status === 'SCHEDULED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      apt.status === 'CHECKED_IN' ? 'bg-teal-50 text-teal-700 border-teal-200 shadow-2xs' :
                      apt.status === 'IN_EXAM' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {apt.status === 'SCHEDULED' ? <Clock className="w-6 h-6 text-amber-600" /> :
                       apt.status === 'CHECKED_IN' ? <User className="w-6 h-6 text-teal-600" /> :
                       apt.status === 'IN_EXAM' ? <DoorOpen className="w-6 h-6 text-cyan-600" /> :
                       <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-extrabold text-slate-900">{apt.patientName}</h3>
                        {apt.patientPhone && (
                          <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" /> {apt.patientPhone}
                          </span>
                        )}
                        {apt.caseId && (
                          <span className="px-2 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-bold rounded-lg border border-teal-200 font-mono">
                            {apt.caseId}
                          </span>
                        )}
                        {isSelfBooked && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-purple-600" /> Self-Booked
                          </span>
                        )}

                        {/* Prominent Real-time Status Badge */}
                        {apt.status === 'SCHEDULED' && (
                          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-full font-extrabold text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600 animate-pulse" /> Scheduled (Not Arrived)
                          </span>
                        )}
                        {apt.status === 'CHECKED_IN' && (
                          <span className="px-2.5 py-0.5 bg-teal-50 text-teal-900 border border-teal-300 rounded-full font-extrabold text-[11px] flex items-center gap-1.5 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" /> Checked In (Lobby Waiting)
                          </span>
                        )}
                        {apt.status === 'IN_EXAM' && (
                          <span className="px-2.5 py-0.5 bg-cyan-50 text-cyan-900 border border-cyan-300 rounded-full font-extrabold text-[11px] flex items-center gap-1">
                            <DoorOpen className="w-3 h-3 text-cyan-600" /> In Exam Room
                          </span>
                        )}
                        {apt.status === 'COMPLETED' && (
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-full font-extrabold text-[11px] flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600 stroke-[3]" /> Completed Visit
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                        <span className="font-bold text-teal-800 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-teal-600" /> {apt.providerName}
                        </span>
                        <span>â€¢</span>
                        <span className="font-medium text-slate-700">{apt.appointmentType}</span>
                        {apt.cptCode && (
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono font-bold">
                            CPT: {apt.cptCode}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap pt-0.5">
                        <span className="flex items-center gap-1 font-bold text-slate-800">
                          <Clock className="w-3 h-3 text-slate-400" /> Scheduled Time: {apt.startTime} â€“ {apt.endTime}
                        </span>
                        <span>â€¢</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> Location: <strong className="text-slate-800">{apt.location || 'Main Clinic'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: View & Edit */}
                  <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
                    <button
                      type="button"
                      onClick={() => setViewingApt(apt)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingApt(apt)}
                      className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit / Reschedule
                    </button>
                  </div>
                </div>

                {/* Status Segmented Control Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    <span>Current Patient Flow:</span>
                    {apt.status === 'SCHEDULED' ? (
                      <span className="text-amber-700 font-extrabold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Awaiting Patient Arrival
                      </span>
                    ) : apt.status === 'CHECKED_IN' ? (
                      <span className="text-teal-800 font-extrabold flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-teal-600" /> Patient In Lobby Waiting Area
                      </span>
                    ) : apt.status === 'IN_EXAM' ? (
                      <span className="text-cyan-800 font-extrabold flex items-center gap-1">
                        <DoorOpen className="w-3.5 h-3.5 text-cyan-600" /> Currently With Doctor
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Visit Complete
                      </span>
                    )}
                  </div>

                  {/* 4 Interactive Status Segment Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* 1. Scheduled (Not Arrived) Button */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(apt.id, 'SCHEDULED')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        apt.status === 'SCHEDULED'
                          ? 'bg-amber-500 text-white font-extrabold shadow-sm ring-2 ring-amber-500/20'
                          : 'bg-white hover:bg-amber-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Clock className={`w-3.5 h-3.5 ${apt.status === 'SCHEDULED' ? 'text-white' : 'text-amber-500'}`} />
                      <span>Scheduled (Not Arrived)</span>
                    </button>

                    {/* 2. Checked In (Lobby Waiting) Button */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(apt.id, 'CHECKED_IN')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        apt.status === 'CHECKED_IN'
                          ? 'bg-teal-600 text-white font-extrabold shadow-sm ring-2 ring-teal-600/20'
                          : 'bg-white hover:bg-teal-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${apt.status === 'CHECKED_IN' ? 'text-white' : 'text-teal-600'}`} />
                      <span>Checked In (Lobby Waiting)</span>
                    </button>

                    {/* 3. In Exam Room Button */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(apt.id, 'IN_EXAM')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        apt.status === 'IN_EXAM'
                          ? 'bg-cyan-700 text-white font-extrabold shadow-sm ring-2 ring-cyan-700/20'
                          : 'bg-white hover:bg-cyan-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <DoorOpen className={`w-3.5 h-3.5 ${apt.status === 'IN_EXAM' ? 'text-white' : 'text-cyan-600'}`} />
                      <span>In Exam Room</span>
                    </button>

                    {/* 4. Completed Button */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(apt.id, 'COMPLETED')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        apt.status === 'COMPLETED'
                          ? 'bg-emerald-600 text-white font-extrabold shadow-sm ring-2 ring-emerald-600/20'
                          : 'bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${apt.status === 'COMPLETED' ? 'text-white' : 'text-emerald-600 stroke-[3]'}`} />
                      <span>Completed</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Modals */}
      {viewingApt && (
        <AppointmentDetailsModal
          isOpen={!!viewingApt}
          onClose={() => setViewingApt(null)}
          appointment={viewingApt}
          onStatusUpdated={() => loadAppointments()}
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
          onAppointmentUpdated={() => loadAppointments()}
        />
      )}

      {showScheduleModal && (
        <ScheduleAppointmentModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          onAppointmentBooked={() => loadAppointments()}
        />
      )}
    </div>
  );
};
