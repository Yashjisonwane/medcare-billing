// src/pages/clinical/DavsEswtFormPage.jsx
import React, { useState } from 'react';
import { apiClinicalNoteService } from '../../services/api/apiClinicalNoteService';
import { useUIStore } from '../../store/uiStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Activity, CheckCircle2 } from 'lucide-react';

export const DavsEswtFormPage = () => {
  const [formData, setFormData] = useState({
    patientName: 'Demo Patient 001',
    bp: '120/80 mmHg',
    hr: '100 bpm',
    treatmentAreas: 'Low back, Neck, Left ankle',
    barSetting: '3.0',
    hzSetting: '10 Hz',
    dose: '1000x3',
    totalWaves: 3000,
    bltCream: 'YES',
    reaction: 'Normal localized erythema, no bruising'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const note = await apiClinicalNoteService.createNote({
        patientId: 'pat-001',
        patientName: formData.patientName,
        caseId: 'case-001',
        providerId: 'prov-davs',
        providerName: "DAV'S Anatomy",
        type: 'DAVS_ESWT',
        title: "DAV'S Anatomy ESWT Radial Device Procedure Form",
        author: 'Alex Rivera (Lead Therapist)',
        content: formData
      });
      addToast("DAV'S ESWT Procedure Form saved!", 'success');
      navigate(`/clinical-notes/${note.id}/edit`);
    } catch (err) {
      addToast('Failed to save procedure form', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate('/clinical-notes')} className="flex items-center gap-1 text-xs font-bold text-secondary-container hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Clinical Notes
      </button>

      <div>
        <h1 className="text-2xl font-bold text-on-surface">DAV'S Anatomy - Shockwave Therapy (ESWT) Radial Device Form</h1>
        <p className="text-xs text-on-surface-variant">Vitals verification, Bar setting (3.0), Hz (10 Hz), Wave Count (3000) & BLT cream application</p>
      </div>

      <form onSubmit={handleSave} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-6">
        
        {/* Vitals Check */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-secondary-container" /> Pre-Procedure Vitals Verification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Blood Pressure (BP) *</label>
              <input
                type="text"
                required
                value={formData.bp}
                onChange={(e) => setFormData({ ...formData, bp: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Heart Rate (HR) *</label>
              <input
                type="text"
                required
                value={formData.hr}
                onChange={(e) => setFormData({ ...formData, hr: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface font-mono"
              />
            </div>
          </div>
        </div>

        {/* ESWT Device Parameters */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">ESWT Device Output Parameters</h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Bar Setting *</label>
              <input
                type="text"
                required
                value={formData.barSetting}
                onChange={(e) => setFormData({ ...formData, barSetting: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Hz Setting *</label>
              <input
                type="text"
                required
                value={formData.hzSetting}
                onChange={(e) => setFormData({ ...formData, hzSetting: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Dose / Session *</label>
              <input
                type="text"
                required
                value={formData.dose}
                onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Total Waves Delivered *</label>
              <input
                type="number"
                required
                value={formData.totalWaves}
                onChange={(e) => setFormData({ ...formData, totalWaves: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface font-bold font-mono text-secondary-container"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Treatment Target Areas</label>
            <input
              type="text"
              value={formData.treatmentAreas}
              onChange={(e) => setFormData({ ...formData, treatmentAreas: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
          <button type="button" onClick={() => navigate('/clinical-notes')} className="px-4 py-2 bg-surface-container text-xs font-bold rounded-lg">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-5 py-2 bg-secondary-container text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5">
            <Save className="w-4 h-4" /> {isLoading ? 'Saving...' : 'Save & Sign ESWT Form'}
          </button>
        </div>
      </form>
    </div>
  );
};
