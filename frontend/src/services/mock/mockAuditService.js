// src/services/mock/mockAuditService.js
import { INITIAL_AUDIT_LOGS } from './mockDataFixtures';

const STORAGE_KEY = 'medpractice_audit_logs';

export const mockAuditService = {
  async getLogs() {
    await new Promise(res => setTimeout(res, 200));
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
  },

  async logAction(user, action, resource, patientId = 'N/A') {
    const logs = await this.getLogs();
    const newEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: user?.name || 'Demo User',
      role: user?.role || 'Clinician',
      action,
      resource,
      patientId,
      ipAddress: '192.168.1.100 (Demo Session)'
    };
    logs.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    return newEntry;
  }
};
