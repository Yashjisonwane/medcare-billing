// src/components/modals/PatientDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { 
  User, Phone, Mail, MapPin, Calendar, FileText, Activity, 
  ShieldCheck, ChevronRight, ExternalLink, Receipt, FolderOpen, 
  Stethoscope, Clock, DollarSign, Brain, HeartPulse, CheckCircle2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { mockClinicalNoteService } from '../../services/mock/mockClinicalNoteService';
import { formatCurrency } from '../../utils/billingCalculations';

export const PatientDetailsModal = ({ isOpen, onClose, patient }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [bills, setBills] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (patient) {
      mockBillingService.getFourBillsByCase('case-001').then(res => setBills(res.allBills || []));
      mockClinicalNoteService.getNotes({ patientId: patient.id || 'pat-001' }).then(setNotes);
    }
  }, [patient]);

  if (!patient) return null;

  const handleOpenFullProfile = () => {
    onClose();
    navigate(`/patients/${patient.id}/profile`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${patient.lastName || ''}, ${patient.firstName || ''} ${patient.middleName || ''}`}
      subtitle={`Patient ID: ${patient.patientId || patient.id} | DOB: ${patient.dob} (${patient.sex || 'M'})`}
      icon={User}
      size="2xl"
      iconColor="text-teal-700"
      iconBg="bg-teal-50"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleOpenFullProfile}
            className="w-full sm:w-auto px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open Full Patient Profile
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Top Summary Banner */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-lg border border-teal-500/30 flex-shrink-0">
              {patient.firstName?.[0] || 'P'}{patient.lastName?.[0] || 'T'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {patient.lastName}, {patient.firstName}
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-bold text-[10px]">
                  {patient.status || 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                DOB: <strong className="text-slate-200">{patient.dob}</strong> | SSN: <strong className="text-slate-200">{patient.ssn || '***-**-1234'}</strong> | DL: <strong className="text-slate-200">{patient.driversLicense || 'TX-8921820'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:text-right border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Practice A/R</span>
              <strong className="text-white text-base sm:text-lg font-mono">$24,960.00</strong>
              <p className="text-[10px] text-teal-300">4 Connected Provider Bills</p>
            </div>
          </div>
        </div>

        {/* Responsive Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 touch-scroll">
          {[
            { id: 'OVERVIEW', label: '1. Demographics & Contact', icon: User },
            { id: 'CASES', label: '2. Accident Case & Lien', icon: FileText },
            { id: 'BILLS', label: '3. Four Bills Ledger ($24.9k)', icon: Receipt },
            { id: 'NOTES', label: '4. Clinical Notes', icon: Brain },
            { id: 'HISTORY', label: '5. Medical & Allergies', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Demographics & Contact */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                  <User className="w-4 h-4 text-teal-600" /> Patient Demographics
                </h4>
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex justify-between"><span>Full Legal Name:</span><strong className="text-slate-900">{patient.firstName} {patient.middleName} {patient.lastName} {patient.suffix || ''}</strong></div>
                  <div className="flex justify-between"><span>Date of Birth:</span><strong className="text-slate-900">{patient.dob}</strong></div>
                  <div className="flex justify-between"><span>Gender / Sex:</span><strong className="text-slate-900">{patient.sex === 'F' ? 'Female' : 'Male'}</strong></div>
                  <div className="flex justify-between"><span>Marital Status:</span><strong className="text-slate-900">{patient.maritalStatus || 'Single'}</strong></div>
                  <div className="flex justify-between"><span>Driver's License:</span><strong className="text-slate-900">{patient.driversLicense || 'TX-8921820'} ({patient.driversLicenseState || 'TX'})</strong></div>
                  <div className="flex justify-between"><span>Preferred Language:</span><strong className="text-slate-900">{patient.language || 'English'}</strong></div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Phone className="w-4 h-4 text-teal-600" /> Contact Details &amp; Address
                </h4>
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex justify-between"><span>Mobile Phone:</span><strong className="text-slate-900">{patient.phone || '713-555-0100'}</strong></div>
                  <div className="flex justify-between"><span>Email Address:</span><strong className="text-slate-900 truncate max-w-[180px]">{patient.email || 'patient@example.test'}</strong></div>
                  <div className="flex justify-between"><span>Street Address:</span><strong className="text-slate-900">{patient.address?.street || '10101 Harwin Dr.'}</strong></div>
                  <div className="flex justify-between"><span>City / State / Zip:</span><strong className="text-slate-900">{patient.address?.city || 'Houston'}, {patient.address?.state || 'TX'} {patient.address?.zipCode || '77036'}</strong></div>
                  <div className="flex justify-between"><span>Communication Pref:</span><strong className="text-teal-700 font-bold">{patient.communicationPref || 'SMS (Text Reminders)'}</strong></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-amber-600" /> Emergency Contact
                </h4>
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between"><span>Contact Name:</span><strong className="text-slate-900">{patient.emergencyContactName || 'Jane Doe'}</strong></div>
                  <div className="flex justify-between"><span>Relationship:</span><strong className="text-slate-900">{patient.emergencyContactRelation || 'Spouse'}</strong></div>
                  <div className="flex justify-between"><span>Contact Phone:</span><strong className="text-slate-900">{patient.emergencyContactPhone || '713-555-0102'}</strong></div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" /> Auto Insurance Policy (PIP / MedPay)
                </h4>
                <div className="space-y-1 text-slate-700">
                  <div className="flex justify-between"><span>Insurance Carrier:</span><strong className="text-slate-900">{patient.primaryInsuranceCompany || 'State Farm Auto Insurance'}</strong></div>
                  <div className="flex justify-between"><span>Policy Number:</span><strong className="text-slate-900">{patient.primaryPolicyNumber || 'POL-TX-99281'}</strong></div>
                  <div className="flex justify-between"><span>Claim / Group #:</span><strong className="text-slate-900">{patient.primaryGroupNumber || 'CLM-88192'}</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Accident Case & Legal Lien */}
        {activeTab === 'CASES' && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" /> Active Motor Vehicle Accident Case (MVA)
                </h4>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                  CASE-2025-1227
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Date of Accident (DOA)</span>
                  <strong className="text-slate-900 text-sm">12/27/2025</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Accident Location</span>
                  <strong className="text-slate-900">Interstate 10, Houston TX</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Police Report #</span>
                  <strong className="text-slate-900">HPD-2025-889201</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block border-b border-slate-100 pb-1">Attorney &amp; Law Firm (Lien)</strong>
                  <div className="flex justify-between"><span>Attorney:</span><strong>OJ Lawal &amp; Associates</strong></div>
                  <div className="flex justify-between"><span>Law Firm:</span><strong>OJ Law Firm LLC</strong></div>
                  <div className="flex justify-between"><span>Firm Phone:</span><strong>713-555-0188</strong></div>
                  <div className="flex justify-between"><span>Status:</span><span className="text-teal-700 font-bold">Letter of Protection (LOP) Signed</span></div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block border-b border-slate-100 pb-1">Third-Party Auto Insurance</strong>
                  <div className="flex justify-between"><span>Carrier:</span><strong>Example Auto Insurance Co.</strong></div>
                  <div className="flex justify-between"><span>Claim #:</span><strong>CLM-2025-88192</strong></div>
                  <div className="flex justify-between"><span>Adjuster:</span><strong>James Wilson (800-555-0299)</strong></div>
                  <div className="flex justify-between"><span>Liability:</span><span className="text-emerald-700 font-bold">100% Accepted</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Four Bills Ledger */}
        {activeTab === 'BILLS' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-teal-600" /> Connected 4-Provider Bills Breakdown
              </h4>
              <button
                onClick={() => { onClose(); navigate('/billing/four-bills'); }}
                className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
              >
                Open Full 4-Bills Page <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: '1. JOSMIC Wellness Center', role: 'Pain Management Consultation', amount: 1214.00, cpt: '99204', st: 'Statement #1024-J' },
                { name: "2. DAV'S Anatomy", role: 'ESWT Shockwave Therapy (8 Sessions)', amount: 8000.00, cpt: '0101T', st: 'Statement #1024-D' },
                { name: '3. ANIK Laser Therapy', role: 'Laser Therapy + Supplies (6 Sessions)', amount: 14606.00, cpt: '97039, 10001, 97124', st: 'Statement #1024-A' },
                { name: '4. Counselor Practice (Hope Behavioral)', role: 'Individual Psychotherapy & PTSD', amount: 1140.00, cpt: '90791, 90834, 90837', st: 'Statement #1024-C' },
              ].map((b, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold">{b.name}</strong>
                    <span className="font-mono font-bold text-teal-800 text-sm">{formatCurrency(b.amount)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{b.role}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[10px]">
                    <span className="font-mono text-slate-600">CPT: {b.cpt}</span>
                    <span className="font-bold text-slate-700">{b.st}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between font-bold">
              <span>Grand Total Patient Case Billing:</span>
              <span className="text-base font-mono text-teal-300">$24,960.00</span>
            </div>
          </div>
        )}

        {/* Tab 4: Clinical Notes */}
        {activeTab === 'NOTES' && (
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-600" /> Patient Clinical Documents &amp; Notes
            </h4>
            
            <div className="space-y-2">
              {notes.map(n => (
                <div key={n.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <strong className="text-slate-900 block">{n.title}</strong>
                    <span className="text-slate-500 text-[11px]">{n.providerName} — Author: {n.author} ({n.date})</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px] self-start sm:self-auto">
                    {n.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Medical History & Allergies */}
        {activeTab === 'HISTORY' && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <strong className="text-slate-900 block border-b border-slate-200 pb-1">Known Allergies</strong>
                <p className="text-slate-700">{patient.knownAllergies || 'NKDA (No Known Drug Allergies)'}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <strong className="text-slate-900 block border-b border-slate-200 pb-1">Current Medications</strong>
                <p className="text-slate-700">{patient.currentMedications || 'Cyclobenzaprine 10mg PRN, Ibuprofen 800mg PO TID'}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <strong className="text-slate-900 block border-b border-slate-200 pb-1">Past Medical &amp; Surgical History</strong>
              <p className="text-slate-700">{patient.pastMedicalHistory || 'Non-contributory prior to MVA. Denies prior cervical or lumbar spine pathology.'}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
