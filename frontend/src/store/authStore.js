// src/store/authStore.js
import { create } from 'zustand';
import { apiAuthService } from '../services/api/apiAuthService';
import { DEMO_ACCOUNTS } from '../constants/rolePermissions';
import { API_BASE_URL } from '../config/api';

const STORAGE_KEY = 'medpractice_auth_session';
const TOKEN_KEY = 'medpractice_auth_token';

export const useAuthStore = create((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,

  /**
   * Called on app load or route guard
   */
  initSession: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!token && !saved) {
      set({ currentUser: null, isAuthenticated: false, isLoading: false });
      return null;
    }
    set({ isLoading: true });
    try {
      const user = await apiAuthService.getCurrentUser();
      set({ currentUser: user, isAuthenticated: !!user, isLoading: false });
      return user;
    } catch (e) {
      console.error('[Auth Store] Session init failure:', e);
      set({ currentUser: null, isAuthenticated: false, isLoading: false });
      return null;
    }
  },

  /**
   * Email + password login
   */
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const user = await apiAuthService.login(email, password);
      set({ currentUser: user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  /**
   * Quick role switch (demo convenience)
   */
  switchRole: async (roleName) => {
    set({ isLoading: true });
    try {
      const user = await apiAuthService.loginAsRole(roleName, DEMO_ACCOUNTS);
      set({ currentUser: user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  /**
   * Update active user profile and persist to MySQL Backend
   */
  updateProfile: async (updatedData) => {
    const prev = get().currentUser || {};
    const updated = { ...prev, ...updatedData };
    
    // Save locally
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ currentUser: updated });

    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          id: prev.id,
          name: updatedData.name,
          title: updatedData.title,
          email: updatedData.email,
          avatar: updatedData.avatar,
          role: prev.role || 'Super Admin'
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        const merged = { ...updated, ...data.user };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        set({ currentUser: merged });
        return merged;
      }
    } catch (e) {
      console.warn('[Auth Store] Backend sync fallback to local cache:', e);
    }
    return updated;
  },

  /**
   * Logout â€” clears session and token
   */
  logout: async () => {
    set({ isLoading: true });
    await apiAuthService.logout();
    set({ currentUser: null, isAuthenticated: false, isLoading: false });
  },
}));
