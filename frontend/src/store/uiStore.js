// src/store/uiStore.js
import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // Default: collapsed on mobile (< 1024px), open on desktop
  sidebarCollapsed: typeof window !== 'undefined' && window.innerWidth < 1024,
  activeProviderFilter: 'ALL', // 'ALL' | 'prov-josmic' | 'prov-davs' | 'prov-anik' | 'prov-counselor'
  toasts: [],
  demoDrawerOpen: false,

  // UI Display Preferences
  compactMode: false,
  darkMode: false,
  showPatientPhotos: true,

  setCompactMode: (val) => set({ compactMode: val }),
  setDarkMode: (val) => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', val);
    }
    set({ darkMode: val });
  },
  setShowPatientPhotos: (val) => set({ showPatientPhotos: val }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),

  setProviderFilter: (providerId) => set({ activeProviderFilter: providerId }),
  
  toggleDemoDrawer: () => set((state) => ({ demoDrawerOpen: !state.demoDrawerOpen })),
  setDemoDrawerOpen: (val) => set({ demoDrawerOpen: val }),

  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }));
  }
}));
