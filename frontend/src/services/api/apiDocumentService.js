const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/v1';

export const apiDocumentService = {
  async getDocuments() {
    const res = await fetch(`${API_BASE}/documents`);
    if (!res.ok) {
      throw new Error('Failed to retrieve documents.');
    }
    return res.json();
  },

  async uploadDocument(payload) {
    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload document.');
    }
    return res.json();
  }
};
