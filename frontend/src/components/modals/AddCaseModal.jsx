// src/components/modals/AddCaseModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { mockCaseService } from '../../services/mock/mockCaseService';
import { mockPatientService } from '../../services/mock/mockPatientService';
import { DynamicDiagnosisPicker } from '../common/DynamicDiagnosisPicker';
import { useUIStore } from '../../store/uiStore';
import { 
  FileSpreadsheet, Save, Shield, User, Stethoscope, Scale, 
  PlusCircle, Calendar, AlertCircle, CheckCircle2, AlertTriangle, Clock
} from 'lucide-react';

const todayStr = new Date().toISOString().split('T')[0];

const inputCls = (hasError) =>
  `w-full px-3 py-2 text-xs rounded-xl border ${
    hasError
      ? 'border-rose-400 bg-rose-50/50 text-slate-900 focus:border-rose-500 ring-1 ring-rose-300'
      : 'border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600'
  } focus:ring-1 focus:ring-teal-600 outline-none transition`;

const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

const INITIAL_CASE_DATA = {
  patientId: '',
  patientName: '',
  patientDob: '',
  patientPhone: '',
  accidentDate: '',
  initialDate: todayStr, // Default admission/initial treatment date to today
  dischargeDate: '',
  accidentType: 'AUTO_ACCIDENT',
  accidentState: 'TX',
  accidentCity: '',
  accidentLocation: '',
  mechanismOfInjury: '',
  policeReportNumber: '',
  emergencyTransport: 'NONE',
  chiefComplaint: '',
  injuryBodyParts: '',
  diagnosisCodes: [],
  referringProviderName: '',
  referringProviderNpi: '',
  attorneyName: '',
  lawFirm: '',
  attorneyPhone: '',
  attorneyEmail: '',
  lawFirmAddress: '',
  litigationStatus: 'PRE_LITIGATION',
  insuranceCompany: '',
  insurancePolicyNumber: '',
  insuranceClaimNumber: '',
  insuranceAdjuster: '',
  insuranceAdjusterPhone: '',
  liabilityStatus: 'PENDING_INVESTIGATION',
  assignedProviderIds: ['prov-josmic', 'prov-davs', 'prov-anik', 'prov-counselor'],
  caseNotes: ''
};

