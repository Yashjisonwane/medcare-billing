import React, { useState, useEffect } from 'react';
import { 
  Brain, FileText, Calendar, PlusCircle, DollarSign, CheckCircle2, 
  ChevronRight, Users, Clock, Stethoscope, Tag, HeartPulse, Printer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CounselorSessionModal } from '../../components/modals/CounselorSessionModal';
import { apiClinicalNoteService } from '../../services/api/apiClinicalNoteService';
import { apiCaseService } from '../../services/api/apiCaseService';
import { apiAppointmentService } from '../../services/api/apiAppointmentService';
import { apiBillingService } from '../../services/api/apiBillingService';
import { formatCurrency } from '../../utils/billingCalculations';
import { useSettings } from '../../utils/settingsCache';

export const CounselorDashboard = () => {
  const settings = useSettings();
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [cases, setCases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [counselorTotal, setCounselorTotal] = useState(1140.00);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [notesRes, casesRes, apptsRes] = await Promise.all([
        apiClinicalNoteService.getNotes().catch(() => []),
        apiCaseService.getCases().catch(() => []),
        apiAppointmentService.getAllAppointments().catch(() => []),
      ]);

      const noteList = Array.isArray(notesRes) ? notesRes : (notesRes?.value || []);
      setNotes(noteList);
      setCases(casesRes || []);
      setAppointments(Array.isArray(apptsRes) ? apptsRes : (apptsRes?.appointments || []));
    } catch (err) {
      console.error('Failed to load counselor dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const counselorNotes = notes.filter(n => n.providerId === 'prov-counselor' || n.providerName?.toLowerCase().includes('counselor') || n.type === 'COUNSELOR_GENERIC');
  const signedNotesCount = counselorNotes.filter(n => n.status === 'SIGNED_LOCKED' || n.status === 'SIGNED').length;

  const counselorAppts = appointments.filter(a => a.providerId === 'prov-counselor' || a.providerName?.toLowerCase().includes('counselor') || a.appointmentType?.toLowerCase().includes('psychotherapy'));
  const activeSessionsCount = counselorAppts.length > 0 ? counselorAppts.length : 4;

  const counselorCases = cases.filter(c => 
    c.assignedProviderIds?.includes('prov-counselor') || 
    c.assignedProviderIds?.includes('COUNSELOR') || 
    c.diagnosisCodes?.some?.(d => String(d).startsWith('F'))
  );
  const displayCases = counselorCases.length > 0 ? counselorCases : cases.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Counselor &amp; Behavioral Health Dashboard</h1>
              <p className="text-xs text-slate-500">Post-accident psychological trauma intake, psychotherapy sessions &amp; billing statements</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => navigate('/billing/bills/bill-counselor-001')} 
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <DollarSign className="w-4 h-4 text-emerald-600" /> Counselor Bill (#1024-C)
          </button>
          <button 
            onClick={() => setShowSessionModal(true)} 
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> New Counseling Note
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Scheduled Sessions</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-tabular">{activeSessionsCount} Active</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Psychotherapy &amp; Intake Queue
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Counselor Total Charges</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-tabular">{formatCurrency(counselorTotal)}</p>
          <p className="text-[11px] text-slate-500">Itemized Service Lines (Bill Statement)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Clinical Progress Notes</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-tabular">{counselorNotes.length > 0 ? counselorNotes.length : 3} Notes</p>
          <p className="text-[11px] text-teal-700 font-semibold">{signedNotesCount} Signed &bull; ICD-10 &amp; DSM-5</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Master Document Packet</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Printer className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-tabular">4 Pages</p>
          <p className="text-[11px] text-purple-700 font-semibold">Cover, Notes, Statement, CMS-1500</p>
        </div>
      </div>

      {/* Quick Action Clinical & Billing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Today's Counseling Roster */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" /> Patient Counseling Queue
            </h2>
            <button onClick={() => navigate('/appointments/calendar')} className="text-xs font-bold text-teal-700 hover:underline cursor-pointer">
              View Calendar
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {displayCases.map((c) => (
              <div key={c.id || c.caseId} className="p-3.5 bg-slate-50 hover:bg-indigo-50/40 rounded-xl border border-slate-200 flex items-center justify-between transition">
                <div>
                  <strong className="text-slate-900 text-sm block">{c.patientName || 'Accident Patient'}</strong>
                  <p className="text-slate-500">Case: {c.caseId || c.id} | DOA: {c.accidentDate || 'N/A'}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-bold text-[10px]">
                      CPT 90834 (45 Min)
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                      ICD: F43.10, F41.1
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSessionModal(true)} 
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-sm transition cursor-pointer"
                >
                  Open Note
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Counselor Billing & Document Operations */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" /> Counselor Billing &amp; Legal Packet
            </h2>
            <button onClick={() => navigate('/billing/provider-bills')} className="text-xs font-bold text-teal-700 hover:underline cursor-pointer">
              Provider Bills Ledger
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div 
              onClick={() => navigate('/billing/provider-bills')}
              className="p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-200 cursor-pointer transition flex items-center justify-between"
            >
              <div>
                <strong className="text-slate-900">Itemized Billing Statement (#1024-C)</strong>
                <p className="text-slate-500">Total Charges: {formatCurrency(1140)} | Balance Due: {formatCurrency(1140)}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div 
              onClick={() => navigate('/cms-1500')}
              className="p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-200 cursor-pointer transition flex items-center justify-between"
            >
              <div>
                <strong className="text-slate-900">CMS-1500 Professional Claim (Counselor)</strong>
                <p className="text-slate-500">Box 21 Diagnoses (F43.10) &amp; Box 24 CPT (90791, 90834)</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div 
              onClick={() => navigate('/documents')}
              className="p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-200 cursor-pointer transition flex items-center justify-between"
            >
              <div>
                <strong className="text-slate-900">4-Page Printable Legal Document Packet</strong>
                <p className="text-slate-500">Cover Page, Psychotherapy Assessment, Bill, and CMS-1500</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Counselor Session Modal */}
      <CounselorSessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onNoteSaved={() => loadData()}
      />
    </div>
  );
};
