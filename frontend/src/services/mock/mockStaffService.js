// src/services/mock/mockStaffService.js
import { DEMO_ACCOUNTS } from '../../constants/rolePermissions';

const STORAGE_KEY = 'medpractice_staff';

export const mockStaffService = {
  async getStaff() {
    await new Promise(res => setTimeout(res, 200));
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEMO_ACCOUNTS;
  },

  async createStaff(staffData) {
    await new Promise(res => setTimeout(res, 300));
    const staff = await this.getStaff();
    const newMember = {
      id: `usr-${Date.now()}`,
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      ...staffData
    };
    staff.push(newMember);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
    return newMember;
  }
};
