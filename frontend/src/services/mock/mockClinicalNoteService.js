const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/v1';

export const mockClinicalNoteService = {
  async getNotes(filters = {}) {
    const params = new URLSearchParams();
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.providerId) params.append('providerId', filters.providerId);
    if (filters.status) params.append('status', filters.status);

    const res = await fetch(`${API_BASE}/clinical-notes?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to retrieve clinical notes.');
    }
    return res.json();
  },

  async getNoteById(id) {
    const res = await fetch(`${API_BASE}/clinical-notes/${id}`);
    if (!res.ok) {
      throw new Error('Failed to retrieve clinical note details.');
    }
    return res.json();
  },

  async createNote(noteData) {
    const res = await fetch(`${API_BASE}/clinical-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create clinical note draft.');
    }
    return res.json();
  },

  async generateAiDraft(promptType, inputData) {
    const res = await fetch(`${API_BASE}/clinical-notes/ai-suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptType, inputData })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate AI SOAP suggestion.');
    }
    return res.json();
  },

  async signNote(id, signatureUrl, authorName) {
    const res = await fetch(`${API_BASE}/clinical-notes/${id}/sign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signatureUrl, authorName })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to sign clinical note.');
    }
    return res.json();
  },

  async amendNote(id, addendumText, authorName) {
    const res = await fetch(`${API_BASE}/clinical-notes/${id}/amend`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addendumText, authorName })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to amend clinical note.');
    }
    return res.json();
  }
};
