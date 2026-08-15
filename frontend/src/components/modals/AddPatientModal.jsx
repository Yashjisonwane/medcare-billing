// src/components/modals/AddPatientModal.jsx
import React, { useState } from 'react';
import { Modal } from './Modal';
import { mockPatientService } from '../../services/mock/mockPatientService';
import { useUIStore } from '../../store/uiStore';
import { User, Phone, Shield, FileText, Stethoscope, Save, UserPlus } from 'lucide-react';

const inputCls = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

export const AddPatientModal = ({ isOpen, onClose, onPatientAdded }) => {
  const { addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState('DEMO'); // DEMO | CONTACT | PROVIDERS
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dob: '1988-06-20',
    sex: 'M',
    maritalStatus: 'SINGLE',
    ssn: '***-**-1234',
    driversLicense: 'TX-8921820',
    driversLicenseState: 'TX',
    language: 'English',
    ethnicity: 'Non-Hispanic',
    phone: '713-555-0199',
    altPhone: '',
    email: 'patient@example.test',
    address: { street: '10101 Harwin Dr. Suite 200', suite: '', city: 'Houston', state: 'TX', zipCode: '77036' },
    communicationPref: 'SMS',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '713-555-0102',
    emergencyContactRelation: 'Spouse',
    primaryInsuranceCompany: 'Geico Auto Insurance',
    primaryPolicyNumber: 'POL-TX-9921',
    primaryGroupNumber: 'GRP-1002',
    primaryInsuranceMemberId: 'MBR-88219',
    assignedProviderIds: ['prov-josmic', 'prov-davs', 'prov-anik', 'prov-counselor'],
    patientNotes: 'New MVA injury intake. Referred by attorney lien.'
  });

  const set = (field, val) => setFormData(p => ({ ...p, [field]: val }));
  const setAddr = (field, val) => setFormData(p => ({ ...p, address: { ...p.address, [field]: val } }));

  const handleToggleProvider = (pid) => {
    setFormData(prev => {
      const exists = prev.assignedProviderIds.includes(pid);
      return {
        ...prev,
        assignedProviderIds: exists
          ? prev.assignedProviderIds.filter(id => id !== pid)
          : [...prev.assignedProviderIds, pid]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      addToast('Please enter both first and last name.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const created = await mockPatientService.createPatient(formData);
      addToast(`Patient ${created.firstName} ${created.lastName} registered successfully!`, 'success');
      if (onPatientAdded) onPatientAdded(created);
      onClose();
    } catch {
      addToast('Failed to register patient', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Patient Intake"
      subtitle="Register patient demographics, contact info & 4-provider practice assignments"
      icon={UserPlus}
      size="xl"
      iconColor="text-teal-600"
      iconBg="bg-teal-50"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> {isLoading ? 'Saving...' : 'Register Patient'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Sub-tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-slate-100 p-1 rounded-xl border border-slate-200 touch-scroll">
          <button
            type="button"
            onClick={() => setActiveTab('DEMO')}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg whitespace-nowrap transition cursor-pointer ${
              activeTab === 'DEMO' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Demographics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CONTACT')}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg whitespace-nowrap transition cursor-pointer ${
              activeTab === 'CONTACT' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Contact &amp; Insurance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PROVIDERS')}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg whitespace-nowrap transition cursor-pointer ${
              activeTab === 'PROVIDERS' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Practice Providers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('MEDICAL')}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg whitespace-nowrap transition cursor-pointer ${
              activeTab === 'MEDICAL' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Medical &amp; Allergies
          </button>
        </div>

        {/* Tab 1: Demographics */}
        {activeTab === 'DEMO' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>First Name *</label>
                <input required className={inputCls} value={formData.firstName} onChange={e => set('firstName', e.target.value)} placeholder="e.g. John" />
              </div>
              <div>
                <label className={labelCls}>Middle Name</label>
                <input className={inputCls} value={formData.middleName} onChange={e => set('middleName', e.target.value)} placeholder="e.g. M." />
              </div>
              <div>
                <label className={labelCls}>Last Name *</label>
                <input required className={inputCls} value={formData.lastName} onChange={e => set('lastName', e.target.value)} placeholder="e.g. Smith" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Date of Birth *</label>
                <input type="date" required className={inputCls} value={formData.dob} onChange={e => set('dob', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Gender / Sex</label>
                <select className={inputCls} value={formData.sex} onChange={e => set('sex', e.target.value)}>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="OTHER">Other / Non-Binary</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Marital Status</label>
                <select className={inputCls} value={formData.maritalStatus} onChange={e => set('maritalStatus', e.target.value)}>
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="DIVORCED">Divorced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Driver's License #</label>
                <input className={inputCls} value={formData.driversLicense} onChange={e => set('driversLicense', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Primary Language</label>
                <input className={inputCls} value={formData.language} onChange={e => set('language', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Contact & Insurance */}
        {activeTab === 'CONTACT' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Mobile Phone *</label>
                <input type="tel" required className={inputCls} value={formData.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <input type="email" className={inputCls} value={formData.email} onChange={e => set('email', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className={labelCls}>Street Address</label>
                <input className={inputCls} value={formData.address.street} onChange={e => setAddr('street', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>City / State / Zip</label>
                <input className={inputCls} value={`${formData.address.city}, ${formData.address.state} ${formData.address.zipCode}`} onChange={e => setAddr('city', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-200 pt-2">
              <div>
                <label className={labelCls}>Auto Insurance Carrier</label>
                <input className={inputCls} value={formData.primaryInsuranceCompany} onChange={e => set('primaryInsuranceCompany', e.target.value)} placeholder="e.g. State Farm, Geico" />
              </div>
              <div>
                <label className={labelCls}>Policy / Claim #</label>
                <input className={inputCls} value={formData.primaryPolicyNumber} onChange={e => set('primaryPolicyNumber', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Providers */}
        {activeTab === 'PROVIDERS' && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Assign Practice Providers to Patient Chart:
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'prov-josmic', name: 'JOSMIC Wellness Center', desc: 'Pain Management Consultation', badge: 'Physician' },
                { id: 'prov-davs', name: "DAV'S Anatomy", desc: 'ESWT Shockwave Therapy', badge: 'Therapy' },
                { id: 'prov-anik', name: 'ANIK Laser Therapy', desc: 'High-Intensity Laser Therapy', badge: 'Laser' },
                { id: 'prov-counselor', name: 'Counselor Practice (Hope Behavioral)', desc: 'Mental Health Psychotherapy & PTSD', badge: 'Counseling' },
              ].map(prov => {
                const isSelected = formData.assignedProviderIds.includes(prov.id);
                return (
                  <div
                    key={prov.id}
                    onClick={() => handleToggleProvider(prov.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-teal-50/60 border-teal-500 ring-1 ring-teal-500/30 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs text-slate-900">{prov.name}</strong>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-200 text-slate-800">
                          {prov.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{prov.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded text-teal-600 mt-1"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Medical History & Allergies */}
        {activeTab === 'MEDICAL' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Known Allergies</label>
                <input className={inputCls} placeholder="e.g. Penicillin, Sulfa, NKDA" value={formData.knownAllergies || ''} onChange={e => set('knownAllergies', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Current Medications</label>
                <input className={inputCls} placeholder="e.g. Muscle relaxants, NSAIDs" value={formData.currentMedications || ''} onChange={e => set('currentMedications', e.target.value)} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Past Medical &amp; Surgical History</label>
              <textarea
                rows={2}
                className={inputCls}
                placeholder="Non-contributory prior to accident..."
                value={formData.pastMedicalHistory || ''}
                onChange={e => set('pastMedicalHistory', e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>Initial Clinical Intake &amp; Referral Notes</label>
              <textarea
                rows={2}
                className={inputCls}
                value={formData.patientNotes}
                onChange={e => set('patientNotes', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
