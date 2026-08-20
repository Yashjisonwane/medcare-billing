// src/components/layout/TopHeader.jsx
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { mockProviderService } from '../../services/mock/mockProviderService';
import { apiNotificationService } from '../../services/api/apiNotificationService';
import { 
  Search, Bell, Shield, LogOut, ChevronDown, User, Activity, 
  ChevronLeft, ChevronRight, Menu, Pen, Sparkles, CheckCircle2, 
  Clock, DollarSign, MessageSquare, ExternalLink, X, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FMLogo } from '../common/FMLogo';
import { EditProfileModal } from '../modals/EditProfileModal';

export const TopHeader = () => {
  const { currentUser, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, activeProviderFilter, setProviderFilter } = useUIStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [providersList, setProvidersList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const navigate = useNavigate();

  const loadProviders = () => {
    mockProviderService.getProviders().then(data => {
      setProvidersList(Object.values(data));
    }).catch(() => {});
  };

  const loadNotifications = async () => {
    try {
      setLoadingNotifs(true);
      const data = await apiNotificationService.getLiveNotifications();
      if (data) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    loadProviders();
    loadNotifications();

    window.addEventListener('providers-updated', loadProviders);
    window.addEventListener('appointment-created', loadNotifications);
    window.addEventListener('bill-updated', loadNotifications);

    // Periodic poll every 30s
    const timer = setInterval(loadNotifications, 30000);

    return () => {
      window.removeEventListener('providers-updated', loadProviders);
      window.removeEventListener('appointment-created', loadNotifications);
      window.removeEventListener('bill-updated', loadNotifications);
      clearInterval(timer);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/patients?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (notif) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    setNotifMenuOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="w-full h-full px-3 sm:px-6 flex items-center justify-between text-white select-none gap-4">
      {/* -- Left section: Sidebar Toggle & Full Branding Title -- */}
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

      {/* -- Center Section: Provider Filter & Global Search -- */}
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

      {/* -- Right Section: Role Pill + Notification Bell + User Profile -- */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Role Badge Pill */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full text-teal-300 shrink-0">
          <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span>Role: {currentUser?.role || 'Super Admin'}</span>
        </div>

        {/* Notifications Trigger & Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setNotifMenuOpen(!notifMenuOpen);
              setUserMenuOpen(false);
            }}
            className={`relative p-2 rounded-xl transition cursor-pointer shrink-0 ${
              notifMenuOpen ? 'bg-slate-800 text-teal-400' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Notifications & Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-900 shadow-sm animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900">Practice Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-700 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-bold text-teal-600 hover:text-teal-800 transition cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                {loadingNotifs ? (
                  <div className="p-6 text-center text-xs text-slate-400">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">All caught up!</p>
                    <p className="text-[11px] text-slate-400">No new alerts or scheduled notifications.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${
                        !notif.read ? 'bg-teal-50/40' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        notif.type === 'CHECK_IN' ? 'bg-teal-100 text-teal-700' :
                        notif.type === 'BILLING' ? 'bg-amber-100 text-amber-700' :
                        notif.type === 'REMINDER' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-cyan-100 text-cyan-700'
                      }`}>
                        {notif.type === 'CHECK_IN' ? <CheckCircle2 className="w-4 h-4" /> :
                         notif.type === 'BILLING' ? <DollarSign className="w-4 h-4" /> :
                         notif.type === 'REMINDER' ? <MessageSquare className="w-4 h-4" /> :
                         <Clock className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <p className="text-xs font-extrabold text-slate-900 truncate">{notif.title}</p>
                          {notif.badge && (
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md border shrink-0 ${notif.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                              {notif.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{notif.message}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                          {notif.time && <span>{notif.time}</span>}
                          {notif.date && <span>• {notif.date}</span>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Nav Links */}
              <div className="pt-2 px-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs font-bold">
                <button
                  onClick={() => { setNotifMenuOpen(false); navigate('/appointments/calendar'); }}
                  className="py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
                >
                  View Calendar
                </button>
                <button
                  onClick={() => { setNotifMenuOpen(false); navigate('/appointments/checkin'); }}
                  className="py-1.5 px-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 transition"
                >
                  Lobby Check-in
                </button>
              </div>
            </div>
          )}
        </div>

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
