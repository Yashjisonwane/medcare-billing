// src/pages/auth/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, CheckCircle2,
  Zap, Sparkles, Stethoscope, Brain, Building2, Eye, EyeOff, KeyRound, ShieldAlert
} from 'lucide-react';
import { DEMO_ACCOUNTS } from '../../constants/rolePermissions';
import { FMLogo } from '../../components/common/FMLogo';
import { mockAuthService } from '../../services/mock/mockAuthService';
import clinicBg from '../../assets/medical_clinic_login_bg.png';

const ROLE_COLORS = {
  'Super Admin':  'bg-violet-100 text-violet-800 border-violet-200',
  'Receptionist': 'bg-blue-100 text-blue-800 border-blue-200',
  'Doctor':       'bg-teal-100 text-teal-800 border-teal-200',
  'Therapist':    'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Counselor':    'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Billing Staff':'bg-rose-100 text-rose-800 border-rose-200',
};

export const LoginPage = () => {
  const [viewMode, setViewMode] = useState('login');

  // Login Form States
  const [email, setEmail] = useState('admin@example.test');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('admin@example.test');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login, switchRole } = useAuthStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  // Ensure loading state is clean on mount
  useEffect(() => {
    useAuthStore.setState({ isLoading: false });
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name || 'Staff User'}!`, 'success');
      navigate(`/dashboard/${(user.role || 'super-admin').toLowerCase().replace(/\s+/g, '-')}`);
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid login credentials for staff account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickRoleSelect = async (account) => {
    setError('');
    setIsSubmitting(true);
    try {
      const user = await switchRole(account.role);
      addToast(`Authenticated as ${user.name} (${user.role})`, 'success');
      navigate(`/dashboard/${(user.role || 'super-admin').toLowerCase().replace(/\s+/g, '-')}`);
    } catch (err) {
      console.error('Quick role switch error:', err);
      setError('Failed to log in as selected role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await mockAuthService.forgotPassword(forgotEmail);
      setForgotSubmitted(true);
      addToast(`Password recovery link dispatched to ${forgotEmail}`, 'success');
    } catch {
      addToast('Failed to send recovery link', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-slate-950 text-slate-900 overflow-y-auto lg:overflow-hidden touch-scroll select-none">

      {/* ══════════════════════════════════════════════════════════════════════
          LEFT SIDE: Medical Clinic Hero Panel (42% - 45%) - Fixed Zero Scroll
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex relative w-full lg:w-[44%] xl:w-[42%] lg:h-full lg:min-h-0 flex-col lg:justify-between p-5 sm:p-6 lg:p-7 xl:p-8 text-white shrink-0 overflow-hidden">
        {/* Background Medical Clinic Photo */}
        <img
          src={clinicBg}
          alt="Modern Medical Clinic Center"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90"
        />
        {/* Dark Vignette Overlay for High Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/70" />

        {/* Top Branding */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/95 border border-white/20 shadow-xl inline-flex max-w-full">
            <FMLogo className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0" fit="contain" shape="rounded-lg" />
            <div className="min-w-0 pr-2">
              <h2 className="text-xs sm:text-sm font-serif font-black text-white leading-tight truncate">
                F&amp;M HEALTH &amp; WELLNESS
              </h2>
              <p className="text-[9px] text-amber-300 font-bold tracking-wider uppercase">
                Relieve Pain • Heal Mind • Restore Life
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-1 hidden lg:block">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-400/30 rounded-full text-[10px] font-bold shadow-xs">
              <Sparkles className="w-3 h-3 text-teal-300" /> 6-Practice Integrated Medical Platform
            </span>
            <h1 className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              Enterprise Medical Practice &amp; Billing Operations
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md drop-shadow-xs">
              Standardized clinical intake, AI doctor notes, automated appointment reminders &amp; 4-provider legal billing ledgers.
            </p>
          </div>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 space-y-2 my-auto py-3 max-w-md hidden sm:block">
          {[
            { icon: Stethoscope, title: 'Pain Management & Physician Consults', sub: 'JOSMIC Wellness Center (CPT 99204)' },
            { icon: Activity, title: 'Shockwave ESWT & Laser Therapy', sub: "DAV'S Anatomy & ANIK Laser Procedures" },
            { icon: Brain, title: 'Behavioral Health & Trauma Counseling', sub: 'PTSD & Psychotherapy (CPT 90834, 90791)' },
            { icon: Building2, title: 'Legal Lien & CMS-1500 Billing Integration', sub: 'Connected 4-Provider Statements & Ledgers' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/70 backdrop-blur-md border border-white/10 text-xs shadow-xs">
                <div className="p-1 rounded-lg bg-teal-500/20 text-teal-300 flex-shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <strong className="text-white block truncate text-[11px]">{item.title}</strong>
                  <span className="text-[10px] text-slate-400 truncate block">{item.sub}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom HIPAA Footnote */}
        <div className="relative z-10 pt-2 border-t border-white/15 text-[11px] text-slate-300 flex items-center justify-between hidden lg:flex">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>HIPAA-Compliant Encrypted Architecture</span>
          </div>
          <span className="text-[9px] font-mono text-teal-300 font-bold bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-800">
            v2.6 Live
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          RIGHT SIDE: In-Place Switchable Panel (Login View <-> Forgot Password)
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 lg:h-full bg-white flex flex-col justify-between p-5 sm:p-6 lg:p-7 xl:p-8 lg:overflow-y-auto">
        <div className="max-w-xl w-full mx-auto flex flex-col justify-center min-h-full lg:h-full py-4 lg:py-0 space-y-3.5 sm:space-y-4">

          {/* ══════════════════════════════════════════════════════════════════
              VIEW 1: DIRECT LOGIN VIEW
             ══════════════════════════════════════════════════════════════════ */}
          {viewMode === 'login' && (
            <>
              {/* Header Banner */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Staff Portal Login</h2>
                  <p className="text-[11px] text-slate-500">Sign in to access clinic dashboard or click a role below</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/book')}
                  className="px-3 py-1.5 text-[11px] font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-3 h-3 text-emerald-200" /> Patient Portal
                </button>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="p-2.5 bg-rose-50 text-rose-800 text-[11px] rounded-xl border border-rose-200 font-semibold shadow-xs">
                  {error}
                </div>
              )}

              {/* ── Direct Email & Password Form ── */}
              <form onSubmit={handleLoginSubmit} className="bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-900 mb-1">Staff Email Address</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.test"
                        className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 bg-white text-slate-900 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold text-slate-900">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotSubmitted(false);
                          setViewMode('forgot');
                        }}
                        className="text-[10px] font-semibold text-teal-700 hover:underline cursor-pointer bg-transparent border-none p-0"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-8 pr-8 py-1.5 sm:py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 bg-white text-slate-900 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 sm:py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? 'Authenticating...' : 'Sign In to Practice Dashboard'}
                  {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </form>

              {/* ── Divider ── */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  ⚡ Or One-Click Quick Role Access
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* ── 6 Quick Role Access Cards ── */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleQuickRoleSelect(acc)}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-2 p-2 bg-slate-50/60 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-400 rounded-xl transition-all shadow-2xs text-center sm:text-left group active:scale-98 disabled:opacity-60 cursor-pointer w-full"
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs group-hover:border-teal-500 shrink-0 transition"
                    />
                    <div className="min-w-0 flex-1 w-full">
                      <p className="text-[11px] font-bold text-slate-900 truncate group-hover:text-teal-900 leading-tight">{acc.name}</p>
                      <span className={`inline-block mt-0.5 px-1.5 py-0.2 text-[9px] font-extrabold rounded-full border ${ROLE_COLORS[acc.role] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {acc.role}
                      </span>
                      <p className="text-[9px] text-slate-400 truncate mt-0.5 font-mono hidden sm:block">{acc.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              VIEW 2: IN-PLACE FORGOT PASSWORD VIEW (RIGHT SIDE)
             ══════════════════════════════════════════════════════════════════ */}
          {viewMode === 'forgot' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Back to Login Button */}
              <div>
                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200 transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Staff Login
                </button>
              </div>

              {/* Title & Info */}
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-teal-50 text-teal-700 rounded-lg border border-teal-200">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Reset Your Password</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your registered staff email address to receive password reset instructions.
                </p>
              </div>

              {/* Submitted State vs Form */}
              {forgotSubmitted ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Instructions Dispatched (Demo)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                    Simulated password reset instructions dispatched to <strong className="text-teal-900 font-mono">{forgotEmail}</strong>.
                  </p>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-[11px] text-slate-500 font-mono">
                    Demo Token: <span className="text-emerald-700 font-bold">RST-2026-99182</span> (Valid for 15m)
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewMode('login')}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3.5 shadow-2xs">
                  <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-600 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>For HIPAA compliance, reset tokens expire in 15 minutes.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">Registered Staff Email</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="staff@example.test"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 bg-white text-slate-900 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                    <span>Quick fill:</span>
                    {['admin@example.test', 'doctor@example.test', 'counselor@example.test'].map((demoMail) => (
                      <button
                        key={demoMail}
                        type="button"
                        onClick={() => setForgotEmail(demoMail)}
                        className="px-2 py-0.5 bg-white hover:bg-teal-50 hover:text-teal-700 border border-slate-200 rounded-md font-mono cursor-pointer transition"
                      >
                        {demoMail.split('@')[0]}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
                  >
                    {forgotLoading ? 'Dispatching...' : 'Send Recovery Instructions'}
                    {!forgotLoading && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Bottom Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-teal-600 shrink-0" />
              <span>HIPAA 256-bit Encryption • Demo: demo123</span>
            </div>
            <span>© 2026 F&amp;M Health</span>
          </div>

        </div>
      </div>

    </div>
  );
};
