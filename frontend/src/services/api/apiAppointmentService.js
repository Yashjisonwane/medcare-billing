// src/services/api/apiAppointmentService.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/v1';

export const apiAppointmentService = {
  getAllAppointments: async () => {
    try {
      const response = await fetch(`${API_URL}/appointments`);
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
        throw new Error('Failed to create appointment');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating appointment:', error);
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
  }
};
