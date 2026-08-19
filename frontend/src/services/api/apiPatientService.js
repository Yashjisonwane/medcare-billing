const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/v1';

export const apiPatientService = {
  async getPatients(filters = {}) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE}/patients?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch patients');
    return res.json();
  }
};
