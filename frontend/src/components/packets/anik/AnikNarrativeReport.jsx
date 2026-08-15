// src/components/packets/anik/AnikNarrativeReport.jsx
import React from 'react';

export const AnikNarrativeReport = ({ reportPage = 1, blankMode = false }) => {
  return (
    <div className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300 p-12 space-y-6" style={{ width: '850px', height: '1100px' }}>
      
      <div className="flex justify-between items-start border-b border-slate-300 pb-4">
        <div>
          <h1 className="text-lg font-black text-teal-800 uppercase italic">ANIK LASER THERAPY</h1>
          <p className="text-[10px] text-slate-600">INITIAL CLINICAL NARRATIVE EVALUATION REPORT</p>
        </div>
        <div className="text-right font-mono text-[10px]">
          <p>PAGE {reportPage} OF 3</p>
          <p>DOS: 01/22/2026</p>
        </div>
      </div>

      <div className="bg-slate-50 p-4 border border-slate-200 text-xs font-mono grid grid-cols-2 gap-2">
        <div>PATIENT: {blankMode ? <span className="border-b border-slate-400 inline-block w-28">&nbsp;</span> : <strong>SAMPLE TESTING</strong>}</div>
        <div>DOB: {blankMode ? <span className="border-b border-slate-400 inline-block w-28">&nbsp;</span> : <strong>10/08/1974 (42 Y/O MALE)</strong>}</div>
        <div>DATE OF ACCIDENT: {blankMode ? <span className="border-b border-slate-400 inline-block w-24">&nbsp;</span> : <strong>12/27/2025</strong>}</div>
        <div>DIAGNOSIS: {blankMode ? <span className="border-b border-slate-400 inline-block w-32">&nbsp;</span> : <strong>M54.50, M54.2, M25.572</strong>}</div>
      </div>

      {reportPage === 1 && (
        <div className="space-y-4 text-xs leading-relaxed text-slate-800">
          <h2 className="font-bold border-b border-slate-200 pb-1 text-slate-900">1. CHIEF COMPLAINTS & HISTORY OF PRESENT ILLNESS</h2>
          <p>
            Patient presents for initial evaluation following a motor vehicle collision on 12/27/2025. Patient reports severe cervicalgia rating 8/10 on the VAS scale, radiating down the paraspinal muscles into the upper thoracic region. Patient also reports lower back pain with stiffness and sharp lateral left ankle pain aggravated by weight-bearing.
          </p>
          <h2 className="font-bold border-b border-slate-200 pb-1 text-slate-900 pt-2">2. PHYSICAL & NEUROLOGICAL EXAMINATION</h2>
          <p>
            Palpation reveals grade II trigger points in the bilateral trapezius, levator scapulae, and lumbar erector spinae musculature. Cervical range of motion is restricted by 45% in flexion and 50% in bilateral rotation. Lumbar flexion is restricted by 40%.
          </p>
        </div>
      )}

      {reportPage === 2 && (
        <div className="space-y-4 text-xs leading-relaxed text-slate-800">
          <h2 className="font-bold border-b border-slate-200 pb-1 text-slate-900">3. DIAGNOSTIC ASSESSMENT & CLINICAL IMPRESSION</h2>
          <p>
            1. Acute traumatic cervical sprain/strain (ICD-10 M54.2)<br/>
            2. Low back pain with lumbar radicular irritation (ICD-10 M54.50)<br/>
            3. Left ankle ligamentous strain & swelling (ICD-10 M25.572)
          </p>
          <h2 className="font-bold border-b border-slate-200 pb-1 text-slate-900 pt-2">4. PLAN OF CARE & TREATMENT RECOMMENDATIONS</h2>
          <p>
            Patient is prescribed a course of High-Intensity Laser Therapy (HILT - CPT 97039) 3 sessions per week to stimulate cellular photobiomodulation, reduce inflammatory edema, and accelerate tissue repair. Adjunctive massage therapy (CPT 97124) and protective eye wear (CPT 10001) are integrated.
          </p>
        </div>
      )}

      {reportPage === 3 && (
        <div className="space-y-4 text-xs leading-relaxed text-slate-800 flex flex-col justify-between h-[750px]">
          <div>
            <h2 className="font-bold border-b border-slate-200 pb-1 text-slate-900">5. PROGNOSIS & DISABILITY STATUS</h2>
            <p>
              Prognosis is guarded pending completion of the prescribed laser therapy regimen. Patient is advised to refrain from heavy lifting (&gt;15 lbs) and prolonged sitting without lumbar support.
            </p>
          </div>
          <div className="border-t border-slate-300 pt-4 font-mono text-xs">
            <p className="font-bold text-slate-900">EVALUATING CLINICIAN:</p>
            <p className="mt-4 font-bold text-slate-900 underline">Adeoye, Segun, DC / HILT Specialist</p>
            <p className="text-[10px] text-slate-500">ANIK Laser Therapy Center — License #R7637</p>
          </div>
        </div>
      )}

    </div>
  );
};
