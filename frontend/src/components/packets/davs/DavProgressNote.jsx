// src/components/packets/davs/DavProgressNote.jsx
import React from 'react';

export const DavProgressNote = ({ notePage = 1, blankMode = false, packetData = null }) => {
  return (
    <div className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300 p-12 space-y-6" style={{ width: '850px', height: '1100px' }}>
      <div className="flex justify-between items-start border-b border-slate-300 pb-4">
        <div>
          <h1 className="text-lg font-black text-teal-800 uppercase italic">DAV'S ANATOMY</h1>
          <p className="text-[10px] text-slate-600">CLINICAL PROGRESS EVALUATION NOTE</p>
        </div>
        <div className="text-right font-mono text-[10px]">
          <p>PAGE {notePage} OF 2</p>
          <p>DOS: 01/07/2026</p>
        </div>
      </div>

      <div className="bg-slate-50 p-4 border border-slate-200 text-xs font-mono grid grid-cols-2 gap-2">
        <div>PATIENT: {blankMode || !packetData ? <span className="border-b border-slate-400 inline-block w-28">&nbsp;</span> : <strong>{packetData.patientName}</strong>}</div>
        <div>PROGRESS STATUS: {blankMode ? <span className="border-b border-slate-400 inline-block w-32">&nbsp;</span> : <strong>MODERATE IMPROVEMENT</strong>}</div>
      </div>

      <div className="space-y-4 text-xs leading-relaxed text-slate-800">
        <h2 className="font-bold border-b border-slate-200 pb-1 text-slate-900">SUBJECTIVE PROGRESS & COMPLAINTS</h2>
        <p>
          Patient returns for scheduled ESWT shockwave treatment session #2. Patient reports decreased sharp lumbar spasm following session #1. VAS pain score reported at 5/10 today compared to 8/10 initially.
        </p>

        <h2 className="font-bold border-b border-slate-200 pb-1 text-slate-900 pt-2">OBJECTIVE CLINICAL EVALUATION</h2>
        <p>
          Myofascial hypertonicity in lumbar paraspinals demonstrates palpable reduction. Lumbar active flexion improved to 65 degrees. Palpation over left ankle reveals reduced localized tenderness.
        </p>

        <h2 className="font-bold border-b border-slate-200 pb-1 text-slate-900 pt-2">PLAN & RECOMMENDATIONS</h2>
        <p>
          Continue prescribed ESWT radial pressure wave protocol (CPT 0101T x3), massage therapy (CPT 97124), and scheduled final re-evaluation.
        </p>
      </div>
    </div>
  );
};
