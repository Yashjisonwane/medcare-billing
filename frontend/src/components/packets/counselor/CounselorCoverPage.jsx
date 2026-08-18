// src/components/packets/counselor/CounselorCoverPage.jsx
import React from 'react';

export const CounselorCoverPage = ({ blankMode = false, packetData = null }) => {
  const val = (v) => blankMode ? '' : v;

  return (
    <div className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300" style={{ width: '850px', minHeight: '1100px', padding: '48px 56px' }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-800 pb-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-700 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 80 80" className="w-12 h-12 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="38" fill="#4338ca" />
              <path d="M40 20C30 20 22 28 22 38C22 45 26 51 32 54V62H48V54C54 51 58 45 58 38C58 28 50 20 40 20Z" fill="white" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase text-indigo-900 tracking-tight" style={{ fontFamily: 'serif' }}>HOPE BEHAVIORAL HEALTH &amp; COUNSELING</h1>
            <p className="text-[11px] font-bold text-slate-600">10101 HARWIN DR. STE 774-C HOUSTON TX 77036</p>
            <p className="text-[11px] text-slate-600">OFFICE: 713-555-0188 &nbsp;|&nbsp; FAX: 832-555-0199</p>
          </div>
        </div>
      </div>

      {/* Patient Information Block */}
      <div className="bg-slate-100 border border-slate-300 p-5 mb-6 space-y-3">
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">NAME:</span>
            <div className="flex-1 border-b border-slate-400 pb-0.5 min-w-[120px] text-slate-900">{packetData ? packetData.patientName : val('')}&nbsp;</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">Date of Birth:</span>
            <div className="flex-1 border-b border-slate-400 pb-0.5 min-w-[100px] text-slate-900">{packetData ? (packetData.patient?.dob || 'N/A') : val('')}&nbsp;</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">Date of Accident:</span>
            <div className="flex-1 border-b border-slate-400 pb-0.5 text-slate-900">{packetData ? (packetData.accidentDate || 'N/A') : val('')}&nbsp;</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">Initial Evaluation:</span>
            <div className="flex-1 border-b border-slate-400 pb-0.5 text-slate-900">{packetData ? (packetData.initialDate || 'N/A') : val('')}&nbsp;</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">Diagnostic Codes:</span>
            <div className="flex-1 border-b border-slate-400 pb-0.5 text-slate-900 font-bold">{packetData ? (packetData.diagnosisCodes?.join(', ') || 'N/A') : val('')}&nbsp;</div>
          </div>
        </div>
      </div>

      {/* Packet Document Index */}
      <div className="border border-slate-300 p-5 mb-8">
        <h2 className="text-sm font-black uppercase text-indigo-900 border-b border-slate-300 pb-2 mb-3">COUNSELING CLINICAL PACKET CONTENTS</h2>
        <ul className="space-y-2 text-xs font-mono">
          <li className="flex justify-between items-center py-1 border-b border-slate-200">
            <span>1. COVER PAGE / PATIENT SUMMARY</span>
            <span className="text-slate-500 font-bold">PAGE 1</span>
          </li>
          <li className="flex justify-between items-center py-1 border-b border-slate-200">
            <span>2. BEHAVIORAL HEALTH INTAKE &amp; PSYCHOTHERAPY ASSESSMENT</span>
            <span className="text-slate-500 font-bold">PAGE 2</span>
          </li>
          <li className="flex justify-between items-center py-1 border-b border-slate-200">
            <span>3. ITEMIZED COUNSELOR BILLING STATEMENT (#1024-C)</span>
            <span className="text-slate-500 font-bold">PAGE 3</span>
          </li>
          <li className="flex justify-between items-center py-1">
            <span>4. CMS-1500 HCFA PROFESSIONAL CLAIM FORM</span>
            <span className="text-slate-500 font-bold">PAGE 4</span>
          </li>
        </ul>
      </div>

      {/* Attestation */}
      <div className="mt-12 pt-6 border-t-2 border-slate-800 flex justify-between items-end text-xs font-mono">
        <div>
          <p className="font-bold">JORDAN MILLER, LCSW, BCD</p>
          <p className="text-slate-600">Licensed Clinical Social Worker</p>
          <p className="text-slate-600">NPI: 1487965213 | State Lic # 58921</p>
        </div>
        <div className="text-right">
          <p className="border-b border-slate-400 w-48 mb-1 pb-1 font-cursive italic text-indigo-900 font-bold">Jordan Miller, LCSW</p>
          <p className="text-slate-500 text-[10px]">AUTHORIZED SIGNATURE</p>
        </div>
      </div>
    </div>
  );
};
