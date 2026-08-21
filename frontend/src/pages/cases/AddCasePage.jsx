// src/pages/cases/AddCasePage.jsx
import React, { useState, useEffect } from 'react';
import { apiCaseService as mockCaseService } from '../../services/api/apiCaseService';
import { apiPatientService as mockPatientService } from '../../services/api/apiPatientService';
import { DynamicDiagnosisPicker } from '../../components/common/DynamicDiagnosisPicker';
import { useUIStore } from '../../store/uiStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, FileText, Shield, User, MapPin, Stethoscope, 
  Scale, PlusCircle, Clock, AlertTriangle, CheckCircle2 
} from 'lucide-react';

const todayStr = new Date().toISOString().split('T')[0];

const inputCls = (hasError) =>
  `w-full px-3 py-2 text-xs rounded-xl border ${
    hasError
      ? 'border-rose-400 bg-rose-50/50 text-slate-900 focus:border-rose-500 ring-1 ring-rose-300'
      : 'border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600'
  } focus:ring-1 focus:ring-teal-600 outline-none transition`;

const labelCls = 'block text-xs font-bold text-slate-800 mb-1';
const sectionHead = (Icon, title) => (
  <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2 mb-4">
    <Icon className="w-4 h-4 text-teal-600" /> {title}
  </h2>
);

const INITIAL_CASE_STATE = {
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
  vehicleType: 'Sedan',
  impactType: 'REAR_END',
  seatPosition: 'DRIVER',
  seatbeltUsed: true,
  airbagsDeployed: false,
  emergencyTransport: false,
  transportDestination: '',
  policeReportFiled: false,
  policeReportNumber: '',
  policeAgency: '',
  chiefComplaint: '',
  injuryBodyParts: '',
  diagnosisCodes: [],
  caseNotes: '',
  attorneyName: '',
  lawFirm: '',
  attorneyPhone: '',
  attorneyEmail: '',
  lawFirmAddress: '',
  litigationStatus: 'PRE_LITIGATION',
  insuranceCompany: '',
  policyNumber: '',
  claimNumber: '',
  adjusterName: '',
  adjusterPhone: '',
  adjusterEmail: '',
  coverageType: 'THIRD_PARTY_LIABILITY',
  pipAvailable: false,
  pipLimit: '',
  umAvailable: false,
  assignedProviderIds: ['prov-josmic', 'prov-davs', 'prov-anik', 'prov-counselor']
};

