// src/services/api/apiNotificationService.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/v1';

export const apiNotificationService = {
  getLiveNotifications: async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/live`);
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching live notifications:', error);
      return { unreadCount: 0, notifications: [] };
    }
  },

  getNotificationLogs: async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/logs`);
      if (!response.ok) {
        throw new Error('Failed to fetch reminder logs');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching reminder logs:', error);
      return [];
    }
  },

  testEmailDispatch: async (data) => {
    try {
      const response = await fetch(`${API_URL}/notifications/test-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Failed to send test email');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in testEmailDispatch:', error);
      throw error;
    }
  }
};
