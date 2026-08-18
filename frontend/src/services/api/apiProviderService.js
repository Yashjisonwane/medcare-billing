const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/v1';

export const apiProviderService = {
  async getProviders() {
    const res = await fetch(`${API_BASE}/providers`);
    if (!res.ok) throw new Error('Failed to retrieve providers.');
    return res.json();
  }
};
