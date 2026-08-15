// src/components/packets/josmic/JosmicPainManagementReport.jsx
import React from 'react';

const CB = ({ checked = false, label, blankMode }) => (
  <span className="inline-flex items-center gap-1 mr-3 text-[11px]">
    <span className="w-3.5 h-3.5 border border-slate-600 inline-flex items-center justify-center text-[10px] font-bold bg-white flex-shrink-0">
      {!blankMode && checked ? '✓' : ''}
    </span>
    {label}
  </span>
);

const FieldLine = ({ label, value, blankMode, width = '180px' }) => (
  <div className="flex items-center gap-1.5 text-[11px] mb-1">
    {label && <span className="font-bold text-slate-700 whitespace-nowrap">{label}</span>}
    <div className="border-b border-slate-500 pb-0.5" style={{ width }}>
      {!blankMode ? value : ''}&nbsp;
    </div>
  </div>
);

const SectionHeader = ({ children }) => (
  <h2 className="font-bold text-slate-900 text-[12px] uppercase mt-5 mb-2 border-b border-slate-300 pb-1">{children}</h2>
);

const PageHeader = ({ page }) => (
  <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3 mb-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 80 80" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="38" fill="#0d9488" />
          <ellipse cx="40" cy="22" rx="8" ry="9" fill="white" />
          <rect x="30" y="32" width="20" height="24" rx="4" fill="white" />
          <rect x="24" y="33" width="8" height="18" rx="3" fill="white" />
          <rect x="48" y="33" width="8" height="18" rx="3" fill="white" />
          <rect x="31" y="56" width="8" height="16" rx="3" fill="white" />
          <rect x="41" y="56" width="8" height="16" rx="3" fill="white" />
        </svg>
      </div>
      <div>
        <h1 className="text-lg font-black text-teal-800 uppercase tracking-tight" style={{ fontFamily: 'serif' }}>JOSMIC WELLNESS CENTER</h1>
        <p className="text-[10px] font-bold text-slate-600">PAIN MANAGEMENT CONSULTATION &amp; EVALUATION REPORT</p>
        <p className="text-[9px] text-slate-500">10101 HARWIN DR. STE 274 HOUSTON TX 77036 &nbsp;|&nbsp; OFFICE: 713-485-5712 &nbsp;|&nbsp; FAX: 832-416-1502</p>
      </div>
    </div>
    <div className="text-right font-mono text-[10px] text-slate-600 border border-slate-300 p-2 bg-slate-50">
      <p className="font-bold">PAGE {page} OF 4</p>
      <p>DOS: 12/30/2025</p>
    </div>
  </div>
);

const PatientInfoBar = ({ blankMode }) => (
  <div className="bg-slate-100 border border-slate-300 p-2.5 mb-4 grid grid-cols-2 gap-2 text-[11px] font-mono">
    <div>PATIENT: <strong>{blankMode ? '_______________________' : 'SAMPLE TESTING'}</strong></div>
    <div>CONSULTING PHYSICIAN: <strong>Anthony Nguyen, MD / Pain Management</strong></div>
  </div>
);

