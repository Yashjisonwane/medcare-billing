// src/pages/clinical/CounselorSessionPage.jsx
import React, { useState } from 'react';
import { mockClinicalNoteService } from '../../services/mock/mockClinicalNoteService';
import { useUIStore } from '../../store/uiStore';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, HeartPulse, Brain, FileText, CheckCircle2, 
  Stethoscope, ShieldAlert, Sparkles, Tag, Clock, User
} from 'lucide-react';

const COMMON_DIAGNOSES = [
  { code: 'F43.10', label: 'Post-Traumatic Stress Disorder (PTSD), unspecified' },
  { code: 'F41.1', label: 'Generalized Anxiety Disorder (GAD)' },
  { code: 'F43.0', label: 'Acute Stress Reaction / Vehicular Trauma' },
  { code: 'F32.9', label: 'Major Depressive Disorder, single episode, unspecified' },
  { code: 'G89.21', label: 'Chronic pain due to vehicular trauma' },
  { code: 'M54.50', label: 'Low back pain, unspecified (Somatic correlation)' },
];

const CPT_CODES = [
  { code: '90791', label: 'Psychiatric Diagnostic Evaluation (Intake)', duration: '60 min', fee: '$350.00' },
  { code: '90834', label: 'Psychotherapy with patient, 45 minutes', duration: '45 min', fee: '$180.00' },
  { code: '90837', label: 'Psychotherapy with patient, 60 minutes', duration: '60 min', fee: '$250.00' },
  { code: '90847', label: 'Family Psychotherapy (conjoint psychotherapy)', duration: '50 min', fee: '$220.00' },
];

