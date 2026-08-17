// src/components/layout/AppLayout.jsx
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../common/ToastContainer';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export const AppLayout = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const location = useLocation();

  // Auto close sidebar on mobile navigation
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname, setSidebarCollapsed]);

  return (
    <div className="app-shell flex flex-col bg-slate-900 font-sans antialiased text-slate-900 print:h-auto print:overflow-visible">
      {/* Top Header — 64px on mobile, 72px-80px on desktop */}
      <header className="h-16 sm:h-20 shrink-0 border-b border-slate-800 bg-slate-900 z-30 print:hidden">
        <TopHeader />
      </header>

      {/* Body Row: sidebar + main */}
      <div className="flex flex-1 min-h-0 relative print:block">
        {/* ── Mobile Overlay Backdrop ── */}
        {!sidebarCollapsed && (
          <div
            className="fixed inset-0 top-16 sm:top-20 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
            aria-label="Close sidebar"
          />
        )}

        {/* ── Sidebar ── */}
        <div
          className={`
            shrink-0 overflow-y-auto overscroll-contain bg-slate-900 border-r border-slate-800 print:hidden
            transition-all duration-300 ease-in-out
            fixed top-16 sm:top-20 left-0 bottom-0 z-50
            lg:static lg:top-auto lg:left-auto lg:bottom-auto lg:z-auto
            ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-none lg:overflow-hidden' : 'translate-x-0 w-64 lg:w-64'}
          `}
        >
          <Sidebar />
        </div>

        {/* ── Main Content ── */}
        <main
          className="
            flex-1 min-w-0 min-h-0
            overflow-y-auto overscroll-y-contain
            bg-[#f8fafc] text-slate-900
            p-4 sm:p-6
            print:p-0 print:overflow-visible print:h-auto
          "
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
