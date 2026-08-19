// src/pages/clinical/AnikLaserFormPage.jsx
import React, { useState } from 'react';
import { mockClinicalNoteService } from '../../services/mock/mockClinicalNoteService';
import { useUIStore } from '../../store/uiStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Award } from 'lucide-react';

export const AnikLaserFormPage = () => {
  const [formData, setFormData] = useState({
    patientName: 'Demo Patient 001',
    bp: '115/70 mmHg',
    hr: '90 bpm',
    treatmentAreas: 'Low back, Neck, Left ankle',
    wavelength: '800nm',
    totalMins: '900s (15 Mins)',
    dose: '10.5W',
    totalEnergy: '236,250 Joules',
    comments: 'Patient tolerated Class IV laser procedure with minimal discomfort. Safety eye protection worn.'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const note = await mockClinicalNoteService.createNote({
        patientId: 'pat-001',
        patientName: formData.patientName,
        caseId: 'case-001',
        providerId: 'prov-anik',
        providerName: 'ANIK Laser Therapy',
        type: 'ANIK_LASER',
        title: 'ANIK Laser Therapy Procedure Form',
        author: 'Alex Rivera (Lead Therapist)',
        content: formData
      });
      addToast('ANIK Laser Therapy Procedure Form saved!', 'success');
      navigate(`/clinical-notes/${note.id}/edit`);
    } catch (err) {
      addToast('Failed to save laser form', 'error');
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
        <h1 className="text-2xl font-bold text-on-surface">ANIK Laser Therapy â€” Class IV Laser Procedure Form</h1>
        <p className="text-xs text-on-surface-variant">Vitals verification, Wavelength (800nm), Duration (900s), Output (10.5W) & Total Energy (236,250 Joules)</p>
      </div>

      <form onSubmit={handleSave} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" /> Class IV Laser Dosimetry Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Wavelength *</label>
              <input
                type="text"
                required
                value={formData.wavelength}
                onChange={(e) => setFormData({ ...formData, wavelength: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Duration (Seconds) *</label>
              <input
                type="text"
                required
                value={formData.totalMins}
                onChange={(e) => setFormData({ ...formData, totalMins: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Power Output (Watts) *</label>
              <input
                type="text"
                required
                value={formData.dose}
                onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Total Energy (Joules) *</label>
              <input
                type="text"
                required
                value={formData.totalEnergy}
                onChange={(e) => setFormData({ ...formData, totalEnergy: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface font-bold font-mono text-purple-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Therapist Clinical Progress Comments</label>
            <textarea
              rows={3}
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
          <button type="button" onClick={() => navigate('/clinical-notes')} className="px-4 py-2 bg-surface-container text-xs font-bold rounded-lg">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-5 py-2 bg-secondary-container text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5">
            <Save className="w-4 h-4" /> {isLoading ? 'Saving...' : 'Save & Sign Laser Form'}
          </button>
        </div>
      </form>
    </div>
  );
};
