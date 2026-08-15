// src/store/authStore.js
import { create } from 'zustand';
import { mockAuthService } from '../services/mock/mockAuthService';
import { DEMO_ACCOUNTS } from '../constants/rolePermissions';

const STORAGE_KEY = 'medpractice_auth_session';

const VALID_ROLES = new Set(DEMO_ACCOUNTS.map(a => a.role));

const getInitialUser = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // If role no longer exists (e.g., 'Clinic Admin' removed), clear stale session
      if (parsed?.role && !VALID_ROLES.has(parsed.role)) {
        console.warn(`[Auth] Stale role "${parsed.role}" cleared — redirecting to login`);
        localStorage.removeItem(STORAGE_KEY);
        return null; // Force re-login
      }
      return parsed;
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
      return null; // Corrupt session — force re-login
    }
  }
  return null; // No session found — must log in
};


const initialUser = getInitialUser();

export const useAuthStore = create((set, get) => ({
  currentUser: initialUser,
  isAuthenticated: !!initialUser,
  isLoading: false,
  isDemoMode: true,

  initSession: async () => {
    const user = await mockAuthService.getCurrentUser();
    set({ currentUser: user, isAuthenticated: !!user, isLoading: false });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const user = await mockAuthService.login(email, password);
      set({ currentUser: user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  switchRole: async (roleName) => {
    set({ isLoading: true });
    const user = await mockAuthService.loginAsRole(roleName);
    set({ currentUser: user, isAuthenticated: true, isLoading: false });
    return user;
  },

  logout: async () => {
    set({ isLoading: true });
    await mockAuthService.logout();
    set({ currentUser: null, isAuthenticated: false, isLoading: false });
  },

  toggleDemoMode: () => {
    set((state) => ({ isDemoMode: !state.isDemoMode }));
  }
}));
