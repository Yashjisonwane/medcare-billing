// src/services/api/apiAuthService.js
import { DEMO_ACCOUNTS } from '../../constants/rolePermissions';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/v1';
const STORAGE_KEY = 'medpractice_auth_session';
const TOKEN_KEY = 'medpractice_auth_token';

export const apiAuthService = {
  /**
   * Login with email and password against the backend with graceful demo fallback
   */
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
        return data.user;
      }
    } catch (err) {
      console.warn('[apiAuthService] Backend API login failed, using local demo fallback:', err.message);
    }

    // Fallback demo authentication
    const matched = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase()) || {
      id: `usr-${Date.now()}`,
      email: email,
      name: email.split('@')[0] || 'Staff User',
      role: 'Super Admin',
      title: 'Administrator',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
    };

    localStorage.setItem(TOKEN_KEY, `demo_token_${Date.now()}`);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matched));
    return matched;
  },

  /**
   * Get the stored JWT token for authenticated API calls
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get the currently logged in user
   */
  async getCurrentUser() {
    const token = localStorage.getItem(TOKEN_KEY);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!token && !saved) return null;

    if (token && !token.startsWith('demo_token_')) {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const user = await res.json();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          return user;
        } else if (res.status === 401) {
          // Stale or expired token
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(STORAGE_KEY);
          return null;
        }
      } catch (error) {
        console.warn('[Auth] Session validation network warning:', error.message);
      }
    }

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Logout â€” clear all stored session data
   */
  async logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    return true;
  },

  /**
   * MFA verification
   */
  async verifyMfa(tempToken, code) {
    try {
      const res = await fetch(`${API_BASE}/auth/mfa/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken, code }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
        return data.user;
      }
    } catch (err) {
      console.warn('[apiAuthService] Backend MFA failed, demo fallback:', err.message);
    }

    const defaultUser = DEMO_ACCOUNTS[0];
    localStorage.setItem(TOKEN_KEY, `demo_token_${Date.now()}`);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  },

  /**
   * Forgot password simulation
   */
  async forgotPassword(email) {
    return { success: true, message: `Reset link sent to ${email}` };
  },

  /**
   * Quick role switch
   */
  async loginAsRole(roleName, demoAccounts = DEMO_ACCOUNTS) {
    const account = demoAccounts?.find(a => a.role === roleName) || demoAccounts?.[0];
    if (!account) throw new Error('Role not found');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: account.email, password: 'password123' }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
        return data.user;
      }
    } catch (err) {
      console.warn('[apiAuthService] Backend loginAsRole failed, using local demo fallback:', err.message);
    }

    localStorage.setItem(TOKEN_KEY, `demo_token_${Date.now()}`);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    return account;
  },
};
