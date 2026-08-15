// src/components/packets/counselor/CounselorAssessmentForm.jsx
import React from 'react';

export const CounselorAssessmentForm = ({ blankMode = false }) => {
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
          <p className="font-bold">DOS: {val('01/05/2026')}</p>
          <p className="text-slate-500">CPT: {val('90791 / 90834')}</p>
        </div>
      </div>

      {/* Patient Demographic Banner */}
      <div className="grid grid-cols-3 gap-2 bg-slate-100 p-3 mb-4 font-mono text-xs border border-slate-300">
        <div>PATIENT: <strong>{val('SAMPLE TESTING')}</strong></div>
        <div>DOB: <strong>{val('10/08/1974')}</strong></div>
        <div>DOA: <strong>{val('12/27/2025')}</strong></div>
      </div>

      {/* Section 1: Diagnoses (ICD-10 / DSM-5) */}
      <div className="mb-4">
        <h2 className="text-xs font-black uppercase bg-indigo-900 text-white px-2.5 py-1 mb-2">
          1. DIAGNOSTIC ASSESSMENT &amp; ICD-10 CODES (BOX 21)
        </h2>
        <div className="border border-slate-300 p-3 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between">
            <span><strong>F43.10</strong> — Post-Traumatic Stress Disorder (PTSD), Unspecified</span>
            <span className="text-emerald-700 font-bold">PRIMARY</span>
          </div>
          <div className="flex justify-between">
            <span><strong>F41.1</strong> — Generalized Anxiety Disorder (Vehicular Phobia)</span>
            <span className="text-slate-600 font-bold">SECONDARY</span>
          </div>
          <div className="flex justify-between">
            <span><strong>M54.50</strong> — Low Back Pain with Somatoform Distress</span>
            <span className="text-slate-600 font-bold">TERTIARY</span>
          </div>
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
            <p className="text-slate-900">{val('Neat, appropriately dressed, ambulatory with mild lumbar guarding.')}</p>
          </div>
          <div>
            <span className="font-bold text-slate-700 block text-[10px]">ORIENTATION:</span>
            <p className="text-slate-900">{val('Alert and oriented x4 (Person, Place, Time, Situation).')}</p>
          </div>
          <div>
            <span className="font-bold text-slate-700 block text-[10px]">MOOD &amp; AFFECT:</span>
            <p className="text-slate-900">{val('Anxious, tearful when discussing motor vehicle collision. Congruent affect.')}</p>
          </div>
          <div>
            <span className="font-bold text-slate-700 block text-[10px]">SPEECH &amp; THOUGHT:</span>
            <p className="text-slate-900">{val('Normal rate, coherent, goal-directed without loose associations.')}</p>
          </div>
          <div className="col-span-2 bg-slate-50 p-2 border border-slate-200">
            <span className="font-bold text-emerald-800 block text-[10px]">SAFETY &amp; SUICIDE RISK SCREEN:</span>
            <p className="text-slate-900 font-semibold">{val('Patient categorically denies suicidal/homicidal ideation, plan, or intent. Safe for outpatient care.')}</p>
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
            {val('Patient is a 51-year-old individual presenting for clinical psychotherapy following a severe motor vehicle collision. Patient reports nightmares, hyperarousal while in automobiles, and heightened panic attacks whenever traffic slows abruptly.')}
          </p>
          <p>
            {val('Therapeutic interventions utilized Cognitive Behavioral Therapy (CBT) protocols, somatic grounding, and progressive diaphragmatic breathing. Patient engaged well with cognitive reframing of catastrophizing thoughts regarding pain chronicity.')}
          </p>
        </div>
      </div>

      {/* Section 4: Treatment Plan & Milestones */}
      <div className="mb-6">
        <h2 className="text-xs font-black uppercase bg-indigo-900 text-white px-2.5 py-1 mb-2">
          4. TREATMENT PLAN &amp; MEASURABLE GOALS
        </h2>
        <div className="border border-slate-300 p-3 text-xs space-y-1.5 font-mono">
          <p>1. {val('Attain 50% reduction in GAD-7 anxiety scores over a 6-week treatment cycle.')}</p>
          <p>2. {val('Establish daily compliance with relaxation breathing and symptom log.')}</p>
          <p>3. {val('Gradual desensitization to passenger vehicular transit without panic response.')}</p>
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
