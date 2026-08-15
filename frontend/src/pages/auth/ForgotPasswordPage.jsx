// src/pages/auth/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { mockAuthService } from '../../services/mock/mockAuthService';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await mockAuthService.forgotPassword(email);
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-2xl max-w-md w-full border border-primary-container">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1 text-xs font-bold text-secondary-container hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        <h2 className="text-xl font-bold text-on-surface mb-2">Reset Your Password</h2>
        <p className="text-xs text-on-surface-variant mb-6">
          Enter your registered staff email address to receive password reset instructions.
        </p>

        {submitted ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-on-surface">Instructions Dispatched (Demo)</h3>
            <p className="text-xs text-on-surface-variant">
              Simulated reset email sent to <strong className="text-on-surface">{email}</strong>.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-2 w-full py-2 bg-secondary-container text-white text-xs font-bold rounded-lg"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-outline absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.test"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-outline-variant focus:border-secondary-container bg-surface"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-secondary-container hover:bg-secondary text-white font-bold text-xs rounded-lg transition"
            >
              {isLoading ? 'Processing...' : 'Send Reset Instructions'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
