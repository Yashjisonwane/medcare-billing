// src/pages/clinical/ClinicalNotesListPage.jsx
import React, { useEffect, useState } from 'react';
import { mockClinicalNoteService } from '../../services/mock/mockClinicalNoteService';
import { FileText, PlusCircle, Brain, Sparkles, ChevronRight, PenTool, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CounselorSessionModal } from '../../components/modals/CounselorSessionModal';

export const ClinicalNotesListPage = () => {
  const [notes, setNotes] = useState([]);
  const [showCounselorModal, setShowCounselorModal] = useState(false);
  const navigate = useNavigate();

  const loadNotes = () => {
    mockClinicalNoteService.getNotes().then(res => setNotes(res || [])).catch(() => {});
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="space-y-5">
      {/* ── Top Header & Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Clinical Documentation Master Registry</h1>
          <p className="text-xs text-slate-500">Provider specialized notes, pain management forms, ESWT/Laser procedure forms &amp; AI draft generator</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowCounselorModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Brain className="w-4 h-4 text-indigo-200" /> Log Counseling Note
          </button>
          <button
            onClick={() => navigate('/clinical-notes/ai-assistant')}
            className="px-3.5 py-2 bg-gradient-to-r from-teal-600 to-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" /> AI Note Assistant
          </button>
        </div>
      </div>

      {/* ── Notes List (Mobile Cards + Desktop Table) ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {notes.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-900">No Clinical Notes Found</p>
            <p className="text-xs text-slate-500">No records recorded in the clinical queue.</p>
          </div>
        ) : (
          <>
            {/* 1. Mobile Cards View (< 768px) */}
            <div className="divide-y divide-slate-100 md:hidden">
              {notes.map((note) => (
                <div key={note.id} className="p-4 space-y-3 hover:bg-slate-50/70 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3
                        onClick={() => navigate(`/clinical-notes/${note.id}`)}
                        className="font-extrabold text-slate-900 text-sm hover:text-teal-700 cursor-pointer leading-tight"
                      >
                        {note.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Patient: <strong className="text-slate-800">{note.patientName}</strong>
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      note.status === 'SIGNED' || note.status === 'SIGNED_LOCKED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {note.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <p className="flex items-center justify-between">
                      <span className="text-slate-500">Provider:</span>
                      <strong className="text-slate-900">{note.providerName}</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-500">Author:</span>
                      <strong className="text-slate-900">{note.author}</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-500">Date of Service:</span>
                      <strong className="text-slate-900 font-mono">{note.date}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/clinical-notes/${note.id}`)}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    Open Clinical Note <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* 2. Desktop High-Density Table (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Patient</th>
                    <th className="p-3.5">Document Title &amp; Provider</th>
                    <th className="p-3.5">Author</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notes.map((note) => (
                    <tr key={note.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-mono text-slate-600 font-bold">{note.date}</td>
                      <td className="p-3.5 font-bold text-teal-700">{note.patientName}</td>
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{note.title}</p>
                        <p className="text-[10px] text-slate-400">{note.providerName}</p>
                      </td>
                      <td className="p-3.5 text-slate-600">{note.author}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          note.status === 'SIGNED' || note.status === 'SIGNED_LOCKED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {note.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => navigate(`/clinical-notes/${note.id}`)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs inline-flex items-center gap-1 transition cursor-pointer"
                        >
                          Open Note <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
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
