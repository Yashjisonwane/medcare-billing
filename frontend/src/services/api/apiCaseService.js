const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/v1';

export const apiCaseService = {
  async getCases(filters = {}) {
    const params = new URLSearchParams();
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/cases?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to retrieve cases.');
    }
    return res.json();
  },

  async getCaseById(id) {
    if (!id) return null;
    const res = await fetch(`${API_BASE}/cases/${id}`);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to retrieve case ${id}.`);
    }
    return res.json();
  },

  async createCase(payload) {
    const res = await fetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create accident case.');
    }
    return res.json();
  },

  async updateCase(id, payload) {
    const res = await fetch(`${API_BASE}/cases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update case.');
    }
    return res.json();
  }
};
