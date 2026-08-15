// src/pages/patients/PatientProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { mockPatientService } from '../../services/mock/mockPatientService';
import { mockCaseService } from '../../services/mock/mockCaseService';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { mockClinicalNoteService } from '../../services/mock/mockClinicalNoteService';
import { mockDocumentService } from '../../services/mock/mockDocumentService';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Phone, Mail, MapPin, Calendar, FileText, Receipt, 
  FolderOpen, Activity, PlusCircle, ChevronRight, AlertCircle, 
  ArrowLeft, UploadCloud, Eye, Printer, X, Download, FileSpreadsheet, Paperclip 
} from 'lucide-react';
import { formatCurrency } from '../../utils/billingCalculations';
import { UploadDocumentModal } from '../../components/modals/UploadDocumentModal';
import { UnifiedPacketViewer } from '../../components/packets/UnifiedPacketViewer';

export const PatientProfilePage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [cases, setCases] = useState([]);
  const [bills, setBills] = useState([]);
  const [notes, setNotes] = useState([]);
  const [docs, setDocs] = useState([]);
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const navigate = useNavigate();

  const loadData = () => {
    mockPatientService.getPatientById(id || 'pat-001').then(setPatient);
    mockCaseService.getCases({ patientId: id || 'pat-001' }).then(setCases);
    mockBillingService.getFourBillsByCase('case-001').then(res => setBills(res.allBills));
    mockClinicalNoteService.getNotes({ patientId: id || 'pat-001' }).then(setNotes);
    mockDocumentService.getDocuments().then(setDocs);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const getProviderId = (providerName, docName) => {
    const combined = `${providerName || ''} ${docName || ''}`.toUpperCase();
    if (combined.includes('ANIK') || combined.includes('LASER')) return 'prov-anik';
    if (combined.includes('DAV') || combined.includes('SHOCKWAVE') || combined.includes('ESWT')) return 'prov-davs';
    if (combined.includes('JOSMIC') || combined.includes('PAIN')) return 'prov-josmic';
    if (combined.includes('COUNSELOR') || combined.includes('BEHAVIORAL') || combined.includes('HOPE')) return 'prov-counselor';
    return 'prov-josmic';
  };

  if (!patient) {
    return <div className="p-8 text-center text-xs text-on-surface-variant">Loading patient profile...</div>;
  }

  return (
    <div className="space-y-4">
      {/* ── Top Back Navigation & Breadcrumb ── */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate('/patients')}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-xs hover:border-teal-500 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-teal-600" /> Back to Patients List
        </button>
        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          <span className="hover:underline cursor-pointer text-slate-600 font-semibold" onClick={() => navigate('/patients')}>Patients</span>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="text-teal-700 font-bold">{patient.lastName}, {patient.firstName}</span>
        </div>
      </div>

      {/* Patient Header Banner */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary-container/10 text-secondary-container flex items-center justify-center font-bold text-xl border border-secondary-container/20">
            {patient.firstName[0]}{patient.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-on-surface">{patient.lastName}, {patient.firstName} {patient.middleName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                {patient.status}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">Patient ID: <strong className="text-on-surface font-mono">{patient.patientId}</strong> | DOB: <strong className="text-on-surface">{patient.dob} ({patient.sex})</strong></p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant mt-2">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-secondary-container" /> {patient.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-secondary-container" /> {patient.email}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-secondary-container" /> {patient.address?.street}, {patient.address?.city}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => navigate('/cases/new')} className="px-3.5 py-2 bg-secondary-container text-white text-xs font-bold rounded-xl shadow hover:bg-secondary flex items-center gap-1.5 cursor-pointer">
            <PlusCircle className="w-4 h-4" /> Add Accident Case
          </button>
          <button onClick={() => navigate('/appointments/new')} className="px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container flex items-center gap-1.5 cursor-pointer">
            <Calendar className="w-4 h-4" /> Book Appointment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant gap-6 text-xs font-bold text-on-surface-variant overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition ${activeTab === 'OVERVIEW' ? 'border-b-2 border-secondary-container text-secondary-container' : 'hover:text-on-surface'}`}
        >
          <Activity className="w-4 h-4" /> Overview
        </button>
        <button
          onClick={() => setActiveTab('CASES')}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition ${activeTab === 'CASES' ? 'border-b-2 border-secondary-container text-secondary-container' : 'hover:text-on-surface'}`}
        >
          <FileSpreadsheet className="w-4 h-4" /> Accident Cases ({cases.length})
        </button>
        <button
          onClick={() => setActiveTab('NOTES')}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition ${activeTab === 'NOTES' ? 'border-b-2 border-secondary-container text-secondary-container' : 'hover:text-on-surface'}`}
        >
          <FileText className="w-4 h-4" /> Clinical Notes ({notes.length})
        </button>
        <button
          onClick={() => setActiveTab('BILLS')}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition ${activeTab === 'BILLS' ? 'border-b-2 border-secondary-container text-secondary-container' : 'hover:text-on-surface'}`}
        >
          <Receipt className="w-4 h-4" /> Four Bills Ledger
        </button>
        <button
          onClick={() => setActiveTab('DOCUMENTS')}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition ${activeTab === 'DOCUMENTS' ? 'border-b-2 border-secondary-container text-secondary-container' : 'hover:text-on-surface'}`}
        >
          <FolderOpen className="w-4 h-4" /> Documents &amp; Attachments ({docs.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <h2 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-secondary-container" /> Active Accident Case
              </h2>
              <button onClick={() => setActiveTab('CASES')} className="text-xs font-bold text-secondary-container hover:underline">View All</button>
            </div>
            {cases[0] ? (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-on-surface-variant">Case ID:</span><span className="font-bold text-teal-700">{cases[0].caseId}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Accident Date:</span><span className="font-semibold">{cases[0].accidentDate}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Injury Mechanism:</span><span className="font-semibold">{cases[0].mechanismOfInjury}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Attorney:</span><span className="font-bold text-on-surface">{cases[0].attorneyName} ({cases[0].lawFirm})</span></div>
              </div>
            ) : <p className="text-xs text-on-surface-variant">No active cases</p>}
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <h2 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <Receipt className="w-4 h-4 text-secondary-container" /> Four Provider Bills Summary
              </h2>
              <button onClick={() => navigate('/billing/four-bills')} className="text-xs font-bold text-secondary-container hover:underline">Open Bills</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {bills.map(b => (
                <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-900 truncate">{b.providerName}</p>
                  <p className="text-sm font-extrabold text-teal-700 mt-1 font-tabular">{formatCurrency(b.totals.balanceDue)}</p>
                  <span className="text-[10px] text-slate-500 font-semibold">{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'CASES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface">Accident Case Registry</h2>
            <button onClick={() => navigate('/cases/new')} className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm">
              <PlusCircle className="w-4 h-4" /> Add New Accident Case
            </button>
          </div>
          {cases.map((c) => (
            <div key={c.id} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-secondary-container text-sm">{c.caseId}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">{c.status}</span>
              </div>
              <p className="text-on-surface-variant">Accident Date: {c.accidentDate} | Type: {c.accidentType}</p>
              <p className="text-on-surface">Attorney: <strong>{c.attorneyName}</strong> ({c.lawFirm})</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'NOTES' && (
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
          <h2 className="text-base font-bold text-on-surface">Clinical Documentation History</h2>
          <div className="space-y-3">
            {notes.map((n) => (
              <div key={n.id} className="p-4 rounded-xl border border-outline-variant bg-surface flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-on-surface">{n.title}</h3>
                  <p className="text-[11px] text-on-surface-variant">{n.providerName} | Author: {n.author} | Date: {n.date}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">{n.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'BILLS' && (
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
          <h2 className="text-base font-bold text-on-surface">Four Provider Bills Ledger</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bills.map((b) => (
              <div key={b.id} className="p-4 bg-surface rounded-xl border border-outline-variant space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-secondary-container">{b.providerName}</span>
                  <span className="text-emerald-600">{formatCurrency(b.totals.balanceDue)}</span>
                </div>
                <p className="text-on-surface-variant">Statement #{b.statementNumber} | Date: {b.statementDate}</p>
                <button onClick={() => navigate(`/billing/bills/${b.id}`)} className="w-full mt-2 py-1.5 bg-secondary-container hover:bg-secondary text-white rounded-xl font-bold cursor-pointer transition">
                  Open Provider Ledger
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── DOCUMENTS TAB (WITH UPLOAD & FULL PDF PREVIEW) ── */}
      {activeTab === 'DOCUMENTS' && (
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant pb-3">
            <div>
              <h2 className="text-base font-bold text-on-surface">Document Attachments &amp; Medical Files</h2>
              <p className="text-xs text-slate-500">View signed reports, insurance cards, police investigations &amp; billing attachments</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <UploadCloud className="w-4 h-4" /> Upload Document
            </button>
          </div>

          <div className="space-y-2.5">
            {docs.map((d) => (
              <div key={d.id} className="p-3.5 bg-surface hover:bg-slate-50/80 rounded-xl border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition">
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate hover:text-teal-700 cursor-pointer" onClick={() => setPreviewDoc(d)}>
                      {d.name}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-700">{d.providerName}</span> • <span className="text-teal-700 font-medium">{d.type}</span> • <span className="font-mono text-slate-400">{d.size || '1.2 MB'}</span> • <span className="text-slate-400">{d.date || '01/26/2026'}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => setPreviewDoc(d)}
                    className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition cursor-pointer border border-teal-200"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-600" /> View Demo PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── UPLOAD DOCUMENT MODAL ── */}
      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        patientId={patient.patientId}
        patientName={`${patient.lastName}, ${patient.firstName}`}
        onDocumentUploaded={() => {
          loadData();
        }}
      />

      {/* ── FULL SCREEN INTERACTIVE PDF PREVIEW MODAL ── */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl h-[95vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30 flex-shrink-0">
                  LIVE PDF DOCUMENT
                </span>
                <div className="min-w-0">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-100 truncate">{previewDoc.name}</h2>
                  <p className="text-[10px] text-slate-400 truncate">{previewDoc.providerName} • {previewDoc.type}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-400" /> Print PDF
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Viewer Body */}
            <div className="flex-1 overflow-auto bg-slate-950 p-2 sm:p-4">
              <UnifiedPacketViewer
                providerId={getProviderId(previewDoc.providerName, previewDoc.name)}
                initialBlank={false}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
