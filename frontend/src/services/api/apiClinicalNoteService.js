import { API_BASE_URL } from '../../config/api';

const API_BASE = API_BASE_URL;


export const apiClinicalNoteService = {
  async getNotes(filters = {}) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE}/clinical-notes?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch clinical notes');
    return res.json();
  },

  async getNoteById(id) {
    const res = await fetch(`${API_BASE}/clinical-notes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch clinical note');
    return res.json();
  },

  async createNote(payload) {
    const res = await fetch(`${API_BASE}/clinical-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create clinical note');
    return res.json();
  },

  async signNote(id, signatureUrl, authorName) {
    const payload = (typeof signatureUrl === 'object' && signatureUrl !== null)
      ? signatureUrl
      : { signatureUrl, authorName };
    const res = await fetch(`${API_BASE}/clinical-notes/${id}/sign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to sign clinical note');
    return res.json();
  },

  async amendNote(id, addendumText, authorName) {
    const payload = (typeof addendumText === 'object' && addendumText !== null)
      ? addendumText
      : { addendumText, authorName };
    const res = await fetch(`${API_BASE}/clinical-notes/${id}/amend`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to amend clinical note');
    return res.json();
  },

  async generateAiDraft(promptType, inputData) {
    const res = await fetch(`${API_BASE}/clinical-notes/ai-suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptType, inputData })
    });
    if (!res.ok) throw new Error('Failed to generate AI draft');
    return res.json();
  },

  async deleteNote(id) {
    const res = await fetch(`${API_BASE}/clinical-notes/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete clinical note');
    return res.json();
  }
};

