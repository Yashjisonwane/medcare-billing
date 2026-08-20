import { API_BASE_URL } from '../../config/api';

const API_BASE = API_BASE_URL;


export const mockCaseService = {
  async getCases(filters = {}) {
    const params = new URLSearchParams();
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/cases?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to retrieve cases list.');
    }
    return res.json();
  },

  async getCaseById(id) {
    const res = await fetch(`${API_BASE}/cases/${id}`);
    if (!res.ok) {
      throw new Error('Failed to retrieve case details.');
    }
    return res.json();
  },

  async createCase(caseData) {
    // If patientId is missing (e.g. from a form wrapper), let's ensure it is parsed correctly
    const res = await fetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to register patient case.');
    }
    return res.json();
  },

  async updateCase(id, caseData) {
    const res = await fetch(`${API_BASE}/cases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update accident case.');
    }
    return res.json();
  },

  async updateAssignedProviders(caseId, providerIds) {
    const res = await fetch(`${API_BASE}/cases/${caseId}/providers`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providerIds })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update case providers.');
    }
    return res.json();
  },

  async deleteCase(id) {
    const res = await fetch(`${API_BASE}/cases/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete accident case.');
    }
    return res.json();
  }
};
