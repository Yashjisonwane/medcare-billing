// src/pages/auth/PermissionDeniedPage.jsx
import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Users } from 'lucide-react';

export const PermissionDeniedPage = () => {
  const { currentUser } = useAuthStore();
  const { toggleDemoDrawer } = useUIStore();
  const navigate = useNavigate();

  const handleReturnHome = () => {
    const role = currentUser?.role?.toLowerCase()?.replace(/\s+/g, '-') || 'super-admin';
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xl max-w-md w-full border border-outline-variant text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-error-container text-error flex items-center justify-center mx-auto">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <h2 className="text-2xl font-extrabold text-on-surface">403 — Access Restricted</h2>
        
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Your current role (<strong className="text-secondary-container">{currentUser?.role || 'User'}</strong>) does not have permission to view this section.
        </p>

        <div className="p-3 bg-surface-container rounded-lg text-[11px] text-on-surface-variant">
          Role-based route guards strictly filter navigation according to operational responsibilities.
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={handleReturnHome}
            className="w-full py-2.5 bg-secondary-container text-white font-bold text-xs rounded-lg hover:bg-secondary transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Role Dashboard
          </button>

          <button
            onClick={toggleDemoDrawer}
            className="w-full py-2 bg-surface-container-high hover:bg-surface-variant text-on-surface font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4 text-secondary-container" />
            Switch Demo Role
          </button>
        </div>
      </div>
    </div>
  );
};
