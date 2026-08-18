const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/v1';

export const mockStaffService = {
  async getStaff() {
    const res = await fetch(`${API_BASE}/staff`);
    if (!res.ok) {
      throw new Error('Failed to retrieve staff directory.');
    }
    return res.json();
  },

  async createStaff(staffData) {
    const res = await fetch(`${API_BASE}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create staff account.');
    }
    return res.json();
  },

  async updateStaff(id, staffData) {
    const res = await fetch(`${API_BASE}/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update staff account.');
    }
    return res.json();
  },

  async deleteStaff(id) {
    const res = await fetch(`${API_BASE}/staff/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete staff account.');
    }
    return res.json();
  }
};
