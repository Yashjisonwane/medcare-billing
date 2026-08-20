import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { apiClinicalNoteService } from '../../services/api/apiClinicalNoteService';
import { apiCaseService } from '../../services/api/apiCaseService';
import { mockCaseService } from '../../services/mock/mockCaseService';
import { apiProviderService } from '../../services/api/apiProviderService';
import { useUIStore } from '../../store/uiStore';
import { Brain, Save, CheckCircle2, Stethoscope, Tag, Clock } from 'lucide-react';

const inputCls = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

const COMMON_DIAGNOSES = [
  { code: 'F43.10', label: 'PTSD / Vehicular Trauma' },
  { code: 'F41.1', label: 'Generalized Anxiety Disorder' },
  { code: 'F32.9', label: 'Major Depressive Disorder' },
  { code: 'M54.50', label: 'Low back pain (Somatic coping)' },
  { code: 'S13.4', label: 'Cervical sprain / Whiplash' },
  { code: 'S33.5', label: 'Lumbar strain' }
];

const FULL_COUNSELING_CPT_CATALOG = [
  { code: '90791', description: 'Psychiatric Diagnostic Evaluation (Intake)', fee: '350.00' },
  { code: '90834', description: 'Individual Psychotherapy (45 Min)', fee: '180.00' },
  { code: '90837', description: 'Individual Psychotherapy (60 Min)', fee: '240.00' },
  { code: '90832', description: 'Individual Psychotherapy (30 Min)', fee: '120.00' },
  { code: '90847', description: 'Family Psychotherapy w/ Patient (50 Min)', fee: '220.00' },
  { code: '90853', description: 'Group Psychotherapy', fee: '95.00' }
];

