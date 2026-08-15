// src/components/modals/ForgotPasswordModal.jsx
import React, { useState } from 'react';
import { Modal } from './Modal';
import { mockAuthService } from '../../services/mock/mockAuthService';
import { useUIStore } from '../../store/uiStore';
import { KeyRound, Mail, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('admin@example.test');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUIStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await mockAuthService.forgotPassword(email);
      setSubmitted(true);
      addToast(`Password reset link dispatched to ${email}!`, 'success');
    } catch {
      addToast('Failed to request password reset', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Reset Staff Password"
      subtitle="Enter your verified staff email to receive a secure recovery link"
      icon={KeyRound}
      size="md"
      iconColor="text-teal-600"
      iconBg="bg-teal-50"
      footer={
        submitted ? (
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
          >
            Back to Login
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? 'Dispatching...' : 'Send Recovery Link'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </>
        )
      }
    >
      {submitted ? (
        <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Recovery Instructions Dispatched</h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            A temporary password reset token and authentication instructions have been sent to{' '}
            <strong className="text-teal-800 font-mono">{email}</strong>.
          </p>
          <div className="bg-white p-3 rounded-xl border border-emerald-200 text-[11px] text-slate-500 font-mono">
            Demo Token: <span className="text-emerald-700 font-bold">RST-2026-99182</span> (Valid for 15 minutes)
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
            <span>
              For HIPAA security compliance, reset links expire after 15 minutes and can only be used once.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Registered Staff Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@example.test"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 bg-white text-slate-900 outline-none transition"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 pt-1">
            <span>Quick fill:</span>
            {['admin@example.test', 'doctor@example.test', 'counselor@example.test'].map((demoMail) => (
              <button
                key={demoMail}
                type="button"
                onClick={() => setEmail(demoMail)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 rounded-md text-[10px] font-mono cursor-pointer transition"
              >
                {demoMail.split('@')[0]}
              </button>
            ))}
          </div>
        </form>
      )}
    </Modal>
  );
};
