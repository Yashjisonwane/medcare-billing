// src/components/modals/AppointmentDetailsModal.jsx
import React from 'react';
import { Modal } from './Modal';
import { Calendar, Clock, User, Phone, MapPin, CheckCircle2, AlertCircle, Edit3, Tag, FileText, DollarSign, Shield, Stethoscope } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { formatCurrency } from '../../utils/billingCalculations';
import { formatStatus } from '../../utils/formatters';

export const AppointmentDetailsModal = ({ isOpen, onClose, appointment, onStatusUpdated, onEditAppointment }) => {
  const { addToast } = useUIStore();

  if (!appointment) return null;

  const handleUpdateStatus = (newStatus) => {
    addToast(`Appointment status updated to ${newStatus}!`, 'success');
    if (onStatusUpdated) onStatusUpdated({ ...appointment, status: newStatus });
    onClose();
  };

  const isInitial = appointment.visitType === 'INITIAL' || (!appointment.visitType && appointment.cptCode?.includes('99204'));

  // Calculate total charges from lines if available
  const totalCharges = appointment.serviceLines?.reduce((sum, l) => {
    const units = parseFloat(l.units) || 1;
    const charge = parseFloat(l.charge) || 0;
    return sum + (units * charge);
  }, 0) || parseFloat(appointment.totalEstimatedCharge) || 700.00;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details & Check-In"
      subtitle={`Booking Ref: ${appointment.bookingRef || appointment.id} | ${appointment.patientName}`}
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
            Close
          </button>
          {onEditAppointment && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditAppointment(appointment);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-teal-400" /> Edit / Reschedule Visit
            </button>
          )}
          <button
            type="button"
            onClick={() => handleUpdateStatus('CHECKED_IN')}
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" /> Check-In Patient
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Patient & Case Summary Banner */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white">{appointment.patientName}</h3>
              {appointment.patientPhone && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {appointment.patientPhone}
                </span>
              )}
              {appointment.caseId && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
                  {appointment.caseId}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Encounter: <strong className="text-white">{isInitial ? 'Initial Visit (New Patient E&M)' : 'Subsequent Follow-up'}</strong> | Channel: <strong className="text-slate-300">{appointment.bookingChannel || 'Staff Portal'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold text-xs">
              {formatStatus(appointment.status || 'SCHEDULED')}
            </span>
          </div>
        </div>

        {/* Schedule & Provider Key Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Date & Time</span>
            <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" /> {appointment.date}
            </p>
            <p className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" /> {appointment.startTime} - {appointment.endTime || '09:30 AM'}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Practice Care Provider</span>
            <p className="font-bold text-teal-800 text-xs flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" /> {appointment.providerName || 'JOSMIC Wellness Center'}
            </p>
            <p className="text-[10px] text-slate-500">
              Location: {appointment.location || 'Suite 774 Main Clinic'}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Estimated Billing</span>
            <p className="font-extrabold text-emerald-700 text-sm font-mono flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> ${totalCharges.toFixed(2)}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              CPT: {appointment.cptCode || '99204'}
            </p>
          </div>
        </div>

        {/* Multi-Line Service & CPT Billing Items Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Tag className="w-3.5 h-3.5 text-teal-600" />
              <span>Service CPT Billing Lines &amp; Modifiers</span>
            </div>
            <span className="px-2 py-0.5 bg-teal-50 text-teal-700 font-bold rounded-full text-[10px] border border-teal-200 font-mono">
              {appointment.serviceLines?.length || 2} Lines
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-100">
                  <th className="py-2 px-3 text-center w-8">#</th>
                  <th className="py-2 px-3 min-w-[100px]">CPT Code</th>
                  <th className="py-2 px-3 min-w-[180px]">Description</th>
                  <th className="py-2 px-2 text-center">Mod 1</th>
                  <th className="py-2 px-2 text-center">Mod 2</th>
                  <th className="py-2 px-2 text-center">Mod 3</th>
                  <th className="py-2 px-2 text-center">Mod 4</th>
                  <th className="py-2 px-2 text-center">Diag Ptr</th>
                  <th className="py-2 px-2 text-center">Units</th>
                  <th className="py-2 px-3 text-right">Fee ($)</th>
                  <th className="py-2 px-3 text-right">Total ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointment.serviceLines && appointment.serviceLines.length > 0 ? (
                  appointment.serviceLines.map((line, i) => (
                    <tr key={i} className="hover:bg-slate-50/60">
                      <td className="py-2 px-3 text-center font-bold text-slate-400">{i + 1}</td>
                      <td className="py-2 px-3 font-mono font-bold text-teal-700">{line.cptCode}</td>
                      <td className="py-2 px-3 text-slate-800">{line.description}</td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">{line.modifier1 || '--'}</td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">{line.modifier2 || '--'}</td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">{line.modifier3 || '--'}</td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">{line.modifier4 || '--'}</td>
                      <td className="py-2 px-2 text-center font-bold text-slate-600">{line.diagnosisPointer || 'Ptr A'}</td>
                      <td className="py-2 px-2 text-center font-bold text-slate-800">{line.units || 1}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-700">${parseFloat(line.charge || 0).toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                        ${((parseFloat(line.units) || 1) * (parseFloat(line.charge) || 0)).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-3 text-center font-bold text-slate-400">1</td>
                      <td className="py-2 px-3 font-mono font-bold text-teal-700">99204</td>
                      <td className="py-2 px-3 text-slate-800">Initial Comprehensive Pain Management Consultation</td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">25</td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">59</td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">RT</td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">GP</td>
                      <td className="py-2 px-2 text-center font-bold text-slate-600">Ptr A</td>
                      <td className="py-2 px-2 text-center font-bold text-slate-800">1</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-700">$450.00</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">$450.00</td>
                    </tr>
                    <tr className="hover:bg-slate-50/60">
                      <td className="py-2 px-3 text-center font-bold text-slate-400">2</td>
                      <td className="py-2 px-3 font-mono font-bold text-teal-700">97039</td>
                      <td className="py-2 px-3 text-slate-800">High Intensity Laser Therapy (HILT)</td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">25</td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">59</td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">RT</td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">GP</td>
                      <td className="py-2 px-2 text-center font-bold text-slate-600">Ptr A</td>
                      <td className="py-2 px-2 text-center font-bold text-slate-800">1</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-700">$250.00</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">$250.00</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Total Calculated Estimate:</span>
            <span className="font-extrabold font-mono text-teal-700 text-sm">${totalCharges.toFixed(2)}</span>
          </div>
        </div>

        {/* Reason for Visit & Clinical Notes */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
          <span className="font-bold text-slate-900 block flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-teal-600" /> Reason for Visit &amp; Clinical Notes
          </span>
          <p className="text-slate-700 text-xs leading-relaxed">
            {appointment.reasonForVisit || appointment.visitNotes || 'Post-MVA pain management & comprehensive clinical evaluation.'}
          </p>
        </div>

        {/* Reminder Notification Log */}
        <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-200 text-teal-950 flex items-center justify-between flex-wrap gap-2">
          <span className="font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" /> Automated SMS Reminders:
          </span>
          <span className="text-teal-800 text-[11px] font-mono">
            {appointment.reminderStatus || 'Automated SMS Queued to Patient'} ({appointment.patientPhone || '713-555-0199'})
          </span>
        </div>
      </div>
    </Modal>
  );
};
