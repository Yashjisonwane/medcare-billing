import { API_BASE_URL } from '../../config/api';

const API_URL = API_BASE_URL;


export const apiAppointmentService = {
  getAllAppointments: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const url = query ? `${API_URL}/appointments?${query}` : `${API_URL}/appointments`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create appointment');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  rescheduleAppointment: async (id, rescheduleData) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${id}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rescheduleData),
      });
      if (!response.ok) {
        throw new Error('Failed to reschedule appointment');
      }
      return await response.json();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error;
    }
  },

  cancelAppointment: async (id, cancelReason) => {
    try {
      const response = await fetch(`${API_URL}/appointments/${id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cancelReason }),
      });
      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }
      return await response.json();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  },

  getAvailableSlots: async (providerId, dateStr) => {
    try {
      const res = await fetch(`${API_URL}/appointments/available-slots?providerId=${providerId}&date=${dateStr}`);
      if (!res.ok) throw new Error('Failed to retrieve available slots.');
      return await res.json();
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  },

  autoBookAppointment: async (bookingData) => {
    try {
      const res = await fetch(`${API_URL}/appointments/auto-book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to self-book appointment.');
      }
      return await res.json();
    } catch (error) {
      console.error('Error auto-booking appointment:', error);
      throw error;
    }
  },

  searchPatientBookings: async (queryStr) => {
    try {
      if (!queryStr || !queryStr.trim()) return [];
      const q = queryStr.trim().toLowerCase();
      
      const res = await fetch(`${API_URL}/appointments`);
      if (!res.ok) {
        throw new Error('Failed to retrieve appointments list.');
      }
      const apts = await res.json();
      
      return apts.filter(a => {
        const patientFullName = a.patient ? `${a.patient.firstName || ''} ${a.patient.lastName || ''}`.trim().toLowerCase() : '';
        const matchPhone = (a.patientPhone || a.patient?.phone || '').replaceAll('-', '').includes(q.replaceAll('-', ''));
        const matchEmail = (a.patientEmail || a.patient?.email || '').toLowerCase().includes(q);
        const matchRef = (a.bookingRef || a.id || '').toLowerCase().includes(q);
        const matchName = (a.patientName || patientFullName).toLowerCase().includes(q);
        return matchPhone || matchEmail || matchRef || matchName;
      });
    } catch (error) {
      console.error('Error searching patient bookings:', error);
      throw error;
    }
  }
};

