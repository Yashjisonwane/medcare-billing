// src/components/layout/Sidebar.jsx
import React, { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { ROLES, ROLE_SIDEBAR_NAV } from '../../constants/rolePermissions';
import {
  LayoutDashboard, Users, FileSpreadsheet, Calendar,
  FileText, Bot, ClipboardList, Activity,
  Receipt, CreditCard, PieChart, Layers, Shield,
  Stethoscope, HelpCircle, UserCog, Tag, Globe, CheckCircle2,
  LogOut, X
} from 'lucide-react';

// Icon lookup map
const ICON_MAP = {
  LayoutDashboard, Users, FileSpreadsheet, Calendar,
  FileText, Bot, ClipboardList, Activity,
  Receipt, CreditCard, PieChart, Layers, Shield,
  Stethoscope, HelpCircle, UserCog, Tag, Globe, CheckCircle2
};

// Clean, enterprise navigation sections for clinic staff
const ALL_SECTIONS = (dashboardPath) => [
  {
    title: 'CORE PRACTICE',
    items: [
      { label: 'Dashboard', path: dashboardPath, icon: 'LayoutDashboard' },
      { label: 'Patients', path: '/patients', icon: 'Users' },
      { label: 'Accident Cases', path: '/cases', icon: 'FileSpreadsheet' },
      { label: 'Appointments Calendar', path: '/appointments/calendar', icon: 'Calendar' },
      { label: 'Patient Check-In Queue', path: '/appointments/checkin', icon: 'CheckCircle2' },
    ],
  },
  {
    title: 'CLINICAL & NOTES',
    items: [
      { label: 'Clinical Documentation', path: '/clinical-notes', icon: 'FileText' },
      { label: 'AI Note Assistant', path: '/clinical-notes/ai-assistant', icon: 'Bot' },
      { label: 'Assessments & Forms', path: '/clinical-notes/assessments', icon: 'ClipboardList' },
      { label: 'Treatment Sessions', path: '/treatments', icon: 'Activity' },
    ],
  },
  {
    title: 'FINANCIAL & BILLING',
    items: [
      { label: 'Billing Overview', path: '/billing/overview', icon: 'Receipt' },
      { label: 'Provider Bills Ledger', path: '/billing/provider-bills', icon: 'Layers' },
      { label: 'CMS-1500 Claims', path: '/cms-1500', icon: 'FileText' },
      { label: 'Payments & Adjustments', path: '/billing/payments', icon: 'CreditCard' },
      { label: 'Accounts Aging', path: '/billing/aging', icon: 'PieChart' },
    ],
  },
  {
    title: 'LEGAL & DOCUMENTS',
    items: [
      { label: 'Documents Repository', path: '/documents', icon: 'FileSpreadsheet' },
      { label: 'Patient Packet Builder', path: '/documents/packet-builder', icon: 'Layers' },
    ],
  },
  {
    title: 'ADMINISTRATION',
    items: [
      { label: 'Staff & Team', path: '/admin/staff', icon: 'UserCog' },
      { label: 'Practice Providers', path: '/admin/providers', icon: 'Stethoscope' },
      { label: 'Fee Schedules & CPT', path: '/admin/services', icon: 'Tag' },
      { label: 'Practice Reports', path: '/admin/reports', icon: 'PieChart' },
      { label: 'Audit & Compliance', path: '/admin/audit-logs', icon: 'Shield' },
      { label: 'System Settings', path: '/settings/general', icon: 'HelpCircle' },
    ],
  },
];

export const Sidebar = ({ onCloseMobile }) => {
  const { currentUser, logout } = useAuthStore();
  const { setSidebarCollapsed } = useUIStore();
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = currentUser?.role || ROLES.SUPER_ADMIN;
  const dashboardPath = `/dashboard/${userRole.toLowerCase().replace(/\s+/g, '-')}`;

  // Auto-close sidebar on mobile when location changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname, setSidebarCollapsed]);

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
      if (onCloseMobile) onCloseMobile();
    }
  };

  const handleLogout = async () => {
    await logout();
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
    navigate('/login');
  };

  // Resolve sections for this role
  const roleSections = ROLE_SIDEBAR_NAV[userRole];
  const navSections = (roleSections === 'ALL')
    ? ALL_SECTIONS(dashboardPath)
    : roleSections?.map(section => ({
      ...section,
      items: section.items.map(item => ({
        ...item,
        path: item.path === '/dashboard/DYNAMIC' ? dashboardPath : item.path,
      })),
    })) || ALL_SECTIONS(dashboardPath);

  return (
    <aside className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col justify-between text-slate-300 font-sans text-xs select-none">
      
      {/* â”€â”€ MOBILE ONLY HEADER (Close button) â”€â”€ */}
      <div className="lg:hidden p-3 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/40">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Navigation Menu</span>
        <button
          onClick={() => setSidebarCollapsed(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
          title="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* â”€â”€ SCROLLABLE NAVIGATION ITEMS (Starts directly from top on desktop) â”€â”€ */}
      <div className="flex-1 overflow-y-auto overscroll-contain py-4 px-3 space-y-5">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {section.title}
            </h3>

            <div className="space-y-0.5 pt-0.5">
              {section.items.map((item) => {
                const Icon = ICON_MAP[item.icon] || FileText;

                return (
                  <NavLink
                    key={item.label + item.path}
                    to={item.path}
                    end={item.path === dashboardPath || item.path === '/patients' || item.path === '/cases' || item.path === '/documents'}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs transition cursor-pointer ${isActive
                        ? 'bg-slate-800 text-teal-400 font-bold shadow-xs'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 font-medium'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logged-In User Footer at the bottom */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 shrink-0">
        <div className="p-2 rounded-xl bg-slate-800/70 border border-slate-800 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="relative shrink-0">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'}
                alt={currentUser?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-100 truncate leading-tight">
                {currentUser?.name || 'Staff User'}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {currentUser?.title || userRole}
              </p>
            </div>
          </div>

          {/* Quick Sign Out Action Button */}
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
