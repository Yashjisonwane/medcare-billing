// src/components/modals/EditAppointmentModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { mockAppointmentService } from '../../services/mock/mockAppointmentService';
import { INITIAL_PROVIDER_CONFIGS } from '../../constants/providerConfigs';
import { createDefaultServiceLine } from '../../constants/servicesCatalog';
import { MultiLineCptTable } from '../common/MultiLineCptTable';
import { isClinicClosed } from '../../constants/usHolidays';
import { useUIStore } from '../../store/uiStore';
import { Edit3, Calendar, Clock, Save, User, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

const inputCls = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

export const EditAppointmentModal = ({ isOpen, onClose, appointment, onAppointmentUpdated }) => {
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientDob: '',
    caseId: '',
    providerId: 'prov-josmic',
    visitType: 'INITIAL',
    appointmentType: '',
    status: 'SCHEDULED',
    date: '',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    duration: '60',
    reasonForVisit: '',
    location: '',
    visitNotes: '',
    holidayOverride: false
  });

  const [serviceLines, setServiceLines] = useState([]);

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientName: appointment.patientName || '',
        patientPhone: appointment.patientPhone || '',
        patientDob: appointment.patientDob || '',
        caseId: appointment.caseId || appointment.caseRef || '',
        providerId: appointment.providerId || 'prov-josmic',
        visitType: appointment.visitType || (appointment.appointmentType?.toLowerCase().includes('follow') || appointment.cptCode?.includes('9921') ? 'SUBSEQUENT' : 'INITIAL'),
        appointmentType: appointment.appointmentType || 'Pain Consult',
        status: appointment.status || 'SCHEDULED',
        date: appointment.date || '',
        startTime: appointment.startTime || '09:00 AM',
        endTime: appointment.endTime || '10:00 AM',
        duration: appointment.duration || '60',
        reasonForVisit: appointment.reasonForVisit || '',
        location: appointment.location || 'Suite 774 Main Clinic',
        visitNotes: appointment.visitNotes || '',
        holidayOverride: !!appointment.holidayOverride
      });

      if (appointment.serviceLines && appointment.serviceLines.length > 0) {
        setServiceLines(appointment.serviceLines);
      } else {
        // Build initial line from existing single CPT code
        const initialCpt = appointment.cptCode || '99204';
        const fee = initialCpt === '99204' ? 450.00 : initialCpt === '97039' ? 250.00 : 275.00;
        setServiceLines([
          createDefaultServiceLine(1, initialCpt, appointment.appointmentType || 'Clinical Consult', fee)
        ]);
      }
    }
  }, [appointment]);

  if (!appointment) return null;

  const set = (field, val) => setFormData(p => ({ ...p, [field]: val }));
  const closedCheck = isClinicClosed(formData.date);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (closedCheck.isClosed && !formData.holidayOverride) {
      addToast(`${closedCheck.reason}. Please enable Admin Override to reschedule on a weekend/holiday.`, 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const selectedProv = Object.values(INITIAL_PROVIDER_CONFIGS).find(p => p.id === formData.providerId);
      const totalEstimatedCharge = serviceLines.reduce((sum, l) => sum + ((parseFloat(l.units) || 1) * (parseFloat(l.charge) || 0)), 0);
      
      const updated = await mockAppointmentService.updateAppointment(appointment.id, {
        ...formData,
        serviceLines,
        totalEstimatedCharge,
        providerName: selectedProv?.name || appointment.providerName || 'JOSMIC Wellness Center'
      });

      addToast(`Appointment for ${updated.patientName} updated successfully!`, 'success');
      if (onAppointmentUpdated) onAppointmentUpdated(updated);
      onClose();
    } catch {
      addToast('Failed to update appointment', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEncounterTypeChange = (newType) => {
    set('visitType', newType);
    if (newType === 'SUBSEQUENT') {
      set('appointmentType', 'Subsequent Follow-up & Evaluation');
      setServiceLines([
        createDefaultServiceLine(1, '99214', 'Office/Outpatient Visit Established Moderate (30-39 min)', 275.00),
        createDefaultServiceLine(2, '97110', 'Therapeutic Exercise (15 min)', 110.00)
      ]);
    } else {
      set('appointmentType', 'Initial Comprehensive Consultation');
      setServiceLines([
        createDefaultServiceLine(1, '99204', 'Office/Outpatient Visit New Complex (45-59 min)', 450.00),
        createDefaultServiceLine(2, '97039', 'High Intensity Laser Therapy (HILT)', 250.00)
      ]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit & Reschedule Appointment"
      subtitle={`Ref: ${appointment.bookingRef || appointment.id} | ${appointment.patientName}`}
      icon={Edit3}
      size="xl"
      iconColor="text-teal-600"
      iconBg="bg-teal-50"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> {isLoading ? 'Saving Changes...' : 'Save & Update Appointment'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Visit Type Switch (Initial vs Subsequent) Banner */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-300 block">Encounter Classification</span>
            <span className="text-sm font-bold">
              {formData.visitType === 'INITIAL' ? 'Initial Patient Visit (New E&M)' : 'Subsequent Visit (Follow-up / Established)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleEncounterTypeChange('INITIAL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                formData.visitType === 'INITIAL'
                  ? 'bg-teal-500 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Set as Initial Visit
            </button>
            <button
              type="button"
              onClick={() => handleEncounterTypeChange('SUBSEQUENT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                formData.visitType === 'SUBSEQUENT'
                  ? 'bg-teal-500 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Change to Subsequent (Follow-up)
            </button>
          </div>
        </div>

        {/* Patient & Case Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Patient Name *</label>
            <input required className={inputCls} value={formData.patientName} onChange={e => set('patientName', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Patient Phone</label>
            <input type="tel" className={inputCls} value={formData.patientPhone} onChange={e => set('patientPhone', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Linked Case Ref</label>
            <input className={inputCls} value={formData.caseId} onChange={e => set('caseId', e.target.value)} />
          </div>
        </div>

        {/* Provider & Visit Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Practice Provider</label>
            <select
              value={formData.providerId}
              onChange={e => set('providerId', e.target.value)}
              className={inputCls}
            >
              <option value="prov-josmic">JOSMIC Wellness Center (Pain Management)</option>
              <option value="prov-davs">DAV'S Anatomy (Shockwave ESWT)</option>
              <option value="prov-anik">ANIK Laser Therapy (Laser Session)</option>
              <option value="prov-counselor">Counselor Practice (Behavioral Health &amp; PTSD)</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Service Description</label>
            <input
              type="text"
              className={inputCls}
              value={formData.appointmentType}
              onChange={e => set('appointmentType', e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Visit Status</label>
            <select
              value={formData.status}
              onChange={e => set('status', e.target.value)}
              className={`${inputCls} font-bold text-teal-800`}
            >
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked-In</option>
              <option value="COMPLETED">Completed</option>
              <option value="RESCHEDULED">Rescheduled</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Date & Time Reschedule */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Appointment Date *</label>
            <input
              type="date"
              required
              className={inputCls}
              value={formData.date}
              onChange={e => set('date', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Start Time *</label>
            <select className={inputCls} value={formData.startTime} onChange={e => set('startTime', e.target.value)}>
              <option value="08:30 AM">08:30 AM</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="09:30 AM">09:30 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="10:30 AM">10:30 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Clinic Location / Suite</label>
            <input className={inputCls} value={formData.location} onChange={e => set('location', e.target.value)} />
          </div>
        </div>

        {/* Multi-Line CPT & Modifiers Section */}
        <div className="pt-2">
          <MultiLineCptTable
            lines={serviceLines}
            onChange={setServiceLines}
            title="Appointment CPT Billing Lines & Modifiers (Line 1, 2, 3...)"
          />
        </div>

        {/* Weekend / Holiday Alert Banner */}
        {closedCheck.isClosed && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <span>{closedCheck.isWeekend ? '📅' : '🇺🇸'}</span>
              <span>Clinic Closed: {closedCheck.reason}</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950 pt-1">
              <input
                type="checkbox"
                checked={formData.holidayOverride}
                onChange={e => set('holidayOverride', e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              Admin Override: Authorize Weekend / Holiday Appointment
            </label>
          </div>
        )}

        <div>
          <label className={labelCls}>Reason for Visit &amp; Clinical Notes</label>
          <textarea
            rows={2}
            className={inputCls}
            value={formData.reasonForVisit}
            onChange={e => set('reasonForVisit', e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};
