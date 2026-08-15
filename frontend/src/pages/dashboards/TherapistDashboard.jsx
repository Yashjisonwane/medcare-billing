// src/pages/dashboards/TherapistDashboard.jsx
import React from 'react';
import { Activity, Award, PlusCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TherapistDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Therapist Session Dashboard</h1>
          <p className="text-xs text-on-surface-variant">Assigned ESWT shockwave & Laser treatment sessions execution and parameter logging</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/clinical-notes/davs-eswt')} className="px-3 py-2 bg-secondary-container text-white rounded-lg text-xs font-bold shadow hover:bg-secondary flex items-center gap-1.5">
            <Activity className="w-4 h-4" /> Log DAV'S ESWT Session
          </button>
          <button onClick={() => navigate('/clinical-notes/anik-laser')} className="px-3 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-container flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Log ANIK Laser Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">ESWT Shockwave Sessions</span>
            <Activity className="w-5 h-5 text-secondary-container" />
          </div>
          <p className="text-2xl font-bold text-on-surface font-tabular">3 Visits Logged</p>
          <p className="text-[11px] text-on-surface-variant">3,000 Waves Delivered</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Laser Therapy Sessions</span>
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-on-surface font-tabular">3 Visits Logged</p>
          <p className="text-[11px] text-on-surface-variant">236,250 Joules Delivered</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant">Vitals Check Compliance</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-on-surface font-tabular">100% Verified</p>
          <p className="text-[11px] text-emerald-600 font-semibold">BP & HR recorded per visit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary-container" />
              DAV'S Anatomy — ESWT Radial Device Form
            </h2>
            <button onClick={() => navigate('/clinical-notes/davs-eswt')} className="text-xs font-bold text-secondary-container hover:underline flex items-center gap-1">
              Open Form <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-on-surface-variant">
            Record Bar setting (3.0), Hz (10 Hz), Dose (1000x3), total waves (3000), BLT cream application time, and pre/post procedure instructions.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              ANIK Laser Therapy — Procedure Form
            </h2>
            <button onClick={() => navigate('/clinical-notes/anik-laser')} className="text-xs font-bold text-secondary-container hover:underline flex items-center gap-1">
              Open Form <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-on-surface-variant">
            Record Wavelength (800nm), Total Mins (900s), Dose (10.5W), Total Energy (236,250 Joules), tolerance checks, and narrative outcome.
          </p>
        </div>
      </div>
    </div>
  );
};
