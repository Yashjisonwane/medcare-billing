import React, { useState, useEffect } from 'react';
import { mockAppointmentService } from '../../services/mock/mockAppointmentService';
import { mockProviderService } from '../../services/mock/mockProviderService';
import { INITIAL_PROVIDER_CONFIGS } from '../../constants/providerConfigs';
import { CORE_SERVICES as SERVICES_CATALOG } from '../../constants/servicesCatalog';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, User, Phone, Mail, CheckCircle2,
  Sparkles, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle,
  Building2, Stethoscope, Check, Search, FileText, Tag, RefreshCw, Printer, Scale
} from 'lucide-react';

export const PatientSelfBookingPage = () => {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const { user } = useAuthStore();

  const [mode, setMode] = useState('book'); // 'book' | 'lookup'
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Search Lookup State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    patientDob: '',
    providerId: 'prov-josmic',
    visitType: 'INITIAL', // 'INITIAL' | 'SUBSEQUENT'
    serviceIds: [SERVICES_CATALOG[0].id],
    appointmentType: SERVICES_CATALOG[0].name,
    cptCode: SERVICES_CATALOG[0].suggestedCptCode,
    reasonForVisit: 'Initial consultation and evaluation',
    date: new Date().toISOString().split('T')[0],
    time: '',
    hasAttorney: false,
    attorneyName: '',
    lawFirm: '',
    attorneyPhone: '',
  });

  // Providers state (loaded from backend)
  const [providers, setProviders] = useState(Object.values(INITIAL_PROVIDER_CONFIGS));

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const backendProviders = await mockProviderService.getProviders();
        if (backendProviders && backendProviders.length > 0) {
          const merged = backendProviders.map(bp => {
            const staticMatch = Object.values(INITIAL_PROVIDER_CONFIGS).find(ip => ip.id === bp.id || ip.name === bp.name);
            return {
              ...staticMatch,
              ...bp,
              cptCode: bp.cptCode || staticMatch?.cptCode || '99204 (Confirmed)',
              fee: bp.fee || staticMatch?.fee || '$1,214.00'
            };
          });
          setProviders(merged);
        }
      } catch (err) {
        console.warn('Using default provider configurations', err);
      }
    };
    fetchProviders();
  }, []);

  // Available Slots state
  const [slotsState, setSlotsState] = useState({ loading: false, isClosed: false, isWeekend: false, isHoliday: false, reason: '', holidayName: '', slots: [] });

  const selectedProvider = providers.find(p => p.id === formData.providerId) || providers[0];

  useEffect(() => {
    if (formData.date && formData.providerId && mode === 'book') {
      loadSlots(formData.providerId, formData.date);
    }
  }, [formData.date, formData.providerId, mode]);

  const loadSlots = async (providerId, dateStr) => {
    setSlotsState(prev => ({ ...prev, loading: true }));
    try {
      const res = await mockAppointmentService.getAvailableSlots(providerId, dateStr);
      setSlotsState({
        loading: false,
        isClosed: res.isClosed,
        isWeekend: res.isWeekend,
        isHoliday: res.isHoliday,
        reason: res.reason || '',
        holidayName: res.holidayName || '',
        slots: res.slots || []
      });
    } catch {
      setSlotsState({ loading: false, isClosed: false, isWeekend: false, isHoliday: false, reason: '', holidayName: '', slots: [] });
    }
  };

  const handleSearchLookup = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      addToast('Please enter your Phone, Email or Booking Reference code', 'warning');
      return;
    }
    setIsSearching(true);
    try {
      const results = await mockAppointmentService.searchPatientBookings(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        addToast('No bookings found matching your search query.', 'info');
      } else {
        addToast(`Found ${results.length} appointment record(s)!`, 'success');
      }
    } catch {
      addToast('Failed to search bookings', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleService = (serviceId) => {
    let currentIds = [...(formData.serviceIds || [])];
    if (currentIds.includes(serviceId)) {
      if (currentIds.length > 1) {
        currentIds = currentIds.filter(id => id !== serviceId);
      } else {
        addToast('Please keep at least one service selected', 'info');
        return;
      }
    } else {
      currentIds.push(serviceId);
    }

    const selectedServices = SERVICES_CATALOG.filter(s => currentIds.includes(s.id));
    const aptTypes = selectedServices.map(s => s.name).join(' + ');
    const cptCodes = selectedServices.map(s => s.suggestedCptCode).join(', ');

    setFormData(prev => ({
      ...prev,
      serviceIds: currentIds,
      appointmentType: aptTypes,
      cptCode: cptCodes
    }));
  };

  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.patientPhone || !formData.patientEmail || !formData.patientDob) {
      addToast('Please enter your full name, phone number, email, and date of birth', 'warning');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!formData.serviceIds || formData.serviceIds.length === 0) {
      addToast('Please select at least one service', 'warning');
      return;
    }
    setStep(3);
  };

  const handleAutoBookSubmit = async () => {
    if (!formData.date || !formData.time) {
      addToast('Please select a date and an available time slot', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      const selectedServices = SERVICES_CATALOG.filter(s => formData.serviceIds.includes(s.id));
      const serviceLines = selectedServices.map((s, idx) => ({
        id: `line-${idx + 1}`,
        cptCode: s.suggestedCptCode,
        description: s.name,
        modifier1: idx === 0 ? (formData.visitType === 'INITIAL' ? '25' : '25') : '59',
        modifier2: '59',
        modifier3: 'RT',
        modifier4: 'GP',
        diagnosisPointer: 'A',
        units: 1,
        charge: s.suggestedCptCode === '99204' ? 450.00 : s.suggestedCptCode === '97039' ? 250.00 : (s.standardRate || 350.00)
      }));

      const created = await mockAppointmentService.autoBookAppointment({
        ...formData,
        serviceLines,
        cptCode: serviceLines.map(l => l.cptCode).join(', '),
        providerName: selectedProvider.name
      });
      setConfirmedBooking(created);
      setStep(4);
      addToast('Appointment auto-booked! Confirmation SMS & Email dispatched.', 'success');
    } catch {
      addToast('Auto-booking failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-bold border border-teal-400/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" /> Patient Public Self-Booking Portal
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-2xl border border-slate-700">
              <button
                onClick={() => setMode('book')}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  mode === 'book'
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Book New Visit
              </button>
              <button
                onClick={() => setMode('lookup')}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer ${
                  mode === 'lookup'
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Search className="w-3.5 h-3.5" /> Find My Bookings
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {mode === 'book' ? 'Schedule Your Medical Appointment' : 'Look Up Your Existing Bookings'}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-2xl">
            {mode === 'book'
              ? 'Book your visit in real-time. Pick a doctor, service, and preferred slot. Instant confirmation & SMS reminders sent automatically.'
              : 'Enter your phone number, email address, or Booking Reference code (e.g. SELF-XXXXXX) to view your appointment history.'}
          </p>
        </div>
      </div>

      {/* â”€â”€ MODE: LOOKUP MY BOOKINGS â”€â”€ */}
      {mode === 'lookup' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-teal-600" /> Search Patient Appointments
            </h2>
            <p className="text-xs text-slate-500">Lookup past and upcoming visits using your phone number, email, or reference code</p>
          </div>

          <form onSubmit={handleSearchLookup} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                placeholder="Enter Mobile Phone (e.g. 713-555-0100), Email, or Booking Ref (e.g. SELF-123456)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-none transition font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Search Bookings
            </button>
          </form>

          {/* Results List */}
          {searchResults !== null && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Matched Appointments ({searchResults.length})
                </span>
                <span className="text-[11px] text-slate-500">Showing all active &amp; historical records</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  No appointment records found matching "<strong>{searchQuery}</strong>".
                  <p className="mt-1 text-[11px] text-slate-400">Please double-check your phone number or reference code.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-white border border-slate-200 hover:border-teal-300 rounded-2xl p-5 shadow-sm transition space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-extrabold text-slate-900">{apt.patientName}</h3>
                            {apt.bookingRef && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-extrabold rounded font-mono">
                                {apt.bookingRef}
                              </span>
                            )}
                            {apt.bookingChannel && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded">
                                Self-Booked Online
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {apt.providerName || 'JOSMIC Wellness Center'} | Phone: {apt.patientPhone || 'N/A'}
                          </p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                          apt.status === 'SCHEDULED' ? 'bg-emerald-100 text-emerald-800' :
                          apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Date &amp; Time</span>
                          <strong className="text-slate-900 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-teal-600" /> {apt.date} at {apt.startTime}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Service &amp; CPT</span>
                          <span className="font-bold text-slate-900 block mt-0.5">
                            {apt.appointmentType} <span className="text-teal-700 bg-teal-100 px-1 rounded text-[10px]">CPT: {apt.cptCode || '99204'}</span>
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                          <span className="text-slate-800 font-medium block mt-0.5">{apt.location || 'Main Clinic Suite 774'}</span>
                        </div>
                      </div>

                      {/* Reminder status badge */}
                      <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Reminder Log: <strong>{apt.reminderStatus || 'Automated SMS Dispatched'}</strong>
                        </span>
                        <span className="text-slate-400 text-[10px]">Ref: {apt.bookingRef || apt.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* â”€â”€ MODE: BOOK NEW VISIT â”€â”€ */}
      {mode === 'book' && (
        <>
          {/* Step Indicator Bar */}
          {step < 4 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex justify-between items-center text-xs font-bold text-slate-500">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-600 font-extrabold' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-100'}`}>1</span>
                <span>Your Info</span>
              </div>
              <div className="h-0.5 flex-1 bg-slate-100 mx-3"></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-600 font-extrabold' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-100'}`}>2</span>
                <span>Doctor &amp; Service</span>
              </div>
              <div className="h-0.5 flex-1 bg-slate-100 mx-3"></div>
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-teal-600 font-extrabold' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-100'}`}>3</span>
                <span>Date &amp; Time</span>
              </div>
            </div>
          )}

          {/* STEP 1: Patient Information */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" /> Patient Details
                </h2>
                <p className="text-xs text-slate-500">Please provide contact info for booking confirmation and automated reminders</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.patientName}
                      onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Mobile Phone (For SMS Reminders) *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 713-555-0199"
                      value={formData.patientPhone}
                      onChange={e => setFormData({ ...formData, patientPhone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Email Address (For Appointment Confirmation) *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah.j@example.com"
                      value={formData.patientEmail}
                      onChange={e => setFormData({ ...formData, patientEmail: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center justify-between">
                    <span>Date of Birth *</span>
                    {formData.patientDob && (
                      <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        Age: {Math.max(0, new Date().getFullYear() - new Date(formData.patientDob).getFullYear())} yrs
                      </span>
                    )}
                  </label>
                  <input
                    type="date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.patientDob}
                    onChange={e => setFormData({ ...formData, patientDob: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Reason for Visit / Symptoms</label>
                <textarea
                  rows="2"
                  placeholder="Describe your pain, injury, or consultation request..."
                  value={formData.reasonForVisit}
                  onChange={e => setFormData({ ...formData, reasonForVisit: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition"
                ></textarea>
              </div>

              {/* Legal / Attorney Lien Representation (Optional) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-teal-600" /> Accident Legal Representation (Optional)
                    </span>
                    <p className="text-[11px] text-slate-500">Do you have an attorney representing your auto accident or injury claim?</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasAttorney}
                      onChange={e => setFormData({ ...formData, hasAttorney: e.target.checked })}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-xs font-bold text-teal-800">Yes, I have an attorney</span>
                  </label>
                </div>

                {formData.hasAttorney && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80 animate-in fade-in-50">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Attorney Name / Law Firm</label>
                      <input
                        type="text"
                        placeholder="e.g. OJ Lawal & Associates, Marcus Vance"
                        value={formData.attorneyName}
                        onChange={e => setFormData({ ...formData, attorneyName: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-teal-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Law Firm Phone (Optional)</label>
                      <input
                        type="tel"
                        placeholder="e.g. 713-555-0188"
                        value={formData.attorneyPhone}
                        onChange={e => setFormData({ ...formData, attorneyPhone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-teal-600 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Continue to Doctor &amp; Service <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Doctor & Service Selection */}
          {step === 2 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-teal-600" /> Select Practice &amp; Treatment Service
                </h2>
                <p className="text-xs text-slate-500">Choose your attending clinic provider and treatment type</p>
              </div>

              {/* Provider Cards */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-900">Select Clinic Provider</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {providers.map(p => (
                    <div
                      key={p.id}
                      onClick={() => setFormData({ ...formData, providerId: p.id })}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                        formData.providerId === p.id
                          ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <Building2 className={`w-5 h-5 mt-0.5 ${formData.providerId === p.id ? 'text-teal-600' : 'text-slate-400'}`} />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{p.name}</div>
                        <div className="text-[11px] text-slate-500">{p.serviceCategory || p.subtitle || 'Specialized Clinic Center'}</div>
                        <div className="text-[10px] text-teal-700 font-medium mt-1">
                          Default CPT Code: <span className="font-bold font-mono text-slate-800">{p.cptCode || '99204'}</span> Â· Fee: <span className="font-bold text-slate-900">{p.fee || '$1,214.00'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Cards */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-900">
                    Select Services / Modalities (Multi-Code Selection Enabled)
                  </label>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    {formData.serviceIds?.length || 1} Selected
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SERVICES_CATALOG.map(s => {
                    const isSelected = (formData.serviceIds || []).includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleToggleService(s.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between relative ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <div className="text-xs font-bold text-slate-900">{s.name}</div>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                              isSelected ? 'bg-teal-600 text-white' : 'border border-slate-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">{s.description}</div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-teal-100 text-teal-800 font-mono">
                            CPT: {s.suggestedCptCode}
                          </span>
                          <span className="text-xs font-black text-slate-900">
                            ${s.standardRate ? s.standardRate.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '1,214.00'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Patient Info
                </button>
                <button
                  onClick={handleNextStep2}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Pick Date &amp; Time Slot <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Date & Slot Engine Picker */}
          {step === 3 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" /> Automated Slot Availability Picker
                </h2>
                <p className="text-xs text-slate-500">Pick an open time slot for {formData.appointmentType} with {selectedProvider.name}</p>
              </div>

              {/* Selected Summary Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Selected Service:</span> <strong className="text-slate-900">{formData.appointmentType}</strong>
                </div>
                <div>
                  <span className="text-slate-500">CPT Code:</span> <span className="px-2 py-0.5 bg-teal-100 text-teal-800 font-bold rounded">{formData.cptCode}</span>
                </div>
                <div>
                  <span className="text-slate-500">Provider:</span> <strong className="text-slate-900">{selectedProvider.name}</strong>
                </div>
              </div>

              {/* Date Picker Input */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">Select Appointment Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value, time: '' })}
                  className="w-full sm:w-64 px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-600 outline-none transition font-bold"
                />
              </div>

              {/* Weekend / Holiday Closure Alert Guard */}
              {slotsState.isClosed && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 text-xs">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">
                      {slotsState.allSlotsPassed ? "Today's Schedule Ended" : `Clinic Closed: ${slotsState.reason}`}
                    </strong>
                    <p className="text-amber-700 mt-0.5">
                      {slotsState.allSlotsPassed
                        ? `All appointment slots for today (${formData.date}) have already passed. Please pick tomorrow or an upcoming date from the calendar above.`
                        : slotsState.isWeekend 
                        ? 'Our clinic is closed on Saturdays and Sundays. Please select a Monday through Friday date for your visit.'
                        : 'Routine patient visits are not scheduled on US Federal Holidays. Please select another business day.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Time Slot Picker Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-900 flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" /> Available Real-time Time Slots
                  </span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                      Clinic Time (Houston, TX - CT): {new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date())}
                    </span>
                  </div>
                </label>

                {slotsState.loading ? (
                  <div className="p-8 text-center text-slate-400 text-xs animate-pulse">Checking real-time schedule availability...</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {slotsState.slots.map(s => {
                      if (s.isPast) {
                        return (
                          <div
                            key={s.time}
                            className="p-3 rounded-xl text-xs font-semibold border bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed flex items-center justify-between opacity-60 select-none"
                            title="This time slot has already passed for today"
                          >
                            <span className="line-through">{s.time}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded">Passed</span>
                          </div>
                        );
                      }

                      if (s.isBooked) {
                        return (
                          <div
                            key={s.time}
                            className="p-3 rounded-xl text-xs font-semibold border bg-rose-50 text-rose-400 border-rose-200 cursor-not-allowed flex items-center justify-between opacity-70 select-none"
                            title="This time slot is already booked"
                          >
                            <span className="line-through">{s.time}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded">Booked</span>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled={!s.available}
                          onClick={() => setFormData({ ...formData, time: s.time })}
                          className={`p-3 rounded-xl text-xs font-bold border transition flex items-center justify-between cursor-pointer ${
                            formData.time === s.time
                              ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-600/30'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-teal-600 hover:bg-teal-50/30 active:scale-98'
                          }`}
                        >
                          <span>{s.time}</span>
                          {formData.time === s.time && <Check className="w-4 h-4 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Provider Selection
                </button>
                <button
                  disabled={isSubmitting || !formData.time || slotsState.isClosed}
                  onClick={handleAutoBookSubmit}
                  className={`inline-flex items-center gap-2 px-8 py-3.5 text-white font-extrabold text-xs rounded-xl shadow-lg transition cursor-pointer ${
                    isSubmitting || !formData.time || slotsState.isClosed
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Auto-Booking Appointment...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Confirm &amp; Auto-Book Appointment
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Confirmation */}
          {step === 4 && confirmedBooking && (
            <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-10 shadow-lg space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Booking Confirmed Successfully
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">Your Appointment is Scheduled!</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Booking Reference Code: <strong className="text-teal-700 font-mono text-sm px-2 py-0.5 bg-teal-50 rounded border border-teal-200">{confirmedBooking.bookingRef}</strong>
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-lg mx-auto text-left space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Patient Name:</span>
                  <strong className="text-slate-900">{confirmedBooking.patientName}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Attending Clinic:</span>
                  <strong className="text-slate-900">{confirmedBooking.providerName}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Service &amp; CPT:</span>
                  <span className="font-bold text-slate-900">
                    {confirmedBooking.appointmentType} <span className="text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded text-[10px]">CPT: {confirmedBooking.cptCode}</span>
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Date &amp; Time:</span>
                  <strong className="text-slate-900">{confirmedBooking.date} at {confirmedBooking.startTime}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <strong className="text-slate-900">{confirmedBooking.location}</strong>
                </div>
              </div>

              {/* Reminder Dispatch Cards (Email & SMS) */}
              <div className="max-w-lg mx-auto space-y-2.5">
                {/* Email Confirmation Dispatch Card */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-left text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-2xs">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-emerald-950">Confirmation Email Dispatched</div>
                      <div className="text-[11px] text-emerald-800">
                        Details sent to <strong className="font-mono">{formData.patientEmail || confirmedBooking.patientEmail || 'patient@email.com'}</strong>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-200/80 text-emerald-900 text-[10px] font-extrabold rounded-lg font-mono">
                    SENT âœ“
                  </span>
                </div>

                {/* SMS Confirmation Dispatch Card */}
                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between text-left text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-2xs">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-teal-950">Automated SMS Notification</div>
                      <div className="text-[11px] text-teal-800">
                        SMS dispatched to <strong className="font-mono">{confirmedBooking.patientPhone}</strong>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-teal-200/80 text-teal-900 text-[10px] font-extrabold rounded-lg font-mono">
                    SENT âœ“
                  </span>
                </div>
              </div>

              {/* Action Buttons for Patient & Staff */}
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print Confirmation
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery(confirmedBooking.bookingRef || confirmedBooking.patientPhone);
                    setMode('lookup');
                    handleSearchLookup();
                  }}
                  className="px-5 py-2.5 border border-teal-300 text-teal-800 bg-teal-50/50 hover:bg-teal-100 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-4 h-4" /> View in My Bookings
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setConfirmedBooking(null);
                    setFormData({
                      patientName: '',
                      patientPhone: '',
                      patientEmail: '',
                      patientDob: '',
                      providerId: 'prov-josmic',
                      serviceIds: [SERVICES_CATALOG[0].id],
                      appointmentType: SERVICES_CATALOG[0].name,
                      cptCode: SERVICES_CATALOG[0].suggestedCptCode,
                      reasonForVisit: 'Initial consultation and evaluation',
                      date: new Date().toISOString().split('T')[0],
                      time: '',
                    });
                  }}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Book Another Appointment
                </button>

                {/* If staff is logged in, show back to clinic portal */}
                {user && (
                  <button
                    type="button"
                    onClick={() => navigate('/appointments/calendar')}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    Back to Staff Calendar
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
