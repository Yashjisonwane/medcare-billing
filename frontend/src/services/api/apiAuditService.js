const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/v1';

export const apiAuditService = {
  async getLogs() {
    const res = await fetch(`${API_BASE}/audit-logs`);
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
