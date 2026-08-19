// src/components/modals/AddPatientModal.jsx
import React, { useState } from 'react';
import { Modal } from './Modal';
import { apiPatientService } from '../../services/api/apiPatientService';
import { useUIStore } from '../../store/uiStore';
import {
  User,
  Phone,
  Shield,
  FileText,
  Stethoscope,
  Save,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Building2,
  Activity,
  HeartPulse,
  Sparkles,
  Check,
  Scale,
  Briefcase,
  AlertTriangle,
  Info,
  Calendar
} from 'lucide-react';

const inputCls = (hasError) =>
  `w-full px-3 py-2 text-xs rounded-xl border ${
    hasError
      ? 'border-rose-400 bg-rose-50/50 text-slate-900 focus:border-rose-500 ring-1 ring-rose-300'
      : 'border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600'
  } focus:ring-1 focus:ring-teal-600 outline-none transition`;

const labelCls = 'block text-xs font-bold text-slate-800 mb-1';
const sectionHeaderCls = 'text-xs font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5 mb-2.5';

const PRACTICE_PROVIDERS = [
  {
    id: 'prov-josmic',
    name: 'JOSMIC Wellness Center',
    specialty: 'Pain Management & Medical Evaluation',
    provider: 'Dr. Michael Adeyemi, MD',
    badge: 'Physician / Pain Mgmt',
    icon: Stethoscope,
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    pos: 'Office (POS 11)',
    scope: 'Comprehensive physical exam, diagnostic workup, medication management & injection procedures.'
  },
  {
    id: 'prov-davs',
    name: "DAV'S Anatomy",
    specialty: 'ESWT Shockwave Therapy & Rehab',
    provider: 'Dr. David Chen, PT, DPT',
    badge: 'Physical Therapy',
    icon: Activity,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    pos: 'Office (POS 11)',
    scope: 'Radial & focused extracorporeal shockwave therapy, therapeutic exercise & joint mobilization.'
  },
  {
    id: 'prov-anik',
    name: 'ANIK Laser Therapy',
    specialty: 'High-Intensity Laser Therapy & Recovery',
    provider: 'Dr. Anika Patel, DC',
    badge: 'Laser Therapy',
    icon: Sparkles,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    pos: 'Office (POS 11)',
    scope: 'Class IV high-intensity therapeutic laser, deep tissue biostimulation & acute inflammation reduction.'
  },
  {
    id: 'prov-counselor',
    name: 'Counselor Practice (Hope Behavioral)',
    specialty: 'Mental Health Psychotherapy & PTSD Care',
    provider: 'Sarah Jenkins, LPC',
    badge: 'Counseling & Psych',
    icon: HeartPulse,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    pos: 'Office (POS 11)',
    scope: 'Trauma counseling, pain psych assessment, accident-related PTSD & cognitive behavioral therapy.'
  },
];

const QUICK_ALLERGIES = [
  'NKDA (No Known Drug Allergies)',
  'Penicillin',
  'Sulfa Drugs',
  'Latex',
  'Aspirin / NSAIDs',
  'Codeine',
  'Opioids',
  'Contrast Dye',
  'Local Anesthetics',
  'Iodine'
];

const INJURY_AREAS = [
  'Neck / Cervical Spine',
  'Lower Back / Lumbar',
  'Mid Back / Thoracic',
  'Shoulder / Rotator Cuff',
  'Knee / Lower Extremity',
  'Headaches / Concussion',
  'Anxiety / PTSD Symptoms',
  'Whiplash / Myofascial Pain'
];

