import React, { useState, useEffect } from 'react';
import { 
  Brain, FileText, Calendar, PlusCircle, DollarSign, CheckCircle2, 
  ChevronRight, Users, Clock, Stethoscope, Tag, HeartPulse, Printer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CounselorSessionModal } from '../../components/modals/CounselorSessionModal';
import { mockClinicalNoteService } from '../../services/mock/mockClinicalNoteService';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { formatCurrency } from '../../utils/billingCalculations';

export const CounselorDashboard = () => {
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [counselorTotal, setCounselorTotal] = useState(1140.00);
  const navigate = useNavigate();

  useEffect(() => {
    mockClinicalNoteService.getNotes().then(setNotes).catch(() => {});
    mockBillingService.getOverviewStats().then(res => {
      const cProv = res?.providers?.find(p => p.name?.toLowerCase().includes('counselor'));
      if (cProv?.total) setCounselorTotal(cProv.total);
    }).catch(() => {});
  }, []);

  const signedNotesCount = notes.filter(n => (n.providerId === 'prov-counselor' || n.providerName?.toLowerCase().includes('counselor')) && n.status === 'SIGNED_LOCKED').length || 3;

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
          <p className="text-2xl font-bold text-slate-900 font-tabular">4 Active</p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Today: 1 Psychotherapy (45 min)
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
          <p className="text-2xl font-bold text-slate-900 font-tabular">{signedNotesCount} Signed</p>
          <p className="text-[11px] text-teal-700 font-semibold">ICD-10 &amp; DSM-5 Mapped</p>
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
            <button onClick={() => navigate('/appointments/calendar')} className="text-xs font-bold text-teal-700 hover:underline">
              View Calendar
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 text-sm block">SAMPLE TESTING (Demo Patient 001)</strong>
                <p className="text-slate-500">Case: CASE-2025-1227 | Post-MVA Anxiety &amp; PTSD</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-bold text-[10px]">
                    CPT 90834 (45 Min)
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                    ICD: F43.10, F41.1
                  </span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/clinical-notes/counselor-session')} 
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-sm transition"
              >
                Open Note
              </button>
            </div>
          </div>
        </div>

        {/* Counselor Billing & Document Operations */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" /> Counselor Billing &amp; Legal Packet
            </h2>
            <button onClick={() => navigate('/billing/four-bills')} className="text-xs font-bold text-teal-700 hover:underline">
              4-Bills Ledger
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div 
              onClick={() => navigate('/billing/bills/bill-counselor-001')}
              className="p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-200 cursor-pointer transition flex items-center justify-between"
            >
              <div>
                <strong className="text-slate-900">Itemized Billing Statement (#1024-C)</strong>
                <p className="text-slate-500">Total Charges: $1,140.00 | Balance Due: $1,140.00</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div 
              onClick={() => navigate('/cms-1500/bill-counselor-001/preview')}
              className="p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-xl border border-slate-200 cursor-pointer transition flex items-center justify-between"
            >
              <div>
                <strong className="text-slate-900">CMS-1500 Professional Claim (Counselor)</strong>
                <p className="text-slate-500">Box 21 Diagnoses (F43.10) &amp; Box 24 CPT (90791, 90834)</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div 
              onClick={() => navigate('/documents/packets')}
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
      />
    </div>
  );
};