export const CounselorSessionPage = () => {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientId: 'pat-001',
    patientName: 'Demo Patient 001 (SAMPLE TESTING)',
    caseId: 'CASE-2025-1227',
    providerId: 'prov-counselor',
    providerName: 'Counselor Practice (Hope Behavioral Health)',
    counselorName: 'Jordan Miller, LCSW, BCD',
    counselorNpi: '1487965213',
    sessionDate: '2026-08-10',
    sessionTime: '10:00 AM',
    cptCode: '90834',
    duration: '45 min',
    sessionType: 'Individual Psychotherapy',
    modality: 'Cognitive Behavioral Therapy (CBT) & Somatic Desensitization',
    diagnosisCodes: ['F43.10', 'F41.1', 'M54.50'],
    customDiagnosis: '',
    
    // Mental Status Examination
    mse: {
      appearance: 'Neat & Appropriate',
      orientation: 'Alert & Oriented x4 (Person, Place, Time, Situation)',
      moodAffect: 'Anxious, constricted affect, congruent with post-MVA pain',
      speech: 'Normal rate and volume, clear tone',
      thoughtProcess: 'Linear, goal-directed, no psychosis',
      suicidalIdeation: 'Negative / Denies ideation, intent, or plan',
    },

    // Clinical Narrative
    chiefComplaint: 'Patient reports persistent vehicular travel anxiety, sleep disturbance, and elevated distress related to motor vehicle accident.',
    clinicalProgress: 'Patient demonstrated active participation in CBT cognitive reframing exercises. Explored trauma triggers related to passenger driving and chronic neck/back pain. Practiced diaphragmatic breathing and progressive muscle relaxation to reduce panic symptoms.',
    treatmentGoals: '1. Reduce vehicular anxiety score by 40% over next 4 sessions.\n2. Master self-regulation breathing techniques during travel.\n3. Improve sleep hygiene and pain-coping resilience.',
    homeworkAssigned: 'Daily 10-minute progressive relaxation log and driving anxiety thought journal.',
    lockOnSave: false
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

  const handleAddCustomDiagnosis = (e) => {
    e.preventDefault();
    if (!formData.customDiagnosis.trim()) return;
    const clean = formData.customDiagnosis.trim().toUpperCase();
    if (!formData.diagnosisCodes.includes(clean)) {
      setFormData(prev => ({
        ...prev,
        diagnosisCodes: [...prev.diagnosisCodes, clean],
        customDiagnosis: ''
      }));
      addToast(`Added ICD-10 code: ${clean}`, 'success');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const note = await mockClinicalNoteService.createNote({
        patientId: formData.patientId,
        patientName: formData.patientName,
        caseId: formData.caseId,
        providerId: formData.providerId,
        providerName: formData.providerName,
        type: 'COUNSELOR_GENERIC',
        title: `Counseling Progress Note (${formData.cptCode}) â€” ${formData.sessionDate}`,
        author: formData.counselorName,
        content: {
          ...formData,
          isSigned: true,
          signedDate: new Date().toISOString(),
          statementLinked: 'bill-counselor-001'
        }
      });
      addToast('Counselor Session Note saved and linked to 4-Bill Ledger successfully!', 'success');
      navigate('/clinical-notes');
    } catch (err) {
      addToast('Failed to save session note', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button onClick={() => navigate('/clinical-notes')} className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline mb-1">
            <ArrowLeft className="w-4 h-4" /> Back to Clinical Notes
          </button>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Behavioral Health & Counseling Progress Note</h1>
              <p className="text-xs text-slate-500">Document psychotherapy sessions, ICD-10/DSM-5 diagnostic codes, and treatment goals</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/billing/bills/bill-counselor-001')}
            className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition flex items-center gap-1.5"
          >
            <Tag className="w-3.5 h-3.5" /> View Counselor Bill Statement
          </button>
        </div>
      </div>

      {/* Patient & Provider Header Bar */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Patient Name & ID</span>
          <strong className="text-white text-sm">{formData.patientName}</strong>
          <p className="text-[11px] text-teal-300">Case: {formData.caseId}</p>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Rendering Provider</span>
          <strong className="text-white">{formData.counselorName}</strong>
          <p className="text-[11px] text-slate-400">NPI: {formData.counselorNpi}</p>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Session Modality</span>
          <span className="text-white font-semibold">{formData.modality}</span>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Active Billing Link</span>
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-bold text-[10px] inline-block mt-0.5">
            Linked to Bill #1024-C
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* 1. Session Coding & Service Configuration */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2.5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" /> 1. Session Timing & CPT Procedure Code
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Session Date</label>
              <input
                type="date"
                value={formData.sessionDate}
                onChange={e => setFormData(p => ({ ...p, sessionDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Session Time</label>
              <input
                type="text"
                value={formData.sessionTime}
                onChange={e => setFormData(p => ({ ...p, sessionTime: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Session CPT Procedure</label>
              <select
                value={formData.cptCode}
                onChange={e => {
                  const cpt = CPT_CODES.find(c => c.code === e.target.value);
                  setFormData(p => ({
                    ...p,
                    cptCode: e.target.value,
                    duration: cpt?.duration || '45 min'
                  }));
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-teal-700"
              >
                {CPT_CODES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} â€” {c.label} ({c.fee})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. ICD-10 & DSM-5 Diagnostic Codes */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-indigo-600" /> 2. ICD-10 &amp; DSM-5 Diagnostic Codes (Box 21)
              </h2>
              <p className="text-[11px] text-slate-500">Selected diagnoses flow directly into Counselor Bill statements and CMS-1500 claims</p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-500">Active ({formData.diagnosisCodes.length}):</span>
              {formData.diagnosisCodes.map(code => (
                <span key={code} className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-bold text-[11px] border border-indigo-200">
                  {code}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {COMMON_DIAGNOSES.map(item => {
              const active = formData.diagnosisCodes.includes(item.code);
              return (
                <button
                  type="button"
                  key={item.code}
                  onClick={() => handleToggleDiagnosis(item.code)}
                  className={`p-3 rounded-xl border text-left transition flex items-start justify-between gap-2 ${
                    active 
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-semibold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-800'}`}>
                        {item.code}
                      </span>
                    </div>
                    <p className="text-xs mt-1 text-slate-800">{item.label}</p>
                  </div>
                  {active && <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Add Custom ICD-10 Code Input */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Add Custom ICD-10 Code (e.g. F43.20, R45.82)"
              value={formData.customDiagnosis}
              onChange={e => setFormData(p => ({ ...p, customDiagnosis: e.target.value }))}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 uppercase font-bold"
            />
            <button
              type="button"
              onClick={handleAddCustomDiagnosis}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition"
            >
              Add Code
            </button>
          </div>
        </div>

        {/* 3. Mental Status Examination (MSE) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2.5 flex items-center gap-2">
            <Brain className="w-4 h-4 text-teal-600" /> 3. Mental Status Examination (MSE)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Appearance & Grooming</label>
              <input
                type="text"
                value={formData.mse.appearance}
                onChange={e => setFormData(p => ({ ...p, mse: { ...p.mse, appearance: e.target.value } }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Orientation & Alertness</label>
              <input
                type="text"
                value={formData.mse.orientation}
                onChange={e => setFormData(p => ({ ...p, mse: { ...p.mse, orientation: e.target.value } }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mood & Affect</label>
              <input
                type="text"
                value={formData.mse.moodAffect}
                onChange={e => setFormData(p => ({ ...p, mse: { ...p.mse, moodAffect: e.target.value } }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Speech & Thought Process</label>
              <input
                type="text"
                value={formData.mse.speech}
                onChange={e => setFormData(p => ({ ...p, mse: { ...p.mse, speech: e.target.value } }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5 text-emerald-700">
                <ShieldAlert className="w-3.5 h-3.5" /> Risk Assessment & Suicidal / Homicidal Ideation
              </label>
              <input
                type="text"
                value={formData.mse.suicidalIdeation}
                onChange={e => setFormData(p => ({ ...p, mse: { ...p.mse, suicidalIdeation: e.target.value } }))}
                className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50/40 text-emerald-950 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* 4. Clinical Narrative & Progress Notes */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2.5 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" /> 4. Subjective & Objective Clinical Narrative
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Chief Complaint & Trauma Symptoms</label>
              <textarea
                rows={2}
                value={formData.chiefComplaint}
                onChange={e => setFormData(p => ({ ...p, chiefComplaint: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Session Interventions & Clinical Progress</label>
              <textarea
                rows={4}
                value={formData.clinicalProgress}
                onChange={e => setFormData(p => ({ ...p, clinicalProgress: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Treatment Goals / Measurable Milestones</label>
                <textarea
                  rows={3}
                  value={formData.treatmentGoals}
                  onChange={e => setFormData(p => ({ ...p, treatmentGoals: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 leading-relaxed font-mono text-[11px]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Homework & Patient Coping Instructions</label>
                <textarea
                  rows={3}
                  value={formData.homeworkAssigned}
                  onChange={e => setFormData(p => ({ ...p, homeworkAssigned: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">
              Electronically Signed by: <strong>{formData.counselorName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/clinical-notes')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {isLoading ? 'Saving Record...' : 'Save & Lock Clinical Note'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
