import { API_BASE_URL } from '../../config/api';

const API_BASE = API_BASE_URL;


export const mockProviderService = {
  async getProviders() {
    const res = await fetch(`${API_BASE}/providers`);
    if (!res.ok) {
      throw new Error('Failed to retrieve provider registry.');
    }
    const data = await res.json();
    return Array.isArray(data) ? data : Object.values(data);
  },

  async addProvider(providerData) {
    const res = await fetch(`${API_BASE}/providers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(providerData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to register practice provider.');
    }
    const created = await res.json();
    
    // Dispatch event to update layout bindings
    window.dispatchEvent(new Event('providers-updated'));
    return created;
  },

  async updateProvider(id, providerData) {
    const res = await fetch(`${API_BASE}/providers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(providerData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update provider profile.');
    }
    const updated = await res.json();
    
    window.dispatchEvent(new Event('providers-updated'));
    return updated;
  }
};
