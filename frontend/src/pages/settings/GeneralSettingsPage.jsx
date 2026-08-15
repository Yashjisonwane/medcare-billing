// src/pages/settings/GeneralSettingsPage.jsx
import React, { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { Settings, Save, Globe, Bell, Shield, Monitor, Building, User, Palette, Clock, Activity } from 'lucide-react';
import { getUSHolidaysForYear } from '../../constants/usHolidays';

const inputCls = 'w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition';
const labelCls = 'block text-xs font-bold text-on-surface mb-1';

const SectionHead = ({ Icon, title, subtitle }) => (
  <div className="flex items-start gap-3 border-b border-outline-variant pb-3 mb-4">
    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-teal-600" />
    </div>
    <div>
      <h2 className="text-sm font-bold text-on-surface">{title}</h2>
      {subtitle && <p className="text-[10px] text-on-surface-variant mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const ToggleRow = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-outline-variant/50 last:border-0">
    <div>
      <p className="text-xs font-bold text-on-surface">{label}</p>
      {description && <p className="text-[10px] text-on-surface-variant mt-0.5">{description}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${checked ? 'bg-teal-600' : 'bg-slate-300'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  </div>
);

export const GeneralSettingsPage = () => {
  const [settings, setSettings] = useState({
    // Practice Identity
    appName: 'F&M Health & Wellness',
    practiceName: 'F&M Health & Wellness Center LLC',
    practiceType: 'MULTI_SPECIALTY',
    npi: '1234567890',
    taxId: '75-1234567',
    licenseNumber: 'TX-MED-98765',
    practicePhone: '713-485-5700',
    practiceEmail: 'admin@medpracticepro.com',
    practiceAddress: '10101 Harwin Dr.',
    practiceCity: 'Houston',
    practiceState: 'TX',
    practiceZip: '77036',
    practiceWebsite: 'https://medpracticepro.com',

    // Localization
    timezone: 'America/Chicago',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12H',
    language: 'en-US',
    fiscalYearStart: 'JANUARY',

    // Appointment Settings
    defaultAppointmentDuration: '60',
    appointmentBuffer: '15',
    scheduleStartTime: '08:00',
    scheduleEndTime: '18:00',
    allowSameDayBooking: true,
    requireAuthForBooking: false,
    autoConfirmAppointments: false,
    maxConcurrentAppointments: '3',

    // Notifications
    smsRemindersEnabled: true,
    emailRemindersEnabled: true,
    reminderTiming: '24H',
    appointmentConfirmationEmail: true,
    billingNotificationsEnabled: true,
    overdueBalanceAlerts: true,
    newPatientWelcomeEmail: true,
    smsSenderId: 'MedPracticePro',

    // Billing Defaults
    defaultBillingType: 'LIEN',
    defaultPlaceOfService: '11',
    autoGenerateStatementNumbers: true,
    statementPrefix: 'STMT',
    agingPeriod1: '30',
    agingPeriod2: '60',
    agingPeriod3: '90',
    taxRate: '0',
    lateFeeEnabled: false,
    lateFeePercent: '1.5',

    // Security / Access
    sessionTimeoutMinutes: '60',
    requireMfaForAdmin: true,
    auditLogsEnabled: true,
    passwordExpiryDays: '90',
    ipWhitelistEnabled: false,

    // UI / Display
    sidebarCollapsed: false,
    compactMode: false,
    darkModeDefault: false,
    showPatientPhotos: true,
    defaultDashboardView: 'OVERVIEW',
  });

  const { addToast } = useUIStore();
  const set = (field, val) => setSettings(p => ({ ...p, [field]: val }));

  const handleSave = (e) => {
    e.preventDefault();
    addToast('General practice settings updated (Demo)!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">General Practice Settings</h1>
          <p className="text-xs text-on-surface-variant">Global platform parameters, timezones &amp; default localization</p>
        </div>
        <button onClick={handleSave} className="px-5 py-2 bg-secondary-container text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-5">

        {/* Practice & Service Management (6 Core Modalities) */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          <SectionHead Icon={Activity} title="Practice & Service Management (Core Modalities)" subtitle="Configure CPT codes, provider assignments, pricing and clinical form templates" />
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 text-left">Service Modality</th>
                  <th className="p-2.5 text-left">Assigned Provider</th>
                  <th className="p-2.5 text-center">Enabled</th>
                  <th className="p-2.5 text-center">CPT Code</th>
                  <th className="p-2.5 text-right">Configured Fee</th>
                  <th className="p-2.5 text-center">Duration</th>
                  <th className="p-2.5 text-left">Clinical Template</th>
                  <th className="p-2.5 text-center">Configuration Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Pain Management', provider: 'JOSMIC Wellness Center', enabled: true, cpt: '99204 (Confirmed)', fee: '$1,214.00', duration: '60 min', template: 'JOSMIC Pain Evaluation', status: 'COMPLETE', statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
                  { name: 'Laser Therapy', provider: 'ANIK Laser Therapy', enabled: true, cpt: '97039 (Confirmed)', fee: '$2,000.00', duration: '45 min', template: 'ANIK Laser Procedure Form', status: 'COMPLETE', statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
                  { name: 'Shockwave Therapy', provider: "DAV'S Anatomy", enabled: true, cpt: '0101T (Confirmed)', fee: '$1,000.00', duration: '30 min', template: "DAV'S ESWT Therapy Record", status: 'COMPLETE', statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
                  { name: 'Trigger Point Injection', provider: 'Unassigned (Provider Assignment Required)', enabled: false, cpt: '20552 (Pending)', fee: 'Pricing Pending', duration: '30 min', template: 'Trigger Point Form (Pending)', status: 'CONFIGURATION_PENDING', statusBadge: 'bg-amber-100 text-amber-800 border-amber-200' },
                  { name: 'TECAR Therapy', provider: 'Unassigned (Provider Assignment Required)', enabled: false, cpt: '97039-RF (Pending)', fee: 'Pricing Pending', duration: '45 min', template: 'TECAR Procedure Form (Pending)', status: 'CONFIGURATION_PENDING', statusBadge: 'bg-rose-100 text-rose-800 border-rose-200' },
                  { name: 'Counseling', provider: 'Counselor Practice (Hope Behavioral Health)', enabled: true, cpt: '90834 / 90791', fee: '$180.00 – $350.00', duration: '45 min', template: 'Behavioral Health Progress Note', status: 'COMPLETE', statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
                ].map(srv => (
                  <tr key={srv.name} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{srv.name}</td>
                    <td className="p-2.5 text-slate-700">{srv.provider}</td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${srv.enabled ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-500'}`}>
                        {srv.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-mono font-medium text-slate-700">{srv.cpt}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">{srv.fee}</td>
                    <td className="p-2.5 text-center text-slate-600">{srv.duration}</td>
                    <td className="p-2.5 text-slate-700 font-medium">{srv.template}</td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${srv.statusBadge}`}>
                        {srv.status === 'COMPLETE' ? 'Complete' : srv.status === 'AWAITING_REF_DOCS' ? 'Awaiting Client Docs' : 'Configuration Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Practice Identity */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          <SectionHead Icon={Building} title="Practice Identity" subtitle="Legal name, NPI, Tax ID and contact details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Application / Platform Name</label><input className={inputCls} value={settings.appName} onChange={e => set('appName', e.target.value)} /></div>
            <div><label className={labelCls}>Legal Practice Name</label><input className={inputCls} value={settings.practiceName} onChange={e => set('practiceName', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Practice Type</label>
              <select className={inputCls} value={settings.practiceType} onChange={e => set('practiceType', e.target.value)}>
                <option value="MULTI_SPECIALTY">Multi-Specialty Group</option>
                <option value="SOLO">Solo Practice</option>
                <option value="PHYSICAL_THERAPY">Physical Therapy</option>
                <option value="CHIROPRACTIC">Chiropractic</option>
                <option value="PAIN_MANAGEMENT">Pain Management</option>
                <option value="MENTAL_HEALTH">Mental Health</option>
              </select>
            </div>
            <div><label className={labelCls}>Group NPI</label><input className={inputCls} value={settings.npi} onChange={e => set('npi', e.target.value)} /></div>
            <div><label className={labelCls}>Federal Tax ID (EIN)</label><input className={inputCls} value={settings.taxId} onChange={e => set('taxId', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>State License Number</label><input className={inputCls} value={settings.licenseNumber} onChange={e => set('licenseNumber', e.target.value)} /></div>
            <div><label className={labelCls}>Practice Phone</label><input type="tel" className={inputCls} value={settings.practicePhone} onChange={e => set('practicePhone', e.target.value)} /></div>
            <div><label className={labelCls}>Practice Email</label><input type="email" className={inputCls} value={settings.practiceEmail} onChange={e => set('practiceEmail', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            <div className="col-span-2"><label className={labelCls}>Street Address</label><input className={inputCls} value={settings.practiceAddress} onChange={e => set('practiceAddress', e.target.value)} /></div>
            <div><label className={labelCls}>City</label><input className={inputCls} value={settings.practiceCity} onChange={e => set('practiceCity', e.target.value)} /></div>
            <div><label className={labelCls}>State</label><input className={inputCls} value={settings.practiceState} onChange={e => set('practiceState', e.target.value)} /></div>
            <div><label className={labelCls}>ZIP</label><input className={inputCls} value={settings.practiceZip} onChange={e => set('practiceZip', e.target.value)} /></div>
          </div>
          <div><label className={labelCls}>Website URL</label><input type="url" className={inputCls} value={settings.practiceWebsite} onChange={e => set('practiceWebsite', e.target.value)} /></div>
        </div>

        {/* Localization */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          <SectionHead Icon={Globe} title="Localization & Regional" subtitle="Timezone, date formats, currency and language" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Timezone</label>
              <select className={inputCls} value={settings.timezone} onChange={e => set('timezone', e.target.value)}>
                <option value="America/Chicago">America/Chicago (CT)</option>
                <option value="America/New_York">America/New_York (ET)</option>
                <option value="America/Denver">America/Denver (MT)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PT)</option>
                <option value="America/Phoenix">America/Phoenix (AZ)</option>
              </select>
            </div>
            <div><label className={labelCls}>Default Currency</label>
              <select className={inputCls} value={settings.currency} onChange={e => set('currency', e.target.value)}>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="CAD">CAD (C$) — Canadian Dollar</option>
              </select>
            </div>
            <div><label className={labelCls}>Date Format</label>
              <select className={inputCls} value={settings.dateFormat} onChange={e => set('dateFormat', e.target.value)}>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Time Format</label>
              <select className={inputCls} value={settings.timeFormat} onChange={e => set('timeFormat', e.target.value)}>
                <option value="12H">12-Hour (AM/PM)</option>
                <option value="24H">24-Hour</option>
              </select>
            </div>
            <div><label className={labelCls}>Language</label>
              <select className={inputCls} value={settings.language} onChange={e => set('language', e.target.value)}>
                <option value="en-US">English (US)</option>
                <option value="es-US">Spanish (US)</option>
                <option value="fr-CA">French (CA)</option>
              </select>
            </div>
            <div><label className={labelCls}>Fiscal Year Start</label>
              <select className={inputCls} value={settings.fiscalYearStart} onChange={e => set('fiscalYearStart', e.target.value)}>
                {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                  <option key={m} value={m.toUpperCase()}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Appointment Settings */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          <SectionHead Icon={Clock} title="Appointment & Scheduling" subtitle="Default durations, schedule hours, and booking rules" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><label className={labelCls}>Default Duration (min)</label>
              <select className={inputCls} value={settings.defaultAppointmentDuration} onChange={e => set('defaultAppointmentDuration', e.target.value)}>
                <option>15</option><option>30</option><option>45</option><option>60</option><option>90</option><option>120</option>
              </select>
            </div>
            <div><label className={labelCls}>Buffer Time (min)</label>
              <select className={inputCls} value={settings.appointmentBuffer} onChange={e => set('appointmentBuffer', e.target.value)}>
                <option value="0">None</option><option value="5">5 min</option><option value="10">10 min</option><option value="15">15 min</option><option value="30">30 min</option>
              </select>
            </div>
            <div><label className={labelCls}>Schedule Start</label><input type="time" className={inputCls} value={settings.scheduleStartTime} onChange={e => set('scheduleStartTime', e.target.value)} /></div>
            <div><label className={labelCls}>Schedule End</label><input type="time" className={inputCls} value={settings.scheduleEndTime} onChange={e => set('scheduleEndTime', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Max Concurrent Appointments</label><input type="number" min="1" max="20" className={inputCls} value={settings.maxConcurrentAppointments} onChange={e => set('maxConcurrentAppointments', e.target.value)} /></div>
          </div>
          <div className="space-y-0">
            <ToggleRow label="Allow Same-Day Booking" description="Patients can book appointments on the same day" checked={settings.allowSameDayBooking} onChange={v => set('allowSameDayBooking', v)} />
            <ToggleRow label="Require Authorization for Booking" description="Require pre-auth number before confirming appointment" checked={settings.requireAuthForBooking} onChange={v => set('requireAuthForBooking', v)} />
            <ToggleRow label="Auto-Confirm Appointments" description="New appointments are automatically confirmed without manual review" checked={settings.autoConfirmAppointments} onChange={v => set('autoConfirmAppointments', v)} />
            <ToggleRow label="Auto-Block Appointments on US Federal Holidays" description="Automatically set practice availability to OFF and block routine booking on US Federal Holidays" checked={settings.autoBlockUSHolidays !== false} onChange={v => set('autoBlockUSHolidays', v)} />
          </div>

          <div className="pt-3 border-t border-outline-variant/50 space-y-2">
            <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
              <span>🇺🇸</span> Official US Federal Holidays (Auto Holiday Off Calendar)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2 text-left">Holiday Name</th>
                    <th className="p-2 text-left">Calendar Date (2026)</th>
                    <th className="p-2 text-left">Observed Date</th>
                    <th className="p-2 text-center">Practice Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {getUSHolidaysForYear(2026).map(h => (
                    <tr key={h.id} className="hover:bg-slate-50">
                      <td className="p-2 font-bold text-slate-900">{h.name}</td>
                      <td className="p-2 font-mono text-slate-700">{h.date}</td>
                      <td className="p-2 font-mono text-slate-700">{h.observedDate} {h.isObservedDiff && '(Observed)'}</td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                          Auto Off (Clinic Closed)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          <SectionHead Icon={Bell} title="Notifications & Reminders" subtitle="SMS, email and in-app notification preferences" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Default Reminder Timing</label>
              <select className={inputCls} value={settings.reminderTiming} onChange={e => set('reminderTiming', e.target.value)}>
                <option value="1H">1 Hour Before</option><option value="3H">3 Hours Before</option><option value="24H">24 Hours Before</option><option value="48H">48 Hours Before</option><option value="72H">72 Hours Before</option>
              </select>
            </div>
            <div><label className={labelCls}>SMS Sender ID / Name</label><input className={inputCls} value={settings.smsSenderId} onChange={e => set('smsSenderId', e.target.value)} placeholder="e.g. MedPracticePro" /></div>
          </div>
          <div className="space-y-0">
            <ToggleRow label="SMS Appointment Reminders" description="Send automated SMS reminders to patients" checked={settings.smsRemindersEnabled} onChange={v => set('smsRemindersEnabled', v)} />
            <ToggleRow label="Email Appointment Reminders" description="Send automated email reminders to patients" checked={settings.emailRemindersEnabled} onChange={v => set('emailRemindersEnabled', v)} />
            <ToggleRow label="Appointment Confirmation Emails" description="Send booking confirmation on new appointment creation" checked={settings.appointmentConfirmationEmail} onChange={v => set('appointmentConfirmationEmail', v)} />
            <ToggleRow label="Billing & Payment Notifications" description="Notify staff of new payments and adjustments posted" checked={settings.billingNotificationsEnabled} onChange={v => set('billingNotificationsEnabled', v)} />
            <ToggleRow label="Overdue Balance Alerts" description="Alert billing team when accounts exceed aging thresholds" checked={settings.overdueBalanceAlerts} onChange={v => set('overdueBalanceAlerts', v)} />
            <ToggleRow label="New Patient Welcome Email" description="Send welcome email to newly registered patients" checked={settings.newPatientWelcomeEmail} onChange={v => set('newPatientWelcomeEmail', v)} />
          </div>
        </div>

        {/* Billing Defaults */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          <SectionHead Icon={Settings} title="Billing Defaults" subtitle="Default billing type, aging periods, statement numbering" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Default Billing Type</label>
              <select className={inputCls} value={settings.defaultBillingType} onChange={e => set('defaultBillingType', e.target.value)}>
                <option value="LIEN">Attorney Lien</option><option value="INSURANCE">Insurance Direct</option><option value="PATIENT">Patient Self-Pay</option><option value="WORKERS_COMP">Workers' Comp</option>
              </select>
            </div>
            <div><label className={labelCls}>Default Place of Service</label><input className={inputCls} value={settings.defaultPlaceOfService} onChange={e => set('defaultPlaceOfService', e.target.value)} placeholder="e.g. 11 (Office)" /></div>
            <div><label className={labelCls}>Statement # Prefix</label><input className={inputCls} value={settings.statementPrefix} onChange={e => set('statementPrefix', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelCls}>Aging Period 1 (days)</label><input type="number" className={inputCls} value={settings.agingPeriod1} onChange={e => set('agingPeriod1', e.target.value)} /></div>
            <div><label className={labelCls}>Aging Period 2 (days)</label><input type="number" className={inputCls} value={settings.agingPeriod2} onChange={e => set('agingPeriod2', e.target.value)} /></div>
            <div><label className={labelCls}>Aging Period 3 (days)</label><input type="number" className={inputCls} value={settings.agingPeriod3} onChange={e => set('agingPeriod3', e.target.value)} /></div>
          </div>
          <div className="space-y-0">
            <ToggleRow label="Auto-Generate Statement Numbers" description="Platform generates unique statement IDs automatically" checked={settings.autoGenerateStatementNumbers} onChange={v => set('autoGenerateStatementNumbers', v)} />
            <ToggleRow label="Enable Late Fees" description={`Charge ${settings.lateFeePercent}% monthly on overdue balances`} checked={settings.lateFeeEnabled} onChange={v => set('lateFeeEnabled', v)} />
          </div>
        </div>

        {/* Security */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          <SectionHead Icon={Shield} title="Security & Access Control" subtitle="Session management, MFA and audit settings" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className={labelCls}>Session Timeout (minutes)</label>
              <select className={inputCls} value={settings.sessionTimeoutMinutes} onChange={e => set('sessionTimeoutMinutes', e.target.value)}>
                <option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option><option value="120">2 hours</option><option value="480">8 hours</option>
              </select>
            </div>
            <div><label className={labelCls}>Password Expiry (days)</label>
              <select className={inputCls} value={settings.passwordExpiryDays} onChange={e => set('passwordExpiryDays', e.target.value)}>
                <option value="30">30 days</option><option value="60">60 days</option><option value="90">90 days</option><option value="180">180 days</option><option value="NEVER">Never</option>
              </select>
            </div>
          </div>
          <div className="space-y-0">
            <ToggleRow label="Require MFA for Admin Accounts" description="Super Admin and Admin roles must use two-factor authentication" checked={settings.requireMfaForAdmin} onChange={v => set('requireMfaForAdmin', v)} />
            <ToggleRow label="Audit Logs Enabled" description="Log all user actions for compliance and security review" checked={settings.auditLogsEnabled} onChange={v => set('auditLogsEnabled', v)} />
            <ToggleRow label="IP Whitelist Enforcement" description="Restrict platform access to approved IP addresses only" checked={settings.ipWhitelistEnabled} onChange={v => set('ipWhitelistEnabled', v)} />
          </div>
        </div>

        {/* Display */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5 space-y-4">
          <SectionHead Icon={Monitor} title="Display & UI Preferences" subtitle="Default views, layout and visual preferences" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Default Dashboard View</label>
              <select className={inputCls} value={settings.defaultDashboardView} onChange={e => set('defaultDashboardView', e.target.value)}>
                <option value="OVERVIEW">Practice Overview</option><option value="BILLING">Billing Overview</option><option value="SCHEDULE">Today's Schedule</option><option value="PATIENTS">Patient List</option>
              </select>
            </div>
          </div>
          <div className="space-y-0">
            <ToggleRow label="Compact Mode" description="Reduce spacing and padding for denser information display" checked={settings.compactMode} onChange={v => set('compactMode', v)} />
            <ToggleRow label="Dark Mode as Default" description="Open the platform in dark mode by default" checked={settings.darkModeDefault} onChange={v => set('darkModeDefault', v)} />
            <ToggleRow label="Show Patient Photos" description="Display patient avatar photos in lists and profiles" checked={settings.showPatientPhotos} onChange={v => set('showPatientPhotos', v)} />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" className="px-6 py-2.5 bg-secondary-container text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Save Practice Settings
          </button>
        </div>
      </form>
    </div>
  );
};