// ─── PAGE 1 ──────────────────────────────────────────────────────────────────
const Page1 = ({ blankMode }) => (
  <div>
    <div className="flex items-center gap-4 mb-4">
      <span className="text-[11px] font-bold text-slate-700">Current Date:</span>
      <div className="border-b border-slate-500 w-32 text-[11px] font-mono">{blankMode ? '' : '12 / 30 / 2025'}&nbsp;</div>
    </div>

    <div className="bg-slate-50 border border-slate-200 p-3 mb-4 grid grid-cols-3 gap-3 text-[11px] font-mono">
      <div><span className="font-bold">Patient Name: </span><span className="border-b border-slate-400 inline-block w-28">{blankMode ? '' : 'SAMPLE TESTING'}&nbsp;</span></div>
      <div><span className="font-bold">DOB: </span><span className="border-b border-slate-400 inline-block w-20">{blankMode ? '' : '10/08/1974'}&nbsp;</span></div>
      <div><span className="font-bold">Gender: </span><span className="border-b border-slate-400 inline-block w-16">{blankMode ? '' : 'M'}&nbsp;</span></div>
    </div>

    <SectionHeader>1. Chief Complaint &amp; Pain Assessment</SectionHeader>

    <div className="text-[11px] mb-3">
      <span className="font-bold">What is the primary reason for today's visit? </span>
      <div className="border-b border-slate-400 mt-1 mb-1 w-full">{blankMode ? '' : 'Pain in upper, mid, and lower back from motor vehicle accident'}&nbsp;</div>
      <div className="border-b border-slate-400 mt-2 w-full">&nbsp;</div>
    </div>

    <div className="mb-4">
      <p className="font-bold text-[11px] mb-1.5">Pain Description (Check all that applies):</p>
      <div className="flex flex-wrap gap-y-1.5">
        <CB checked={true} label="Sharp" blankMode={blankMode} />
        <CB checked={false} label="Dull" blankMode={blankMode} />
        <CB checked={false} label="Throbbing" blankMode={blankMode} />
        <CB checked={false} label="Burning" blankMode={blankMode} />
        <CB checked={false} label="Radiating" blankMode={blankMode} />
        <CB checked={false} label="Tingling" blankMode={blankMode} />
        <CB checked={false} label="Stabbing" blankMode={blankMode} />
        <CB checked={false} label="Numbness" blankMode={blankMode} />
      </div>
      <div className="flex items-center gap-2 mt-1.5 text-[11px]">
        <span className="font-bold">Other:</span>
        <div className="border-b border-slate-400 flex-1">&nbsp;</div>
      </div>
    </div>

    <div className="mb-4">
      <p className="font-bold text-[11px] mb-1.5">Pain Location (Check all that applies):</p>
      <div className="flex flex-wrap gap-y-1.5">
        <CB checked={false} label="Neck" blankMode={blankMode} />
        <CB checked={false} label="Chest" blankMode={blankMode} />
        <CB checked={false} label="Head" blankMode={blankMode} />
        <CB checked={true} label="U.Back" blankMode={blankMode} />
        <CB checked={true} label="M.Back" blankMode={blankMode} />
        <CB checked={true} label="L.Back" blankMode={blankMode} />
        <CB checked={false} label="R.Shoulder" blankMode={blankMode} />
        <CB checked={false} label="L.Shoulder" blankMode={blankMode} />
        <CB checked={false} label="R.Knee" blankMode={blankMode} />
        <CB checked={false} label="L.Knee" blankMode={blankMode} />
        <CB checked={false} label="R.Ankle" blankMode={blankMode} />
        <CB checked={false} label="L.Ankle" blankMode={blankMode} />
        <CB checked={false} label="R.Wrist" blankMode={blankMode} />
        <CB checked={false} label="L.Wrist" blankMode={blankMode} />
        <CB checked={false} label="Joint pain" blankMode={blankMode} />
        <CB checked={false} label="Muscle pain" blankMode={blankMode} />
        <CB checked={false} label="Headache" blankMode={blankMode} />
        <CB checked={false} label="R.arm" blankMode={blankMode} />
        <CB checked={false} label="L.arm" blankMode={blankMode} />
        <CB checked={false} label="R.leg" blankMode={blankMode} />
        <CB checked={false} label="L.leg" blankMode={blankMode} />
        <CB checked={false} label="R.elbow" blankMode={blankMode} />
        <CB checked={false} label="L.elbow" blankMode={blankMode} />
      </div>
      <div className="flex items-center gap-2 mt-1.5 text-[11px]">
        <span className="font-bold">Other:</span>
        <div className="border-b border-slate-400 flex-1">&nbsp;</div>
      </div>
    </div>

    <SectionHeader>2. History of Present Illness (HPI)</SectionHeader>

    <div className="mb-3">
      <p className="font-bold text-[11px] mb-1.5">Mechanism of Injury (Select all that apply):</p>
      <div className="flex flex-wrap gap-y-1.5">
        <CB checked={true} label="Motor vehicle accident" blankMode={blankMode} />
        <CB checked={false} label="Slip and Fall" blankMode={blankMode} />
        <CB checked={false} label="Workplace injury" blankMode={blankMode} />
        <CB checked={false} label="Sports injury" blankMode={blankMode} />
        <CB checked={false} label="Assault" blankMode={blankMode} />
      </div>
      <div className="flex items-center gap-2 mt-1.5 text-[11px]">
        <span className="font-bold">Other:</span>
        <div className="border-b border-slate-400 flex-1">&nbsp;</div>
      </div>
    </div>
  </div>
);

