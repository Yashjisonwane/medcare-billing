// src/components/layout/TopHeader.jsx
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { mockProviderService } from '../../services/mock/mockProviderService';
import { Search, Bell, Shield, LogOut, ChevronDown, User, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { FMLogo } from '../common/FMLogo';

export const TopHeader = () => {
  const { currentUser, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, activeProviderFilter, setProviderFilter } = useUIStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [providersList, setProvidersList] = useState([]);
  const navigate = useNavigate();

  const loadProviders = () => {
    mockProviderService.getProviders().then(data => {
      setProvidersList(Object.values(data));
    });
  };

  useEffect(() => {
    loadProviders();
    
    // Listen for custom 'providers-updated' event to refresh list in real-time
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
    <header className="sticky top-0 z-30 bg-slate-900 text-white h-16 sm:h-20 px-4 sm:px-6 flex items-center justify-between shadow-md border-b border-slate-800">
      {/* Left section: Arrow Sidebar Toggle & Branding */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Arrow Sidebar Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSidebar();
          }}
          className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white transition flex items-center justify-center border border-slate-700 shadow-sm cursor-pointer flex-shrink-0"
          title={sidebarCollapsed ? "Expand sidebar menu" : "Collapse sidebar menu"}
          aria-label="Toggle Navigation Sidebar"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>

        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/dashboard/${currentUser?.role?.toLowerCase()?.replace(/\s+/g, '-') || 'super-admin'}`)}>
          <FMLogo className="w-12 h-12 sm:w-16 sm:h-16" fit="contain" shape="rounded-xl" />
          <div className="hidden sm:block">
            <h1 className="text-base sm:text-lg font-serif font-black tracking-wide text-white leading-none">F&amp;M HEALTH &amp; WELLNESS</h1>
            <p className="text-[10px] sm:text-[11px] text-amber-300 font-semibold tracking-wider mt-1 uppercase">Billing &amp; Clinical Platform</p>
          </div>
        </div>
      </div>

      {/* Center Section: Provider Selector & Global Search */}
      <div className="hidden md:flex items-center gap-3 max-w-xl w-full mx-4">
        {/* Provider Dropdown Filter (Available to non-receptionists) */}
        {currentUser?.role !== 'Receptionist' && (
          <div className="relative min-w-[200px]">
            <select
              value={activeProviderFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs font-semibold rounded-xl px-3.5 py-2 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 appearance-none pr-8 cursor-pointer"
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
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        )}

        {/* Global Patient Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search patients, patient IDs, case IDs, or attorneys."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 text-white text-xs rounded-xl pl-9 pr-3 py-2 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder-slate-400"
          />
        </form>
      </div>

      {/* Right Section: Notifications, Role Badge & User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Read-Only Role Badge Pill (No Quick Switcher) */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-xs font-semibold px-3 py-1 rounded-full text-teal-300">
          <Shield className="w-3.5 h-3.5 text-teal-400" />
          <span>Role: {currentUser?.role || 'Super Admin'}</span>
        </div>

        {/* Notifications Popover Trigger */}
        <button className="relative p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'}
              alt={currentUser?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border-2 border-teal-500"
            />
            <span className="hidden lg:block text-xs font-medium text-white">{currentUser?.name?.split(' ')[0]}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-xs text-teal-600 font-semibold">{currentUser?.role}</p>
                <p className="text-[11px] text-slate-500">{currentUser?.email}</p>
              </div>
              <button
                onClick={() => { setUserMenuOpen(false); navigate('/settings/security'); }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-slate-500" />
                Profile & Settings
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