export const AddCasePage = () => {
  const [formData, setFormData] = useState(INITIAL_CASE_STATE);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { addToast } = useUIStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryPatientId = searchParams.get('patientId');

  const applyPatientData = (patientObj) => {
    setFormData(prev => ({
      ...prev,
      patientId: patientObj.id || '',
      patientName: `${patientObj.firstName || ''} ${patientObj.lastName || ''}`.trim(),
      patientDob: patientObj.dob || '',
      patientPhone: patientObj.phone || '',
      // Auto-fill accident date from patient intake if present
      accidentDate: patientObj.accidentDate || patientObj.incidentDate || prev.accidentDate || '',
      mechanismOfInjury: patientObj.mechanismOfInjury || prev.mechanismOfInjury || '',
      injuryBodyParts: Array.isArray(patientObj.selectedInjuryAreas)
        ? patientObj.selectedInjuryAreas.join(', ')
        : (patientObj.injuryBodyParts || prev.injuryBodyParts || ''),
      chiefComplaint: patientObj.chiefComplaint || patientObj.patientNotes || prev.chiefComplaint || '',
      attorneyName: patientObj.referringAttorney || patientObj.attorneyName || prev.attorneyName || '',
      lawFirm: patientObj.lawFirm || patientObj.attorneyLawFirm || (patientObj.referringAttorney ? `${patientObj.referringAttorney}` : prev.lawFirm || ''),
      insuranceCompany: patientObj.primaryInsuranceCompany || prev.insuranceCompany || '',
      policyNumber: patientObj.primaryPolicyNumber || prev.policyNumber || '',
      claimNumber: patientObj.primaryPolicyNumber || prev.claimNumber || '',
      adjusterName: patientObj.insuranceAdjusterName || patientObj.adjusterName || prev.adjusterName || '',
      adjusterPhone: patientObj.insuranceAdjusterPhone || patientObj.adjusterPhone || prev.adjusterPhone || '',
      caseNotes: patientObj.patientNotes || prev.caseNotes || ''
    }));
  };

  useEffect(() => {
    mockPatientService.getPatients().then(data => {
      setPatients(data || []);
      if (queryPatientId && data) {
        const found = data.find(p => p.id === queryPatientId || p.patientId === queryPatientId);
        if (found) {
          applyPatientData(found);
        }
      }
    }).catch(() => {});
  }, [queryPatientId]);

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

    if (formData.accidentDate > todayStr) {
      return {
        isInvalid: true,
        message: `Date of Accident (${formData.accidentDate}) cannot be in the future. Today is ${todayStr}.`
      };
    }

    if (formData.initialDate && formData.accidentDate > formData.initialDate) {
      return {
        isInvalid: true,
        message: `Date of Accident (${formData.accidentDate}) cannot be AFTER Admission / Initial Treatment Date (${formData.initialDate}). The accident must have occurred on or before admission.`
      };
    }

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
    e.preventDefault();
    const newErrors = {};
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient selection is required.';
    }
    if (!formData.accidentDate) {
      newErrors.accidentDate = 'Accident date is required.';
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
      if (formData.patientId) {
        navigate(`/patients/${formData.patientId}/profile`);
      } else {
        navigate('/cases');
      }
    } catch {
      addToast('Failed to create accident case', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create New Accident &amp; Legal Case</h1>
        <p className="text-xs text-slate-500">Register incident details, verify injury timeline &amp; link auto insurance coverage</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Details */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          {sectionHead(User, 'Patient Identification')}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Select Registered Patient *</label>
              {patients.length > 0 ? (
                <select
                  className={inputCls(errors.patientName)}
                  value={formData.patientId}
                  onChange={e => handlePatientSelect(e.target.value)}
                >
                  <option value="">-- Select Patient from Registry --</option>
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

        {/* Accident Incident Info & Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          {sectionHead(Shield, 'Incident Timeline & Accident Information')}
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Date of Accident (DOA) *</label>
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
              <label className={labelCls}>Initial Treatment / Admission Date *</label>
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

          {/* Timeline Real-Time Validation Box */}
          {timelineCheck && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs font-semibold ${
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
                  {timelineCheck.isInvalid ? 'Timeline Sequence Error:' : 'Timeline Verified:'}
                </span>
                <span>{timelineCheck.message}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className={labelCls}>Accident Type</label>
              <select className={inputCls()} value={formData.accidentType} onChange={e => set('accidentType', e.target.value)}>
                <option value="AUTO_ACCIDENT">Auto Accident (Motor Vehicle Collision)</option>
                <option value="SLIP_AND_FALL">Slip &amp; Fall / Premise Liability</option>
                <option value="WORKERS_COMP">Worker's Comp</option>
                <option value="OTHER">Other Injury</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Police Report Number</label>
              <input
                className={inputCls()}
                value={formData.policeReportNumber}
                onChange={e => set('policeReportNumber', e.target.value)}
                placeholder="e.g. HPD-2026-88192"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Accident Location / Street / City</label>
              <input
                className={inputCls()}
                value={formData.accidentLocation}
                onChange={e => set('accidentLocation', e.target.value)}
                placeholder="e.g. I-10 Westbound near Gessner Rd, Houston TX"
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

        {/* Legal & Lien Representation */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          {sectionHead(Scale, 'Attorney Lien & Legal Representation')}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <option value="SETTLED">Settled / Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Auto / Third-Party Insurance */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          {sectionHead(Shield, 'Auto Insurance & Adjuster Information')}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                value={formData.claimNumber}
                onChange={e => set('claimNumber', e.target.value)}
                placeholder="e.g. CLM-2026-88192"
              />
            </div>
            <div>
              <label className={labelCls}>Policy Number</label>
              <input
                className={inputCls()}
                value={formData.policyNumber}
                onChange={e => set('policyNumber', e.target.value)}
                placeholder="e.g. POL-TX-9921"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Insurance Adjuster Name</label>
              <input
                className={inputCls()}
                value={formData.adjusterName}
                onChange={e => set('adjusterName', e.target.value)}
                placeholder="e.g. Marcus Vance"
              />
            </div>
            <div>
              <label className={labelCls}>Adjuster Direct Phone</label>
              <input
                className={inputCls()}
                value={formData.adjusterPhone}
                onChange={e => set('adjusterPhone', e.target.value)}
                placeholder="e.g. 800-555-0199"
              />
            </div>
          </div>
        </div>

        {/* Diagnoses & Clinical Notes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          {sectionHead(Stethoscope, 'Clinical Diagnoses & Case Notes')}
          <DynamicDiagnosisPicker
            selectedCodes={formData.diagnosisCodes}
            onChange={(codes) => set('diagnosisCodes', codes)}
            label="Case Diagnostic Codes (Box 21 ICD-10 Pointers A-L)"
          />

          <div>
            <label className={labelCls}>Chief Complaints &amp; Injury Summary</label>
            <textarea
              rows={2}
              className={inputCls()}
              value={formData.chiefComplaint}
              onChange={e => set('chiefComplaint', e.target.value)}
              placeholder="e.g. Severe neck stiffness, lumbar radiating pain, headaches..."
            />
          </div>

          <div>
            <label className={labelCls}>Case Notes &amp; 4-Provider Coordination</label>
            <textarea
              rows={2}
              className={inputCls()}
              value={formData.caseNotes}
              onChange={e => set('caseNotes', e.target.value)}
              placeholder="Enter attorney coordination notes, treatment goals, or liability updates..."
            />
          </div>
        </div>

        {/* Form Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || (timelineCheck && timelineCheck.isInvalid)}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> {isLoading ? 'Creating Case...' : 'Save & Create Accident Case'}
          </button>
        </div>
      </form>
    </div>
  );
};
