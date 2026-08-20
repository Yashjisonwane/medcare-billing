import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Clock, User, CheckCircle, AlertCircle, Search, Filter, X, Save, Stethoscope } from 'lucide-react';
import { apiAppointmentService } from '../../services/api/apiAppointmentService';
import { apiCaseService } from '../../services/api/apiCaseService';
import { apiProviderService } from '../../services/api/apiProviderService';
import { apiClinicalNoteService } from '../../services/api/apiClinicalNoteService';
import { useUIStore } from '../../store/uiStore';

const STATUS_COLORS = {
  Completed: 'bg-emerald-100 text-emerald-700',
  Scheduled: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-red-100 text-red-700',
  'No Show': 'bg-amber-100 text-amber-700',
};

import { formatCurrency } from '../../utils/billingCalculations';
import { useSettings } from '../../utils/settingsCache';

const PROVIDER_COLORS = {
  ANIK: 'bg-violet-100 text-violet-700',
  DAVS: 'bg-blue-100 text-blue-700',
  JOSMIC: 'bg-teal-100 text-teal-700',
};

const inputCls = 'w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition';
const labelCls = 'block text-xs font-bold text-slate-900 mb-1';

// --- Schedule Session Modal ---------------------------------------------------
const ScheduleSessionModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    patientName: '',
    patientId: '',
    caseId: '',
    provider: '',
    therapist: '',
    sessionType: 'High-Intensity Laser Therapy (HILT)',
    cptCode: '97039',
    dos: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    endTime: '09:45 AM',
    duration: '45',
    room: 'Treatment Room 1',
    location: '10101 Harwin Dr. Suite 274, Houston TX 77036',
    diagnosisCodes: '',
    units: 1,
    charge: '6140.00',
    status: 'Scheduled',
    billedToCase: true,
    sessionNotes: '',
    authNumber: '',
    reminderSent: true,
    reminderMethod: 'SMS',
  });
  
  const [saving, setSaving] = useState(false);
  const [cases, setCases] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesData, provData] = await Promise.all([
          apiCaseService.getCases(),
          apiProviderService.getProviders()
        ]);
        setCases(Array.isArray(casesData) ? casesData : (casesData.cases || []));
        setProviders(provData.providers ? provData.providers : (Array.isArray(provData) ? provData : Object.values(provData)));
      } catch (err) {
        console.error('Failed to load form data', err);
      }
    };
    fetchData();
  }, []);

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleCaseChange = (e) => {
    const selectedCaseId = e.target.value;
    const selectedCase = cases.find(c => c.id === selectedCaseId);
    if (selectedCase) {
      setForm(p => ({
        ...p,
        caseId: selectedCase.caseId || selectedCase.id,
        patientId: selectedCase.patient?.patientId || selectedCase.patientId,
        patientName: selectedCase.patient ? `${selectedCase.patient.firstName} ${selectedCase.patient.lastName}`.trim() : 'Unknown Patient'
      }));
    } else {
      setForm(p => ({ ...p, caseId: '', patientId: '', patientName: '' }));
    }
  };

  const handleProviderChange = (e) => {
    const provId = e.target.value;
    const foundProv = providers.find(p => p.id === provId || p.name === provId);
    
    let renderingName = foundProv?.renderingProvider?.name || foundProv?.name || '';
    let defaultSessionType = form.sessionType;
    let defaultCpt = form.cptCode;
    let defaultCharge = form.charge;

    const lowerId = provId.toLowerCase();
    if (lowerId.includes('josmic')) {
      renderingName = renderingName || 'Dr. Segun Adeoye';
      defaultSessionType = 'Pain Management Consultation';
      defaultCpt = '99204';
      defaultCharge = '1214.00';
    } else if (lowerId.includes('davs') || lowerId.includes('dav')) {
      renderingName = renderingName || 'Alex Rivera, DC';
      defaultSessionType = 'Shockwave Therapy (ESWT)';
      defaultCpt = '0101T';
      defaultCharge = '3390.00';
    } else if (lowerId.includes('anik')) {
      renderingName = renderingName || 'Alex Rivera, PT';
      defaultSessionType = 'High-Intensity Laser Therapy (HILT)';
      defaultCpt = '97039';
      defaultCharge = '6140.00';
    } else if (lowerId.includes('counselor') || lowerId.includes('behavioral')) {
      renderingName = renderingName || 'Jordan Miller, LCSW';
      defaultSessionType = 'Psychiatric Diagnostic Evaluation';
      defaultCpt = '90791';
      defaultCharge = '350.00';
    }

    setForm(p => ({
      ...p,
      provider: provId,
      therapist: renderingName,
      sessionType: defaultSessionType,
      cptCode: defaultCpt,
      charge: defaultCharge
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.caseId || !form.provider) {
      alert("Please select a Case/Patient and a Provider.");
      return;
    }
    
    setSaving(true);
    try {
      // Find actual IDs from DB
      const selCase = cases.find(c => c.caseId === form.caseId || c.id === form.caseId);
      const payload = {
        patientId: selCase ? selCase.patientId : form.patientId,
        caseId: selCase ? selCase.id : form.caseId,
        providerId: form.provider,
        appointmentType: form.sessionType,
        cptCode: form.cptCode,
        date: form.dos,
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location,
        status: form.status,
        reasonForVisit: form.sessionNotes
      };
      await apiAppointmentService.createAppointment(payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save appointment', err);
      alert('Failed to save appointment. Check console.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-6 border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Schedule Treatment Session</h2>
              <p className="text-[10px] text-slate-400">Book a new therapy session for a patient</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg transition">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Patient & Case */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Patient & Case</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><label className={labelCls}>Select Case / Patient *</label>
                <select required className={inputCls} onChange={handleCaseChange} defaultValue="">
                  <option value="" disabled>Select a Case</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.patient ? `${c.patient.firstName} ${c.patient.lastName}` : c.patientId} - {c.caseType || c.id}
                    </option>
                  ))}
                </select>
              </div>
              <div><label className={labelCls}>Patient ID</label><input readOnly className={`${inputCls} bg-slate-100 cursor-not-allowed text-slate-500`} value={form.patientId} /></div>
              <div><label className={labelCls}>Case Reference</label><input readOnly className={`${inputCls} bg-slate-100 cursor-not-allowed text-slate-500`} value={form.caseId} /></div>
            </div>
          </div>

          {/* Provider & Session */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Provider & Session Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className={labelCls}>Practice Provider *</label>
                <select className={inputCls} value={form.provider} onChange={handleProviderChange}>
                  <option value="" disabled>Select Provider</option>
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>{p.name || p.id}</option>
                  ))}
                </select>
              </div>
              <div><label className={labelCls}>Attending Therapist / Provider</label><input className={inputCls} value={form.therapist} onChange={e => set('therapist', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div><label className={labelCls}>Session / Treatment Type *</label><input required className={inputCls} value={form.sessionType} onChange={e => set('sessionType', e.target.value)} /></div>
              <div><label className={labelCls}>CPT Code</label><input className={inputCls} value={form.cptCode} onChange={e => set('cptCode', e.target.value)} /></div>
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Date, Time & Location</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div><label className={labelCls}>Date of Service *</label><input type="date" required className={inputCls} value={form.dos} onChange={e => set('dos', e.target.value)} /></div>
              <div><label className={labelCls}>Start Time</label><input className={inputCls} value={form.startTime} onChange={e => set('startTime', e.target.value)} /></div>
              <div><label className={labelCls}>End Time</label><input className={inputCls} value={form.endTime} onChange={e => set('endTime', e.target.value)} /></div>
              <div><label className={labelCls}>Duration</label>
                <select className={inputCls} value={form.duration} onChange={e => set('duration', e.target.value)}>
                  <option value="15">15 min</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">60 min</option><option value="90">90 min</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div><label className={labelCls}>Treatment Room</label><input className={inputCls} value={form.room} onChange={e => set('room', e.target.value)} /></div>
              <div><label className={labelCls}>Clinic Address</label><input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} /></div>
            </div>
          </div>

          {/* Billing */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Billing & Authorization</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><label className={labelCls}>ICD-10 Codes</label><input className={inputCls} value={form.diagnosisCodes} onChange={e => set('diagnosisCodes', e.target.value)} /></div>
              <div><label className={labelCls}>Units</label><input type="number" min="1" className={inputCls} value={form.units} onChange={e => set('units', e.target.value)} /></div>
              <div><label className={labelCls}>Charge Amount ($)</label><input type="number" step="0.01" className={inputCls} value={form.charge} onChange={e => set('charge', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div><label className={labelCls}>Auth / Pre-Auth Number</label><input className={inputCls} value={form.authNumber} onChange={e => set('authNumber', e.target.value)} placeholder="e.g. AUTH-8829201" /></div>
              <div><label className={labelCls}>Session Status</label>
                <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="Scheduled">Scheduled</option><option value="Confirmed">Confirmed</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option><option value="No Show">No Show</option>
                </select>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input type="checkbox" checked={form.billedToCase} onChange={e => set('billedToCase', e.target.checked)} className="rounded text-teal-600" />
                Bill charges to linked accident case (lien)
              </label>
            </div>
          </div>

          {/* Reminder */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Reminder</p>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input type="checkbox" checked={form.reminderSent} onChange={e => set('reminderSent', e.target.checked)} className="rounded text-teal-600" />
                Send automated reminder
              </label>
              {form.reminderSent && (
                <div className="flex items-center gap-3">
                  {['SMS', 'EMAIL'].map(opt => (
                    <label key={opt} className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-600">
                      <input type="radio" name="remMethod" checked={form.reminderMethod === opt} onChange={() => set('reminderMethod', opt)} className="text-teal-600" />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Session Notes / Instructions</label>
            <textarea rows={2} className={`${inputCls} resize-none`} value={form.sessionNotes} onChange={e => set('sessionNotes', e.target.value)} />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5">
              <Save className="w-4 h-4" /> {saving ? 'Scheduling...' : 'Schedule Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Complete Clinical Note Modal --------------------------------------------
const CompleteClinicalNoteModal = ({ session, onClose, onSuccess }) => {
  const { addToast } = useUIStore();
  const [saving, setSaving] = useState(false);
  const isAlreadySigned = session.hasClinicalNote || !!session.existingNote;

  const [formData, setFormData] = useState({
    subjective: session.existingNote?.soapSubjective || session.existingNote?.content?.subjective || `Patient presents for ${session.type} following motor vehicle accident. Reports positive response to ongoing care.`,
    objective: session.existingNote?.soapObjective || session.existingNote?.content?.objective || `Vital signs stable. Physical exam & ${session.type} procedure completed according to clinical protocols.`,
    assessment: session.existingNote?.soapAssessment || session.existingNote?.content?.assessment || `Patient progressing as expected under conservative care plan. CPT ${session.cpt} charges verified.`,
    plan: session.existingNote?.soapPlan || session.existingNote?.content?.plan || `Continue scheduled treatment plan. Note signed and attached to Provider Bills Ledger.`,
    author: session.existingNote?.author || session.therapist || 'Attending Physician'
  });

  const handleSave = async (e) => {
    e.preventDefault();
    if (isAlreadySigned) return;

    if (!formData.subjective || !formData.objective) {
      addToast('Please enter clinical subjective & objective examination findings', 'error');
      return;
    }

    setSaving(true);
    try {
      await apiClinicalNoteService.createNote({
        patientId: session.patientId || 'pat-001',
        patientName: session.patient,
        caseId: session.caseId || 'case-001',
        providerId: session.providerShort || 'prov-josmic',
        providerName: session.provider,
        type: 'CLINICAL_PROGRESS_NOTE',
        noteType: 'SOAP_NOTE',
        title: `Clinical SOAP Note (${session.type}) [Appt: ${session.id}] — ${session.dos}`,
        date: session.dos,
        status: 'SIGNED_LOCKED',
        author: formData.author,
        soapSubjective: formData.subjective,
        soapObjective: formData.objective,
        soapAssessment: formData.assessment,
        soapPlan: formData.plan,
        content: { ...formData, appointmentId: session.id, cptCode: session.cpt, isSigned: true }
      });

      // Update appointment status in backend DB to COMPLETED
      await apiAppointmentService.updateAppointment(session.id, {
        status: 'COMPLETED'
      }).catch(err => console.log('Appointment status update:', err));

      addToast('Clinical Form signed & locked! Session updated to Ready for Billing.', 'success');
      await onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to complete note', err);
      addToast('Failed to save clinical note', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600" /> {isAlreadySigned ? 'View Signed Clinical Form (Locked 🔒)' : 'Complete & Sign Clinical Note'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Session: <span className="font-semibold text-slate-700">{session.id}</span> — {session.patient} ({session.provider})
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
            <div><span className="font-bold text-slate-500">Service Date:</span> {session.dos}</div>
            <div><span className="font-bold text-slate-500">Procedure CPT:</span> <span className="font-mono font-bold text-teal-700">{session.cpt}</span></div>
            <div><span className="font-bold text-slate-500">Attending Doctor:</span> <span className="font-bold text-slate-800">{formData.author}</span></div>
            <div><span className="font-bold text-slate-500">Charge Amount:</span> <span className="font-mono font-bold text-slate-900">{formatCurrency(session.charge)}</span></div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subjective (Patient Symptoms &amp; Complaints)</label>
              <textarea
                rows={2}
                disabled={isAlreadySigned}
                placeholder="Enter patient complaints & history of present illness..."
                className={`w-full px-3 py-1.5 border rounded-xl text-slate-900 border-slate-200 outline-none transition ${isAlreadySigned ? 'bg-slate-100 cursor-not-allowed text-slate-700' : 'bg-slate-50 focus:bg-white focus:border-teal-500'}`}
                value={formData.subjective}
                onChange={e => setFormData(p => ({ ...p, subjective: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Objective (Examination &amp; Procedure Findings)</label>
              <textarea
                rows={2}
                disabled={isAlreadySigned}
                placeholder="Enter physical exam findings & therapy protocols applied..."
                className={`w-full px-3 py-1.5 border rounded-xl text-slate-900 border-slate-200 outline-none transition ${isAlreadySigned ? 'bg-slate-100 cursor-not-allowed text-slate-700' : 'bg-slate-50 focus:bg-white focus:border-teal-500'}`}
                value={formData.objective}
                onChange={e => setFormData(p => ({ ...p, objective: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Assessment &amp; Diagnosis Summary</label>
              <textarea
                rows={2}
                disabled={isAlreadySigned}
                placeholder="Enter diagnostic assessment & functional progress..."
                className={`w-full px-3 py-1.5 border rounded-xl text-slate-900 border-slate-200 outline-none transition ${isAlreadySigned ? 'bg-slate-100 cursor-not-allowed text-slate-700' : 'bg-slate-50 focus:bg-white focus:border-teal-500'}`}
                value={formData.assessment}
                onChange={e => setFormData(p => ({ ...p, assessment: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Plan &amp; Treatment Continuity</label>
              <textarea
                rows={2}
                disabled={isAlreadySigned}
                placeholder="Enter treatment plan & next visit recommendations..."
                className={`w-full px-3 py-1.5 border rounded-xl text-slate-900 border-slate-200 outline-none transition ${isAlreadySigned ? 'bg-slate-100 cursor-not-allowed text-slate-700' : 'bg-slate-50 focus:bg-white focus:border-teal-500'}`}
                value={formData.plan}
                onChange={e => setFormData(p => ({ ...p, plan: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {isAlreadySigned ? (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg flex items-center gap-1.5 border border-emerald-300">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Form Signed &amp; Locked (Audit Compliant)
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Digital Sign &amp; Lock Form
              </span>
            )}
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition">
                {isAlreadySigned ? 'Close View' : 'Cancel'}
              </button>
              {!isAlreadySigned && (
                <button type="submit" disabled={saving} className="px-5 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl hover:bg-teal-700 shadow-sm transition flex items-center gap-1.5">
                  <Save className="w-4 h-4" /> {saving ? 'Signing Note...' : 'Sign & Complete Form'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export const TreatmentSessionsPage = () => {
  const settings = useSettings();
  const [search, setSearch] = useState('');
  const [filterProvider, setFilterProvider] = useState('ALL');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSessionForNote, setSelectedSessionForNote] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { activeProviderFilter } = useUIStore();

  const fetchSessions = async () => {
    try {
      const [data, notesData] = await Promise.all([
        apiAppointmentService.getAllAppointments(),
        apiClinicalNoteService.getNotes().catch(() => [])
      ]);

      const notesList = Array.isArray(notesData) ? notesData : (notesData?.notes || []);
      
      const formatted = (Array.isArray(data) ? data : (data.appointments || [])).map(a => {
        let providerShort = 'OTHER';
        const pName = (a.providerName || '').toUpperCase();
        if (pName.includes('ANIK')) providerShort = 'ANIK';
        else if (pName.includes('DAVS') || pName.includes("DAV'S")) providerShort = 'DAVS';
        else if (pName.includes('JOSMIC')) providerShort = 'JOSMIC';
        else if (pName.includes('COUNSELOR') || pName.includes('BEHAVIORAL')) providerShort = 'COUNSELOR';

        let duration = '45 min';
        if (a.startTime && a.endTime) {
          if (a.cptCode === '99204') duration = '60 min';
        }

        let charge = a.charge ? parseFloat(a.charge) : 0;
        if (!charge) {
          if (a.cptCode === '97039') charge = 6140.00;
          else if (a.cptCode === '0101T') charge = 3390.00;
          else if (a.cptCode === '99204') charge = 1214.00;
          else if (a.cptCode === '90791') charge = 350.00;
          else if (a.cptCode === '90834') charge = 180.00;
          else if (a.cptCode === '90837') charge = 240.00;
          else charge = 350.00; 
        }

        // Match existing note from DB
        const matchingNote = notesList.find(n => 
          (n.content && n.content.appointmentId === a.id) ||
          (n.title && n.title.includes(a.id)) ||
          (n.caseId && a.caseId && n.caseId === a.caseId) || 
          (n.patientId && a.patientId && n.patientId === a.patientId)
        );

        const hasNote = !!matchingNote || !!a.hasClinicalNote || a.status === 'COMPLETED';

        return {
          id: a.id,
          patientId: a.patientId,
          caseId: a.caseId,
          date: a.date,
          dos: a.date,
          provider: a.providerName,
          providerShort,
          patient: a.patientName,
          therapist: a.providerName,
          type: a.appointmentType || 'Therapy Session',
          cpt: a.cptCode || 'N/A',
          duration,
          status: a.status || 'Completed',
          charge,
          hasClinicalNote: hasNote,
          existingNote: matchingNote
        };
      });
      setSessions(formatted);
    } catch (err) {
      console.error('Failed to load sessions', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSessions();
  }, []);

  const filtered = sessions.filter(s => {
    const matchSearch = !search || s.patient?.toLowerCase().includes(search.toLowerCase()) || s.provider?.toLowerCase().includes(search.toLowerCase()) || s.type?.toLowerCase().includes(search.toLowerCase());
    
    let matchProvider = true;
    if (activeProviderFilter !== 'ALL') {
      const filterLower = activeProviderFilter.toLowerCase();
      if (filterLower.includes('josmic')) matchProvider = s.provider.toLowerCase().includes('josmic');
      else if (filterLower.includes('davs')) matchProvider = s.provider.toLowerCase().includes('davs') || s.provider.toLowerCase().includes("dav's");
      else if (filterLower.includes('anik')) matchProvider = s.provider.toLowerCase().includes('anik');
      else if (filterLower.includes('counselor')) matchProvider = s.provider.toLowerCase().includes('counselor') || s.provider.toLowerCase().includes('behavioral');
    }

    if (filterProvider !== 'ALL') {
      matchProvider = matchProvider && (s.providerShort === filterProvider);
    }

    return matchSearch && matchProvider;
  });

  const totalCharge = filtered.reduce((a, s) => a + s.charge, 0);
  const completedSessions = filtered.filter(s => s.status === 'Completed' || s.status === 'CHECKED_IN').length;
  const uniqueClinicsCount = activeProviderFilter === 'ALL'
    ? (sessions.length > 0 ? new Set(sessions.map(s => s.providerShort)).size : 4)
    : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Treatment Sessions</h1>
          <p className="text-xs text-slate-500">All therapy &amp; counseling sessions across JOSMIC, DAV'S Anatomy, ANIK Laser &amp; Counselor Practice providers</p>
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-3.5 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg shadow hover:bg-teal-700 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" /> Schedule Session
        </button>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions', value: loading ? '...' : filtered.length, icon: Activity, color: 'teal', suffix: 'sessions' },
          { label: 'Completed', value: completedSessions, icon: CheckCircle, color: 'emerald', suffix: 'done' },
          { label: 'Total Billed', value: formatCurrency(totalCharge), icon: Clock, color: 'violet', suffix: '' },
          { label: 'Providers', value: uniqueClinicsCount, icon: User, color: 'blue', suffix: uniqueClinicsCount === 1 ? 'clinic' : 'clinics' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{card.label}</span>
                <Icon className={`w-4 h-4 text-${card.color}-500`} />
              </div>
              <p className="text-2xl font-black text-slate-900">{card.value} <span className="text-xs font-normal text-slate-400">{card.suffix}</span></p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by patient, provider or treatment modality..."
              className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-500">Provider:</span>
            {['ALL', 'JOSMIC', 'DAVS', 'ANIK', 'COUNSELOR'].map(f => (
              <button
                key={f}
                onClick={() => setFilterProvider(f)}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition ${filterProvider === f ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Modality Filters Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-teal-600" /> Modality:
          </span>
          {[
            { id: 'ALL', label: 'All Modalities' },
            { id: 'PAIN', label: 'Pain Management' },
            { id: 'LASER', label: 'Laser Therapy' },
            { id: 'ESWT', label: 'Shockwave (ESWT)' },
            { id: 'TPI', label: 'Trigger Point (Pending)' },
            { id: 'TECAR', label: 'TECAR Therapy (Pending)' },
            { id: 'COUNSEL', label: 'Counseling (Pending)' },
          ].map(mod => (
            <button
              key={mod.id}
              onClick={() => setSearch(mod.id === 'ALL' ? '' : mod.label.split(' ')[0])}
              className={`px-2.5 py-1 rounded-full border text-[11px] font-bold whitespace-nowrap transition ${
                search.toLowerCase().includes(mod.label.split(' ')[0].toLowerCase())
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {mod.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold">
            <tr>
              <th className="p-3.5 text-left">Session ID</th>
              <th className="p-3.5 text-left">Patient</th>
              <th className="p-3.5 text-left">Provider</th>
              <th className="p-3.5 text-left">Service Modality</th>
              <th className="p-3.5 text-left">Date &amp; Time</th>
              <th className="p-3.5 text-left">Assigned Clinician</th>
              <th className="p-3.5 text-center">Treatment Status</th>
              <th className="p-3.5 text-center">Form Status</th>
              <th className="p-3.5 text-center">Billing Readiness</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-mono font-bold text-teal-700">{s.id}</td>
                <td className="p-3.5 font-semibold text-slate-900">{s.patient}</td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${PROVIDER_COLORS[s.providerShort] || 'bg-slate-100 text-slate-700'}`}>{s.provider}</span>
                </td>
                <td className="p-3.5 font-medium text-slate-700">{s.type}</td>
                <td className="p-3.5 font-mono text-slate-600">{s.dos} ({s.duration})</td>
                <td className="p-3.5 text-slate-700 font-medium">{s.therapist}</td>
                <td className="p-3.5 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLORS[s.status] || 'bg-slate-100 text-slate-700'}`}>{s.status}</span>
                </td>
                <td className="p-3.5 text-center">
                  {s.hasClinicalNote ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      🟢 Form Complete
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      🟡 Missing Form
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-center">
                  {s.hasClinicalNote ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                      🟢 Ready ({formatCurrency(s.charge)})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">
                      🔒 Pending Form
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedSessionForNote(s)}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition shadow-sm"
                  >
                    📝 {s.hasClinicalNote ? 'View Note' : 'Complete Form'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t border-slate-200">
            <tr>
              <td colSpan={8} className="p-3.5 font-bold text-slate-700 text-[11px]">Total ({filtered.length} sessions)</td>
              <td className="p-3.5 text-right font-mono font-black text-slate-900" colSpan={2}>
                {formatCurrency(filtered.reduce((a, s) => a + s.charge, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Schedule Session Modal */}
      {showScheduleModal && <ScheduleSessionModal onClose={() => setShowScheduleModal(false)} onSuccess={fetchSessions} />}
      
      {/* Complete Clinical Note Modal */}
      {selectedSessionForNote && (
        <CompleteClinicalNoteModal
          session={selectedSessionForNote}
          onClose={() => setSelectedSessionForNote(null)}
          onSuccess={fetchSessions}
        />
      )}
    </div>
  );
};