export const AddCaseModal = ({ isOpen, onClose, onCaseAdded, initialPatient = null }) => {
  const { addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState('ACCIDENT'); // ACCIDENT | LEGAL | CLINICAL
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(INITIAL_CASE_DATA);

  // Load patients list for dropdown
  useEffect(() => {
    if (isOpen) {
      mockPatientService.getPatients().then(data => {
        setPatients(data || []);
      }).catch(() => {});
    }
  }, [isOpen]);

  // Bind initial patient if passed & auto-fill patient accident date if recorded
  useEffect(() => {
    if (initialPatient && isOpen) {
      applyPatientData(initialPatient);
    } else if (isOpen && !initialPatient) {
      setFormData(INITIAL_CASE_DATA);
    }
  }, [initialPatient, isOpen]);

  const applyPatientData = (patientObj) => {
    setFormData(prev => ({
      ...prev,
      patientId: patientObj.id || '',
      patientName: `${patientObj.firstName || ''} ${patientObj.lastName || ''}`.trim(),
      patientDob: patientObj.dob || '',
      patientPhone: patientObj.phone || '',
      // Auto-fill accident date from patient intake if available
      accidentDate: patientObj.accidentDate || patientObj.incidentDate || prev.accidentDate || '',
      mechanismOfInjury: patientObj.mechanismOfInjury || prev.mechanismOfInjury || '',
      injuryBodyParts: Array.isArray(patientObj.selectedInjuryAreas)
        ? patientObj.selectedInjuryAreas.join(', ')
        : (patientObj.injuryBodyParts || prev.injuryBodyParts || ''),
      chiefComplaint: patientObj.chiefComplaint || patientObj.patientNotes || prev.chiefComplaint || '',
      attorneyName: patientObj.referringAttorney || patientObj.attorneyName || prev.attorneyName || '',
      insuranceCompany: patientObj.primaryInsuranceCompany || prev.insuranceCompany || '',
      insurancePolicyNumber: patientObj.primaryPolicyNumber || prev.insurancePolicyNumber || '',
      insuranceClaimNumber: patientObj.primaryPolicyNumber || prev.insuranceClaimNumber || '',
      insuranceAdjuster: patientObj.insuranceAdjusterName || patientObj.adjusterName || prev.insuranceAdjuster || '',
      insuranceAdjusterPhone: patientObj.insuranceAdjusterPhone || patientObj.adjusterPhone || prev.insuranceAdjusterPhone || '',
      referringProviderName: patientObj.referringProvider || prev.referringProviderName || '',
      referringProviderNpi: patientObj.referringProviderNpi || prev.referringProviderNpi || '',
      caseNotes: patientObj.patientNotes || prev.caseNotes || ''
    }));
  };

  const set = (field, val) => {
    setFormData(p => ({ ...p, [field]: val }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePatientSelect = (pid) => {
    const selected = patients.find(p => p.id === pid);
    if (selected) {
      applyPatientData(selected);
    } else {
      setFormData(prev => ({
        ...prev,
        patientId: '',
        patientName: '',
        patientDob: '',
        patientPhone: ''
      }));
    }
  };

  // Timeline Validation Logic (Accident Date <= Initial Treatment / Admission Date)
  const getTimelineCheck = () => {
    if (!formData.accidentDate) return null;
    
    // Check 1: Accident date cannot be in the future
    if (formData.accidentDate > todayStr) {
      return {
        isInvalid: true,
        type: 'FUTURE_ACCIDENT',
        message: `Date of Accident (${formData.accidentDate}) cannot be in the future. Today is ${todayStr}.`
      };
    }

    // Check 2: Accident date cannot be after admission/initial treatment date
    if (formData.initialDate && formData.accidentDate > formData.initialDate) {
      return {
        isInvalid: true,
        type: 'AFTER_ADMISSION',
        message: `Date of Accident (${formData.accidentDate}) cannot be AFTER the Initial Treatment / Admission Date (${formData.initialDate}). The accident must have occurred on or before admission.`
      };
    }

    // Check 3: Valid timeline calculation
    if (formData.initialDate) {
      const acc = new Date(formData.accidentDate);
      const init = new Date(formData.initialDate);
      const diffDays = Math.round((init - acc) / (1000 * 60 * 60 * 24));
      return {
        isInvalid: false,
        message: diffDays === 0
          ? 'Accident occurred on the same day as admission/initial treatment.'
          : `Accident occurred ${diffDays} day(s) prior to admission/initial treatment.`
      };
    }

    return null;
  };

  const timelineCheck = getTimelineCheck();

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const newErrors = {};
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient selection is required.';
    }
    if (!formData.accidentDate) {
      newErrors.accidentDate = 'Date of accident is required.';
    } else if (formData.accidentDate > todayStr) {
      newErrors.accidentDate = 'Date of accident cannot be in the future.';
    } else if (formData.initialDate && formData.accidentDate > formData.initialDate) {
      newErrors.accidentDate = `Date of accident (${formData.accidentDate}) cannot be after admission/initial treatment date (${formData.initialDate}).`;
    }

    if (formData.initialDate && formData.dischargeDate && formData.dischargeDate < formData.initialDate) {
      newErrors.dischargeDate = 'Discharge date cannot be before initial treatment date.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      addToast(Object.values(newErrors)[0], 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const created = await mockCaseService.createCase(formData);
      addToast(`Accident Case ${created.caseId || 'CASE-2026'} created successfully!`, 'success');
      if (onCaseAdded) onCaseAdded(created);
      onClose();
      setFormData(INITIAL_CASE_DATA);
    } catch {
      addToast('Failed to create accident case', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Accident &amp; Legal Case"
      subtitle="Register incident details, verify accident timeline &amp; link 4-provider legal ledgers"
      icon={FileSpreadsheet}
      size="2xl"
      iconColor="text-teal-600"
      iconBg="bg-teal-50"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || (timelineCheck && timelineCheck.isInvalid)}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" /> {isLoading ? 'Creating Case...' : 'Create Accident Case'}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('ACCIDENT')}
            className={`pb-2 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'ACCIDENT' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> 1. Accident &amp; Timeline Verification
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LEGAL')}
            className={`pb-2 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'LEGAL' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Scale className="w-3.5 h-3.5" /> 2. Legal Lien &amp; Auto Insurance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CLINICAL')}
            className={`pb-2 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'CLINICAL' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" /> 3. Diagnoses (ICD-10) &amp; Notes
          </button>
        </div>

        {/* Tab 1: Accident Information & Timeline Verification */}
        {activeTab === 'ACCIDENT' && (
          <div className="space-y-3.5 text-xs animate-in fade-in-50 duration-150">
            {/* Patient Selection Row */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-teal-600" /> Patient Selection
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Select Registered Patient *</label>
                  {patients.length > 0 ? (
                    <select
                      className={inputCls(errors.patientName)}
                      value={formData.patientId}
                      onChange={e => handlePatientSelect(e.target.value)}
                    >
                      <option value="">-- Choose Patient from Registry --</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.firstName} {p.lastName} (DOB: {p.dob || 'N/A'}) - ID: {p.patientId || p.id}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      required
                      className={inputCls(errors.patientName)}
                      value={formData.patientName}
                      onChange={e => set('patientName', e.target.value)}
                      placeholder="Enter patient name..."
                    />
                  )}
                  {errors.patientName && <p className="text-[10px] text-rose-500 mt-0.5">{errors.patientName}</p>}
                </div>
                <div>
                  <label className={labelCls}>Date of Birth</label>
                  <input
                    type="date"
                    className={inputCls()}
                    value={formData.patientDob}
                    onChange={e => set('patientDob', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Accident & Admission Dates with Strict Timeline Guard */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600" /> Accident Timeline &amp; Admission Dates
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  Rule: Accident Date &le; Admission Date &le; Today
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>
                    Date of Accident (DOA) *
                  </label>
                  <input
                    type="date"
                    required
                    max={formData.initialDate ? (formData.initialDate < todayStr ? formData.initialDate : todayStr) : todayStr}
                    className={inputCls(errors.accidentDate || (timelineCheck && timelineCheck.isInvalid))}
                    value={formData.accidentDate}
                    onChange={e => set('accidentDate', e.target.value)}
                  />
                  {errors.accidentDate && <p className="text-[10px] text-rose-500 mt-0.5">{errors.accidentDate}</p>}
                </div>

                <div>
                  <label className={labelCls}>
                    Initial Treatment / Admission Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={formData.accidentDate || undefined}
                    className={inputCls(timelineCheck && timelineCheck.isInvalid)}
                    value={formData.initialDate}
                    onChange={e => set('initialDate', e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelCls}>Estimated Discharge Date</label>
                  <input
                    type="date"
                    min={formData.initialDate || formData.accidentDate || undefined}
                    className={inputCls(errors.dischargeDate)}
                    value={formData.dischargeDate}
                    onChange={e => set('dischargeDate', e.target.value)}
                  />
                  {errors.dischargeDate && <p className="text-[10px] text-rose-500 mt-0.5">{errors.dischargeDate}</p>}
                </div>
              </div>

              {/* Real-Time Timeline Guard Alert Box */}
              {timelineCheck && (
                <div
                  className={`p-2.5 rounded-xl border flex items-start gap-2 text-[11px] font-semibold transition-all ${
                    timelineCheck.isInvalid
                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                      : 'bg-teal-50 border-teal-300 text-teal-800'
                  }`}
                >
                  {timelineCheck.isInvalid ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">
                      {timelineCheck.isInvalid ? 'Invalid Timeline Sequence:' : 'Timeline Verified:'}
                    </span>
                    <span>{timelineCheck.message}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className={labelCls}>Accident Type</label>
                  <select className={inputCls()} value={formData.accidentType} onChange={e => set('accidentType', e.target.value)}>
                    <option value="AUTO_ACCIDENT">Auto Accident (Motor Vehicle Collision)</option>
                    <option value="SLIP_AND_FALL">Slip &amp; Fall / Premise Liability</option>
                    <option value="WORKERS_COMP">Worker's Compensation</option>
                    <option value="OTHER">Other Personal Injury</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Police Report Number</label>
                  <input
                    className={inputCls()}
                    value={formData.policeReportNumber}
                    onChange={e => set('policeReportNumber', e.target.value)}
                    placeholder="e.g. HPD-2026-10291"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Accident Location / Street / City</label>
                  <input
                    className={inputCls()}
                    value={formData.accidentLocation}
                    onChange={e => set('accidentLocation', e.target.value)}
                    placeholder="e.g. Interstate 10 Westbound near Exit 747, Houston TX"
                  />
                </div>
                <div>
                  <label className={labelCls}>Mechanism of Injury</label>
                  <input
                    className={inputCls()}
                    value={formData.mechanismOfInjury}
                    onChange={e => set('mechanismOfInjury', e.target.value)}
                    placeholder="e.g. Rear-end collision while stopped at red light"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Legal Lien & Insurance */}
        {activeTab === 'LEGAL' && (
          <div className="space-y-3.5 text-xs animate-in fade-in-50 duration-150">
            {/* Attorney & Law Firm */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-teal-600" /> Attorney Lien &amp; Representation
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Attorney Full Name</label>
                  <input
                    className={inputCls()}
                    value={formData.attorneyName}
                    onChange={e => set('attorneyName', e.target.value)}
                    placeholder="e.g. Sarah Jenkins, Esq."
                  />
                </div>
                <div>
                  <label className={labelCls}>Law Firm Name</label>
                  <input
                    className={inputCls()}
                    value={formData.lawFirm}
                    onChange={e => set('lawFirm', e.target.value)}
                    placeholder="e.g. Davis & Associates Injury Law Group"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Attorney Phone</label>
                  <input
                    type="tel"
                    className={inputCls()}
                    value={formData.attorneyPhone}
                    onChange={e => set('attorneyPhone', e.target.value)}
                    placeholder="713-555-0188"
                  />
                </div>
                <div>
                  <label className={labelCls}>Attorney Email</label>
                  <input
                    type="email"
                    className={inputCls()}
                    value={formData.attorneyEmail}
                    onChange={e => set('attorneyEmail', e.target.value)}
                    placeholder="attorney@lawoffice.com"
                  />
                </div>
                <div>
                  <label className={labelCls}>Litigation / Lien Status</label>
                  <select className={inputCls()} value={formData.litigationStatus} onChange={e => set('litigationStatus', e.target.value)}>
                    <option value="PRE_LITIGATION">Pre-Litigation (LOP / Letter of Protection)</option>
                    <option value="IN_LITIGATION">In Litigation (Lawsuit Filed)</option>
                    <option value="SETTLED">Settled / Case Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Auto Insurance Carrier */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-teal-600" /> Third-Party / Auto Insurance Policy
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Auto Insurance Carrier</label>
                  <input
                    className={inputCls()}
                    value={formData.insuranceCompany}
                    onChange={e => set('insuranceCompany', e.target.value)}
                    placeholder="e.g. Geico, Progressive, State Farm"
                  />
                </div>
                <div>
                  <label className={labelCls}>Claim Number</label>
                  <input
                    className={inputCls()}
                    value={formData.insuranceClaimNumber}
                    onChange={e => set('insuranceClaimNumber', e.target.value)}
                    placeholder="e.g. CLM-2026-88192"
                  />
                </div>
                <div>
                  <label className={labelCls}>Policy Number</label>
                  <input
                    className={inputCls()}
                    value={formData.insurancePolicyNumber}
                    onChange={e => set('insurancePolicyNumber', e.target.value)}
                    placeholder="e.g. POL-TX-9921"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Insurance Adjuster Name</label>
                  <input
                    className={inputCls()}
                    value={formData.insuranceAdjuster}
                    onChange={e => set('insuranceAdjuster', e.target.value)}
                    placeholder="e.g. Marcus Vance"
                  />
                </div>
                <div>
                  <label className={labelCls}>Adjuster Direct Phone / Contact</label>
                  <input
                    className={inputCls()}
                    value={formData.insuranceAdjusterPhone}
                    onChange={e => set('insuranceAdjusterPhone', e.target.value)}
                    placeholder="e.g. 800-555-0199 ext 402"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Providers & Diagnoses */}
        {activeTab === 'CLINICAL' && (
          <div className="space-y-3.5 text-xs animate-in fade-in-50 duration-150">
            {/* Dynamic ICD-10 Diagnosis Picker */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <DynamicDiagnosisPicker
                selectedCodes={formData.diagnosisCodes}
                onChange={(codes) => set('diagnosisCodes', codes)}
                label="Case Diagnostic Codes (Box 21 ICD-10 Pointers A-L)"
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-teal-600" /> Clinical Complaints &amp; Coordination Notes
              </span>
              <div>
                <label className={labelCls}>Chief Complaints &amp; Injury Summary</label>
                <textarea
                  rows={2}
                  className={inputCls()}
                  value={formData.chiefComplaint}
                  onChange={e => set('chiefComplaint', e.target.value)}
                  placeholder="e.g. Neck pain radiating to left shoulder, lower back stiffness, headaches post-collision..."
                />
              </div>

              <div>
                <label className={labelCls}>Case Notes &amp; 4-Provider Coordination</label>
                <textarea
                  rows={2}
                  className={inputCls()}
                  value={formData.caseNotes}
                  onChange={e => set('caseNotes', e.target.value)}
                  placeholder="Enter initial attorney coordination notes, treatment goals, or liability updates..."
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
