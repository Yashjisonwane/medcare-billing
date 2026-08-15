// src/pages/cases/AddCasePage.jsx
import React, { useState } from 'react';
import { mockCaseService } from '../../services/mock/mockCaseService';
import { DynamicDiagnosisPicker } from '../../components/common/DynamicDiagnosisPicker';
import { useUIStore } from '../../store/uiStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, Shield, User, MapPin, Stethoscope, Tag } from 'lucide-react';

const inputCls = 'w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';
const sectionHead = (Icon, title) => (
  <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2 mb-4">
    <Icon className="w-4 h-4 text-teal-600" /> {title}
  </h2>
);

export const AddCasePage = () => {
  const [formData, setFormData] = useState({
    patientId: 'pat-001',
    patientName: 'Demo Patient 001',
    patientDob: '1985-05-15',
    patientPhone: '713-555-0100',
    accidentDate: '2025-12-27',
    initialDate: '2025-12-30',
    dischargeDate: '2026-01-26',
    accidentType: 'AUTO_ACCIDENT',
    accidentState: 'TX',
    accidentCity: 'Houston',
    accidentLocation: 'Interstate 10 Westbound, near Exit 747',
    mechanismOfInjury: 'Motor Vehicle Accident (Rear-end collision)',
    vehicleType: 'Sedan',
    impactType: 'REAR_END',
    seatPosition: 'DRIVER',
    seatbeltUsed: true,
    airbagsDeployed: true,
    emergencyTransport: true,
    transportDestination: 'Memorial Hermann Hospital',
    policeReportFiled: true,
    policeReportNumber: 'PR-2025-88412',
    policeAgency: 'Houston Police Department',
    chiefComplaint: 'Severe neck stiffness, lumbar radiating pain, bilateral knee contusions',
    injuryBodyParts: 'Cervical spine, Lumbar spine, Bilateral knees',
    diagnosisCodes: ['M54.6', 'M54.50', 'S13.4XXA', 'S39.012A'],
    caseNotes: 'Patient struck from rear at high speed while stopped at traffic light. Immediate onset neck and lower back pain with radiation.',
    attorneyName: 'Sarah Jenkins, Esq.',
    lawFirm: 'OJ Law Firm & Associates',
    attorneyPhone: '713-555-0188',
    attorneyEmail: 'sjenkins@ojlawfirm.com',
    lawFirmAddress: '11711 Bedford St. Suite 01, Houston TX 77031',
    litigationStatus: 'PRE_LITIGATION',
    insuranceCompany: 'Progressive County Mutual',
    policyNumber: 'POL-TX-9928374',
    claimNumber: 'CLM-2025-88192',
    adjusterName: 'Marcus Vance',
    adjusterPhone: '800-555-0199',
    adjusterEmail: 'mvance@progressive-demo.com',
    coverageType: 'THIRD_PARTY_LIABILITY',
    pipAvailable: true,
    pipLimit: '2500.00',
    umAvailable: true,
    umLimit: '50000.00',
    propertyDamageOnly: false,
    caseStatus: 'ACTIVE',
    providerAssignments: ['prov-josmic', 'prov-davs', 'prov-anik'],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const set = (field, val) => setFormData(p => ({ ...p, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const created = await mockCaseService.createCase(formData);
      addToast(`Case ${created.caseNumber} created successfully!`, 'success');
      navigate(`/cases/${created.id}`);
    } catch {
      addToast('Failed to create case', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/cases')} className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Cases
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create New Accident / Injury Case</h1>
        <p className="text-xs text-slate-500">Document MVA accident details, dynamic ICD-10 diagnosis codes, attorney lien &amp; insurance</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Patient Reference */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          {sectionHead(User, 'Patient Reference')}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Patient Name *</label><input required className={inputCls} value={formData.patientName} onChange={e => set('patientName', e.target.value)} /></div>
            <div><label className={labelCls}>Date of Birth</label><input type="date" className={inputCls} value={formData.patientDob} onChange={e => set('patientDob', e.target.value)} /></div>
            <div><label className={labelCls}>Patient Phone</label><input type="tel" className={inputCls} value={formData.patientPhone} onChange={e => set('patientPhone', e.target.value)} /></div>
          </div>
        </div>

        {/* Accident Details */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          {sectionHead(MapPin, 'Accident & Incident Information')}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Date of Accident *</label><input type="date" required className={inputCls} value={formData.accidentDate} onChange={e => set('accidentDate', e.target.value)} /></div>
            <div><label className={labelCls}>Initial Treatment Date</label><input type="date" className={inputCls} value={formData.initialDate} onChange={e => set('initialDate', e.target.value)} /></div>
            <div><label className={labelCls}>Accident Type</label>
              <select className={inputCls} value={formData.accidentType} onChange={e => set('accidentType', e.target.value)}>
                <option value="AUTO_ACCIDENT">Auto / Motor Vehicle Accident (MVA)</option>
                <option value="SLIP_AND_FALL">Slip &amp; Fall / Premises Liability</option>
                <option value="WORKPLACE">Workplace Injury / Workers' Comp</option>
                <option value="PEDESTRIAN">Pedestrian Accident</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Accident Location</label><input className={inputCls} value={formData.accidentLocation} onChange={e => set('accidentLocation', e.target.value)} /></div>
            <div><label className={labelCls}>City</label><input className={inputCls} value={formData.accidentCity} onChange={e => set('accidentCity', e.target.value)} /></div>
            <div><label className={labelCls}>State</label><input className={inputCls} value={formData.accidentState} onChange={e => set('accidentState', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Mechanism of Injury</label><input className={inputCls} value={formData.mechanismOfInjury} onChange={e => set('mechanismOfInjury', e.target.value)} /></div>
            <div><label className={labelCls}>Vehicle Type</label><input className={inputCls} value={formData.vehicleType} onChange={e => set('vehicleType', e.target.value)} /></div>
            <div><label className={labelCls}>Impact Type</label>
              <select className={inputCls} value={formData.impactType} onChange={e => set('impactType', e.target.value)}>
                <option value="REAR_END">Rear-End Collision</option><option value="HEAD_ON">Head-On Collision</option><option value="T_BONE">T-Bone / Side Impact</option><option value="ROLLOVER">Rollover</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700 pt-1">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.seatbeltUsed} onChange={e => set('seatbeltUsed', e.target.checked)} className="rounded text-teal-600" /> Seatbelt Worn</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.airbagsDeployed} onChange={e => set('airbagsDeployed', e.target.checked)} className="rounded text-teal-600" /> Airbags Deployed</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.emergencyTransport} onChange={e => set('emergencyTransport', e.target.checked)} className="rounded text-teal-600" /> EMS / Ambulance Transport</label>
          </div>
        </div>

        {/* Police Report */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          {sectionHead(FileText, 'Police & Crash Report')}
          <div className="flex items-center gap-4 mb-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input type="checkbox" checked={formData.policeReportFiled} onChange={e => set('policeReportFiled', e.target.checked)} className="rounded text-teal-600" />
              Police Report Filed
            </label>
          </div>
          {formData.policeReportFiled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Report Number</label><input className={inputCls} value={formData.policeReportNumber} onChange={e => set('policeReportNumber', e.target.value)} /></div>
              <div><label className={labelCls}>Police Agency / Precinct</label><input className={inputCls} value={formData.policeAgency} onChange={e => set('policeAgency', e.target.value)} /></div>
            </div>
          )}
        </div>

        {/* Clinical & Dynamic Diagnosis Details */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          {sectionHead(Stethoscope, 'Clinical & Dynamic ICD-10 Diagnosis Details')}
          <div><label className={labelCls}>Chief Complaint</label><input className={inputCls} value={formData.chiefComplaint} onChange={e => set('chiefComplaint', e.target.value)} placeholder="e.g. Neck pain, lower back pain..." /></div>
          <div><label className={labelCls}>Injury Body Parts</label><input className={inputCls} value={formData.injuryBodyParts} onChange={e => set('injuryBodyParts', e.target.value)} placeholder="e.g. Cervical spine, lumbar spine" /></div>
          
          {/* Dynamic Diagnosis Picker */}
          <div className="pt-2">
            <DynamicDiagnosisPicker
              selectedCodes={formData.diagnosisCodes}
              onChange={(codes) => set('diagnosisCodes', codes)}
              label="ICD-10 Diagnosis Codes (CMS Box 21 Alignment)"
            />
          </div>

          <div><label className={labelCls}>Case Notes / Initial Summary</label>
            <textarea rows={3} className={`${inputCls} resize-none`} value={formData.caseNotes} onChange={e => set('caseNotes', e.target.value)} />
          </div>
        </div>


        {/* Legal & Attorney Info */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          {sectionHead(User, 'Attorney & Law Firm Information')}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Attorney Name</label><input className={inputCls} value={formData.attorneyName} onChange={e => set('attorneyName', e.target.value)} /></div>
            <div><label className={labelCls}>Law Firm</label><input className={inputCls} value={formData.lawFirm} onChange={e => set('lawFirm', e.target.value)} /></div>
            <div><label className={labelCls}>Attorney Phone</label><input type="tel" className={inputCls} value={formData.attorneyPhone} onChange={e => set('attorneyPhone', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Attorney Email</label><input type="email" className={inputCls} value={formData.attorneyEmail} onChange={e => set('attorneyEmail', e.target.value)} /></div>
            <div><label className={labelCls}>Law Firm Address</label><input className={inputCls} value={formData.lawFirmAddress} onChange={e => set('lawFirmAddress', e.target.value)} /></div>
          </div>
          <div><label className={labelCls}>Litigation Status</label>
            <select className={inputCls} value={formData.litigationStatus} onChange={e => set('litigationStatus', e.target.value)}>
              <option value="PRE_LITIGATION">Pre-Litigation</option>
              <option value="IN_LITIGATION">In Litigation</option>
              <option value="SETTLED">Settled</option>
              <option value="ARBITRATION">Arbitration</option>
            </select>
          </div>
        </div>

        {/* Insurance Info */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          {sectionHead(Shield, 'Auto Insurance & Liability')}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Insurance Company</label><input className={inputCls} value={formData.insuranceCompany} onChange={e => set('insuranceCompany', e.target.value)} /></div>
            <div><label className={labelCls}>Policy Number</label><input className={inputCls} value={formData.insurancePolicyNumber} onChange={e => set('insurancePolicyNumber', e.target.value)} /></div>
            <div><label className={labelCls}>Claim Number</label><input className={inputCls} value={formData.insuranceClaimNumber} onChange={e => set('insuranceClaimNumber', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Insurance Adjuster</label><input className={inputCls} value={formData.insuranceAdjuster} onChange={e => set('insuranceAdjuster', e.target.value)} /></div>
            <div><label className={labelCls}>Adjuster Phone</label><input type="tel" className={inputCls} value={formData.insuranceAdjusterPhone} onChange={e => set('insuranceAdjusterPhone', e.target.value)} /></div>
            <div><label className={labelCls}>Liability Status</label>
              <select className={inputCls} value={formData.liabilityStatus} onChange={e => set('liabilityStatus', e.target.value)}>
                <option value="LIABILITY_ACCEPTED">Liability Accepted</option>
                <option value="LIABILITY_DISPUTED">Liability Disputed</option>
                <option value="PENDING_INVESTIGATION">Pending Investigation</option>
                <option value="UNINSURED_MOTORIST">Uninsured Motorist</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Controls */}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate('/cases')} className="px-4 py-2 bg-surface-container text-xs font-bold rounded-lg">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-5 py-2 bg-secondary-container text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5">
            <Save className="w-4 h-4" /> {isLoading ? 'Saving...' : 'Save & Open Case'}
          </button>
        </div>
      </form>
    </div>
  );
};
