import { API_BASE_URL } from '../../config/api';

const API_BASE = API_BASE_URL;


export const mockDocumentService = {
  async getDocuments(filters = {}) {
    const params = new URLSearchParams();
    if (filters.providerName) params.append('providerName', filters.providerName);
    if (filters.type) params.append('type', filters.type);

    const res = await fetch(`${API_BASE}/documents?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to retrieve case documents.');
    }
    return res.json();
  },

  async uploadDocument(docData) {
    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload document.');
    }
    return res.json();
  },

  async buildPatientPacket(selectedDocIds, caseId) {
    const res = await fetch(`${API_BASE}/documents/packet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedDocIds, caseId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to bundle patient packet.');
    }
    return res.json();
  }
};
