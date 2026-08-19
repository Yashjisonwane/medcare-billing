// src/components/packets/anik/AnikFinalReport.jsx
import React from 'react';

export const AnikFinalReport = ({ reportPage = 1, blankMode = false, packetData = null }) => {
  return (
    <div className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300 p-12 space-y-6" style={{ width: '850px', height: '1100px' }}>
      
      <div className="flex justify-between items-start border-b border-slate-300 pb-4">
        <div>
          <h1 className="text-lg font-black text-teal-800 uppercase italic">ANIK LASER THERAPY</h1>
          <p className="text-[10px] text-slate-600">FINAL MEDICAL & THERAPY DISCHARGE REPORT</p>
        </div>
        <div className="text-right font-mono text-[10px]">
          <p>PAGE {reportPage} OF 3</p>
          <p>DISCHARGE DOS: 01/26/2026</p>
        </div>
      </div>

      <div className="bg-slate-50 p-4 border border-slate-200 text-xs font-mono grid grid-cols-2 gap-2">
        <div>PATIENT: {blankMode || !packetData ? <span className="border-b border-slate-400 inline-block w-28">&nbsp;</span> : <strong>{packetData.patientName}</strong>}</div>
        <div>DISCHARGE DATE: {blankMode ? <span className="border-b border-slate-400 inline-block w-24">&nbsp;</span> : <strong>01/26/2026</strong>}</div>
        <div>TOTAL SESSIONS COMPLETED: {blankMode ? <span className="border-b border-slate-400 inline-block w-32">&nbsp;</span> : <strong>3 HILT SESSIONS ($18,920 TOTAL)</strong>}</div>
        <div>OUTCOME: {blankMode ? <span className="border-b border-slate-400 inline-block w-40">&nbsp;</span> : <strong>DISCHARGED WITH MAXIMUM MEDICAL IMPROVEMENT (MMI)</strong>}</div>
      </div>

      {reportPage === 1 && (
        <div className="space-y-4 text-xs leading-relaxed text-slate-800">
          <h2 className="font-bold border-b border-slate-200 pb-1 text-slate-900">1. SUMMARY OF TREATMENT COMPLETED</h2>
          <p>
            Patient has successfully completed 3 targeted sessions of High-Intensity Laser Therapy (CPT 97039), adjunctive massage therapy (CPT 97124), and clinical re-evaluations between 01/22/2026 and 01/26/2026.
          </p>
          <h2 className="font-bold border-b border-slate-200 pb-1 text-slate-900 pt-2">2. OBJECTIVE RE-EXAMINATION FINDINGS</h2>
          <p>
            Cervical ROM has improved to near-normal limits with mild end-range tightness. Lumbar tenderness decreased from 8/10 to 2/10 on the VAS pain scale. Left ankle swelling fully resolved.
          </p>
        </div>
      )}

      {reportPage === 2 && (
        <div className="space-y-4 text-xs leading-relaxed text-slate-800">
          <h2 className="font-bold border-b border-slate-200 pb-1 text-slate-900">3. DISCHARGE IMPRESSION & PERMANENT IMPAIRMENT</h2>
          <p>
            Patient is discharged having attained Maximum Medical Improvement (MMI). No permanent structural neurological deficit noted, though intermittent weather-related soreness may persist.
          </p>
          <h2 className="font-bold border-b border-slate-200 pb-1 text-slate-900 pt-2">4. HOME EXERCISE PROGRAM & FUTURE CARE</h2>
          <p>
            Patient instructed on daily cervical retraction stretches, hamstring stretches, and ergonomic lumbar support while working. Patient advised to return on an as-needed basis for flare-ups.
          </p>
        </div>
      )}

      {reportPage === 3 && (
        <div className="space-y-4 text-xs leading-relaxed text-slate-800 flex flex-col justify-between h-[750px]">
          <div>
            <h2 className="font-bold border-b border-slate-200 pb-1 text-slate-900">5. FINAL BILLING & CLINICAL SIGN-OFF</h2>
            <p>
              All clinical records and billing statements for ANIK Laser Therapy are finalized and verified complete for legal settlement and carrier submission.
            </p>
          </div>
          <div className="border-t border-slate-300 pt-4 font-mono text-xs">
            <p className="font-bold text-slate-900">DISCHARGING PHYSICIAN:</p>
            <p className="mt-4 font-bold text-slate-900 underline">Adeoye, Segun, DC</p>
            <p className="text-[10px] text-slate-500">ANIK Laser Therapy Center â€” Date Signed: 04/13/2026</p>
          </div>
        </div>
      )}

    </div>
  );
};