export const CounselorSessionModal = ({ isOpen, onClose, onNoteSaved }) => {
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [cases, setCases] = useState([]);
  const [providerServices, setProviderServices] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Load live cases from backend DB first
      apiCaseService.getCases()
        .then(res => {
          if (res && res.length > 0) setCases(res);
          else return mockCaseService.getCases();
        })
        .then(res => {
          if (res) setCases(res);
        })
        .catch(() => {
          mockCaseService.getCases().then(setCases).catch(console.error);
        });

      apiProviderService.getProviders().then(provMap => {
        const counselor = provMap['prov-counselor'] || provMap['counselor'];
        if (counselor && Array.isArray(counselor.availableServices)) {
          setProviderServices(counselor.availableServices);
        }
      }).catch(console.error);
    }
  }, [isOpen]);

  const [formData, setFormData] = useState({
    caseId: '',
    counselorName: 'Jordan Miller, LCSW, BCD',
    sessionDate: new Date().toISOString().split('T')[0],
    cptCode: '90791',
    diagnosisCodes: [],
    summary: ''
  });

  const selectedCaseObj = cases.find(c => c.id === formData.caseId || c.caseId === formData.caseId);

  // Auto-extract ICD-10 diagnoses from linked case
  let rawDiagnoses = selectedCaseObj?.diagnoses || selectedCaseObj?.diagnosisCodes || [];
  if (typeof rawDiagnoses === 'string') {
    try { rawDiagnoses = JSON.parse(rawDiagnoses); } catch { rawDiagnoses = [rawDiagnoses]; }
  }

  const caseDiagnoses = Array.isArray(rawDiagnoses) && rawDiagnoses.length > 0
    ? rawDiagnoses.map(d => {
        if (typeof d === 'string') {
          const parts = d.split(' - ');
          return { code: parts[0]?.trim() || d, label: parts[1]?.trim() || d };
        }
        return { code: d.code || d.icdCode || d, label: d.label || d.description || d };
      })
    : COMMON_DIAGNOSES;

  // When selected case changes, pre-select its diagnosis codes
  useEffect(() => {
    if (selectedCaseObj) {
      const initialCodes = caseDiagnoses.map(d => d.code);
      setFormData(prev => ({
        ...prev,
        diagnosisCodes: initialCodes.length > 0 ? initialCodes : ['F43.10', 'F41.1']
      }));
    }
  }, [formData.caseId]);

  // Combine DB provider services with full catalog so all 6 Counseling CPT codes are available
  const activeServicesMap = new Map();
  FULL_COUNSELING_CPT_CATALOG.forEach(s => activeServicesMap.set(s.code, s));
  if (Array.isArray(providerServices)) {
    providerServices.forEach(s => {
      const code = s.code || s.cptCode;
      if (code) {
        activeServicesMap.set(code, {
          code,
          description: s.description || s.billingDescription || 'Psychotherapy Session',
          fee: s.fee || s.defaultCharge || s.price || '180.00'
        });
      }
    });
  }
  const activeServices = Array.from(activeServicesMap.values());

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
    if (!formData.caseId) {
      addToast('Please select a patient/case', 'error');
      return;
    }
    
    const selectedCase = cases.find(c => c.id === formData.caseId || c.caseId === formData.caseId);
    if (!selectedCase) return;

    setIsLoading(true);
    try {
      const created = await apiClinicalNoteService.createNote({
        patientId: selectedCase.patientId || selectedCase.patient?.id || 'pat-001',
        patientName: selectedCase.patientName || 'Accident Patient',
        caseId: selectedCase.id || selectedCase.caseId,
        providerId: 'prov-counselor',
        providerName: 'Counselor Practice (Hope Behavioral Health)',
        type: 'COUNSELOR_GENERIC',
        noteType: 'COUNSELOR_GENERIC',
        title: `Counseling Progress Note (${formData.cptCode || '90791'}) — ${formData.sessionDate}`,
        date: formData.sessionDate,
        status: 'SIGNED_LOCKED',
        author: formData.counselorName,
        content: { 
          ...formData, 
          patientName: selectedCase.patientName,
          cptCode: formData.cptCode,
          diagnosisCodes: formData.diagnosisCodes,
          isSigned: true 
        }
      });
      addToast('Clinical session note saved to database & linked to Provider Bills Ledger!', 'success');
      if (onNoteSaved) onNoteSaved(created);
      onClose();
    } catch (err) {
      console.error('Failed to save note:', err);
      addToast('Failed to save session note to database', 'error');
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
      size="lg"
      iconColor="text-indigo-600"
      iconBg="bg-indigo-50"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> {isLoading ? 'Saving to Database...' : 'Save & Link to Bill'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSave} className="space-y-4">
        {/* Patient / Case & Session Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Patient / Case *</label>
            <select 
              required
              className={inputCls} 
              value={formData.caseId} 
              onChange={e => setFormData({ ...formData, caseId: e.target.value })}
            >
              <option value="">-- Select Patient Case --</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.patientName || 'Accident Patient'} ({c.caseId || c.id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Session Date *</label>
            <input type="date" required className={inputCls} value={formData.sessionDate} onChange={e => setFormData({ ...formData, sessionDate: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>CPT Procedure Code *</label>
            <select required className={inputCls} value={formData.cptCode} onChange={e => setFormData({ ...formData, cptCode: e.target.value })}>
              <option value="">-- Select Procedure Code --</option>
              {activeServices.map(svc => {
                const code = svc.code || svc;
                const desc = svc.description ? ` - ${svc.description}` : '';
                const fee = svc.fee ? ` ($${svc.fee})` : '';
                return (
                  <option key={code} value={code}>
                    {code}{desc}{fee}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Diagnostic Codes */}
        <div>
          <label className={labelCls}>ICD-10 Diagnostic Codes (Box 21)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {caseDiagnoses.map(item => {
              const code = item.code || (typeof item === 'string' ? item.split(' - ')[0] : item);
              const label = item.label || (typeof item === 'string' && item.includes(' - ') ? item.split(' - ')[1] : item.description || '');
              const active = formData.diagnosisCodes.includes(code);
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleToggleDiagnosis(code)}
                  className={`p-2.5 rounded-xl border text-xs text-left transition flex items-center justify-between cursor-pointer ${
                    active ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-2xs' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="font-mono font-bold text-indigo-700 mr-2">{code}</span>
                    <span className="text-[11px] text-slate-600">{label}</span>
                  </div>
                  {active && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
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
