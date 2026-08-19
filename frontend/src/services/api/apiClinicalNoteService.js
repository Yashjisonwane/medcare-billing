const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/v1';

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

  async signNote(id, payload) {
    const res = await fetch(`${API_BASE}/clinical-notes/${id}/sign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to sign clinical note');
    return res.json();
  },

  async amendNote(id, payload) {
    const res = await fetch(`${API_BASE}/clinical-notes/${id}/amend`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to amend clinical note');
    return res.json();
  }
};
