import { API_BASE_URL } from '../../config/api';

const API_BASE = API_BASE_URL;


export const apiAuditService = {
  async getLogs(providerId) {
    const url = providerId && providerId !== 'ALL'
      ? `${API_BASE}/audit-logs?providerId=${encodeURIComponent(providerId)}`
      : `${API_BASE}/audit-logs`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Failed to retrieve compliance audit logs.');
    }
    return res.json();
  },

  async logAction(user, action, resource, patientId = 'N/A') {
    const res = await fetch(`${API_BASE}/audit-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, action, resource, patientId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to log action.');
    }
    return res.json();
  }
};
