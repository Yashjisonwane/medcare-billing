// src/pages/appointments/ScheduleAppointmentPage.jsx
import React, { useState } from 'react';
import { mockAppointmentService } from '../../services/mock/mockAppointmentService';
import { INITIAL_PROVIDER_CONFIGS } from '../../constants/providerConfigs';
import { createDefaultServiceLine } from '../../constants/servicesCatalog';
import { MultiLineCptTable } from '../../components/common/MultiLineCptTable';
import { useUIStore } from '../../store/uiStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Save, Bell, User, MapPin, FileText, Tag } from 'lucide-react';

import { isClinicClosed } from '../../constants/usHolidays';

const inputCls = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-900 mb-1';

const SectionHead = ({ Icon, title }) => (
  <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2 mb-4">
    <Icon className="w-4 h-4 text-teal-600" /> {title}
  </h2>
);

export const ScheduleAppointmentPage = () => {
  const [serviceLines, setServiceLines] = useState([
    createDefaultServiceLine(1, '99204', 'Initial Comprehensive Pain Management Consultation', 450.00),
    createDefaultServiceLine(2, '97039', 'High Intensity Laser Therapy (HILT)', 250.00)
  ]);

  const [formData, setFormData] = useState({
    patientId: 'pat-001',
    patientName: 'Demo Patient 001',
    patientPhone: '713-555-0100',
    patientDob: '1985-05-15',
    caseId: 'case-001',
    caseRef: 'CASE-2025-1227',
    providerId: 'prov-josmic',
    visitType: 'INITIAL', // 'INITIAL' | 'SUBSEQUENT'
    appointmentType: 'Pain Consult',
    cptCode: '99204, 97039',
    reasonForVisit: 'Post-MVA initial pain management consultation & laser therapy',
    date: '2026-08-04',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    duration: '60',
    visitStatus: 'SCHEDULED',
    location: 'Suite 774',
    locationAddress: '10101 Harwin Dr. Suite 774, Houston TX 77036',
    room: 'Exam Room 3',
    telehealth: false,
    telehealthLink: '',
    reminderPreference: 'SMS',
    reminderTiming: '24H',
    sendConfirmation: true,
    interpreterNeeded: false,
    interpreterLanguage: '',
    transportNeeded: false,
    attendingProvider: 'Dr. Mohamed Siddiqui',
    attendingProviderNpi: '1234567890',
    authorizationNumber: '',
    copayAmount: '0.00',
    billToCase: true,
    visitNotes: 'Patient to bring photo ID, insurance card, and any prior imaging reports.',
    holidayOverride: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const set = (field, val) => setFormData(p => ({ ...p, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const closedCheck = isClinicClosed(formData.date);
    if (closedCheck.isClosed && !formData.holidayOverride) {
      addToast(`${closedCheck.reason}. Enable Admin Override to force book.`, 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const selectedProv = Object.values(INITIAL_PROVIDER_CONFIGS).find(p => p.id === formData.providerId);
      const totalEstimatedCharge = serviceLines.reduce((sum, l) => sum + ((parseFloat(l.units) || 1) * (parseFloat(l.charge) || 0)), 0);
      const created = await mockAppointmentService.createAppointment({
        ...formData,
        serviceLines,
        totalEstimatedCharge,
        cptCode: serviceLines.map(l => l.cptCode).filter(Boolean).join(', '),
        modifiers: serviceLines.map(l => [l.modifier1, l.modifier2, l.modifier3, l.modifier4].filter(Boolean).join('-')).filter(Boolean).join(', '),
        providerName: selectedProv?.name || 'JOSMIC Wellness Center'
      });
      addToast(`Appointment scheduled for ${created.patientName}! ${serviceLines.length} CPT codes linked.`, 'success');
      navigate('/appointments/calendar');
    } catch {
      addToast('Failed to schedule appointment', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/appointments/calendar')} className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Schedule
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Book New Patient Visit</h1>
        <p className="text-xs text-slate-500">Select practice provider, appointment slot &amp; reminder dispatch settings with multi-line CPT &amp; modifier support</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Patient & Case */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <SectionHead Icon={User} title="Patient & Case Reference" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Patient Name *</label><input required className={inputCls} value={formData.patientName} onChange={e => set('patientName', e.target.value)} /></div>
            <div><label className={labelCls}>Date of Birth</label><input type="date" className={inputCls} value={formData.patientDob} onChange={e => set('patientDob', e.target.value)} /></div>
            <div><label className={labelCls}>Patient Phone</label><input type="tel" className={inputCls} value={formData.patientPhone} onChange={e => set('patientPhone', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Linked Accident Case ID</label><input className={inputCls} value={formData.caseRef} onChange={e => set('caseRef', e.target.value)} placeholder="e.g. CASE-2025-1227" /></div>
            <div><label className={labelCls}>Authorization / Pre-Auth Number</label><input className={inputCls} value={formData.authorizationNumber} onChange={e => set('authorizationNumber', e.target.value)} placeholder="e.g. AUTH-8829201" /></div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <SectionHead Icon={Calendar} title="Appointment Details" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>1. Select Practice Provider *</label>
              <select 
                className={inputCls} 
                value={formData.providerId} 
                onChange={e => {
                  const pid = e.target.value;
                  const provKey = pid.replace('prov-', '');
                  const provConfig = INITIAL_PROVIDER_CONFIGS[provKey];
                  const firstService = provConfig?.providerServices?.find(s => s.enabled && s.configurationStatus === 'COMPLETE') || provConfig?.providerServices?.[0];
                  
                  setFormData(p => ({
                    ...p,
                    providerId: pid,
                    appointmentType: firstService ? firstService.billingDescription : (provConfig?.serviceCategory || 'Consultation'),
                    duration: firstService?.duration ? parseInt(firstService.duration) : 60
                  }));
                }}
              >
                <option value="prov-josmic">JOSMIC Wellness Center (Pain Management)</option>
                <option value="prov-davs">DAV'S Anatomy (Shockwave ESWT)</option>
                <option value="prov-anik">ANIK Laser Therapy (Laser Therapy)</option>
                <option value="prov-counselor">Counselor Practice (Counseling - Pending Config)</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>2. Appointment Encounter Type *</label>
              <select 
                className={`${inputCls} font-bold ${formData.visitType === 'INITIAL' ? 'text-teal-700 bg-teal-50/40 border-teal-300' : 'text-blue-700 bg-blue-50/40 border-blue-300'}`}
                value={formData.visitType}
                onChange={e => {
                  const val = e.target.value;
                  set('visitType', val);
                  // Update default CPT code if initial vs subsequent changed
                  if (val === 'SUBSEQUENT') {
                    setServiceLines([
                      createDefaultServiceLine(1, '99214', 'Office/Outpatient Visit Established Moderate (30-39 min)', 275.00),
                      createDefaultServiceLine(2, '97110', 'Therapeutic Exercise (15 min)', 110.00)
                    ]);
                  } else {
                    setServiceLines([
                      createDefaultServiceLine(1, '99204', 'Initial Comprehensive Pain Management Consultation', 450.00),
                      createDefaultServiceLine(2, '97039', 'High Intensity Laser Therapy (HILT)', 250.00)
                    ]);
                  }
                }}
              >
                <option value="INITIAL">Initial Visit (New Patient E&amp;M â€” e.g. 99204)</option>
                <option value="SUBSEQUENT">Subsequent / Follow-up Visit (Established E&amp;M â€” e.g. 99214)</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>3. Select Primary Modality *</label>
              {(() => {
                const provKey = formData.providerId.replace('prov-', '');
                const provConfig = INITIAL_PROVIDER_CONFIGS[provKey];
                const activeServices = provConfig?.providerServices?.filter(s => s.enabled && s.configurationStatus === 'COMPLETE') || [];
                const pendingServices = provConfig?.providerServices?.filter(s => !s.enabled || s.configurationStatus !== 'COMPLETE') || [];
                
                if (provKey === 'counselor' || activeServices.length === 0) {
                  return (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 font-semibold">
                      âš ï¸ {provKey === 'counselor' ? 'Counseling Billing Disabled' : 'Configuration Pending'}
                    </div>
                  );
                }

                return (
                  <select 
                    className={inputCls} 
                    value={formData.appointmentType} 
                    onChange={e => {
                      const selectedDesc = e.target.value;
                      const matched = provConfig.providerServices.find(s => s.billingDescription === selectedDesc);
                      setFormData(p => ({
                        ...p,
                        appointmentType: selectedDesc,
                        duration: matched?.duration ? parseInt(matched.duration) : p.duration
                      }));
                    }}
                  >
                    {activeServices.map(s => (
                      <option key={s.serviceId} value={s.billingDescription}>
                        {s.billingDescription} ({s.duration})
                      </option>
                    ))}
                    {pendingServices.map(s => (
                      <option key={s.serviceId} value={s.billingDescription} disabled>
                        {s.billingDescription} (Pending Config)
                      </option>
                    ))}
                  </select>
                );
              })()}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Attending Provider</label><input className={inputCls} value={formData.attendingProvider} onChange={e => set('attendingProvider', e.target.value)} /></div>
            <div><label className={labelCls}>Visit Status</label>
              <select className={inputCls} value={formData.visitStatus} onChange={e => set('visitStatus', e.target.value)}>
                <option value="SCHEDULED">Scheduled</option><option value="CONFIRMED">Confirmed</option><option value="WAITLIST">Waitlist</option><option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
          <div><label className={labelCls}>Reason for Visit</label><input className={inputCls} value={formData.reasonForVisit} onChange={e => set('reasonForVisit', e.target.value)} placeholder="e.g. Post-MVA pain management follow-up" /></div>

          {/* Multi-Line CPT & Modifiers Table */}
          <div className="pt-2">
            <MultiLineCptTable
              lines={serviceLines}
              onChange={setServiceLines}
              title="Appointment Billing Codes & Modifiers (Multi-Line Line 1, 2, 3...)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Visit Date *</label>
              <input type="date" required className={inputCls} value={formData.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div><label className={labelCls}>Start Time *</label><input type="text" required className={inputCls} value={formData.startTime} onChange={e => set('startTime', e.target.value)} /></div>
            <div><label className={labelCls}>End Time *</label><input type="text" required className={inputCls} value={formData.endTime} onChange={e => set('endTime', e.target.value)} /></div>
          </div>

          {/* Weekend / Holiday Closure Check */}
          {(() => {
            const closedCheck = isClinicClosed(formData.date);
            if (closedCheck.isClosed) {
              return (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <span className="text-base">{closedCheck.isWeekend ? 'ðŸ“…' : 'ðŸ‡ºðŸ‡¸'}</span>
                    <span>Clinic Closed â€” {closedCheck.reason}</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {closedCheck.isWeekend
                      ? 'Routine appointments are not scheduled on Saturdays and Sundays because the clinic is closed on weekends. Please pick a Mondayâ€“Friday date or toggle Admin Override.'
                      : 'Routine patient appointments are restricted on US Federal Holidays. Please choose an alternate business day or enable admin override.'}
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-950 pt-1">
                    <input 
                      type="checkbox" 
                      checked={formData.holidayOverride || false} 
                      onChange={e => set('holidayOverride', e.target.checked)} 
                      className="rounded text-amber-600 focus:ring-amber-500" 
                    />
                    Admin Override: Authorize Visit on Weekend / Holiday
                  </label>
                </div>
              );
            }
            return null;
          })()}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Appointment Duration</label>
              <select className={inputCls} value={formData.duration} onChange={e => set('duration', e.target.value)}>
                <option value="15">15 minutes</option><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option><option value="90">90 minutes</option><option value="120">2 hours</option>
              </select>
            </div>
            <div><label className={labelCls}>Co-pay Amount ($)</label><input type="number" step="0.01" className={inputCls} value={formData.copayAmount} onChange={e => set('copayAmount', e.target.value)} /></div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <SectionHead Icon={MapPin} title="Location & Visit Mode" />
          <div className="flex items-center gap-4 mb-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input type="checkbox" checked={formData.telehealth} onChange={e => set('telehealth', e.target.checked)} className="rounded text-teal-600" />
              Telehealth / Virtual Visit
            </label>
          </div>
          {!formData.telehealth ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className={labelCls}>Office / Suite</label><input className={inputCls} value={formData.location} onChange={e => set('location', e.target.value)} /></div>
              <div className="sm:col-span-2"><label className={labelCls}>Full Address</label><input className={inputCls} value={formData.locationAddress} onChange={e => set('locationAddress', e.target.value)} /></div>
            </div>
          ) : (
            <div><label className={labelCls}>Telehealth Link / Meeting URL</label><input className={inputCls} value={formData.telehealthLink} onChange={e => set('telehealthLink', e.target.value)} placeholder="https://doxy.me/provider..." /></div>
          )}
          <div><label className={labelCls}>Exam / Treatment Room</label><input className={inputCls} value={formData.room} onChange={e => set('room', e.target.value)} placeholder="e.g. Exam Room 3" /></div>
        </div>

        {/* Reminders & Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <SectionHead Icon={Bell} title="Reminders & Special Needs" />
          <div><label className={labelCls}>Automated Reminder Delivery</label>
            <div className="flex items-center gap-6 text-xs">
              {['SMS', 'EMAIL', 'PHONE'].map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input type="radio" name="rem" checked={formData.reminderPreference === opt} onChange={() => set('reminderPreference', opt)} className="text-teal-600 focus:ring-teal-600" />
                  <span>{opt === 'SMS' ? 'SMS Text Message' : opt === 'EMAIL' ? 'Email Notification' : 'Phone Call'} (Demo)</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Send Reminder</label>
              <select className={inputCls} value={formData.reminderTiming} onChange={e => set('reminderTiming', e.target.value)}>
                <option value="1H">1 Hour Before</option><option value="3H">3 Hours Before</option><option value="24H">24 Hours Before</option><option value="48H">48 Hours Before</option>
              </select>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input type="checkbox" checked={formData.sendConfirmation} onChange={e => set('sendConfirmation', e.target.checked)} className="rounded text-teal-600" />
                Send Booking Confirmation
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 mb-2">
                <input type="checkbox" checked={formData.interpreterNeeded} onChange={e => set('interpreterNeeded', e.target.checked)} className="rounded text-teal-600" />
                Interpreter Required
              </label>
              {formData.interpreterNeeded && (
                <input className={inputCls} placeholder="e.g. Spanish, Mandarin" value={formData.interpreterLanguage} onChange={e => set('interpreterLanguage', e.target.value)} />
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 mb-2">
                <input type="checkbox" checked={formData.transportNeeded} onChange={e => set('transportNeeded', e.target.checked)} className="rounded text-teal-600" />
                Medical Transport Needed
              </label>
            </div>
          </div>
        </div>

        {/* Visit Notes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <SectionHead Icon={FileText} title="Visit Instructions & Notes" />
          <div><label className={labelCls}>Patient Visit Notes / Instructions</label>
            <textarea rows={3} className={`${inputCls} resize-none`} value={formData.visitNotes} onChange={e => set('visitNotes', e.target.value)} />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input type="checkbox" checked={formData.billToCase} onChange={e => set('billToCase', e.target.checked)} className="rounded text-teal-600" />
              Bill charges to linked accident case (lien)
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button type="button" onClick={() => navigate('/appointments/calendar')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5">
            <Save className="w-4 h-4" /> {isLoading ? 'Booking...' : 'Book & Dispatch Reminder'}
          </button>
        </div>
      </form>
    </div>
  );
};
