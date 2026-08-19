// src/components/layout/TopHeader.jsx
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { mockProviderService } from '../../services/mock/mockProviderService';
import { Search, Bell, Shield, LogOut, ChevronDown, User, Activity, ChevronLeft, ChevronRight, Menu, Pen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FMLogo } from '../common/FMLogo';
import { EditProfileModal } from '../modals/EditProfileModal';

export const TopHeader = () => {
  const { currentUser, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, activeProviderFilter, setProviderFilter } = useUIStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [providersList, setProvidersList] = useState([]);
  const navigate = useNavigate();

  const loadProviders = () => {
    mockProviderService.getProviders().then(data => {
      setProvidersList(Object.values(data));
    }).catch(() => {});
  };

  useEffect(() => {
    loadProviders();
    window.addEventListener('providers-updated', loadProviders);
    return () => window.removeEventListener('providers-updated', loadProviders);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/patients?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="w-full h-full px-3 sm:px-6 flex items-center justify-between text-white select-none gap-4">
      {/* â”€â”€ Left section: Sidebar Toggle & Full Branding Title â”€â”€ */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSidebar();
          }}
          className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white transition flex items-center justify-center border border-slate-700 shadow-sm cursor-pointer shrink-0"
          title={sidebarCollapsed ? "Expand sidebar menu" : "Collapse sidebar menu"}
          aria-label="Toggle Navigation Sidebar"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5 hidden lg:block" />
          ) : (
            <ChevronLeft className="w-5 h-5 hidden lg:block" />
          )}
          <Menu className="w-5 h-5 lg:hidden" />
        </button>

        {/* Branding Logo & Title */}
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={() => navigate(`/dashboard/${currentUser?.role?.toLowerCase()?.replace(/\s+/g, '-') || 'super-admin'}`)}
        >
          <FMLogo className="w-11 h-11 sm:w-14 sm:h-14 shrink-0" fit="contain" shape="rounded-xl" />
          <div className="flex flex-col justify-center">
            <h1 className="text-sm sm:text-base md:text-lg font-serif font-black tracking-wide text-white leading-tight whitespace-nowrap">
              F&amp;M HEALTH &amp; WELLNESS
            </h1>
            <p className="text-[10px] sm:text-[11px] text-amber-300 font-bold tracking-wider uppercase whitespace-nowrap leading-tight mt-1">
              Billing &amp; Clinical Platform
            </p>
          </div>
        </div>
      </div>

      {/* â”€â”€ Center Section: Provider Filter & Global Search â”€â”€ */}
      <div className="hidden lg:flex items-center justify-center flex-1 max-w-xl mx-4 min-w-0">
        <div className="flex items-center gap-3 w-full">
          {/* Provider Dropdown */}
          {currentUser?.role !== 'Receptionist' && (
            <div className="relative shrink-0 min-w-[210px]">
              <select
                value={activeProviderFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl px-3.5 py-2 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 appearance-none pr-8 cursor-pointer outline-none"
              >
                <option value="ALL">All Practice Providers ({providersList.length + 2} Modalities)</option>
                {providersList.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.name} {prov.isPlaceholder ? '(Pending Docs)' : ''}
                  </option>
                ))}
                <option value="srv-trigger-point">Trigger Point Injection (Pending Config)</option>
                <option value="srv-tecar-therapy">TECAR Therapy (Pending Config)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Global Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search patients, MRN, accident cases, or attorneys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/90 text-white text-xs rounded-xl pl-9 pr-3 py-2 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder-slate-400 outline-none transition"
            />
          </form>
        </div>
      </div>

      {/* â”€â”€ Right Section: Role Pill + Notification Bell + User Profile â”€â”€ */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Role Badge Pill */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full text-teal-300 shrink-0">
          <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span>Role: {currentUser?.role || 'Super Admin'}</span>
        </div>

        {/* Notifications Trigger */}
        <button
          type="button"
          onClick={() => navigate('/appointments/calendar')}
          className="relative p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'}
              alt={currentUser?.name || 'User'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-teal-500 shrink-0 shadow-xs"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-tight">
                {currentUser?.name || 'Sarah Connor'}
              </p>
              <p className="text-[10px] text-teal-400 font-semibold">
                {currentUser?.role || 'Super Admin'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block shrink-0" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-sm font-extrabold text-slate-900">{currentUser?.name || 'Staff User'}</p>
                <p className="text-xs text-teal-600 font-bold">{currentUser?.title || currentUser?.role || 'Super Admin'}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">{currentUser?.email}</p>
              </div>

              {/* Edit Profile Action */}
              <button
                onClick={() => { setUserMenuOpen(false); setIsEditProfileOpen(true); }}
                className="w-full text-left px-4 py-2.5 text-xs text-teal-700 hover:bg-teal-50 flex items-center gap-2 cursor-pointer font-bold transition"
              >
                <Pen className="w-4 h-4 text-teal-600" />
                Edit My Profile &amp; Avatar
              </button>

              <button
                onClick={() => { setUserMenuOpen(false); navigate('/settings/general'); }}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium transition"
              >
                <User className="w-4 h-4 text-slate-400" />
                Clinic Settings &amp; Profile
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold cursor-pointer transition"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};
