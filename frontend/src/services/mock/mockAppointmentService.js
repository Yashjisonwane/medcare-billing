const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/v1';

export const mockAppointmentService = {
  async getAppointments(filters = {}) {
    const params = new URLSearchParams();
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.providerId) params.append('providerId', filters.providerId);
    if (filters.date) params.append('date', filters.date);

    const res = await fetch(`${API_BASE}/appointments?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to retrieve appointments.');
    }
    return res.json();
  },

  async createAppointment(aptData) {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aptData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to schedule appointment.');
    }
    return res.json();
  },

  async getAvailableSlots(providerId, dateStr) {
    const res = await fetch(`${API_BASE}/appointments/available-slots?providerId=${providerId}&date=${dateStr}`);
    if (!res.ok) {
      throw new Error('Failed to retrieve available slots.');
    }
    return res.json();
  },

  async autoBookAppointment(bookingData) {
    const res = await fetch(`${API_BASE}/appointments/auto-book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to self-book appointment.');
    }
    return res.json();
  },

  async searchPatientBookings(queryStr) {
    if (!queryStr || !queryStr.trim()) return [];
    const q = queryStr.trim().toLowerCase();
    
    const res = await fetch(`${API_BASE}/appointments`);
    if (!res.ok) {
      throw new Error('Failed to retrieve appointments list.');
    }
    const apts = await res.json();
    
    return apts.filter(a => {
      const matchPhone = a.patientPhone && a.patientPhone.replaceAll('-', '').includes(q.replaceAll('-', ''));
      const matchEmail = a.patientEmail && a.patientEmail.toLowerCase().includes(q);
      const matchRef = a.bookingRef && a.bookingRef.toLowerCase().includes(q);
      const matchName = a.patientName && a.patientName.toLowerCase().includes(q);
      return matchPhone || matchEmail || matchRef || matchName;
    });
  },

  async updateStatus(id, newStatus) {
    const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update appointment status.');
    }
    return res.json();
  },

  async reschedule(id, newDate, newStartTime, newEndTime, reason) {
    const res = await fetch(`${API_BASE}/appointments/${id}/reschedule`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: newDate,
        startTime: newStartTime,
        endTime: newEndTime,
        reason
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to reschedule appointment.');
    }
    return res.json();
  },

  async cancel(id, reason) {
    const res = await fetch(`${API_BASE}/appointments/${id}/cancel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to cancel appointment.');
    }
    return res.json();
  },

  async updateAppointment(id, updateData) {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update appointment details.');
    }
    return res.json();
  }
};
