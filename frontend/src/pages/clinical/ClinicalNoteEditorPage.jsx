// src/pages/clinical/ClinicalNoteEditorPage.jsx
import React, { useEffect, useState } from 'react';
import { mockClinicalNoteService } from '../../services/mock/mockClinicalNoteService';
import { mockPatientService } from '../../services/mock/mockPatientService';
import { mockCaseService } from '../../services/mock/mockCaseService';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, PenTool, Lock, CheckCircle2, FileText, AlertTriangle, PlusCircle, Save, Stethoscope, DollarSign, Layers } from 'lucide-react';

export const ClinicalNoteEditorPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const queryPatientId = searchParams.get('patientId');
  const queryCaseId = searchParams.get('caseId');

  const [note, setNote] = useState(null);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [addendumText, setAddendumText] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [patients, setPatients] = useState([]);
  const [cases, setCases] = useState([]);

  // New Note Form State
  const [formData, setFormData] = useState({
    title: 'Comprehensive Pain Evaluation & Treatment Plan',
    providerName: 'JOSMIC Wellness Center',
    patientId: queryPatientId || 'pat-001',
    patientName: '',
    caseId: queryCaseId || 'CASE-2025-1227',
    date: new Date().toISOString().split('T')[0],
    chiefComplaint: 'Neck, lower back and shoulder stiffness following motor vehicle accident',
    subjective: 'Patient reports persistent 7/10 pain with radiculopathy into right upper extremity after rear-end collision.',
    objective: 'Cervical spine tenderness at C4-C6, restricted ROM. Positive Spurling test. Lumbar paraspinal spasms noted.',
    assessment: '1. Cervicalgia (M54.2)\n2. Lumbar Sprain (S39.012A)\n3. Post-Traumatic Myofascial Pain Syndrome',
    plan: 'Initiate 4-week multi-modality protocol: JOSMIC pain management, DAVS Shockwave (ESWT) 2x/wk, ANIK Laser therapy 2x/wk, and counselor supportive session.',
    cptCodes: '99204, 0101T, 97039'
  });

  const { currentUser } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const isNew = !id || id === 'new';

  useEffect(() => {
    mockPatientService.getPatients().then(res => {
      if (res && res.length > 0) {
        setPatients(res);
        if (isNew) {
          const found = res.find(p => p.id === queryPatientId) || res[0];
          setFormData(prev => ({
            ...prev,
            patientId: found.id,
            patientName: `${found.firstName} ${found.lastName}`.trim()
          }));
        }
      }
    }).catch(() => {});

    mockCaseService.getCases().then(res => {
      if (res && res.length > 0) {
        setCases(res);
      }
    }).catch(() => {});

    if (!isNew) {
      mockClinicalNoteService.getNoteById(id).then(res => {
        if (res) {
          setNote(res);
        } else {
          // Fallback to note fixture
          mockClinicalNoteService.getNotes().then(all => {
            const match = all.find(n => n.id === id) || all[0];
            setNote(match);
          });
        }
      }).catch(() => {});
    }
  }, [id, isNew, queryPatientId]);

  const handlePatientSelect = (pId) => {
    const p = patients.find(x => x.id === pId);
    if (p) {
      setFormData(prev => ({
        ...prev,
        patientId: p.id,
        patientName: `${p.firstName} ${p.lastName}`.trim()
      }));
    }
  };

  const handleSaveNewNote = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let providerId = 'prov-josmic';
      let type = 'JOSMIC_PAIN';
      if (formData.providerName.includes("DAV'S")) { providerId = 'prov-davs'; type = 'DAVS_ESWT'; }
      if (formData.providerName.includes("ANIK")) { providerId = 'prov-anik'; type = 'ANIK_LASER'; }
      if (formData.providerName.includes("Counselor")) { providerId = 'prov-counselor'; type = 'COUNSELOR_GENERIC'; }

      const newNoteData = {
        patientId: formData.patientId,
        patientName: formData.patientName || 'Accident Patient',
        caseId: formData.caseId,
        providerId,
        providerName: formData.providerName,
        type,
        title: formData.title,
        date: formData.date,
        author: currentUser?.name || 'Attending Physician',
        content: {
          'Chief Complaint': formData.chiefComplaint,
          'Subjective (HPI)': formData.subjective,
          'Objective Findings': formData.objective,
          'Clinical Assessment': formData.assessment,
          'Treatment Plan': formData.plan,
          'Recommended Billing CPT Codes': formData.cptCodes
        }
      };

      const createdNote = await mockClinicalNoteService.createNote(newNoteData);
      setNote(createdNote);
      addToast('Clinical note created & logged to patient chart!', 'success');
      navigate(`/clinical-notes/${createdNote.id}`);
    } catch (err) {
      addToast('Failed to save clinical note', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignChart = async () => {
    setIsSigning(true);
    try {
      if (!note || !note.id) return;
      const updated = await mockClinicalNoteService.signNote(
        note.id,
        'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200',
        currentUser?.name || 'Dr. Segun Adeoye'
      );
      setNote(updated);
      setSignatureModalOpen(false);
      addToast('Clinical chart digitally signed & locked permanently!', 'success');
    } catch (err) {
      addToast('Failed to sign chart', 'error');
    } finally {
      setIsSigning(false);
    }
  };

  const handleAddAddendum = async (e) => {
    e.preventDefault();
    if (!addendumText.trim()) return;
    try {
      const updated = await mockClinicalNoteService.amendNote(note.id, addendumText, currentUser?.name || 'Clinician');
      setNote(updated);
      setAddendumText('');
      addToast('Addendum recorded permanently!', 'success');
    } catch (err) {
      addToast('Failed to record addendum', 'error');
    }
  };

  // â”€â”€ Render New Note Form â”€â”€
  if (isNew && !note) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button onClick={() => navigate('/clinical-notes')} className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Clinical Notes Registry
        </button>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">New Clinical Chart &amp; SOAP Documentation</h1>
            <p className="text-xs text-slate-500">Record comprehensive clinical assessment, SOAP findings, diagnosis &amp; multi-modality treatment protocol</p>
          </div>

          <form onSubmit={handleSaveNewNote} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Select Patient *</label>
                <select
                  value={formData.patientId}
                  onChange={e => handlePatientSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.patientId || p.mrn || p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Linked Accident Case</label>
                <select
                  value={formData.caseId}
                  onChange={e => setFormData(p => ({ ...p, caseId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none"
                >
                  {cases.map(c => (
                    <option key={c.id} value={c.caseId || c.id}>
                      {c.caseId || c.id} - {c.patientName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Practice Care Provider</label>
                <select
                  value={formData.providerName}
                  onChange={e => setFormData(p => ({ ...p, providerName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none font-bold text-teal-800"
                >
                  <option value="JOSMIC Wellness Center">JOSMIC Wellness Center (Pain Management)</option>
                  <option value="DAV'S Anatomy">DAV'S Anatomy (Shockwave ESWT)</option>
                  <option value="ANIK Laser Therapy">ANIK Laser Therapy (Laser Session)</option>
                  <option value="Counselor Practice (Hope Behavioral Health)">Counselor Practice (Behavioral Health)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Document Title *</label>
                <input
                  required
                  value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Date of Encounter *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Chief Complaint *</label>
              <input
                required
                value={formData.chiefComplaint}
                onChange={e => setFormData(p => ({ ...p, chiefComplaint: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">1. Subjective (HPI &amp; Patient Symptoms) *</label>
              <textarea
                rows={3}
                required
                value={formData.subjective}
                onChange={e => setFormData(p => ({ ...p, subjective: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">2. Objective Physical Exam Findings *</label>
              <textarea
                rows={3}
                required
                value={formData.objective}
                onChange={e => setFormData(p => ({ ...p, objective: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">3. Clinical Assessment &amp; ICD-10 Diagnoses *</label>
              <textarea
                rows={3}
                required
                value={formData.assessment}
                onChange={e => setFormData(p => ({ ...p, assessment: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">4. Treatment Plan &amp; Multi-Modality Recommendations *</label>
              <textarea
                rows={3}
                required
                value={formData.plan}
                onChange={e => setFormData(p => ({ ...p, plan: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate('/clinical-notes')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> {isSaving ? 'Logging Note...' : 'Save & Log Clinical Note'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (!note) return <div className="p-8 text-center text-xs text-slate-400">Loading clinical chart...</div>;

  const isSigned = note.status === 'SIGNED_LOCKED' || note.status === 'SIGNED' || note.status === 'AMENDED';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button onClick={() => navigate('/clinical-notes')} className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:underline cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Clinical Notes Registry
        </button>

        {/* Connected Workflow Action Links */}
        <div className="flex items-center gap-2">
          {note.patientId && (
            <button
              onClick={() => navigate(`/patients/${note.patientId}/profile`)}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              View Patient Chart
            </button>
          )}
          {note.caseId && (
            <button
              onClick={() => navigate(`/billing/provider-bills?caseId=${note.caseId}`)}
              className="px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <DollarSign className="w-3.5 h-3.5" /> Provider Bills Ledger
            </button>
          )}
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold text-slate-900">{note.title}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              isSigned ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {note.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Patient: <strong className="text-slate-900">{note.patientName}</strong> | Provider: <strong className="text-teal-700">{note.providerName}</strong> | Date: <strong className="font-mono">{note.date}</strong>
          </p>
        </div>

        {!isSigned ? (
          <button
            onClick={() => setSignatureModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <PenTool className="w-4 h-4" /> Sign &amp; Lock Clinical Chart
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 shrink-0">
            <Lock className="w-4 h-4" /> Chart Locked &amp; Signed
          </div>
        )}
      </div>

      {/* Note Content Display */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Clinical Assessment Narrative</h2>

          {typeof note.content === 'string' ? (
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
          ) : (
            <div className="space-y-3 text-xs">
              {Object.entries(note.content || {}).map(([key, val]) => (
                <div key={key} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200">
                  <span className="font-bold text-teal-800 uppercase tracking-wider text-[10px] block mb-1">{key}</span>
                  <span className="text-slate-800 font-medium whitespace-pre-wrap">{Array.isArray(val) ? val.join(', ') : typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Digital Signature Block */}
        {isSigned && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Digitally Signed By: {note.author}</p>
              <p className="text-[10px] text-slate-400 font-mono">Timestamp: {note.signedAt || note.date}</p>
            </div>
            <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-bold font-mono">
              [ VERIFIED DIGITAL SIGNATURE ]
            </div>
          </div>
        )}
      </div>

      {/* Amendment / Addendum Flow */}
      {isSigned && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-teal-600" /> Append Chart Addendum / Amendment
          </h2>

          {note.addendums?.map((add) => (
            <div key={add.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-500">
                <span>Addendum by {add.author}</span>
                <span className="font-mono">{add.timestamp}</span>
              </div>
              <p className="text-slate-800">{add.text}</p>
            </div>
          ))}

          <form onSubmit={handleAddAddendum} className="space-y-3">
            <textarea
              rows={3}
              placeholder="Type formal clinical addendum details here..."
              value={addendumText}
              onChange={(e) => setAddendumText(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 outline-none"
            />
            <button type="submit" className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 cursor-pointer">
              Record Addendum
            </button>
          </form>
        </div>
      )}

      {/* Digital Signature Canvas Modal */}
      {signatureModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <PenTool className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">Provider Digital Signature &amp; Note Lock</h3>
            <p className="text-xs text-slate-500">
              Signing locks this clinical chart permanently for medical-legal compliance. Future changes require formal addendums.
            </p>

            <div className="h-28 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center p-4">
              <span className="text-xs text-slate-500 font-mono">[ Secure Attending Physician Digital Signature Block ]</span>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setSignatureModalOpen(false)} className="flex-1 py-2 bg-slate-100 text-xs font-bold rounded-xl text-slate-700 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleSignChart} disabled={isSigning} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer">
                {isSigning ? 'Locking Chart...' : 'Confirm Signature'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
