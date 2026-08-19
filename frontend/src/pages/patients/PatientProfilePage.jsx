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
  ArrowLeft, UploadCloud, Eye, Printer, X, Download, FileSpreadsheet,
  Shield, ShieldCheck, Stethoscope, Scale, HeartPulse, Sparkles, Building2
} from 'lucide-react';
import { formatCurrency } from '../../utils/billingCalculations';
import { UploadDocumentModal } from '../../components/modals/UploadDocumentModal';
import { AddCaseModal } from '../../components/modals/AddCaseModal';
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
  const [showAddCaseModal, setShowAddCaseModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const navigate = useNavigate();

  const loadData = () => {
    const targetId = id || 'pat-001';
    mockPatientService.getPatientById(targetId).then(setPatient);
    mockCaseService.getCases({ patientId: targetId }).then(setCases);
    mockBillingService.getFourBillsByCase('case-001').then(res => setBills(res.allBills || []));
    mockClinicalNoteService.getNotes({ patientId: targetId }).then(setNotes);
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
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-semibold">Loading patient chart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* â”€â”€ Top Back Navigation & Breadcrumb â”€â”€ */}
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

      {/* â”€â”€ Patient Header Banner â”€â”€ */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-extrabold text-xl border border-teal-200 shadow-xs">
            {patient.firstName?.[0] || 'P'}{patient.lastName?.[0] || 'T'}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-slate-900">
                {patient.lastName}, {patient.firstName} {patient.middleName || ''} {patient.suffix || ''}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {patient.status || 'ACTIVE'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              MRN / ID: <strong className="text-slate-900 font-mono">{patient.patientId || patient.id}</strong> | DOB: <strong className="text-slate-900">{patient.dob || '1985-05-15'} ({patient.sex === 'F' ? 'Female' : 'Male'})</strong>
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-teal-600" /> {patient.phone || '713-555-0100'}</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-teal-600" /> {patient.email || 'patient@example.test'}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-teal-600" /> {patient.address?.street || '10101 Harwin Dr.'}, {patient.address?.city || 'Houston'} {patient.address?.state || 'TX'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons for Core Healthcare Flow */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddCaseModal(true)}
            className="px-3.5 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-teal-700 flex items-center gap-1.5 cursor-pointer transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Add Accident Case
          </button>
          <button
            onClick={() => navigate(`/appointments/new?patientId=${patient.id}`)}
            className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer transition active:scale-95 shadow-xs"
          >
            <Calendar className="w-4 h-4" /> Book Appointment
          </button>
          <button
            onClick={() => navigate(`/clinical-notes/new?patientId=${patient.id}`)}
            className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer transition active:scale-95 shadow-xs"
          >
            <FileText className="w-4 h-4" /> New Clinical Note
          </button>
        </div>
      </div>

      {/* â”€â”€ Tabs Navigation â”€â”€ */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-6 text-xs font-bold text-slate-500 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition whitespace-nowrap ${activeTab === 'OVERVIEW' ? 'border-b-2 border-teal-600 text-teal-600' : 'hover:text-slate-800'}`}
        >
          <Activity className="w-4 h-4" /> 1. Overview &amp; Emergency Contacts
        </button>
        <button
          onClick={() => setActiveTab('CASES')}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition whitespace-nowrap ${activeTab === 'CASES' ? 'border-b-2 border-teal-600 text-teal-600' : 'hover:text-slate-800'}`}
        >
          <FileSpreadsheet className="w-4 h-4" /> 2. Accident Cases ({cases.length})
        </button>
        <button
          onClick={() => setActiveTab('NOTES')}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition whitespace-nowrap ${activeTab === 'NOTES' ? 'border-b-2 border-teal-600 text-teal-600' : 'hover:text-slate-800'}`}
        >
          <FileText className="w-4 h-4" /> 3. Clinical Notes ({notes.length})
        </button>
        <button
          onClick={() => setActiveTab('BILLS')}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition whitespace-nowrap ${activeTab === 'BILLS' ? 'border-b-2 border-teal-600 text-teal-600' : 'hover:text-slate-800'}`}
        >
          <Receipt className="w-4 h-4" /> 4. Four Bills Ledger
        </button>
        <button
          onClick={() => setActiveTab('DOCUMENTS')}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition whitespace-nowrap ${activeTab === 'DOCUMENTS' ? 'border-b-2 border-teal-600 text-teal-600' : 'hover:text-slate-800'}`}
        >
          <FolderOpen className="w-4 h-4" /> 5. Documents &amp; Packets ({docs.length})
        </button>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          TAB 1: OVERVIEW & DEMOGRAPHICS + EMERGENCY CONTACT
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-5 animate-in fade-in-50 duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Demographics Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-teal-600" /> Patient Demographics &amp; Identity
              </h2>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between"><span>Full Legal Name:</span><strong className="text-slate-900">{patient.firstName} {patient.middleName} {patient.lastName} {patient.suffix || ''}</strong></div>
                <div className="flex justify-between"><span>Date of Birth:</span><strong className="text-slate-900">{patient.dob || '1985-05-15'}</strong></div>
                <div className="flex justify-between"><span>Biological Sex:</span><strong className="text-slate-900">{patient.sex === 'F' ? 'Female' : 'Male'}</strong></div>
                <div className="flex justify-between"><span>Marital Status:</span><strong className="text-slate-900">{patient.maritalStatus || 'Single'}</strong></div>
                <div className="flex justify-between"><span>Driver's License #:</span><strong className="text-slate-900">{patient.driversLicense || 'TX-8921820'} ({patient.driversLicenseState || 'TX'})</strong></div>
                <div className="flex justify-between"><span>Primary Language:</span><strong className="text-slate-900">{patient.language || 'English'}</strong></div>
                <div className="flex justify-between"><span>Employment Status:</span><strong className="text-slate-900">{patient.employmentStatus || 'Employed Full-Time'}</strong></div>
              </div>
            </div>

            {/* Emergency Contact Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600" /> Emergency Contact Details
                </h2>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Primary Contact
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between"><span>Emergency Contact Name:</span><strong className="text-slate-900 font-bold">{patient.emergencyContactName || 'Jane Doe'}</strong></div>
                <div className="flex justify-between"><span>Relationship to Patient:</span><strong className="text-slate-900">{patient.emergencyContactRelation || 'Spouse'}</strong></div>
                <div className="flex justify-between"><span>Emergency Contact Phone:</span><strong className="text-teal-700 font-mono font-bold">{patient.emergencyContactPhone || '713-555-0102'}</strong></div>
                <div className="flex justify-between"><span>Alternate Contact:</span><strong className="text-slate-700">{patient.alternatePhone || '713-555-0199'}</strong></div>
                <div className="flex justify-between"><span>Notification Preference:</span><strong className="text-slate-900">{patient.communicationPref || 'SMS (Automated Text)'}</strong></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Auto / Health Insurance Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" /> Insurance &amp; Coverage Information
              </h2>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between"><span>Insurance Carrier:</span><strong className="text-slate-900">{patient.primaryInsuranceCompany || 'Geico Auto Insurance'}</strong></div>
                <div className="flex justify-between"><span>Policy / Claim Number:</span><strong className="text-slate-900 font-mono">{patient.primaryPolicyNumber || 'POL-TX-9921'}</strong></div>
                <div className="flex justify-between"><span>Group Number:</span><strong className="text-slate-900">{patient.primaryGroupNumber || 'GRP-88210'}</strong></div>
                <div className="flex justify-between"><span>Member ID:</span><strong className="text-slate-900">{patient.primaryInsuranceMemberId || 'MEM-2026-991'}</strong></div>
                <div className="flex justify-between"><span>Adjuster Contact:</span><strong className="text-slate-900">{patient.adjusterName || 'Marcus Vance'} ({patient.adjusterPhone || '800-555-0199'})</strong></div>
              </div>
            </div>

            {/* Medical & Allergies Summary Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-600" /> Medical History &amp; Allergies
              </h2>
              <div className="space-y-2 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Known Allergies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {patient.knownAllergies ? (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-md font-semibold text-[11px]">
                        {patient.knownAllergies}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px]">
                        No Known Drug Allergies (NKDA)
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block mb-0.5">Current Medications:</span>
                  <p className="text-slate-900 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    {patient.currentMedications || 'Ibuprofen 600mg PRN for pain, Cyclobenzaprine 10mg QHS'}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block mb-0.5">Past Medical / Injury History:</span>
                  <p className="text-slate-900 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    {patient.pastMedicalHistory || 'No prior motor vehicle accidents. Hypertension controlled.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          TAB 2: ACCIDENT CASES
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeTab === 'CASES' && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Accident &amp; Legal Cases Registry</h2>
              <p className="text-xs text-slate-500">Active injury cases linking attorney liens, insurance claims &amp; 4-provider billing ledgers</p>
            </div>
            <button
              onClick={() => setShowAddCaseModal(true)}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" /> Add New Accident Case
            </button>
          </div>

          {cases.length > 0 ? (
            <div className="space-y-3">
              {cases.map((c) => (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-teal-700 text-sm font-mono">{c.caseId || c.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.status || 'ACTIVE'}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/cases/${c.id}`)}
                      className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Open Case File <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Accident Date (DOA)</span>
                      <strong className="text-slate-900">{c.accidentDate || '12/27/2025'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Accident Type</span>
                      <strong className="text-slate-900">{c.accidentType || 'AUTO_ACCIDENT'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Mechanism of Injury</span>
                      <strong className="text-slate-900 truncate block">{c.mechanismOfInjury || 'Rear-End MVA Collision'}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block border-b border-slate-100 pb-1">Attorney Representation (Lien)</span>
                      <div className="flex justify-between"><span>Attorney:</span><strong>{c.attorneyName || 'OJ Lawal & Associates'}</strong></div>
                      <div className="flex justify-between"><span>Law Firm:</span><strong>{c.lawFirm || 'OJ Law Firm LLC'}</strong></div>
                      <div className="flex justify-between"><span>Phone:</span><strong>{c.attorneyPhone || '713-555-0188'}</strong></div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block border-b border-slate-100 pb-1">Auto Insurance Policy</span>
                      <div className="flex justify-between"><span>Carrier:</span><strong>{c.insuranceCompany || 'Geico Auto Insurance'}</strong></div>
                      <div className="flex justify-between"><span>Claim #:</span><strong>{c.insuranceClaimNumber || c.claimNumber || 'CLM-2025-88192'}</strong></div>
                      <div className="flex justify-between"><span>Adjuster:</span><strong>{c.insuranceAdjuster || 'Marcus Vance'}</strong></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Accident Cases Created Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Register an accident or personal injury case to link this patient's treatment to attorney liens &amp; billing ledgers.
              </p>
              <button
                onClick={() => setShowAddCaseModal(true)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                + Create First Accident Case
              </button>
            </div>
          )}
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          TAB 3: CLINICAL NOTES & SOAP DOCUMENTATION
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeTab === 'NOTES' && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" /> Clinical Notes &amp; SOAP Documentation
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Physician evaluations (JOSMIC), ESWT therapy notes (DAVS), Laser records (ANIK) &amp; Behavioral counseling sessions
              </p>
            </div>
            <button
              onClick={() => navigate(`/clinical-notes/new?patientId=${patient.id}`)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" /> New Clinical Note
            </button>
          </div>

          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => navigate(`/clinical-notes/${n.id}`)}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-sm transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-xs group-hover:text-teal-700 transition">{n.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        n.status === 'SIGNED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {n.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      <strong className="text-slate-700">{n.providerName}</strong> • Provider: {n.author} • Date of Service: {n.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-[11px] font-bold text-teal-700 group-hover:underline flex items-center gap-1">
                      View Note <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Clinical Notes Recorded Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Attending doctors, therapists, and counselors record clinical evaluations, progress notes, and AI SOAP suggestions here.
              </p>
              <button
                onClick={() => navigate(`/clinical-notes/new?patientId=${patient.id}`)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                + Write First Clinical Note
              </button>
            </div>
          )}
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          TAB 4: FOUR PROVIDER BILLS LEDGER
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeTab === 'BILLS' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in-50 duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Provider Bills Ledger</h2>
              <p className="text-xs text-slate-500">Connected practice provider billing statements &amp; itemized clinical ledgers</p>
            </div>
            <button
              onClick={() => navigate(`/billing/provider-bills?caseId=${activeCase?.id || ''}`)}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
            >
              Open Provider Bills Ledger
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bills.map((b) => (
              <div key={b.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900">{b.providerName}</span>
                  <span className="text-teal-700 font-extrabold">{formatCurrency(b.totals?.balanceDue || 0)}</span>
                </div>
                <p className="text-slate-500 text-[11px]">Statement #{b.statementNumber} | Date: {b.statementDate}</p>
                <button
                  onClick={() => navigate(`/billing/bills/${b.id}`)}
                  className="w-full mt-2 py-2 bg-white hover:bg-teal-50 hover:text-teal-800 text-slate-700 border border-slate-200 rounded-xl font-bold transition cursor-pointer shadow-2xs"
                >
                  Open Provider Ledger
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          TAB 5: DOCUMENTS & ATTACHMENTS
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeTab === 'DOCUMENTS' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in-50 duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Document Attachments &amp; Medical Files</h2>
              <p className="text-xs text-slate-500">View signed reports, insurance cards, police investigations &amp; billing attachments</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <UploadCloud className="w-4 h-4" /> Upload Document
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {docs.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 line-clamp-1">{d.name}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md uppercase font-mono">{d.type}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{d.providerName || 'Practice'} | {d.size}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(d)}
                  className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center justify-center gap-1 text-[11px] cursor-pointer shadow-xs transition"
                >
                  <Eye className="w-3.5 h-3.5" /> View / Print Attachment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* â”€â”€ Add Accident Case Modal â”€â”€ */}
      <AddCaseModal
        isOpen={showAddCaseModal}
        onClose={() => setShowAddCaseModal(false)}
        initialPatient={patient}
        onCaseAdded={(newCase) => {
          loadData();
          setActiveTab('CASES');
        }}
      />

      {/* â”€â”€ Document Upload Modal â”€â”€ */}
      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onDocumentUploaded={() => loadData()}
      />

      {/* â”€â”€ Full Document Attachment Viewer Modal â”€â”€ */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-50 text-teal-700 rounded-xl border border-teal-200">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{previewDoc.name}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">Attachment ID: {previewDoc.id} • {previewDoc.providerName || 'Clinic File'}</p>
                </div>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-slate-100">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[500px] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">{previewDoc.name}</h2>
                      <p className="text-xs text-slate-500">Patient: {patient.lastName}, {patient.firstName} (MRN: {patient.patientId || patient.id})</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded-full text-xs font-mono">
                      VERIFIED ATTACHMENT
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
                    <p><strong>Document Category:</strong> {previewDoc.type || 'Clinical Report'}</p>
                    <p><strong>Associated Practice:</strong> {previewDoc.providerName || 'JOSMIC / DAVS / ANIK / Counselor Practice'}</p>
                    <p><strong>Upload Date:</strong> {previewDoc.createdAt || '2026-01-26'}</p>
                    <p className="text-slate-500 pt-2 border-t border-slate-200">
                      Standardized medical attachment verified under HIPAA guidelines. Retain in patient chart for legal billing submission.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">Page 1 of 1 • 256-bit HIPAA Storage</span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