// ─── PAGE 2 ──────────────────────────────────────────────────────────────────
const Page2 = ({ blankMode }) => (
  <div>
    <div className="mb-4 text-[11px]">
      <div className="flex items-center gap-3 mb-2">
        <span className="font-bold">2.1 Date of Injury:</span>
        <div className="border-b border-slate-400 w-24 font-mono">{blankMode ? '' : '12 / 27 / 2025'}&nbsp;</div>
      </div>
      <p className="font-bold mb-2">2.2 Pain Severity (0–10): rate in scale of severity</p>
      <div className="grid grid-cols-3 gap-4 mb-3 pl-2">
        <div>
          <span className="font-semibold">Current: </span>
          <div className="border-b border-slate-400 inline-block w-12 font-mono">{blankMode ? '' : '07'}&nbsp;</div>
        </div>
        <div>
          <span className="font-semibold">Worst: </span>
          <div className="border-b border-slate-400 inline-block w-12 font-mono">{blankMode ? '' : '08'}&nbsp;</div>
        </div>
        <div>
          <span className="font-semibold">Best: </span>
          <div className="border-b border-slate-400 inline-block w-12 font-mono">{blankMode ? '' : '08'}&nbsp;</div>
        </div>
      </div>
    </div>

    <div className="mb-3">
      <p className="font-bold text-[11px] mb-1.5">Aggravating Factors (Circle all that apply):</p>
      <div className="flex flex-wrap gap-y-1.5">
        <CB checked={false} label="Movement" blankMode={blankMode} />
        <CB checked={false} label="Sitting/Standing" blankMode={blankMode} />
        <CB checked={false} label="Walking" blankMode={blankMode} />
        <CB checked={true} label="Bending" blankMode={blankMode} />
        <CB checked={false} label="Lifting" blankMode={blankMode} />
      </div>
      <div className="flex items-center gap-2 mt-1.5 text-[11px]">
        <span className="font-bold">Other:</span>
        <div className="border-b border-slate-400 flex-1">&nbsp;</div>
      </div>
    </div>

    <div className="mb-3">
      <p className="font-bold text-[11px] mb-1.5">Relieving Factors (Circle all that apply):</p>
      <div className="flex flex-wrap gap-y-1.5">
        <CB checked={false} label="Rest" blankMode={blankMode} />
        <CB checked={false} label="Ice/Heat" blankMode={blankMode} />
        <CB checked={false} label="Pain medications" blankMode={blankMode} />
        <CB checked={false} label="Physical therapy" blankMode={blankMode} />
        <CB checked={true} label="Nothing helps" blankMode={blankMode} />
      </div>
    </div>

    <div className="mb-4">
      <p className="font-bold text-[11px] mb-1.5">Functional Limitations (Circle all that apply):</p>
      <div className="flex flex-wrap gap-y-1.5">
        <CB checked={false} label="Difficulty sleeping" blankMode={blankMode} />
        <CB checked={false} label="Trouble walking" blankMode={blankMode} />
        <CB checked={false} label="Can't return to work" blankMode={blankMode} />
        <CB checked={true} label="Reduced daily activities" blankMode={blankMode} />
      </div>
      <div className="flex items-center gap-2 mt-1.5 text-[11px]">
        <span className="font-bold">Other:</span>
        <div className="border-b border-slate-400 flex-1">&nbsp;</div>
      </div>
    </div>

    <SectionHeader>3. Past Medical History</SectionHeader>

    <div className="mb-3">
      <p className="font-bold text-[11px] mb-1.5">Relevant Medical History (Circle all that apply):</p>
      <div className="flex flex-wrap gap-y-1.5">
        {['Diabetes','Hypertension','Neuropathy','Depression/Anxiety','Previous pain management','Heart disease','Cancer','Arthritis','Asthma','High cholesterol','Depression','Anxiety','Lupus','Chronic pain'].map(item => (
          <CB key={item} checked={false} label={item} blankMode={blankMode} />
        ))}
        <CB checked={true} label="None" blankMode={blankMode} />
      </div>
      <div className="flex items-center gap-2 mt-1.5 text-[11px]">
        <span className="font-bold">Other:</span>
        <div className="border-b border-slate-400 flex-1">&nbsp;</div>
      </div>
    </div>

    <div className="mb-3 text-[11px]">
      <p className="font-bold mb-1">Surgical History:</p>
      <div className="flex items-center gap-3 pl-2">
        <span>Relevant prior surgery:</span>
        <div className="border-b border-slate-400 flex-1">&nbsp;</div>
        <CB checked={true} label="None" blankMode={blankMode} />
      </div>
    </div>

    <div className="mb-2 text-[11px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold">Medications (current):</span>
        <div className="border-b border-slate-400 flex-1">&nbsp;</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold">Allergies:</span>
        <div className="border-b border-slate-400 flex-1">&nbsp;</div>
      </div>
    </div>

    <SectionHeader>4. Review of Systems (ROS)</SectionHeader>
    <p className="text-[11px] italic text-slate-500 mb-2">Circle all that apply in this section</p>

    <div className="mb-3">
      <p className="font-bold text-[11px] mb-1">Neurologic:</p>
      <div className="flex flex-wrap gap-y-1.5 pl-2">
        <CB checked={false} label="Numbness" blankMode={blankMode} />
        <CB checked={false} label="Tingling" blankMode={blankMode} />
        <CB checked={false} label="Weakness" blankMode={blankMode} />
        <CB checked={false} label="Balance issues" blankMode={blankMode} />
        <CB checked={false} label="Headaches" blankMode={blankMode} />
        <CB checked={true} label="None" blankMode={blankMode} />
      </div>
    </div>
  </div>
);

