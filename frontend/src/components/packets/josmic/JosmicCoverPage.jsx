// src/components/packets/josmic/JosmicCoverPage.jsx
import React from 'react';

export const JosmicCoverPage = ({ blankMode = false, packetData = null }) => {
  const val = (v) => blankMode ? '' : v;

  return (
    <div className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300" style={{ width: '850px', minHeight: '1100px', padding: '48px 56px' }}>

      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-800 pb-5 mb-6">
        <div className="flex items-center gap-4">
          {/* Logo circle */}
          <div className="w-16 h-16 rounded-full bg-teal-700 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 80 80" className="w-12 h-12 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="38" fill="#0d9488" />
              {/* Body silhouette */}
              <ellipse cx="40" cy="22" rx="8" ry="9" fill="white" />
              <rect x="30" y="32" width="20" height="24" rx="4" fill="white" />
              <rect x="24" y="33" width="8" height="18" rx="3" fill="white" />
              <rect x="48" y="33" width="8" height="18" rx="3" fill="white" />
              <rect x="31" y="56" width="8" height="16" rx="3" fill="white" />
              <rect x="41" y="56" width="8" height="16" rx="3" fill="white" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase text-teal-800 tracking-tight" style={{ fontFamily: 'serif' }}>JOSMIC WELLNESS CENTER</h1>
            <p className="text-[11px] font-bold text-slate-600">10101 HARWIN DR. STE 274 HOUSTON TX 77036</p>
            <p className="text-[11px] text-slate-600">OFFICE: 713-485-5712 &nbsp;|&nbsp; FAX: 832-416-1502</p>
          </div>
        </div>
      </div>

      {/* Patient Information Block */}
      <div className="bg-slate-100 border border-slate-300 p-5 mb-6 space-y-3">
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">NAME:</span>
            <div className="flex-1 border-b border-slate-400 pb-0.5 min-w-[120px] text-slate-900">{packetData ? packetData.patientName : val('SAMPLE TESTING')}&nbsp;</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">Date of Birth:</span>
            <div className="flex-1 border-b border-slate-400 pb-0.5 min-w-[100px] text-slate-900">{packetData ? (packetData.patient?.dob || 'N/A') : val('10/08/1974')}&nbsp;</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">Date of Accident:</span>
            <div className="flex-1 border-b border-slate-400 pb-0.5 text-slate-900">{packetData ? (packetData.accidentDate || 'N/A') : val('12/27/2025')}&nbsp;</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">Initial Date:</span>
            <div className="flex-1 border-b border-slate-400 pb-0.5 text-slate-900">{packetData ? (packetData.initialDate || 'N/A') : val('12/30/2025')}&nbsp;</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">Discharge Date:</span>
            <div className="flex-1 border-b border-slate-400 pb-0.5 text-slate-900">{packetData ? (packetData.dischargeDate || 'N/A') : val('12/30/2025')}&nbsp;</div>
          </div>
        </div>
      </div>

      {/* Packet Document Index */}
      <div className="border border-slate-300 p-5 mb-6">
        <h3 className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-2 mb-3 text-xs tracking-wide">PACKET DOCUMENT INDEX</h3>
        <ol className="list-decimal pl-4 space-y-1.5 text-slate-700 text-xs font-mono">
          <li>Patient &amp; Accident Cover Sheet</li>
          <li>Billing Statement</li>
          <li>CMS-1500 Claim Form (DOS: {packetData ? (packetData.initialDate || '12/30/2025') : '12/30/2025'})</li>
          <li>Pain Management Evaluation Report (Page 1)</li>
          <li>Pain Management Evaluation Report (Page 2)</li>
          <li>Pain Management Evaluation Report (Page 3)</li>
          <li>Pain Management Evaluation Report (Page 4 - Signatures)</li>
        </ol>
      </div>

      {/* Statement of Accuracy */}
      <div className="border border-slate-300 p-5 mt-auto">
        <p className="text-[11px] text-slate-600 leading-relaxed">
          This clinical packet has been prepared by JOSMIC Wellness Center and includes all relevant billing, claim, and clinical documentation pertaining to the above-referenced patient case. All records are maintained in compliance with applicable federal and state health information regulations.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-8 text-xs font-mono">
          <div>
            <div className="border-b border-slate-400 pb-1 mb-1 min-h-[24px]">&nbsp;</div>
            <p className="text-slate-600">Authorized Provider Signature</p>
          </div>
          <div>
            <div className="border-b border-slate-400 pb-1 mb-1 min-h-[24px]">{packetData ? (packetData.dischargeDate || '02/11/2026') : val('02/11/2026')}&nbsp;</div>
            <p className="text-slate-600">Date</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 px-12 flex justify-between text-[9px] text-slate-400 font-mono border-t border-slate-200 pt-2 mt-6">
        <span>JOSMIC Wellness Center — Confidential Clinical Document</span>
        <span>Page 1 of 7</span>
      </div>
    </div>
  );
};
