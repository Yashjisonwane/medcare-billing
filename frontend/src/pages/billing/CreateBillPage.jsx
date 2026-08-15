// src/pages/billing/CreateBillPage.jsx
import React, { useState } from 'react';
import { mockBillingService } from '../../services/mock/mockBillingService';
import { INITIAL_PROVIDER_CONFIGS } from '../../constants/providerConfigs';
import { createDefaultServiceLine } from '../../constants/servicesCatalog';
import { MultiLineCptTable } from '../../components/common/MultiLineCptTable';
import { useUIStore } from '../../store/uiStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Receipt, User, FileText, DollarSign, Building } from 'lucide-react';

const inputCls = 'w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-800 mb-1';

const SectionHead = ({ Icon, title }) => (
  <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2 mb-4">
    <Icon className="w-4 h-4 text-teal-600" /> {title}
  </h2>
);

export const CreateBillPage = () => {
  const [providerId, setProviderId] = useState('prov-josmic');
  const [statementNumber, setStatementNumber] = useState(`STMT-${Math.floor(100000 + Math.random() * 900000)}`);
  const [serviceLines, setServiceLines] = useState([
    createDefaultServiceLine(1, '99204', 'Initial Consultation - Post-MVA Pain Management', 450.00),
    createDefaultServiceLine(2, '97110', 'Therapeutic Exercise (15 min)', 110.00)
  ]);

  const [form, setForm] = useState({
    statementDate: new Date().toISOString().split('T')[0],
    caseId: 'CASE-2025-1227',
    patientName: 'SAMPLE TESTING',
    patientId: 'PAT-141849159',
    patientDob: '1985-05-15',
    billToName: 'OJ Law Firm & Associates',
    billToAddress: '11711 Bedford St. Suite 01, Houston TX 77031',
    billToPhone: '713-555-0188',
    billToEmail: 'attorney@ojlawfirm.com',
    serviceDateFrom: '2025-12-30',
    serviceDateTo: '2026-01-26',
    diagnosisCodes: 'M54.6, M54.50, S13.4',
    insuranceCompany: 'Example Auto Insurance Co.',
    insuranceClaimNumber: 'CLM-2025-88192',
    insurancePolicyNumber: 'POL-9928374',
    liabilityStatus: 'LIABILITY_ACCEPTED',
    billingType: 'LIEN',
    referringProvider: 'Anthony Nguyen',
    referringNpi: '1234567890',
    renderingProviderNpi: '0987654321',
    facilityNpi: '1122334455',
    taxId: '75-1234567',
    placeOfService: '11',
    authorizationNumber: '',
    billNotes: 'Statement to be submitted to attorney lien. Await settlement before payment processing.',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const selectedProv = Object.values(INITIAL_PROVIDER_CONFIGS).find(p => p.id === providerId);
      const totalAmount = serviceLines.reduce((acc, line) => acc + ((parseFloat(line.units) || 1) * (parseFloat(line.charge) || 0)), 0);
      
      const newBill = await mockBillingService.addServiceLine('bill-josmic-001', {
        serviceLines,
        cptCode: serviceLines.map(l => l.cptCode).join(', '),
        description: serviceLines.map(l => l.description).join(' + '),
        charge: totalAmount || 500.00
      });
      addToast(`New bill generated for ${selectedProv?.name} with ${serviceLines.length} CPT line items!`, 'success');
      navigate(`/billing/bills/${newBill.id}`);
    } catch {
      addToast('Failed to create bill', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/billing/four-bills')} className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to 4-Bill Ledger
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Generate Independent Provider Bill</h1>
        <p className="text-xs text-slate-500">Initialize provider statement with multi-code CPT billing and modifier items</p>
      </div>

      <form onSubmit={handleCreate} className="space-y-5">

        {/* Provider & Statement */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <SectionHead Icon={Building} title="Provider & Statement Info" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Select Practice Provider *</label>
              <select 
                className={inputCls} 
                value={providerId} 
                onChange={e => {
                  const pid = e.target.value;
                  setProviderId(pid);
                }}
              >
                <option value="prov-josmic">JOSMIC Wellness Center (Pain Management)</option>
                <option value="prov-davs">DAV'S Anatomy (Shockwave ESWT)</option>
                <option value="prov-anik">ANIK Laser Therapy (Laser Therapy)</option>
                <option value="prov-counselor">Counselor Practice (Counseling - Pending Client Docs)</option>
              </select>
            </div>
            <div><label className={labelCls}>Statement Number *</label><input required className={`${inputCls} font-mono font-bold`} value={statementNumber} onChange={e => setStatementNumber(e.target.value)} /></div>
          </div>

          {providerId === 'prov-counselor' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold space-y-1">
              <p>⚠️ Awaiting Client Reference Documents</p>
              <p className="text-[11px] font-normal text-amber-700">
                Counselor billing actions (Finalise Bill, Print Billing Statement, Generate CMS-1500, Finalise Clinical Packet) are currently disabled pending reference document submission.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Statement Date</label><input type="date" className={inputCls} value={form.statementDate} onChange={e => set('statementDate', e.target.value)} /></div>
            <div><label className={labelCls}>Billing Type</label>
              <select className={inputCls} value={form.billingType} onChange={e => set('billingType', e.target.value)}>
                <option value="LIEN">Attorney Lien</option><option value="INSURANCE">Insurance Direct</option><option value="PATIENT">Patient Self-Pay</option><option value="WORKERS_COMP">Workers' Comp</option>
              </select>
            </div>
            <div><label className={labelCls}>Place of Service Code</label><input className={inputCls} value={form.placeOfService} onChange={e => set('placeOfService', e.target.value)} placeholder="e.g. 11 (Office)" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Federal Tax ID (EIN)</label><input className={inputCls} value={form.taxId} onChange={e => set('taxId', e.target.value)} placeholder="XX-XXXXXXX" /></div>
            <div><label className={labelCls}>Rendering Provider NPI</label><input className={inputCls} value={form.renderingProviderNpi} onChange={e => set('renderingProviderNpi', e.target.value)} /></div>
            <div><label className={labelCls}>Facility NPI</label><input className={inputCls} value={form.facilityNpi} onChange={e => set('facilityNpi', e.target.value)} /></div>
          </div>
        </div>

        {/* Patient Info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <SectionHead Icon={User} title="Patient & Case Reference" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Patient Name</label><input className={inputCls} value={form.patientName} onChange={e => set('patientName', e.target.value)} /></div>
            <div><label className={labelCls}>Patient System ID</label><input className={inputCls} value={form.patientId} onChange={e => set('patientId', e.target.value)} /></div>
            <div><label className={labelCls}>Date of Birth</label><input type="date" className={inputCls} value={form.patientDob} onChange={e => set('patientDob', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Linked Case ID</label><input className={inputCls} value={form.caseId} onChange={e => set('caseId', e.target.value)} /></div>
            <div><label className={labelCls}>Authorization / Pre-Auth Number</label><input className={inputCls} value={form.authorizationNumber} onChange={e => set('authorizationNumber', e.target.value)} placeholder="e.g. AUTH-8829201" /></div>
          </div>
        </div>

        {/* Bill To */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <SectionHead Icon={FileText} title="Bill To — Attorney / Responsible Party" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Bill To Name</label><input className={inputCls} value={form.billToName} onChange={e => set('billToName', e.target.value)} /></div>
            <div><label className={labelCls}>Bill To Address</label><input className={inputCls} value={form.billToAddress} onChange={e => set('billToAddress', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Attorney Phone</label><input type="tel" className={inputCls} value={form.billToPhone} onChange={e => set('billToPhone', e.target.value)} /></div>
            <div><label className={labelCls}>Attorney Email</label><input type="email" className={inputCls} value={form.billToEmail} onChange={e => set('billToEmail', e.target.value)} /></div>
          </div>
        </div>

        {/* Service Details & Multi-Line CPT */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <SectionHead Icon={Receipt} title="Service Dates & ICD-10 Diagnostics" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Service Date From</label><input type="date" className={inputCls} value={form.serviceDateFrom} onChange={e => set('serviceDateFrom', e.target.value)} /></div>
            <div><label className={labelCls}>Service Date To</label><input type="date" className={inputCls} value={form.serviceDateTo} onChange={e => set('serviceDateTo', e.target.value)} /></div>
            <div><label className={labelCls}>ICD-10 Diagnosis Codes</label><input className={inputCls} value={form.diagnosisCodes} onChange={e => set('diagnosisCodes', e.target.value)} placeholder="M54.6, M54.50" /></div>
          </div>

          <div className="pt-2">
            <MultiLineCptTable
              lines={serviceLines}
              onChange={setServiceLines}
              title="Provider Bill Service Items (CPT Codes, Modifiers & Charges)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div><label className={labelCls}>Referring Provider</label><input className={inputCls} value={form.referringProvider} onChange={e => set('referringProvider', e.target.value)} /></div>
            <div><label className={labelCls}>Referring Provider NPI</label><input className={inputCls} value={form.referringNpi} onChange={e => set('referringNpi', e.target.value)} /></div>
          </div>
        </div>


        {/* Insurance */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          <SectionHead Icon={DollarSign} title="Insurance & Liability" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Insurance Company</label><input className={inputCls} value={form.insuranceCompany} onChange={e => set('insuranceCompany', e.target.value)} /></div>
            <div><label className={labelCls}>Claim Number</label><input className={inputCls} value={form.insuranceClaimNumber} onChange={e => set('insuranceClaimNumber', e.target.value)} /></div>
            <div><label className={labelCls}>Policy Number</label><input className={inputCls} value={form.insurancePolicyNumber} onChange={e => set('insurancePolicyNumber', e.target.value)} /></div>
          </div>
          <div><label className={labelCls}>Liability Status</label>
            <select className={inputCls} value={form.liabilityStatus} onChange={e => set('liabilityStatus', e.target.value)}>
              <option value="LIABILITY_ACCEPTED">Liability Accepted</option>
              <option value="LIABILITY_DISPUTED">Liability Disputed</option>
              <option value="PENDING_INVESTIGATION">Pending Investigation</option>
              <option value="UNINSURED_MOTORIST">Uninsured Motorist</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          <SectionHead Icon={FileText} title="Billing Notes" />
          <div><label className={labelCls}>Internal Notes / Billing Instructions</label>
            <textarea rows={3} className={`${inputCls} resize-none`} value={form.billNotes} onChange={e => set('billNotes', e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={() => navigate('/billing/four-bills')} className="px-4 py-2 bg-surface-container text-xs font-bold rounded-lg">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-5 py-2 bg-secondary-container text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5">
            <Receipt className="w-4 h-4" /> {isLoading ? 'Creating...' : 'Initialize Provider Bill'}
          </button>
        </div>
      </form>
    </div>
  );
};
