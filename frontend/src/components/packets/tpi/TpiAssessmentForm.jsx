// src/components/packets/tpi/TpiAssessmentForm.jsx
import React from 'react';

export const TpiAssessmentForm = ({ readOnly = false, blankMode = false, packetData = null, serviceLines = [] }) => {
  const val = (v) => blankMode ? '' : v;
  
  const serviceDates = serviceLines && serviceLines.length > 0
    ? [...new Set(serviceLines.map(l => l.dos || l.dateOfService).filter(Boolean))]
    : [];
  const activeDos = blankMode ? '' : (serviceDates.length > 0 ? serviceDates[0] : (packetData?.initialDate || '01/15/2026'));
  const patientNameVal = blankMode ? '' : (packetData ? packetData.patientName : 'SAMPLE PATIENT');
  
  return (
    <div className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300" style={{ width: '850px', minHeight: '1100px', padding: '48px 56px' }}>
      {/* Header */}
      <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
        <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight" style={{ fontFamily: 'serif' }}>TRIGGER POINT ASSESSMENT</h1>
        <p className="text-xs font-bold text-slate-600 mt-1">CLINICAL EVALUATION & FINDINGS</p>
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-6">
        <div className="flex border-b border-slate-300 pb-1">
          <span className="font-bold w-24">Patient Name:</span>
          <span className="flex-1 text-slate-700">{patientNameVal}&nbsp;</span>
        </div>
        <div className="flex border-b border-slate-300 pb-1">
          <span className="font-bold w-24">Date of Eval:</span>
          <span className="flex-1 text-slate-700">{activeDos}&nbsp;</span>
        </div>
      </div>

      {/* Pain Assessment */}
      <div className="mb-6">
        <h2 className="text-sm font-bold bg-slate-100 p-2 border border-slate-300 mb-3 uppercase">1. Pain Assessment</h2>
        <div className="space-y-4 text-xs font-mono px-2">
          <div className="flex items-center gap-4">
            <span className="font-bold">Pain Scale (0-10):</span>
            <div className="flex gap-2">
              {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                <div key={n} className={`w-6 h-6 border flex items-center justify-center ${n === 8 && !blankMode ? 'bg-amber-100 border-amber-500 font-bold' : 'border-slate-300 text-slate-400'}`}>
                  {n}
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="font-bold block mb-1">Chief Complaint / Pain Description:</span>
            <div
              contentEditable={!readOnly}
              suppressContentEditableWarning
              className="border border-slate-300 p-2 min-h-[60px] text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            >
              {val('Patient complains of severe, aching pain in the cervical and thoracic regions. Pain is exacerbated by movement and prolonged sitting.')}
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Findings */}
      <div className="mb-6">
        <h2 className="text-sm font-bold bg-slate-100 p-2 border border-slate-300 mb-3 uppercase">2. Clinical Findings & Trigger Points</h2>
        <div className="grid grid-cols-2 gap-4 text-xs font-mono px-2">
          <div>
            <span className="font-bold block mb-2">Affected Muscle Groups:</span>
            <ul className="space-y-1 text-slate-700">
              <li className="flex items-center gap-2"><div className={`w-3 h-3 border border-slate-400 ${!blankMode ? 'bg-slate-800' : ''}`}></div> Trapezius (Bilateral)</li>
              <li className="flex items-center gap-2"><div className={`w-3 h-3 border border-slate-400 ${!blankMode ? 'bg-slate-800' : ''}`}></div> Levator Scapulae</li>
              <li className="flex items-center gap-2"><div className={`w-3 h-3 border border-slate-400`}></div> Rhomboids</li>
              <li className="flex items-center gap-2"><div className={`w-3 h-3 border border-slate-400`}></div> Quadratus Lumborum</li>
            </ul>
          </div>
          <div>
            <span className="font-bold block mb-2">Palpation Findings:</span>
            <p
              contentEditable={!readOnly}
              suppressContentEditableWarning
              className="text-slate-700 border border-slate-300 p-2 min-h-[80px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            >
              {val('Palpable taut bands found in the bilateral upper trapezius. Positive jump sign elicited upon palpation of active trigger points.')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Plan */}
      <div className="mb-6">
        <h2 className="text-sm font-bold bg-slate-100 p-2 border border-slate-300 mb-3 uppercase">3. Treatment Plan</h2>
        <div className="text-xs font-mono px-2">
          <p
            contentEditable={!readOnly}
            suppressContentEditableWarning
            className="text-slate-700 border border-slate-300 p-2 min-h-[60px] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          >
            {val('Trigger point injections using local anesthetic agent administered into active trigger points. Patient instructed on post-injection stretching and hydration.')}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-12 left-14 right-14 border-t border-slate-300 pt-4 text-xs font-mono flex justify-between">
        <div>
          <div className="border-b border-slate-400 pb-1 mb-1 w-48">&nbsp;</div>
          <p className="text-slate-600">Provider Signature</p>
        </div>
        <div>
          <div className="border-b border-slate-400 pb-1 mb-1 w-32">{val(activeDos)}&nbsp;</div>
          <p className="text-slate-600">Date</p>
        </div>
      </div>
    </div>
  );
};