// ─── PAGE 3 ──────────────────────────────────────────────────────────────────
const Page3 = ({ blankMode }) => (
  <div>
    <div className="mb-3">
      <p className="font-bold text-[11px] mb-1">Musculoskeletal:</p>
      <div className="flex flex-wrap gap-y-1.5 pl-2">
        <CB checked={false} label="Joint stiffness" blankMode={blankMode} />
        <CB checked={true} label="Muscle spasms" blankMode={blankMode} />
        <CB checked={false} label="Swelling" blankMode={blankMode} />
        <CB checked={false} label="Limited range of motion" blankMode={blankMode} />
        <CB checked={false} label="None" blankMode={blankMode} />
      </div>
    </div>

    <div className="mb-4">
      <p className="font-bold text-[11px] mb-1">Psychiatric:</p>
      <div className="flex flex-wrap gap-y-1.5 pl-2">
        <CB checked={false} label="Anxiety" blankMode={blankMode} />
        <CB checked={false} label="Depression" blankMode={blankMode} />
        <CB checked={false} label="Sleep disturbance" blankMode={blankMode} />
        <CB checked={false} label="PTSD symptoms" blankMode={blankMode} />
        <CB checked={true} label="None" blankMode={blankMode} />
      </div>
    </div>

    <SectionHeader>5. Physical Examination</SectionHeader>
    <p className="text-[11px] italic text-slate-500 mb-2">Circle all that apply in this section</p>

    <div className="mb-3">
      <p className="font-bold text-[11px] mb-1">Inspection:</p>
      <div className="flex flex-wrap gap-y-1.5 pl-2">
        <CB checked={true} label="No visible trauma" blankMode={blankMode} />
        <CB checked={false} label="Bruising" blankMode={blankMode} />
        <CB checked={false} label="Swelling" blankMode={blankMode} />
        <CB checked={false} label="Surgical scars" blankMode={blankMode} />
        <CB checked={false} label="Postural abnormalities" blankMode={blankMode} />
      </div>
    </div>

    <div className="mb-3 text-[11px]">
      <p className="font-bold mb-1">Palpation:</p>
      <div className="pl-2 space-y-1">
        <div className="flex items-center gap-3">
          <span>Tenderness:</span>
          <CB checked={false} label="Yes" blankMode={blankMode} />
          <CB checked={false} label="No" blankMode={blankMode} />
        </div>
        <div className="flex items-center gap-3">
          <span>Muscle spasm:</span>
          <CB checked={true} label="Yes" blankMode={blankMode} />
          <CB checked={false} label="No" blankMode={blankMode} />
        </div>
      </div>
    </div>

    <div className="mb-3 text-[11px]">
      <p className="font-bold mb-1">ROM (Range of Motion) — Check what is applicable:</p>
      <div className="flex flex-wrap gap-y-1.5 pl-2">
        <CB checked={true} label="Full" blankMode={blankMode} />
        <CB checked={false} label="Limited - Painful" blankMode={blankMode} />
        <CB checked={false} label="Severely restricted" blankMode={blankMode} />
      </div>
    </div>

    <div className="mb-4 text-[11px]">
      <p className="font-bold mb-1">Neurological Exam — Check what is applicable:</p>
      <div className="pl-2 space-y-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold w-16">Motor:</span>
          <CB checked={true} label="Normal" blankMode={blankMode} />
          <span>Weakness in:</span>
          <div className="border-b border-slate-400 flex-1">&nbsp;</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold w-16">Sensory:</span>
          <CB checked={false} label="Intact" blankMode={blankMode} />
          <span>Diminished in:</span>
          <div className="border-b border-slate-400 flex-1">&nbsp;</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold w-16">Reflexes:</span>
          <CB checked={false} label="Normal" blankMode={blankMode} />
          <CB checked={false} label="Hypoactive" blankMode={blankMode} />
          <CB checked={false} label="Hyperactive" blankMode={blankMode} />
        </div>
      </div>
    </div>

    <SectionHeader>6. Assessment &amp; Diagnosis (ICD-10 Codes)</SectionHeader>

    <div className="pl-2 space-y-1.5 text-[11px] mb-3">
      <div className="flex items-center gap-2">
        <CB checked={true} label="Cervical sprain/strain" blankMode={blankMode} />
        <span className="text-slate-500 font-mono">(S13.4)</span>
      </div>
      <div className="flex items-center gap-2">
        <CB checked={true} label="Thoracic sprain/strain" blankMode={blankMode} />
        <span className="text-slate-500 font-mono">(S23.3)</span>
      </div>
      <div className="flex items-center gap-2">
        <CB checked={true} label="Lumbar strain" blankMode={blankMode} />
        <span className="text-slate-500 font-mono">(S33.5)</span>
      </div>
      <div className="flex items-center gap-2">
        <CB checked={false} label="Myofascial pain syndrome" blankMode={blankMode} />
        <span className="text-slate-500 font-mono">(M79.1</span>
        <div className="border-b border-slate-400 w-12">&nbsp;</div>
        <span className="text-slate-500 font-mono">)</span>
      </div>
      <div className="flex items-center gap-2">
        <CB checked={false} label="Radiculopathy" blankMode={blankMode} />
        <span className="text-slate-500 font-mono">(M54.</span>
        <div className="border-b border-slate-400 w-12">&nbsp;</div>
        <span className="text-slate-500 font-mono">)</span>
      </div>
    </div>
  </div>
);

