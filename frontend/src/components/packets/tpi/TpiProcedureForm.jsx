// src/components/packets/tpi/TpiProcedureForm.jsx
import React from 'react';

export const TpiProcedureForm = ({ dos = '', readOnly = false, blankMode = false, packetData = null, serviceLines = [] }) => {
  const val = (v) => blankMode ? '' : v;
  
  const serviceDates = serviceLines && serviceLines.length > 0
    ? [...new Set(serviceLines.map(l => l.dos || l.dateOfService).filter(Boolean))]
    : [];
  const activeDos = dos || (!blankMode && serviceDates.length > 0 ? serviceDates[0] : (packetData?.initialDate || '01/15/2026'));
  
  return (
    <div className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300" style={{ width: '850px', minHeight: '1100px', padding: '48px 56px' }}>
      {/* Header */}
      <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
        <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight" style={{ fontFamily: 'serif' }}>TRIGGER POINT INJECTION PROCEDURE</h1>
        <p className="text-xs font-bold text-slate-600 mt-1">OPERATIVE REPORT</p>
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-6">
        <div className="flex border-b border-slate-300 pb-1">
          <span className="font-bold w-24">Patient Name:</span>
          <span className="flex-1 text-slate-700">{packetData ? packetData.patientName : val('SAMPLE PATIENT')}</span>
        </div>
        <div className="flex border-b border-slate-300 pb-1">
          <span className="font-bold w-24">Date of Svc:</span>
          <span className="flex-1 text-slate-700">{val(activeDos)}</span>
        </div>
      </div>

      {/* Pre-Op */}
      <div className="mb-6">
        <h2 className="text-sm font-bold bg-slate-100 p-2 border border-slate-300 mb-3 uppercase">Pre-Operative Diagnosis</h2>
        <div className="text-xs font-mono px-2">
          <p className="text-slate-700 border border-slate-300 p-2 min-h-[40px] bg-slate-50">
            {val('Myofascial Pain Syndrome (M79.1)')}
          </p>
        </div>
      </div>

      {/* Procedure Details */}
      <div className="mb-6">
        <h2 className="text-sm font-bold bg-slate-100 p-2 border border-slate-300 mb-3 uppercase">Procedure Details</h2>
        <div className="grid grid-cols-2 gap-4 text-xs font-mono px-2">
          <div>
            <span className="font-bold block mb-1">Medication Injected:</span>
            <p className="text-slate-700 border border-slate-300 p-2 bg-slate-50">
              {val('Lidocaine 1% (2mL) + Bupivacaine 0.5% (2mL)')}
            </p>
          </div>
          <div>
            <span className="font-bold block mb-1">Total Volume / Needles Used:</span>
            <p className="text-slate-700 border border-slate-300 p-2 bg-slate-50">
              {val('4mL total. 25-gauge 1.5-inch needle.')}
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-xs font-mono px-2">
          <span className="font-bold block mb-1">Muscles Injected (CPT 20552/20553):</span>
          <table className="w-full border-collapse border border-slate-300 text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2 w-1/2">Muscle Name</th>
                <th className="border border-slate-300 p-2 w-1/4">Side</th>
                <th className="border border-slate-300 p-2 w-1/4">Volume (mL)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2">{val('Trapezius')}</td>
                <td className="border border-slate-300 p-2">{val('Right')}</td>
                <td className="border border-slate-300 p-2">{val('2.0 mL')}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2">{val('Trapezius')}</td>
                <td className="border border-slate-300 p-2">{val('Left')}</td>
                <td className="border border-slate-300 p-2">{val('2.0 mL')}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2">&nbsp;</td>
                <td className="border border-slate-300 p-2">&nbsp;</td>
                <td className="border border-slate-300 p-2">&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Technique */}
      <div className="mb-6">
        <h2 className="text-sm font-bold bg-slate-100 p-2 border border-slate-300 mb-3 uppercase">Procedure Description</h2>
        <div className="text-xs font-mono px-2">
          <p className="text-slate-700 border border-slate-300 p-2 min-h-[100px] bg-slate-50 leading-relaxed">
            {val('The patient was positioned comfortably. The skin over the identified trigger points was prepped with alcohol/betadine. Using a sterile technique, the needle was advanced into the taut band of the muscle. A local twitch response was elicited. After negative aspiration for blood, the medication was injected slowly. The needle was withdrawn, and pressure was applied for hemostasis. The patient tolerated the procedure well without immediate complications.')}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-12 left-14 right-14 border-t border-slate-300 pt-4 text-xs font-mono flex justify-between">
        <div>
          <div className="border-b border-slate-400 pb-1 mb-1 w-48">&nbsp;</div>
          <p className="text-slate-600">Operating Provider Signature</p>
        </div>
        <div>
          <div className="border-b border-slate-400 pb-1 mb-1 w-32">{val(activeDos)}&nbsp;</div>
          <p className="text-slate-600">Date</p>
        </div>
      </div>
    </div>
  );
};
