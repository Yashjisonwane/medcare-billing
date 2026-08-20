// src/pages/clinical/AiAssistantPage.jsx
import React, { useState, useEffect } from 'react';
import { apiClinicalNoteService } from '../../services/api/apiClinicalNoteService';
import { apiPatientService } from '../../services/api/apiPatientService';
import { apiCaseService } from '../../services/api/apiCaseService';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { ROLES } from '../../constants/rolePermissions';
import {
  Brain, Sparkles, AlertTriangle, ArrowLeft, Copy, Check,
  RefreshCw, ClipboardCheck, Lock, Clock, CheckCircle2,
  XCircle, Eye, Pen, ShieldCheck, UserCheck, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Initial empty drafts queue - only real generated drafts from database or Gemini
const INITIAL_DRAFTS = [];

const STATUS_CONFIG = {
  'Pending Review': { color: 'bg-amber-100 text-amber-700 border-amber-300', icon: Clock },
  'Approved': { color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: CheckCircle2 },
  'Rejected': { color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle },
  'Locked': { color: 'bg-slate-200 text-slate-600 border-slate-300', icon: Lock },
};

// Clinicians and Authorized Healthcare Providers in Practice
const CLINICIANS = [
  { id: 'usr-doc', name: 'Dr. Segun Adeoye', role: 'Doctor', title: 'Attending Physician (MD/DC)', providerId: 'prov-josmic', providerName: 'JOSMIC Wellness Center (Pain Management)' },
  { id: 'usr-cou', name: 'Jordan Miller', role: 'Counselor', title: 'Mental Health Counselor (LCSW, BCD)', providerId: 'prov-counselor', providerName: 'Counselor Practice (Hope Behavioral)' },
  { id: 'usr-the', name: 'Alex Rivera', role: 'Therapist', title: 'Lead Physical & Laser Therapist (PT)', providerId: 'prov-davs', providerName: "DAV'S Anatomy & ANIK Laser" },
];

export const AiAssistantPage = () => {
  const { currentUser } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();
  const isDoctor = currentUser?.role === ROLES.DOCTOR;

  // Registered Patients & Cases from Database
  const [patientsList, setPatientsList] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [casesList, setCasesList] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');

  // Assigned Target Doctor/Clinician
  const [selectedClinicianId, setSelectedClinicianId] = useState('usr-doc');

  // Draft Generation Inputs
  const [patientName, setPatientName] = useState('');
  const [complaints, setComplaints] = useState('');
  const [promptType, setPromptType] = useState('HPI');
  const [generatedDraft, setGeneratedDraft] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draftStatus, setDraftStatus] = useState('draft'); // draft | submitted

  // Edit / Formatted Toggle
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [editableDraftText, setEditableDraftText] = useState('');

  // Review Queue State
  const [drafts, setDrafts] = useState(INITIAL_DRAFTS);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [activeTab, setActiveTab] = useState('generate');
  const [doctorNotes, setDoctorNotes] = useState('');

  const currentClinician = CLINICIANS.find(c => c.id === selectedClinicianId) || CLINICIANS[0];

  useEffect(() => {
    // Load patients from database
    apiPatientService.getPatients().then(res => {
      const raw = Array.isArray(res) ? res : (res?.patients || []);
      if (raw && raw.length > 0) {
        setPatientsList(raw);
        const first = raw[0];
        setSelectedPatientId(first.id);
        setPatientName(`${first.firstName} ${first.lastName}`.trim());
        setComplaints(`Neck, shoulder and lumbar stiffness following collision on ${first.createdAt || 'recent date'}`);
      }
    }).catch(() => {});

    // Load cases from database
    apiCaseService.getCases().then(res => {
      const raw = Array.isArray(res) ? res : (res?.cases || []);
      if (raw && raw.length > 0) {
        setCasesList(raw);
      }
    }).catch(() => {});

    // Load real database drafts
    apiClinicalNoteService.getNotes().then(res => {
      const notes = Array.isArray(res) ? res : (res?.notes || []);
      const draftNotes = notes
        .filter(n => n.status === 'DRAFT' || n.status === 'UNSIGNED')
        .map(n => ({
          id: n.id,
          patient: n.patientName || `${n.patient?.firstName || ''} ${n.patient?.lastName || ''}`.trim() || 'Accident Patient',
          type: n.title || 'Clinical Evaluation Note',
          generatedAt: n.date || 'Database Draft',
          generatedBy: n.author || 'Clinical Staff',
          assignedDoctorName: n.author || 'Dr. Segun Adeoye',
          assignedDoctorTitle: 'Attending Physician',
          providerId: n.providerId,
          status: 'Pending Review',
          preview: n.soapSubjective ? `Subjective: ${n.soapSubjective}\n\nObjective: ${n.soapObjective}\n\nAssessment: ${n.soapAssessment}\n\nPlan: ${n.soapPlan}` : (n.content?.narrative || 'Clinical draft documentation.')
        }));
      if (draftNotes.length > 0) {
        setDrafts(draftNotes);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (generatedDraft?.draftText) {
      setEditableDraftText(generatedDraft.draftText);
    }
  }, [generatedDraft]);

  const handlePatientSelect = (patId) => {
    setSelectedPatientId(patId);
    if (!patId) return;
    const found = patientsList.find(p => p.id === patId || p.patientId === patId);
    if (found) {
      setPatientName(`${found.firstName} ${found.lastName}`.trim());
      setComplaints(`Neck, shoulder and lower back stiffness with reduced range of motion following motor vehicle collision.`);
      addToast(`Selected patient: ${found.firstName} ${found.lastName}`, 'info');
    }
  };

  const handleCaseSelect = (caseId) => {
    setSelectedCaseId(caseId);
    if (!caseId) return;
    const found = casesList.find(c => c.id === caseId || c.caseId === caseId);
    if (found) {
      setPatientName(found.patientName || 'Accident Patient');
      const desc = found.chiefComplaint || found.notes || `Neck and lower back pain following vehicle collision on ${found.accidentDate || 'recent accident'}`;
      setComplaints(desc);
      addToast(`Loaded accident records for ${found.patientName}!`, 'info');
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setDraftStatus('draft');
    try {
      const res = await apiClinicalNoteService.generateAiDraft(promptType, {
        patientName,
        complaints,
        painLocations: ['Neck', 'Lower Back', 'Left Ankle']
      });
      setGeneratedDraft(res);
      addToast('Live AI clinical draft generated with Google Gemini!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate AI draft', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitForReview = () => {
    const textToSubmit = editableDraftText || generatedDraft?.draftText;
    if (!textToSubmit) return;

    const newDraftItem = {
      id: `draft-${Date.now()}`,
      patient: patientName || 'Demo Patient 001',
      type: promptType === 'HPI' ? 'History of Present Illness (HPI)' : promptType === 'EXAM' ? 'Physical Exam Summary' : promptType === 'ASSESSMENT' ? 'Assessment & Plan' : 'Progress Narrative Summary',
      generatedAt: new Date().toLocaleString(),
      generatedBy: generatedDraft?.model || 'Google Gemini 2.5 Flash',
      assignedDoctorId: currentClinician.id,
      assignedDoctorName: currentClinician.name,
      assignedDoctorTitle: currentClinician.title,
      assignedProviderName: currentClinician.providerName,
      providerId: currentClinician.providerId,
      status: 'Pending Review',
      preview: textToSubmit
    };
    setDrafts(prev => [newDraftItem, ...prev]);
    setDraftStatus('submitted');
    addToast(`Draft submitted directly to ${currentClinician.name}'s review queue!`, 'info');
  };

  const handleCopy = () => {
    const textToCopy = editableDraftText || generatedDraft?.draftText;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      addToast('Draft copied to clipboard!', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApprove = async (draftId) => {
    const targetDraft = drafts.find(d => d.id === draftId);
    if (!targetDraft) return;

    const targetDocName = targetDraft.assignedDoctorName || currentUser?.name || 'Dr. Segun Adeoye';
    const targetProviderId = targetDraft.providerId || 'prov-josmic';
    const targetProviderName = targetDraft.assignedProviderName || 'JOSMIC Wellness Center (Pain Management)';

    try {
      // Save directly to live backend database clinical_notes table!
      await apiClinicalNoteService.createNote({
        patientId: 'pat-001',
        patientName: targetDraft.patient,
        caseId: 'case-001',
        providerId: targetProviderId,
        providerName: targetProviderName,
        type: 'AI_ASSISTED_SOAP',
        title: `AI Note: ${targetDraft.type} - ${new Date().toLocaleDateString()}`,
        author: targetDocName,
        signedBy: targetDocName,
        content: {
          narrative: targetDraft.preview,
          doctorNotes: doctorNotes,
          model: targetDraft.generatedBy,
          assignedDoctor: targetDocName,
          isSigned: true
        }
      });

      setDrafts(prev => prev.map(d => d.id === draftId ? { ...d, status: 'Approved' } : d));
      addToast(`Draft approved and locked to database by ${targetDocName}!`, 'success');
      setSelectedDraft(null);
      setDoctorNotes('');
    } catch (err) {
      console.error(err);
      addToast('Failed to save approved note to database', 'error');
    }
  };

  const handleReject = (draftId) => {
    setDrafts(prev => prev.map(d => d.id === draftId ? { ...d, status: 'Rejected' } : d));
    addToast('Draft rejected - returned for revision', 'error');
    setSelectedDraft(null);
    setDoctorNotes('');
  };

  const renderFormattedClinicalNote = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return (
      <div className="space-y-3 text-xs leading-relaxed text-slate-800">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1.5" />;

          // Main Section Header (e.g. **HISTORY OF PRESENT ILLNESS:** or **ASSESSMENT & PLAN**)
          if (trimmed.startsWith('**') && (trimmed.endsWith(':**') || trimmed.endsWith('**') || trimmed.includes('HISTORY') || trimmed.includes('ASSESSMENT') || trimmed.includes('PHYSICAL') || trimmed.includes('PLAN'))) {
            const cleanTitle = trimmed.replace(/\*\*/g, '').replace(/:$/, '');
            return (
              <div key={idx} className="pt-2 pb-1 border-b border-slate-200">
                <span className="px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-900 font-extrabold text-[11px] uppercase tracking-wider rounded-lg inline-block">
                  {cleanTitle}
                </span>
              </div>
            );
          }

          // Subheaders like **Right Shoulder Pain:** or **Cervical (Neck) Pain:**
          if (trimmed.startsWith('**') && trimmed.includes(':')) {
            const parts = trimmed.split(':');
            const subTitle = parts[0].replace(/\*\*/g, '');
            const rest = parts.slice(1).join(':').replace(/\*\*/g, '');
            return (
              <div key={idx} className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 mt-2 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 text-teal-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                  {subTitle}
                </h4>
                {rest && <p className="text-slate-700 font-normal pl-3">{rest}</p>}
              </div>
            );
          }

          // Bullet Points (e.g. * Location: or - Location:)
          if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
            const bulletContent = trimmed.substring(1).trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return (
              <div key={idx} className="flex items-start gap-2 pl-3">
                <span className="text-teal-600 font-bold mt-0.5">•</span>
                <span className="text-slate-700" dangerouslySetInnerHTML={{ __html: bulletContent }} />
              </div>
            );
          }

          // Normal Paragraph Text with inline bold tags
          const formattedPara = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
          return (
            <p key={idx} className="text-slate-700 font-normal" dangerouslySetInnerHTML={{ __html: formattedPara }} />
          );
        })}
      </div>
    );
  };

  const pendingCount = (drafts || []).filter(d => d.status === 'Pending Review').length;

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/clinical-notes')} className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to Clinical Registry
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-500" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">AI Doctor Note Assistant</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate AI-assisted clinical note drafts powered by Google Gemini 2.5 Flash for physician review
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-900 px-3.5 py-1.5 rounded-xl text-xs font-bold self-start sm:self-auto">
            <Clock className="w-4 h-4 text-amber-600" />
            {pendingCount} Draft{pendingCount > 1 ? 's' : ''} Awaiting Review
          </div>
        )}
      </div>

      {/* MANDATORY AI WARNING BANNER */}
      <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">Mandatory Clinical Review Notice</h3>
          <p className="text-xs mt-0.5 leading-relaxed text-emerald-800 font-medium">
            AI-generated content is a <strong>draft only</strong>. It must be reviewed, edited if needed, and approved by an authorized
            healthcare provider before becoming part of the official medical record.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-1">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2.5 text-xs font-bold transition border-b-2 cursor-pointer ${activeTab === 'generate' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <div className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Generate Draft</div>
        </button>
        <button
          onClick={() => setActiveTab('review')}
          className={`px-4 py-2.5 text-xs font-bold transition border-b-2 relative cursor-pointer ${activeTab === 'review' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <div className="flex items-center gap-1.5">
            <ClipboardCheck className="w-3.5 h-3.5" />
            Approved Notes / Review Queue
            {pendingCount > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">{pendingCount}</span>
            )}
          </div>
        </button>
      </div>

      {/* -- GENERATE TAB ------------------------------- */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Brain className="w-4 h-4 text-teal-600" /> Structured Clinical Input
            </h2>

            {/* Quick Patient & Case Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-teal-600" /> Select Registered Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={e => handlePatientSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-teal-50/40 text-slate-900 font-bold focus:bg-white focus:border-teal-600 outline-none transition cursor-pointer"
                >
                  <option value="">-- Choose Patient --</option>
                  {patientsList.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-teal-600" /> Select Accident Case
                </label>
                <select
                  value={selectedCaseId}
                  onChange={e => handleCaseSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:bg-white focus:border-teal-600 outline-none transition cursor-pointer"
                >
                  <option value="">-- Choose Legal Case --</option>
                  {casesList.map(c => (
                    <option key={c.id || c.caseId} value={c.id || c.caseId}>
                      {c.patientName || 'Accident Patient'} ({c.caseId || c.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Patient Name *</label>
              <input
                type="text"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                placeholder="e.g. John Smith"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:bg-white focus:border-teal-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chief Complaint &amp; Accident Context *</label>
              <textarea
                rows={3}
                value={complaints}
                onChange={e => setComplaints(e.target.value)}
                placeholder="e.g. Neck whiplash and lower back pain following rear-end collision..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium focus:bg-white focus:border-teal-600 outline-none transition"
              />
            </div>

            {/* Target Doctor Assignment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Assign Target Reviewing Doctor *
              </label>
              <select
                value={selectedClinicianId}
                onChange={e => setSelectedClinicianId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:bg-white focus:border-teal-600 outline-none transition cursor-pointer"
              >
                {CLINICIANS.map(cl => (
                  <option key={cl.id} value={cl.id}>
                    {cl.name} &mdash; {cl.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Prompt Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'HPI', label: 'History of Present Illness (HPI)' },
                  { id: 'EXAM', label: 'Physical Exam Summary' },
                  { id: 'ASSESSMENT', label: 'Assessment & Plan' },
                  { id: 'SUMMARY', label: 'Progress Narrative Summary' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPromptType(p.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
                      promptType === p.id
                        ? 'border-teal-600 bg-teal-50/80 text-teal-900 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-blue-700 hover:opacity-90 active:scale-95 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-emerald-300" />}
              {isGenerating ? 'Generating AI Clinical Draft...' : 'Generate AI Clinical Draft (Live Gemini)'}
            </button>
          </div>

          {/* Preview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <h2 className="text-sm font-bold text-slate-900">AI Clinical Note Preview</h2>
                {generatedDraft?.model && (
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-full">
                    {generatedDraft.model}
                  </span>
                )}
              </div>

              {generatedDraft && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingDraft(!isEditingDraft)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <Pen className="w-3.5 h-3.5" /> {isEditingDraft ? 'View Formatted' : 'Edit Text'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-lg text-slate-700 flex items-center gap-1 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1">
              {generatedDraft ? (
                <div className="space-y-3">
                  {isEditingDraft ? (
                    <textarea
                      rows={14}
                      value={editableDraftText}
                      onChange={e => setEditableDraftText(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono leading-relaxed outline-none focus:bg-white focus:border-teal-600 transition"
                    />
                  ) : (
                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 max-h-[480px] overflow-y-auto">
                      {renderFormattedClinicalNote(editableDraftText || generatedDraft.draftText)}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Target Clinician: <strong className="text-teal-800">{currentClinician.name}</strong></span>
                    <span>Generated: {generatedDraft.generatedAt}</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 space-y-3">
                  <Brain className="w-10 h-10 text-slate-300 mx-auto" />
                  <div>
                    <p className="font-bold text-slate-700">No Draft Generated Yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Click below to generate live AI clinical documentation for {patientName || 'this patient'}.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-700 hover:opacity-90 active:scale-95 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 mx-auto cursor-pointer"
                  >
                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-emerald-300" />}
                    {isGenerating ? 'Generating...' : `Generate AI Draft for ${patientName || 'Patient'}`}
                  </button>
                </div>
              )}
            </div>

            {generatedDraft && draftStatus === 'draft' && (
              <button
                type="button"
                onClick={handleSubmitForReview}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Eye className="w-4 h-4" /> Submit for Review to {currentClinician.name} ({currentClinician.role})
              </button>
            )}
            {draftStatus === 'submitted' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Submitted to {currentClinician.name}'s Review Queue! Awaiting Doctor Approval.
              </div>
            )}

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
              <strong>Mandatory Notice:</strong> AI drafts must be reviewed and approved by the assigned clinician ({currentClinician.name}) before official medical record locking.
            </div>
          </div>
        </div>
      )}

      {/* ── REVIEW QUEUE TAB ───────────────────────────── */}
      {activeTab === 'review' && (
        <>
          {drafts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-100">
                <ClipboardCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Review Queue is Empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  No pending AI drafts in queue. When you generate and submit clinical drafts for patient charts, they will appear here for physician review and permanent database locking.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('generate')}
                className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-blue-700 hover:opacity-90 active:scale-95 text-white font-bold text-xs rounded-xl shadow transition inline-flex items-center gap-2 cursor-pointer mt-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                Generate AI Draft for Registered Patient
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Draft List */}
              <div className="lg:col-span-2 space-y-3">
                {drafts.map(draft => {
                  const cfg = STATUS_CONFIG[draft.status] || STATUS_CONFIG['Pending Review'];
                  const StatusIcon = cfg.icon;
                  return (
                    <button
                      key={draft.id}
                      onClick={() => setSelectedDraft(draft)}
                      className={`w-full text-left p-4 rounded-2xl border transition shadow-2xs cursor-pointer ${
                        selectedDraft?.id === draft.id
                          ? 'border-teal-500 bg-teal-50/40 ring-1 ring-teal-500'
                          : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-xs font-extrabold text-slate-900">{draft.patient}</p>
                        <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" /> {draft.status}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-teal-800 mb-1">{draft.type}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-2">{draft.preview}</p>
                      
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 flex-wrap gap-1">
                        <span className="flex items-center gap-1 text-[10px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                          <ShieldCheck className="w-3 h-3 text-teal-600" />
                          To: {draft.assignedDoctorName || 'Dr. Segun Adeoye'}
                        </span>
                        <span className="text-[10px] text-slate-400">{draft.generatedAt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Draft Detail / Doctor Review Panel */}
              <div className="lg:col-span-3">
                {selectedDraft ? (
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="text-xs font-black text-slate-800">{selectedDraft.patient} — {selectedDraft.type}</p>
                        <p className="text-[10px] text-teal-700 font-bold flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3 text-teal-600" />
                          Assigned Reviewer: {selectedDraft.assignedDoctorName || 'Dr. Segun Adeoye'} ({selectedDraft.assignedDoctorTitle || 'Attending Physician'})
                        </p>
                      </div>
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${(STATUS_CONFIG[selectedDraft.status] || STATUS_CONFIG['Pending Review']).color}`}>
                        {selectedDraft.status}
                      </span>
                    </div>

                    {/* Full Draft Content */}
                    <div className="p-5 space-y-4">
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed max-h-[480px] overflow-y-auto">
                        {renderFormattedClinicalNote(selectedDraft.preview)}
                      </div>

                      {/* Doctor Notes/Edits */}
                      {selectedDraft.status === 'Pending Review' && (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            <Pen className="w-3.5 h-3.5 inline mr-1 text-teal-600" />
                            Physician Review Notes / Corrections
                          </label>
                          <textarea
                            rows={3}
                            value={doctorNotes}
                            onChange={e => setDoctorNotes(e.target.value)}
                            placeholder="Add any corrections, amendments, or notes before approving..."
                            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white"
                          />
                        </div>
                      )}

                      {/* Action Buttons: for Doctor & Admin on Pending drafts */}
                      {selectedDraft.status === 'Pending Review' && (
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => handleApprove(selectedDraft.id)}
                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            {isDoctor
                              ? `Approve & Sign Note as ${currentUser?.name || 'Attending Physician'}`
                              : `Approve & Lock Chart (as ${selectedDraft.assignedDoctorName || 'Dr. Segun Adeoye'})`
                            }
                          </button>
                          <button
                            onClick={() => handleReject(selectedDraft.id)}
                            className="px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      )}

                      {selectedDraft.status === 'Approved' && (
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
                          <Lock className="w-4 h-4 text-emerald-600" /> Approved &amp; Locked to MySQL Database (Physician: {selectedDraft.assignedDoctorName || 'Dr. Segun Adeoye'})
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-64 bg-white border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs space-y-2 p-6 text-center">
                    <ClipboardCheck className="w-10 h-10 text-slate-300" />
                    <p className="font-bold text-slate-600">Select a draft to review</p>
                    <p className="text-slate-400">Click on any submitted AI draft from the list on the left to review, edit, and approve.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
