// src/pages/clinical/ClinicalNoteEditorPage.jsx
import React, { useEffect, useState } from 'react';
import { apiClinicalNoteService } from '../../services/api/apiClinicalNoteService';
import { apiPatientService } from '../../services/api/apiPatientService';
import { apiCaseService } from '../../services/api/apiCaseService';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, PenTool, Lock, CheckCircle2, FileText, AlertTriangle, PlusCircle, Save, Stethoscope, DollarSign, Layers, ShieldCheck } from 'lucide-react';

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

  // Signature Modal States
  const [signatureType, setSignatureType] = useState('draw'); // 'draw' | 'type'
  const [signatureText, setSignatureText] = useState('');
  const [signerLicense, setSignerLicense] = useState('TX-MD-88219');
  const [signAttestation, setSignAttestation] = useState(true);
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

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

  useEffect(() => {
    if (currentUser?.name) {
      setSignatureText(currentUser.name);
    }
  }, [currentUser]);

  const isNew = !id || id === 'new';

  useEffect(() => {
    apiPatientService.getPatients().then(res => {
      const raw = Array.isArray(res) ? res : (res?.patients || []);
      if (raw && raw.length > 0) {
        setPatients(raw);
        if (isNew) {
          const found = raw.find(p => p.id === queryPatientId || p.patientId === queryPatientId) || raw[0];
          if (found) {
            setFormData(prev => ({
              ...prev,
              patientId: found.id,
              patientName: `${found.firstName} ${found.lastName}`.trim()
            }));
          }
        }
      }
    }).catch(() => {});

    apiCaseService.getCases().then(res => {
      const raw = Array.isArray(res) ? res : (res?.cases || []);
      if (raw && raw.length > 0) {
        setCases(raw);
      }
    }).catch(() => {});

    if (!isNew) {
      apiClinicalNoteService.getNoteById(id).then(res => {
        if (res) {
          setNote(res);
        }
      }).catch(() => {
        addToast('Failed to load note details from backend.', 'error');
      });
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

      const createdNote = await apiClinicalNoteService.createNote(newNoteData);
      setNote(createdNote);
      addToast('Clinical note created & logged to database!', 'success');
      navigate(`/clinical-notes/${createdNote.id}`);
    } catch (err) {
      console.error('Save note error:', err);
      addToast('Failed to save clinical note', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSignChart = async () => {
    setIsSigning(true);
    try {
      if (!note || !note.id) return;
      let sigData = '';
      if (signatureType === 'draw' && canvasRef.current && hasDrawn) {
        sigData = canvasRef.current.toDataURL('image/png');
      } else {
        sigData = `DIGITAL_SIG:${signatureText || currentUser?.name || 'Dr. Segun Adeoye'}:${Date.now()}`;
      }

      const signer = signatureText.trim() || currentUser?.name || 'Dr. Segun Adeoye, MD';

      const updated = await apiClinicalNoteService.signNote(
        note.id,
        sigData,
        signer
      );
      setNote(updated);
      setSignatureModalOpen(false);
      addToast('Clinical chart digitally signed & locked in database permanently!', 'success');
    } catch (err) {
      console.error('Sign error:', err);
      addToast('Failed to sign chart', 'error');
    } finally {
      setIsSigning(false);
    }
  };

  const handleAddAddendum = async (e) => {
    e.preventDefault();
    if (!addendumText.trim()) return;
    try {
      const updated = await apiClinicalNoteService.amendNote(note.id, addendumText, currentUser?.name || 'Clinician');
      setNote(updated);
      setAddendumText('');
      addToast('Addendum recorded permanently in database!', 'success');
    } catch (err) {
      console.error('Addendum error:', err);
      addToast('Failed to record addendum', 'error');
    }
  };

  // -- Render New Note Form --
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
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Digitally Signed &amp; Locked By: <span className="text-teal-900">{note.signedBy || note.author}</span>
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Timestamp: {note.signedAt ? new Date(note.signedAt).toLocaleString() : note.date} &bull; SHA-256 Verified
              </p>
            </div>
            <div>
              {note.signatureUrl && note.signatureUrl.startsWith('data:image') && note.signatureUrl.length > 200 ? (
                <div className="bg-white p-2 rounded-xl border border-emerald-300 shadow-2xs inline-flex items-center gap-2">
                  <img
                    src={note.signatureUrl}
                    alt="Doctor Signature"
                    className="h-9 max-w-[170px] object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="text-[10px] font-mono text-emerald-700 border-l border-emerald-200 pl-2 font-bold">VERIFIED</span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-xl shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <PenTool className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-serif italic font-bold text-xs text-emerald-950">
                      {note.signedBy || note.author || 'Dr. Sarah Connor, MD'}
                    </div>
                    <div className="text-[9px] text-emerald-700 font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      AUTHENTICATED MD SIGNATURE
                    </div>
                  </div>
                </div>
              )}
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
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Physician Digital Signature &amp; Chart Lock</h3>
                  <p className="text-[11px] text-slate-500">Medical-legal attestation and permanent EHR chart locking</p>
                </div>
              </div>
            </div>

            {/* Signature Mode Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSignatureType('draw')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${signatureType === 'draw' ? 'bg-white text-teal-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                ✍️ Draw Signature
              </button>
              <button
                type="button"
                onClick={() => setSignatureType('type')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${signatureType === 'type' ? 'bg-white text-teal-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                ⌨️ Type Legal Name
              </button>
            </div>

            {/* Draw Signature Canvas */}
            {signatureType === 'draw' ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-700">Sign with Mouse / Touchpad / Stylus below:</label>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Clear Signature
                  </button>
                </div>
                <div className="border-2 border-dashed border-teal-300 rounded-xl bg-slate-50 relative overflow-hidden flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={440}
                    height={130}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="cursor-crosshair w-full h-[130px] touch-none"
                  />
                  {!hasDrawn && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs">
                      <PenTool className="w-5 h-5 mb-1 text-slate-300" />
                      <span>Draw cursive signature here</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-4 right-4 border-b border-slate-300 pointer-events-none"></div>
                </div>
              </div>
            ) : (
              /* Type Signature */
              <div className="space-y-2">
                <label className="font-semibold text-xs text-slate-700 block">Attending Provider Full Name / Credentials:</label>
                <input
                  type="text"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold focus:bg-white focus:border-teal-600 outline-none"
                  placeholder="e.g. Dr. Segun Adeoye, MD"
                />
                <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center justify-between">
                  <span className="text-[10px] text-teal-800 font-medium">Calligraphic Preview:</span>
                  <span className="text-base font-serif italic font-bold text-teal-950">
                    {signatureText || 'Dr. Signature'}
                  </span>
                </div>
              </div>
            )}

            {/* Provider Details Fields */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">License / NPI Stamp</label>
                <input
                  type="text"
                  value={signerLicense}
                  onChange={(e) => setSignerLicense(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-mono outline-none"
                  placeholder="NPI: 1982019921"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Signing Date / Time</label>
                <input
                  type="text"
                  disabled
                  value={new Date().toLocaleDateString('en-US') + ' (Live Auto)'}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-100 text-[11px] text-slate-600 font-mono"
                />
              </div>
            </div>

            {/* Legal Attestation */}
            <label className="flex items-start gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={signAttestation}
                onChange={(e) => setSignAttestation(e.target.checked)}
                className="rounded text-teal-600 mt-0.5"
              />
              <span>
                I hereby attest under medical-legal compliance that I have evaluated this patient and this clinical chart represents an accurate medical record.
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSignatureModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 text-xs font-bold rounded-xl text-slate-700 hover:bg-slate-200 cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignChart}
                disabled={isSigning || !signAttestation}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                {isSigning ? 'Digitally Signing & Locking...' : 'Confirm Signature & Lock Chart'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
