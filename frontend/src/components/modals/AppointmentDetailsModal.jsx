// src/components/modals/AppointmentDetailsModal.jsx
import React from 'react';
import { Modal } from './Modal';
import { Calendar, Clock, User, Phone, MapPin, CheckCircle2, AlertCircle, Edit3, Tag } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export const AppointmentDetailsModal = ({ isOpen, onClose, appointment, onStatusUpdated, onEditAppointment }) => {
  const { addToast } = useUIStore();

  if (!appointment) return null;

  const handleUpdateStatus = (newStatus) => {
    addToast(`Appointment status updated to ${newStatus}!`, 'success');
    if (onStatusUpdated) onStatusUpdated({ ...appointment, status: newStatus });
    onClose();
  };

  const isInitial = appointment.visitType === 'INITIAL' || (!appointment.visitType && appointment.cptCode?.includes('99204'));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details &amp; Check-In"
      subtitle={`Ref: ${appointment.bookingRef || appointment.id} | ${appointment.patientName}`}
      icon={Calendar}
      size="lg"
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
              <Edit3 className="w-3.5 h-3.5 text-teal-400" /> Edit / Reschedule
            </button>
          )}
          <button
            type="button"
            onClick={() => handleUpdateStatus('CHECKED_IN')}
            className="w-full sm:w-auto px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" /> Check-In Patient
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Status & Encounter Strip */}
        <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient Name</span>
            <strong className="text-white text-sm">{appointment.patientName}</strong>
          </div>
          <div className="text-right flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wider ${
              isInitial ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
            }`}>
              {isInitial ? 'Initial Visit' : 'Subsequent Visit'}
            </span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-bold text-[10px]">
              {appointment.status || 'SCHEDULED'}
            </span>
          </div>
        </div>

        {/* Schedule & Provider Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">Date &amp; Timing</span>
            <div className="flex justify-between"><span>Date:</span><strong>{appointment.date}</strong></div>
            <div className="flex justify-between"><span>Time:</span><strong>{appointment.startTime}</strong></div>
            <div className="flex justify-between"><span>Location:</span><span>{appointment.location || 'Suite 774 Main Clinic'}</span></div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">Provider &amp; Procedure</span>
            <div className="flex justify-between"><span>Provider:</span><strong>{appointment.providerName || 'JOSMIC'}</strong></div>
            <div className="flex justify-between"><span>Service:</span><strong>{appointment.appointmentType || 'Pain Consult'}</strong></div>
            <div className="flex justify-between"><span>CPT Code(s):</span><span className="font-mono font-bold text-teal-700">{appointment.cptCode || '99204'}</span></div>
          </div>
        </div>

        {/* Service Lines Breakdown if present */}
        {appointment.serviceLines && appointment.serviceLines.length > 0 && (
          <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Tag className="w-3.5 h-3.5 text-teal-600" />
              <span>Linked CPT Billing Items ({appointment.serviceLines.length})</span>
            </div>
            <div className="divide-y divide-slate-100 text-[11px]">
              {appointment.serviceLines.map((line, i) => (
                <div key={i} className="py-1.5 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-teal-700 mr-2">{line.cptCode}</span>
                    <span className="text-slate-700">{line.description}</span>
                    {line.modifier1 && (
                      <span className="ml-1 px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded text-[10px] font-mono">
                        Mod: {[line.modifier1, line.modifier2, line.modifier3, line.modifier4].filter(Boolean).join('-')}
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    ${((parseFloat(line.units) || 1) * (parseFloat(line.charge) || 0)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reminder Notification Log */}
        <div className="bg-teal-50/50 p-3.5 rounded-2xl border border-teal-200 text-teal-950 space-y-1">
          <span className="font-bold block flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" /> Automated Reminder Status
          </span>
          <p className="text-[11px] text-teal-800">
            SMS Status: <strong>{appointment.reminderStatus || 'Automated SMS Queued'}</strong> | Recipient: {appointment.patientPhone || '713-555-0100'}
          </p>
        </div>
      </div>
    </Modal>
  );
};

