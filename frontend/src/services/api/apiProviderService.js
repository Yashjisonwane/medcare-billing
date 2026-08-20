import { API_BASE_URL } from '../../config/api';

const API_BASE = API_BASE_URL;


export const apiProviderService = {
  async getProviders() {
    const res = await fetch(`${API_BASE}/providers`);
    if (!res.ok) throw new Error('Failed to retrieve providers.');
    return res.json();
  },

  async addProvider(payload) {
    const res = await fetch(`${API_BASE}/providers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to add provider.');
    }
    return res.json();
  },

  async updateProvider(id, payload) {
    const res = await fetch(`${API_BASE}/providers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update provider ${id}.`);
    }
    return res.json();
  },

  async deleteProvider(id) {
    const res = await fetch(`${API_BASE}/providers/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to delete provider ${id}.`);
    }
    return res.json();
  }
};
