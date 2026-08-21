// src/components/packets/tecar/TecarCoverPage.jsx
import React from 'react';

export const TecarCoverPage = ({ blankMode = false, packetData = null }) => {
  const getField = (field, fallback = '') => {
    if (blankMode) return '';
    if (!packetData) return fallback;
    if (field === 'patientName') return packetData.patientName || fallback;
    if (field === 'dob') return packetData.patient?.dob || packetData.patientDob || fallback;
    if (field === 'accidentDate') return packetData.accidentDate || fallback;
    if (field === 'initialDate') return packetData.initialDate || fallback;
    if (field === 'dischargeDate') return packetData.dischargeDate || fallback;
    return fallback;
  };

  return (
    <div className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300" style={{ width: '850px', minHeight: '1100px', padding: '48px 56px' }}>

      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-800 pb-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase text-rose-800 tracking-tight" style={{ fontFamily: 'serif' }}>TECAR THERAPY CLINIC</h1>
            <p className="text-[11px] font-bold text-slate-600">10101 HARWIN DR. STE 210 HOUSTON TX 77036</p>
            <p className="text-[11px] text-slate-600">OFFICE: 713-555-0210 &nbsp;|&nbsp; FAX: 832-555-0210</p>
          </div>
        </div>
      </div>

      {/* Patient Information Block */}
      <div className="bg-slate-100 border border-slate-300 p-5 mb-6 space-y-3">
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">NAME:</span>
            <div className="flex-1 border-b border-slate-400 pb-0.5 min-w-[120px] text-slate-900">{getField('patientName', 'SAMPLE PATIENT')}&nbsp;</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">Date of Birth:</span>
            <div className="flex-1 border-b border-slate-400 pb-0.5 min-w-[100px] text-slate-900">{getField('dob', '01/01/1980')}&nbsp;</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">Date of Accident:</span>
            <div className="flex-1 border-b border-slate-400 pb-0.5 text-slate-900">{getField('accidentDate', '12/01/2025')}&nbsp;</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 whitespace-nowrap">Initial Date:</span>
            <div className="flex-1 border-b border-slate-400 pb-0.5 text-slate-900">{getField('initialDate', '01/20/2026')}&nbsp;</div>
          </div>
        </div>
      </div>

      {/* Packet Document Index */}
      <div className="border border-slate-300 p-5 mb-6">
        <h3 className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-2 mb-3 text-xs tracking-wide">PACKET DOCUMENT INDEX</h3>
        <ol className="list-decimal pl-4 space-y-1.5 text-slate-700 text-xs font-mono">
          <li>Patient &amp; Case Cover Sheet</li>
          <li>Provider Billing Statement</li>
          <li>CMS-1500 Claim Form</li>
          <li>TECAR Therapy Assessment Form</li>
          <li>TECAR Procedure Log (DOS: {getField('initialDate', '01/20/2026')})</li>
        </ol>
      </div>

      {/* Statement of Accuracy */}
      <div className="border border-slate-300 p-5 mt-auto">
        <p className="text-[11px] text-slate-600 leading-relaxed">
          This clinical packet has been prepared by TECAR Therapy Clinic and includes all relevant billing, claim, and clinical documentation pertaining to the above-referenced patient case.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-8 text-xs font-mono">
          <div>
            <div className="border-b border-slate-400 pb-1 mb-1 min-h-[24px]">&nbsp;</div>
            <p className="text-slate-600">Authorized Provider Signature</p>
          </div>
          <div>
            <div className="border-b border-slate-400 pb-1 mb-1 min-h-[24px]">{getField('dischargeDate', '01/20/2026')}&nbsp;</div>
            <p className="text-slate-600">Date</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 px-12 flex justify-between text-[9px] text-slate-400 font-mono border-t border-slate-200 pt-2 mt-6">
        <span>TECAR Therapy Clinic - Confidential</span>
        <span>Page 1 of 5</span>
      </div>
    </div>
  );
};
