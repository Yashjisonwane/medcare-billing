const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/v1';

export const mockReminderService = {
  async getSettings() {
    const res = await fetch(`${API_BASE}/reminders/settings`);
    if (!res.ok) {
      throw new Error('Failed to retrieve reminder configurations.');
    }
    return res.json();
  },

  async saveSettings(settings) {
    const res = await fetch(`${API_BASE}/reminders/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to save reminder configurations.');
    }
    return res.json();
  },

  async getLogs() {
    const res = await fetch(`${API_BASE}/reminders/logs`);
    if (!res.ok) {
      throw new Error('Failed to retrieve reminder logs.');
    }
    return res.json();
  },

  async simulatePatientResponse(logId, responseStatus) {
    const res = await fetch(`${API_BASE}/reminders/logs/${logId}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: responseStatus })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to simulate patient response.');
    }
    return res.json();
  }
};
