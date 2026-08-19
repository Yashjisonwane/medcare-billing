// src/services/mock/mockAuthService.js
import { DEMO_ACCOUNTS } from '../../constants/rolePermissions';

const STORAGE_KEY = 'medpractice_auth_session';

export const mockAuthService = {
  async login(email, password) {
    await new Promise(res => setTimeout(res, 300));
    const user = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Fallback demo account assignment for custom input
      const demoUser = {
        id: `usr-${Date.now()}`,
        email: email,
        name: email.split('@')[0],
        role: 'Clinic Admin',
        title: 'Clinic Manager',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
      return demoUser;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async loginAsRole(roleName) {
    await new Promise(res => setTimeout(res, 200));
    const account = DEMO_ACCOUNTS.find(a => a.role === roleName) || DEMO_ACCOUNTS[0];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    return account;
  },

  async getCurrentUser() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEMO_ACCOUNTS[0]; // Default to Super Admin in demo mode
    try {
      return JSON.parse(saved);
    } catch (e) {
      return DEMO_ACCOUNTS[0];
    }
  },

  async logout() {
    await new Promise(res => setTimeout(res, 100));
    localStorage.removeItem(STORAGE_KEY);
    return true;
  },

  async verifyMfa(pin) {
    await new Promise(res => setTimeout(res, 300));
    return pin === '123456' || pin.length === 6;
  },

  async forgotPassword(email) {
    await new Promise(res => setTimeout(res, 300));
    return { success: true, message: `Reset link sent to ${email} (Demo Simulation)` };
  }
};
