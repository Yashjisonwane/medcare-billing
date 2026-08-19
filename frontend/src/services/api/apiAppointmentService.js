// src/services/api/apiAppointmentService.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/v1';

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
  }
};