const INITIAL_FORM_DATA = {
  // 1. Demographics
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  dob: '',
  sex: '',
  maritalStatus: 'SINGLE',
  ssn: '',
  driversLicense: '',
  driversLicenseState: 'TX',
  language: 'English',
  ethnicity: 'Non-Hispanic',
  employmentStatus: '',
  employerName: '',
  
  // 2. Contact & Address & Insurance
  phone: '',
  altPhone: '',
  email: '',
  communicationPref: 'SMS',
  address: {
    street: '',
    suite: '',
    city: '',
    state: 'TX',
    zipCode: ''
  },
  emergencyContactName: '',
  emergencyContactRelation: '',
  emergencyContactPhone: '',
  insuranceType: 'Auto Accident / Third-Party PIP',
  primaryInsuranceCompany: '',
  primaryPolicyNumber: '',
  primaryGroupNumber: '',
  primaryInsuranceMemberId: '',
  policyHolderName: '',
  policyHolderDob: '',
  insuranceAdjusterName: '',
  insuranceAdjusterPhone: '',
  secondaryInsuranceCompany: '',
  secondaryPolicyNumber: '',

  // 3. Practice Providers & Referrals
  assignedProviderIds: ['prov-josmic', 'prov-davs', 'prov-anik', 'prov-counselor'],
  referringAttorney: '',
  attorneyCaseManager: '',
  referringProvider: '',
  referringProviderNpi: '',
  primaryCareProvider: '',

  // 4. Medical, Allergies & Clinical History
  knownAllergies: '',
  allergyReactionSeverity: '',
  currentMedications: '',
  pastMedicalHistory: '',
  selectedInjuryAreas: [],
  accidentDate: '',
  mechanismOfInjury: '',
  patientNotes: '',
  hipaaConsentSigned: false
};

