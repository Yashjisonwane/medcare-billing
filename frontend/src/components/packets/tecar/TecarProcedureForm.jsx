// src/components/packets/tecar/TecarProcedureForm.jsx
import React from 'react';

export const TecarProcedureForm = ({ dos = '', readOnly = false, blankMode = false, packetData = null, serviceLines = [] }) => {
  const val = (v) => blankMode ? '' : v;
  
  const serviceDates = serviceLines && serviceLines.length > 0
    ? [...new Set(serviceLines.map(l => l.dos || l.dateOfService).filter(Boolean))]
    : [];
  const activeDos = dos || (!blankMode && serviceDates.length > 0 ? serviceDates[0] : (packetData?.initialDate || '01/20/2026'));
  
  return (
    <div className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300" style={{ width: '850px', minHeight: '1100px', padding: '48px 56px' }}>
      {/* Header */}
      <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
        <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight" style={{ fontFamily: 'serif' }}>TECAR THERAPY PROCEDURE LOG</h1>
        <p className="text-xs font-bold text-slate-600 mt-1">CAPACITIVE AND RESISTIVE ENERGY TRANSFER</p>
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
        <h2 className="text-sm font-bold bg-slate-100 p-2 border border-slate-300 mb-3 uppercase">Treatment Area & Diagnosis</h2>
        <div className="grid grid-cols-2 gap-4 text-xs font-mono px-2">
          <div>
            <span className="font-bold block mb-1">Diagnosis (ICD-10):</span>
            <p className="text-slate-700 border border-slate-300 p-2 min-h-[40px] bg-slate-50">
              {val('Low Back Pain (M54.50)')}
            </p>
          </div>
          <div>
            <span className="font-bold block mb-1">Anatomical Region:</span>
            <p className="text-slate-700 border border-slate-300 p-2 min-h-[40px] bg-slate-50">
              {val('Lumbar Spine & Paraspinal Musculature')}
            </p>
          </div>
        </div>
      </div>

      {/* Procedure Details */}
      <div className="mb-6">
        <h2 className="text-sm font-bold bg-slate-100 p-2 border border-slate-300 mb-3 uppercase">TECAR Parameters (CPT 97024)</h2>
        
        <div className="text-xs font-mono px-2">
          <table className="w-full border-collapse border border-slate-300 text-left mb-4">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2">Mode</th>
                <th className="border border-slate-300 p-2">Electrode Size</th>
                <th className="border border-slate-300 p-2">Power (%) / Intensity</th>
                <th className="border border-slate-300 p-2">Duration (mins)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2 font-bold">Capacitive (CET)</td>
                <td className="border border-slate-300 p-2">{val('60 mm')}</td>
                <td className="border border-slate-300 p-2">{val('35% - Athermal / Mild thermal')}</td>
                <td className="border border-slate-300 p-2">{val('10 mins')}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-bold">Resistive (RET)</td>
                <td className="border border-slate-300 p-2">{val('40 mm')}</td>
                <td className="border border-slate-300 p-2">{val('50% - Moderate thermal')}</td>
                <td className="border border-slate-300 p-2">{val('15 mins')}</td>
              </tr>
              <tr className="bg-slate-50 font-bold">
                <td className="border border-slate-300 p-2 text-right" colSpan="3">Total Treatment Time:</td>
                <td className="border border-slate-300 p-2">{val('25 mins')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Technique */}
      <div className="mb-6">
        <h2 className="text-sm font-bold bg-slate-100 p-2 border border-slate-300 mb-3 uppercase">Clinical Notes & Patient Response</h2>
        <div className="text-xs font-mono px-2">
          <p className="text-slate-700 border border-slate-300 p-2 min-h-[100px] bg-slate-50 leading-relaxed">
            {val('Return electrode placed on the patient\'s abdomen. Conductive cream applied to the lumbar area. Capacitive mode was used initially to address superficial vascularization and muscle relaxation. Followed by Resistive mode targeting deep ligamentous and fascial structures of the lumbar spine. Active mobilization was performed concurrently during the Resistive phase. Patient reported a pleasant warming sensation and noted immediate improvement in lumbar range of motion post-treatment. No adverse skin reactions noted.')}
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