// ─── PAGE 4 ──────────────────────────────────────────────────────────────────
const Page4 = ({ blankMode }) => (
  <div>
    <div className="pl-2 space-y-1.5 text-[11px] mb-4">
      <div className="flex items-center gap-2">
        <CB checked={false} label="Post-traumatic headache" blankMode={blankMode} />
        <span className="text-slate-500 font-mono">(G44.3</span>
        <div className="border-b border-slate-400 w-12">&nbsp;</div>
        <span className="text-slate-500 font-mono">)</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold">Other:</span>
        <div className="border-b border-slate-400 w-20 font-mono">{blankMode ? '' : 'M54.6'}&nbsp;</div>
      </div>
    </div>

    <SectionHeader>7. Plan &amp; Recommendations</SectionHeader>

    <div className="mb-3">
      <p className="font-bold text-[11px] mb-1.5">Diagnostics Ordered — check what is applicable:</p>
      <div className="flex flex-wrap gap-y-1.5 pl-2">
        <CB checked={false} label="X-ray" blankMode={blankMode} />
        <CB checked={false} label="MRI" blankMode={blankMode} />
        <CB checked={false} label="CT" blankMode={blankMode} />
        <CB checked={false} label="EMG/NCS" blankMode={blankMode} />
        <CB checked={true} label="None" blankMode={blankMode} />
      </div>
    </div>

    <div className="mb-3">
      <p className="font-bold text-[11px] mb-1.5">Medications — check what is applicable:</p>
      <div className="flex flex-wrap gap-y-1.5 pl-2">
        <CB checked={false} label="NSAIDs" blankMode={blankMode} />
        <CB checked={false} label="Muscle relaxants" blankMode={blankMode} />
        <CB checked={false} label="Neuropathic agents" blankMode={blankMode} />
        <CB checked={false} label="Pain medications" blankMode={blankMode} />
      </div>
      <div className="flex items-center gap-2 mt-1.5 text-[11px] pl-2">
        <span className="font-bold">Other:</span>
        <div className="border-b border-slate-400 flex-1">&nbsp;</div>
      </div>
    </div>

    <div className="mb-3">
      <p className="font-bold text-[11px] mb-1.5">Interventions — check all that is applicable:</p>
      <div className="flex flex-wrap gap-y-1.5 pl-2">
        <CB checked={false} label="Physical therapy" blankMode={blankMode} />
        <CB checked={false} label="Chiropractic care" blankMode={blankMode} />
        <CB checked={false} label="Trigger point injections" blankMode={blankMode} />
        <CB checked={false} label="Epidural steroid injection" blankMode={blankMode} />
        <CB checked={true} label="Laser therapy" blankMode={blankMode} />
        <CB checked={true} label="Shockwave therapy" blankMode={blankMode} />
        <CB checked={false} label="Pain management follow-up" blankMode={blankMode} />
      </div>
      <div className="flex items-center gap-2 mt-1.5 text-[11px] pl-2">
        <span className="font-bold">Specialist referral:</span>
        <div className="border-b border-slate-400 flex-1">&nbsp;</div>
      </div>
    </div>

    <div className="mb-3 text-[11px]">
      <p className="font-bold mb-1.5">Restrictions:</p>
      <div className="flex flex-wrap gap-y-1.5 pl-2">
        <CB checked={false} label="No lifting &gt;10 lbs" blankMode={blankMode} />
        <CB checked={false} label="Limited bending/twisting" blankMode={blankMode} />
        <CB checked={false} label="Gradual return to normal activity" blankMode={blankMode} />
      </div>
      <div className="flex items-center gap-2 mt-1.5 pl-2">
        <CB checked={false} label="Off work/school until:" blankMode={blankMode} />
        <div className="border-b border-slate-400 w-28">&nbsp;</div>
      </div>
    </div>

    <div className="mb-6 text-[11px]">
      <p className="font-bold mb-1.5">Follow-Up:</p>
      <div className="flex flex-wrap gap-y-1.5 pl-2">
        <CB checked={false} label="1 week" blankMode={blankMode} />
        <CB checked={false} label="2 weeks" blankMode={blankMode} />
        <CB checked={true} label="PRN (as needed)" blankMode={blankMode} />
      </div>
      <div className="flex items-center gap-2 mt-1.5 pl-2">
        <span className="font-bold">Referred to:</span>
        <div className="border-b border-slate-400 flex-1">&nbsp;</div>
      </div>
    </div>

    {/* Signature Block */}
    <div className="border-t-2 border-slate-700 pt-5 mt-4">
      <div className="grid grid-cols-2 gap-8 text-[11px] font-mono">
        <div>
          <div className="border-b border-slate-500 pb-1 mb-1 min-h-[28px] font-bold">{blankMode ? '' : 'ADEOYE SEGUN'}&nbsp;</div>
          <p className="text-slate-600 text-[10px]">Provider Name / Signature</p>
        </div>
        <div>
          <div className="border-b border-slate-500 pb-1 mb-1 min-h-[28px]">{blankMode ? '' : '12 / 30 / 2025'}&nbsp;</div>
          <p className="text-slate-600 text-[10px]">Date</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-[10px] text-slate-500">JOSMIC Wellness Center — 10101 Harwin Dr, Ste 774, Houston TX 77036 | Office: 713-485-5712 | Fax: 713-485-0208</p>
      </div>
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export const JosmicPainManagementReport = ({ reportPage = 1, blankMode = false }) => {
  const pageComponents = { 1: Page1, 2: Page2, 3: Page3, 4: Page4 };
  const PageContent = pageComponents[reportPage] || Page1;

  return (
    <div className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300" style={{ width: '850px', minHeight: '1100px', padding: '40px 56px', paddingBottom: '60px' }}>
      <PageHeader page={reportPage} />
      <PatientInfoBar blankMode={blankMode} />
      <PageContent blankMode={blankMode} />

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 px-14 flex justify-between text-[9px] text-slate-400 font-mono border-t border-slate-100 pt-2">
        <span>JOSMIC Wellness Center — Pain Management Consultation &amp; Evaluation Report — Confidential</span>
        <span>Page {reportPage + 3} of 7</span>
      </div>
    </div>
  );
};
