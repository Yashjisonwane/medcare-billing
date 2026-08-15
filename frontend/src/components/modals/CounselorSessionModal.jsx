// src/components/modals/CounselorSessionModal.jsx
import React, { useState } from 'react';
import { Modal } from './Modal';
import { mockClinicalNoteService } from '../../services/mock/mockClinicalNoteService';
import { useUIStore } from '../../store/uiStore';
import { Brain, Save, CheckCircle2, Stethoscope, Tag, Clock } from 'lucide-react';

const inputCls = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

const COMMON_DIAGNOSES = [
  { code: 'F43.10', label: 'PTSD / Vehicular Trauma' },
  { code: 'F41.1', label: 'Generalized Anxiety Disorder' },
  { code: 'F32.9', label: 'Major Depressive Disorder' },
  { code: 'M54.50', label: 'Low back pain (Somatic coping)' },
];

export const CounselorSessionModal = ({ isOpen, onClose, onNoteSaved }) => {
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientName: 'Demo Patient 001 (SAMPLE TESTING)',
    caseId: 'CASE-2025-1227',
    counselorName: 'Jordan Miller, LCSW, BCD',
    sessionDate: '2026-08-10',
    cptCode: '90834',
    diagnosisCodes: ['F43.10', 'F41.1', 'M54.50'],
    summary: 'Patient presented for 45-minute individual psychotherapy session. Discussed anxiety triggers during vehicular passenger travel. Demonstrated mastery of diaphragmatic breathing and cognitive reframing techniques.'
  });

  const handleToggleDiagnosis = (code) => {
    setFormData(prev => {
      const exists = prev.diagnosisCodes.includes(code);
      return {
        ...prev,
        diagnosisCodes: exists
          ? prev.diagnosisCodes.filter(c => c !== code)
          : [...prev.diagnosisCodes, code]
      };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const created = await mockClinicalNoteService.createNote({
        patientId: 'pat-001',
        patientName: formData.patientName,
        caseId: formData.caseId,
        providerId: 'prov-counselor',
        providerName: 'Counselor Practice (Hope Behavioral Health)',
        type: 'COUNSELOR_GENERIC',
        title: `Counseling Progress Note (${formData.cptCode}) — ${formData.sessionDate}`,
        author: formData.counselorName,
        content: { ...formData, isSigned: true }
      });
      addToast('Counselor session note saved and linked to bill #1024-C!', 'success');
      if (onNoteSaved) onNoteSaved(created);
      onClose();
    } catch {
      addToast('Failed to save session note', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Behavioral Health Progress Note"
      subtitle="Document psychotherapy session, ICD-10 diagnostic codes &amp; CBT progress"
      icon={Brain}
      size="xl"
      iconColor="text-indigo-600"
      iconBg="bg-indigo-50"
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
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> {isLoading ? 'Saving...' : 'Save & Link to Bill'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Patient Name</label>
            <input className={inputCls} value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Session Date</label>
            <input type="date" required className={inputCls} value={formData.sessionDate} onChange={e => setFormData({ ...formData, sessionDate: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>CPT Procedure Code</label>
            <select className={inputCls} value={formData.cptCode} onChange={e => setFormData({ ...formData, cptCode: e.target.value })}>
              <option value="90791">90791 - Psychiatric Diagnostic Evaluation ($350)</option>
              <option value="90834">90834 - Psychotherapy, 45 min ($180)</option>
              <option value="90837">90837 - Psychotherapy, 60 min ($250)</option>
            </select>
          </div>
        </div>

        {/* Diagnostic Codes */}
        <div>
          <label className={labelCls}>ICD-10 Diagnostic Codes (Box 21)</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COMMON_DIAGNOSES.map(item => {
              const active = formData.diagnosisCodes.includes(item.code);
              return (
                <button
                  type="button"
                  key={item.code}
                  onClick={() => handleToggleDiagnosis(item.code)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    active ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="block text-[10px] text-indigo-600 font-bold">{item.code}</span>
                  <span className="truncate block mt-0.5">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className={labelCls}>Clinical Narrative &amp; Interventions</label>
          <textarea
            rows={4}
            className={inputCls}
            value={formData.summary}
            onChange={e => setFormData({ ...formData, summary: e.target.value })}
          />
        </div>
      </form>
    </Modal>
  );
};
