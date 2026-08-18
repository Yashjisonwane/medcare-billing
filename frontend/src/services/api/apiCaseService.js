const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/v1';

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
  }
};
