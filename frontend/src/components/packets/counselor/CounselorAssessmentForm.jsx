// src/components/packets/counselor/CounselorAssessmentForm.jsx
import React from 'react';

export const CounselorAssessmentForm = ({ blankMode = false, packetData = null }) => {
  const val = (v) => blankMode ? '' : v;

  return (
    <div className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300" style={{ width: '850px', minHeight: '1100px', padding: '48px 56px' }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-5">
        <div>
          <h1 className="text-xl font-black uppercase text-indigo-900 tracking-tight" style={{ fontFamily: 'serif' }}>
            BEHAVIORAL HEALTH INTAKE &amp; CLINICAL EVALUATION
          </h1>
          <p className="text-[10px] font-bold text-slate-600">HOPE BEHAVIORAL HEALTH &amp; COUNSELING | 10101 HARWIN DR. STE 774-C HOUSTON TX 77036</p>
        </div>
        <div className="text-right font-mono text-[10px]">
          <p className="font-bold">DOS: {packetData ? (packetData.initialDate || 'N/A') : val('')}</p>
          <p className="text-slate-500">CPT: {packetData ? '90791 / 90834' : val('')}</p>
        </div>
      </div>

      {/* Patient Demographic Banner */}
      <div className="grid grid-cols-3 gap-2 bg-slate-100 p-3 mb-4 font-mono text-xs border border-slate-300">
        <div>PATIENT: <strong>{blankMode || !packetData ? val('') : packetData.patientName}</strong></div>
        <div>DOB: <strong>{packetData ? (packetData.patient?.dob || 'N/A') : val('')}</strong></div>
        <div>DOA: <strong>{packetData ? (packetData.accidentDate || 'N/A') : val('')}</strong></div>
      </div>

      {/* Section 1: Diagnoses (ICD-10 / DSM-5) */}
      <div className="mb-4">
        <h2 className="text-xs font-black uppercase bg-indigo-900 text-white px-2.5 py-1 mb-2">
          1. DIAGNOSTIC ASSESSMENT &amp; ICD-10 CODES (BOX 21)
        </h2>
        <div className="border border-slate-300 p-3 space-y-1.5 font-mono text-xs">
          {packetData ? (
            packetData.diagnosisCodes?.map((code, index) => (
              <div key={index} className="flex justify-between">
                <span><strong>{code}</strong> — Diagnosed condition</span>
                <span className="font-bold text-slate-600">{index === 0 ? 'PRIMARY' : `CODE ${index + 1}`}</span>
              </div>
            )) || <div className="text-slate-500">No diagnosis codes provided</div>
          ) : (
            val('')
          )}
        </div>
      </div>

      {/* Section 2: Mental Status Examination */}
      <div className="mb-4">
        <h2 className="text-xs font-black uppercase bg-indigo-900 text-white px-2.5 py-1 mb-2">
          2. MENTAL STATUS EXAMINATION (MSE)
        </h2>
        <div className="border border-slate-300 p-3 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-700 block text-[10px]">APPEARANCE:</span>
            <p className="text-slate-900">{packetData ? 'Neat, appropriately dressed, ambulatory with mild lumbar guarding.' : val('')}</p>
          </div>
          <div>
            <span className="font-bold text-slate-700 block text-[10px]">ORIENTATION:</span>
            <p className="text-slate-900">{packetData ? 'Alert and oriented x4 (Person, Place, Time, Situation).' : val('')}</p>
          </div>
          <div>
            <span className="font-bold text-slate-700 block text-[10px]">MOOD &amp; AFFECT:</span>
            <p className="text-slate-900">{packetData ? 'Anxious, tearful when discussing motor vehicle collision. Congruent affect.' : val('')}</p>
          </div>
          <div>
            <span className="font-bold text-slate-700 block text-[10px]">SPEECH &amp; THOUGHT:</span>
            <p className="text-slate-900">{packetData ? 'Normal rate, coherent, goal-directed without loose associations.' : val('')}</p>
          </div>
          <div className="col-span-2 bg-slate-50 p-2 border border-slate-200">
            <span className="font-bold text-emerald-800 block text-[10px]">SAFETY &amp; SUICIDE RISK SCREEN:</span>
            <p className="text-slate-900 font-semibold">{packetData ? 'Patient categorically denies suicidal/homicidal ideation, plan, or intent. Safe for outpatient care.' : val('')}</p>
          </div>
        </div>
      </div>

      {/* Section 3: Clinical Session Observations & Interventions */}
      <div className="mb-4">
        <h2 className="text-xs font-black uppercase bg-indigo-900 text-white px-2.5 py-1 mb-2">
          3. CLINICAL SESSION OBSERVATIONS &amp; CBT INTERVENTIONS
        </h2>
        <div className="border border-slate-300 p-3 text-xs leading-relaxed space-y-2">
          <p>
            {packetData ? `Patient is a ${packetData.patient?.dob ? 'patient' : 'patient'} presenting for clinical psychotherapy following a severe ${packetData.accidentType ? packetData.accidentType.replace('_', ' ').toLowerCase() : 'accident'}. Patient reports nightmares, hyperarousal while in automobiles, and heightened panic attacks whenever traffic slows abruptly.` : val('')}
          </p>
          <p>
            {packetData ? 'Therapeutic interventions utilized Cognitive Behavioral Therapy (CBT) protocols, somatic grounding, and progressive diaphragmatic breathing. Patient engaged well with cognitive reframing of catastrophizing thoughts regarding pain chronicity.' : val('')}
          </p>
        </div>
      </div>

      {/* Section 4: Treatment Plan & Milestones */}
      <div className="mb-6">
        <h2 className="text-xs font-black uppercase bg-indigo-900 text-white px-2.5 py-1 mb-2">
          4. TREATMENT PLAN &amp; MEASURABLE GOALS
        </h2>
        <div className="border border-slate-300 p-3 text-xs space-y-1.5 font-mono">
          <p>{packetData ? '1. Attain 50% reduction in GAD-7 anxiety scores over a 6-week treatment cycle.' : val('')}</p>
          <p>{packetData ? '2. Establish daily compliance with relaxation breathing and symptom log.' : val('')}</p>
          <p>{packetData ? '3. Gradual desensitization to passenger vehicular transit without panic response.' : val('')}</p>
        </div>
      </div>

      {/* Signature */}
      <div className="pt-4 border-t-2 border-slate-800 flex justify-between items-end text-xs font-mono">
        <div>
          <p className="font-bold">JORDAN MILLER, LCSW, BCD</p>
          <p className="text-slate-600">Licensed Clinical Social Worker</p>
          <p className="text-slate-600">License: #58921 | NPI: 1487965213</p>
        </div>
        <div className="text-right">
          <p className="font-cursive italic text-indigo-900 font-bold border-b border-slate-400 pb-1 w-48">Jordan Miller, LCSW</p>
          <p className="text-slate-500 text-[10px]">ELECTRONICALLY SIGNED &amp; VERIFIED</p>
        </div>
      </div>
    </div>
  );
};
