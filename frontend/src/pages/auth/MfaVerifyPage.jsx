// src/pages/auth/MfaVerifyPage.jsx
import React, { useState } from 'react';
import { mockAuthService } from '../../services/mock/mockAuthService';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const MfaVerifyPage = () => {
  const [pin, setPin] = useState(['1', '2', '3', '4', '5', '6']);
  const [error, setError] = useState('');
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();

  const handlePinChange = (val, idx) => {
    const nextPin = [...pin];
    nextPin[idx] = val;
    setPin(nextPin);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const pinStr = pin.join('');
    const isValid = await mockAuthService.verifyMfa(pinStr);
    if (isValid) {
      const role = currentUser?.role?.toLowerCase()?.replace(/\s+/g, '-') || 'super-admin';
      navigate(`/dashboard/${role}`);
    } else {
      setError('Invalid verification code. Enter 123456 for demo.');
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-2xl max-w-md w-full border border-primary-container text-center">
        <div className="w-12 h-12 rounded-2xl bg-secondary-container/10 border border-secondary-container/30 text-secondary-container flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-bold text-on-surface mb-1">Two-Factor Verification</h2>
        <p className="text-xs text-on-surface-variant mb-6">
          Enter the 6-digit authentication pin code dispatched to your registered device.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-error-container text-on-error-container text-xs rounded-lg font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2">
            {pin.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(e.target.value, idx)}
                className="w-11 h-12 text-center text-lg font-bold rounded-lg border border-outline-variant bg-surface focus:border-secondary-container focus:ring-1 focus:ring-secondary-container"
              />
            ))}
          </div>

          <p className="text-[11px] text-on-surface-variant">
            Demo Pin: <strong className="text-secondary-container">123456</strong>
          </p>

          <button
            type="submit"
            className="w-full py-2.5 bg-secondary-container hover:bg-secondary text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
          >
            Verify Code & Access Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