export const AddPatientModal = ({ isOpen, onClose, onPatientAdded }) => {
  const { addToast } = useUIStore();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1); // 1 | 2 | 3 | 4
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const setAddr = (field, val) => {
    setFormData(p => ({ ...p, address: { ...p.address, [field]: val } }));
    if (errors[`address_${field}`]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[`address_${field}`];
        return next;
      });
    }
  };

  const handleToggleProvider = (pid) => {
    setFormData(prev => {
      const exists = prev.assignedProviderIds.includes(pid);
      const updated = exists
        ? prev.assignedProviderIds.filter(id => id !== pid)
        : [...prev.assignedProviderIds, pid];
      return { ...prev, assignedProviderIds: updated };
    });
    if (errors.assignedProviderIds) {
      setErrors(prev => {
        const next = { ...prev };
        delete next.assignedProviderIds;
        return next;
      });
    }
  };

  const handleSelectAllProviders = () => {
    setFormData(prev => ({
      ...prev,
      assignedProviderIds: PRACTICE_PROVIDERS.map(p => p.id)
    }));
  };

  const handleClearAllProviders = () => {
    setFormData(prev => ({
      ...prev,
      assignedProviderIds: []
    }));
  };

  const handleToggleInjuryArea = (area) => {
    setFormData(prev => {
      const exists = prev.selectedInjuryAreas.includes(area);
      const updated = exists
        ? prev.selectedInjuryAreas.filter(a => a !== area)
        : [...prev.selectedInjuryAreas, area];
      return { ...prev, selectedInjuryAreas: updated };
    });
  };

  const handleAddAllergyChip = (allergy) => {
    const current = formData.knownAllergies.trim();
    if (!current || current === 'NKDA (No Known Drug Allergies)') {
      set('knownAllergies', allergy);
      if (allergy === 'NKDA (No Known Drug Allergies)') {
        set('allergyReactionSeverity', 'None / NKDA');
      }
    } else if (!current.includes(allergy)) {
      set('knownAllergies', `${current}, ${allergy}`);
    }
  };

  // Validation function per step
  const validateStep = (stepNumber) => {
    const stepErrors = {};

    if (stepNumber === 1) {
      if (!formData.firstName.trim()) stepErrors.firstName = 'First Name is required';
      if (!formData.lastName.trim()) stepErrors.lastName = 'Last Name is required';
      if (!formData.dob) stepErrors.dob = 'Date of Birth is required';
    } else if (stepNumber === 2) {
      if (!formData.phone.trim()) stepErrors.phone = 'Primary Mobile Phone is required';
      if (!formData.email.trim()) {
        stepErrors.email = 'Email Address is required';
      } else if (!formData.email.includes('@')) {
        stepErrors.email = 'Please enter a valid email address';
      }
      if (!formData.address.street.trim()) {
        stepErrors.address_street = 'Street Address is required';
      }
      if (!formData.address.city.trim()) {
        stepErrors.address_city = 'City is required';
      }
    } else if (stepNumber === 3) {
      if (formData.assignedProviderIds.length === 0) {
        stepErrors.assignedProviderIds = 'Please assign at least one practice clinic.';
      }
    }

    setErrors(stepErrors);

    if (Object.keys(stepErrors).length > 0) {
      const firstErrMsg = Object.values(stepErrors)[0];
      addToast(firstErrMsg, 'warning');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleTabClick = (targetStep) => {
    if (targetStep === currentStep) return;
    if (targetStep < currentStep) {
      setErrors({});
      setCurrentStep(targetStep);
      return;
    }
    for (let s = currentStep; s < targetStep; s++) {
      if (!validateStep(s)) return;
    }
    setCurrentStep(targetStep);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      addToast('Please complete Step 1 (Demographics) required fields.', 'warning');
      setCurrentStep(1);
      return;
    }
    if (!formData.phone.trim() || !formData.email.trim()) {
      addToast('Please complete Step 2 (Contact & Insurance) required fields.', 'warning');
      setCurrentStep(2);
      return;
    }
    if (formData.assignedProviderIds.length === 0) {
      addToast('Please assign at least 1 practice provider in Step 3.', 'warning');
      setCurrentStep(3);
      return;
    }

    setIsLoading(true);
    try {
      const created = await apiPatientService.createPatient(formData);
      addToast(`Patient ${created.firstName} ${created.lastName} registered successfully in database!`, 'success');
      if (onPatientAdded) onPatientAdded(created);
      onClose();
      setFormData(INITIAL_FORM_DATA);
      setCurrentStep(1);
    } catch (err) {
      console.error('Registration failed:', err);
      addToast('Failed to register patient. Please check data and retry.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const stepsList = [
    { id: 1, name: '1. Demographics', short: 'Demographics' },
    { id: 2, name: '2. Contact & Insurance', short: 'Contact & Ins.' },
    { id: 3, name: '3. Practice Providers', short: 'Providers & Lien' },
    { id: 4, name: '4. Medical & Allergies', short: 'Medical & Summary' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Patient Intake"
      subtitle="Complete 4-Step Registration: Demographics, Contact, Insurance, 4-Provider Assignment & Clinical History"
      icon={UserPlus}
      size="2xl"
      iconColor="text-teal-600"
      iconBg="bg-teal-50"
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            {currentStep === 1 ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline">
              Step {currentStep} of 4
            </span>
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> {isLoading ? 'Registering Patient...' : 'Save & Register Patient'}
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Step Indicator Header */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {stepsList.map((step) => {
              const isCurrent = currentStep === step.id;
              const isPast = currentStep > step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleTabClick(step.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-white text-teal-700 shadow-sm ring-1 ring-teal-500/20'
                      : isPast
                      ? 'bg-teal-50/80 text-teal-800 hover:bg-teal-100/60'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-teal-600 text-white'
                        : isPast
                        ? 'bg-teal-200 text-teal-900'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPast ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : step.id}
                  </span>
                  <span className="truncate">{step.name}</span>
                </button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* ================= STEP 1: DEMOGRAPHICS ================= */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in-50 duration-150 text-xs">
            {/* Section 1: Full Legal Name */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className={sectionHeaderCls}>
                <User className="w-4 h-4 text-teal-600" /> Patient Legal Identity &amp; Full Name
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className={labelCls}>First Name *</label>
                  <input
                    required
                    className={inputCls(errors.firstName)}
                    value={formData.firstName}
                    onChange={e => set('firstName', e.target.value.replace(/[^a-zA-Z\s'-]/g, ''))}
                    placeholder="e.g. John"
                  />
                  {errors.firstName && <p className="text-[10px] text-rose-500 mt-0.5">{errors.firstName}</p>}
                </div>
                <div>
                  <label className={labelCls}>Middle Name</label>
                  <input
                    className={inputCls()}
                    value={formData.middleName}
                    onChange={e => set('middleName', e.target.value.replace(/[^a-zA-Z\s'-]/g, ''))}
                    placeholder="e.g. Robert"
                  />
                </div>
                <div>
                  <label className={labelCls}>Last Name *</label>
                  <input
                    required
                    className={inputCls(errors.lastName)}
                    value={formData.lastName}
                    onChange={e => set('lastName', e.target.value.replace(/[^a-zA-Z\s'-]/g, ''))}
                    placeholder="e.g. Smith"
                  />
                  {errors.lastName && <p className="text-[10px] text-rose-500 mt-0.5">{errors.lastName}</p>}
                </div>
                <div>
                  <label className={labelCls}>Suffix</label>
                  <select className={inputCls()} value={formData.suffix} onChange={e => set('suffix', e.target.value)}>
                    <option value="">None</option>
                    <option>Jr.</option>
                    <option>Sr.</option>
                    <option>II</option>
                    <option>III</option>
                    <option>IV</option>
                    <option>MD</option>
                    <option>PhD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Vital Details & Dates */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className={sectionHeaderCls}>
                <Calendar className="w-4 h-4 text-teal-600" /> Vital Details &amp; Personal Demographics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Date of Birth *</label>
                  <input
                    type="date"
                    required
                    className={inputCls(errors.dob)}
                    value={formData.dob}
                    onChange={e => set('dob', e.target.value)}
                  />
                  {errors.dob && <p className="text-[10px] text-rose-500 mt-0.5">{errors.dob}</p>}
                </div>
                <div>
                  <label className={labelCls}>Gender / Biological Sex *</label>
                  <select className={inputCls()} value={formData.sex} onChange={e => set('sex', e.target.value)}>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="OTHER">Other / Non-Binary</option>
                    <option value="UNKNOWN">Prefer not to disclose</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Marital Status</label>
                  <select className={inputCls()} value={formData.maritalStatus} onChange={e => set('maritalStatus', e.target.value)}>
                    <option value="SINGLE">Single</option>
                    <option value="MARRIED">Married</option>
                    <option value="DIVORCED">Divorced</option>
                    <option value="WIDOWED">Widowed</option>
                    <option value="SEPARATED">Separated</option>
                    <option value="DOMESTIC_PARTNER">Domestic Partner</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>
                    Social Security Number (SSN)
                    <span className="text-[10px] text-slate-400 font-normal ml-1">(Optional / 9 digits)</span>
                  </label>
                  <input
                    className={inputCls(errors.ssn)}
                    maxLength={11}
                    value={formData.ssn}
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
                      let formatted = digits;
                      if (digits.length > 5) formatted = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
                      else if (digits.length > 3) formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
                      set('ssn', formatted);
                    }}
                    placeholder="XXX-XX-XXXX"
                  />
                  {errors.ssn && <p className="text-[10px] text-rose-600 mt-0.5">{errors.ssn}</p>}
                </div>
                <div>
                  <label className={labelCls}>Driver's License #</label>
                  <input
                    className={inputCls()}
                    value={formData.driversLicense}
                    onChange={e => set('driversLicense', e.target.value)}
                    placeholder="TX-8921820"
                  />
                </div>
                <div>
                  <label className={labelCls}>DL State</label>
                  <input
                    className={inputCls()}
                    value={formData.driversLicenseState}
                    onChange={e => set('driversLicenseState', e.target.value)}
                    placeholder="TX"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Language, Ethnicity & Employment */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className={sectionHeaderCls}>
                <Briefcase className="w-4 h-4 text-teal-600" /> Language, Ethnicity &amp; Employment
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Primary Language</label>
                  <select className={inputCls()} value={formData.language} onChange={e => set('language', e.target.value)}>
                    <option>English</option>
                    <option>Spanish</option>
                    <option>Vietnamese</option>
                    <option>Arabic</option>
                    <option>Mandarin</option>
                    <option>Cantonese</option>
                    <option>French</option>
                    <option>Hindi</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Ethnicity / Race</label>
                  <select className={inputCls()} value={formData.ethnicity} onChange={e => set('ethnicity', e.target.value)}>
                    <option>Non-Hispanic</option>
                    <option>Hispanic / Latino</option>
                    <option>Asian</option>
                    <option>African American / Black</option>
                    <option>Caucasian / White</option>
                    <option>Native American</option>
                    <option>Pacific Islander</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Employment Status</label>
                  <select className={inputCls()} value={formData.employmentStatus} onChange={e => set('employmentStatus', e.target.value)}>
                    <option>Employed Full-Time</option>
                    <option>Employed Part-Time</option>
                    <option>Self-Employed</option>
                    <option>Retired</option>
                    <option>Student</option>
                    <option>Unemployed</option>
                    <option>Disabled</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Employer Name</label>
                  <input
                    className={inputCls()}
                    value={formData.employerName}
                    onChange={e => set('employerName', e.target.value)}
                    placeholder="e.g. ABC Logistics LLC"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: CONTACT & INSURANCE ================= */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in-50 duration-150 text-xs">
            {/* Section 1: Contact Methods */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className={sectionHeaderCls}>
                <Phone className="w-4 h-4 text-teal-600" /> Contact Numbers &amp; Email
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Primary Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    className={inputCls(errors.phone)}
                    value={formData.phone}
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      let formatted = digits;
                      if (digits.length > 6) formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                      else if (digits.length > 3) formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
                      set('phone', formatted);
                    }}
                    placeholder="(713) 555-0199"
                  />
                  {errors.phone && <p className="text-[10px] text-rose-500 mt-0.5">{errors.phone}</p>}
                </div>
                <div>
                  <label className={labelCls}>Alternate / Home Phone</label>
                  <input
                    type="tel"
                    className={inputCls()}
                    value={formData.altPhone}
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      let formatted = digits;
                      if (digits.length > 6) formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                      else if (digits.length > 3) formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
                      set('altPhone', formatted);
                    }}
                    placeholder="(713) 555-0100"
                  />
                </div>
                <div>
                  <label className={labelCls}>Email Address *</label>
                  <input
                    type="email"
                    required
                    className={inputCls(errors.email)}
                    value={formData.email}
                    onChange={e => set('email', e.target.value.trim())}
                    placeholder="patient@example.test"
                  />
                  {errors.email && <p className="text-[10px] text-rose-500 mt-0.5">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Physical Address */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className={sectionHeaderCls}>
                <Briefcase className="w-4 h-4 text-teal-600" /> Physical Residence &amp; Mailing Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Street Address *</label>
                  <input
                    required
                    className={inputCls(errors.address_street)}
                    value={formData.address.street}
                    onChange={e => setAddr('street', e.target.value)}
                    placeholder="10101 Harwin Dr."
                  />
                  {errors.address_street && <p className="text-[10px] text-rose-500 mt-0.5">{errors.address_street}</p>}
                </div>
                <div>
                  <label className={labelCls}>Suite / Apt / Unit #</label>
                  <input
                    className={inputCls()}
                    value={formData.address.suite}
                    onChange={e => setAddr('suite', e.target.value)}
                    placeholder="Suite 200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <div className="col-span-2">
                  <label className={labelCls}>City *</label>
                  <input
                    required
                    className={inputCls(errors.address_city)}
                    value={formData.address.city}
                    onChange={e => setAddr('city', e.target.value.replace(/[^a-zA-Z\s.-]/g, ''))}
                    placeholder="Houston"
                  />
                  {errors.address_city && <p className="text-[10px] text-rose-500 mt-0.5">{errors.address_city}</p>}
                </div>
                <div>
                  <label className={labelCls}>State</label>
                  <input
                    className={inputCls()}
                    value={formData.address.state}
                    onChange={e => setAddr('state', e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2))}
                    placeholder="TX"
                  />
                </div>
                <div>
                  <label className={labelCls}>Zip Code</label>
                  <input
                    className={inputCls()}
                    maxLength={5}
                    value={formData.address.zipCode}
                    onChange={e => setAddr('zipCode', e.target.value.replace(/\D/g, '').slice(0, 5))}
                    placeholder="77036"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Primary & Auto Insurance */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className={sectionHeaderCls}>
                <Shield className="w-4 h-4 text-teal-600" /> Primary / Auto Insurance Carrier Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Coverage / Payer Type</label>
                  <select className={inputCls()} value={formData.insuranceType} onChange={e => set('insuranceType', e.target.value)}>
                    <option>Auto Accident / Third-Party PIP</option>
                    <option>Commercial Health Insurance</option>
                    <option>Workers Compensation</option>
                    <option>Self-Pay / Letter of Protection (LOP)</option>
                    <option>Medicare / Medicaid</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Insurance Carrier Name</label>
                  <input
                    className={inputCls()}
                    value={formData.primaryInsuranceCompany}
                    onChange={e => set('primaryInsuranceCompany', e.target.value)}
                    placeholder="e.g. Geico Auto Insurance, Progressive"
                  />
                </div>
                <div>
                  <label className={labelCls}>Policy / Claim Number</label>
                  <input
                    className={inputCls()}
                    value={formData.primaryPolicyNumber}
                    onChange={e => set('primaryPolicyNumber', e.target.value)}
                    placeholder="e.g. POL-TX-9921"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className={labelCls}>Group / Plan #</label>
                  <input
                    className={inputCls()}
                    value={formData.primaryGroupNumber}
                    onChange={e => set('primaryGroupNumber', e.target.value)}
                    placeholder="GRP-1002"
                  />
                </div>
                <div>
                  <label className={labelCls}>Member / Claim ID</label>
                  <input
                    className={inputCls()}
                    value={formData.primaryInsuranceMemberId}
                    onChange={e => set('primaryInsuranceMemberId', e.target.value)}
                    placeholder="MBR-88219"
                  />
                </div>
                <div>
                  <label className={labelCls}>Insurance Adjuster Name</label>
                  <input
                    className={inputCls()}
                    value={formData.insuranceAdjusterName}
                    onChange={e => set('insuranceAdjusterName', e.target.value.replace(/[^a-zA-Z\s'-]/g, ''))}
                    placeholder="e.g. Robert Vance"
                  />
                </div>
                <div>
                  <label className={labelCls}>Adjuster Phone / Contact</label>
                  <input
                    type="tel"
                    className={inputCls()}
                    value={formData.insuranceAdjusterPhone}
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      let formatted = digits;
                      if (digits.length > 6) formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                      else if (digits.length > 3) formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
                      set('insuranceAdjusterPhone', formatted);
                    }}
                    placeholder="(800) 555-0199"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Secondary Insurance & Emergency Contact */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className={sectionHeaderCls}>
                <Phone className="w-4 h-4 text-teal-600" /> Secondary Insurance &amp; Emergency Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Secondary Insurance Carrier (Optional)</label>
                  <input
                    className={inputCls()}
                    value={formData.secondaryInsuranceCompany}
                    onChange={e => set('secondaryInsuranceCompany', e.target.value)}
                    placeholder="e.g. Blue Cross Blue Shield"
                  />
                </div>
                <div>
                  <label className={labelCls}>Secondary Policy / Member #</label>
                  <input
                    className={inputCls()}
                    value={formData.secondaryPolicyNumber}
                    onChange={e => set('secondaryPolicyNumber', e.target.value)}
                    placeholder="e.g. SEC-POL-8820"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200 pt-2.5">
                <div>
                  <label className={labelCls}>Emergency Contact Name</label>
                  <input
                    className={inputCls()}
                    value={formData.emergencyContactName}
                    onChange={e => set('emergencyContactName', e.target.value.replace(/[^a-zA-Z\s'-]/g, ''))}
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className={labelCls}>Relationship</label>
                  <select
                    className={inputCls()}
                    value={formData.emergencyContactRelation}
                    onChange={e => set('emergencyContactRelation', e.target.value)}
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Attorney">Attorney / Legal Rep</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Emergency Contact Phone</label>
                  <input
                    type="tel"
                    className={inputCls()}
                    value={formData.emergencyContactPhone}
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      let formatted = digits;
                      if (digits.length > 6) formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                      else if (digits.length > 3) formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
                      set('emergencyContactPhone', formatted);
                    }}
                    placeholder="(713) 555-0102"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PRACTICE PROVIDERS ================= */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in-50 duration-150 text-xs">
            {/* Section 1: 4 Practice Entity Selection */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-teal-600" /> Assign Practice Providers to Patient Chart
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Select the multi-disciplinary clinics that will provide clinical evaluation, therapy &amp; billing:
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllProviders}
                    className="text-[11px] font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer"
                  >
                    Select All 4 Clinics
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={handleClearAllProviders}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-700 underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {errors.assignedProviderIds && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errors.assignedProviderIds}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRACTICE_PROVIDERS.map((prov) => {
                  const isSelected = formData.assignedProviderIds.includes(prov.id);
                  const ProvIcon = prov.icon;
                  return (
                    <div
                      key={prov.id}
                      onClick={() => handleToggleProvider(prov.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-150 flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-100/70 opacity-75'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div
                          className={`p-2 rounded-xl flex-shrink-0 ${
                            isSelected ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          <ProvIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <strong className="text-xs font-bold text-slate-900">{prov.name}</strong>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${prov.badgeColor}`}
                            >
                              {prov.badge}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-600 mt-0.5">{prov.specialty}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Attending: {prov.provider} â€¢ {prov.pos}</p>
                          <p className="text-[10px] text-slate-500 italic mt-1">{prov.scope}</p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all mt-0.5 flex-shrink-0 ${
                          isSelected
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span>
                  Selected Coverage: <strong>{formData.assignedProviderIds.length} of 4 clinics</strong>
                </span>
                <span className="text-teal-700 font-semibold">
                  {formData.assignedProviderIds.length === 4
                    ? '✓ Complete Practice Coverage'
                    : `${formData.assignedProviderIds.length} clinic(s) assigned`}
                </span>
              </div>
            </div>

            {/* Section 2: Referring Attorney, Lien & External Providers */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className={sectionHeaderCls}>
                <Scale className="w-4 h-4 text-teal-600" /> Referring Attorney Lien &amp; External Providers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Referring Attorney / Law Firm</label>
                  <input
                    className={inputCls()}
                    value={formData.referringAttorney}
                    onChange={e => set('referringAttorney', e.target.value)}
                    placeholder="e.g. Davis Injury Law Group"
                  />
                </div>
                <div>
                  <label className={labelCls}>Attorney Case Manager &amp; Direct Phone</label>
                  <input
                    className={inputCls()}
                    value={formData.attorneyCaseManager}
                    onChange={e => set('attorneyCaseManager', e.target.value)}
                    placeholder="e.g. Maria Gonzalez (713-555-0300)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Referring Physician</label>
                  <input
                    className={inputCls()}
                    value={formData.referringProvider}
                    onChange={e => set('referringProvider', e.target.value)}
                    placeholder="Dr. Anthony Nguyen"
                  />
                </div>
                <div>
                  <label className={labelCls}>Referring Physician NPI (10 digits)</label>
                  <input
                    className={inputCls()}
                    maxLength={10}
                    value={formData.referringProviderNpi}
                    onChange={e => set('referringProviderNpi', e.target.value)}
                    placeholder="1982736451"
                  />
                </div>
                <div>
                  <label className={labelCls}>Primary Care Physician (PCP)</label>
                  <input
                    className={inputCls()}
                    value={formData.primaryCareProvider}
                    onChange={e => set('primaryCareProvider', e.target.value)}
                    placeholder="Dr. Sarah Mitchell"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: MEDICAL & ALLERGIES (FINAL STEP & SUMMARY) ================= */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in-50 duration-150 text-xs">
            {/* Section 1: Allergies & Severity */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className={sectionHeaderCls}>
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Allergies, Sensitivities &amp; Reaction Severity
              </h3>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-700">Quick-Select Allergy Chips:</span>
                  <span className="text-[10px] text-slate-400">Click to append</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {QUICK_ALLERGIES.map(chip => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleAddAllergyChip(chip)}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-white hover:bg-teal-50 hover:text-teal-700 text-slate-700 border border-slate-200 transition cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Known Allergies &amp; Substances</label>
                  <input
                    className={inputCls()}
                    placeholder="e.g. Penicillin, Sulfa, Latex, NKDA"
                    value={formData.knownAllergies}
                    onChange={e => set('knownAllergies', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Reaction Severity</label>
                  <select
                    className={inputCls()}
                    value={formData.allergyReactionSeverity}
                    onChange={e => set('allergyReactionSeverity', e.target.value)}
                  >
                    <option>None / NKDA</option>
                    <option>Mild (Rash / Itching)</option>
                    <option>Moderate (Hives / Local Swelling)</option>
                    <option>Severe (Anaphylaxis / Airway Compromise)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Medications & Clinical History */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className={sectionHeaderCls}>
                <Stethoscope className="w-4 h-4 text-teal-600" /> Current Medications &amp; Medical History
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Current Medications &amp; Dosages</label>
                  <input
                    className={inputCls()}
                    placeholder="e.g. Ibuprofen 600mg TID, Cyclobenzaprine 10mg QHS"
                    value={formData.currentMedications}
                    onChange={e => set('currentMedications', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Past Medical &amp; Surgical History</label>
                  <input
                    className={inputCls()}
                    placeholder="e.g. Non-contributory prior to MVA, prior arthroscopy"
                    value={formData.pastMedicalHistory}
                    onChange={e => set('pastMedicalHistory', e.target.value)}
                  />
                </div>
              </div>

              {/* Chief Complaints / Injury Areas */}
              <div>
                <label className={labelCls}>Chief Complaints &amp; Injury Areas (Toggle active)</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {INJURY_AREAS.map(area => {
                    const isSelected = formData.selectedInjuryAreas.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => handleToggleInjuryArea(area)}
                        className={`text-[10px] px-2.5 py-1 rounded-xl font-bold transition cursor-pointer border ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {area}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 3: Accident Details & Intake Notes */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className={sectionHeaderCls}>
                <FileText className="w-4 h-4 text-teal-600" /> Incident Date &amp; Clinical Intake Notes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Accident / Injury Date</label>
                  <input
                    type="date"
                    className={inputCls()}
                    value={formData.accidentDate}
                    onChange={e => set('accidentDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Mechanism of Injury</label>
                  <select
                    className={inputCls()}
                    value={formData.mechanismOfInjury}
                    onChange={e => set('mechanismOfInjury', e.target.value)}
                  >
                    <option>Motor Vehicle Collision - Driver</option>
                    <option>Motor Vehicle Collision - Passenger</option>
                    <option>Motor Vehicle Collision - Pedestrian / Cyclist</option>
                    <option>Slip and Fall / Premise Liability</option>
                    <option>Workplace Injury / Workers Comp</option>
                    <option>Other Traumatic Injury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Initial Clinical Intake &amp; Referral Notes</label>
                <textarea
                  rows={2}
                  className={inputCls()}
                  value={formData.patientNotes}
                  onChange={e => set('patientNotes', e.target.value)}
                  placeholder="Enter intake reason, attorney lien details, initial complaints, and clinical notes..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                <input
                  type="checkbox"
                  id="hipaaConsent"
                  checked={formData.hipaaConsentSigned}
                  onChange={e => set('hipaaConsentSigned', e.target.checked)}
                  className="rounded text-teal-600 cursor-pointer"
                />
                <label htmlFor="hipaaConsent" className="text-[11px] font-medium text-slate-700 cursor-pointer">
                  Patient has completed electronic intake consent, HIPAA privacy acknowledgment &amp; assignment of benefits.
                </label>
              </div>
            </div>

            {/* Section 4: Live Verification Summary Card */}
            <div className="bg-gradient-to-r from-teal-50/80 to-slate-50 p-3.5 rounded-2xl border border-teal-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> Complete Intake Verification Summary
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                  Ready to Register
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] text-slate-400 block font-semibold">PATIENT IDENTITY</span>
                  <strong className="text-slate-900 truncate block">
                    {formData.firstName || 'â€”'} {formData.middleName ? `${formData.middleName} ` : ''}{formData.lastName || 'â€”'} {formData.suffix}
                  </strong>
                  <span className="text-[10px] text-slate-500 block">
                    DOB: {formData.dob || 'â€”'} ({formData.sex})
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    DL: {formData.driversLicense} ({formData.driversLicenseState})
                  </span>
                </div>

                <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] text-slate-400 block font-semibold">CONTACT &amp; ADDRESS</span>
                  <strong className="text-slate-900 truncate block">{formData.phone || 'â€”'}</strong>
                  <span className="text-[10px] text-slate-500 truncate block">{formData.email || 'â€”'}</span>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {formData.address.street}, {formData.address.city}
                  </span>
                </div>

                <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] text-slate-400 block font-semibold">INSURANCE &amp; LIEN</span>
                  <strong className="text-slate-900 truncate block">
                    {formData.primaryInsuranceCompany || 'Self-Pay / Lien'}
                  </strong>
                  <span className="text-[10px] text-slate-500 truncate block">
                    Claim: {formData.primaryPolicyNumber || 'N/A'}
                  </span>
                  <span className="text-[10px] text-teal-700 truncate block">
                    Lien: {formData.referringAttorney || 'None'}
                  </span>
                </div>

                <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] text-slate-400 block font-semibold">ASSIGNED CLINICS</span>
                  <strong className="text-teal-700 block">
                    {formData.assignedProviderIds.length} of 4 Practices
                  </strong>
                  <span className="text-[10px] text-slate-500 block">
                    Allergies: {formData.knownAllergies ? 'Noted' : 'None'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Injuries: {formData.selectedInjuryAreas.length} Areas
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
