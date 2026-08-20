// src/pages/treatments/TreatmentSessionsPage.jsx
import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Clock, User, CheckCircle, AlertCircle, Search, Filter, X, Save } from 'lucide-react';
import { apiAppointmentService } from '../../services/api/apiAppointmentService';
import { apiCaseService } from '../../services/api/apiCaseService';
import { apiProviderService } from '../../services/api/apiProviderService';

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
                <select className={inputCls} value={form.provider} onChange={e => set('provider', e.target.value)}>
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

// --- Main Page ----------------------------------------------------------------
export const TreatmentSessionsPage = () => {
  const settings = useSettings();
  const [search, setSearch] = useState('');
  const [filterProvider, setFilterProvider] = useState('ALL');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const data = await apiAppointmentService.getAllAppointments();
      
      const formatted = (Array.isArray(data) ? data : (data.appointments || [])).map(a => {
        let providerShort = 'OTHER';
        const pName = (a.providerName || '').toUpperCase();
        if (pName.includes('ANIK')) providerShort = 'ANIK';
        else if (pName.includes('DAVS') || pName.includes("DAV'S")) providerShort = 'DAVS';
        else if (pName.includes('JOSMIC')) providerShort = 'JOSMIC';

        let duration = '45 min';
        if (a.startTime && a.endTime) {
          if (a.cptCode === '99204') duration = '60 min';
        }

        let charge = 0;
        if (a.cptCode === '97039') charge = 6140.00;
        else if (a.cptCode === '0101T') charge = 3390.00;
        else if (a.cptCode === '99204') charge = 1214.00;
        else charge = 1500.00; 

        return {
          id: a.id,
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
          hasClinicalNote: !!a.hasClinicalNote
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
    const matchSearch = !search || s.patient.toLowerCase().includes(search.toLowerCase()) || s.provider.toLowerCase().includes(search.toLowerCase()) || s.type.toLowerCase().includes(search.toLowerCase());
    const matchProvider = filterProvider === 'ALL' || s.providerShort === filterProvider;
    return matchSearch && matchProvider;
  });

  const totalCharge = sessions.reduce((a, s) => a + s.charge, 0);
  const completedSessions = sessions.filter(s => s.status === 'Completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Treatment Sessions</h1>
          <p className="text-xs text-slate-500">All therapy sessions across JOSMIC, DAV'S Anatomy &amp; ANIK Laser Therapy providers</p>
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
          { label: 'Total Sessions', value: loading ? '...' : sessions.length, icon: Activity, color: 'teal', suffix: 'sessions' },
          { label: 'Completed', value: completedSessions, icon: CheckCircle, color: 'emerald', suffix: 'done' },
          { label: 'Total Billed', value: formatCurrency(totalCharge), icon: Clock, color: 'violet', suffix: '' },
          { label: 'Providers', value: 3, icon: User, color: 'blue', suffix: 'clinics' },
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
            {['ALL', 'JOSMIC', 'DAVS', 'ANIK'].map(f => (
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
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 cursor-pointer">
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
                      Form Complete
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Missing Form
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-center">
                  {s.hasClinicalNote ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                      Ready ({formatCurrency(s.charge)})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200">
                      Pending Form
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t border-slate-200">
            <tr>
              <td colSpan={7} className="p-3.5 font-bold text-slate-700 text-[11px]">Total ({filtered.length} sessions)</td>
              <td className="p-3.5 text-right font-mono font-black text-slate-900" colSpan={2}>
                {formatCurrency(filtered.reduce((a, s) => a + s.charge, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Schedule Session Modal */}
      {showScheduleModal && <ScheduleSessionModal onClose={() => setShowScheduleModal(false)} onSuccess={fetchSessions} />}
    </div>
  );
};
