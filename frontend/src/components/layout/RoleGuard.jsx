// src/components/layout/RoleGuard.jsx
import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { ROLES, ROLE_ROUTE_PERMISSIONS } from '../../constants/rolePermissions';
import { Navigate, useLocation } from 'react-router-dom';

export const RoleGuard = ({ children }) => {
  const { currentUser, isAuthenticated, isLoading, initSession } = useAuthStore();
  const location = useLocation();

  React.useEffect(() => {
    initSession();
  }, []); // Verify token with backend on mount



  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-secondary-container border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-on-surface-variant">Loading MedPractice Pro...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Always allow the 403 page itself to render (prevents infinite redirect loop)
  if (location.pathname === '/403') {
    return children;
  }

  const role = currentUser.role || ROLES.SUPER_ADMIN;
  // Fallback: if the stored role is no longer recognized (e.g., stale "Clinic Admin" in localStorage),
  // treat as Super Admin so the app doesn't break.
  const allowedRoutes = ROLE_ROUTE_PERMISSIONS[role] || ['*'];

  // Super admin (or unrecognized -> fallback) has full access
  if (allowedRoutes.includes('*')) {
    return children;
  }

  const isAllowed = allowedRoutes.some(pattern => {
    if (pattern === '*') return true;
    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -2);
      return location.pathname === prefix || location.pathname.startsWith(prefix + '/');
    }
    const regexPattern = '^' + pattern.replace(/:\w+/g, '[^/]+').replace(/\*/g, '.*') + '$';
    return new RegExp(regexPattern).test(location.pathname);
  });

  if (!isAllowed) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

