// src/components/packets/davs/DavCoverPage.jsx
import React from 'react';

export const DavCoverPage = ({ packetData, blankMode = false }) => {
  return (
    <div className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300 p-12 space-y-8" style={{ width: '850px', height: '1100px' }}>
      <div className="text-center border-b-2 border-slate-900 pb-6">
        <h1 className="text-2xl font-black uppercase text-teal-800 tracking-tight">DAV'S ANATOMY</h1>
        <p className="text-xs font-bold text-slate-600">10101 HARWIN DR. SUITE 274 HOUSTON TX 77036</p>
        <p className="text-xs text-slate-600">CELL: 832-815-0959 | FAX: 832-416-1502</p>
      </div>

      <div className="bg-slate-100 p-6 rounded-xl border border-slate-300 space-y-4 font-mono text-xs">
        <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-300 pb-2">DAV'S ANATOMY â€” CLINICAL PACKET COVER SHEET (14 PAGES)</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>PATIENT: {blankMode || !packetData ? <span className="border-b border-slate-400 inline-block w-32">&nbsp;</span> : <strong>{packetData.patientName}</strong>}</div>
          <div>SYSTEM ID: {blankMode || !packetData ? <span className="border-b border-slate-400 inline-block w-24">&nbsp;</span> : <strong>{packetData.patient?.patientId || packetData.patientId || 'N/A'}</strong>}</div>
          <div>ACCIDENT DATE: {blankMode || !packetData ? <span className="border-b border-slate-400 inline-block w-24">&nbsp;</span> : <strong>{packetData.accidentDate || 'N/A'}</strong>}</div>
          <div>TOTAL BILL BALANCE: {blankMode || !packetData ? <span className="border-b border-slate-400 inline-block w-24">&nbsp;</span> : <strong className="text-teal-700 font-black text-sm">See Ledger</strong>}</div>
        </div>
      </div>

      <div className="border border-slate-300 rounded-xl p-6 space-y-3 font-mono text-xs">
        <h3 className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-2">PACKET DOCUMENT INDEX</h3>
        <ol className="list-decimal pl-4 space-y-1 text-slate-700">
          <li>Patient & Accident Cover Sheet</li>
          <li>Billing Statement Page 1</li>
          <li>Billing Statement Continuation Page 2</li>
          <li>CMS-1500 Claim Form (DOS: 01/06/2026)</li>
          <li>CMS-1500 Claim Form (DOS: 01/07/2026)</li>
          <li>CMS-1500 Claim Form (DOS: 01/08/2026)</li>
          <li>ESWT Procedure Log Form (DOS: 01/06/2026)</li>
          <li>ESWT Procedure Log Form (DOS: 01/07/2026)</li>
          <li>ESWT Procedure Log Form (DOS: 01/08/2026)</li>
          <li>Clinical Progress Note (Page 1)</li>
          <li>Clinical Progress Note (Page 2)</li>
          <li>Shockwave Therapy Narrative Report (Page 1)</li>
          <li>Shockwave Therapy Narrative Report (Page 2)</li>
          <li>Shockwave Therapy Narrative Report (Page 3)</li>
        </ol>
      </div>
    </div>
  );
};
