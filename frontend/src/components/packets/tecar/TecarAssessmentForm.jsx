// src/components/packets/tecar/TecarAssessmentForm.jsx
import React from 'react';

export const TecarAssessmentForm = ({ readOnly = false, blankMode = false, packetData = null, serviceLines = [] }) => {
  const val = (v) => blankMode ? '' : v;
  
  const serviceDates = serviceLines && serviceLines.length > 0
    ? [...new Set(serviceLines.map(l => l.dos || l.dateOfService).filter(Boolean))]
    : [];
  const activeDos = blankMode ? '' : (serviceDates.length > 0 ? serviceDates[0] : (packetData?.initialDate || '01/20/2026'));
  const patientNameVal = blankMode ? '' : (packetData ? packetData.patientName : 'SAMPLE PATIENT');
  
  return (
    <div className="relative bg-white text-slate-900 font-sans shadow-2xl mx-auto border border-slate-300" style={{ width: '850px', minHeight: '1100px', padding: '48px 56px' }}>
      {/* Header */}
      <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
        <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight" style={{ fontFamily: 'serif' }}>TECAR THERAPY ASSESSMENT</h1>
        <p className="text-xs font-bold text-slate-600 mt-1">CLINICAL EVALUATION & TISSUE STATUS</p>
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

      {/* Subjective */}
      <div className="mb-6">
        <h2 className="text-sm font-bold bg-slate-100 p-2 border border-slate-300 mb-3 uppercase">1. Subjective Findings</h2>
        <div className="space-y-4 text-xs font-mono px-2">
          <div className="flex items-center gap-4">
            <span className="font-bold">VAS Pain Scale (0-10):</span>
            <div className="flex gap-2">
              {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                <div key={n} className={`w-6 h-6 border flex items-center justify-center ${n === 7 && !blankMode ? 'bg-rose-100 border-rose-500 font-bold' : 'border-slate-300 text-slate-400'}`}>
                  {n}
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="font-bold block mb-1">Pain Location & Quality:</span>
            <div className="border border-slate-300 p-2 min-h-[60px] text-slate-700 bg-slate-50">
              {val('Deep tissue ache in the lumbar region, radiating laterally. Patient reports stiffness in the morning and pain aggravated by bending.')}
            </div>
          </div>
        </div>
      </div>

      {/* Objective */}
      <div className="mb-6">
        <h2 className="text-sm font-bold bg-slate-100 p-2 border border-slate-300 mb-3 uppercase">2. Objective Assessment</h2>
        <div className="grid grid-cols-2 gap-4 text-xs font-mono px-2">
          <div>
            <span className="font-bold block mb-2">Tissue Status:</span>
            <ul className="space-y-1 text-slate-700">
              <li className="flex items-center gap-2"><div className={`w-3 h-3 border border-slate-400 ${!blankMode ? 'bg-slate-800' : ''}`}></div> Superficial Inflammation (Capacitive indication)</li>
              <li className="flex items-center gap-2"><div className={`w-3 h-3 border border-slate-400 ${!blankMode ? 'bg-slate-800' : ''}`}></div> Deep Tissue Stiffness (Resistive indication)</li>
              <li className="flex items-center gap-2"><div className={`w-3 h-3 border border-slate-400`}></div> Joint Effusion</li>
              <li className="flex items-center gap-2"><div className={`w-3 h-3 border border-slate-400`}></div> Ligament/Tendon involvement</li>
            </ul>
          </div>
          <div>
            <span className="font-bold block mb-2">Palpation & ROM:</span>
            <p className="text-slate-700 border border-slate-300 p-2 min-h-[80px] bg-slate-50">
              {val('Decreased lumbar flexion and extension by 40%. Hypertonicity noted in lumbar paraspinal muscles. Deep palpation reproduces familiar pain.')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Plan */}
      <div className="mb-6">
        <h2 className="text-sm font-bold bg-slate-100 p-2 border border-slate-300 mb-3 uppercase">3. Treatment Plan (TECAR)</h2>
        <div className="text-xs font-mono px-2">
          <p className="text-slate-700 border border-slate-300 p-2 min-h-[60px] bg-slate-50">
            {val('Initiate TECAR (Transfer of Energy Capacitive and Resistive) therapy to the lumbar region to promote deep tissue hyperthermia, reduce inflammation, and improve elasticity of paraspinal tissues.')}
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
