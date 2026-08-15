// src/pages/patients/AddPatientPage.jsx
import React, { useState } from 'react';
import { mockPatientService } from '../../services/mock/mockPatientService';
import { useUIStore } from '../../store/uiStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Phone, Shield, FileText, Stethoscope } from 'lucide-react';

const inputCls = 'w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition';
const labelCls = 'block text-xs font-bold text-on-surface mb-1';

const SectionHead = ({ Icon, title }) => (
  <h2 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2 flex items-center gap-2 mb-4">
    <Icon className="w-4 h-4 text-teal-600" /> {title}
  </h2>
);

export const AddPatientPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dob: '1985-05-15',
    sex: 'M',
    maritalStatus: 'SINGLE',
    ssn: '',
    driversLicense: '',
    driversLicenseState: 'TX',
    language: 'English',
    ethnicity: '',
    phone: '',
    altPhone: '',
    email: '',
    address: { street: '', suite: '', city: 'Houston', state: 'TX', zipCode: '77036' },
    communicationPref: 'SMS',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    primaryInsuranceCompany: '',
    primaryPolicyNumber: '',
    primaryGroupNumber: '',
    primaryInsuranceMemberId: '',
    secondaryInsuranceCompany: '',
    secondaryPolicyNumber: '',
    referringProvider: '',
    referringProviderNpi: '',
    primaryCareProvider: '',
    assignedProviderIds: ['prov-josmic', 'prov-davs', 'prov-anik', 'prov-counselor'],
    knownAllergies: '',
    currentMedications: '',
    pastMedicalHistory: '',
    patientNotes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const set = (field, val) => setFormData(p => ({ ...p, [field]: val }));
  const setAddr = (field, val) => setFormData(p => ({ ...p, address: { ...p.address, [field]: val } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const created = await mockPatientService.createPatient(formData);
      addToast(`Patient ${created.firstName} ${created.lastName} registered!`, 'success');
      navigate(`/patients/${created.id}/profile`);
    } catch {
      addToast('Failed to register patient', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/patients')} className="flex items-center gap-1 text-xs font-bold text-secondary-container hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Patient Registry
      </button>

      <div>
        <h1 className="text-2xl font-bold text-on-surface">Register New Patient</h1>
        <p className="text-xs text-on-surface-variant">Enter demographics, contact info &amp; provider assignment</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Demographics */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          <SectionHead Icon={User} title="Patient Demographics" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><label className={labelCls}>First Name *</label><input required className={inputCls} value={formData.firstName} onChange={e => set('firstName', e.target.value)} placeholder="e.g. John" /></div>
            <div><label className={labelCls}>Middle Name</label><input className={inputCls} value={formData.middleName} onChange={e => set('middleName', e.target.value)} /></div>
            <div><label className={labelCls}>Last Name *</label><input required className={inputCls} value={formData.lastName} onChange={e => set('lastName', e.target.value)} placeholder="e.g. Doe" /></div>
            <div><label className={labelCls}>Suffix</label>
              <select className={inputCls} value={formData.suffix} onChange={e => set('suffix', e.target.value)}>
                <option value="">None</option><option>Jr.</option><option>Sr.</option><option>II</option><option>III</option><option>MD</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Date of Birth *</label><input type="date" required className={inputCls} value={formData.dob} onChange={e => set('dob', e.target.value)} /></div>
            <div><label className={labelCls}>Gender *</label>
              <select className={inputCls} value={formData.sex} onChange={e => set('sex', e.target.value)}>
                <option value="M">Male</option><option value="F">Female</option><option value="Other">Other / Non-Binary</option><option value="UNKNOWN">Prefer not to say</option>
              </select>
            </div>
            <div><label className={labelCls}>Marital Status</label>
              <select className={inputCls} value={formData.maritalStatus} onChange={e => set('maritalStatus', e.target.value)}>
                <option value="SINGLE">Single</option><option value="MARRIED">Married</option><option value="DIVORCED">Divorced</option><option value="WIDOWED">Widowed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>SSN (Last 4)</label><input className={inputCls} maxLength={4} value={formData.ssn} onChange={e => set('ssn', e.target.value)} placeholder="XXXX" /></div>
            <div><label className={labelCls}>Driver's License #</label><input className={inputCls} value={formData.driversLicense} onChange={e => set('driversLicense', e.target.value)} /></div>
            <div><label className={labelCls}>DL State</label><input className={inputCls} value={formData.driversLicenseState} onChange={e => set('driversLicenseState', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Preferred Language</label>
              <select className={inputCls} value={formData.language} onChange={e => set('language', e.target.value)}>
                <option>English</option><option>Spanish</option><option>French</option><option>Mandarin</option><option>Arabic</option><option>Other</option>
              </select>
            </div>
            <div><label className={labelCls}>Communication Preference</label>
              <select className={inputCls} value={formData.communicationPref} onChange={e => set('communicationPref', e.target.value)}>
                <option value="SMS">SMS Text Message</option><option value="EMAIL">Email Notification</option><option value="PHONE">Phone Call</option><option value="PORTAL">Patient Portal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact & Address */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          <SectionHead Icon={Phone} title="Contact & Address Details" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Primary Phone *</label><input type="tel" required className={inputCls} value={formData.phone} onChange={e => set('phone', e.target.value)} placeholder="713-555-0100" /></div>
            <div><label className={labelCls}>Alternate Phone</label><input type="tel" className={inputCls} value={formData.altPhone} onChange={e => set('altPhone', e.target.value)} placeholder="713-555-0199" /></div>
            <div><label className={labelCls}>Email Address *</label><input type="email" required className={inputCls} value={formData.email} onChange={e => set('email', e.target.value)} placeholder="patient@example.test" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2"><label className={labelCls}>Street Address</label><input className={inputCls} value={formData.address.street} onChange={e => setAddr('street', e.target.value)} placeholder="17650 Carnation Glen Dr" /></div>
            <div><label className={labelCls}>Suite / Apt #</label><input className={inputCls} value={formData.address.suite} onChange={e => setAddr('suite', e.target.value)} placeholder="Apt 2B" /></div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            <div className="col-span-2"><label className={labelCls}>City</label><input className={inputCls} value={formData.address.city} onChange={e => setAddr('city', e.target.value)} /></div>
            <div><label className={labelCls}>State</label><input className={inputCls} value={formData.address.state} onChange={e => setAddr('state', e.target.value)} /></div>
            <div><label className={labelCls}>ZIP Code</label><input className={inputCls} value={formData.address.zipCode} onChange={e => setAddr('zipCode', e.target.value)} /></div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          <SectionHead Icon={Phone} title="Emergency Contact" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Contact Name</label><input className={inputCls} value={formData.emergencyContactName} onChange={e => set('emergencyContactName', e.target.value)} placeholder="Jane Doe" /></div>
            <div><label className={labelCls}>Relationship</label>
              <select className={inputCls} value={formData.emergencyContactRelation} onChange={e => set('emergencyContactRelation', e.target.value)}>
                <option value="">Select...</option><option>Spouse</option><option>Parent</option><option>Child</option><option>Sibling</option><option>Friend</option><option>Other</option>
              </select>
            </div>
            <div><label className={labelCls}>Contact Phone</label><input type="tel" className={inputCls} value={formData.emergencyContactPhone} onChange={e => set('emergencyContactPhone', e.target.value)} placeholder="713-555-0200" /></div>
          </div>
        </div>

        {/* Insurance */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          <SectionHead Icon={Shield} title="Insurance Information" />
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide -mt-2 mb-1">Primary Insurance</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Insurance Company</label><input className={inputCls} value={formData.primaryInsuranceCompany} onChange={e => set('primaryInsuranceCompany', e.target.value)} placeholder="Blue Cross Blue Shield" /></div>
            <div><label className={labelCls}>Member / Subscriber ID</label><input className={inputCls} value={formData.primaryInsuranceMemberId} onChange={e => set('primaryInsuranceMemberId', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Policy Number</label><input className={inputCls} value={formData.primaryPolicyNumber} onChange={e => set('primaryPolicyNumber', e.target.value)} /></div>
            <div><label className={labelCls}>Group Number</label><input className={inputCls} value={formData.primaryGroupNumber} onChange={e => set('primaryGroupNumber', e.target.value)} /></div>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wide mt-2 mb-1">Secondary Insurance (if applicable)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Insurance Company</label><input className={inputCls} value={formData.secondaryInsuranceCompany} onChange={e => set('secondaryInsuranceCompany', e.target.value)} /></div>
            <div><label className={labelCls}>Policy Number</label><input className={inputCls} value={formData.secondaryPolicyNumber} onChange={e => set('secondaryPolicyNumber', e.target.value)} /></div>
          </div>
        </div>

        {/* Clinical Info */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          <SectionHead Icon={Stethoscope} title="Clinical Information" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Referring Provider</label><input className={inputCls} value={formData.referringProvider} onChange={e => set('referringProvider', e.target.value)} placeholder="Dr. Anthony Nguyen" /></div>
            <div><label className={labelCls}>Referring Provider NPI</label><input className={inputCls} value={formData.referringProviderNpi} onChange={e => set('referringProviderNpi', e.target.value)} placeholder="10-digit NPI" /></div>
          </div>
          <div><label className={labelCls}>Primary Care Provider (PCP)</label><input className={inputCls} value={formData.primaryCareProvider} onChange={e => set('primaryCareProvider', e.target.value)} placeholder="Dr. Sarah Mitchell" /></div>
          <div><label className={labelCls}>Known Allergies</label><input className={inputCls} value={formData.knownAllergies} onChange={e => set('knownAllergies', e.target.value)} placeholder="e.g. Penicillin, Sulfa, NKDA" /></div>
          <div><label className={labelCls}>Current Medications</label><input className={inputCls} value={formData.currentMedications} onChange={e => set('currentMedications', e.target.value)} placeholder="e.g. Ibuprofen 400mg, Lisinopril 10mg" /></div>
          <div><label className={labelCls}>Past Medical History</label><textarea rows={2} className={`${inputCls} resize-none`} value={formData.pastMedicalHistory} onChange={e => set('pastMedicalHistory', e.target.value)} placeholder="e.g. Hypertension, Type 2 Diabetes, prior MVA 2018" /></div>
          <div><label className={labelCls}>Patient Notes / Additional Info</label><textarea rows={2} className={`${inputCls} resize-none`} value={formData.patientNotes} onChange={e => set('patientNotes', e.target.value)} /></div>
        </div>

        {/* Form Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate('/patients')} className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-xs font-bold rounded-lg">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-5 py-2 bg-secondary-container hover:bg-secondary text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5">
            <Save className="w-4 h-4" /> {isLoading ? 'Saving...' : 'Save & Register Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};
