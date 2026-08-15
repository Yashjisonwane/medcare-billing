// src/pages/clinical/ClinicalNoteEditorPage.jsx
import React, { useEffect, useState } from 'react';
import { mockClinicalNoteService } from '../../services/mock/mockClinicalNoteService';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PenTool, Lock, CheckCircle2, FileText, AlertTriangle, PlusCircle } from 'lucide-react';

export const ClinicalNoteEditorPage = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [addendumText, setAddendumText] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const { currentUser } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    mockClinicalNoteService.getNoteById(id || 'note-001').then(setNote);
  }, [id]);

  const handleSignChart = async () => {
    setIsSigning(true);
    try {
      const updated = await mockClinicalNoteService.signNote(
        note.id,
        'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200',
        currentUser?.name || 'Dr. Segun Adeoye'
      );
      setNote(updated);
      setSignatureModalOpen(false);
      addToast('Clinical chart signed & locked permanently (Demo)!', 'success');
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

  if (!note) return <div className="p-8 text-center text-xs text-on-surface-variant">Loading clinical chart...</div>;

  const isSigned = note.status === 'SIGNED_LOCKED' || note.status === 'AMENDED';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate('/clinical-notes')} className="flex items-center gap-1 text-xs font-bold text-secondary-container hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Clinical Notes
      </button>

      {/* Header Banner */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-on-surface">{note.title}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              isSigned ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
            }`}>
              {note.status}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Patient: <strong className="text-on-surface">{note.patientName}</strong> | Provider: <strong className="text-secondary-container">{note.providerName}</strong> | Date: {note.date}
          </p>
        </div>

        {!isSigned ? (
          <button
            onClick={() => setSignatureModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-1.5"
          >
            <PenTool className="w-4 h-4" /> Sign & Lock Clinical Chart
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <Lock className="w-4 h-4" /> Chart Locked & Signed
          </div>
        )}
      </div>

      {/* Note Content Display / Read-only state when signed */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">Clinical Assessment Narrative</h2>

          {typeof note.content === 'string' ? (
            <p className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap">{note.content}</p>
          ) : (
            <div className="space-y-3 text-xs">
              {Object.entries(note.content || {}).map(([key, val]) => (
                <div key={key} className="p-3 bg-surface rounded-lg border border-outline-variant">
                  <span className="font-bold text-secondary-container uppercase tracking-wider text-[10px] block mb-1">{key}</span>
                  <span className="text-on-surface font-medium">{Array.isArray(val) ? val.join(', ') : typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Digital Signature Block */}
        {isSigned && (
          <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-on-surface">Digitally Signed By: {note.author}</p>
              <p className="text-[10px] text-on-surface-variant font-mono">Timestamp: {note.signedAt || note.date}</p>
            </div>
            <img src={note.signatureUrl} alt="Signature" className="h-10 object-contain border-b border-on-surface max-w-[150px]" />
          </div>
        )}
      </div>

      {/* Amendment / Addendum Flow */}
      {isSigned && (
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-secondary-container" /> Append Chart Addendum / Amendment
          </h2>

          {note.addendums?.map((add) => (
            <div key={add.id} className="p-4 bg-surface rounded-lg border border-outline-variant space-y-1 text-xs">
              <div className="flex justify-between font-bold text-on-surface-variant">
                <span>Addendum by {add.author}</span>
                <span className="font-mono">{add.timestamp}</span>
              </div>
              <p className="text-on-surface">{add.text}</p>
            </div>
          ))}

          <form onSubmit={handleAddAddendum} className="space-y-3">
            <textarea
              rows={3}
              placeholder="Type formal clinical addendum details here..."
              value={addendumText}
              onChange={(e) => setAddendumText(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface"
            />
            <button type="submit" className="px-4 py-2 bg-secondary-container text-white text-xs font-bold rounded-lg hover:bg-secondary">
              Record Addendum
            </button>
          </form>
        </div>
      )}

      {/* Digital Signature Canvas Modal */}
      {signatureModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-2xl max-w-md w-full border border-outline-variant space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <PenTool className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-on-surface">Digital Doctor Signature Demo</h3>
            <p className="text-xs text-on-surface-variant">
              Signing locks this clinical chart permanently. Future changes require formal addendums.
            </p>

            <div className="h-28 bg-surface rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center p-4">
              <span className="text-xs text-on-surface-variant font-mono">[ Simulated Provider Digital Signature Canvas ]</span>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setSignatureModalOpen(false)} className="flex-1 py-2 bg-surface-container text-xs font-bold rounded-lg">
                Cancel
              </button>
              <button onClick={handleSignChart} disabled={isSigning} className="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow">
                {isSigning ? 'Locking Chart...' : 'Confirm Digital Signature'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
