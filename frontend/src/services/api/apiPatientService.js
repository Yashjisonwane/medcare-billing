import { API_BASE_URL } from '../../config/api';

const API_BASE = API_BASE_URL;


export const apiPatientService = {
  async getPatients(filters = {}) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE}/patients?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch patients');
    return res.json();
  },

  async getPatientById(id) {
    const res = await fetch(`${API_BASE}/patients/${id}`);
    if (!res.ok) throw new Error('Failed to fetch patient profile');
    return res.json();
  },

  async createPatient(payload) {
    const res = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create patient profile');
    return res.json();
  },

  async updatePatient(id, payload) {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update patient profile');
    return res.json();
  },

  async deletePatient(id) {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete patient profile');
    return res.json();
  }
};
