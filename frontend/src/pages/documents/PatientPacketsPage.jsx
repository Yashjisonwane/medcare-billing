// src/pages/documents/PatientPacketsPage.jsx
import React, { useState } from 'react';
import { UnifiedPacketViewer } from '../../components/packets/UnifiedPacketViewer';
import { FileText, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export const PatientPacketsPage = () => {
  const [selectedProvider, setSelectedProvider] = useState('prov-anik');

  return (
    <div className="space-y-6">
      
      {/* Top Header & Provider Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Case Document Packets</h1>
          <p className="text-xs text-slate-500">Multi-page provider packets featuring clinical assessments, procedure forms, narrative reports, billing statements, and CMS-1500 claims</p>
        </div>

        {/* Provider Packet Selectors */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setSelectedProvider('prov-anik')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition ${
              selectedProvider === 'prov-anik' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            ANIK Laser (16 Pages)
          </button>
          <button
            onClick={() => setSelectedProvider('prov-davs')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition ${
              selectedProvider === 'prov-davs' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            DAV'S ESWT (14 Pages)
          </button>
          <button
            onClick={() => setSelectedProvider('prov-josmic')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition ${
              selectedProvider === 'prov-josmic' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            JOSMIC Consult (7 Pages)
          </button>
          <button
            onClick={() => setSelectedProvider('prov-counselor')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition ${
              selectedProvider === 'prov-counselor' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Counselor (4 Pages)
          </button>
        </div>
      </div>

      <UnifiedPacketViewer providerId={selectedProvider} />

    </div>
  );
};
