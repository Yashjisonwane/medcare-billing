// src/pages/clinical/JosmicPainFormPage.jsx
import React, { useState } from 'react';
import { mockClinicalNoteService } from '../../services/mock/mockClinicalNoteService';
import { useUIStore } from '../../store/uiStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, CheckSquare, PenTool } from 'lucide-react';

const PAIN_LOCATIONS = [
  'Neck', 'Chest', 'Head', 'Upper back', 'Middle back', 'Lower back',
  'Right shoulder', 'Left shoulder', 'Right knee', 'Left knee', 'Right ankle', 'Left ankle',
  'Right wrist', 'Left wrist', 'Joint pain', 'Muscle pain', 'Headache', 'Right arm',
  'Left arm', 'Right leg', 'Left leg', 'Right elbow', 'Left elbow', 'Other'
];

export const JosmicPainFormPage = () => {
  const [patientName, setPatientName] = useState('Demo Patient 001');
  const [chiefComplaint, setChiefComplaint] = useState('Motor vehicle collision resulting in severe neck and lower back pain');
  const [selectedLocations, setSelectedLocations] = useState(['Neck', 'Lower back', 'Left ankle']);
  const [painScale, setPainScale] = useState(7);
  const [hpiText, setHpiText] = useState('Patient was involved in a rear-end MVA on 12/27/2025. Immediate pain reported in cervical and lumbar spine.');
  const [planText, setPlanText] = useState('Ordered MRI cervical/lumbar. Recommend ESWT and Laser therapy 3x weekly.');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const toggleLocation = (loc) => {
    if (selectedLocations.includes(loc)) {
      setSelectedLocations(selectedLocations.filter(l => l !== loc));
    } else {
      setSelectedLocations([...selectedLocations, loc]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const note = await mockClinicalNoteService.createNote({
        patientId: 'pat-001',
        patientName,
        caseId: 'case-001',
        providerId: 'prov-josmic',
        providerName: 'JOSMIC Wellness Center',
        type: 'JOSMIC_PAIN',
        title: 'JOSMIC Pain Management Report',
        author: 'Dr. Segun Adeoye',
        content: {
          chiefComplaint,
          painLocations: selectedLocations,
          painScale,
          hpiText,
          planText
        }
      });
      addToast('JOSMIC Pain Management Report saved as draft!', 'success');
      navigate(`/clinical-notes/${note.id}/edit`);
    } catch (err) {
      addToast('Failed to save report', 'error');
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
        <h1 className="text-2xl font-bold text-on-surface">JOSMIC Wellness Center — Pain Management Consultation Form</h1>
        <p className="text-xs text-on-surface-variant">Structured consultation, 24 anatomical pain location grid, HPI pain scale & diagnostic plan</p>
      </div>

      <form onSubmit={handleSave} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-6">
        {/* Section 1: Patient Header */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-secondary-container" /> Section 1 — Chief Complaint & HPI
          </h2>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Chief Complaint *</label>
            <input
              type="text"
              required
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">History of Present Illness (HPI)</label>
            <textarea
              rows={3}
              value={hpiText}
              onChange={(e) => setHpiText(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface"
            />
          </div>
        </div>

        {/* Section 2: Pain Scale (0-10) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-on-surface">Pain Scale Severity (0 - 10): <span className="text-secondary-container font-extrabold text-sm">{painScale} / 10</span></label>
          <input
            type="range"
            min="0"
            max="10"
            value={painScale}
            onChange={(e) => setPainScale(Number(e.target.value))}
            className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary-container"
          />
          <div className="flex justify-between text-[10px] text-on-surface-variant font-bold">
            <span>0 — No Pain</span>
            <span>5 — Moderate</span>
            <span>10 — Unbearable</span>
          </div>
        </div>

        {/* Section 3: 24 Anatomical Pain Locations Checkbox Grid */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-secondary-container" /> Anatomical Pain Locations (24 Areas)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {PAIN_LOCATIONS.map((loc) => {
              const isChecked = selectedLocations.includes(loc);
              return (
                <label
                  key={loc}
                  onClick={() => toggleLocation(loc)}
                  className={`p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition flex items-center gap-2 ${
                    isChecked ? 'border-secondary-container bg-surface-container-low text-secondary-container font-bold' : 'border-outline-variant bg-surface hover:bg-surface-container'
                  }`}
                >
                  <input type="checkbox" checked={isChecked} readOnly className="rounded text-secondary-container focus:ring-secondary-container" />
                  <span>{loc}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 4: Treatment Plan & Recommendations */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">Plan & Recommendations</h2>
          <textarea
            rows={3}
            value={planText}
            onChange={(e) => setPlanText(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
          <button type="button" onClick={() => navigate('/clinical-notes')} className="px-4 py-2 bg-surface-container text-xs font-bold rounded-lg">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-5 py-2 bg-secondary-container text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5">
            <Save className="w-4 h-4" /> {isLoading ? 'Saving...' : 'Save Draft & Proceed to Sign'}
          </button>
        </div>
      </form>
    </div>
  );
};
