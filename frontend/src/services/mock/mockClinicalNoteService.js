// src/services/mock/mockClinicalNoteService.js
import { INITIAL_CLINICAL_NOTES } from './mockDataFixtures';

const STORAGE_KEY = 'medpractice_clinical_notes';

const getStoredNotes = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLINICAL_NOTES));
    return INITIAL_CLINICAL_NOTES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_CLINICAL_NOTES;
  }
};

const saveNotes = (notes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const mockClinicalNoteService = {
  async getNotes(filters = {}) {
    await new Promise(res => setTimeout(res, 200));
    let notes = getStoredNotes();

    if (filters.patientId) {
      notes = notes.filter(n => n.patientId === filters.patientId);
    }
    if (filters.providerId) {
      notes = notes.filter(n => n.providerId === filters.providerId);
    }
    if (filters.status) {
      notes = notes.filter(n => n.status === filters.status);
    }

    return notes;
  },

  async getNoteById(id) {
    await new Promise(res => setTimeout(res, 150));
    const notes = getStoredNotes();
    return notes.find(n => n.id === id) || notes[0];
  },

  async createNote(noteData) {
    await new Promise(res => setTimeout(res, 300));
    const notes = getStoredNotes();
    const newNote = {
      id: `note-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US'),
      status: 'DRAFT',
      ...noteData
    };
    notes.unshift(newNote);
    saveNotes(notes);
    return newNote;
  },

  async generateAiDraft(promptType, inputData) {
    await new Promise(res => setTimeout(res, 800)); // Simulate AI model delay
    const patientName = inputData?.patientName || 'Demo Patient 001';
    const complaints = inputData?.complaints || 'neck and low back stiffness following auto accident';
    const locations = (inputData?.painLocations || ['Neck', 'Lower Back']).join(', ');

    let draftText = '';

    if (promptType === 'HPI') {
      draftText = `HISTORY OF PRESENT ILLNESS (AI DRAFT):\nThe patient, ${patientName}, presents with acute onset discomfort localized to the ${locations}. Symptoms initiated immediately following a motor vehicle collision on 12/27/2025. Pain is characterized as sharp and throbbing with functional restrictions during lumbar extension and neck rotation. Patient reports current pain level as 7/10.`;
    } else if (promptType === 'EXAM') {
      draftText = `PHYSICAL EXAMINATION SUMMARY (AI DRAFT):\nInspection: No visible acute trauma or deformity. Palpation demonstrates marked tenderness and bilateral muscle spasm along the paraspinal musculature. Range of Motion: Cervical extension and lumbar flexion are moderately restricted due to discomfort. Neurologic: Intact sensation and 5/5 motor strength bilaterally.`;
    } else if (promptType === 'ASSESSMENT') {
      draftText = `ASSESSMENT & PLAN DRAFT (AI DRAFT):\nDiagnoses: 1. Cervical sprain/strain (S13.4). 2. Lumbar strain (S33.5). 3. Myofascial pain syndrome (M79.1).\nPlan: Initiate conservative physical therapy, ESWT radial shockwave therapy, and laser therapy. Re-evaluate clinical progress in 4 weeks. Patient instructed on home stretching and posture ergonomics.`;
    } else {
      draftText = `CLINICAL SUMMARY (AI DRAFT):\n${patientName} continues to undergo structured multi-provider care for accident-related injuries (${complaints}). Patient demonstrates steady progress with reduced localized tenderness following ongoing laser and shockwave treatment sessions.`;
    }

    return {
      draftText,
      disclaimer: 'AI-generated content is a draft and must be reviewed and approved by an authorized healthcare provider.',
      generatedAt: new Date().toLocaleTimeString()
    };
  },

  async signNote(id, signatureUrl, authorName) {
    await new Promise(res => setTimeout(res, 250));
    const notes = getStoredNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes[index].status = 'SIGNED_LOCKED';
      notes[index].signatureUrl = signatureUrl;
      notes[index].author = authorName || notes[index].author;
      notes[index].signedAt = new Date().toISOString();
      saveNotes(notes);
      return notes[index];
    }
    throw new Error('Note not found');
  },

  async amendNote(id, addendumText, authorName) {
    await new Promise(res => setTimeout(res, 250));
    const notes = getStoredNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      const addendum = {
        id: `addendum-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        author: authorName,
        text: addendumText
      };
      notes[index].addendums = [...(notes[index].addendums || []), addendum];
      notes[index].status = 'AMENDED';
      saveNotes(notes);
      return notes[index];
    }
    throw new Error('Note not found');
  }
};
