// src/pages/clinical/AiAssistantPage.jsx
import React, { useState } from 'react';
import { mockClinicalNoteService } from '../../services/mock/mockClinicalNoteService';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { ROLES } from '../../constants/rolePermissions';
import {
  Brain, Sparkles, AlertTriangle, ArrowLeft, Copy, Check,
  RefreshCw, ClipboardCheck, Lock, Clock, CheckCircle2,
  XCircle, Eye, Pen, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Simulated pending AI drafts awaiting Doctor review
const PENDING_DRAFTS = [
  {
    id: 'draft-001',
    patient: 'SAMPLE TESTING',
    type: 'History of Present Illness (HPI)',
    generatedAt: '2026-08-04 | 09:14 AM',
    generatedBy: 'AI Assistant (Demo)',
    status: 'Pending Review',
    preview: 'Patient presents with chief complaint of neck and low back pain following a rear-end motor vehicle collision on 12/27/2025. Patient reports 8/10 pain severity at onset...',
  },
  {
    id: 'draft-002',
    patient: 'SAMPLE TESTING',
    type: 'Assessment & Plan',
    generatedAt: '2026-08-04 | 09:22 AM',
    generatedBy: 'AI Assistant (Demo)',
    status: 'Pending Review',
    preview: 'Assessment: Cervical strain (S13.4XXA), Lumbar sprain (S33.5XXA), Left ankle contusion (M25.572). Plan: Continue ESWT protocol and HILT therapy sessions...',
  },
  {
    id: 'draft-003',
    patient: 'DEMO PATIENT 002',
    type: 'Progress Narrative Summary',
    generatedAt: '2026-08-03 | 03:45 PM',
    generatedBy: 'AI Assistant (Demo)',
    status: 'Approved',
    preview: 'Patient demonstrates moderate improvement following session 2. VAS pain score reduced from 8/10 to 5/10. Lumbar flexion improved to 65 degrees...',
  },
];

const STATUS_CONFIG = {
  'Pending Review': { color: 'bg-amber-100 text-amber-700 border-amber-300', icon: Clock },
  'Approved': { color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: CheckCircle2 },
  'Rejected': { color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle },
  'Locked': { color: 'bg-slate-200 text-slate-600 border-slate-300', icon: Lock },
};

export const AiAssistantPage = () => {
  const { currentUser } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();
  const isDoctor = currentUser?.role === ROLES.DOCTOR;

  // Draft Generation State
  const [patientName, setPatientName] = useState('Demo Patient 001');
  const [complaints, setComplaints] = useState('Neck and low back pain following rear-end auto accident on 12/27/2025');
  const [promptType, setPromptType] = useState('HPI');
  const [generatedDraft, setGeneratedDraft] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draftStatus, setDraftStatus] = useState('draft'); // draft | submitted | approved | locked

  // Review Queue State
  const [drafts, setDrafts] = useState(PENDING_DRAFTS);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [activeTab, setActiveTab] = useState(isDoctor ? 'review' : 'generate');
  const [doctorNotes, setDoctorNotes] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setDraftStatus('draft');
    try {
      const res = await mockClinicalNoteService.generateAiDraft(promptType, {
        patientName,
        complaints,
        painLocations: ['Neck', 'Lower Back', 'Left Ankle']
      });
      setGeneratedDraft(res);
      addToast('AI draft generated — submit for Doctor review', 'success');
    } catch (err) {
      addToast('Failed to generate draft', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitForReview = () => {
    setDraftStatus('submitted');
    addToast('Draft submitted to Doctor review queue!', 'info');
  };

  const handleCopy = () => {
    if (generatedDraft?.draftText) {
      navigator.clipboard.writeText(generatedDraft.draftText);
      setCopied(true);
      addToast('Draft copied to clipboard!', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApprove = (draftId) => {
    setDrafts(prev => prev.map(d => d.id === draftId ? { ...d, status: 'Approved' } : d));
    addToast(`Draft approved and locked as official clinical note by Dr. ${currentUser?.name}`, 'success');
    setSelectedDraft(null);
    setDoctorNotes('');
  };

  const handleReject = (draftId) => {
    setDrafts(prev => prev.map(d => d.id === draftId ? { ...d, status: 'Rejected' } : d));
    addToast('Draft rejected — returned for revision', 'error');
    setSelectedDraft(null);
    setDoctorNotes('');
  };

  const pendingCount = drafts.filter(d => d.status === 'Pending Review').length;

  return (
    <div className="space-y-5">
      <button onClick={() => navigate('/clinical-notes')} className="flex items-center gap-1 text-xs font-bold text-secondary-container hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Clinical Registry
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-on-surface">AI Doctor Note Assistant</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {isDoctor
              ? 'Review, edit, and approve AI-generated clinical note drafts'
              : 'Generate AI-assisted clinical note drafts for physician review'}
          </p>
        </div>
        {isDoctor && pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-bold">
            <Clock className="w-4 h-4" />
            {pendingCount} Draft{pendingCount > 1 ? 's' : ''} Awaiting Your Review
          </div>
        )}
      </div>

      {/* MANDATORY AI WARNING BANNER */}
      <div className="bg-emerald-500/10 border-2 border-emerald-500/30 p-4 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">Mandatory Clinical Review Notice</h3>
          <p className="text-xs mt-0.5 leading-relaxed text-emerald-900/90 font-medium">
            AI-generated content is a <strong>draft only</strong>. It must be reviewed, edited if needed, and approved by an authorized
            healthcare provider before becoming part of the official medical record.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-1">
        {!isDoctor && (
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-4 py-2.5 text-xs font-bold transition border-b-2 ${activeTab === 'generate' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Generate Draft</div>
          </button>
        )}
        <button
          onClick={() => setActiveTab('review')}
          className={`px-4 py-2.5 text-xs font-bold transition border-b-2 relative ${activeTab === 'review' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <div className="flex items-center gap-1.5">
            <ClipboardCheck className="w-3.5 h-3.5" />
            {isDoctor ? 'Pending Review Queue' : 'Approved Notes'}
            {pendingCount > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">{pendingCount}</span>
            )}
          </div>
        </button>
      </div>

      {/* ── GENERATE TAB (non-doctor) ─────────────────────────────── */}
      {activeTab === 'generate' && !isDoctor && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
              <Brain className="w-4 h-4 text-secondary-container" /> Structured Clinical Input
            </h2>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Patient Name</label>
              <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Chief Complaint & Accident Context</label>
              <textarea rows={3} value={complaints} onChange={e => setComplaints(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface" />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">Prompt Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'HPI', label: 'History of Present Illness (HPI)' },
                  { id: 'EXAM', label: 'Physical Exam Summary' },
                  { id: 'ASSESSMENT', label: 'Assessment & Plan' },
                  { id: 'SUMMARY', label: 'Progress Narrative Summary' }
                ].map(p => (
                  <button key={p.id} type="button" onClick={() => setPromptType(p.id)}
                    className={`p-2.5 rounded-lg border text-left text-xs font-bold transition ${promptType === p.id ? 'border-secondary-container bg-surface-container-low text-secondary-container' : 'border-outline-variant hover:bg-surface text-on-surface-variant'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleGenerate} disabled={isGenerating}
              className="w-full py-2.5 bg-gradient-to-r from-secondary-container to-blue-700 hover:opacity-90 text-white font-bold text-xs rounded-lg shadow transition flex items-center justify-center gap-2">
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-emerald-300" />}
              {isGenerating ? 'Generating AI Draft...' : 'Generate AI Clinical Draft (Demo)'}
            </button>
          </div>

          {/* Preview */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <h2 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> AI Draft Preview
              </h2>
              {generatedDraft && (
                <button onClick={handleCopy} className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-xs font-bold rounded text-on-surface flex items-center gap-1">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            <div className="flex-1">
              {generatedDraft ? (
                <div className="space-y-3">
                  <div className="p-4 bg-surface rounded-xl border border-outline-variant font-mono text-xs text-on-surface whitespace-pre-wrap leading-relaxed">
                    {generatedDraft.draftText}
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-mono">Generated: {generatedDraft.generatedAt}</p>
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-on-surface-variant space-y-2">
                  <Brain className="w-10 h-10 text-outline mx-auto" />
                  <p className="font-bold text-on-surface">No Draft Generated Yet</p>
                  <p>Click "Generate AI Clinical Draft" to simulate model output.</p>
                </div>
              )}
            </div>

            {generatedDraft && draftStatus === 'draft' && (
              <button onClick={handleSubmitForReview}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow transition">
                <Eye className="w-4 h-4" /> Submit to Doctor Review Queue
              </button>
            )}
            {draftStatus === 'submitted' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 font-bold flex items-center gap-2">
                <Clock className="w-4 h-4" /> Submitted — Awaiting Doctor Approval
              </div>
            )}

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-800">
              <strong>Note:</strong> AI cannot auto-sign or lock charts. Attending physician must review and approve.
            </div>
          </div>
        </div>
      )}

      {/* ── REVIEW QUEUE TAB (Doctor) ─────────────────────────────── */}
      {activeTab === 'review' && (
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
                  className={`w-full text-left p-4 rounded-xl border-2 transition shadow-sm ${selectedDraft?.id === draft.id ? 'border-teal-500 bg-teal-50/30' : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-xs font-black text-slate-800">{draft.patient}</p>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" /> {draft.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-teal-700 mb-1">{draft.type}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-2">{draft.preview}</p>
                  <p className="text-[10px] text-slate-400 mt-2">{draft.generatedAt} · {draft.generatedBy}</p>
                </button>
              );
            })}
          </div>

          {/* Draft Detail / Doctor Review Panel */}
          <div className="lg:col-span-3">
            {selectedDraft ? (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-800">{selectedDraft.patient} — {selectedDraft.type}</p>
                    <p className="text-[10px] text-slate-500">{selectedDraft.generatedAt} · {selectedDraft.generatedBy}</p>
                  </div>
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${(STATUS_CONFIG[selectedDraft.status] || STATUS_CONFIG['Pending Review']).color}`}>
                    {selectedDraft.status}
                  </span>
                </div>

                {/* Full Draft Content */}
                <div className="p-5 space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {selectedDraft.preview}
                    {'\n\n[Full draft content would appear here in backend integration. This is a simulated preview.]\n\nICD-10 Codes: S13.4XXA, S33.5XXA, M79.1, M54.50\nReferring Physician: Anthony Nguyen, MD\nDate of Service: 12/30/2025'}
                  </div>

                  {/* Doctor Notes/Edits */}
                  {selectedDraft.status === 'Pending Review' && isDoctor && (
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
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  )}

                  {/* Action Buttons — only for Doctor on Pending drafts */}
                  {selectedDraft.status === 'Pending Review' && isDoctor && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(selectedDraft.id)}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow transition"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Approve & Sign as Dr. {currentUser?.name?.split(' ')[1] || 'Doctor'}
                      </button>
                      <button
                        onClick={() => handleReject(selectedDraft.id)}
                        className="px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}

                  {selectedDraft.status === 'Approved' && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 font-bold">
                      <Lock className="w-4 h-4" /> Approved & Locked — Official Clinical Note
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-64 bg-white border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
                <ClipboardCheck className="w-10 h-10 opacity-30" />
                <p className="font-bold text-slate-500">Select a draft to review</p>
                <p>{isDoctor ? 'Approve or reject AI-generated clinical notes' : 'View submitted drafts and their approval status'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
