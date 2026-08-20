// src/components/modals/AddCaseModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { apiCaseService } from '../../services/api/apiCaseService';
import { apiPatientService } from '../../services/api/apiPatientService';
import { mockAttorneyService } from '../../services/mock/mockAttorneyService';
import { DynamicDiagnosisPicker } from '../common/DynamicDiagnosisPicker';
import { AddAttorneyModal } from './AddAttorneyModal';
import { useUIStore } from '../../store/uiStore';
import { 
  FileSpreadsheet, Save, Shield, User, Stethoscope, Scale, 
  PlusCircle, Calendar, AlertCircle, CheckCircle2, AlertTriangle, Clock, Lock, ChevronRight, ArrowLeft
} from 'lucide-react';

const todayStr = new Date().toISOString().split('T')[0];

const sanitizePhone = (val) => (val || '').replace(/[^0-9\-()+ \textEXText.]/gi, '');
const sanitizeClaimPolicy = (val) => (val || '').toUpperCase().replace(/[^A-Z0-9\-]/g, '');

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
  accidentCity: 'Houston',
  accidentLocation: 'Houston, TX Metro Area',
  mechanismOfInjury: 'Motor Vehicle Collision with deceleration impact',
  policeReportNumber: '',
  emergencyTransport: 'NONE',
  chiefComplaint: '',
  injuryBodyParts: '',
  diagnosisCodes: ['M54.50', 'M54.2'], // Default common MVA diagnoses
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
  const [attorneys, setAttorneys] = useState([]);
  const [showAddAttorneyModal, setShowAddAttorneyModal] = useState(false);

  const loadAttorneys = () => {
    mockAttorneyService.getAttorneys().then(data => setAttorneys(data || [])).catch(() => {});
  };

  // Load patients and attorneys list for dropdown from real API
  useEffect(() => {
    if (isOpen) {
      apiPatientService.getPatients().then(data => {
        const raw = Array.isArray(data) ? data : (data?.patients || []);
        setPatients(raw);
      }).catch(() => {
        // Fallback
        setPatients([]);
      });
      loadAttorneys();
    }
  }, [isOpen]);

  // Bind initial patient if passed & auto-fill patient accident date if recorded
  useEffect(() => {
    if (initialPatient && isOpen) {
      applyPatientData(initialPatient);
    } else if (isOpen && !initialPatient) {
      setFormData(INITIAL_CASE_DATA);
      setErrors({});
    }
  }, [initialPatient, isOpen]);

  const applyPatientData = (patientObj) => {
    setFormData(prev => ({
      ...prev,
      patientId: patientObj.id || '',
      patientName: `${patientObj.firstName || ''} ${patientObj.lastName || ''}`.trim(),
      patientDob: patientObj.dob || '',
      patientPhone: patientObj.phone || '',
      accidentDate: patientObj.accidentDate || patientObj.incidentDate || prev.accidentDate || '',
      mechanismOfInjury: patientObj.mechanismOfInjury || prev.mechanismOfInjury || 'Motor Vehicle Collision with deceleration impact',
      injuryBodyParts: Array.isArray(patientObj.selectedInjuryAreas)
        ? patientObj.selectedInjuryAreas.join(', ')
        : (patientObj.injuryBodyParts || prev.injuryBodyParts || 'Neck, Low Back, Left Ankle'),
      chiefComplaint: patientObj.chiefComplaint || patientObj.patientNotes || prev.chiefComplaint || 'Cervicalgia, lumbar strain and soft tissue pain',
      attorneyName: patientObj.referringAttorney || patientObj.attorneyName || prev.attorneyName || '',
      lawFirm: patientObj.lawFirm || patientObj.attorneyLawFirm || (patientObj.referringAttorney ? `${patientObj.referringAttorney}` : prev.lawFirm || ''),
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
        message: `Date of Accident (${formData.accidentDate}) cannot be AFTER Initial Treatment Date (${formData.initialDate}). The accident must have occurred on or before initial care.`
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
          ? 'Accident occurred on the same day as initial treatment.'
          : `Accident occurred ${diffDays} day(s) prior to initial treatment.`
      };
    }

    return null;
  };

  const timelineCheck = getTimelineCheck();

  // Completion check per tab
  const isTab1Complete = !!(formData.patientName?.trim() && formData.accidentDate && formData.initialDate && !timelineCheck?.isInvalid);
  const isTab2Complete = !!((formData.attorneyName?.trim() || formData.lawFirm?.trim()) && formData.insuranceCompany?.trim() && (formData.insuranceClaimNumber?.trim() || formData.insurancePolicyNumber?.trim()));
  const isTab3Complete = !!(formData.chiefComplaint?.trim() && (formData.injuryBodyParts?.trim() || formData.diagnosisCodes?.length > 0) && (formData.diagnosisCodes && formData.diagnosisCodes.length > 0));

  const validateStep1 = () => {
    const errs = {};
    if (!formData.patientName?.trim()) {
      errs.patientName = 'Please select or enter a registered patient in Step 1.';
    }
    if (!formData.accidentDate) {
      errs.accidentDate = 'Date of accident is required in Step 1.';
    } else if (formData.accidentDate > todayStr) {
      errs.accidentDate = 'Date of accident cannot be in the future in Step 1.';
    } else if (formData.initialDate && formData.accidentDate > formData.initialDate) {
      errs.accidentDate = `Date of accident (${formData.accidentDate}) cannot be after initial treatment date (${formData.initialDate}).`;
    }
    if (!formData.initialDate) {
      errs.initialDate = 'Initial treatment date is required in Step 1.';
    }
    if (formData.initialDate && formData.dischargeDate && formData.dischargeDate < formData.initialDate) {
      errs.dischargeDate = 'Discharge date cannot be before initial treatment date.';
    }
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.attorneyName?.trim() && !formData.lawFirm?.trim()) {
      errs.attorneyName = 'Attorney or Law Firm name is required in Step 2.';
    }
    if (!formData.insuranceCompany?.trim()) {
      errs.insuranceCompany = 'Auto / Liability insurance carrier is required in Step 2.';
    }
    if (!formData.insuranceClaimNumber?.trim() && !formData.insurancePolicyNumber?.trim()) {
      errs.insuranceClaimNumber = 'Insurance Policy # or Claim # is required in Step 2.';
    }
    if (formData.attorneyEmail?.trim() && !/\S+@\S+\.\S+/.test(formData.attorneyEmail.trim())) {
      errs.attorneyEmail = 'Please enter a valid email format (e.g. attorney@lawoffice.com).';
    }
    return errs;
  };

  const handleTabClick = (targetTab) => {
    if (targetTab === 'LEGAL') {
      const s1Errs = validateStep1();
      if (Object.keys(s1Errs).length > 0) {
        setErrors(s1Errs);
        addToast(Object.values(s1Errs)[0], 'warning');
        return;
      }
    } else if (targetTab === 'CLINICAL') {
      const s1Errs = validateStep1();
      if (Object.keys(s1Errs).length > 0) {
        setActiveTab('ACCIDENT');
        setErrors(s1Errs);
        addToast('Please complete Step 1 (Accident & Timeline) before moving to Step 3.', 'warning');
        return;
      }
      const s2Errs = validateStep2();
      if (Object.keys(s2Errs).length > 0) {
        setActiveTab('LEGAL');
        setErrors(s2Errs);
        addToast(Object.values(s2Errs)[0], 'warning');
        return;
      }
    }
    setActiveTab(targetTab);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const newErrors = { ...validateStep1(), ...validateStep2() };

    // 3. Validate Section 3: Diagnoses (ICD-10) & Notes
    if (!formData.chiefComplaint?.trim()) {
      newErrors.chiefComplaint = 'Chief complaints / injury summary is required in Section 3.';
    }
    if (!formData.diagnosisCodes || formData.diagnosisCodes.length === 0) {
      newErrors.diagnosisCodes = 'At least 1 ICD-10 diagnosis code is required in Section 3.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.patientName || newErrors.accidentDate || newErrors.initialDate || newErrors.dischargeDate) {
        setActiveTab('ACCIDENT');
        addToast(newErrors.patientName || newErrors.accidentDate || newErrors.initialDate, 'warning');
      } else if (newErrors.attorneyName || newErrors.insuranceCompany || newErrors.insuranceClaimNumber) {
        setActiveTab('LEGAL');
        addToast(newErrors.attorneyName || newErrors.insuranceCompany || newErrors.insuranceClaimNumber, 'warning');
      } else {
        setActiveTab('CLINICAL');
        addToast(newErrors.chiefComplaint || newErrors.diagnosisCodes, 'warning');
      }
      return;
    }

    setIsLoading(true);
    try {
      let finalPatientId = formData.patientId;
      if (!finalPatientId && patients.length > 0) {
        finalPatientId = patients[0].id;
      }

      const payload = {
        ...formData,
        patientId: finalPatientId || 'pat-001'
      };

      const created = await apiCaseService.createCase(payload);
      addToast(`Accident Case ${created.caseId || 'CASE-2026'} created & saved to database!`, 'success');
      if (onCaseAdded) onCaseAdded(created);
      onClose();
      setFormData(INITIAL_CASE_DATA);
      setErrors({});
    } catch (err) {
      console.error('Failed to create case:', err);
      addToast(err.message || 'Failed to create accident case in database', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextFromStep1 = () => {
    const s1Errs = validateStep1();
    if (Object.keys(s1Errs).length > 0) {
      setErrors(s1Errs);
      addToast(Object.values(s1Errs)[0], 'warning');
      return;
    }
    setActiveTab('LEGAL');
  };

  const handleNextFromStep2 = () => {
    const s1Errs = validateStep1();
    if (Object.keys(s1Errs).length > 0) {
      setActiveTab('ACCIDENT');
      setErrors(s1Errs);
      addToast('Please complete Step 1 first.', 'warning');
      return;
    }
    const s2Errs = validateStep2();
    if (Object.keys(s2Errs).length > 0) {
      setErrors(s2Errs);
      addToast(Object.values(s2Errs)[0], 'warning');
      return;
    }
    setActiveTab('CLINICAL');
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
          {activeTab === 'ACCIDENT' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNextFromStep1}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                Continue to Step 2: Legal Lien &amp; Insurance <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {activeTab === 'LEGAL' && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('ACCIDENT')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Step 1
              </button>
              <button
                type="button"
                onClick={handleNextFromStep2}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                Continue to Step 3: Diagnoses &amp; Notes <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {activeTab === 'CLINICAL' && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('LEGAL')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Step 2
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || (timelineCheck && timelineCheck.isInvalid)}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> {isLoading ? 'Creating Case...' : 'Create Accident Case'}
              </button>
            </>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={() => handleTabClick('ACCIDENT')}
            className={`pb-2 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'ACCIDENT' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> 1. Accident &amp; Timeline
            {isTab1Complete ? (
              <span className="w-4 h-4 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-[10px]">✓</span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            )}
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('LEGAL')}
            className={`pb-2 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              !isTab1Complete
                ? 'border-transparent text-slate-400 cursor-not-allowed'
                : activeTab === 'LEGAL'
                ? 'border-teal-600 text-teal-600 cursor-pointer'
                : 'border-transparent text-slate-500 hover:text-slate-700 cursor-pointer'
            }`}
          >
            {!isTab1Complete ? (
              <Lock className="w-3 h-3 text-slate-400" />
            ) : (
              <Scale className="w-3.5 h-3.5" />
            )}
            2. Legal Lien &amp; Insurance
            {isTab2Complete ? (
              <span className="w-4 h-4 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-[10px]">✓</span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            )}
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('CLINICAL')}
            className={`pb-2 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              !isTab1Complete || !isTab2Complete
                ? 'border-transparent text-slate-400 cursor-not-allowed'
                : activeTab === 'CLINICAL'
                ? 'border-teal-600 text-teal-600 cursor-pointer'
                : 'border-transparent text-slate-500 hover:text-slate-700 cursor-pointer'
            }`}
          >
            {!isTab1Complete || !isTab2Complete ? (
              <Lock className="w-3 h-3 text-slate-400" />
            ) : (
              <Stethoscope className="w-3.5 h-3.5" />
            )}
            3. Diagnoses (ICD-10) &amp; Notes
            {isTab3Complete ? (
              <span className="w-4 h-4 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-[10px]">✓</span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            )}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-teal-600" /> Attorney Lien &amp; Representation
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddAttorneyModal(true)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer underline"
                >
                  + Register New Law Firm
                </button>
              </div>

              {/* Dynamic Law Firm Quick Selector */}
              <div>
                <label className={labelCls}>Select from Registered Law Firms</label>
                <select
                  className={inputCls()}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setShowAddAttorneyModal(true);
                      return;
                    }
                    const selected = attorneys.find(a => a.id === e.target.value);
                    if (selected) {
                      setFormData(p => ({
                        ...p,
                        attorneyName: selected.name,
                        lawFirm: selected.firm,
                        attorneyPhone: selected.phone,
                        attorneyEmail: selected.email,
                        lawFirmAddress: selected.address
                      }));
                    }
                  }}
                >
                  <option value="">-- Choose Registered Law Firm or Type Below --</option>
                  {attorneys.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.firm} ({a.name}) — {a.phone}
                    </option>
                  ))}
                  <option value="__NEW__">➕ Register New Law Firm...</option>
                </select>
              </div>

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
                    className={inputCls(errors.attorneyPhone)}
                    value={formData.attorneyPhone}
                    onChange={e => set('attorneyPhone', sanitizePhone(e.target.value))}
                    placeholder="e.g. 713-555-0188"
                  />
                  {errors.attorneyPhone && <p className="text-[10px] text-rose-500 mt-0.5">{errors.attorneyPhone}</p>}
                </div>
                <div>
                  <label className={labelCls}>Attorney Email</label>
                  <input
                    type="email"
                    className={inputCls(errors.attorneyEmail)}
                    value={formData.attorneyEmail}
                    onChange={e => set('attorneyEmail', e.target.value.trim())}
                    placeholder="attorney@lawoffice.com"
                  />
                  {errors.attorneyEmail && <p className="text-[10px] text-rose-500 mt-0.5">{errors.attorneyEmail}</p>}
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
                  <label className={labelCls}>Auto Insurance Carrier *</label>
                  <input
                    className={inputCls(errors.insuranceCompany)}
                    value={formData.insuranceCompany}
                    onChange={e => set('insuranceCompany', e.target.value)}
                    placeholder="e.g. Geico, Progressive, State Farm"
                  />
                  {errors.insuranceCompany && <p className="text-[10px] text-rose-500 mt-0.5">{errors.insuranceCompany}</p>}
                </div>
                <div>
                  <label className={labelCls}>Claim Number *</label>
                  <input
                    className={inputCls(errors.insuranceClaimNumber)}
                    value={formData.insuranceClaimNumber}
                    onChange={e => set('insuranceClaimNumber', sanitizeClaimPolicy(e.target.value))}
                    placeholder="e.g. CLM-2026-88192"
                  />
                  {errors.insuranceClaimNumber && <p className="text-[10px] text-rose-500 mt-0.5">{errors.insuranceClaimNumber}</p>}
                </div>
                <div>
                  <label className={labelCls}>Policy Number</label>
                  <input
                    className={inputCls()}
                    value={formData.insurancePolicyNumber}
                    onChange={e => set('insurancePolicyNumber', sanitizeClaimPolicy(e.target.value))}
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
                    type="tel"
                    className={inputCls()}
                    value={formData.insuranceAdjusterPhone}
                    onChange={e => set('insuranceAdjusterPhone', sanitizePhone(e.target.value))}
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

      <AddAttorneyModal
        isOpen={showAddAttorneyModal}
        onClose={() => setShowAddAttorneyModal(false)}
        onAttorneyAdded={(newAtty) => {
          loadAttorneys();
          setFormData(p => ({
            ...p,
            attorneyName: newAtty.name,
            lawFirm: newAtty.firm,
            attorneyPhone: newAtty.phone,
            attorneyEmail: newAtty.email,
            lawFirmAddress: newAtty.address
          }));
        }}
      />
    </Modal>
  );
};
