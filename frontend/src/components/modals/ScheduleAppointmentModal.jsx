// src/components/modals/ScheduleAppointmentModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { mockAppointmentService } from '../../services/mock/mockAppointmentService';
import { mockPatientService } from '../../services/mock/mockPatientService';
import { mockCaseService } from '../../services/mock/mockCaseService';
import { INITIAL_PROVIDER_CONFIGS } from '../../constants/providerConfigs';
import { createDefaultServiceLine } from '../../constants/servicesCatalog';
import { MultiLineCptTable } from '../common/MultiLineCptTable';
import { isClinicClosed } from '../../constants/usHolidays';
import { useUIStore } from '../../store/uiStore';
import { Calendar, Clock, User, Save, AlertCircle, Phone, Stethoscope } from 'lucide-react';

const inputCls = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

export const ScheduleAppointmentModal = ({
  isOpen,
  onClose,
  onAppointmentBooked,
  prefillPatientId = '',
  prefillPatientName = '',
  prefillPhone = '',
  prefillCaseId = ''
}) => {
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [cases, setCases] = useState([]);

  const [serviceLines, setServiceLines] = useState([
    createDefaultServiceLine(1, '99204', 'Initial Comprehensive Pain Management Consultation', 450.00),
    createDefaultServiceLine(2, '97039', 'High Intensity Laser Therapy (HILT)', 250.00)
  ]);

  const [formData, setFormData] = useState({
    patientId: prefillPatientId || 'pat-001',
    patientName: prefillPatientName || '',
    patientPhone: prefillPhone || '',
    caseId: prefillCaseId || '',
    providerId: 'prov-josmic',
    visitType: 'INITIAL',
    appointmentType: 'Pain Consult',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    duration: '60',
    reasonForVisit: 'Post-MVA pain management & clinical evaluation',
    reminderPreference: 'SMS',
    holidayOverride: false,
  });

  // Load patients and cases
  useEffect(() => {
    if (isOpen) {
      mockPatientService.getPatients().then(res => {
        if (res && res.length > 0) {
          setPatients(res);
          if (!prefillPatientName) {
            const found = res.find(p => p.id === prefillPatientId) || res[0];
            setFormData(prev => ({
              ...prev,
              patientId: found.id,
              patientName: `${found.firstName} ${found.lastName}`.trim(),
              patientPhone: found.phone || found.mobilePhone || prev.patientPhone
            }));
          }
        }
      }).catch(() => {});

      mockCaseService.getCases().then(res => {
        if (res && res.length > 0) {
          setCases(res);
          if (!prefillCaseId) {
            setFormData(prev => ({
              ...prev,
              caseId: res[0].caseId || res[0].id
            }));
          }
        }
      }).catch(() => {});
    }
  }, [isOpen, prefillPatientId, prefillPatientName, prefillPhone, prefillCaseId]);

  const set = (field, val) => setFormData(p => ({ ...p, [field]: val }));

  const closedCheck = isClinicClosed(formData.date);

  const handlePatientSelect = (pId) => {
    const p = patients.find(x => x.id === pId);
    if (p) {
      setFormData(prev => ({
        ...prev,
        patientId: p.id,
        patientName: `${p.firstName} ${p.lastName}`.trim(),
        patientPhone: p.phone || p.mobilePhone || ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      addToast(`Appointment scheduled for ${created.patientName}!`, 'success');
      if (onAppointmentBooked) onAppointmentBooked(created);
      onClose();
    } catch {
      addToast('Failed to schedule appointment', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Patient Visit"
      subtitle="Select practice provider, appointment time & multi-code CPT billing lines"
      icon={Calendar}
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
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> {isLoading ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dynamic Patient & Linked Case Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Select Patient *</label>
            {patients.length > 0 ? (
              <select
                value={formData.patientId}
                onChange={e => handlePatientSelect(e.target.value)}
                className={inputCls}
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} ({p.patientId || p.mrn || p.id})
                  </option>
                ))}
              </select>
            ) : (
              <input required className={inputCls} value={formData.patientName} onChange={e => set('patientName', e.target.value)} placeholder="Patient Name" />
            )}
          </div>

          <div>
            <label className={labelCls}>Patient Mobile (for SMS Reminders)</label>
            <input type="tel" className={inputCls} value={formData.patientPhone} onChange={e => set('patientPhone', e.target.value)} placeholder="713-555-0100" />
          </div>

          <div>
            <label className={labelCls}>Linked Accident Case</label>
            {cases.length > 0 ? (
              <select
                value={formData.caseId}
                onChange={e => set('caseId', e.target.value)}
                className={inputCls}
              >
                <option value="">-- No Case / General Visit --</option>
                {cases.map(c => (
                  <option key={c.id} value={c.caseId || c.id}>
                    {c.caseId || c.id} â€” {c.patientName}
                  </option>
                ))}
              </select>
            ) : (
              <input className={inputCls} value={formData.caseId} onChange={e => set('caseId', e.target.value)} placeholder="CASE-2025-1227" />
            )}
          </div>
        </div>

        {/* Provider & Encounter Type Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Select Practice Care Provider *</label>
            <select
              value={formData.providerId}
              onChange={e => {
                const pid = e.target.value;
                let aptType = 'Pain Consult';
                if (pid === 'prov-davs') { aptType = 'ESWT Shockwave Session 1'; }
                if (pid === 'prov-anik') { aptType = 'Laser Therapy Session 1'; }
                if (pid === 'prov-counselor') { aptType = 'Counseling Psychotherapy (45m)'; }
                setFormData(p => ({ ...p, providerId: pid, appointmentType: aptType }));
              }}
              className={inputCls}
            >
              <option value="prov-josmic">JOSMIC Wellness Center (Pain Management)</option>
              <option value="prov-davs">DAV'S Anatomy (Shockwave ESWT)</option>
              <option value="prov-anik">ANIK Laser Therapy (Laser Session)</option>
              <option value="prov-counselor">Counselor Practice (Behavioral Health &amp; PTSD)</option>
            </select>
          </div>

          <div>
            <label className={labelCls}>Encounter Type *</label>
            <select
              value={formData.visitType}
              onChange={e => {
                const val = e.target.value;
                set('visitType', val);
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
              className={`${inputCls} font-bold text-teal-800 bg-teal-50/40`}
            >
              <option value="INITIAL">Initial Visit (New Patient E&amp;M)</option>
              <option value="SUBSEQUENT">Subsequent / Follow-up Visit (Established E&amp;M)</option>
            </select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Visit Date *</label>
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
            </select>
          </div>
        </div>

        {/* Multi-Line CPT & Modifiers Table */}
        <div className="pt-2">
          <MultiLineCptTable
            lines={serviceLines}
            onChange={setServiceLines}
            title="Service CPT Billing Lines (Line 1, 2, 3... & Modifiers)"
          />
        </div>

        {/* Weekend / Holiday Alert Banner */}
        {closedCheck.isClosed && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <span>{closedCheck.isWeekend ? 'ðŸ“…' : 'ðŸ‡ºðŸ‡¸'}</span>
              <span>Clinic Closed: {closedCheck.reason}</span>
            </div>
            <p className="text-[11px] text-amber-800">
              {closedCheck.isWeekend
                ? 'Routine clinic visits are not scheduled on Saturdays and Sundays. Please select a Mondayâ€“Friday date or toggle Admin Override.'
                : 'Routine appointments are suspended for this US Federal Holiday.'}
            </p>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950 pt-1">
              <input
                type="checkbox"
                checked={formData.holidayOverride}
                onChange={e => set('holidayOverride', e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              Admin Override: Authorize Weekend / Emergency Visit
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
            placeholder="Clinical chief complaint and visit goals"
          />
        </div>
      </form>
    </Modal>
  );
};
