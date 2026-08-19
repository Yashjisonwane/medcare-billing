// src/components/packets/anik/AnikCoverPage.jsx
import React from 'react';
import { PaperTextField } from '../common/PaperTextField';

export const AnikCoverPage = ({ packetData, onFieldChange, readOnly, blankMode = false }) => {
  const val = (v) => blankMode ? '' : v;

  return (
    <div className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300 p-12 space-y-8" style={{ width: '850px', height: '1100px' }}>
      
      {/* Header */}
      <div className="text-center border-b-2 border-slate-900 pb-6">
        <h1 className="text-2xl font-black uppercase text-teal-800 tracking-tight">ANIK LASER THERAPY</h1>
        <p className="text-xs font-bold text-slate-600">10101 HARWIN DR. STE 274 HOUSTON TX 77036</p>
        <p className="text-xs text-slate-600">OFFICE: 713-485-5712 | CELL: 832-815-0959 | FAX: 832-416-1502</p>
        <p className="text-xs text-teal-700 font-semibold underline">Aniklasertherapy@gmail.com</p>
      </div>

      <div className="bg-slate-100 p-6 rounded-xl border border-slate-300 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-300 pb-2">PATIENT & ACCIDENT CLAIM COVER SHEET</h2>
        
        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block font-bold">PATIENT NAME:</span>
            {blankMode || !packetData
              ? <div className="border-b border-slate-400 mt-1 w-40">&nbsp;</div>
              : <strong className="text-slate-900 text-sm">{packetData.patientName || 'N/A'}</strong>}
          </div>
          <div>
            <span className="text-slate-500 block font-bold">PATIENT SYSTEM ID:</span>
            {blankMode || !packetData
              ? <div className="border-b border-slate-400 mt-1 w-32">&nbsp;</div>
              : <strong className="text-slate-900 text-sm">{packetData.patient?.patientId || packetData.patientId || 'N/A'}</strong>}
          </div>
          <div>
            <span className="text-slate-500 block font-bold">DATE OF ACCIDENT:</span>
            {blankMode || !packetData
              ? <div className="border-b border-slate-400 mt-1 w-28">&nbsp;</div>
              : <strong className="text-slate-900">{packetData.accidentDate || 'N/A'}</strong>}
          </div>
          <div>
            <span className="text-slate-500 block font-bold">ATTORNEY / LAW FIRM:</span>
            {blankMode || !packetData
              ? <div className="border-b border-slate-400 mt-1 w-40">&nbsp;</div>
              : <strong className="text-slate-900">{packetData.attorneyName ? `${packetData.attorneyName} (${packetData.lawFirm || ''})` : 'N/A'}</strong>}
          </div>
          <div>
            <span className="text-slate-500 block font-bold">TREATING CLINIC:</span>
            <strong className="text-slate-900">ANIK LASER THERAPY</strong>
          </div>
          <div>
            <span className="text-slate-500 block font-bold">CASE STATUS:</span>
            {blankMode || !packetData
              ? <div className="border-b border-slate-400 mt-1 w-28">&nbsp;</div>
              : <strong className="text-teal-700 text-base font-black">{packetData.status || 'ACTIVE'}</strong>}
          </div>
        </div>
      </div>

      <div className="border border-slate-300 rounded-xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 uppercase">INDEX OF CLINICAL & BILLING PACKET DOCUMENTS (16 PAGES)</h3>
        <ul className="text-xs font-mono space-y-1.5 text-slate-700">
          <li>1. Patient & Case Cover Page</li>
          <li>2. Provider Billing Statement (Page 1 - Summary)</li>
          <li>3. Provider Billing Statement (Page 2 - Service Line Ledger)</li>
          <li>4–6. CMS-1500 Health Insurance Claim Forms (DOS: 01/22/2026, 01/24/2026, 01/26/2026)</li>
          <li>7. ANIK Therapy Assessment Form</li>
          <li>8–10. High-Intensity Laser Therapy Procedure Log Forms</li>
          <li>11–13. Initial Clinical Narrative Evaluation Report</li>
          <li>14–16. Final Medical & Therapy Discharge Report</li>
        </ul>
      </div>

    </div>
  );
};
