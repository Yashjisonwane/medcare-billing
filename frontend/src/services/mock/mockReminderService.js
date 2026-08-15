// src/services/mock/mockReminderService.js

const SETTINGS_KEY = 'medpractice_reminder_settings';
const LOGS_KEY = 'medpractice_reminder_logs';

const DEFAULT_SETTINGS = {
  enable24hSms: true,
  enable2hEmail: true,
  enableMissedFollowUp: true,
  smsTemplate: 'Reminder: Hello {PATIENT_NAME}, your upcoming medical appointment is scheduled for {APT_DATE} at {APT_TIME}. Reply 1 to confirm.',
  emailTemplate: 'Dear {PATIENT_NAME},\n\nThis is a reminder for your upcoming medical visit on {APT_DATE} at {APT_TIME}.\n\nPlease contact our office if you need to reschedule.'
};

const DEFAULT_LOGS = [
  {
    id: 'rem-log-001',
    patientName: 'Demo Patient 001',
    channel: 'SMS',
    sentAt: '2026-08-04 08:00 AM',
    recipient: '713-555-0199',
    status: 'Sent - Demo',
    messagePreview: 'Reminder: Hello Demo Patient 001, your appointment is today at 09:00 AM.'
  },
  {
    id: 'rem-log-002',
    patientName: 'Jane Smith (Demo)',
    channel: 'EMAIL',
    sentAt: '2026-08-03 04:00 PM',
    recipient: 'janesmith@example.test',
    status: 'Delivered - Confirmed',
    messagePreview: 'Dear Jane Smith, your visit is scheduled for 2026-08-04 at 10:30 AM.'
  }
];

export const mockReminderService = {
  async getSettings() {
    await new Promise(res => setTimeout(res, 150));
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },

  async saveSettings(settings) {
    await new Promise(res => setTimeout(res, 250));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  },

  async getLogs() {
    await new Promise(res => setTimeout(res, 200));
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : DEFAULT_LOGS;
  },

  async simulatePatientResponse(logId, responseStatus) {
    await new Promise(res => setTimeout(res, 200));
    const logs = (await this.getLogs()).map(l => {
      if (l.id === logId) {
        return { ...l, status: responseStatus };
      }
      return l;
    });
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    return logs;
  }
};
