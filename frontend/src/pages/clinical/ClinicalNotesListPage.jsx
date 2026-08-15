import React, { useEffect, useState } from 'react';
import { mockClinicalNoteService } from '../../services/mock/mockClinicalNoteService';
import { FileText, PlusCircle, Brain, Sparkles, ChevronRight, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CounselorSessionModal } from '../../components/modals/CounselorSessionModal';

export const ClinicalNotesListPage = () => {
  const [notes, setNotes] = useState([]);
  const [showCounselorModal, setShowCounselorModal] = useState(false);
  const navigate = useNavigate();

  const loadNotes = () => {
    mockClinicalNoteService.getNotes().then(setNotes);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clinical Documentation Master Registry</h1>
          <p className="text-xs text-slate-500">Provider specialized notes, pain management forms, ESWT/Laser procedure forms &amp; AI draft generator</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowCounselorModal(true)} className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer">
            <Brain className="w-4 h-4 text-indigo-200" /> Log Counseling Note
          </button>
          <button onClick={() => navigate('/clinical-notes/ai-assistant')} className="px-3.5 py-2 bg-gradient-to-r from-teal-600 to-blue-700 text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-90 flex items-center gap-1.5 cursor-pointer">
            <Sparkles className="w-4 h-4 text-emerald-300" /> AI Note Assistant
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container text-on-surface-variant uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Patient</th>
                <th className="p-3.5">Document Title & Provider</th>
                <th className="p-3.5">Author</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {notes.map((note) => (
                <tr key={note.id} className="hover:bg-surface">
                  <td className="p-3.5 font-mono text-on-surface-variant">{note.date}</td>
                  <td className="p-3.5 font-bold text-secondary-container">{note.patientName}</td>
                  <td className="p-3.5">
                    <p className="font-bold text-on-surface">{note.title}</p>
                    <p className="text-[10px] text-on-surface-variant">{note.providerName}</p>
                  </td>
                  <td className="p-3.5 text-on-surface-variant">{note.author}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      note.status === 'SIGNED_LOCKED' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}>
                      {note.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button onClick={() => navigate(`/clinical-notes/${note.id}/edit`)} className="px-3 py-1 bg-surface-container-high hover:bg-surface-variant text-on-surface font-bold rounded inline-flex items-center gap-1">
                      Open Note <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Counselor Session Modal */}
      <CounselorSessionModal
        isOpen={showCounselorModal}
        onClose={() => setShowCounselorModal(false)}
        onNoteSaved={() => loadNotes()}
      />
    </div>
  );
};
