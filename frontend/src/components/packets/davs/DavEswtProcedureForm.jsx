// src/components/packets/davs/DavEswtProcedureForm.jsx
import React, { useState } from 'react';

/**
 * DAV'S ESWT Procedure Form (Radial Device) — Sample PDF Pages 7, 8, 9
 */
export const DavEswtProcedureForm = ({ dos = '01/22/2026', readOnly = false, blankMode = false, packetData = null }) => {
  const [nerveBlock, setNerveBlock] = useState('NO');
  const [bltCream, setBltCream] = useState('YES');

  return (
    <div
      className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300 p-8 space-y-4 print:border-none print:shadow-none"
      style={{ width: '850px', height: '1100px', breakAfter: 'page', pageBreakAfter: 'always' }}
    >
      
      {/* Provider Heading & Title */}
      <div className="text-center pb-2">
        <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight">DAV'S ANATOMY</h1>
        <h2 className="text-sm font-bold uppercase mt-1 text-slate-800 tracking-wider">ESWT PROCEDURE FORM (RADIAL DEVICE)</h2>
      </div>

      {/* Demographics Row */}
      <div className="grid grid-cols-4 gap-2 text-xs font-mono border-b border-slate-300 pb-2">
        <div><span>Name:</span> <strong className="text-slate-900 border-b border-slate-400 px-1">{blankMode || !packetData ? 'SAMPLE TESTING' : packetData.patientName}</strong></div>
        <div><span>DOB:</span> <strong className="text-slate-900 border-b border-slate-400 px-1">{blankMode || !packetData ? '10/08/1974' : (packetData.patient?.dob || 'N/A')}</strong></div>
        <div><span>SEX:</span> <strong className="text-slate-900 border-b border-slate-400 px-1">{blankMode || !packetData ? 'M' : (packetData.patient?.sex || 'M')}</strong></div>
        <div><span>DATE:</span> <strong className="text-slate-900 border-b border-slate-400 px-1">{blankMode || !packetData ? dos : (packetData.accidentDate || dos)}</strong></div>
      </div>

      {/* Intro Consent & Vitals */}
      <div className="space-y-2 text-xs font-serif">
        <p className="text-slate-800 italic">
          Intro: Patient presents for extracorporeal shockwave treatment. The patient has been advised of the risks and the benefits of the procedure and has signed consent.
        </p>

        <div className="flex justify-between items-center text-xs py-1 border-b border-slate-300">
          <div><strong>ALLERGIES:</strong> <span className="underline ml-1">NONE</span></div>
          <div><strong>BP:</strong> <span className="underline ml-1">120/80 mmHg</span></div>
          <div><strong>HR:</strong> <span className="underline ml-1">100 bpm</span></div>
          <div><strong>PT Hx:</strong> <span className="underline ml-1">Motor vehicle collision on {blankMode || !packetData ? '12/27/2025' : (packetData.accidentDate || '12/27/2025')}</span></div>
        </div>

        {/* ── 3-COLUMN FINDINGS & ANATOMICAL BODY DIAGRAM (Exact match to sample PDF) ── */}
        <div className="border-2 border-slate-800 rounded-lg overflow-hidden grid grid-cols-12 text-xs">
          
          {/* Column 1: Human Body Anatomical Diagram */}
          <div className="col-span-5 border-r-2 border-slate-800 p-2 bg-slate-50 flex flex-col items-center justify-between">
            <div className="w-full text-left font-bold text-[11px] uppercase tracking-wider text-slate-900">
              FINDINGS:
            </div>
            
            {/* SVG Anatomical Human Body (Front & Back) */}
            <div className="my-1 flex items-center justify-center gap-4 py-2">
              {/* Front Figure */}
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 100 220" className="w-20 h-44 stroke-slate-800 stroke-2 fill-none">
                  <circle cx="50" cy="18" r="12" />
                  <circle cx="46" cy="17" r="1.5" className="fill-slate-800" />
                  <circle cx="54" cy="17" r="1.5" className="fill-slate-800" />
                  <line x1="46" y1="30" x2="46" y2="38" />
                  <line x1="54" y1="30" x2="54" y2="38" />
                  <path d="M 46 38 Q 20 44 14 75 L 10 120 Q 12 126 18 122 L 24 82 L 30 115 L 30 135 L 70 135 L 70 115 L 76 82 L 82 122 Q 88 126 90 120 L 86 75 Q 80 44 54 38 Z" />
                  <path d="M 36 60 Q 50 66 64 60" className="stroke-1 stroke-slate-400" />
                  <path d="M 40 85 Q 50 90 60 85" className="stroke-1 stroke-slate-400" />
                  <path d="M 32 135 L 30 190 Q 28 205 24 212 L 42 212 L 46 190 L 50 145 L 54 190 L 58 212 L 76 212 Q 72 205 70 190 L 68 135 Z" />
                  {/* Treatment Marker */}
                  <circle cx="70" cy="205" r="4" className="fill-emerald-500/60 stroke-emerald-700 stroke-1" />
                </svg>
                <span className="text-[9px] font-bold text-slate-500 mt-1">Right (Front)</span>
              </div>

              {/* Back Figure */}
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 100 220" className="w-20 h-44 stroke-slate-800 stroke-2 fill-none">
                  <circle cx="50" cy="18" r="12" />
                  <line x1="46" y1="30" x2="46" y2="38" />
                  <line x1="54" y1="30" x2="54" y2="38" />
                  <line x1="50" y1="38" x2="50" y2="125" className="stroke-1 stroke-slate-400 stroke-dasharray-2" />
                  <path d="M 32 48 Q 40 54 42 68" className="stroke-1 stroke-slate-400" />
                  <path d="M 68 48 Q 60 54 58 68" className="stroke-1 stroke-slate-400" />
                  <path d="M 46 38 Q 20 44 14 75 L 10 120 Q 12 126 18 122 L 24 82 L 30 115 L 30 135 L 70 135 L 70 115 L 76 82 L 82 122 Q 88 126 90 120 L 86 75 Q 80 44 54 38 Z" />
                  <path d="M 30 135 Q 50 148 70 135" className="stroke-1 stroke-slate-400" />
                  <path d="M 32 135 L 30 190 Q 28 205 24 212 L 42 212 L 46 190 L 50 145 L 54 190 L 58 212 L 76 212 Q 72 205 70 190 L 68 135 Z" />
                  {/* Low back & Neck Markers */}
                  <circle cx="50" cy="42" r="4" className="fill-emerald-500/60 stroke-emerald-700 stroke-1" />
                  <circle cx="50" cy="98" r="4" className="fill-emerald-500/60 stroke-emerald-700 stroke-1" />
                </svg>
                <span className="text-[9px] font-bold text-slate-500 mt-1">Left (Back)</span>
              </div>
            </div>

            <div className="flex justify-between w-full text-[9px] text-slate-400 font-mono">
              <span>Right</span>
              <span>Left</span>
              <span>Right</span>
            </div>
          </div>

          {/* Column 2: Parameters & Settings */}
          <div className="col-span-4 border-r-2 border-slate-800 p-3 space-y-2 bg-white">
            <div>
              <span className="font-bold block text-slate-900">Nerve Block Injections:</span>
              <span className="font-semibold text-slate-700">YES / <strong className="underline">NO</strong></span>
            </div>

            <div>
              <span className="font-bold block text-slate-900">Treatment Area(s):</span>
              <p className="font-semibold text-slate-800 underline">Low back, Neck, Left ankle</p>
            </div>

            <div className="space-y-1 text-xs">
              <div>
                <span className="font-bold text-slate-900">Bar:</span>
                <span className="ml-2 font-mono underline">3.0</span>
              </div>
              <div>
                <span className="font-bold text-slate-900">Hz:</span>
                <span className="ml-2 font-mono underline">10 Hz</span>
              </div>
              <div>
                <span className="font-bold text-slate-900">Dose:</span>
                <span className="ml-2 font-mono underline">1000x3</span>
              </div>
              <div className="pt-1 border-t border-slate-200">
                <span className="font-bold block text-slate-900">Total:</span>
                <span className="font-mono text-sm font-black text-emerald-800 underline">3000</span>
              </div>
              <div className="pt-1 text-[10px]">
                <span className="font-bold block">BLT Cream Applied:</span>
                <span className="font-bold text-emerald-800">YES [✓] / NO [ ]</span>
              </div>
            </div>
          </div>

          {/* Column 3: Check / Circle Observational Findings */}
          <div className="col-span-3 p-3 space-y-2 bg-slate-50">
            <span className="font-bold block text-[10px] uppercase text-slate-700 leading-tight">
              Please check/circle (all that applies)
            </span>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
                <span>NAD</span>
                <span className="font-bold text-emerald-700 font-sans">✓</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
                <span>AAO X3</span>
                <span className="font-bold text-emerald-700 font-sans">✓</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
                <span>Treatment A1</span>
                <span className="font-bold text-emerald-700 font-sans">✓</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
                <span>Treatment A2</span>
                <span className="font-bold text-emerald-700 font-sans">✓</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
                <span>Treatment A3</span>
                <span className="font-bold text-emerald-700 font-sans">✓</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
                <span>Treatment A4</span>
                <span className="text-slate-300">—</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Normal reaction</span>
                <span className="font-bold text-emerald-700 font-sans">✓</span>
              </div>
            </div>
          </div>

        </div>

        {/* Treatment Protocol & Instructions */}
        <div className="border-t border-slate-300 pt-2 space-y-1 text-[10px]">
          <p><strong>Pre-Treatment:</strong> Apply BLT cream to all treatment areas to be treated if needed. Apply liberal amount of ultrasound gel as treating specific areas.</p>
          <p><strong>Treatment:</strong> Place sheath/condom over transmitter tip. Set device to recommended Bar of 2.6 (can go up to 3.6 Bar) or Mj of 90 (Can go up to 150mJ). Set device to recommended Hz of 15. Treat each area with 500 waves.</p>
          <p><strong>Post procedure Instructions:</strong> • No down time following treatment • May expect mild inflammation, redness &amp; swelling for a few days • No Aspirin or NSAIDS for at least 7 days • Tylenol or Acetaminophen may be taken for discomfort • Hydrate very well (at least 64 ounces of water daily).</p>
        </div>

        {/* Signature Box */}
        <div className="pt-4 flex justify-between items-end text-xs font-mono">
          <div>
            <span>Health Care Provider Signature:</span>
            <p className="font-bold text-sm text-slate-900 mt-1 underline">ALEX</p>
          </div>
          <div>
            <span>Date:</span>
            <p className="font-bold text-sm text-slate-900 mt-1">{dos}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
