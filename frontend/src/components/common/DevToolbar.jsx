// src/components/common/DevToolbar.jsx
import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { DEMO_ACCOUNTS } from '../../constants/rolePermissions';
import { ShieldAlert, Users, RotateCcw, X, Check } from 'lucide-react';

export const DevToolbar = () => {
  const { currentUser, switchRole } = useAuthStore();
  const { demoDrawerOpen, toggleDemoDrawer, addToast } = useUIStore();

  const handleRoleSelect = async (roleName) => {
    await switchRole(roleName);
    addToast(`Switched role to ${roleName} (Demo Access)`, 'info');
    toggleDemoDrawer();
  };

  const handleResetMockData = () => {
    if (window.confirm('Reset all mock patients, bills, notes, and appointments to original demo baseline?')) {
      localStorage.clear();
      addToast('Mock data reset to demo fixtures successfully. Reloading...', 'success');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <>
      {/* Quick Access Floating Pill */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-medium border border-primary-container">
        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          DEMO MODE
        </span>
        <span className="text-gray-400">|</span>
        <button
          onClick={toggleDemoDrawer}
          className="hover:text-secondary-container transition flex items-center gap-1 font-semibold underline"
        >
          <Users className="w-3.5 h-3.5" />
          Switch Role ({currentUser?.role || 'Super Admin'})
        </button>
      </div>

      {/* Demo Role Selector Drawer */}
      {demoDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="bg-surface-container-lowest w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between border-l border-outline-variant overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-secondary-container" />
                    Demo Role Access Switcher
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Select an operational role to demonstrate screen visibilities & workflows.
                  </p>
                </div>
                <button onClick={toggleDemoDrawer} className="p-1 hover:bg-surface-container rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {DEMO_ACCOUNTS.map((account) => {
                  const isActive = currentUser?.role === account.role;
                  return (
                    <button
                      key={account.id}
                      onClick={() => handleRoleSelect(account.role)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                        isActive
                          ? 'border-secondary-container bg-surface-container-low ring-2 ring-secondary-container/30'
                          : 'border-outline-variant hover:bg-surface-container-lowest hover:border-secondary-container/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={account.avatar}
                          alt={account.name}
                          className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                        />
                        <div>
                          <p className="text-sm font-bold text-on-surface">{account.name}</p>
                          <p className="text-xs text-secondary-container font-semibold">{account.role}</p>
                          <p className="text-xs text-on-surface-variant">{account.title}</p>
                        </div>
                      </div>
                      {isActive && <Check className="w-5 h-5 text-secondary-container" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-outline-variant pt-4 mt-6">
              <button
                onClick={handleResetMockData}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-surface-container-high hover:bg-error-container hover:text-error text-xs font-semibold text-on-surface transition"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Mock Data to Initial Fixtures
              </button>
              <p className="text-[11px] text-center text-on-surface-variant mt-2">
                All frontend permissions & local state are visual demo controls.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
