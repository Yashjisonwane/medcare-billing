import { API_BASE_URL } from '../../config/api';

const API_BASE = API_BASE_URL;


export const mockAttorneyService = {
  async getAttorneys(search = '') {
    try {
      const url = search ? `${API_BASE}/attorneys?search=${encodeURIComponent(search)}` : `${API_BASE}/attorneys`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return [];
    }
  },

  async createAttorney(data) {
    try {
      const res = await fetch(`${API_BASE}/attorneys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to register attorney.');
      }
      return await res.json();
    } catch (e) {
      const newObj = {
        id: `atty-${Date.now()}`,
        ...data,
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };
      FALLBACK_ATTORNEYS.unshift(newObj);
      return newObj;
    }
  }
};
