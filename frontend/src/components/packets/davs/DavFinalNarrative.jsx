// src/components/packets/davs/DavFinalNarrative.jsx
import React from 'react';

export const DavFinalNarrative = ({ reportPage = 1, blankMode = false, packetData = null }) => {
  return (
    <div className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300 p-12 space-y-6" style={{ width: '850px', height: '1100px' }}>
      <div className="flex justify-between items-start border-b border-slate-300 pb-4">
        <div>
          <h1 className="text-lg font-black text-teal-800 uppercase italic">DAV'S ANATOMY</h1>
          <p className="text-[10px] text-slate-600">SHOCKWAVE THERAPY NARRATIVE DISCHARGE REPORT</p>
        </div>
        <div className="text-right font-mono text-[10px]">
          <p>PAGE {reportPage} OF 3</p>
          <p>DISCHARGE DOS: 01/08/2026</p>
        </div>
      </div>

      <div className="bg-slate-50 p-4 border border-slate-200 text-xs font-mono grid grid-cols-2 gap-2">
        <div>PATIENT: <strong>{blankMode || !packetData ? 'SAMPLE TESTING' : packetData.patientName}</strong></div>
        <div>TOTAL ESWT SESSIONS: <strong>3 COMPLETED ($9,870 TOTAL)</strong></div>
      </div>

      <div className="space-y-4 text-xs leading-relaxed text-slate-800 flex flex-col justify-between h-[750px]">
        <div>
          <h2 className="font-bold border-b border-slate-200 pb-1 text-slate-900">DISCHARGE SUMMARY & OUTCOMES</h2>
          <p>
            Patient completed all 3 high-energy ESWT shockwave therapy sessions between 01/06/2026 and 01/08/2026. Significant functional restoration achieved with VAS pain reduction to 1/10.
          </p>
        </div>

        <div className="border-t border-slate-300 pt-4 font-mono text-xs">
          <p className="font-bold text-slate-900">DISCHARGING PHYSICIAN SIGNATURE:</p>
          <p className="mt-4 font-bold text-slate-900 underline">Adeoye, Segun, DC</p>
          <p className="text-[10px] text-slate-500">DAV'S Anatomy Center â€” Date Signed: 04/13/2026</p>
        </div>
      </div>
    </div>
  );
};
